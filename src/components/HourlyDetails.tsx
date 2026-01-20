"use client";

import { WeatherData } from "@/lib/services/weather";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Wind, Droplets } from "lucide-react";

interface HourlyDetailsProps {
    hourly: WeatherData[];
    date: string;
}

export function HourlyDetails({ hourly, date }: HourlyDetailsProps) {
    return (
        <div className="space-y-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">
                    Hourly for {format(new Date(date), "EEEE, MMMM do")}
                </h3>
            </div>

            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {hourly.map((hour) => (
                        <Card key={hour.dt} className="min-w-[140px] rounded-2xl border-2 bg-card/40 backdrop-blur-sm">
                            <CardContent className="p-4 flex flex-col items-center gap-2">
                                <span className="text-sm font-bold text-primary">
                                    {format(new Date(hour.dt_txt), "HH:mm")}
                                </span>

                                <img
                                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                                    alt={hour.weather[0].description}
                                    className="w-12 h-12"
                                />

                                <span className="text-2xl font-black">{Math.round(hour.main.temp)}°</span>

                                <div className="flex flex-col gap-1.5 w-full mt-2 pt-2 border-t border-muted/20">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Wind className="w-3 h-3 text-blue-400" />
                                        <span>{Math.round(hour.wind.speed)} km/h</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Droplets className="w-3 h-3 text-cyan-400" />
                                        <span>{hour.main.humidity}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
        </div>
    );
}
