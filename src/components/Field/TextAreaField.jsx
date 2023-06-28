import React from "react";

const TextAreaField = (props) => {
  //! State

  const {
    disabled,
    onKeyDown,
    className,
    size,
    rows,
    field,
    form,
    label,
    placeholder,
    required,
  } = props;

  const { onChange, onBlur, value, name } = field;
  const { errors, touched } = form || {};

  const errMessage = errors[field.name];
  const isShowErrMessage = errors[field.name] && touched[field.name];

  //! Render
  return (
    <div style={{ height: 102 + 24 * Number(rows - 1) }}>
      {!!label && (
        <label className="d-flex mb-2" htmlFor={name}>
          {label}
          {required && (
            <span style={{ color: "red", fontWeight: "inherit" }}>(*)</span>
          )}
          :
        </label>
      )}
      <textarea
        className={className}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        rows={rows}
        value={value}
        disabled={disabled}
        onKeyDown={onKeyDown}
        size={size}
        placeholder={placeholder}
      />
      {isShowErrMessage ? (
        <div style={{ color: "red", margin: "0", fontSize: "13px" }}>
          {errMessage}
        </div>
      ) : null}
    </div>
  );
};

export default TextAreaField;
