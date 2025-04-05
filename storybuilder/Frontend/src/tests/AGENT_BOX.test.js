import { render, screen, fireEvent } from '../setupTests';
import AGENT_BOX from '../components/AGENT_BOX';
import STORY_CONTEXT from '../context/STORY_CONTEXT';

jest.mock("axios", () => ({
  default: jest.fn(),
}));

const mock_state = {
  current_story: {
      title: "Mock Story",
      chapters: ["Chapter 1 Mock Data", "Chapter 2 Mock Data"],
  },
};

describe('AGENT_BOX Component', () => {
  test('should render agent name and response correctly', () => {
    render(
    <STORY_CONTEXT.Provider value={{ state: mock_state }}>
      <AGENT_BOX name="Agent 1" />
    </STORY_CONTEXT.Provider>
    );

    // Agent 1 still hardcoded in STORY_AGENTS_VIEW.js, will need to be changed
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1 Mock Data')).toBeInTheDocument();
  });

  test('should render the View button', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
        <AGENT_BOX name="Agent 1" />
      </STORY_CONTEXT.Provider>
    );
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  test('should open the modal when the View button is clicked', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
        <AGENT_BOX name="Agent 1" />
      </STORY_CONTEXT.Provider>
    );
    fireEvent.click(screen.getByText('View'));
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1 Mock Data')).toBeInTheDocument();
  });
});