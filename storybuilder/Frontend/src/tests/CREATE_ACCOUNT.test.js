jest.mock('@tabler/icons-react', () => ({
    IconCheck: () => <div>IconCheck</div>,
    IconX: () => <div>IconX</div>,
}));

import { render, screen, fireEvent } from '../setupTests';
import { MemoryRouter } from 'react-router';
import CREATE_ACCOUNT from '../components/CREATE_ACCOUNT';
import { waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router';

// Mock the hook before import
jest.mock('../hooks/USE_CREATE_ACCOUNT', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

// mock navigate
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
  }));

describe('CREATE_ACCOUNT Component', () => {
    let mock_navigate;

    beforeEach(() => {
        jest.clearAllMocks();
        mock_navigate = jest.fn();
        useNavigate.mockReturnValue(mock_navigate);
    });

    test('displays errors for username', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(false);

        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
        create_account: create_account_mock,
        user_error: 'Username must not be empty',
        pass_error: '',
        confirm_pass_error: '',
        api_error: '',
        });

        render(
        <MemoryRouter>
            <CREATE_ACCOUNT />
        </MemoryRouter>
        );

        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText('Username must not be empty')).toBeInTheDocument();
        });
    });

    test('displays errors for password', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(false);

        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
        create_account: create_account_mock,
        user_error: '',
        pass_error: 'Password must not be empty',
        confirm_pass_error: '',
        api_error: '',
        });

        render(
        <MemoryRouter>
            <CREATE_ACCOUNT />
        </MemoryRouter>
        );

        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText('Password must not be empty')).toBeInTheDocument();
        });
    });

    test('displays errors for confirm password', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(false);

        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
        create_account: create_account_mock,
        user_error: '',
        pass_error: '',
        confirm_pass_error: 'Passwords must match',
        api_error: '',
        });

        render(
        <MemoryRouter>
            <CREATE_ACCOUNT />
        </MemoryRouter>
        );

        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText('Passwords must match')).toBeInTheDocument();
        });
    });

    test('displays errors for api error', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(false);

        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
        create_account: create_account_mock,
        user_error: '',
        pass_error: '',
        confirm_pass_error: '',
        api_error: 'API error',
        });

        render(
        <MemoryRouter>
            <CREATE_ACCOUNT />
        </MemoryRouter>
        );

        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText('API error')).toBeInTheDocument();
        });
    });

    test('shows success modal after successful account creation', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(true);

        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
        create_account: create_account_mock,
        user_error: '',
        pass_error: '',
        confirm_pass_error: '',
        api_error: '',
        });

        render(
        <MemoryRouter>
            <CREATE_ACCOUNT />
        </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'NewUser' } });
        fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'ValidPass123!' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'ValidPass123!' } });

        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);

        await waitFor(() => {
            expect(screen.getByText('Account Created!')).toBeInTheDocument();
            expect(screen.getByText('Congratulations! Your account has been successfully created.')).toBeInTheDocument();
        });
    });

    test('Back to login button takes you back to the login page', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(true);
        const navigate_mock = jest.fn(); // Mock navigate
    
        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
            create_account: create_account_mock,
            user_error: '',
            pass_error: '',
            confirm_pass_error: '',
            api_error: '',
        });
    
        render(
            <MemoryRouter>
                <CREATE_ACCOUNT />
            </MemoryRouter>
        );
    
        // Simulate successful account creation
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'NewUser' } });
        fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'ValidPass123!' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'ValidPass123!' } });
    
        const create_button = screen.getByRole('button', { name: /create your account/i });
        fireEvent.click(create_button);
    
        await waitFor(() => {
            expect(screen.getByText('Account Created!')).toBeInTheDocument();
        });
    
        const back_to_login_button = screen.getByRole('button', { name: /back to login/i });
        fireEvent.click(back_to_login_button);
    
        await waitFor(() => {
            expect(mock_navigate).toHaveBeenCalledWith('/');
        });
    });

    test('Popover strength meter appears when focusing on password input', async () => {
        const create_account_mock = jest.fn().mockResolvedValue(false);
    
        require('../hooks/USE_CREATE_ACCOUNT').default.mockReturnValue({
            create_account: create_account_mock,
            user_error: '',
            pass_error: '',
            confirm_pass_error: '',
            api_error: '',
        });
    
        render(
            <MemoryRouter>
                <CREATE_ACCOUNT />
            </MemoryRouter>
        );
    
        // Focus on password input field
        const password_input = screen.getByPlaceholderText('Your password');
        fireEvent.focus(password_input);
    
        await waitFor(() => {
            expect(screen.getByText('Includes at least 8 characters')).toBeInTheDocument();
            expect(screen.getByRole('progressbar')).toBeInTheDocument(); // The strength bar should be visible
        });
    });
});