import React, { createContext, useState, useContext, type ReactNode } from 'react';

// --- TYPE DEFINITIONS ---

// Define what kind of modals we can open
type ModalType = 'edit' | 'delete' | null;

// Define the data types our modals can handle
type EntityType = 'users' | 'subjects' | 'tasks';

// Define the state that the context will manage
interface ActionsContextState {
  modalType: ModalType;
  entityType: EntityType | null;
  entityId: number | string | null;
}

// Define the functions that the context will expose
interface ActionsContextValue extends ActionsContextState {
  openModal: (type: ModalType, entityType: EntityType, entityId: number | string) => void;
  closeModal: () => void;
}

// --- CONTEXT CREATION ---

const ActionsContext = createContext<ActionsContextValue | null>(null);

// Custom hook for easy access to the context
// This is the corrected line: used ':' instead of 'of'
export const useActions = (): ActionsContextValue => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
};

// --- PROVIDER COMPONENT ---

export const ActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ActionsContextState>({
    modalType: null,
    entityType: null,
    entityId: null,
  });

  const openModal = (type: ModalType, entityType: EntityType, entityId: number | string) => {
    setState({ modalType: type, entityType, entityId });
  };

  const closeModal = () => {
    setState({ modalType: null, entityType: null, entityId: null });
  };

  const value = {
    ...state,
    openModal,
    closeModal,
  };

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
};