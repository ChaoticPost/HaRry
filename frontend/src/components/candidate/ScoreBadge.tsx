import React from 'react';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreBadgeProps {
    score: number;
    maxScore?: number;
    showTrend?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'secondary';
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
    score,
    maxScore = 100,
    showTrend = false,
    trend = 'neutral',
    size = 'md',
    variant = 'default'
}) => {
    const percentage = Math.round((score / maxScore) * 100);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        if (score >= 40) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'text-xs px-2 py-1';
            case 'lg': return 'text-lg px-4 py-2';
            default: return 'text-sm px-3 py-1';
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-3 h-3" />;
            case 'down': return <TrendingDown className="w-3 h-3" />;
            default: return <Minus className="w-3 h-3" />;
        }
    };

    return (
        <Badge
            variant={variant}
            className={`${getScoreColor(score)} ${getSizeClasses()} flex items-center space-x-1`}
        >
            {showTrend && getTrendIcon()}
            <span>{percentage}%</span>
        </Badge>
    );
};

export default ScoreBadge;
