import BaseInput from "@/components/atoms/input";
import { EditorLayer, TextLayer } from "@/typings";
import { HexColorPicker } from "react-colorful";

interface TextPropertiesProps {
  layer: TextLayer;
  updateLayer: (
    e: React.ChangeEvent<HTMLInputElement>,
    layer: EditorLayer
  ) => void;
}

const TextProperties = ({ layer, updateLayer }: TextPropertiesProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <BaseInput
        placeholder="Text"
        label="Value"
        value={layer.text}
        name="text"
        onChange={(e) => {
          updateLayer(e, layer);
        }}
      />
      <BaseInput
        placeholder="12"
        type="number"
        label="Size"
        value={layer.fontSize.toString()}
        name="fontSize"
        onChange={(e) => {
          updateLayer(e, layer);
        }}
      />
      <BaseInput
        placeholder="400"
        type="number"
        label="Weight"
        value={layer.fontWeight.toString()}
        name="fontWeight"
        onChange={(e) => {
          updateLayer(e, layer);
        }}
      />
      <div className="flex flex-col justify-start">
        <p className="text-sm font-medium text-gray-700 mb-8">Color</p>
        <HexColorPicker
          className="mx-6 w-full"
          color={layer.color}
          onChange={(color) => {
            updateLayer(
              {
                target: {
                  name: "color",
                  value: color,
                } as any,
              } as any,
              layer
            );
          }}
        />
      </div>
    </div>
  );
};

export default TextProperties;
