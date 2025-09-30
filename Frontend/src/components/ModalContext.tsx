// ModalContext.ts
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext } from "react";

export interface ModalContextType {
  show: (title: string, message: string, buttonLabel?: string) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalAlert(): ModalContextType {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error("useModalAlert must be used inside ModalAlertProvider");
  return ctx;
}

export default ModalContext;
