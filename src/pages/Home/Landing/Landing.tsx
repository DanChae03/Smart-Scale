import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { StyledButton } from "../../../components/StyledButton";
import { GoogleIcon } from "../../../components/GoogleIcon";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { LanguageContext } from "../../App";

export function Landing(): ReactElement {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (location.pathname === "/login/oauth2/google/callback") {
      fetch(
        "https://smart-scale-773f6dc98fe5.herokuapp.com/login/oauth2/code/web-google".concat(
          location.search
        ),
        {
          credentials: "include",
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            navigate("/onboarding");
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch(
      "https://smart-scale-773f6dc98fe5.herokuapp.com/oauth2/authorization/web-google",
      {
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        window.location.replace(data.redirectUrl);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <Stack justifyContent="center" height="100%" paddingBottom="120px">
      <Stack>
        <Typography fontSize="72px" fontWeight="300" lineHeight="36px">
          {language == "English" ? "Supporting" : "Te Tautoko"}
        </Typography>
        <Typography fontSize="72px">
          {language == "English" ? "Every Family." : "I a Whanau."}
        </Typography>
      </Stack>
      <Stack spacing="27px">
        <Typography fontSize="27px" lineHeight="32px" fontWeight="500">
          {language == "English"
            ? "Discover child health resources, book appointments, and access parenting tips."
            : "Tirohia nga rauemi hauora tamariki, whakarite pukapuka, me te uru atu ki nga tohutohu matua."}
        </Typography>
        <Typography fontSize="27px" lineHeight="32px" fontWeight="500">
          {language == "English"
            ? "Plunket is with you, every step of the way."
            : "Kei a koe a whanau awhina, i nga hikoinga katoa."}
        </Typography>
        <StyledButton
          disabled={loading}
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
                  ? "Sign in with Google"
                  : "Waitohu me Google"}
              </Typography>
              <GoogleIcon />
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
          onClick={() => fetchData()}
        />
      </Stack>
    </Stack>
  );
}
