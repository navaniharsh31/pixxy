export interface Layer {
  id: string;
}

export enum LayerTypes {
  TEXT = "TEXT",
  FILTERS = "FILTERS",
  ROTATE = "ROTATE",
  STROKE = "STROKE",
}

export interface TextLayer extends Layer {
  type: LayerTypes.TEXT;
  text: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}

export interface FiltersLayer extends Layer {
  type: LayerTypes.FILTERS;
  filters: Record<FilterTypes, FilterProperty>;
}

export interface RotateLayer extends Layer {
  type: LayerTypes.ROTATE;
  angle: string;
}

export interface StrokeLayer extends Layer {
  type: LayerTypes.STROKE;
  color: string;
  width: number;
}

export type EditorLayer = TextLayer | FiltersLayer | RotateLayer | StrokeLayer;

export enum FilterTypes {
  BLUR = "blur",
  BRIGHTNESS = "brightness",
  CONTRAST = "contrast",
  GRAYSCALE = "grayscale",
  HUE_ROTATE = "hue-rotate",
  INVERT = "invert",
  OPACITY = "opacity",
  SATURATE = "saturate",
  SEPIA = "sepia",
}

export interface FilterProperty {
  name: string;
  inputType: "range" | "color";
  max: number;
  unit: string;
  value: string;
}
