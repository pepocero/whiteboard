import { loginIcon } from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React from "react";

import type { Theme } from "@excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import { LanguageList } from "../app-language/LanguageList";
import { isWhiteboardSignedUser, logout } from "../app_constants";

import { StickyNotesCreator } from "./StickyNotesCreator";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  setTheme: (theme: Theme | "system") => void;
  refresh: () => void;
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}> = React.memo((props) => {
  return (
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      {isWhiteboardSignedUser ? (
        <MainMenu.ItemCustom>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que quieres cerrar sesión? Se limpiarán todos los datos locales.",
                )
              ) {
                logout();
              }
            }}
            className="dropdown-menu-item dropdown-menu-item-base"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0 0.5rem",
              cursor: "pointer",
              color: "var(--color-on-surface)",
              fontSize: "0.875rem",
              fontWeight: 400,
              width: "100%",
              boxSizing: "border-box",
              background: "transparent",
              border: "1px solid transparent",
              borderRadius: "var(--border-radius-md)",
              height: "2rem",
              margin: "1px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--button-hover-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              {loginIcon}
            </span>
            <span>Cerrar sesión</span>
          </button>
        </MainMenu.ItemCustom>
      ) : null}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme
        allowSystemTheme
        theme={props.theme}
        onSelect={props.setTheme}
      />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
      <StickyNotesCreator excalidrawAPI={props.excalidrawAPI} />
    </MainMenu>
  );
});
