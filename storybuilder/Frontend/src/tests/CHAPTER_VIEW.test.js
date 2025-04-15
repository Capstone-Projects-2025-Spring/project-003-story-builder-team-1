import { render, screen } from '../setupTests';
import { MemoryRouter, Route, Routes } from 'react-router';
import CHAPTER_VIEW from '../components/CHAPTER_VIEW';
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

describe('CHAPTER_VIEW Component', () => {
  // check this one again when looking over tests
  test('renders the correct chapter based on chapterId', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
      <MemoryRouter initialEntries={["/story/1/view/1"]}>
        <Routes>
          <Route path="/story/:story_id/view/:chapter_id" element={<CHAPTER_VIEW />} />
        </Routes>
      </MemoryRouter>
      </STORY_CONTEXT.Provider>
    );

    expect(screen.getByText("Chapter 2 Mock Data")).toBeInTheDocument();

    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
        <MemoryRouter initialEntries={["/story/1/view/2"]}>
          <Routes>
            <Route path="/story/:story_id/view/:chapter_id" element={<CHAPTER_VIEW />} />
          </Routes>
        </MemoryRouter>
      </STORY_CONTEXT.Provider>
    );

    expect(screen.getByText("Chapter 2 Mock Data")).toBeInTheDocument();
  });

  test('renders error message when chapter is not found', () => {
    render(
      <STORY_CONTEXT.Provider value={{ state: mock_state }}>
        <MemoryRouter initialEntries={["/story/1/view/999"]}>
          <Routes>
            <Route path="/story/:story_id/view/:chapter_id" element={<CHAPTER_VIEW />} />
          </Routes>
        </MemoryRouter>
      </STORY_CONTEXT.Provider>
    );

    expect(screen.getByText("Chapter not found!")).toBeInTheDocument();
  });
});