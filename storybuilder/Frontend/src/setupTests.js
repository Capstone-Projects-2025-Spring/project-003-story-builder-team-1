import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Custom render function to include Mantine's provider in all tests
const customRender = (ui, options) =>
  render(<MantineProvider>{ui}</MantineProvider>, options);

// Re-export everything for convenience
export * from '@testing-library/react';

// Override the render method
export { customRender as render };