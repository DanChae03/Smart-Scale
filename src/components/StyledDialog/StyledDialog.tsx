import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";

interface StyledDialogProps {
  title: string;
  children: ReactElement;
  open: boolean;
  handleChange: () => void;
}

export function StyledDialog({
  title,
  children,
  open,
  handleChange,
}: StyledDialogProps): ReactElement {
  return (
    <Dialog open={open} PaperProps={{ sx: { borderRadius: "9px" } }}>
      <Stack spacing="18px" paddingX="54px" paddingY="36px">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" sx={{ color: "primary.dark" }}>
            {title}
          </Typography>
          <IconButton
            onClick={() => handleChange()}
            sx={{
              color: "secondary.dark",
              width: "45px",
              height: "45px",
            }}
          >
            <Close />
          </IconButton>
        </Stack>
        {children}
      </Stack>
    </Dialog>
  );
}
