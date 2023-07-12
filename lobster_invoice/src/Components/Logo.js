import React, { useState } from "react";
import { Label, Input } from "reactstrap";

const Logo = ({ imagePreview, setImagePreview, editMode }) => {
  function previewImage(event) {
    const imgD = event.target.files[0];
    console.log("imgD", imgD);
    const reader = new FileReader();

    // PREVIEW
    reader.addEventListener("load", function () {
      setImagePreview(reader.result);
      console.log("IMAGE PREVIEW", reader.result);
    });

    // CHECK IF THERE IS SELECTION
    if (imgD) {
      // CHECK IF THE FILE IS AN IMAGE
      if (
        imgD.type === "image/jpeg" ||
        imgD.type === "image/jpg" ||
        imgD.type === "image/gif" ||
        imgD.type === "image/png"
      ) {
        // errorMessage.innerText = "";

        // CONVERTS FILE TO BASE 64
        reader.readAsDataURL(imgD);
      } else {
        // errorMessage.innerText = "File type should be an image";
        setImagePreview("");
      }
    }
    // IF NO IMAGE
    else {
      setImagePreview("");
      // errorMessage.innerText = "Please select a picture";
    }
  }
  if (editMode) {
    return (
      <>
        <div>
          <Label style={{}} htmlFor="file">
            Logo
          </Label>
          <Input
            type="file"
            name="logo"
            accept="image/*"
            onChange={previewImage}
          />
          {imagePreview !== "" && (
            <img src={imagePreview} alt="Preview" width="200px" />
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          {/* <label htmlFor="logo">Logo</label> */}
          {imagePreview !== "" && (
            <img src={imagePreview} alt="Preview" width="150px" />
          )}
        </div>
      </>
    );
  }
};

export default Logo;
