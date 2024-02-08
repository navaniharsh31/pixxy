import BaseInput from "@/components/atoms/input";
import { filterProperties } from "@/state/editor";
import {
  EditorLayer,
  FilterProperty,
  FilterTypes,
  FiltersLayer,
} from "@/typings";

interface Props {
  layer: FiltersLayer;
  updateLayer: (
    e: React.ChangeEvent<HTMLInputElement>,
    layer: EditorLayer
  ) => void;
}

const FilterProperties = ({ layer, updateLayer }: Props) => {
  const updateFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters: Record<FilterTypes, FilterProperty> = {
      ...layer.filters,
      [e.target.name]: {
        ...layer.filters[e.target.name as FilterTypes],
        value: e.target.value.toString(),
      },
    };
    console.log(updatedFilters);
    updateLayer(
      {
        target: {
          name: "filters",
          value: updatedFilters,
        } as any,
      } as any,
      layer
    );
  };
  return (
    <div className="w-full flex flex-col gap-4">
      {Object.entries(filterProperties).map(([type, filter]) => {
        return (
          <BaseInput
            type={filter.inputType}
            label={`${filter.name} (${filter.unit})`}
            name={type}
            onChange={(e) => {
              updateFilters(e);
            }}
            value={layer.filters[type as FilterTypes].value}
            key={type}
            inputProps={{
              style: {
                backgroundColor: "orange",
              },
            }}
          />
        );
      })}
    </div>
  );
};

export default FilterProperties;
