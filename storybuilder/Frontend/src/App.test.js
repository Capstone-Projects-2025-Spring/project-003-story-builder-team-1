import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./App";

// Mock scrollIntoView to prevent test failures
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock global fetch
global.fetch = jest.fn();

describe("App Component", () => {
  beforeEach(() => {
    fetch.mockClear(); // Reset fetch mock before each test
  });

  test("renders the main UI elements", () => {
    render(<App />);
    
    // Check if input box is present
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    
    // Check if send button is present
    expect(screen.getByRole("button")).toBeInTheDocument();
    
    // Check if AI's initial message is rendered
    expect(screen.getByText("What story should I write?")).toBeInTheDocument();
  });

  test("updates input text when typed", () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "Hello AI" } });
    
    expect(input.value).toBe("Hello AI");
  });

  test("sends a message and receives AI response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "AI response" }),
    });

    render(<App />);

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "Hello AI" } });

    const sendButton = screen.getByRole("button");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Hello AI")).toBeInTheDocument();
      expect(screen.getByText("AI response")).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Mocking the fetch function to simulate an API error
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error: Content field required' }),
    });
  
    render(<App />);
  
    // Simulating sending a message
    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'Test error' } });
  
    // Using alt text to find the send button
    fireEvent.click(screen.getByAltText('Send'));
  
    // Wait for the error message to appear in the UI
    await waitFor(() => {
      // Match the exact error message as displayed in the UI
      expect(screen.findByText('Content field required')).not.toBeNull();
    });
  });
});