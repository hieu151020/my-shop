import React from "react";

function InputField(props) {
  const {
    type,
    label,
    field,
    className,
    form,
    required,
    placeholder,
    ref,
    style,
    disable,
    labelStyle,
    ...otherProps
  } = props;
  const { onChange, onBlur, value, name } = field || {};
  const { errors, touched } = form || {};

  const errMessage = errors[field.name];
  const isShowErrMessage = errors[field.name] && touched[field.name];

  //! Render
  return (
    <div style={{ height: "95px" }} className="input-wrapper">
      {!!label && (
        <label
          className={"d-flex mb-2"}
          style={{ color: labelStyle }}
          htmlFor={name}
        >
          {label}
          {required && (
            <span style={{ color: "red", fontWeight: "inherit" }}>(*)</span>
          )}
          :
        </label>
      )}
      <input
      className={className}
        onChange={props?.onChange || onChange}
        onBlur={props?.onBlur || onBlur}
        label={label}
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disable}
        ref={ref}
        style={style}
        {...otherProps}
      />
      {isShowErrMessage ? (
        <div style={{ color: "red", margin: "0", fontSize: "13px" }}>
          {errMessage}
        </div>
      ) : null}
    </div>
  );
}

export default InputField;
