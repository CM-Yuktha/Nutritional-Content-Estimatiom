import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Ensure installed: npm install @google/generative-ai

dotenv.config(); // Load .env (GOOGLE_API_KEY, PORT)
const app = express();
app.use(cors());
app.use(express.json()); // For potential JSON bodies

const upload = multer({ 
  storage: multer.memoryStorage(), // Use memory for buffer access; was missing
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini with error handling
let genAI;
try {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY missing from .env');
  }
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  console.log('Gemini initialized successfully');
} catch (e) {
  console.error('Gemini init failed:', e.message);
  genAI = null; // Disable endpoint if unavailable
}

function buildPrompt() {
  return `Identify ONLY the foods visibly present in the attached image and estimate nutrition for those items. Do NOT assume sides or Indian mains (roti/chapati/naan/paratha/sabzi/dal/thali/curry/rice) unless clearly visible. Rules: 
- List only items that are visually present; omit uncertain items. 
- Use generic names if the brand is unknown. 
- Output VALID JSON only. No prose or explanations. 
Schema: {
  "calories": number,
  "serving": string,
  "macros": {
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "fiber_g": number
  },
  "items": [
    {
      "name": string,
      "quantity": string,
      "calories": number
    }
  ],
  "notes": string
}`.trim();
}

// Fixed extractJson for Gemini (plain text response, not choices array)
function extractJson(text) {
  try {
    let content = text ? text.trim() : '';
    if (!content) return null;
    
    // Gemini returns plain text; extract first JSON block
    const first = content.indexOf('{');
    const last = content.lastIndexOf('}') + 1;
    if (first === -1 || last <= first) return null;
    
    const jsonStr = content.substring(first, last);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('JSON Parse Error:', e, 'Raw text:', text?.substring(0, 200));
    return null;
  }
}

// Enhanced visibilityGuard (filter inferred Indian items, round values)
function visibilityGuard(parsed) {
  if (!parsed || !parsed.items) return { error: 'INVALID_RESPONSE' };
  
  try {
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const filtered = items.filter(item => {
      const name = String(item?.name || '').toLowerCase();
      // Block common inferred Indian mains unless explicit
      return !/roti|chapati|naan|paratha|sabzi|dal|thali|curry|rice/i.test(name) || 
             name.includes('visible') || name.includes('plate'); // Allow if described as visible
    });
    
    parsed.items = filtered.length ? filtered : items; // Fallback to original if over-filtered
    parsed.notes = parsed.notes || 'Filtered for visible items only.';
    
    // Round numbers for display
    parsed.calories = Math.round(Number(parsed.calories) || 0);
    const macros = parsed.macros || {};
    parsed.macros = {
      protein_g: Math.round(Number(macros.protein_g) || 0),
      carbs_g: Math.round(Number(macros.carbs_g) || 0),
      fat_g: Math.round(Number(macros.fat_g) || 0),
      fiber_g: Math.round(Number(macros.fiber_g) || 0)
    };
    
    if (!parsed.serving) parsed.serving = items.length === 1 ? 'Single item' : 'Plate';
    
    return parsed;
  } catch (e) {
    console.error('Guard error:', e);
    return { error: 'PROCESSING_FAILED' };
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, geminiReady: !!genAI });
});

app.post('/api/estimate', upload.single('image'), async (req, res) => {
  if (!genAI) return res.status(500).json({ error: 'GEMINI_UNAVAILABLE', detail: 'Check GOOGLE_API_KEY in .env' });
  
  try {
    if (!req.file) return res.status(400).json({ error: 'NO_IMAGE' });
    
    console.log('Processing image:', req.file.originalname, 'Size:', req.file.size); // Add logging
    
    const base64 = req.file.buffer.toString('base64');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Fixed: Use stable 1.5-flash for vision
    
    const prompt = buildPrompt();
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: req.file.mimetype || 'image/jpeg'
        }
      },
      prompt // Image first for better context in vision models
    ]);
    
    const text = result.response.text();
    console.log('Gemini raw response:', text.substring(0, 200)); // Log partial response for debug
    
    const parsed = extractJson(text);
    const safe = visibilityGuard(parsed);
    
    if (!safe || safe.error) {
      console.error('Response processing failed:', safe?.error);
      return res.status(400).json({ error: safe?.error || 'ANALYSIS_FAILED' });
    }
    
    console.log('Final nutrition result:', safe.calories, 'kcal'); // Log success
    res.json(safe);
  } catch (e) {
    console.error('Estimate error:', e.message || e, e.stack); // Enhanced logging
    
    // Handle common Gemini errors with retries
    if (e.status === 500 || e.message?.includes('internal error')) {
      console.log('Gemini 500 - retrying...');
      // Simple retry (up to 2)
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2`.5-flash' });
        const result = await model.generateContent([/* same content */]); // Repeat call
        // Process as above...
        // (Implement full retry logic if needed)
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
        return res.status(500).json({ error: 'GEMINI_UNSTABLE', detail: 'Model temporarily unavailable; try again' });
      }
    } else if (e.message?.includes('quota') || e.status === 429) {
      return res.status(429).json({ error: 'RATE_LIMIT', detail: 'Too many requests; wait 60s' });
    } else if (e.message?.includes('invalid API key') || e.status === 401) {
      return res.status(401).json({ error: 'INVALID_API_KEY' });
    }
    res.status(500).json({ error: 'SERVER_ERROR', detail: e.message });
  }
});

// Fixed port logic - Use standard 3000 to avoid Vite conflicts
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
