import {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import { Logo } from "../../components/Logo";
import { UserIcon } from "../../components/UserIcon";
import { API_URL, fetchUser } from "../../utils/dbUtils";
import { Bookings } from "../Bookings";
import { Messages } from "../Messages";
import { Users } from "../Users";
import { StyledTab } from "../../components/StyledTab";
import Box from "@mui/material/Box";
import { ViewBookings } from "../ViewBookings";
import { Statistics } from "../Statistics";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { CurrentUser } from "../../utils/types";
import { LanguageContext } from "../App";

export function Dashboard(): ReactElement {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getUser = (): void => {
      setLoading(true);
      fetch(`${API_URL}/api/api/user/is-registered`, {
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
              setUser(data);
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

  const checkUser = (userRoles: string[]) => {
    if (userRoles.includes("NURSE")) {
      fetch(`${API_URL}/api/nurse/is-registered`, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (!data.isRegistered) {
            navigate("/onboarding");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (userRoles.includes("DATA_ANALYST")) {
    } else {
      {
        fetch(`${API_URL}/api/parent/is-registered`, {
          credentials: "include",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (!data.isRegistered) {
              navigate("/onboarding");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    setLoading(false);
  };

  const handleChange = (
    _event: SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  const pages: string[] = [];
  const maoriPages: string[] = [];

  if (user != null && user.roles != null) {
    const roles: string[] = user.roles;
    if (roles.includes("NURSE")) {
      pages.push("Bookings");
      maoriPages.push("Nga Rahui");
    }
    if (roles.includes("RECEPTIONIST")) {
      pages.push("Add Booking");
      maoriPages.push("Hanga Puka");
    }
    if (roles.includes("NURSE") || roles.includes("DATA_ANALYST")) {
      pages.push("Statistics");
      maoriPages.push("Tatauranga");
    }
    if (roles.includes("NURSE") || roles.includes("ADMIN")) {
      pages.push("Messages");
      maoriPages.push("Nga Karere");
    }
    if (roles.includes("ADMIN")) {
      pages.push("Users");
      maoriPages.push("Kaiwhakamahi");
    }
  }

  let activePage;

  switch (pages[value]) {
    case "Bookings":
      activePage = <ViewBookings user={user} />;
      break;
    case "Add Booking":
      activePage = <Bookings />;
      break;
    case "Statistics":
      activePage = <Statistics />;
      break;
    case "Messages":
      activePage = <Messages user={user} />;
      break;
    case "Users":
      activePage = <Users />;
      break;
    default:
      activePage = <></>;
  }

  return (
    <Stack direction="row" height="100vh" overflow="hidden">
      {loading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          width="100%"
          sx={{ bgcolor: "rgba(245, 246, 250, 0.85)" }}
        >
          <Typography
            variant="h2"
            fontWeight="500"
            sx={{ color: "primary.dark" }}
          >
            {language == "English" ? "Loading..." : "Uta ana..."}
          </Typography>
          <CircularProgress size="90px" sx={{ color: "primary.dark" }} />
        </Stack>
      ) : (
        <>
          <Stack
            paddingTop="80px"
            alignItems="center"
            width="22%"
            spacing="30px"
            sx={{ bgcolor: "rgba(245, 246, 250, 0.85)" }}
          >
            <Logo large />
            <Tabs
              orientation="vertical"
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{
                style: {
                  height: "60px",
                  width: "5px",
                  borderRadius: "2px",
                  marginTop: "15px",
                },
              }}
              sx={{ width: "100%" }}
            >
              {pages.map((page: string, index: number) => (
                <Tab
                  key={page}
                  disableRipple
                  sx={{ minHeight: "90px" }}
                  icon={
                    <StyledTab
                      title={page}
                      maoriTitle={maoriPages[index]}
                      selected={pages[value] === page}
                    />
                  }
                />
              ))}
            </Tabs>
          </Stack>
          <Stack
            alignItems="center"
            width="78%"
            sx={{ bgcolor: "rgba(255, 255, 255, 0.85)" }}
          >
            <Box width="100%" height="100%" paddingTop="100px">
              {activePage}
            </Box>
          </Stack>
          <UserIcon src={user?.profileImageUrl ?? ""} />
        </>
      )}
    </Stack>
  );
}
