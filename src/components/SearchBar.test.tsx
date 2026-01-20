import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
    it('calls onSearch when the form is submitted with a query', () => {
        const onSearch = vi.fn();
        const onLocation = vi.fn();
        render(<SearchBar onSearch={onSearch} onLocation={onLocation} isLoading={false} />);

        const input = screen.getByPlaceholderText(/Search city.../i);
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'London' } });
        fireEvent.click(button);

        expect(onSearch).toHaveBeenCalledWith('London');
    });

    it('calls onLocation when the location button is clicked', () => {
        const onSearch = vi.fn();
        const onLocation = vi.fn();
        render(<SearchBar onSearch={onSearch} onLocation={onLocation} isLoading={false} />);

        const locationButton = screen.getByTitle(/Use my location/i);
        fireEvent.click(locationButton);

        expect(onLocation).toHaveBeenCalled();
    });

    it('disables buttons when loading', () => {
        const onSearch = vi.fn();
        const onLocation = vi.fn();
        render(<SearchBar onSearch={onSearch} onLocation={onLocation} isLoading={true} />);

        const searchButton = screen.getByRole('button', { name: '' }); // The loading spinner is there
        const locationButton = screen.getByTitle(/Use my location/i);

        expect(searchButton).toBeDisabled();
        expect(locationButton).toBeDisabled();
    });
});
