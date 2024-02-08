import {
  LayerActionTypes,
  layerSetterAtom,
  selectedLayerAtom,
} from "@/state/editor";
import { TextLayer } from "@/typings";
import clsx from "clsx";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";

interface TextLayerComponentProps {
  layer: TextLayer;
}
const TextLayerComponent = ({ layer }: TextLayerComponentProps) => {
  const setLayers = useSetAtom(layerSetterAtom);
  const [selectedLayer, setSelectedLayer] = useAtom(selectedLayerAtom);
  const [canEdit, setCanEdit] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (spanRef.current && canEdit) {
      spanRef.current.focus();
    }
  }, [canEdit]);

  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData("textDrag", layer.id);
        const updatedLayer = {
          ...layer,
          offset: {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          },
        };
        setLayers({
          action: LayerActionTypes.UPDATE,
          layer: updatedLayer,
        });
      }}
      onBlur={(e) => {
        if (!spanRef.current) return;
        const updatedLayer = {
          ...layer,
          text: spanRef.current.textContent || "",
        };
        setLayers({
          action: LayerActionTypes.UPDATE,
          layer: updatedLayer,
        });
        setCanEdit(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setCanEdit(true);
        if (layer.id !== selectedLayer) {
          setSelectedLayer(layer.id);
        }
      }}
      className={clsx(
        "absolute z-50 ",
        selectedLayer === layer.id && "outline-dashed outline-gray-300",
        canEdit ? "cursor-text" : "cursor-grab"
      )}
      style={{
        top: `${layer.position.y}px`,
        left: `${layer.position.x}px`,
      }}
    >
      <span
        ref={spanRef}
        key={layer.id}
        style={{
          fontSize: `${layer.fontSize}px`,
          color: layer.color,
          fontWeight: `${layer.fontWeight}`,
        }}
        id={layer.id}
        draggable
        contentEditable={canEdit}
        className="outline-none"
      >
        {layer.text}
      </span>
    </div>
  );
};

export default TextLayerComponent;
