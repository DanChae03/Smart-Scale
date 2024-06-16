import { Logout } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../pages/App";
import { API_URL } from "../../utils/dbUtils";

interface UserIconProps {
  src?: string;
}

export function UserIcon({ src }: UserIconProps): ReactElement {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const logout = (): void => {
    fetch(`${API_URL}/logout`, {
      credentials: "include",
    }).then(() => {
      navigate("/");
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose: () => void = () => {
    setAnchorElement(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "90px",
        right: "80px",
      }}
    >
      <IconButton onClick={handleClick}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: "50px",
            height: "50px",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          src={src ?? ""}
        />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: "150px",
              borderRadius: "9px",
            },
          },
        }}
      >
        <MenuItem onClick={() => logout()}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography fontWeight="500" variant="body2">
              {language == "English" ? "Log Out" : "Takiputa atu"}
            </Typography>
            <Logout sx={{ height: "24px" }} />
          </Stack>
        </MenuItem>
      </Menu>
    </Box>
  );
}
