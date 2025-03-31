import { render, screen } from '../setupTests';
import STORY_VIEW from '../components/STORY_VIEW'; // Adjust the path if necessary

describe('STORY_VIEW Component', () => {
  test('renders the default story content', () => {
    render(<STORY_VIEW />);

    // Check if the default title, chapter title, and chapter text are rendered
    expect(screen.getByText('The Adventure Begins')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1: A New Journey')).toBeInTheDocument();
    expect(screen.getByText(/Once upon a time, in a land far away/)).toBeInTheDocument();
  });

  test('renders custom story content when props are provided', () => {
    const customStoryTitle = 'Epic Journey';
    const customChapterTitle = 'Chapter 1: The Call';
    const customChapterText = 'In the heart of a bustling city, a lone figure stood on the balcony, gazing into the horizon...';

    render(
      <STORY_VIEW
        story_title={customStoryTitle}
        chapter_title={customChapterTitle}
        chapter_text={customChapterText}
      />
    );

    // Check if the custom title, chapter title, and chapter text are rendered
    expect(screen.getByText(customStoryTitle)).toBeInTheDocument();
    expect(screen.getByText(customChapterTitle)).toBeInTheDocument();
    expect(screen.getByText(customChapterText)).toBeInTheDocument();
  });
});
