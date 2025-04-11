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

    test('should return error when username is not alphanumeric', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Username must be alphanumeric' }),
        });

        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        await act(async () => {
            await result.current.create_account('user@name', 'password', 'password', 100);
        });

        expect(result.current.user_error).toBe('Username must be alphanumeric');
    });

    test('should return error when password is empty', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Password must not be empty' }),
          });
        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        // Run the login function with an empty password
        await act(async () => {
          await result.current.create_account('username', '');
        });
    
        // Check that pass_error state is set correctly
        expect(result.current.pass_error).toBe('Password must not be empty');
    });

    test('should return error when password strength is not 100', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Password must be stronger' }),
        });

        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        await act(async () => {
            await result.current.create_account('username', 'password', 'password', 80);
        });

        expect(result.current.pass_error).toBe('Password must be stronger');
    });

    test('should return error when passwords do not match', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'Passwords must match' }),
        });

        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        await act(async () => {
            await result.current.create_account('username', 'password123', 'password456', 100);
        });

        expect(result.current.confirm_pass_error).toBe('Passwords must match');
    });

    test('should return error when API call fails', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: null, error: 'API error' }),
        });

        const { result } = renderHook(() => USE_CREATE_ACCOUNT());
        
        await act(async () => {
            await result.current.create_account('username', 'password123', 'password123', 100);
        });

        expect(result.current.api_error).toBe('API error');
    });

    test('should return true when account creation is successful', async () => {
        const mock_use_axios = require('../hooks/USE_AXIOS').default;
        mock_use_axios.mockReturnValue({
            use_axios: jest.fn().mockResolvedValue({ data: { user: 'username' }, error: null }),
        });

        const { result } = renderHook(() => USE_CREATE_ACCOUNT());

        let success;
        await act(async () => {
            success = await result.current.create_account('username', 'password123', 'password123', 100);
        });

        expect(success).toBe(true);
    });
});