import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export async function GET(request: NextRequest) {
    if (!API_KEY) {
        return NextResponse.json({ message: 'API key not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let url = `${BASE_URL}?appid=${API_KEY}&units=metric`;

    if (city) {
        url += `&q=${encodeURIComponent(city)}`;
    } else if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
    } else {
        return NextResponse.json({ message: 'Missing query parameters' }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Failed to fetch from OpenWeather' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather API Proxy Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
