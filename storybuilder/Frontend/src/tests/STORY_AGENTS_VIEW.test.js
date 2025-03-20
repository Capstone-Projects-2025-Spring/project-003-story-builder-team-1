import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import STORY_AGENTS_VIEW from '../components/STORY_AGENTS_VIEW';
import { useNavigate } from 'react-router';

// Mock useNavigate
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('STORY_AGENTS_VIEW Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders agents correctly', () => {
    render(
      <MemoryRouter>
        <STORY_AGENTS_VIEW />
      </MemoryRouter>
    );

    // Check for agents being displayed
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Agent 2')).toBeInTheDocument();
    expect(screen.getByText("Another response from a different agent, providing insight into the story...")).toBeInTheDocument();
  });

  test('renders the Continue button', () => {
    render(
      <MemoryRouter>
        <STORY_AGENTS_VIEW />
      </MemoryRouter>
    );

    // Check for the button
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  // This will need to be changed once continue is implemented
  test('navigates to /next-step when Continue button is clicked', () => {
    render(
      <MemoryRouter>
        <STORY_AGENTS_VIEW />
      </MemoryRouter>
    );

    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Ensure navigation is called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/next-step');
  });
});
