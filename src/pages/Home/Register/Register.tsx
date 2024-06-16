import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { StyledButton } from "../../../components/StyledButton";
import { StyledTextField } from "../../../components/StyledTextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { LanguageContext } from "../../App";

export function Register(): ReactElement {
  const [givenName, setGivenName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getUser = (): void => {
      fetch(
        "https://smart-scale-773f6dc98fe5.herokuapp.com/api/user/is-registered",
        {
          credentials: "include",
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error();
          }
        })
        .then((data) => {
          if (data.isRegistered) {
            navigate("/onboarding");
          }
        })
        .catch((error) => {
          navigate("/");
          console.error(error);
        });
    };
    getUser();
  }, []);

  const registerUser = (): void => {
    const body = {
      firstName: givenName,
      lastName: surname,
      dateOfBirth: date?.format("YYYY-MM-DD"),
      phoneNumber: number,
    };
    setLoading(true);

    fetch("https://smart-scale-773f6dc98fe5.herokuapp.com/csrf", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `https://smart-scale-773f6dc98fe5.herokuapp.com/api/user/complete-registration?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(() => navigate("/onboarding"))
      )
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Stack justifyContent="center" height="100%" paddingBottom="120px">
      <Typography fontSize="72px" marginBottom="14px">
        {language == "English" ? "Register" : "Rehita"}
      </Typography>
      <Stack spacing="9px">
        <StyledTextField
          label={language == "English" ? "Given Name" : "Ingoa Hoatu"}
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
        <StyledTextField
          label={language == "English" ? "Last Name" : "Ingoa Whakamutunga"}
          value={surname}
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
        <StyledTextField
          label={language == "English" ? "Phone Number" : "Tau Waea"}
          value={number}
          onChange={(
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setNumber(event.target.value);
          }}
          InputLabelProps={{ style: { fontWeight: "500" } }}
          inputProps={{
            style: {
              fontWeight: "500",
            },
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={
              language == "English" ? "Date of Birth" : "Te Ra Whanautanga"
            }
            value={date}
            onChange={(newDate: Dayjs | null) => setDate(newDate)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: { InputLabelProps: { style: { fontWeight: "500" } } },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
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
      </Stack>
      <Stack spacing="18px" marginTop="21px">
        <StyledButton
          disabled={!(givenName && surname && number && date) || loading}
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
                {language == "English" ? "Register" : "Rehita"}
              </Typography>
              {loading && (
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
          onClick={() => registerUser()}
        />
        <Typography
          alignSelf="center"
          textAlign="center"
          width="55%"
          variant="caption"
          sx={{
            color: "secondary.main",
          }}
        >
          {language == "English"
            ? "By continuing, you agree to the "
            : "Ma te haere tonu, ka whakaae koe ki nga "}
          <Link
            underline="hover"
            href="//www.plunket.org.nz/terms-and-conditions/"
          >
            <Typography
              variant="inherit"
              sx={{
                color: "primary.main",
                display: "inline",
              }}
            >
              {language == "English" ? "Terms of Use " : "Nga Ture Whakamahi "}
            </Typography>
          </Link>
          {language == "English" ? "and " : "me "}
          <Link underline="hover" href="//www.plunket.org.nz/privacy-policy/">
            <Typography
              variant="inherit"
              sx={{
                color: "primary.main",
                display: "inline",
              }}
            >
              {language == "English"
                ? "Privacy Policy "
                : "Kaupapahere Whaiaro "}
            </Typography>
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
}
