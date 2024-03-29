import {
  EditorLayer,
  FilterProperty,
  FilterTypes,
  LayerTypes,
} from "@/typings";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export const filterProperties: Record<FilterTypes, FilterProperty> = {
  [FilterTypes.BLUR]: {
    name: "Blur",
    inputType: "range",
    max: 100,
    unit: "px",
    value: "0",
  },
  [FilterTypes.BRIGHTNESS]: {
    name: "Brightness",
    inputType: "range",
    max: 200,
    unit: "%",
    value: "0",
  },
  [FilterTypes.CONTRAST]: {
    name: "Contrast",
    inputType: "range",
    max: 200,
    unit: "%",
    value: "0",
  },
  [FilterTypes.GRAYSCALE]: {
    name: "Grayscale",
    inputType: "range",
    max: 100,
    unit: "%",
    value: "0",
  },
  [FilterTypes.HUE_ROTATE]: {
    name: "Hue Rotate",
    inputType: "range",
    max: 360,
    unit: "deg",
    value: "0",
  },
  [FilterTypes.INVERT]: {
    name: "Invert",
    inputType: "range",
    max: 100,
    unit: "%",
    value: "0",
  },
  [FilterTypes.OPACITY]: {
    name: "Opacity",
    inputType: "range",
    max: 100,
    unit: "%",
    value: "0",
  },
  [FilterTypes.SATURATE]: {
    name: "Saturate",
    inputType: "range",
    max: 200,
    unit: "%",
    value: "0",
  },
  [FilterTypes.SEPIA]: {
    name: "Sepia",
    inputType: "range",
    max: 100,
    unit: "%",
    value: "0",
  },
};

export const layerDefaultsMapper = {
  [LayerTypes.TEXT]: {
    text: "TEXT",
    fontSize: 12,
    fontWeight: 400,
    color: "#000000",
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  },
  [LayerTypes.FILTERS]: {
    filters: filterProperties,
  },
  [LayerTypes.ROTATE]: {
    angle: 0,
  },
  [LayerTypes.STROKE]: {
    color: "#000000",
    width: 1,
  },
};

export const MAX_LAYERS = {
  [LayerTypes.TEXT]: 10,
  [LayerTypes.FILTERS]: 1,
  [LayerTypes.ROTATE]: 1,
  [LayerTypes.STROKE]: 1,
};

export const layerTypeCountAtom = atom<Record<LayerTypes, number>>({
  [LayerTypes.TEXT]: 0,
  [LayerTypes.FILTERS]: 0,
  [LayerTypes.ROTATE]: 0,
  [LayerTypes.STROKE]: 0,
});

export const layerFamilyAtom = atomFamily(
  (id: string) => {
    return atom<EditorLayer | undefined>(undefined);
  },
  (a, b) => a === b
);

export const layerIdsAtom = atom<string[]>([]);

export const layerHistoryAtom = atom<Array<EditorLayer | string>>([]);

export const layerRedoHistoryAtom = atom<Array<EditorLayer>>([]);

export enum LayerActionTypes {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
  RESET = "RESET",
  UNDO = "UNDO",
  REDO = "REDO",
}

export type LayerSetterArgs =
  | {
      action:
        | LayerActionTypes.ADD
        | LayerActionTypes.UPDATE
        | LayerActionTypes.REMOVE;
      layer: EditorLayer;
    }
  | {
      action:
        | LayerActionTypes.RESET
        | LayerActionTypes.UNDO
        | LayerActionTypes.REDO;
    };

