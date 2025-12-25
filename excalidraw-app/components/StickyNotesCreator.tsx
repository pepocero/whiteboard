import React, { useState } from "react";

import { MainMenu } from "@excalidraw/excalidraw/index";

import { newElement, newTextElement } from "@excalidraw/element/newElement";
import { ROUNDNESS, TEXT_ALIGN, VERTICAL_ALIGN } from "@excalidraw/common";
import {
  computeContainerDimensionForBoundText,
  computeBoundTextPosition,
} from "@excalidraw/element/textElement";

import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface StickyNotesCreatorProps {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}

export const StickyNotesCreator: React.FC<StickyNotesCreatorProps> = ({
  excalidrawAPI,
}) => {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("");
  const [color, setColor] = useState("#fef3c7"); // Color amarillo claro por defecto

  const handleCreateNotes = () => {
    if (!excalidrawAPI || !text.trim()) {
      return;
    }

    const appState = excalidrawAPI.getAppState();
    const elements = excalidrawAPI.getSceneElements();

    // Dividir el texto según el separador
    let fragments: string[] = [];
    if (separator.trim()) {
      // Crear expresión regular para dividir por el separador
      const separatorRegex = new RegExp(
        separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g",
      );
      fragments = text
        .split(separatorRegex)
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    } else {
      // Si no hay separador, usar el texto completo
      fragments = [text.trim()];
    }

    if (fragments.length === 0) {
      return;
    }

    // Obtener posición inicial (centro de la vista)
    const viewportCenterX = appState.scrollX + appState.width / 2;
    const viewportCenterY = appState.scrollY + appState.height / 2;

    // Crear las notas
    const newElements: any[] = [];
    const spacing = 250; // Espacio entre notas
    const cols = Math.ceil(Math.sqrt(fragments.length));
    const startX = viewportCenterX - ((cols - 1) * spacing) / 2;
    const startY =
      viewportCenterY -
      ((Math.ceil(fragments.length / cols) - 1) * spacing) / 2;

    // Crear todos los contenedores primero
    const containers: any[] = [];
    fragments.forEach((fragment, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      // Crear texto primero para calcular dimensiones (sin containerId aún)
      const tempTextElement = newTextElement({
        text: fragment,
        x: 0,
        y: 0,
        fontSize: appState.currentItemFontSize,
        fontFamily: appState.currentItemFontFamily,
        textAlign: TEXT_ALIGN.CENTER,
        verticalAlign: VERTICAL_ALIGN.MIDDLE,
        strokeColor: appState.currentItemStrokeColor,
        backgroundColor: "transparent",
        fillStyle: appState.currentItemFillStyle,
        strokeWidth: appState.currentItemStrokeWidth,
        strokeStyle: appState.currentItemStrokeStyle,
        roughness: appState.currentItemRoughness,
        opacity: appState.currentItemOpacity,
      });

      // Calcular dimensiones del contenedor basadas en el texto
      const containerWidth = Math.max(
        200,
        computeContainerDimensionForBoundText(
          tempTextElement.width,
          "rectangle",
        ),
      );
      const containerHeight = Math.max(
        100,
        computeContainerDimensionForBoundText(
          tempTextElement.height,
          "rectangle",
        ),
      );

      // Crear texto vinculado al contenedor primero para obtener su ID
      const textElement = {
        ...tempTextElement,
        containerId: null as string | null,
        groupIds: [] as string[],
        frameId: null as string | null,
      };

      // Crear rectángulo (contenedor) centrado en la posición con boundElements
      const container = {
        ...newElement({
          type: "rectangle",
          x: x - containerWidth / 2,
          y: y - containerHeight / 2,
          width: containerWidth,
          height: containerHeight,
          backgroundColor: color,
          strokeColor: appState.currentItemStrokeColor,
          fillStyle: appState.currentItemFillStyle,
          strokeWidth: appState.currentItemStrokeWidth,
          strokeStyle: appState.currentItemStrokeStyle,
          roughness: appState.currentItemRoughness,
          opacity: appState.currentItemOpacity,
          roundness: {
            type: ROUNDNESS.ADAPTIVE_RADIUS,
          },
          locked: false,
          frameId: null,
        }),
        boundElements: [
          {
            type: "text" as const,
            id: textElement.id,
          },
        ],
      };

      // Actualizar el texto con las propiedades del contenedor
      textElement.containerId = container.id;
      textElement.groupIds = [...container.groupIds]; // Crear copia mutable del array readonly
      textElement.frameId = container.frameId;

      containers.push({ container, textElement });
    });

    // Crear mapa de elementos para calcular posiciones
    const allElementsMap = new Map(elements.map((el) => [el.id, el]));
    containers.forEach(({ container }) => {
      allElementsMap.set(container.id, container);
    });

    // Calcular posiciones de texto y agregar elementos
    containers.forEach(({ container, textElement }) => {
      const textPosition = computeBoundTextPosition(
        container,
        textElement as any,
        allElementsMap,
      );
      // Crear nuevo elemento con la posición correcta
      const positionedTextElement = {
        ...textElement,
        x: textPosition.x,
        y: textPosition.y,
      };
      allElementsMap.set(positionedTextElement.id, positionedTextElement);
      newElements.push(container, positionedTextElement);
    });

    // Agregar elementos al lienzo
    excalidrawAPI.updateScene({
      elements: [...elements, ...newElements],
    });

    // Limpiar los inputs
    setText("");
    setSeparator("");
  };

  return (
    <>
      <MainMenu.Separator />
      <MainMenu.ItemCustom>
        <div
          style={{
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
            }}
          >
            Crear Notas
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <textarea
              placeholder="Texto a dividir..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "0.875rem",
                width: "100%",
                minHeight: "120px",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleCreateNotes();
                }
              }}
            />
            <input
              type="text"
              placeholder="Separador (ej: ., ;, |)"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "0.875rem",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <label style={{ fontSize: "0.875rem", minWidth: "60px" }}>
                Color:
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: "100%",
                  height: "32px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              />
            </div>
            <button
              onClick={handleCreateNotes}
              disabled={!text.trim()}
              style={{
                padding: "0.5rem",
                backgroundColor: text.trim() ? "#6366f1" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: text.trim() ? "pointer" : "not-allowed",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Crear Notas
            </button>
          </div>
        </div>
      </MainMenu.ItemCustom>
    </>
  );
};
