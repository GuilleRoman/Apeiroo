import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Duties from '../src/components/Duties';
import { act } from '@testing-library/react';
// Mock axios
jest.mock('axios');


// Mock for localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Sample duties data for testing
const mockDuties = [
  {
    id: '1',
    name: 'Test Duty 1',
    completed: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Test Duty 2',
    completed: true,
    created_at: '2023-01-02T00:00:00.000Z',
    updated_at: '2023-01-02T00:00:00.000Z'
  }
];

describe('Duties Component', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API calls
    mockedAxios.get.mockResolvedValue({ data: mockDuties });
    mockedAxios.post.mockResolvedValue({ 
      data: {
        id: '3',
        name: 'New Duty',
        completed: false,
        created_at: '2023-01-03T00:00:00.000Z',
        updated_at: null
      }
    });
    mockedAxios.put.mockResolvedValue({ data: {} });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  test('renders component with title', async () => {
    render(<Duties />);
    expect(screen.getByText('To-Do List')).toBeInTheDocument();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3001/api/duties'));
  });

  it('renders duties', async () => {
    await act(async () => {
        render(<Duties />);
    });

    await waitFor(() => {
        expect(screen.findByText('Test Duty 1')).resolves.toBeInTheDocument();
        expect(screen.findByText('Test Duty 2')).resolves.toBeInTheDocument();
    });
});

  it('adds a new duty', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: { id: '123', name: 'Test Duty', completed: false, created_at: 'now', updated_at: 'later' } });
    mockedAxios.get.mockResolvedValue({ data: [] }); // mock the initial fetch

    render(<Duties />);

    const input = screen.getByPlaceholderText('Enter duty name');
    const addButton = screen.getByText('Add Duty');

    fireEvent.change(input, { target: { value: 'Test Duty' } });

    await act(async () => {
        fireEvent.click(addButton);
    });

    await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalled();
    });
});

it('validates duty name when adding', async () => {
  render(<Duties />);

  const input = screen.getByPlaceholderText('Enter duty name');
  const addButton = screen.getByText('Add Duty');

  // Test with too short name
  await userEvent.type(input, 'ab');
  fireEvent.click(addButton);

  // Should show validation error
  await waitFor(() => {
      expect(screen.getByText('Duty name must be at least 3 characters')).toBeInTheDocument();
  });
  expect(mockedAxios.post).not.toHaveBeenCalled();

  // Clear and try with valid name
  await userEvent.clear(input);
  await userEvent.type(input, 'Valid Duty');
  fireEvent.click(addButton);

  await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
  });
});


it('deletes a duty', async () => {
  await act(async () => {
      render(<Duties />);
  });

  await waitFor(() => {
      expect(screen.findByText('Test Duty 1')).resolves.toBeInTheDocument();
  });

  const deleteButton = screen.getAllByRole('button', { name: /Delete Test Duty 1/i })[0];

  await act(async () => {
      fireEvent.click(deleteButton);
  });

  await waitFor(() => {
      expect(screen.findByRole('dialog')).resolves.toBeInTheDocument();
  });

  await act(async () => {
      fireEvent.click(screen.getByText('OK'));
  });

  await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3001/api/duties/1');
      expect(screen.findByText('Duty deleted successfully')).resolves.toBeInTheDocument();
  });
});

it('edits a duty', async () => {
  await act(async () => {
      render(<Duties />);
  });

  await waitFor(() => {
      expect(screen.getByText('Test Duty 1')).toBeInTheDocument();
  });

  const editButton = screen.getAllByRole('button', { name: /edit/i })[0];

  await act(async () => {
      fireEvent.click(editButton);
  });

  const modalInput = await screen.findByDisplayValue('Test Duty 1');

  await act(async () => {
      await userEvent.clear(modalInput);
      await userEvent.type(modalInput, 'Updated Duty');
  });

  const checkbox = screen.getByRole('checkbox', { name: /Completed/i });

  await act(async () => {
      fireEvent.click(checkbox);
  });

  const saveButton = screen.getByText('OK');

  await act(async () => {
      fireEvent.click(saveButton);
  });

  await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3001/api/duties/1', {
          name: 'Updated Duty',
          completed: true,
      });
  });

  await waitFor(() => {
      expect(screen.getByText('Duty updated successfully')).toBeInTheDocument();
  });
});

