import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  }
}));

test('renders app successfully', () => {
  render(<App />);
  const textElement = screen.getByText(/All Items/i);
  expect(textElement).toBeInTheDocument();
});
