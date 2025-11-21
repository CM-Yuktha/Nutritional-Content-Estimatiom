import React, { useState, useRef, useEffect } from 'react';
import ImageUploader from '../ImageUploader/ImageUploader.jsx';
import { resizeImage } from '../../utils/resizeImage.js';
import './Estimate.css';

// Remove hardcoded API_BASE - use relative path for proxy
// If needed for non-proxy envs: const API_BASE = import.meta.env.VITE_API_BASE_URL || '';


// SINGLE NutritionResult COMPONENT (no duplicates)
const NutritionResult = ({ result }) => {
  if (!result) return null;
  const { calories, macros, serving, items, notes } = result;
  const itemsTotal = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.calories || 0), 0) : 0;
  const dv = { protein: 50, carbs: 275, fat: 78, fiber: 28 };
  
  return (
    <div className="est-result">
      {/* Header */}
      <div className="est-result-header">
        <div>
          <h3 className="est-result-title">Estimated Nutrition</h3>
          <p className="est-result-sub">{serving || 'Single item'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="est-result-cal-num">{Math.round(calories)}</span>
          <span className="est-result-cal-label">kcal</span>
        </div>
      </div>
      
      {/* Macros Table */}
      <table className="est-macros-table">
        <thead>
          <tr>
            <th>Macro</th>
            <th>Amount</th>
            <th>%DV</th>
            <th>Cal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Protein</td>
            <td><strong>{macros?.protein_g ?? 0} g</strong></td>
            <td>{Math.round(((macros?.protein_g ?? 0) / dv.protein) * 100)}%</td>
            <td>{Math.round((macros?.protein_g ?? 0) * 4)}</td>
          </tr>
          <tr>
            <td>Carbs</td>
            <td><strong>{macros?.carbs_g ?? 0} g</strong></td>
            <td>{Math.round(((macros?.carbs_g ?? 0) / dv.carbs) * 100)}%</td>
            <td>{Math.round((macros?.carbs_g ?? 0) * 4)}</td>
          </tr>
          <tr>
            <td>Fat</td>
            <td><strong>{macros?.fat_g ?? 0} g</strong></td>
            <td>{Math.round(((macros?.fat_g ?? 0) / dv.fat) * 100)}%</td>
            <td>{Math.round((macros?.fat_g ?? 0) * 9)}</td>
          </tr>
          <tr>
            <td>Fiber</td>
            <td><strong>{macros?.fiber_g ?? 0} g</strong></td>
            <td>{Math.round(((macros?.fiber_g ?? 0) / dv.fiber) * 100)}%</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      
      {/* Items Table */}
      {Array.isArray(items) && items.length > 0 && (
        <div className="est-result-items-table">
          <h4 className="est-result-heading">Detected Ingredients</h4>
          <table className="est-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.quantity ?? 'Standard serving'}</td>
                  <td>
                    {item.calories != null
                      ? <span className="cal-badge">{Math.round(item.calories)} kcal</span>
                      : <span className="cal-unknown">N/A</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="est-items-summary">
            <span className="items-count">{items.length} detected</span>
            <span className="items-total">{Math.round(itemsTotal)} kcal from items</span>
          </div>
        </div>
      )}
      
      {/* Notes */}
      {notes && <div className="est-result-notes">{notes}</div>}
    </div>
  );
};

export default function Estimate() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Camera integration
  const [showCamera, setShowCamera] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // COMPLETE handleImageUpload function - Use relative path for proxy
  const handleImageUpload = async (file) => {
    setUploadedImage(URL.createObjectURL(file));
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Compress image before upload
      const compressedFile = await resizeImage(file, 768, 0.8);
      const form = new FormData();
      form.append('image', compressedFile);

      // Use relative path: Vite proxy forwards /api/estimate to http://localhost:3000/api/estimate
      const res = await fetch('/api/estimate', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        let message = `Server error ${res.status}`;
        try {
          const j = await res.json();
          if (res.status === 429) {
            message = 'Service busy (rate limit). Retry shortly.';
          } else {
            message = j?.error || j?.detail || message;
          }
        } catch {
          // Not JSON, keep generic message
        }
        setError(message);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Upload error:', e);
      setError('Failed to estimate nutrition. Try another photo.');
    } finally {
      setLoading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    setVideoReady(false);

    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: 'environment' }, // Back camera preferred
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow permissions and retry.'
          : err.name === 'NotFoundError'
          ? 'No camera found. Please connect a device.'
          : 'Camera unavailable. Use upload instead.'
      );
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setVideoReady(false);
  };

  // Video readiness check
  useEffect(() => {
    if (showCamera && videoRef.current) {
      const video = videoRef.current;
      video.onloadedmetadata = () => setVideoReady(true);
      video.onloadeddata = () => setVideoReady(true);
      
      // Also check dimensions periodically
      const checkDimensions = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setVideoReady(true);
        }
      };
      
      const interval = setInterval(checkDimensions, 100);
      return () => clearInterval(interval);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onloadeddata = null;
      }
    };
  }, [showCamera]);

  // Capture photo
  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Video not ready for capture');
      return;
    }

    // Create capture
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to file
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Canvas toBlob failed');
        return;
      }
      
      const file = new File([blob], 'captured-food.jpg', { type: 'image/jpeg' });
      const compressedFile = await resizeImage(file, 768, 0.8);
      handleImageUpload(compressedFile);
      stopCamera();
    }, 'image/jpeg', 0.8);
  };

  const toggleCamera = () => {
    if (showCamera) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <section className="container estimate">
      <h1 className="estimate-title">Food Image Estimator</h1>
      <p className="estimate-sub">
        Upload or capture a food photo for nutrition analysis. Model reports only visible items.
      </p>

      {/* Drag/Drop Upload Section */}
      {!showCamera && (
        <div className="upload-section">
          <ImageUploader onUpload={handleImageUpload} disabled={loading} />
          <button
            onClick={toggleCamera}
            className="btn btn-secondary"
            disabled={loading}
            style={{ marginTop: '16px' }}
          >
            📷 Capture with Camera
          </button>
        </div>
      )}

      {/* Camera Section */}
      {showCamera && (
        <div className="camera-section">
          <video
            ref={videoRef}
            className="camera-preview"
            autoPlay
            playsInline
            muted
            style={{ 
              width: '100%', 
              maxWidth: '520px', 
              borderRadius: '12px',
              display: videoReady ? 'block' : 'none'
            }}
            onLoadedMetadata={() => setVideoReady(true)}
          />
          {showCamera && !videoReady && (
            <div className="camera-loading">
              <span>Loading camera...</span>
            </div>
          )}
          <div className="camera-controls">
            <button 
              onClick={capturePhoto} 
              className={`btn btn-primary ${videoReady ? 'btn-camera-ready' : ''}`} 
              disabled={!videoReady}
            >
              📸 Capture Photo
            </button>
            <button 
              onClick={toggleCamera} 
              className="btn btn-secondary" 
              style={{ marginLeft: '12px' }}
            >
              Cancel Camera
            </button>
          </div>
          {/* FIXED: Proper canvas tag */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {/* Status/Error Display */}
      {loading && <div className="est-status">Analyzing image...</div>}
      {error && <div className="est-error">{error}</div>}
      {cameraError && <div className="est-error">{cameraError}</div>}

      {/* Preview and Results */}
      {uploadedImage && !loading && (
        <div className="est-preview">
          <img src={uploadedImage} alt="Uploaded preview" />
        </div>
      )}
      {!loading && result && <NutritionResult result={result} />}
    </section>
  );
}
