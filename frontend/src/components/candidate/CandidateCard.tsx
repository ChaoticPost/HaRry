import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { User, Mail, Phone, Calendar, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Candidate } from '../../types';
import { getStatusText, formatDate } from '../../utils/format';

interface CandidateCardProps {
    candidate: Candidate;
    showActions?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, showActions = true }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'interviewed': return <Star className="w-4 h-4 text-yellow-500" />;
            case 'hired': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{candidate.name}</CardTitle>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        {getStatusIcon(candidate.status)}
                        <span className="text-xs text-gray-500">
                            {getStatusText(candidate.status)}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{candidate.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(candidate.createdAt)}</span>
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <p className="text-sm font-medium mb-1">Опыт: {candidate.experience} лет</p>
                    </div>

                    {/* Skills */}
                    <div>
                        <p className="text-sm font-medium mb-2">Навыки:</p>
                        <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{candidate.skills.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Match Percentage */}
                    {candidate.matchPercentage && (
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Соответствие</span>
                                <span>{candidate.matchPercentage}%</span>
                            </div>
                            <Progress value={candidate.matchPercentage} />
                        </div>
                    )}

                    {/* Score */}
                    {candidate.score && (
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Оценка</span>
                                <span>{candidate.score}%</span>
                            </div>
                            <Progress value={candidate.score} />
                        </div>
                    )}

                    {/* Actions */}
                    {showActions && (
                        <div className="flex justify-between items-center pt-4 border-t">
                            <Link to={`/candidates/${candidate.id}`}>
                                <Button variant="outline" size="sm">
                                    Подробнее
                                </Button>
                            </Link>
                            {candidate.interviewId && (
                                <Link to={`/interviews/${candidate.interviewId}/video`}>
                                    <Button variant="outline" size="sm">
                                        <Star className="w-4 h-4 mr-1" />
                                        Интервью
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CandidateCard;
