import { render, screen, fireEvent } from '../setupTests';
import AGENT_BOX from '../components/AGENT_BOX';

describe('AGENT_BOX Component', () => {
  test('should render agent name and response correctly', () => {
    render(<AGENT_BOX name="Agent 1" response="This is a response" />);
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('This is a response')).toBeInTheDocument();
  });

  test('should render the View button', () => {
    render(<AGENT_BOX name="Agent 1" response="This is a response" />);
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  test('should open the modal when the View button is clicked', () => {
    render(<AGENT_BOX name="Agent 1" response="This is a response" />);
    fireEvent.click(screen.getByText('View'));
    expect(screen.getByText('Agent 1')).toBeInTheDocument();
    expect(screen.getByText('This is a response')).toBeInTheDocument();
  });
});