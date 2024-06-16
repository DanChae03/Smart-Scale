import { ReactElement } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { ExpandMore } from "@mui/icons-material";

interface StyledAccordionProps {
  title: string;
  body: ReactElement;
}

export function StyledAccordion({
  title,
  body,
}: StyledAccordionProps): ReactElement {
  const DropdownIcon = (): ReactElement => {
    return (
      <ExpandMore
        sx={{
          bgcolor: "primary.main",
          color: "background.paper",
          borderRadius: "50%",
        }}
      />
    );
  };
  return (
    <Accordion
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
      }}
    >
      <AccordionSummary expandIcon={<DropdownIcon />} sx={{ marginY: "18px" }}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{body}</AccordionDetails>
    </Accordion>
  );
}
