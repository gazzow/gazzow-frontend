"use client";

import { createContext, useContext, useState } from "react";

type NavigationContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);

  return (
    <NavigationContext.Provider value={{ open, setOpen }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }
  return context;
};


