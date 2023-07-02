import { ColorRepresentation } from "three";

export type Image = {
  isLoading: Boolean;
  url: String;
};
export type Settings = {
  color: ColorRepresentation | [r: number, g: number, b: number];
  image: Image;
};

export type TshirtContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};
