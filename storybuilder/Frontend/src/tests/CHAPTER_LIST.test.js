import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import CHAPTER_LIST from '../components/CHAPTER_LIST';
import { useNavigate } from 'react-router';
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

const mock_state = {
  current_story: {
      title: "Mock Story",
      chapters: ["Chapter 1 Mock Data", "Chapter 2 Mock Data"],
  },
};

describe('CHAPTER_LIST Component', () => {
  test('should render the View Entire Story button', () => {
    render(
      <MemoryRouter>
        <STORY_CONTEXT.Provider value={{ state: mock_state }}>
          <CHAPTER_LIST/>
        </STORY_CONTEXT.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('View Entire Story')).toBeInTheDocument();
  });

  test('should render chapter buttons', () => {
    render(
      <MemoryRouter>
        <STORY_CONTEXT.Provider value={{ state: mock_state }}>
          <CHAPTER_LIST/>
        </STORY_CONTEXT.Provider>
      </MemoryRouter>
    );
    // Chapter list automatically puts index + 1 of chapter
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
  });

  test('should navigate to STORY_VIEW when clicking View Entire Story', () => {
    const mock_navigate = jest.fn();
    useNavigate.mockReturnValue(mock_navigate);
  
    render(
      <MemoryRouter>
        <STORY_CONTEXT.Provider value={{ state: mock_state }}>
          <CHAPTER_LIST/>
        </STORY_CONTEXT.Provider>
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('View Entire Story'));
  
    expect(mock_navigate).toHaveBeenCalledWith('/story/1/view');
  });

  test('should navigate to CHAPTER_VIEW when clicking Chapter 1: A New Journey', () => {
    const mock_navigate = jest.fn();
    useNavigate.mockReturnValue(mock_navigate);
  
    render(
      <MemoryRouter>
        <STORY_CONTEXT.Provider value={{ state: mock_state }}>
          <CHAPTER_LIST/>
        </STORY_CONTEXT.Provider>
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Chapter 1'));
  
    expect(mock_navigate).toHaveBeenCalledWith('/story/1/view/1');
  });
});