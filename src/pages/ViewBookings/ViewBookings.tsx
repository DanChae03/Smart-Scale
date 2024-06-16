import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs, { Dayjs } from "dayjs";
import { ReactElement, useContext, useEffect, useState } from "react";
import { DataEntry } from "../../components/DataEntry";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Divider from "@mui/material/Divider";
import {
  AppointmentData,
  BabyData,
  Appointment,
  CurrentUser,
  WeightReading,
} from "../../utils/types";
import { StyledDialog } from "../../components/StyledDialog";
import CircularProgress from "@mui/material/CircularProgress";
import { StyledButton } from "../../components/StyledButton";
import { StyledTextField } from "../../components/StyledTextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LanguageContext } from "../App";
import { API_URL } from "../../utils/dbUtils";

interface ViewBookingsProps {
  user: CurrentUser | null;
}

export function ViewBookings({ user }: ViewBookingsProps): ReactElement {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [babyData, setBabyData] = useState<BabyData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [scaleLoading, setScaleLoading] = useState<boolean>(false);
  const [scaleId, setScaleId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [mainWeight, setMainWeight] = useState<string>("Not set");

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getCheckupBookings = () => {
      setLoading(true);
      fetch(
        `${API_URL}/api/nurse/schedule?startDate=${date?.format("YYYY-MM-DD")}`,
        {
          credentials: "include",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          setAppointments(data);
          setHasSearched(true);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };
    getCheckupBookings();
  }, [date]);

  useEffect(() => {
    const getCheckupBooking = () => {
      fetch(
        `${API_URL}/api/checkup/${parseInt(
          selectedAppointment?.checkupBookingId ?? ""
        )}`,
        {
          credentials: "include",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setAppointmentData(data);
          if (data.mainWeightReading != null) {
            setMainWeight(data.mainWeightReading.weight.toString());
          }
          console.log(data);
          fetch(`${API_URL}/api/baby/${data.babyId}`, {
            credentials: "include",
          })
            .then((response) => {
              return response.json();
            })
            .then((babyData) => {
              setBabyData(babyData);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    if (selectedAppointment != null) {
      getCheckupBooking();
    }
  }, [selectedAppointment]);

  const changeMainWeight = (weightReading: WeightReading) => {
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `${API_URL}/api/checkup/${selectedAppointment?.checkupBookingId}/setMainWeightReading/${weightReading.id}?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      )
      .catch((error) => {
        console.error(error);
      });
  };

  const addScale = (): void => {
    setScaleLoading(true);
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `${API_URL}/api/checkup/${parseInt(
            selectedAppointment?.checkupBookingId ?? ""
          )}/addScale?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "PUT",
            body: scaleId,
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(() => {
          setScaleLoading(false);
          handleChange();
        })
      )
      .catch((error) => {
        setScaleLoading(false);
        console.error(error);
      });
  };

  const handleChange = (): void => {
    setSelectedAppointment(null);
    setAppointmentData(null);
    setBabyData(null);
    setOpen(false);
  };

  return (
    <Stack paddingX="80px" spacing="18px">
      <Typography variant="h5" sx={{ color: "primary.dark" }}>
        Kia Ora, {user?.firstName}.
      </Typography>
      <Stack direction="row" alignItems="center" spacing="18px">
        <Typography fontWeight="500">
          {`${appointments.length === 0 ? "" : appointments.length} ${
            language == "English"
              ? "Appointment(s) from the week starting"
              : "Ko nga whakaritenga mai i te wiki ka timata"
          }`}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newDate: Dayjs | null) => setDate(newDate)}
            format="dddd, MMM DD"
            slotProps={{
              textField: {
                InputLabelProps: { style: { fontWeight: "500" } },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                width: "350px",
                outline: "none",
                bgcolor: "background.default",
                "& fieldset": { borderColor: "background.default" },
                fontWeight: "500",
              },
              "& .MuiIconButton-root": {
                marginRight: "0px",
              },
            }}
          />
        </LocalizationProvider>
        {loading && (
          <CircularProgress size="36px" sx={{ alignSelf: "center" }} />
        )}
      </Stack>
      <Stack>
        <Divider />
        {appointments.length === 0 && hasSearched ? (
          <Typography marginTop="18px">
            {language == "English"
              ? "No Bookings under this account for this time period."
              : "Kaore he Rahui i raro i tenei kaute mo tenei waa."}
          </Typography>
        ) : (
          <Stack spacing="18px">
            <Stack
              spacing="18px"
              height="calc(100vh - 260px)"
              paddingTop="18px"
              sx={{
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {appointments.map((appointment) => (
                <DataEntry
                  key={appointment.checkupBookingId}
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setOpen(true);
                  }}
                  heading={`${
                    language == "English" ? "Checkup Booking" : "Takitaki Rahui"
                  } - ${dayjs(appointment.startTime).format("h:mma")}`}
                  subtitle={`${dayjs(appointment.startTime).format(
                    "dddd, MMM D h:mma"
                  )} - ${dayjs(appointment.endTime).format("h:mma")}`}
                  inputAdornment={
                    <Stack
                      alignItems="center"
                      width="80px"
                      sx={{ color: "primary.main" }}
                    >
                      <Typography variant="h3">
                        {dayjs(appointment.startTime).format("DD")}
                      </Typography>
                      <Typography marginBottom="9px">
                        {dayjs(appointment.startTime)
                          .format("ddd")
                          .toUpperCase()}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
              <Stack />
            </Stack>
          </Stack>
        )}
      </Stack>
      <StyledDialog
        open={open}
        handleChange={handleChange}
        title={language == "English" ? "Checkup Booking" : "Takitaki Rahui"}
        children={
          <Stack width="400px">
            {appointmentData && babyData ? (
              <Stack spacing="18px">
                <Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="500">
                      {language == "English" ? "Time:" : "Te Wa:"}
                    </Typography>
                    <Typography>
                      {`${dayjs(selectedAppointment?.startTime).format(
                        "h:mm"
                      )} - ${dayjs(selectedAppointment?.endTime).format(
                        "h:mma"
                      )}`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="500">
                      {language == "English" ? "Location:" : "Wahi:"}
                    </Typography>
                    <Typography>{appointmentData?.location}</Typography>
                  </Stack>
                </Stack>
                <Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="500">
                      {language == "English" ? "Baby Name:" : "Ingoa Pepi:"}
                    </Typography>
                    <Typography>{`${babyData?.firstName} ${babyData?.lastName}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="500">
                      {language == "English" ? "DOB:" : "Te Ra Whanautanga:"}
                    </Typography>
                    <Typography>{babyData?.dateOfBirth}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight="500">
                      {language == "English" ? "Ethnicity:" : "Matawaka:"}
                    </Typography>
                    <Typography>{babyData?.ethnicity}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight="500">
                      {language == "English"
                        ? "Main Weight (kg):"
                        : "Taumaha Matua (kg):"}
                    </Typography>
                    <Select
                      readOnly={
                        appointmentData.weightReadings != null &&
                        appointmentData.weightReadings.length == 0
                      }
                      fullWidth
                      IconComponent={() => null}
                      value={mainWeight}
                      onChange={(event) => {
                        setMainWeight(event.target.value);
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
                        width: "150px",
                      }}
                    >
                      {appointmentData.weightReadings?.map((weightReading) => (
                        <MenuItem
                          key={weightReading.id}
                          onClick={() => {
                            setMainWeight(
                              weightReading.weight?.toString() ?? "Not set"
                            );
                            changeMainWeight(weightReading);
                          }}
                          sx={{ fontWeight: "500" }}
                          value={weightReading.weight}
                        >
                          {weightReading.weight}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Stack>
                <StyledTextField
                  label={
                    language == "English"
                      ? "Add a scale ID"
                      : "Tapirihia he ID tauine"
                  }
                  value={scaleId}
                  onChange={(
                    event: React.ChangeEvent<
                      HTMLTextAreaElement | HTMLInputElement
                    >
                  ) => {
                    setScaleId(event.target.value);
                  }}
                  InputLabelProps={{
                    style: { fontWeight: "500" },
                  }}
                />
                <StyledButton
                  size="60px"
                  disabled={scaleId == "" || loading}
                  children={
                    <>
                      <Typography
                        textTransform="none"
                        sx={{
                          color: "background.paper",
                          mr: "18px",
                          ml: loading ? "18px" : "0px",
                        }}
                      >
                        {language == "English"
                          ? "Add a scale ID"
                          : "Tapirihia he ID tauine"}
                      </Typography>
                      {scaleLoading && (
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
                  onClick={() => addScale()}
                />
              </Stack>
            ) : (
              <CircularProgress sx={{ alignSelf: "center" }} />
            )}
          </Stack>
        }
      />
    </Stack>
  );
}