it('validates duty name when editing', async () => {
  await act(async () => {
      render(<Duties />);
  });

  await waitFor(() => {
      expect(screen.getByText('Test Duty 1')).toBeInTheDocument();
  });

  const editButton = screen.getAllByRole('button', { name: /edit/i })[0];

  await act(async () => {
      fireEvent.click(editButton);
  });

  await waitFor(() => {
      expect(screen.findByDisplayValue('Test Duty 1')).resolves.toBeInTheDocument();
  });

  const modalInput = await screen.findByDisplayValue('Test Duty 1');

  await act(async () => {
      await userEvent.clear(modalInput);
      await userEvent.type(modalInput, 'ab');
  });

  const saveButton = screen.getByText('OK');

  await act(async () => {
      fireEvent.click(saveButton);
  });

  await waitFor(() => {
      expect(screen.findByText('Duty name must be at least 3 characters')).resolves.toBeInTheDocument();
  });

  expect(mockedAxios.put).not.toHaveBeenCalled();
});


it('validates special characters', async () => {
  await act(async () => {
      render(<Duties />);
  });

  await waitFor(() => {
      expect(screen.getByText('Test Duty 1')).toBeInTheDocument();
  });

  const editButton = screen.getAllByRole('button', { name: /edit/i })[0];

  await act(async () => {
      fireEvent.click(editButton);
  });

  await waitFor(() => {
      expect(screen.findByDisplayValue('Test Duty 1')).resolves.toBeInTheDocument();
  });

  const modalInput = await screen.findByDisplayValue('Test Duty 1');

  await act(async () => {
      await userEvent.clear(modalInput);
      await userEvent.type(modalInput, 'Test!');
  });

  const saveButton = screen.getByText('OK');

  await act(async () => {
      fireEvent.click(saveButton);
  });

  await waitFor(() => {
      expect(screen.findByText('Duty name cannot contain special characters')).resolves.toBeInTheDocument();
  });

  expect(mockedAxios.put).not.toHaveBeenCalled();
});

  test('toggles dark mode', async () => {
    render(<Duties />);
    
    // Find theme switch
    const themeSwitch = screen.getByRole('switch');
    
    // By default, it should be light mode
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    expect(document.body.style.backgroundColor).toBe('rgb(245, 245, 245)');
    
    // Toggle to dark mode
    fireEvent.click(themeSwitch);
    
    // Check if theme was updated
    expect(document.body.style.backgroundColor).toBe('rgb(20, 20, 20)');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  test('expands row to show details', async () => {
    render(<Duties />);
    
    // Wait for duties to load
    await waitFor(() => {
        expect(screen.getByText('Test Duty 1')).toBeInTheDocument();
    });
    
    // Find expand icon by title
    const expandIcons = screen.getAllByTitle('Show/Hide Details');
    
    // Click expand icon
    fireEvent.click(expandIcons[0]);
    
    // Check if details are visible
    expect(await screen.findByText(/Created At:/)).toBeInTheDocument();
    expect(screen.getByText(/Updated At:/)).toBeInTheDocument();
});

it('handles API error when adding a duty', async () => {
  mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

  await act(async () => {
      render(<Duties />);
  });

  const input = screen.getByPlaceholderText('Enter duty name');
  const addButton = screen.getByText('Add Duty');

  await act(async () => {
      fireEvent.change(input, { target: { value: 'New Duty' } });
      fireEvent.click(addButton);
  });

  await waitFor(async () => {
      // Should show error message
      expect(await screen.findByText('Failed to add duty')).toBeInTheDocument();
  }, { timeout: 2000 }); // Increase timeout to 5000ms
});
});