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
}) => {
  if (editMode) {
    return (
      <input
        id={id}
        placeholder={placeholder}
        name={name}
        className={className}
        onChange={onChange}
        type={type}
        value={value}
        style={style}
      />
    );
  }

  return (
    <p
      style={{ ...style, cursor: "default", padding: "0px", height: "13px" }}
      className={className}
    >
      {value}
    </p>
  );
};

export default EditableField;
