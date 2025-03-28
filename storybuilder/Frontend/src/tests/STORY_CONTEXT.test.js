import { render, screen, fireEvent } from '../setupTests';
import STORY_CONTEXT from '../context/STORY_CONTEXT';
import { Story_Provider } from '../context/STORY_CONTEXT';
import { waitFor } from '@testing-library/react';
import React from 'react';
import axios from "axios";

// mock axios
jest.mock("axios", () => ({
    post: jest.fn(),
}));

// Initial state and mock data
const mock_state = {
  current_story: {
    title: "Mock Story",
    chapters: ["Chapter 1 Mock Data"],
  },
};

describe('Story Context', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any previous mock calls before each test
    });
  
    test('should handle submitting a story prompt successfully', async () => {
      // Mock the response for the POST request
      axios.post.mockResolvedValueOnce({
        data: {
          data: {
            title: 'Story Title',
            courier_response: 'Chapter 1 Mock Data',
          },
        },
      });
  
      const TestComponent = () => {
        const { state, submit_story_prompt } = React.useContext(STORY_CONTEXT);
  
        React.useEffect(() => {
          submit_story_prompt('My Story', 5, 'Story details', 'Extra details');
        }, []);
  
        return (
          <div>
            <h1>{state.current_story?.title}</h1>
            <p>{state.current_story?.chapters?.[0]}</p>
          </div>
        );
      };
  
      render(
        <Story_Provider>
          <TestComponent />
        </Story_Provider>
      );
  
      await waitFor(() => {
        // Check if the title and first chapter appear after the fetch
        expect(screen.getByText('Story Title')).toBeInTheDocument();
        expect(screen.getByText('Chapter 1 Mock Data')).toBeInTheDocument();
      });
  
      // Ensure the mock was called with the expected parameters
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/translator/story_contents', {
        story_name: 'My Story',
        chapter_count: 5,
        story_details: 'Story details',
        extra_details: 'Extra details',
      });
    });
  
    test('should handle API errors correctly', async () => {
      // Mock the response for the POST request to simulate an error
      axios.post.mockRejectedValueOnce(new Error('Request failed with status code 500'));
  
      const TestComponent = () => {
        const { state, submit_story_prompt } = React.useContext(STORY_CONTEXT);
  
        React.useEffect(() => {
          submit_story_prompt('My Story', 5, 'Story details', 'Extra details');
        }, []);
  
        return (
          <div>
            {state.error && <p>{state.error}</p>}
          </div>
        );
      };
  
      render(
        <Story_Provider>
          <TestComponent />
        </Story_Provider>
      );
  
      await waitFor(() => {
        // Check if the error message appears after failure
        expect(screen.getByText('Request failed with status code 500')).toBeInTheDocument();
      });
  
      // Ensure the mock was called as expected
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/translator/story_contents', {
        story_name: 'My Story',
        chapter_count: 5,
        story_details: 'Story details',
        extra_details: 'Extra details',
      });
    });
  
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