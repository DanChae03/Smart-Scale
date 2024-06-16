import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactElement } from "react";

interface StyledButtonProps {
  text?: string;
  children?: ReactElement;
  onClick: () => void;
  disabled?: boolean;
  error?: boolean;
  size?: string;
}

export function StyledButton({
  text,
  children,
  onClick,
  disabled = false,
  error = false,
  size = "80px",
}: StyledButtonProps): ReactElement {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      fullWidth
      sx={{
        bgcolor: error ? "error.main" : "primary.main",
        height: size,
        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "15px",
        "&:hover": {
          bgcolor: error ? "error.dark" : "primary.dark",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {text != null ? (
        <Typography textTransform="none" color="background.paper">
          {text}
        </Typography>
      ) : (
        <> {children}</>
      )}
    </Button>
  );
}
