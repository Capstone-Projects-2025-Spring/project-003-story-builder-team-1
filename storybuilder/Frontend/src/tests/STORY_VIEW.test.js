import { render, screen } from '../setupTests';
import STORY_VIEW from '../components/STORY_VIEW';
import { Story_Provider } from '../context/STORY_CONTEXT'
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

describe('STORY_VIEW Component', () => {
  test('renders the default story content', () => {
    render(
      <Story_Provider>
          <STORY_VIEW />
      </Story_Provider>
    );

    expect(screen.getByText('Story Title')).toBeInTheDocument();
  });

  test('renders the story content provided', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
          <STORY_VIEW />
      </STORY_CONTEXT.Provider>
    );

    // Check if the mock data is rendered
    expect(screen.getByText('Mock Story')).toBeInTheDocument();
    expect(screen.getByText("Chapter 2 Mock Data")).toBeInTheDocument();
  });
});
