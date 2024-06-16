import { ReactElement, useState } from "react";
import { Message as MessageType } from "../../utils/types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { CardActionArea } from "@mui/material";

interface MessageProps {
  message?: MessageType;
  isAuthor?: boolean;
}

export function MessageBubble({
  message,
  isAuthor = false,
}: MessageProps): ReactElement {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Stack
      direction={isAuthor ? "row" : "row-reverse"}
      justifyContent="flex-end"
      spacing="5px"
    >
      <Typography
        variant="caption"
        sx={{
          alignSelf: "flex-end",
          color: "secondary.main",
        }}
      >
        {`${
          message?.dateCreated != null && hover
            ? `${message.author} ${dayjs(message?.dateCreated).format(
                "h:mma, MMM D"
              )}`
            : message?.dateCreated != null
            ? dayjs(message?.dateCreated).format("h:mm  a")
            : "Sending..."
        }`}
      </Typography>
      <Card
        sx={{
          maxWidth: "600px",
          bgcolor: isAuthor ? "primary.dark" : "secondary.main",
          borderRadius: "18px",
        }}
      >
        <CardActionArea
          sx={{ px: "18px", py: "6px" }}
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
        >
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{ color: "background.paper", wordBreak: "break-word" }}
          >
            {message?.content}
          </Typography>
        </CardActionArea>
      </Card>
    </Stack>
  );
}
