import {
  Dispatch,
  ReactElement,
  createContext,
  useEffect,
  useState,
} from "react";
import { Home } from "./Home/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/lato";
import "./App.css";
import { Dashboard } from "./Dashboard";
import { Onboarding } from "./Onboarding";
import { Unauthorised } from "./Unauthorised";
import { Languages } from "../components/Languages";

const theme: Theme = createTheme({
  typography: {
    fontFamily: "Lato",
    fontSize: 18,
    fontWeightRegular: "bold",
  },
  palette: {
    primary: {
      main: "#19CFD7",
      dark: "#01B5CC",
    },
    secondary: {
      main: "#7E7E7E ",
      dark: "#000000",
    },
    background: {
      default: "#F5F6FA",
      paper: "#FFFFFF",
    },
    error: {
      main: "#B71C1C",
    },
  },
});

export interface LanguageState {
  language: string | null;
  setLanguage: Dispatch<React.SetStateAction<string>>;
}

export const LanguageContext = createContext<LanguageState>(
  {} as LanguageState
);

function App(): ReactElement {
  const [language, setLanguage] = useState<string>("English");

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Home page="Home" />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/register" element={<Home page="Register" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/unauthorised" element={<Unauthorised />} />
            </Routes>
          </BrowserRouter>
          <Languages />
        </LanguageContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
