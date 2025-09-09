import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import type { InterviewMetrics } from '../../types';

interface MetricsChartProps {
    metrics: InterviewMetrics;
    type?: 'bar' | 'line' | 'pie' | 'radar';
    title?: string;
    className?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({
    metrics,
    type = 'bar',
    title = 'Метрики интервью',
    className = ''
}) => {
    const barData = [
        { name: 'Технические навыки', value: metrics.technicalScore, color: '#3b82f6' },
        { name: 'Коммуникация', value: metrics.communicationScore, color: '#10b981' },
        { name: 'Общая оценка', value: metrics.overallScore, color: '#8b5cf6' }
    ];

    const lineData = [
        { time: '0:00', confidence: 85 },
        { time: '5:00', confidence: 92 },
        { time: '10:00', confidence: 88 },
        { time: '15:00', confidence: 95 },
        { time: '20:00', confidence: 90 },
        { time: '25:00', confidence: 87 },
        { time: '30:00', confidence: 93 }
    ];

    const pieData = [
        { name: 'Технические навыки', value: metrics.technicalScore, color: '#3b82f6' },
        { name: 'Коммуникация', value: metrics.communicationScore, color: '#10b981' },
        { name: 'Остальное', value: 100 - metrics.technicalScore - metrics.communicationScore, color: '#6b7280' }
    ];

    const radarData = [
        { subject: 'Технические навыки', A: metrics.technicalScore, fullMark: 100 },
        { subject: 'Коммуникация', A: metrics.communicationScore, fullMark: 100 },
        { subject: 'Уверенность', A: Math.round(metrics.avgConfidence * 100), fullMark: 100 },
        { subject: 'Скорость речи', A: Math.min(metrics.speakingRate / 2, 100), fullMark: 100 },
        { subject: 'Настроение', A: Math.round(metrics.sentimentScore * 100), fullMark: 100 }
    ];

    const renderChart = () => {
        switch (type) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="confidence"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'radar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar
                                name="Оценка"
                                dataKey="A"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.3}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                );

            default: // bar
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderChart()}

                {/* Additional metrics */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {Math.round(metrics.avgConfidence * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Уверенность</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {metrics.speakingRate}
                        </div>
                        <div className="text-sm text-gray-600">Слов/мин</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {metrics.pausesSec}с
                        </div>
                        <div className="text-sm text-gray-600">Паузы</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {Math.round(metrics.sentimentScore * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Настроение</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricsChart;
