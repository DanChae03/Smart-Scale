import { ReactElement, useState } from "react";
import { Heart } from "../../components/Heart";
import "@fontsource/lato/300.css";
import Stack from "@mui/material/Stack";
import { Landing } from "./Landing";
import { Register } from "./Register";
import { Logo } from "../../components/Logo";

export interface HomePageContentProps {
  page: "Home" | "Register";
}

export function Home({ page }: HomePageContentProps): ReactElement {
  return (
    <Stack
      direction="row"
      height="100vh"
      justifyContent="space-evenly"
      alignItems="center"
      spacing="500px"
      overflow="hidden"
    >
      <Stack
        width="420px"
        height="100%"
        spacing="15px"
        justifyContent="flex-start"
        display="flex"
        paddingTop="20px"
      >
        <Logo />
        {page === "Home" ? <Landing /> : <Register />}
      </Stack>
      <Stack>
        <Heart />
      </Stack>
    </Stack>
  );
}
