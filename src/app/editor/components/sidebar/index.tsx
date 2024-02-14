import { LuFilter } from "react-icons/lu";
import { PiTextTBold } from "react-icons/pi";
import ToolButton from "./tool-button";
import { MdOutlineCropRotate, MdOutlineImage } from "react-icons/md";
import { FaBorderStyle, FaRedo, FaUndo } from "react-icons/fa";
import {
  EditorLayer,
  FiltersLayer,
  LayerTypes,
  RotateLayer,
  StrokeLayer,
  TextLayer,
} from "@/typings";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  LayerActionTypes,
  imageRefAtom,
  layerDefaultsMapper,
  layerSetterAtom,
} from "@/state/editor";
import { FaDownload } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { selectedImageAtom } from "@/state";
import { toPng } from "html-to-image";

const tools = [
  {
    name: "Text",
    id: "text",
    icon: PiTextTBold,
    type: LayerTypes.TEXT,
  },
  {
    name: "Filters",
    id: "filters",
    icon: LuFilter,
    type: LayerTypes.FILTERS,
  },
  {
    name: "Rotate",
    id: "rotate",
    icon: MdOutlineCropRotate,
    type: LayerTypes.ROTATE,
  },
  {
    name: "Stroke",
    id: "stroke",
    icon: FaBorderStyle,
    type: LayerTypes.STROKE,
  },
];

const EditorSidebar = () => {
  const layerSetter = useSetAtom(layerSetterAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageRef = useAtomValue(imageRefAtom);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const setSelectImage = useSetAtom(selectedImageAtom);

  const handleOnClick = () => {
    inputRef.current?.click();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectImage(e.target.files[0]);
    }
    layerSetter({ action: LayerActionTypes.RESET });
  };

  const handleSetLayers = useCallback(
    (type: LayerTypes) => {
      const id = uuidv4();
      let layer: EditorLayer;
      switch (type) {
        case LayerTypes.TEXT:
          layer = {
            id,
            type,
            ...layerDefaultsMapper[type],
          } as TextLayer;
          break;
        case LayerTypes.FILTERS:
          layer = {
            ...layerDefaultsMapper[type],
            id,
            type,
          } as FiltersLayer;
          break;
        case LayerTypes.ROTATE:
          layer = {
            ...layerDefaultsMapper[type],
            id,
            type,
            angle: "0",
          } as RotateLayer;
          break;
        case LayerTypes.STROKE:
          layer = {
            ...layerDefaultsMapper[type],
            id,
            type,
            color: "#000000",
            width: 1,
          } as StrokeLayer;
          break;
        default:
          throw new Error("Invalid layer type");
      }
      layerSetter({ action: LayerActionTypes.ADD, layer });
    },
    [layerSetter]
  );

  const downloadImage = useCallback(() => {
    if (!imageRef) return;
    toPng(imageRef as HTMLElement).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${selectedImage?.name}-pixxy.png`;
      link.href = dataUrl;
      link.click();
    });
  }, [imageRef, selectedImage?.name]);

  const handleUndo = useCallback(() => {
    layerSetter({ action: LayerActionTypes.UNDO });
  }, [layerSetter]);

  const handleRedo = useCallback(() => {
    layerSetter({ action: LayerActionTypes.REDO });
  }, [layerSetter]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 border-r border-gray-300">
      <div className="flex-grow flex flex-col gap-4">
        {tools.map(({ name, id, icon, type }) => {
          return (
            <ToolButton
              Icon={icon}
              onClick={() => handleSetLayers(type)}
              tooltipLabel={name}
              key={id}
            />
          );
        })}
        <ToolButton Icon={FaUndo} onClick={handleUndo} tooltipLabel="Undo" />
        <ToolButton Icon={FaRedo} onClick={handleRedo} tooltipLabel="Redo" />
      </div>
      {selectedImage ? (
        <div className="flex flex-col gap-4">
          <ToolButton
            Icon={FiDownload}
            onClick={downloadImage}
            tooltipLabel={"Download"}
          />
          <ToolButton
            Icon={MdOutlineImage}
            onClick={handleOnClick}
            tooltipLabel={"Change Image"}
          />
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleOnChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default EditorSidebar;
