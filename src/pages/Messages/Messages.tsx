import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { CurrentUser, Message, Query } from "../../utils/types";
import { DataEntry } from "../../components/DataEntry";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Switch,
} from "@mui/material";
import dayjs from "dayjs";
import {
  Add,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Send,
} from "@mui/icons-material";
import { MessageBubble } from "../../components/Message";
import { StyledTextField } from "../../components/StyledTextField";
import { StyledDialog } from "../../components/StyledDialog";
import { StyledButton } from "../../components/StyledButton";
import { LanguageContext } from "../App";
import { API_URL } from "../../utils/dbUtils";

interface MessageProps {
  user: CurrentUser | null;
}

export function Messages({ user }: MessageProps): ReactElement {
  const [page, setPage] = useState<number>(0);
  const [queries, setQueries] = useState<Query[]>([]);
  const [lastPage, setLastPage] = useState<number>(-1);
  const [resolved, setResolved] = useState<boolean>(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isMessage, setIsMessage] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [newQuery, setNewQuery] = useState<string>("");
  const [newQueryLoading, setNewQueryLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    getMessages();
  }, [page, resolved]);

  const getMessages = (): void => {
    fetch(
      `${API_URL}/api/communication${
        !user?.roles?.includes("ADMIN") && user?.roles?.includes("NURSE")
          ? "/nurse"
          : ""
      }?resolved=${resolved}&page=${page}&size=4`,
      {
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.length === 0 && page > 0) {
          setLastPage(page);
          setPage(page - 1);
        } else {
          setQueries(data);
        }
        setHasSearched(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendMessage = (): void => {
    const messageText = text;
    const newMessages = selectedQuery?.messages;
    newMessages?.push({
      content: messageText,
      author: `${user?.firstName} ${user?.lastName}`,
    } as Message);
    setSelectedQuery({ ...selectedQuery, messages: newMessages });
    setText("");
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `${API_URL}/api/communication/${selectedQuery?.id}?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ content: messageText }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setSelectedQuery(data);
            scrollToBottom();
          })
      )
      .catch((error) => {
        console.error(error);
      });
  };

  const resolveQuery = (): void => {
    setLoading(true);
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          handleResult("Query Resolved.", false);
        } else {
          throw new Error();
        }
        return response.json();
      })
      .then((data) =>
        fetch(
          `${API_URL}/api/communication/resolve/${selectedQuery?.id}?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(() => {
          setLoading(false);
          handleBack();
        })
      )
      .catch((error) => {
        handleResult("Error resolving Query", true);
        setLoading(false);
        console.error(error);
      });
  };

  const createNewQuery = (): void => {
    setNewQueryLoading(true);
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          handleResult("Successfully created new Query.", false);
        } else {
          throw new Error();
        }
        return response.json();
      })
      .then((data) =>
        fetch(`${API_URL}/api/communication/new?_csrf=${data.token}`, {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({ content: newQuery }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            setNewQueryLoading(false);
            setOpen(false);
            return response.json();
          })
          .then((data) => {
            setSelectedQuery(data);
            setIsMessage(true);
            setNewQuery("");
          })
      )
      .catch((error) => {
        handleResult("Error creating new Query.", true);
        setNewQueryLoading(false);
        console.error(error);
      });
  };

  const handlePage = (forward: boolean) => {
    if (forward) {
      setPage(page + 1);
    } else {
      setPage(page - 1);
    }
  };

  const handleBack = () => {
    setIsMessage(false);
    setSelectedQuery(null);
    getMessages();
  };

  const handleResult = (message: string, error: boolean): void => {
    setError(error);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && text.trim()) {
      sendMessage();
    }
  };

  const handleKeyDownQuery = (e: { key: string }) => {
    if (e.key === "Enter" && newQuery.trim()) {
      createNewQuery();
    }
  };

  const scrollToBottom = () => {
    const element = document.getElementsByClassName("scrollableMessages");
    element[0].scrollTop = element[0].scrollHeight;
  };

  return (
    <>
      {isMessage && selectedQuery ? (
        <Stack paddingX="80px" spacing="18px" height="100%">
          <Stack direction="row" alignItems="center">
            <IconButton
              onClick={() => handleBack()}
              sx={{ color: "primary.main" }}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Typography variant="h5" sx={{ color: "primary.dark" }}>
              {selectedQuery.author === `${user?.firstName} ${user?.lastName}`
                ? language == "English"
                  ? "Your Query"
                  : "To patai"
                : language == "English"
                ? `${selectedQuery.author}'s Query`
                : `Te patai a ${selectedQuery.author}`}
            </Typography>
            {selectedQuery.resolved ? (
              <Typography ml="18px" sx={{ color: "primary.dark" }}>
                {language == "English" ? "(Resolved)" : "(Whakatau)"}
              </Typography>
            ) : (
              <>
                <Button
                  disabled={loading}
                  variant="contained"
                  sx={{ mx: "18px", borderRadius: "24px" }}
                  onClick={() => resolveQuery()}
                >
                  <Typography
                    textTransform="none"
                    sx={{ color: "background.paper" }}
                  >
                    {language == "English" ? "Resolve Query" : "Whakaoti Uiui"}
                  </Typography>
                </Button>
                {loading && <CircularProgress />}
              </>
            )}
          </Stack>
          <Stack justifyContent="flex-end" height="100%">
            <Divider />
            <Stack
              width="100%"
              spacing="5px"
              height="calc(100vh - 310px)"
              className="scrollableMessages"
              sx={{
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Stack py="4px" />
              {selectedQuery.messages?.map(
                (message) =>
                  message.content && (
                    <MessageBubble
                      key={message.dateCreated}
                      message={message}
                      isAuthor={
                        message.author ===
                        `${user?.firstName} ${user?.lastName}`
                      }
                    />
                  )
              )}
              <Stack py="4px" />
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignSelf="center"
              width="600px"
              mb="54px"
              mt="18px"
            >
              <StyledTextField
                onKeyDown={handleKeyDown}
                size="small"
                fullWidth
                value={text}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLTextAreaElement | HTMLInputElement
                  >
                ) => {
                  setText(event.target.value);
                }}
                inputProps={{
                  style: {
                    fontWeight: "500",
                    lineHeight: "18px",
                    fontSize: "18px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      disabled={text == ""}
                      onClick={() => sendMessage()}
                    >
                      <Send
                        sx={{
                          height: "24px",
                          width: "24px",
                          color: "background.paper",
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                          p: 1,
                        }}
                      />
                    </IconButton>
                  ),
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Stack paddingX="80px" spacing="18px">
          <Typography variant="h3" sx={{ color: "primary.dark" }}>
            {language == "English" ? "Messages" : "Nga Karere"}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing="9px">
              <IconButton
                onClick={() => handlePage(false)}
                sx={{ color: "primary.main" }}
                disabled={page === 0}
              >
                <KeyboardArrowLeft />
              </IconButton>
              <Typography fontWeight="500">{`${
                language == "English" ? "Page" : "Wharangi"
              } ${page + 1}`}</Typography>
              <IconButton
                onClick={() => handlePage(true)}
                sx={{ color: "primary.main" }}
                disabled={page === lastPage - 1}
              >
                <KeyboardArrowRight />
              </IconButton>
              <Typography fontWeight="500">
                {language == "English"
                  ? "Resolved Threads"
                  : "Nga Miro Whakatau"}
              </Typography>
              <Switch
                checked={resolved}
                onChange={(_event, newResolved) => {
                  setPage(0);
                  setLastPage(-1);
                  setResolved(newResolved);
                }}
              />
            </Stack>
            <Button
              onClick={() => setOpen(true)}
              variant="contained"
              sx={{
                borderRadius: "27px",
                color: "background.paper",
              }}
            >
              <Typography textTransform="none" fontWeight="500">
                {language == "English" ? "Add Thread" : "Tapiri Miro"}
              </Typography>
              <Add />
            </Button>
          </Stack>
          <Divider />
          {hasSearched && queries.length === 0 ? (
            <Typography marginTop="18px">
              {language == "English"
                ? "No queries found."
                : "Karekau he patai i kitea."}
            </Typography>
          ) : (
            <>
              {queries?.map((query: Query) => {
                const lastMessage: Message | undefined =
                  query.messages?.[query.messages.length - 1];
                return (
                  <DataEntry
                    onClick={() => {
                      setSelectedQuery(query);
                      setIsMessage(true);
                    }}
                    key={query.id}
                    inputAdornment={<></>}
                    subtitle={`${lastMessage?.author}: ${
                      lastMessage?.content || ""
                    }`}
                    heading={`${query.author}, - ${dayjs(
                      query.dateCreated
                    ).format("dddd, MMM DD")}`}
                    size="136px"
                  />
                );
              })}
            </>
          )}
          <StyledDialog
            open={open}
            handleChange={() => setOpen(false)}
            title={
              language == "English" ? "Create New Thread" : "Waihanga Miro Hou"
            }
            children={
              <Stack width="500px" spacing="18px">
                <StyledTextField
                  label={
                    language == "English"
                      ? "Open a new Query"
                      : "Tuwherahia he patai hou"
                  }
                  onKeyDown={handleKeyDownQuery}
                  multiline
                  rows={4}
                  value={newQuery}
                  onChange={(
                    event: React.ChangeEvent<
                      HTMLTextAreaElement | HTMLInputElement
                    >
                  ) => {
                    setNewQuery(event.target.value);
                  }}
                  InputLabelProps={{
                    style: { fontWeight: "500" },
                  }}
                  inputProps={{
                    style: {
                      fontWeight: "500",
                    },
                  }}
                />
                <StyledButton
                  size="60px"
                  disabled={newQueryLoading || newQuery.trim() == ""}
                  children={
                    <>
                      <Typography
                        textTransform="none"
                        sx={{
                          color: "background.paper",
                          mr: "18px",
                          ml: newQueryLoading ? "18px" : "0px",
                        }}
                      >
                        {language == "English"
                          ? "Create a new Thread"
                          : "Waihangatia he Miro hou"}
                      </Typography>
                      {newQueryLoading && (
                        <CircularProgress
                          size="27px"
                          sx={{
                            color: "background.paper",
                            ml: "18px",
                          }}
                        />
                      )}
                    </>
                  }
                  onClick={() => createNewQuery()}
                />
              </Stack>
            }
          />
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            autoHideDuration={5000}
            ContentProps={{
              sx: {
                borderRadius: "18px",
                backgroundColor: error ? "error.main" : "primary.main",
                px: "36px",
                py: "9px",
              },
            }}
          />
        </Stack>
      )}
    </>
  );
}
