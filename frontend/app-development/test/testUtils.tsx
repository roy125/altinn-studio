import React from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { PreloadedState } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { AppStore, RootState } from '../store';
import { setupStore } from '../store';
import { APP_DEVELOPMENT_BASENAME } from 'app-shared/constants';
import { ServicesContextProps, ServicesContextProvider } from '../common/ServiceContext';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  startUrl?: string;
  queries?: Partial<ServicesContextProps>;
}

export const renderWithProviders = (
  component: any,
  {
    preloadedState = {},
    queries = {},
    store = setupStore(preloadedState),
    startUrl = undefined,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: React.PropsWithChildren<unknown>) {
    return (
      <Provider store={store}>
        <MemoryRouter basename={APP_DEVELOPMENT_BASENAME} initialEntries={[startUrl]}>
          <ServicesContextProvider {...queries}>
            <Routes>
              <Route path='/:org/:app/*' element={children} />
            </Routes>
          </ServicesContextProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(component, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
};
