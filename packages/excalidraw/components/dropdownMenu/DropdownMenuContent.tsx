import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { EVENT, KEYS } from "@excalidraw/common";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useStable } from "../../hooks/useStable";
import { useEditorInterface } from "../App";
import { Island } from "../Island";
import Stack from "../Stack";

import { DropdownMenuContentPropsContext } from "./common";

const MenuContent = ({
  children,
  onClickOutside,
  className = "",
  onSelect,
  style,
  placement = "bottom",
}: {
  children?: React.ReactNode;
  onClickOutside?: () => void;
  className?: string;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
  style?: React.CSSProperties;
  placement?: "top" | "bottom";
}) => {
  const editorInterface = useEditorInterface();
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const callbacksRef = useStable({ onClickOutside });

  useOutsideClick(menuRef, (event) => {
    // prevents closing if clicking on the trigger button
    if (
      !menuRef.current
        ?.closest(".dropdown-menu-container")
        ?.contains(event.target)
    ) {
      callbacksRef.onClickOutside?.();
    }
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        event.stopImmediatePropagation();
        callbacksRef.onClickOutside?.();
      }
    };

    const option = {
      // so that we can stop propagation of the event before it reaches
      // event handlers that were bound before this one
      capture: true,
    };

    document.addEventListener(EVENT.KEYDOWN, onKeyDown, option);
    return () => {
      document.removeEventListener(EVENT.KEYDOWN, onKeyDown, option);
    };
  }, [callbacksRef]);

  // Capturar eventos de scroll del mouse para prevenir que se propaguen al lienzo
  useEffect(() => {
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      // Verificar si el evento viene del menú o sus hijos
      const target = event.target as Node;
      if (!menu.contains(target)) {
        return;
      }

      // Siempre prevenir que el scroll se propague al lienzo cuando está sobre el menú
      event.stopPropagation();

      // Verificar si el scroll puede continuar en el contenedor
      const { scrollTop, scrollHeight, clientHeight } = container;
      const canScrollDown = event.deltaY > 0 && scrollTop < scrollHeight - clientHeight - 1;
      const canScrollUp = event.deltaY < 0 && scrollTop > 1;
      const isScrollable = scrollHeight > clientHeight;

      // Si no puede hacer scroll más, prevenir el comportamiento por defecto
      if (isScrollable && !canScrollDown && !canScrollUp) {
        event.preventDefault();
      }
      // Si puede hacer scroll, dejar que el navegador maneje el scroll normalmente
    };

    // Agregar el listener con capture para interceptar antes que otros handlers
    menu.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => {
      menu.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, []);

  const classNames = clsx(`dropdown-menu ${className}`, {
    "dropdown-menu--mobile": editorInterface.formFactor === "phone",
    "dropdown-menu--placement-top": placement === "top",
  }).trim();

  return (
    <DropdownMenuContentPropsContext.Provider value={{ onSelect }}>
      <div
        ref={menuRef}
        className={classNames}
        style={style}
        data-testid="dropdown-menu"
      >
        {/* the zIndex ensures this menu has higher stacking order,
    see https://github.com/excalidraw/excalidraw/pull/1445 */}
        {editorInterface.formFactor === "phone" ? (
          <Stack.Col
            ref={containerRef}
            className="dropdown-menu-container"
            style={{
              maxHeight: "85vh",
              height: "100%",
              flex: "1 1 0",
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {children}
          </Stack.Col>
        ) : (
          <Island
            className="dropdown-menu-container"
            padding={2}
            style={{ zIndex: 2 }}
          >
            {children}
          </Island>
        )}
      </div>
    </DropdownMenuContentPropsContext.Provider>
  );
};
MenuContent.displayName = "DropdownMenuContent";

export default MenuContent;
