import { renderHook, act } from '@testing-library/react';
import USE_CREATE_ACCOUNT from '../hooks/USE_CREATE_ACCOUNT';

// Mocking the module properly before any imports
jest.mock('../hooks/USE_AXIOS', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('USE_CREATE_ACCOUNT Hook', () => {
    test('should return error when username is empty', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Username must not be empty' }),
          });
        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        // Run the login function with an empty username
        await act(async () => {
          await result.current.create_account('', 'password');
        });
    
        // Check that user_error state is set correctly
        expect(result.current.user_error).toBe('Username must not be empty');
      });
});