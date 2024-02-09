/* eslint-disable @next/next/no-img-element */
"use client";

import {
  LayerActionTypes,
  getAllLayersAtom,
  imageRefAtom,
  layerSetterAtom,
} from "@/state/editor";
import {
  FiltersLayer,
  LayerTypes,
  RotateLayer,
  StrokeLayer,
  TextLayer,
} from "@/typings";
import { useAtomValue, useSetAtom } from "jotai";
import { DragEvent, useCallback, useEffect, useMemo, useState } from "react";
import TextLayerComponent from "./text-layer";

interface ImageEditorProps {
  image: File;
}

const ImageEditor = ({ image }: ImageEditorProps) => {
  const [editedImage, setEditedImage] = useState<string | ArrayBuffer | null>(
    ""
  );
  const setImageRef = useSetAtom(imageRefAtom);
  const setLayers = useSetAtom(layerSetterAtom);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setEditedImage(reader.result);
    };
    reader.readAsDataURL(image);
  });

  const layers = useAtomValue(getAllLayersAtom);

  const borderStyleString = useMemo(() => {
    const stroke = layers[LayerTypes.STROKE] as StrokeLayer[];
    if (!stroke || stroke.length < 1) return "";

    return `${stroke[0].width}px solid ${stroke[0].color}`;
  }, [layers]);

  const rotateStyleString = useMemo(() => {
    const rotate = layers[LayerTypes.ROTATE] as RotateLayer[];
    if (!rotate || rotate.length < 1) return "";
    return `rotate(${rotate[0].angle}deg)`;
  }, [layers]);

  const filterStyleString = useMemo(() => {
    const filters = (layers[LayerTypes.FILTERS] as FiltersLayer[])?.[0]
      ?.filters;
    if (!filters) return "";
    const filterArray = Object.entries(filters).map(([key, value]) => {
      if (value.value === "0") return "";
      return `${key}(${value.value}${value.unit})`;
    });
    return filterArray.join(" ");
  }, [layers]);

  const textLayers = useMemo(() => {
    const layers_ = layers[LayerTypes.TEXT] as TextLayer[];
    if (!layers_) return [];
    return layers_;
  }, [layers]);

  const handleOnDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      const textLayer = (layers[LayerTypes.TEXT] as TextLayer[]).find(
        (layer) => layer.id === e.dataTransfer.getData("textDrag")
      );
      if (!textLayer || !textLayer.offset.x || !textLayer.offset.y) return;
      const updatedLayer = {
        ...textLayer,
        position: {
          x: e.nativeEvent.offsetX - textLayer.offset.x,
          y: e.nativeEvent.offsetY - textLayer.offset.y,
        },
      };
      setLayers({
        action: LayerActionTypes.UPDATE,
        layer: updatedLayer,
      });
    },
    [layers, setLayers]
  );

  return (
    <div
      className="w-auto h-full relative"
      ref={setImageRef}
      onDrop={handleOnDrop}
      onDragOver={(e) => e.preventDefault()}
      id="image-container"
    >
      <img
        src={editedImage as string}
        alt="Selected Image"
        className="object-contain max-h-full max-w-full"
        style={{
          ...(borderStyleString ? { border: borderStyleString } : {}),
          ...(rotateStyleString ? { transform: rotateStyleString } : {}),
          ...(filterStyleString ? { filter: filterStyleString } : {}),
        }}
      />
      {textLayers.map((layer) => {
        return <TextLayerComponent key={layer.id} layer={layer} />;
      })}
    </div>
  );
};
export default ImageEditor;
