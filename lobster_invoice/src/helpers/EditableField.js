import React, { useState } from "react";

const EditableField = ({
  id,
  name,
  placeholder,
  className,
  value,
  onChange,
  type,
  editMode,
  style,
  min,
  max,
  step,
  pattern,
}) => {
  if (editMode) {
    return (
      <input
        id={id}
        placeholder={placeholder}
        name={name}
        className={className}
        onChange={(event) => onChange(event)}
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
      />
    );
  }

  return (
    <p
      style={{ ...style, cursor: "default", padding: "0px" }}
      className={className}
    >
      {value}
    </p>
  );
};
const EditableTextArea = ({
  id,
  name,
  placeholder,
  className,
  value,
  onChange,
  type,
  editMode,
  style,
}) => {
  if (editMode) {
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        name={name}
        className={className + " " + "text-area"}
        onChange={onChange}
        type={type}
        value={value}
        style={style}
      />
    );
  }

  const displayValue = value
    ? value.split("\n").map((line, index) => <p key={index}>{line}</p>)
    : value;

  return <p style={{ marginBottom: "0" }}>{displayValue || ""}</p>;
};

export default EditableField;
export { EditableTextArea };
