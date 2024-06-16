import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";

export function StyledTextField(props: TextFieldProps): ReactElement {
  return (
    <TextField
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "15px",
          outline: "none",
          bgcolor: "background.default",
          "& fieldset": {
            borderColor: "background.default",
          },
        },
      }}
    />
  );
}
