"use client";

import React, { createContext, useContext, useState } from 'react';

interface PreviewContextType {
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
}

const PreviewContext = createContext<PreviewContextType>({
  isPreviewMode: true,
  togglePreviewMode: () => {},
});

export const PreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);

  const togglePreviewMode = () => setIsPreviewMode((prev) => !prev);

  return (
    <PreviewContext.Provider value={{ isPreviewMode, togglePreviewMode }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => useContext(PreviewContext);