import React from "react";

function SelectField(props) {
  const {
    type,
    label,
    field,
    form,
    options,
    className,
    placeholder,
    ref,
    required,
    ...otherProps
  } = props;
  const { onChange, onBlur, value, name } = field || {};
  const { errors, touched } = form || {};

  const errMessage = errors[field.name];
  const isShowErrMessage = errors[field.name] && touched[field.name];

  let items = "";
  items = options?.map((item, index) => {
    return (
      <option key={index} value={item.value} label={item.name}>
        {item.name}
      </option>
    );
  });

  //! Render
  return (
    <div style={{ height: "95px" }}>
      {!!label && (
        <label className="d-flex mb-2" htmlFor={name}>
          {label}
          {required && (
            <span style={{ color: "red", fontWeight: "inherit" }}>(*)</span>
          )}
          :
        </label>
      )}
      <select
        name={name}
        className={className}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{ display: "block" }}
        {...otherProps}
      >
        <option value={""}></option>
        {items}
      </select>
      {isShowErrMessage ? (
        <div style={{ color: "red", margin: "0", fontSize: "13px" }}>
          {errMessage}
        </div>
      ) : null}
    </div>
  );
}

export default SelectField;
