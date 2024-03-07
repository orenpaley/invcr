import React, { useState } from "react";
import { fitImageSize } from "../helpers/helpers";

const Logo = ({ imagePreview, setImagePreview, editMode }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const dimensions = {
            width: img.width,
            height: img.height,
          };
          console.log("img dimensisons", dimensions);
          setImagePreview({
            file,
            previewURL: event.target.result,
            dimensions,
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview({});
    }
  };

  return (
    <div className="logo-importer">
      {editMode ? (
        <div>
          <p>
            <strong>Logo Importer</strong>
          </p>
          <input type="file" onChange={handleImageChange} />
          {imagePreview && (
            <div>
              <img
                src={imagePreview.previewURL}
                width="250px"
                alt="Logo Preview"
              />
              <p>File Name: {imagePreview.file.name || "no file"}</p>
              <p>File Size: {imagePreview.file.size || "no file"} bytes</p>
              <p>
                Dimensions: {imagePreview.dimensions.width} x{" "}
                {imagePreview.dimensions.height}
              </p>
            </div>
          )}
          {/* <button onClick={handleEditModeToggle}>Cancel</button> */}
        </div>
      ) : (
        <div>
          {imagePreview && (
            <div>
              <img
                src={imagePreview.previewURL}
                width="250px"
                alt="Logo Preview"
              />
            </div>
          )}
          {!imagePreview && (
            <div>
              <p>No logo selected.</p>
            </div>
          )}
          {/* <button onClick={handleEditModeToggle}>Edit</button> */}
        </div>
      )}
    </div>
  );
};

export default Logo;
