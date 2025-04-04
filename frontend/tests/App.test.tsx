import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';
import Duties from '../src/components/Duties';

jest.mock('../src/components/Duties', () => () => <div data-testid="duties-component">Mocked Duties</div>);

describe('App Component', () => {
    it('renders the Duties component', () => {
        render(<App />);
        
        // Check if the mocked Duties component is in the document
        expect(screen.getByTestId('duties-component')).toBeInTheDocument();
    });
});
