import { render, screen } from '../setupTests';
import { MemoryRouter, Route, Routes } from 'react-router';
import CHAPTER_VIEW from '../components/CHAPTER_VIEW';

const mockChapters = [
  { id: 1, title: "Chapter 1: A New Journey", text: "Once upon a time, in a land far away..." },
  { id: 2, title: "Chapter 2: The First Challenge", text: "The hero faced a mighty beast in the forest..." },
];

describe('CHAPTER_VIEW Component', () => {
  test('renders the correct chapter based on chapterId', () => {
    render(
      <MemoryRouter initialEntries={["/story/1/view/1"]}>
        <Routes>
          <Route path="/story/:storyId/view/:chapterId" element={<CHAPTER_VIEW />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Chapter 1: A New Journey")).toBeInTheDocument();
    expect(screen.getByText("Once upon a time, in a land far away...")).toBeInTheDocument();

    render(
        <MemoryRouter initialEntries={["/story/1/view/2"]}>
          <Routes>
            <Route path="/story/:storyId/view/:chapterId" element={<CHAPTER_VIEW />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText("Chapter 2: The First Challenge")).toBeInTheDocument();
    expect(screen.getByText("The hero faced a mighty beast in the forest...")).toBeInTheDocument();
  });

  test('renders error message when chapter is not found', () => {
    render(
      <MemoryRouter initialEntries={["/story/1/view/999"]}>
        <Routes>
          <Route path="/story/:storyId/view/:chapterId" element={<CHAPTER_VIEW />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Chapter not found!")).toBeInTheDocument();
  });
});