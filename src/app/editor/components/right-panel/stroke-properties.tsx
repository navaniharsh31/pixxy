import BaseInput from "@/components/atoms/input";
import { EditorLayer, StrokeLayer } from "@/typings";
import { HexColorPicker } from "react-colorful";

interface Props {
  layer: StrokeLayer;
  updateLayer: (
    e: React.ChangeEvent<HTMLInputElement>,
    layer: EditorLayer
  ) => void;
}

const StrokeProperties = ({ layer, updateLayer }: Props) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <BaseInput
        placeholder="1"
        label="Size"
        value={layer.width.toString()}
        name="width"
        type="number"
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

export default StrokeProperties;
