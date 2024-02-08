import { layerFamilyAtom, selectedLayerAtom } from "@/state/editor";
import { EditorLayer, LayerTypes } from "@/typings";
import clsx from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import capitalize from "lodash.capitalize";

interface LayerDetailProps {
  isSelected?: boolean;
  id: string;
}
const LayerDetail = ({ isSelected = false, id }: LayerDetailProps) => {
  const layerAtom = useMemo(() => {
    return layerFamilyAtom(id);
  }, [id]);
  const layer = useAtomValue(layerAtom);

  const setSelectedLayer = useSetAtom(selectedLayerAtom);

  const handleSelectedLayer = useCallback(() => {
    setSelectedLayer(id);
  }, [id, setSelectedLayer]);

  if (!layer) return null;

  return (
    <div
      onClick={handleSelectedLayer}
      className={clsx(
        "w-full border cursor-pointer p-2 flex flex-col justify-center gap-2 rounded-md",
        isSelected
          ? "bg-orange-100 border-orange-500"
          : "bg-slate-100 border-gray-500"
      )}
    >
      <p className="text-md font-normal">
        {layer.type === LayerTypes.TEXT && layer.text
          ? layer.text
          : capitalize(layer.type)}
      </p>
    </div>
  );
};

export default LayerDetail;
