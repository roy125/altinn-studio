import React from 'react';
import { screen } from '@testing-library/react';
import { APP_DEVELOPMENT_BASENAME } from 'app-shared/constants';
import { renderWithProviders } from '../../../test/testUtils';
import DataModellingContainer from './DataModellingContainer';

describe('DataModellingContainer', () => {
  it('should render data modelling container', () => {
    renderWithProviders(<DataModellingContainer />, {
      startUrl: `${APP_DEVELOPMENT_BASENAME}/test-org/test-app`,
    });
    const container = screen.getByTestId('data-modelling-container');
    expect(container).toBeInTheDocument();
  });
});
