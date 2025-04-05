import { renderHook } from '@testing-library/react';
import axios from 'axios';
import USE_AXIOS from '../hooks/USE_AXIOS';

// mock axios
jest.mock('axios', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

describe('USE_AXIOS hook', () => {
    test('should return data on successful API call', async () => {
        const mock_data = { message: 'Success' };
        axios.mockResolvedValue({ data: mock_data });

        const { result, waitForNextUpdate } = renderHook(() => USE_AXIOS());

        const { use_axios } = result.current;
        const { data, error } = await use_axios('/test');

        expect(data).toEqual({ message: 'Success' });
        expect(error).toBeNull();
    });

    test('should return error message on failed API call', async () => {
        const mock_error = { response: { data: { message: 'Error occurred' } } };
        axios.mockRejectedValue(mock_error);

        const { result, waitForNextUpdate } = renderHook(() => USE_AXIOS());

        const { use_axios } = result.current;
        const { data, error } = await use_axios('/error');

        expect(data).toBeNull();
        expect(error).toBe('Error occurred');
    });

    test('should return generic error message if no response message', async () => {
        axios.mockRejectedValue({});

        const { result, waitForNextUpdate } = renderHook(() => USE_AXIOS());

        const { use_axios } = result.current;
        const { data, error } = await use_axios('/no-message');

        expect(data).toBeNull();
        expect(error).toBe('Something went wrong');
    });
});
