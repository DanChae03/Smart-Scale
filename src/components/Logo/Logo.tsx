import Link from "@mui/material/Link";
import { ReactElement } from "react";

interface LogoProps {
  large?: boolean;
}

export function Logo({ large = false }: LogoProps): ReactElement {
  return (
    <Link href="//www.plunket.org.nz/">
      <img
        alt="Plunket Main Logo"
        src="/images/logo.png"
        style={{
          height: large ? "150px" : "100px",
        }}
      />
    </Link>
  );
}
