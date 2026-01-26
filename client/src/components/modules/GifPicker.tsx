import React from "react";
import { useGifSearch } from "./useGifSearch";
import "./GifPicker.css";

interface GifPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const { gifQuery, gifResults, handleGifSearchChange } = useGifSearch();

  return (
    <div className="gif-picker-container">
      <div className="gif-header">
        <input
          placeholder="Search GIFs..."
          value={gifQuery}
          onChange={handleGifSearchChange}
          autoFocus
        />
        <button onClick={onClose} className="gif-close-btn">
          x
        </button>
      </div>
      <div className="gif-grid">
        {gifResults.map((url, i) => (
          <img key={i} src={url} onClick={() => onSelect(url)} alt="gif option" />
        ))}
      </div>
      <div className="gif-attribution">Powered by Klipy</div>
    </div>
  );
}
