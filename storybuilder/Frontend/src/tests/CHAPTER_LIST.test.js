import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import CHAPTER_LIST from '../components/CHAPTER_LIST';
import { useNavigate } from 'react-router';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

const mockChapters = [
  { id: 1, title: "Chapter 1: A New Journey", text: "Once upon a time, in a land far away..." },
  { id: 2, title: "Chapter 2: The First Challenge", text: "The hero faced a mighty beast in the forest..." },
  { id: 3, title: "Chapter 3: An Unexpected Ally", text: "A mysterious stranger appeared, offering guidance..." },
  { id: 4, title: "Chapter 4: The Darkest Hour", text: "The hero ventured into the dark cave, facing danger..." },
  { id: 5, title: "Chapter 5: The Final Battle", text: "The hero fought valiantly against the ultimate foe..." }
];

describe('CHAPTER_LIST Component', () => {
  test('should render the View Entire Story button', () => {
    render(
      <MemoryRouter>
        <CHAPTER_LIST chapters={mockChapters} storyId="1" />
      </MemoryRouter>
    );
    expect(screen.getByText('View Entire Story')).toBeInTheDocument();
  });

  test('should render chapter buttons', () => {
    render(
      <MemoryRouter>
        <CHAPTER_LIST chapters={mockChapters} storyId="1" />
      </MemoryRouter>
    );
    expect(screen.getByText('Chapter 1: A New Journey')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2: The First Challenge')).toBeInTheDocument();
  });

  test('should navigate to STORY_VIEW when clicking View Entire Story', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    render(
      <MemoryRouter>
        <CHAPTER_LIST chapters={mockChapters} storyId="1" />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('View Entire Story'));
  
    expect(mockNavigate).toHaveBeenCalledWith('/story/1/view');
  });

  test('should navigate to CHAPTER_VIEW when clicking Chapter 1: A New Journey', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    render(
      <MemoryRouter>
        <CHAPTER_LIST chapters={mockChapters} storyId="1" />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Chapter 1: A New Journey'));
  
    expect(mockNavigate).toHaveBeenCalledWith('/story/1/view/1');
  });
});