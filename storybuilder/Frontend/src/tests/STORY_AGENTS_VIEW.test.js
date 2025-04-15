import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import STORY_AGENTS_VIEW from '../components/STORY_AGENTS_VIEW';
import { useNavigate } from 'react-router';
import STORY_CONTEXT from '../context/STORY_CONTEXT';

jest.mock("axios", () => ({
  default: jest.fn(),
}));

// mock navigate
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

const mock_state = {
  current_story: {
      title: "Mock Story",
      chapters: ["Chapter 1 Mock Data", "Chapter 2 Mock Data"],
  },
};

describe('STORY_AGENTS_VIEW Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders agents correctly', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
        <MemoryRouter>
          <STORY_AGENTS_VIEW />
        </MemoryRouter>
      </STORY_CONTEXT.Provider>
    );

    // Agent 1 still hardcoded in STORY_AGENTS_VIEW.js, will need to be changed
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText("Chapter 2 Mock Data")).toBeInTheDocument();
  });

  // test('renders the Continue button', () => {
  //   render(
  //     <MemoryRouter>
  //       <STORY_AGENTS_VIEW />
  //     </MemoryRouter>
  //   );

  //   // Check for the button
  //   expect(screen.getByText('Continue')).toBeInTheDocument();
  // });

  // // This will need to be changed once continue is implemented
  // test('navigates to /next-step when Continue button is clicked', () => {
  //   render(
  //     <MemoryRouter>
  //       <STORY_AGENTS_VIEW />
  //     </MemoryRouter>
  //   );

  //   const continueButton = screen.getByText('Continue');
  //   fireEvent.click(continueButton);

  //   // Ensure navigation is called with the correct path
  //   expect(mockNavigate).toHaveBeenCalledWith('/next-step');
  // });
});
