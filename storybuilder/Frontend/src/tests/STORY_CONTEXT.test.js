import React from 'react';
import { render, screen } from '../setupTests';
import STORY_CONTEXT from '../context/STORY_CONTEXT';
import { Story_Provider } from '../context/STORY_CONTEXT';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mock_use_axios = jest.fn();

// Mock USE_AXIOS hook
jest.mock('../hooks/USE_AXIOS', () => () => ({
  use_axios: mock_use_axios
}));

function TestComponent() {
  const { state, submit_story_prompt, story_name_error } = React.useContext(STORY_CONTEXT);
  console.log(state.current_story);

  return (
    <div>
      <button
        onClick={() =>
          submit_story_prompt('Mock Title', '5', 'A story prompt', 'Extra details')
        }
      >
        Submit
      </button>
      <div data-testid="story-title">
        {state.current_story?.title || 'No Title'}
      </div>
      <div data-testid="story-content">
        {state.current_story?.chapters || 'No Outline'}
      </div>
      <div data-testid="story-name-error">{story_name_error}</div>
    </div>
  );
}

describe('Story Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls use_axios and sets story on success', async () => {
    mock_use_axios.mockResolvedValue({
      data: {
      data: {
        title: 'Mock Title',
        courier_response: 'Mock Outline',
      },
      error: null,
    }
    });

    render(
        <Story_Provider>
            <TestComponent />
        </Story_Provider>
    );

    const button = screen.getByText('Submit');
    userEvent.click(button);

    await waitFor(() => {
        expect(screen.getByTestId('story-title')).toHaveTextContent('Mock Title');
        expect(screen.getByTestId('story-content')).toHaveTextContent('Mock Outline');
    });
});

});