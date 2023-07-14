import React, { useState } from "react";
import { Label, Input, Button } from "reactstrap";
import LobsterApi from "../API/api";

const Logo = ({ imagePreview, setImagePreview, editMode, user, values }) => {
  function previewImage(event) {
    const imgD = event.target.files[0];

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
        console.log("readasdataurl", reader.readAsDataURL(imgD));
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
  // function handleSave() {
  //   if (imagePreview) {
  //     const reader = new FileReader();
  //     reader.onload = function (event) {
  //       const fileData = new Uint8Array(event.target.result);

  //       // Convert to bytea format
  //       const bytea =
  //         "\\x" +
  //         fileData.reduce(
  //           (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
  //           ""
  //         );

  //       // Send the bytea data to the server for saving
  //       LobsterApi.saveInvoice(user.id, { ...values, logo: bytea });
  //     };

  //     reader.readAsArrayBuffer(imagePreview);
  //   }
  // }

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
          {/* <Button onClick={handleSave}> Save Logo </Button> */}
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
