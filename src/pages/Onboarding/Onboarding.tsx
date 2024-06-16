import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../../components/StyledTextField";
import Card from "@mui/material/Card";
import { ArrowForward } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import cities from "../../utils/Cities";
import Button from "@mui/material/Button";
import { API_URL, fetchUser } from "../../utils/dbUtils";
import Box from "@mui/material/Box";
import { LanguageContext } from "../App";

export function Onboarding(): ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string | null>(null);
  const [view, setView] = useState<string>("loading");
  const [roles, setRoles] = useState<string[]>([]);

  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getUser = (): void => {
      fetch(`${API_URL}/api/user/is-registered`, {
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error();
          }
        })
        .then((data) => {
          if (data.isRegistered) {
            fetchUser().then((data) => {
              setRoles(data.roles);
              checkUser(data.roles);
            });
          } else {
            navigate("/register");
          }
        })
        .catch((error) => {
          navigate("/");
          console.error(error);
        });
    };
    getUser();
  }, []);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && value) {
      completeRegistration();
    }
  };

  const checkUser = (userRoles: string[]) => {
    if (userRoles.includes("NURSE")) {
      fetch(`${API_URL}/api/nurse/is-registered`, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.isRegistered) {
            navigate("/dashboard");
          } else {
            setLoading(false);
            setView("nurse");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (userRoles.includes("DATA_ANALYST")) {
      navigate("/dashboard");
    } else {
      fetch(`${API_URL}/api/parent/is-registered`, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.isRegistered) {
            if (userRoles.length === 1 && userRoles.includes("PARENT")) {
              navigate("/unauthorised");
            } else {
              navigate("/dashboard");
            }
          } else {
            setLoading(false);
            setView("parent");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const completeRegistration = () => {
    setLoading(true);
    fetch(`${API_URL}/csrf`, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) =>
        fetch(
          `${API_URL}/api/${
            view === "nurse" ? "nurse" : "parent"
          }/complete-registration?_csrf=${data.token}`,
          {
            credentials: "include",
            method: "POST",
            body:
              view === "nurse"
                ? JSON.stringify({
                    city: value?.toUpperCase().replaceAll(" ", "_"),
                  })
                : JSON.stringify({ address: value }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(() => {
          if (roles.length === 1 && roles.includes("PARENT")) {
            navigate("/unauthorised");
          } else {
            navigate("/dashboard");
          }
        })
      )
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Stack
      height="100vh"
      alignItems="center"
      justifyContent="center"
      spacing="36px"
      sx={{ bgcolor: "rgba(245, 246, 250, 0.85)" }}
    >
      {loading ? (
        <>
          <Typography
            variant="h2"
            fontWeight="500"
            sx={{ color: "primary.dark" }}
          >
            {language == "English" ? "Loading..." : "Uta ana..."}
          </Typography>
          <CircularProgress size="90px" sx={{ color: "primary.dark" }} />
        </>
      ) : (
        <Card
          sx={{
            p: "54px",
            borderRadius: "18px",
          }}
        >
          <Stack spacing="36px">
            <Typography
              variant="h3"
              fontWeight="500"
              sx={{ color: "primary.dark" }}
            >
              {language == "English"
                ? "Complete Registration"
                : "Whakaotia te Rehitatanga"}
            </Typography>
            {view === "nurse" ? (
              <Autocomplete
                value={value}
                options={cities}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    label={language == "English" ? "City" : "Pa"}
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
                onChange={(_event: any, newValue: string | null) => {
                  setValue(newValue);
                }}
              />
            ) : (
              <StyledTextField
                InputProps={{
                  endAdornment: <ArrowForward sx={{ color: "primary.dark" }} />,
                }}
                onKeyDown={handleKeyDown}
                label={language == "English" ? "Address" : "Wahitau"}
                value={value}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLTextAreaElement | HTMLInputElement
                  >
                ) => {
                  setValue(event.target.value);
                }}
                InputLabelProps={{
                  style: { fontWeight: "500" },
                }}
              />
            )}
            <Button
              variant="contained"
              sx={{
                borderRadius: "18px",
                height: "54px",
              }}
              onClick={completeRegistration}
              disabled={value == null}
            >
              <Typography
                textTransform="none"
                sx={{ color: "background.paper" }}
              >
                {language == "English" ? "Submit" : "Tukuna"}
              </Typography>
            </Button>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
