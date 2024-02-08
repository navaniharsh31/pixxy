import BaseInput from "@/components/atoms/input";
import { EditorLayer, RotateLayer } from "@/typings";

interface Props {
  layer: RotateLayer;
  updateLayer: (
    e: React.ChangeEvent<HTMLInputElement>,
    layer: EditorLayer
  ) => void;
}

const RotateProperties = ({ layer, updateLayer }: Props) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <BaseInput
        placeholder="24"
        type="number"
        inputProps={{
          max: 360,
        }}
        label="Angle"
        name="angle"
        value={layer.angle.toString()}
        onChange={(e) => {
          updateLayer(e, layer);
        }}
      />
    </div>
  );
};

export default RotateProperties;
