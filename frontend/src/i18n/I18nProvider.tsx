'use client';
import {createContext, ReactNode, useContext} from 'react';
import {Locale} from './config';
import { Messages } from './types';

type I18nContextType = {
  locale: Locale;
  messages: Messages;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  locale,
  messages,
  children
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{locale, messages}}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
