import { describe, it, expect } from 'vitest';
import { groupForecastByDay, WeatherData } from './weather';

describe('groupForecastByDay', () => {
    it('groups weather data by date correctly', () => {
        const mockList: WeatherData[] = [
            {
                dt: 1700000000,
                dt_txt: '2026-01-20 09:00:00',
                main: { temp: 10, feels_like: 8, temp_min: 9, temp_max: 11, pressure: 1012, humidity: 80 },
                weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
                clouds: { all: 0 },
                wind: { speed: 5, deg: 180 },
                visibility: 10000
            } as WeatherData,
            {
                dt: 1700010800,
                dt_txt: '2026-01-20 12:00:00',
                main: { temp: 15, feels_like: 14, temp_min: 14, temp_max: 16, pressure: 1012, humidity: 70 },
                weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
                clouds: { all: 20 },
                wind: { speed: 6, deg: 190 },
                visibility: 10000
            } as WeatherData,
            {
                dt: 1700097200,
                dt_txt: '2026-01-21 12:00:00',
                main: { temp: 12, feels_like: 10, temp_min: 11, temp_max: 13, pressure: 1015, humidity: 75 },
                weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
                clouds: { all: 100 },
                wind: { speed: 8, deg: 200 },
                visibility: 8000
            } as WeatherData,
        ];

        const result = groupForecastByDay(mockList);

        expect(result).toHaveLength(2);
        expect(result[0].date).toBe('2026-01-20');
        expect(result[0].temp_max).toBe(16);
        expect(result[0].temp_min).toBe(9);
        // Should use the 12:00 weather condition
        expect(result[0].weather.main).toBe('Clouds');

        expect(result[1].date).toBe('2026-01-21');
        expect(result[1].weather.main).toBe('Rain');
    });
});
