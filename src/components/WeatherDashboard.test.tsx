import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WeatherDashboard from './WeatherDashboard';
import * as weatherService from '@/lib/services/weather';

// Mock the weather service
vi.mock('@/lib/services/weather', () => ({
    fetchForecast: vi.fn(),
    fetchForecastByCoords: vi.fn(),
    groupForecastByDay: vi.fn(),
}));

describe('WeatherDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock geolocation
        (global.navigator as any).geolocation = {
            getCurrentPosition: vi.fn().mockImplementation((success) =>
                success({
                    coords: {
                        latitude: 51.5074,
                        longitude: -0.1278,
                    },
                })
            ),
        };
    });

    it('renders loading state initially and then weather data on success', async () => {
        const mockData = {
            city: { name: 'London', country: 'GB' },
            list: [],
        };
        const mockForecasts = [
            {
                date: '2026-01-20',
                temp_min: 5,
                temp_max: 15,
                weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
                hourly: [],
            },
        ];

        (weatherService.fetchForecastByCoords as any).mockResolvedValue(mockData);
        (weatherService.groupForecastByDay as any).mockReturnValue(mockForecasts);

        render(<WeatherDashboard />);

        expect(screen.getByText(/Gathering local atmospheric data.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('London')).toBeInTheDocument();
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
        });
    });

    it('renders error state if geolocation fails', async () => {
        (global.navigator as any).geolocation.getCurrentPosition = vi.fn().mockImplementation((success, error) =>
            error({ code: 1, message: 'User denied Geolocation' })
        );

        (weatherService.fetchForecastByCoords as any).mockRejectedValue(new Error('Location access denied'));

        render(<WeatherDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Location access denied. Please search for a city manually./i)).toBeInTheDocument();
        });
    });

    it('performs search and updates data', async () => {
        const mockDataInitial = { city: { name: 'London', country: 'GB' }, list: [] };
        const mockForecastsInitial = [{
            date: '2026-01-20',
            temp_min: 5,
            temp_max: 15,
            weather: { main: 'Clear', description: 'clear sky', icon: '01d' },
            hourly: [],
        }];

        const mockDataSearch = {
            city: { name: 'Paris', country: 'FR' },
            list: [],
        };
        const mockForecastsSearch = [
            {
                date: '2026-01-20',
                temp_min: 10,
                temp_max: 20,
                weather: { main: 'Clouds', description: 'few clouds', icon: '02d' },
                hourly: [],
            },
        ];

        (weatherService.fetchForecastByCoords as any).mockResolvedValue(mockDataInitial);
        (weatherService.groupForecastByDay as any).mockReturnValue(mockForecastsInitial);

        render(<WeatherDashboard />);

        await waitFor(() => {
            expect(screen.getByText('London')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Search city.../i);
        const searchButton = screen.getByRole('button', { name: /search/i });

        (weatherService.fetchForecast as any).mockResolvedValue(mockDataSearch);
        (weatherService.groupForecastByDay as any).mockReturnValue(mockForecastsSearch);

        fireEvent.change(input, { target: { value: 'Paris' } });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Paris')).toBeInTheDocument();
            expect(screen.getByText(/few clouds/i)).toBeInTheDocument();
        });
    });
});
