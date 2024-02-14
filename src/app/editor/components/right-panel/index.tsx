import {
  LayerActionTypes,
  layerFamilyAtom,
  layerIdsAtom,
  layerSetterAtom,
  selectedLayerAtom,
} from "@/state/editor";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useMemo } from "react";
import LayerDetail from "./layer";
import TextProperties from "./text-properties";
import RotateProperties from "./rotate-properties";
import StrokeProperties from "./stroke-properties";
import FilterProperties from "./filter-properties";
import { EditorLayer, LayerTypes } from "@/typings";

const RightPanel = () => {
  const layerIds = useAtomValue(layerIdsAtom);
  const selectedLayer = useAtomValue(selectedLayerAtom);
  const selectedLayerDataAtom = useMemo(() => {
    return layerFamilyAtom(selectedLayer ?? "");
  }, [selectedLayer]);
  const selectedLayerData = useAtomValue(selectedLayerDataAtom);
  const layerSetter = useSetAtom(layerSetterAtom);

  const renderProperties = () => {
    if (!selectedLayer) return null;
    switch (selectedLayerData?.type) {
      case LayerTypes.TEXT:
        return (
          <TextProperties
            layer={selectedLayerData}
            updateLayer={handleUpdateLayer}
          />
        );
      case LayerTypes.ROTATE:
        return (
          <RotateProperties
            layer={selectedLayerData}
            updateLayer={handleUpdateLayer}
          />
        );
      case LayerTypes.STROKE:
        return (
          <StrokeProperties
            layer={selectedLayerData}
            updateLayer={handleUpdateLayer}
          />
        );
      case LayerTypes.FILTERS:
        return (
          <FilterProperties
            layer={selectedLayerData}
            updateLayer={handleUpdateLayer}
          />
        );
      default:
        return null;
    }
  };

  const handleUpdateLayer = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, layer: EditorLayer) => {
      const updatedLayer = {
        ...layer,
        [e.target.name]: e.target.value,
      };
      layerSetter({ action: LayerActionTypes.UPDATE, layer: updatedLayer });
    },
    [layerSetter]
  );

  return (
    <div className="w-full h-full grid grid-rows-2">
      <div className="flex flex-col h-full border-b border-gray-300">
        <p className="font-semibold p-3 border-b border-gray-300">Properties</p>
        {selectedLayer ? (
          <div className="flex flex-col gap-3 p-2 overflow-auto">
            {renderProperties()}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col h-full">
        <p className="font-semibold p-3 border-b border-gray-300">Layers</p>
        {layerIds.length > 0 ? (
          <div className="flex flex-col gap-3 p-2 overflow-auto">
            {layerIds.map((id) => (
              <LayerDetail key={id} id={id} isSelected={selectedLayer === id} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RightPanel;
