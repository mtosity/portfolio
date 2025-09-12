'use client';

import React, { createContext, useContext } from 'react';

interface BlogContextType {
  activeAnchor: string | null;
  activeCodeExample: string | null;
  onInteract: (definitionKey: string, anchorId: string) => void;
  onCodeExampleInteract: (codeKey: string, anchorId: string) => void;
  onClose: () => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export function BlogProvider({ children, onInteract, onCodeExampleInteract, onClose }: { 
  children: React.ReactNode;
  onInteract: (definitionKey: string, anchorId: string) => void;
  onCodeExampleInteract: (codeKey: string, anchorId: string) => void;
  onClose: () => void;
}) {
  const [activeAnchor, setActiveAnchor] = React.useState<string | null>(null);
  const [activeCodeExample, setActiveCodeExample] = React.useState<string | null>(null);

  const handleInteract = (definitionKey: string, anchorId: string) => {
    setActiveAnchor(anchorId);
    setActiveCodeExample(null); // Clear code example when showing definition
    onInteract(definitionKey, anchorId);
  };

  const handleCodeExampleInteract = (codeKey: string, anchorId: string) => {
    setActiveCodeExample(anchorId);
    setActiveAnchor(null); // Clear definition when showing code example
    onCodeExampleInteract(codeKey, anchorId);
  };

  const handleClose = () => {
    setActiveAnchor(null);
    setActiveCodeExample(null);
    onClose();
  };

  return (
    <BlogContext.Provider value={{ 
      activeAnchor, 
      activeCodeExample,
      onInteract: handleInteract, 
      onCodeExampleInteract: handleCodeExampleInteract,
      onClose: handleClose 
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogInteraction() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogInteraction must be used within BlogProvider');
  }
  return context;
}