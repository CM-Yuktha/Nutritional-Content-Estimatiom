import React, { useRef, useState, useCallback } from 'react';
import { resizeImage } from '../../utils/resizeImage';
import './ImageUploader.css';

export default function ImageUploader({ onUpload, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pickFile = () => !disabled && inputRef.current?.click();

  const handleFiles = useCallback(async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    const resized = await resizeImage(file, 768, 0.82);
    onUpload?.(resized);
  }, [onUpload]);

  const onChange = async (e) => {
    await handleFiles(e.target.files);
    e.target.value = '';
  };

  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); if (!disabled) setDragOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const onDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    if (!disabled && e.dataTransfer?.files?.length) await handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="drop">
      <div
        className={`drop__zone ${dragOver ? 'is-over' : ''} ${disabled ? 'is-disabled' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload image by drag and drop or press Enter to browse"
        onClick={pickFile}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFile()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <svg className="drop__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v12.17l3.59-3.58L17 13l-5 5-5-5 1.41-1.41L11 15.17V3h1zM5 19h14v2H5z" fill="currentColor"/>
        </svg>
        <p className="drop__title">Drag & drop a photo</p>
        <p className="drop__hint">or click to browse</p>
        <input ref={inputRef} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
      </div>
    </div>
  );
}