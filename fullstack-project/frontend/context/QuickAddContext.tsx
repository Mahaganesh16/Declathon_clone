'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuickAddContextType {
  isModalOpen: boolean;
  selectedProduct: any | null;
  openModal: (product: any) => void;
  closeModal: () => void;
}

const QuickAddContext = createContext<QuickAddContextType | undefined>(undefined);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <QuickAddContext.Provider value={{ isModalOpen, selectedProduct, openModal, closeModal }}>
      {children}
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const context = useContext(QuickAddContext);
  if (context === undefined) {
    throw new Error('useQuickAdd must be used within a QuickAddProvider');
  }
  return context;
}
