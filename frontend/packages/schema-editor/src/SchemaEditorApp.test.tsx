import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { SchemaEditorApp } from './SchemaEditorApp';
import { dataMock } from './mockData';

let container: any = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders schema editor app', () => {
  render(
    <SchemaEditorApp
      schema={dataMock}
      schemaState={{ saving: false }}
      onSaveSchema={jest.fn()}
      name='test'
      LandingPagePanel={<div>landing page panel goes here</div>}
    />
  );
  expect(screen.getByTestId('schema-editor')).toBeDefined();
});
