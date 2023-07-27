import React, { useRef } from "react";
import { Button } from "reactstrap";

export const addCommas = (number) => {
  let numSplit = String(number).split(".");
  let numRes = [];

  if (numSplit.length > 2) {
    console.error("Not a valid number");
    return number;
  }

  let integerPart = numSplit[0];
  let decimalPart = numSplit[1] || "";

  // Ensure decimal part always has two digits
  if (decimalPart.length > 2) {
    decimalPart = decimalPart.slice(0, 2);
  } else if (decimalPart.length === 1) {
    decimalPart += "0";
  } else if (decimalPart.length === 0) {
    decimalPart = "00";
  } else if (decimalPart.length === 3 && decimalPart[2] >= 5) {
    decimalPart = String(Number(decimalPart.slice(0, 2)) + 1);
  }

  for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
    if (count % 3 === 0 && count !== 0) {
      numRes.unshift(",");
    }
    numRes.unshift(integerPart[i]);
  }

  let result = numRes.join("");
  if (decimalPart.length > 0) {
    result += "." + decimalPart;
  }

  return result;
};

export const splitParagraph = (text, maxChars) => {
  if (text === "" || text === null) return "";
  const words = text.split(" ");
  let currentLine = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const newLine = currentLine + (currentLine ? " " : "") + word;

    if (newLine.length <= maxChars) {
      currentLine = newLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const fitImageSize = (width, height, maxWidth, maxHeight) => {
  let newWidth = width;
  let newHeight = height;

  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;

  if (width > maxWidth && height > maxHeight) {
    // Both width and height are larger than the maximum dimensions
    if (widthRatio < heightRatio) {
      newWidth = maxWidth;
      newHeight = Math.floor(height * widthRatio);
    } else {
      newWidth = Math.floor(width * heightRatio);
      newHeight = maxHeight;
    }
  } else if (width > maxWidth) {
    // Only the width is larger than the maximum width
    newWidth = maxWidth;
    newHeight = Math.floor(height * widthRatio);
  } else if (height > maxHeight) {
    // Only the height is larger than the maximum height
    newWidth = Math.floor(width * heightRatio);
    newHeight = maxHeight;
  }

  return { width: newWidth, height: newHeight };
};

export const throttle = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        timeoutId = null;
      }, delay);
    }
  };
};

export const SquareScroll = ({
  cards,
  containerRef,
  scrollLeft,
  scrollRight,
}) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div
        style={{
          backgroundColor: "white",
          fontSize: "14px",
          height: "24px",
          alignSelf: "center",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            zIndex: "3",
            color: "green",
            background: "white",
            borderRadius: "50%",
            opacity: ".9",
            border: "none",
            fontSize: "24px",
            padding: "6px 12px",
          }}
          onClick={scrollLeft}
        >
          &#8592;
        </button>
      </div>

      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          width: "auto",
          gap: "24px", // Set the desired width of the container
          margin: "auto",
          padding: "0 24px", // Add padding to the left and right sides
          boxSizing: "border-box", // Include padding in the width calculation
        }}
        ref={containerRef}
      >
        {cards.map((card, index) => (
          <React.Fragment key={index}>{card}</React.Fragment>
        ))}
        {/* You can use your own buttons or components for left and right scrolling */}
      </div>

      <div
        style={{
          fontSize: "14px",
          height: "24px",
          alignSelf: "center",
          position: "relative",
        }}
      >
        <Button
          style={{
            color: "green",
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translateY(-50%)",
            background: "white",
            borderRadius: "50%",
            opacity: ".9",
            border: "none",
            fontSize: "24px",
            padding: "6px 12px",
          }}
          onClick={scrollRight}
        >
          →
        </Button>
      </div>
    </div>
  );
};
