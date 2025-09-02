// app/store-provider.tsx
'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface StoreProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}