import React from "react";

// const CustomTextArea = styled(TextareaAutosize)(({ theme }) => {
//   return {
//     borderRadius: theme.custom.borderRadius.input_8,
//     borderColor: theme.custom.colors.grayborder,
//     padding: theme.custom.padding.paddingInput,
//     maxWidth: "100%",
//     minWidth: "100%",
//     "&:focus": {
//       outline: "none",
//       border: `2px solid ${theme.custom.colors.lightblue}`,
//     },
//   };
// });

// const useStyles = makeStyles((theme) => {
//   return {
//     rootInput: {
//       display: "flex",
//       flexDirection: "column",

//       "& > label": {
//         marginBottom: 8,
//         fontWeight: 600,
//       },
//       "& > span": {
//         color: "red",
//         fontSize: "0.75rem",
//         margin: "3px 14px 0",
//       },
//     },
//     labelHeaderColorPrimary: {
//       color: `${theme.custom.colors.darkblue} !important`,
//     },
//   };
// });

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

  //! Render
  return (
    <div style={{ height: 102 + 24 * Number(rows - 1) }}>
      {!!label && (
        <label className="d-flex mb-2" htmlFor={name}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}:
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
      {errors[field.name] && touched[field.name] ? (
        <div style={{ color: "red", margin: "0", fontSize: "13px" }}>
          {errors[field.name]}
        </div>
      ) : null}
    </div>
  );
};

export default TextAreaField;
