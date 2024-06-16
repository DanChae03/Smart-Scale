import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useState } from "react";
import { StyledTextField } from "../../components/StyledTextField";
import Button from "@mui/material/Button";
import { AccountCircle, Search } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { DataEntry } from "../../components/DataEntry";
import Avatar from "@mui/material/Avatar";
import { StyledDialog } from "../../components/StyledDialog";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { StyledButton } from "../../components/StyledButton";
import cities from "../../utils/Cities";
import { Nurse, Parent, Baby } from "../../utils/types";
import Snackbar from "@mui/material/Snackbar";
import { Box, Divider } from "@mui/material";
import { LanguageContext } from "../App";

export function Bookings(): ReactElement {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [duration, setDuration] = useState<number | null>(30);
  const [open, setOpen] = useState<boolean>(false);
  const [givenName, setGivenName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNurses, setLoadingNurses] = useState<boolean>(false);
  const [loadingBooking, setLoadingBooking] = useState<boolean>(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [babySelect, setBabySelect] = useState<string>("");
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [nurseSelect, setNurseSelect] = useState<string>("");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState<boolean>(false);
  const [city, setCity] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const { language } = useContext(LanguageContext);

  const clearState = (): void => {
    setParents([]);
    setSelectedParent(null);
    setSelectedBaby(null);
    setSelectedNurse(null);
    setNurses([]);
    setNurseSelect("");
    setBabySelect("");
    setCity(null);
    setHasSearched(false);
  };

  const getNursesByCity = (newCity: string | null): void => {
    if (newCity != null) {
      setLoadingNurses(true);
      fetch(
        `https://smart-scale-773f6dc98fe5.herokuapp.com/api/receptionist/get-nurses-by-city?city=${newCity
          ?.toUpperCase()
          .replaceAll(" ", "_")}`,
        {
          credentials: "include",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setNurses(data);
          setLoadingNurses(false);
        })
        .catch((error) => {
          console.error(error);
          setLoadingNurses(false);
        });
    }
  };

  const getParents = (): void => {
    setLoading(true);
    fetch(
      `https://smart-scale-773f6dc98fe5.herokuapp.com/api/receptionist/get-parents?firstName=${givenName}&lastName=${surname}`,
      {
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setParents(data);
        setHasSearched(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && givenName && surname) {
      getParents();
    }
  };

  const createCheckupBooking = (): void => {
    const body = {
      nurseId: selectedNurse?.nurseId,
      parentId: selectedParent?.parentId,
      startTime: date?.format("YYYY-MM-DDTHH:mm:ss"),
      endTime: date
        ?.add(duration ?? 0, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss"),
      location: selectedParent?.address,
      babyId: selectedBaby?.id,
    };

    setLoadingBooking(true);
    fetch("https://smart-scale-773f6dc98fe5.herokuapp.com/csrf", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `https://smart-scale-773f6dc98fe5.herokuapp.com/api/checkup?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            setLoadingBooking(false);
            setBookingDialogOpen(false);
            if (!response.ok) {
              response.text().then((data) => handleResult(data, true));
            } else {
              handleResult("Booking successfully created.", false);
            }
          })
          .then(() => {
            clearState();
          })
      )
      .catch((error) => {
        setLoadingBooking(false);
        console.error(error);
      });
  };

  const handleResult = (message: string, error: boolean): void => {
    setError(error);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Stack paddingX="80px" spacing="18px">
      <Typography variant="h3" sx={{ color: "primary.dark" }}>
        {language == "English" ? "Add Booking" : "Te Tautoko"}
      </Typography>
      <Stack direction="row" spacing="18px">
        <Stack width="350px">
          <StyledTextField
            label={language == "English" ? "Given Name" : "Ingoa Hoatu"}
            onKeyDown={handleKeyDown}
            value={givenName}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setGivenName(event.target.value);
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
        </Stack>
        <Stack width="350px">
          <StyledTextField
            label={language == "English" ? "Last Name" : "Ingoa Whakamutunga"}
            value={surname}
            onKeyDown={handleKeyDown}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setSurname(event.target.value);
            }}
            InputLabelProps={{ style: { fontWeight: "500" } }}
            inputProps={{
              style: {
                fontWeight: "500",
              },
            }}
          />
        </Stack>
        <Button
          onClick={() => {
            getParents();
          }}
          disabled={!givenName || !surname || loading}
          sx={{
            color: "background.paper",
            bgcolor: "primary.main",
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "primary.dark",
              color: "background.paper",
            },
            "&:disabled": {
              bgcolor: "background.default",
            },
          }}
        >
          <Search />
        </Button>
        {loading && (
          <CircularProgress
            size="36px"
            sx={{ alignSelf: "center", mt: "9px" }}
          />
        )}
      </Stack>
      <Stack>
        <Divider />
        <Typography
          display={loading || parents.length !== 0 ? "none" : "auto"}
          marginTop="18px"
        >
          {hasSearched && parents.length === 0
            ? language == "English"
              ? "No parents found."
              : "Kaore he matua i kitea."
            : language == "English"
            ? "Please search for a parent to make a booking for."
            : "Tena koa rapua he matua hei utu mo."}
        </Typography>
        <Stack
          display={parents.length === 0 ? "none" : "flex"}
          spacing="18px"
          paddingTop="18px"
          height="calc(100vh - 272px)"
          sx={{
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {parents.map((parent) => (
            <DataEntry
              key={parent.parentId}
              onClick={() => {
                setSelectedParent(parent);
                setBookingDialogOpen(true);
              }}
              inputAdornment={
                <Avatar
                  src={parent.profileImageUrl}
                  sx={{
                    alignSelf: "center",
                    width: "72px",
                    height: "72px",
                    marginBottom: "9px",
                  }}
                />
              }
              heading={`${parent.firstName} ${parent.lastName} (${parent?.babies?.length} children)`}
              subtitle={`Email: ${parent.email}, Phone Number: ${parent.phoneNumber}, DOB: ${parent.dateOfBirth}`}
              size="120px"
            />
          ))}
          <Stack />
          <Stack />
        </Stack>
      </Stack>
      <StyledDialog
        title={`${
          language == "English" ? "Create booking" : "Waihanga pukapuka"
        } - ${selectedParent?.firstName} ${selectedParent?.lastName}`}
        open={bookingDialogOpen}
        handleChange={() => setBookingDialogOpen(false)}
        children={
          <Stack spacing="9px">
            <Typography variant="body2"></Typography>
            <Select
              fullWidth
              displayEmpty
              IconComponent={() => null}
              value={babySelect}
              onChange={(event: SelectChangeEvent<string | null>) => {
                setBabySelect(event.target.value ?? "");
              }}
              renderValue={(value: string | null) =>
                value != null ? (
                  <>{value}</>
                ) : (
                  <span>
                    {language == "English"
                      ? "Select a child"
                      : "Tipakohia he tamaiti"}
                  </span>
                )
              }
              sx={{
                fontWeight: "500",
                bgcolor: "background.default",
                borderRadius: "15px",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "background.paper",
                },
                marginBottom: "9px",
              }}
            >
              <MenuItem disabled value="" sx={{ fontWeight: "500" }}>
                {language == "English"
                  ? "Select a child"
                  : "Tipakohia he tamaiti"}
              </MenuItem>
              {selectedParent?.babies?.map((baby) => (
                <MenuItem
                  key={baby.id}
                  onClick={() => {
                    setSelectedBaby(baby);
                  }}
                  sx={{ fontWeight: "500" }}
                  value={`${baby.firstName} ${baby.lastName}`}
                >{`${baby.firstName} ${baby.lastName}`}</MenuItem>
              ))}
            </Select>
            <Typography variant="body2">
              {language == "English" ? "Select a child" : "Kowhiria he taone"}
            </Typography>
            <Autocomplete
              disabled={loadingNurses}
              value={city}
              options={cities}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontWeight: "500" },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Typography fontWeight="500">{option}</Typography>
                </Box>
              )}
              onChange={(_event: any, newCity: string | null) => {
                setCity(newCity);
                getNursesByCity(newCity);
              }}
            />
            {loadingNurses ? (
              <CircularProgress sx={{ alignSelf: "center" }} />
            ) : nurses.length > 0 ? (
              <>
                <Typography variant="body2">
                  {language == "English"
                    ? "Choose a Nurse"
                    : "Kowhiria he Nehi"}
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  IconComponent={() => null}
                  value={nurseSelect}
                  onChange={(event: SelectChangeEvent<string | null>) => {
                    setNurseSelect(event.target.value ?? "");
                  }}
                  renderValue={(value: string | null) =>
                    value != null ? (
                      <>{value}</>
                    ) : (
                      <span>
                        {language == "English"
                          ? "Choose a Nurse"
                          : "Tipakohia he Nehi"}
                      </span>
                    )
                  }
                  startAdornment={<AccountCircle sx={{ marginRight: "9px" }} />}
                  sx={{
                    fontWeight: "500",
                    bgcolor: "background.default",
                    borderRadius: "15px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "background.paper",
                    },
                    marginBottom: "9px",
                  }}
                >
                  <MenuItem disabled value="" sx={{ fontWeight: "500" }}>
                    {language == "English"
                      ? "Choose a Nurse"
                      : "Tipakohia he Nehi"}
                  </MenuItem>
                  {nurses.map((nurse) => (
                    <MenuItem
                      key={nurse.nurseId}
                      onClick={() => {
                        setSelectedNurse(nurse);
                      }}
                      sx={{ fontWeight: "500" }}
                      value={`${nurse.firstName} ${nurse.lastName}`}
                    >{`${nurse.firstName} ${nurse.lastName}`}</MenuItem>
                  ))}
                </Select>
                {selectedNurse != null && (
                  <>
                    <Typography variant="body2">
                      {language == "English"
                        ? "Pick an Appointment Date"
                        : "Tipakohia he Ra Wahui"}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={date}
                        open={open}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        onChange={(newDate: dayjs.Dayjs | null) =>
                          setDate(newDate)
                        }
                        onClose={() => setOpen(false)}
                        format="dddd,  MMMM DD, hh:mmA"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "15px",
                            fontWeight: "500",
                            outline: "none",
                            bgcolor: "background.default",
                            "& fieldset": { borderColor: "background.default" },
                          },
                          "& .MuiOutlinedInput-input": {
                            cursor: "pointer",
                          },
                          "& .MuiIconButton-root": {
                            marginRight: "0px",
                            color: "secondary.dark",
                          },
                        }}
                        slotProps={{
                          textField: {
                            placeholder: "Select a Date",
                            onClick: () => setOpen(true),
                          },
                          field: { readOnly: true },
                          inputAdornment: {
                            position: "start",
                          },
                        }}
                      />
                    </LocalizationProvider>
                    <Typography variant="body2">
                      {language == "English"
                        ? "Appointment Duration (Minutes)"
                        : "Roanga Wahui (Miti"}
                    </Typography>
                    <StyledTextField
                      value={duration}
                      type="number"
                      onChange={(event) =>
                        setDuration(
                          event.target.value != ""
                            ? parseInt(event.target.value)
                            : null
                        )
                      }
                      inputProps={{
                        style: { fontWeight: "500" },
                      }}
                    />
                    <Stack alignItems="center">
                      <Typography>{`${
                        language == "English"
                          ? "Booked Slots for"
                          : "Kua tohua nga waahi mo"
                      } ${date?.format("MMMM DD")}:`}</Typography>
                      {selectedNurse?.schedule?.map(
                        (schedule) =>
                          dayjs(date).isSame(
                            dayjs(schedule.startTime),
                            "day"
                          ) && (
                            <Typography
                              key={schedule.checkupBookingId}
                            >{`${dayjs(schedule.startTime).format(
                              "hh:mm"
                            )} - ${dayjs(schedule.endTime).format(
                              "hh:mm a"
                            )}`}</Typography>
                          )
                      )}
                    </Stack>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
            <StyledButton
              onClick={() => {
                createCheckupBooking();
              }}
              disabled={
                loadingBooking ||
                selectedBaby == null ||
                selectedParent == null ||
                selectedNurse == null ||
                date == null ||
                duration == null
              }
              size="60px"
              children={
                <>
                  <Typography
                    textTransform="none"
                    sx={{
                      color: "background.paper",
                      mr: "18px",
                      ml: loadingBooking ? "18px" : "0px",
                    }}
                  >
                    {language == "English"
                      ? "Create checkup booking"
                      : "Waihangahia te utu tirotiro"}
                  </Typography>
                  {loadingBooking && (
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
  );
}
