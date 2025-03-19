import { render, screen, fireEvent } from '../setupTests';
import { BrowserRouter } from 'react-router';
import CHAPTER_LIST from '../components/CHAPTER_LIST';

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
      <BrowserRouter>
        <CHAPTER_LIST chapters={mockChapters} storyId="1" />
      </BrowserRouter>
    );
    expect(screen.getByText('View Entire Story')).toBeInTheDocument();
  });
});