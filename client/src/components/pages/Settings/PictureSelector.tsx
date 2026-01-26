import React from "react";
import "./PictureSelector.css";
interface Props {
  onPictureChange: (url: string) => void;
  currentUrl: string;
}

export default function PictureSelector({ onPictureChange, currentUrl }: Props) {
  const openGallery = () => {
    window.open("https://postimages.org/", "_blank");
  };

  return (
    <div className="picture-selector">
      <button type="button" onClick={openGallery}>
        Find a sleek avatar!
      </button>
      <input
        type="text"
        placeholder="Paste image URL here"
        value={currentUrl}
        onChange={(e) => onPictureChange(e.target.value)}
      />
      {currentUrl && <img src={currentUrl} alt="Preview" className="sleek-preview" />}
    </div>
  );
}
