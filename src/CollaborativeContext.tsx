import React, { createContext, useContext, useState } from 'react';

interface CollaborativeContextProps {
  collaborativeId: string | null;
  setCollaborativeId: (id: string | null) => void;
}

const CollaborativeContext = createContext<CollaborativeContextProps | undefined>(undefined);

export const CollaborativeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collaborativeId, setCollaborativeId] = useState<string | null>(null);

  return (
    <CollaborativeContext.Provider value={{ collaborativeId, setCollaborativeId }}>
      {children}
    </CollaborativeContext.Provider>
  );
};

export const useCollaborativeContext = () => {
  const context = useContext(CollaborativeContext);
  if (!context) {
    throw new Error('useCollaborativeContext must be used within a CollaborativeProvider');
  }
  return context;
};