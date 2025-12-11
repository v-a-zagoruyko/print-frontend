import { createContext, useContext } from "solid-js";

export const InfoContext = createContext();

export function useInfo() {
  return useContext(InfoContext);
}
