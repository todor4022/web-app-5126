export interface WeatherData {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    visibility: number;
    dt_txt: string;
}

export interface ForecastResponse {
    list: WeatherData[];
    city: {
        id: number;
        name: string;
        country: string;
        coord: {
            lat: number;
            lon: number;
        };
    };
}

export interface DailyForecast {
    date: string;
    temp_min: number;
    temp_max: number;
    weather: WeatherData['weather'][0];
    hourly: WeatherData[];
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function fetchForecast(city: string): Promise<ForecastResponse> {
    if (!API_KEY) throw new Error('API key not found');

    const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch forecast');
    }

    return response.json();
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastResponse> {
    if (!API_KEY) throw new Error('API key not found');

    const response = await fetch(
        `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch forecast');
    }

    return response.json();
}

export function groupForecastByDay(list: WeatherData[]): DailyForecast[] {
    const grouped: { [key: string]: DailyForecast } = {};

    list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!grouped[date]) {
            grouped[date] = {
                date,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                weather: item.weather[0],
                hourly: [],
            };
        }

        grouped[date].hourly.push(item);
        grouped[date].temp_min = Math.min(grouped[date].temp_min, item.main.temp_min);
        grouped[date].temp_max = Math.max(grouped[date].temp_max, item.main.temp_max);

        // Use the weather condition from the middle of the day (roughly 12:00) if available
        if (item.dt_txt.includes('12:00:00')) {
            grouped[date].weather = item.weather[0];
        }
    });

    return Object.values(grouped);
}
