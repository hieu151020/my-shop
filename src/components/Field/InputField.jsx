import React from "react";

function InputField(props) {
  const {
    type,
    label,
    field,
    form,
    required,
    placeholder,
    variant,
    ref,
    style,
    ...otherProps
  } = props;
  const { onChange, onBlur, value, name } = field || {};
  const { errors, touched } = form || {};

  const errMessage = errors[field.name];
  const isShowErrMessage = errors[field.name] && touched[field.name];

  //! Render
  return (
    <div style={{ height: "95px" }}>
      {!!label && (
        <label className="d-flex mb-2" htmlFor={name}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}:
        </label>
      )}
      <input
        // onChange={props?.onChange || onChange}
        onChange={onChange}
        onBlur={props?.onBlur || onBlur}
        label={label}
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        ref={ref}
        style={style}
        // helperText={
        //   touched[field.name] &&
        //   errors[field.name] && (
        //     <p style={{ color: "red", margin: "0", fontSize: "10px" }}>
        //       {errors[field.name]}
        //     </p>
        // )
        // }
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
