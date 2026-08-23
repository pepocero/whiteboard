import { Footer } from "@excalidraw/excalidraw/index";
import React from "react";

import { isWhiteboardSignedUser } from "../app_constants";

import { DebugFooter, isVisualDebuggerEnabled } from "./DebugCanvas";
import { EncryptedIcon } from "./EncryptedIcon";

const EXCALIDRAW_REPO_URL = "https://github.com/excalidraw";
const CARLINITOOLS_URL = "https://carlinitools.com";

export const AppCredits = ({ variant = "footer" }: { variant?: "footer" | "menu" }) => {
  return (
    <p className={`app-credits app-credits--${variant}`}>
      Basado en{" "}
      <a
        href={EXCALIDRAW_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Excalidraw
      </a>
      . Se han añadido funciones específicas como la creación de tarjetas a
      partir de un texto con determinados separadores.{" "}
      <a href={CARLINITOOLS_URL} target="_blank" rel="noopener noreferrer">
        CarliniTools
      </a>
    </p>
  );
};

export const AppFooter = React.memo(
  ({ onChange }: { onChange: () => void }) => {
    return (
      <Footer>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
          }}
        >
          {isVisualDebuggerEnabled() && <DebugFooter onChange={onChange} />}
          <AppCredits />
          {!isWhiteboardSignedUser && <EncryptedIcon />}
        </div>
      </Footer>
    );
  },
);
