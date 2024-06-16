import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Logo } from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../utils/dbUtils";
import CircularProgress from "@mui/material/CircularProgress";
import { LanguageContext } from "../App";

export function Unauthorised(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getUser = (): void => {
      setLoading(true);
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
            fetchUser().then((data) => {
              if (data.roles?.length != null && data.roles.length > 1) {
                navigate("/onboarding");
              } else {
                setLoading(false);
              }
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

  return (
    <Stack
      height="100vh"
      justifyContent="center"
      alignItems="center"
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
        <Stack alignItems="center" spacing="36px" paddingBottom="144px">
          <Logo large />
          <Card
            sx={{
              p: "54px",
              borderRadius: "18px",
            }}
          >
            <Stack spacing="36px" alignItems="center">
              <Typography variant="h3" sx={{ color: "primary.dark" }}>
                {language == "English" ? "UNAUTHORISED" : "KORE MANA"}
              </Typography>
              <Typography
                variant="h5"
                textAlign="center"
                fontWeight="500"
                sx={{ color: "primary.dark" }}
              >
                {language == "English"
                  ? "You do not have the permissions to access this page."
                  : "Kaore koe e whai mana ki te uru atu ki tenei wharangi."}
                <br />
                {language == "English"
                  ? "Contact an administrator if you believe that you should have access."
                  : "Whakapa atu ki tetahi kaiwhakahaere ki te whakapono koe me whai waahi koe."}
              </Typography>
              <Typography variant="h5" sx={{ color: "primary.dark" }}>
                {language == "English"
                  ? "Are you a parent? Use the app to access your child's records."
                  : "He matua koe? Whakamahia te taupānga kia uru atu ki nga rekoata a to tamaiti."}
              </Typography>
            </Stack>
          </Card>
        </Stack>
      )}
    </Stack>
  );
}
