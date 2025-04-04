import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/App';
import '@testing-library/jest-dom';

const createRootMock = jest.fn(() => ({
    render: jest.fn(),
}));

jest.mock('react-dom/client', () => ({
    createRoot: createRootMock,
}));

// Import index.tsx after mocking
import '../src/index';

describe('index.tsx', () => {
    it('renders App component into root element', () => {
        const rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);

        expect(createRootMock).toHaveBeenCalled();
    });
});
