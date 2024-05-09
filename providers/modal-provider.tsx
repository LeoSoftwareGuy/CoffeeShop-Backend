"use client";
// Entire purpose of this component is to avert hidration error from hapening
// when back and front are not in sync
import { StoreModal } from "@/components/modals/store-modal";

import { useState, useEffect } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Server side rendering
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
