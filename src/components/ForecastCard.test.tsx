import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ForecastCard } from './ForecastCard';
import { DailyForecast } from '@/lib/services/weather';

const mockForecast: DailyForecast = {
    date: '2026-01-20',
    temp_min: 5,
    temp_max: 15,
    weather: {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
    },
    hourly: [],
};

describe('ForecastCard', () => {
    it('renders forecast information correctly', () => {
        render(
            <ForecastCard
                forecast={mockForecast}
                isSelected={false}
                onClick={() => { }}
            />
        );

        expect(screen.getAllByText(/15°/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/5°/)[0]).toBeInTheDocument();
        expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(
            <ForecastCard
                forecast={mockForecast}
                isSelected={false}
                onClick={onClick}
            />
        );

        // The Card has the onClick handler
        const card = screen.getByText(/clear sky/i).closest('.cursor-pointer');
        fireEvent.click(card!);
        expect(onClick).toHaveBeenCalled();
    });

    it('applies selected styles when isSelected is true', () => {
        render(
            <ForecastCard
                forecast={mockForecast}
                isSelected={true}
                onClick={() => { }}
            />
        );

        const card = screen.getByText(/clear sky/i).closest('.cursor-pointer');
        expect(card).toHaveClass('border-primary');
    });
});
