import { render, screen } from '../setupTests';
import STORY_CONTEXT from '../context/STORY_CONTEXT';
import { Story_Provider } from '../context/STORY_CONTEXT';
import { waitFor } from '@testing-library/react';
import React from 'react';
import USE_AXIOS from '../hooks/USE_AXIOS';
import { renderHook, act } from '@testing-library/react';

// Mocking USE_AXIOS hook to control axios behavior in tests
jest.mock('../hooks/USE_AXIOS', () => ({
  __esModule: true,
  default: jest.fn(() => ({
      use_axios: jest.fn(),
  })),
}));

describe('Story Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle submitting a story prompt successfully', async () => {
    const mockResponse = {
      data: {
          data: {
              title: 'Mock Story',
              courier_response: 'Mock Chapter Content',
          },
      },
    };

    // Mock the `use_axios` hook to return mockResponse for the story submission
    USE_AXIOS.mockImplementationOnce(() => ({
      use_axios: jest.fn().mockResolvedValue({ data: mockResponse.data, error: null }),
    }));

    const TestComponent = () => {
      console.log('2.5');
      const { state, submit_story_prompt } = React.useContext(STORY_CONTEXT);

      React.useEffect(() => {
        console.log('2.75');
        submit_story_prompt('My Story', 5, 'Story details', 'Extra details');
      }, []);

      console.log("3");
      return (
        <div>
          <h1>{state.current_story?.title}</h1>
          <p>{state.current_story?.chapters?.[0]}</p>
        </div>
      );
    };

    console.log("2");

    render(
      <Story_Provider>
        <TestComponent />
      </Story_Provider>
    );

    console.log("3");

    // await waitFor(() => {
    //   console.log("4");
    //   expect(screen.getByText('Story Title')).toBeInTheDocument();
    //   expect(screen.getByText('Chapter 1 Mock Data')).toBeInTheDocument();
    // });

    // Wait for async actions to complete
    await waitFor(() => {
      // Ensure the state update and rendering happen after the submit
      expect(result.current.state.current_story.title).toBe('Mock Story');
      expect(result.current.state.current_story.chapters[0]).toBe('Mock Chapter Content');
    });

    // Ensure the mock was called with the expected parameters
    const mockAxios = USE_AXIOS().use_axios;
    expect(mockAxios).toHaveBeenCalledWith(
      'http://localhost:8080/translator/story_outline',
      'POST',
      {
        story_name: 'My Story',
        chapter_count: 5,
        story_details: 'Story details',
        extra_details: 'Extra details',
      }
    );
  });

  test('should submit story prompt and receive response', async () => {
    // Use renderHook to test the hook directly
    const { result, waitForNextUpdate } = renderHook(() => USE_AXIOS());

    const { use_axios } = result.current;
    const { data, error } = await use_axios('/error');

    // Trigger the use_axios function to make the API call
    act(() => {
      result.current.use_axios('http://localhost:8080/translator/story_outline', 'POST', {
        story_name: 'My Story',
        chapter_count: 5,
        story_details: 'Story details',
        extra_details: 'Extra details',
      });
    });

    // Wait for the promise to resolve
    await waitForNextUpdate();

    // Assert that the mock use_axios was called with the correct parameters
    expect(result.current.use_axios).toHaveBeenCalledWith(
      'http://localhost:8080/translator/story_outline',
      'POST',
      {
        story_name: 'My Story',
        chapter_count: 5,
        story_details: 'Story details',
        extra_details: 'Extra details',
      }
    );

    // Assert that the response was correctly handled
    expect(result.current.use_axios).toHaveReturnedWith({
      data: {
        title: 'Story Title',
        chapters: ['Chapter 1 Mock Data'],
      },
      error: null,
    });
  });
  
    // test('should handle API errors correctly', async () => {
    //   // mock USE_AXIOS
    //   jest.mock('../hooks/USE_AXIOS', () => ({
    //     __esModule: true,
    //     default: jest.fn(() => ({
    //       use_axios: jest.fn().mockResolvedValue({
    //         data: null,
    //         error: 'Request failed with status code 500',}), // Mocked success response
    //     })),
    //   }));
  
    //   const TestComponent = () => {
    //     const { state, submit_story_prompt } = React.useContext(STORY_CONTEXT);
  
    //     React.useEffect(() => {
    //       submit_story_prompt('My Story', 5, 'Story details', 'Extra details');
    //     }, []);
  
    //     return (
    //       <div>
    //         {state.error && <p>{state.error}</p>}
    //       </div>
    //     );
    //   };
  
    //   render(
    //     <Story_Provider>
    //       <TestComponent />
    //     </Story_Provider>
    //   );
  
    //   await waitFor(() => {
    //     // Check if the error message appears after failure
    //     expect(screen.getByText('Request failed with status code 500')).toBeInTheDocument();
    //   });
  
    //   // Ensure the mock was called with the expected parameters
    //   expect(USE_AXIOS.mock.calls[0][0]).toBe('http://localhost:8080/translator/story_outline');
    //   expect(USE_AXIOS.mock.calls[0][1]).toBe('POST');
    //   expect(USE_AXIOS.mock.calls[0][2]).toEqual({
    //     story_name: 'My Story',
    //     chapter_count: 5,
    //     story_details: 'Story details',
    //     extra_details: 'Extra details',
    //   });
    // });
  
    // test('should fetch and append next chapter', async () => {
    //   // Mock the response for the GET request for the next chapter
    //   axios.get.mockResolvedValueOnce({
    //     data: 'This is chapter 2 content.',
    //   });
  
    //   const TestComponent = () => {
    //     const { state, fetch_next_chapter } = React.useContext(STORY_CONTEXT);
  
    //     React.useEffect(() => {
    //       fetch_next_chapter(1, 2);
    //     }, [fetch_next_chapter]);
  
    //     return (
    //       <div>
    //         <p>{state.current_story?.chapters?.[1]}</p>
    //       </div>
    //     );
    //   };
  
    //   render(
    //     <Story_Provider>
    //       <TestComponent />
    //     </Story_Provider>
    //   );
  
    //   await waitFor(() => {
    //     // Check if the second chapter is fetched and displayed
    //     expect(screen.getByText('This is chapter 2 content.')).toBeInTheDocument();
    //   });
  
    //   // Ensure the mock was called with the correct URL and parameters
    //   expect(axios.get).toHaveBeenCalledWith('https://your-backend.com/api/story/1/chapter/2');
    // });
  });