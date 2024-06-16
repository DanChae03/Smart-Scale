import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import { ReactElement } from "react";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

interface DataEntryProps {
  inputAdornment: ReactElement;
  heading: string;
  subtitle: string;
  onClick?: () => void;
  size?: string;
}

export function DataEntry({
  inputAdornment,
  heading,
  subtitle,
  onClick,
  size = "150px",
}: DataEntryProps): ReactElement {
  return (
    <Card
      sx={{
        bgcolor: "background.default",
        width: "100%",
        minHeight: size,
        boxShadow: "none",
        borderRadius: "15px",
      }}
    >
      <CardActionArea
        sx={{ minHeight: size, paddingX: "45px" }}
        onClick={onClick}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing="36px">
            {inputAdornment}
            <Stack spacing="5px">
              <Typography fontSize="21px">{heading}</Typography>
              <Typography
                variant="caption"
                maxHeight="30px"
                textOverflow="ellipsis"
                overflow="hidden"
                sx={{ color: "secondary.main" }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </Stack>
          <ChevronRight
            sx={{
              bgcolor: "primary.main",
              color: "background.paper",
              borderRadius: "50%",
            }}
          />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
