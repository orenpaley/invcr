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
