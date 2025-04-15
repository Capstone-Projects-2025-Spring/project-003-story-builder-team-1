import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import STORY_LIST from '../components/STORY_LIST';
import { waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router';

// Mock useNavigate
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

// Story 1 still hardcoded in STORY_LIST.js, will need to be changed

describe('STORY_LIST Component', () => {
  test('renders all stories', () => {
    render(
      <MemoryRouter>
        <STORY_LIST />
      </MemoryRouter>
    );

    // Check if all stories are rendered
    expect(screen.getByText('Story 1')).toBeInTheDocument();
  });

  test('expands and collapses a story when clicked', async () => {
    render(
      <MemoryRouter>
        <STORY_LIST />
      </MemoryRouter>
    );

    expect(screen.getByText('Story 1')).toBeInTheDocument();

    // Initially, the collapse section should not be visible
    expect(screen.queryByText('View Story')).not.toBeVisible();

    // Click to expand
    fireEvent.click(screen.getByText('Story 1'));
    await waitFor(() => {
        expect(screen.getByText('View Story')).toBeVisible();
        expect(screen.getByText('Agents')).toBeVisible();
    });

    // Click again to collapse
    fireEvent.click(screen.getByText('Story 1'));
    await waitFor(() => {
        expect(screen.queryByText('View Story')).not.toBeVisible();
    });
  });

  test('navigates to correct pages when buttons are clicked', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <STORY_LIST />
      </MemoryRouter>
    );

    // Expand Story 1
    fireEvent.click(screen.getByText('Story 1'));

    // Click "View Story"
    fireEvent.click(screen.getByText('View Story'));
    expect(mockNavigate).toHaveBeenCalledWith('/story/1/view');

    // Click "Agents"
    fireEvent.click(screen.getByText('Agents'));
    expect(mockNavigate).toHaveBeenCalledWith('/story/1/agents');
  });
});
