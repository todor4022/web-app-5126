"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DailyForecast } from "@/lib/services/weather";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ForecastCardProps {
    forecast: DailyForecast;
    isSelected: boolean;
    onClick: () => void;
}

export function ForecastCard({ forecast, isSelected, onClick }: ForecastCardProps) {
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`;
    const isToday = format(new Date(forecast.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card
                onClick={onClick}
                className={`cursor-pointer overflow-hidden transition-all border-2 rounded-3xl ${isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-transparent hover:border-muted-foreground/20 bg-card/50"
                    }`}
            >
                <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {isToday ? "Today" : format(new Date(forecast.date), 'EEE, MMM d')}
                    </span>

                    <div className="relative w-20 h-20">
                        <img
                            src={iconUrl}
                            alt={forecast.weather.description}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex flex-col gap-0">
                        <span className="text-3xl font-bold tracking-tighter">
                            {Math.round(forecast.temp_max)}°
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                            {Math.round(forecast.temp_min)}°
                        </span>
                    </div>

                    <p className="text-sm font-medium mt-1 capitalize text-balance">
                        {forecast.weather.description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
