import { ReactElement, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Add,
  Assessment,
  Chat,
  EditCalendar,
  People,
} from "@mui/icons-material";
import { LanguageContext } from "../../pages/App";

const iconStyles = {
  marginRight: "27px",
};

interface IconProps {
  title: string;
}

interface StyledTabProps {
  title: string;
  selected: boolean;
  maoriTitle: string;
}

const Icon = ({ title }: IconProps): ReactElement => {
  switch (title) {
    case "Bookings":
      return <EditCalendar sx={iconStyles} />;
    case "Add Booking":
      return <Add sx={iconStyles} />;
    case "Statistics":
      return <Assessment sx={iconStyles} />;
    case "Messages":
      return <Chat sx={iconStyles} />;
    case "Users":
      return <People sx={iconStyles} />;
    default:
      return <></>;
  }
};

export function StyledTab({
  title,
  selected,
  maoriTitle,
}: StyledTabProps): ReactElement {
  const { language } = useContext(LanguageContext);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="80%"
      height="100%"
      sx={{
        bgcolor: selected ? "primary.main" : "none",
        color: selected ? "background.paper" : "secondary.dark",
        boxShadow: selected ? "0px 4px 6px rgba(0, 0, 0, 0.2)" : "none",
        borderRadius: "15px",
        "&:hover": {
          bgcolor: selected ? "primary.dark" : "background.default",
          boxShadow: selected ? "0px 4px 10px rgba(0, 0, 0, 0.4)" : "none",
        },
      }}
    >
      <Box display="flex" flexDirection="row" width="180px">
        <Icon title={title} />
        <Typography
          fontWeight={selected ? "auto" : 500}
          textTransform="none"
          sx={{ color: selected ? "background.paper" : "secondary.dark" }}
        >
          {language == "English" ? title : maoriTitle}
        </Typography>
      </Box>
    </Box>
  );
}
