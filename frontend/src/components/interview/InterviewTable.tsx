import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import type { Interview } from '../../types';
import { getStatusText, getStatusColor, formatDate, formatDuration } from '../../utils/format';

interface InterviewTableProps {
    interviews: Interview[];
    onStatusChange?: (interviewId: string, status: string) => void;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ interviews }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-orange-500" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Интервью</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {interviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                {getStatusIcon(interview.status)}
                                <div>
                                    <h4 className="font-medium">{interview.candidateName}</h4>
                                    <p className="text-sm text-gray-600">{interview.position}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(interview.status)}>
                                            {getStatusText(interview.status)}
                                        </Badge>
                                        {interview.score && (
                                            <Badge variant="outline">
                                                {interview.score}%
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(interview.scheduledAt)}
                                        {interview.duration && ` • ${formatDuration(interview.duration)}`}
                                    </p>
                                </div>

                                <div className="flex space-x-2">
                                    {interview.status === 'completed' && (
                                        <Link to={`/interviews/${interview.id}/video`}>
                                            <Button variant="outline" size="sm">
                                                <Play className="w-4 h-4 mr-2" />
                                                Просмотр
                                            </Button>
                                        </Link>
                                    )}
                                    <Link to={`/candidates/${interview.candidateId}`}>
                                        <Button variant="outline" size="sm">
                                            Профиль
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {interviews.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Нет интервью для отображения
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default InterviewTable;
