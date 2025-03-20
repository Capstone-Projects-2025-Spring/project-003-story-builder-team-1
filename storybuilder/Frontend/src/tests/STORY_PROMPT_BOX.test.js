import { render, screen, fireEvent } from '../setupTests';
import STORY_PROMPT_BOX from './components/STORY_PROMPT_BOX';

test('renders STORY_PROMPT_BOX component and accepts input', () => {
  render(<STORY_PROMPT_BOX />);

  // Check if all labels are in the document
  expect(screen.getByLabelText(/Story Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Number of Chapters/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Story Prompt/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument();

  // Check if the "Send Prompt" button is in the document
  const sendButton = screen.getByText(/Send Prompt/i);
  expect(sendButton).toBeInTheDocument();

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Story Title/i), { target: { value: 'Test Story Title' } });
  fireEvent.change(screen.getByLabelText(/Number of Chapters/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/Story Prompt/i), { target: { value: 'Test Story Prompt' } });
  fireEvent.change(screen.getByLabelText(/Additional Information/i), { target: { value: 'Test Additional Info' } });

  // Check if the inputs are correctly updated
  expect(screen.getByLabelText(/Story Title/i).value).toBe('Test Story Title');
  expect(screen.getByLabelText(/Number of Chapters/i).value).toBe('5');
  expect(screen.getByLabelText(/Story Prompt/i).value).toBe('Test Story Prompt');
  expect(screen.getByLabelText(/Additional Information/i).value).toBe('Test Additional Info');

  // Simulate button click (you can assert if it calls a function or triggers an action)
  fireEvent.click(sendButton);
  // You can add more assertions here based on what happens when the button is clicked
});
