import { render, screen } from '../setupTests';
import { MemoryRouter } from 'react-router';
import MAIN_LAYOUT from '../components/MAIN_LAYOUT';
import STORY_LIST from '../components/STORY_LIST';
import CHAPTER_LIST from '../components/CHAPTER_LIST';
import userEvent from '@testing-library/user-event';

// Mock dependencies
jest.mock('../components/STORY_LIST', () => () => <div data-testid="story-list">Mock Story List</div>);
jest.mock('../components/CHAPTER_LIST', () => () => <div data-testid="chapter-list">Mock Chapter List</div>);

describe('MAIN_LAYOUT Component', () => {
    test('renders the header with logo and title', () => {
        render(
            <MemoryRouter>
                <MAIN_LAYOUT>
                    <div data-testid="child-content">Main Content</div>
                </MAIN_LAYOUT>
            </MemoryRouter>
        );

        expect(screen.getByAltText('Logo')).toBeInTheDocument();
        expect(screen.getByText('StoryBuilderAI')).toBeInTheDocument();
    });

    test('renders STORY_LIST inside navbar', () => {
        render(
            <MemoryRouter>
                <MAIN_LAYOUT>
                    <div />
                </MAIN_LAYOUT>
            </MemoryRouter>
        );


        expect(screen.getByTestId('story-list')).toBeInTheDocument();
    });

    test('renders child content properly', () => {
        render(
            <MemoryRouter>
                <MAIN_LAYOUT>
                    <div data-testid="child-content">Test Child</div>
                </MAIN_LAYOUT>
            </MemoryRouter>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    test('renders CHAPTER_LIST only on /story route', () => {
        render(
            <MemoryRouter initialEntries={['/story/1']}>
                <MAIN_LAYOUT>
                    <div />
                </MAIN_LAYOUT>
            </MemoryRouter>
        );

        expect(screen.getByTestId('chapter-list')).toBeInTheDocument();
    });

    test('does not render CHAPTER_LIST on non-story routes', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <MAIN_LAYOUT>
                    <div />
                </MAIN_LAYOUT>
            </MemoryRouter>
        );

        expect(screen.queryByTestId('chapter-list')).not.toBeInTheDocument();
    });

    // NEED TO REVISIT THIS ONCE EVERYTHING IS WORKING
    // test('updates selected_chapter when a chapter is clicked', async () => {
    //     render(
    //         <MemoryRouter initialEntries={['/story/1']}>
    //             <MAIN_LAYOUT>
    //                 <div />
    //             </MAIN_LAYOUT>
    //         </MemoryRouter>
    //     );

    //     const chapterButton = screen.getByText('Chapter 1: A New Journey');
    //     userEvent.click(chapterButton);

    //     // Ensure state update happens (though state updates aren't directly testable, clicking should not throw errors)
    //     await waitFor(() => {
    //         expect(screen.getByText('Chapter 1: A New Journey')).toBeInTheDocument();
    //     });
    // });
});
