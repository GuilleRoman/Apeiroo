// Duties.minimal.test.tsx (with API Call - Corrected)
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import DutiesMinimal from '../src/components/Duties.minimal';
import axios from 'axios';

jest.mock('axios');

test('adds a new duty', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue({ data: {} });

    const originalConsoleLog = console.log;
    console.log = jest.fn();

    render(<DutiesMinimal />);
    const addButton = screen.getByText('Add Duty');
    await act(async () => {
        fireEvent.click(addButton);
    });

    await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Add duty function triggered (Minimal with API Call)");
        expect(mockedAxios.post).toHaveBeenCalled();
    });

    console.log = originalConsoleLog;
});