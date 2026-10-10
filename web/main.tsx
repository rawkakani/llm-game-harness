import { createRoot } from "react-dom/client";
import { Theme } from "@astryxdesign/core/theme";
import { Landing } from "./page.tsx";
import { harnessTheme } from "./theme.ts";
import "./styles.css";
import "./theme.gen.css";

createRoot(document.getElementById("root")!).render(
  <Theme theme={harnessTheme} mode="dark">
    <Landing />
  </Theme>,
);
