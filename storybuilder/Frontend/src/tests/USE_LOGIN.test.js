import { renderHook, act } from '@testing-library/react';
import USE_LOGIN from '../hooks/USE_LOGIN';

// Mocking the module properly before any imports
jest.mock('../hooks/USE_AXIOS', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

describe('USE_LOGIN Hook', () => {
  test('should return error when username is empty', async () => {
    const mock_use_axios = require('../hooks/USE_AXIOS').default;
    mock_use_axios.mockReturnValue({
        use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Username must not be empty' }),
      });
    const { result } = renderHook(() => USE_LOGIN());
    
    // Run the login function with an empty username
    await act(async () => {
      await result.current.login('', 'password');
    });

    // Check that user_error state is set correctly
    expect(result.current.user_error).toBe('Username must not be empty');
  });

  it('should return error when password is empty', async () => {
    const mock_use_axios = require('../hooks/USE_AXIOS').default;
    mock_use_axios.mockReturnValue({
        use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Password must not be empty' }),
      });
    const { result } = renderHook(() => USE_LOGIN());
    
    // Run the login function with an empty password
    await act(async () => {
      await result.current.login('username', '');
    });

    // Check that pass_error state is set correctly
    expect(result.current.pass_error).toBe('Password must not be empty');
  });

  it('should make API call and handle error response', async () => {
    const mock_use_axios = require('../hooks/USE_AXIOS').default;
    mock_use_axios.mockReturnValue({
        use_axios: jest.fn().mockResolvedValue({ data: null, error: 'API error' }),
      });
    const { result } = renderHook(() => USE_LOGIN());

    // Run the login function
    await act(async () => {
      await result.current.login('username', 'password');
    });

    // Check that API error state is set
    expect(result.current.api_error).toBe('API error');
  });

  it('should return true if login is successful', async () => {
    const mock_use_axios = require('../hooks/USE_AXIOS').default;
    mock_use_axios.mockReturnValue({
        use_axios: jest.fn().mockResolvedValue({ data: { user: 'username' }, error: null }),
      });
    const { result } = renderHook(() => USE_LOGIN());

    // Run the login function
    await act(async () => {
      const success = await result.current.login('username', 'password');
      expect(success).toBe(true);
    });
  });
});