export const layerSetterAtom = atom(null, (get, set, args: LayerSetterArgs) => {
  const { action } = args;
  const layerTypeCount = get(layerTypeCountAtom);
  const layerIds = get(layerIdsAtom);
  switch (action) {
    case LayerActionTypes.ADD:
      if (layerTypeCount[args.layer.type] >= MAX_LAYERS[args.layer.type]) {
        const foundLayer = layerIds.find((id) => {
          const layer = get(layerFamilyAtom(id));
          return layer?.type === args.layer.type;
        });
        if (foundLayer) {
          set(selectedLayerAtom, foundLayer);
        }
        return;
      }
      set(layerFamilyAtom(args.layer.id), args.layer);
      set(layerIdsAtom, [...layerIds, args.layer.id]);
      set(layerTypeCountAtom, {
        ...layerTypeCount,
        [args.layer.type]: layerTypeCount[args.layer.type] + 1,
      });
      set(selectedLayerAtom, args.layer.id);
      set(layerHistoryAtom, [...get(layerHistoryAtom), args.layer.id]);
      break;
    case LayerActionTypes.REMOVE:
      layerFamilyAtom.remove(args.layer.id);
      const layerIdsSet = new Set(layerIds);
      layerIdsSet.delete(args.layer.id);
      set(layerIdsAtom, [...layerIdsSet]);
      set(layerTypeCountAtom, {
        ...layerTypeCount,
        [args.layer.type]: layerTypeCount[args.layer.type] - 1,
      });
      set(selectedLayerAtom, layerIds[layerIds.length - 1] || null);
      set(
        layerHistoryAtom,
        get(layerHistoryAtom).filter((id) => id !== args.layer.id)
      );
      break;
    case LayerActionTypes.UPDATE:
      set(layerFamilyAtom(args.layer.id), args.layer);
      set(layerHistoryAtom, [...get(layerHistoryAtom), args.layer]);
      break;
    case LayerActionTypes.RESET:
      set(layerIdsAtom, []);
      set(selectedLayerAtom, "");
      set(layerTypeCountAtom, {
        [LayerTypes.TEXT]: 0,
        [LayerTypes.FILTERS]: 0,
        [LayerTypes.ROTATE]: 0,
        [LayerTypes.STROKE]: 0,
      });
      set(layerHistoryAtom, []);
      break;
    case LayerActionTypes.UNDO:
      const layerHistory = get(layerHistoryAtom);
      const lastLayer = layerHistory.pop();
      if (!lastLayer) return;
      set(layerHistoryAtom, [...layerHistory]);
      const lastLayerData = get(
        layerFamilyAtom(
          typeof lastLayer === "string"
            ? lastLayer
            : lastLayer
            ? lastLayer.id
            : ""
        )
      );
      if (!lastLayerData) return;
      if (typeof lastLayer === "string") {
        set(layerRedoHistoryAtom, [
          ...get(layerRedoHistoryAtom),
          lastLayerData,
        ]);
        layerFamilyAtom.remove(lastLayer);
        const layerIdsSet = new Set(layerIds);
        layerIdsSet.delete(lastLayer);
        const tmpLayerIds = [...layerIdsSet];
        set(layerIdsAtom, [...layerIdsSet]);
        set(layerTypeCountAtom, {
          ...layerTypeCount,
          [lastLayer]: layerTypeCount[lastLayerData.type] - 1,
        });
        set(selectedLayerAtom, tmpLayerIds[tmpLayerIds.length - 1] || "");
      } else {
        set(layerFamilyAtom(lastLayerData.id), lastLayer);
        set(layerRedoHistoryAtom, [
          ...get(layerRedoHistoryAtom),
          lastLayerData,
        ]);
      }
      set(layerHistoryAtom, get(layerHistoryAtom));
      break;
    case LayerActionTypes.REDO:
      const lastRedos = get(layerRedoHistoryAtom);
      const lastRedoLayer = lastRedos.pop();
      if (!lastRedoLayer) return;
      set(layerRedoHistoryAtom, [...lastRedos]);
      set(layerFamilyAtom(lastRedoLayer.id), lastRedoLayer);
      if (
        JSON.stringify(
          { ...lastRedoLayer, id: "" },
          Object.keys({ ...lastRedoLayer, id: "" }).sort()
        ) ===
        JSON.stringify(
          {
            ...layerDefaultsMapper[lastRedoLayer.type],
            id: "",
            type: lastRedoLayer.type,
          },
          Object.keys({
            ...layerDefaultsMapper[lastRedoLayer.type],
            id: "",
            type: lastRedoLayer.type,
          }).sort()
        )
      ) {
        set(layerHistoryAtom, [...get(layerHistoryAtom), lastRedoLayer.id]);
      } else set(layerHistoryAtom, [...get(layerHistoryAtom), lastRedoLayer]);
      if (!layerIds.includes(lastRedoLayer.id)) {
        set(layerIdsAtom, [...layerIds, lastRedoLayer.id]);
      }
      break;
  }
});

export const selectedLayerAtom = atom<string | null>(null);

export const getAllLayersAtom = atom((get) => {
  const layerIds = get(layerIdsAtom);
  let layers = {} as Record<LayerTypes, EditorLayer[]>;
  layerIds.forEach((id) => {
    const layer = get(layerFamilyAtom(id));
    if (layer) {
      if (!layers[layer.type]) {
        layers[layer.type] = [];
      }
      layers[layer.type].push(layer);
    }
  });
  return layers;
});

export const imageRefAtom = atom<HTMLElement | null>(null);
