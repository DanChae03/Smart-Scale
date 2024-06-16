import { Language } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { ReactElement, useContext, useState } from "react";
import { StyledDialog } from "../StyledDialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LanguageContext } from "../../pages/App";

export function Languages(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "60px",
        right: "60px",
      }}
    >
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "primary.main",
          border: "1px solid white",
        }}
      >
        <Language sx={{ color: "background.paper" }} />
      </IconButton>
      <StyledDialog
        open={open}
        title={language == "English" ? "Select Language" : "Tipakohia te Reo"}
        handleChange={() => setOpen(false)}
        children={
          <Select
            value={language}
            onChange={(event) => {
              if (event.target.value != null) {
                setLanguage(event.target.value);
              }
            }}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Maori">Te Reo Maori</MenuItem>
          </Select>
        }
      />
    </Box>
  );
}
