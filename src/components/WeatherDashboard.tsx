"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ForecastResponse,
    DailyForecast,
    fetchForecast,
    fetchForecastByCoords,
    groupForecastByDay
} from "@/lib/services/weather";
import { SearchBar } from "./SearchBar";
import { ForecastCard } from "./ForecastCard";
import { HourlyDetails } from "./HourlyDetails";
import { AlertCircle, Loader2, CloudRain, MapPinOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherDashboard() {
    const [data, setData] = useState<ForecastResponse | null>(null);
    const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (city: string) => {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetchForecast(city);
            const grouped = groupForecastByDay(resp.list);
            setData(resp);
            setForecasts(grouped);
            setSelectedDayIndex(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const resp = await fetchForecastByCoords(pos.coords.latitude, pos.coords.longitude);
                    const grouped = groupForecastByDay(resp.list);
                    setData(resp);
                    setForecasts(grouped);
                    setSelectedDayIndex(0);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to fetch location weather");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                if (err.code === 1) {
                    setError("Location access denied. Please search for a city manually.");
                } else {
                    setError("Failed to get your location");
                }
            }
        );
    }, []);

    useEffect(() => {
        handleLocation();
    }, [handleLocation]);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-foreground transition-colors p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                            {data ? data.city.name : "Atmospheric"}
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg">
                            {data ? `${data.city.country} • 5-Day Forecast` : "Modern weather insights"}
                        </p>
                    </div>
                    <SearchBar onSearch={handleSearch} onLocation={handleLocation} isLoading={loading} />
                </header>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/20 text-destructive font-medium"
                    >
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 gap-4"
                        >
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-xl font-medium text-muted-foreground animate-pulse">Gathering local atmospheric data...</p>
                        </motion.div>
                    ) : data && forecasts.length > 0 ? (
                        <motion.main
                            key="main"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {forecasts.map((forecast, idx) => (
                                    <ForecastCard
                                        key={forecast.date}
                                        forecast={forecast}
                                        isSelected={selectedDayIndex === idx}
                                        onClick={() => setSelectedDayIndex(idx)}
                                    />
                                ))}
                            </div>

                            {forecasts[selectedDayIndex] && (
                                <div className="relative pt-8 border-t border-muted-foreground/10">
                                    <HourlyDetails
                                        hourly={forecasts[selectedDayIndex].hourly}
                                        date={forecasts[selectedDayIndex].date}
                                    />
                                </div>
                            )}
                        </motion.main>
                    ) : !error && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                            <CloudRain className="w-16 h-16 opacity-20" />
                            <p className="text-xl font-medium">Search for a city to see the forecast</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
