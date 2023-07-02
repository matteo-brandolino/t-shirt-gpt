"use client";
import { Settings, TshirtContextType } from "@/types/ThishirtContextType";
import { createContext, useState } from "react";

export const TshirtContext = createContext<TshirtContextType | null>(null);

export interface Props {
  children: React.ReactNode;
}
const TshirtProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState<Settings>({
    color: "#FFFFFF",
    image: {
      isLoading: false,
      url: "",
    },
  });
  return (
    <TshirtContext.Provider value={{ settings, setSettings }}>
      {children}
    </TshirtContext.Provider>
  );
};

export default TshirtProvider;
