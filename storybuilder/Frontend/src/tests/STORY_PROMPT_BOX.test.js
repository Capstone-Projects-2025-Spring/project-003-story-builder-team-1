import { render, screen, fireEvent } from '../setupTests';
import STORY_PROMPT_BOX from '../components/STORY_PROMPT_BOX';
import { useNavigate } from 'react-router';
import { MemoryRouter } from 'react-router';
import STORY_CONTEXT from '../context/STORY_CONTEXT';

// mock axios
jest.mock("axios", () => ({
  default: jest.fn(),
}));

// mock navigate
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

test('renders STORY_PROMPT_BOX component and accepts input', () => {
  const mock_navigate = jest.fn();
  useNavigate.mockReturnValue(mock_navigate);
  const mock_submit_story_prompt = jest.fn();
  render(
    <STORY_CONTEXT.Provider value={{ submit_story_prompt: mock_submit_story_prompt }}>
      <MemoryRouter>
        <STORY_PROMPT_BOX />
      </MemoryRouter>
    </STORY_CONTEXT.Provider>
  );

  // Check if all labels are in the document
  expect(screen.getByLabelText(/Story Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Number of Chapters/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Story Prompt/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Additional Information/i)).toBeInTheDocument();

  // Check if the "Send Prompt" button is in the document
  const send_button = screen.getByText(/Send Prompt/i);
  expect(send_button).toBeInTheDocument();

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

  // Simulate button click *** this is still hardcoded to story 1, must change in STORY_PROMPT_BOX once multiple stories are supported
  fireEvent.click(send_button);
  expect(mock_navigate).toHaveBeenCalledWith('/story/1/agents');
});
