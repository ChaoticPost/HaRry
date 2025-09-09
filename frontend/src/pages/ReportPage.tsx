import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
    Download,
    FileText,
    Star,
    TrendingUp,
    ArrowLeft,
    Calendar,
    User,
    MessageSquare
} from 'lucide-react';
import apiClient from '../api/client';
import type { Report, Candidate, Interview } from '../types';
import { formatDate } from '../utils/format';

const ReportPage: React.FC = () => {
    const { candidateId } = useParams<{ candidateId: string }>();
    const [report, setReport] = useState<Report | null>(null);
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) {
            loadReportData(candidateId);
        }
    }, [candidateId]);

    const loadReportData = async (candidateId: string) => {
        try {
            setLoading(true);

            // Load report data
            const reportResponse = await apiClient.getReport(candidateId);
            setReport(reportResponse.data);

            // Load candidate data
            const candidateResponse = await apiClient.getCandidate(candidateId);
            setCandidate(candidateResponse.data);

            // Load interview data if exists
            if (candidateResponse.data.interviewId) {
                const interviewResponse = await apiClient.getInterview(candidateResponse.data.interviewId);
                setInterview(interviewResponse.data);
            }

        } catch (error) {
            console.error('Failed to load report data:', error);
            // Fallback to mock data
            setReport({
                id: '1',
                candidateId: candidateId,
                interviewId: '1',
                generatedAt: '2024-01-15T12:00:00Z',
                summary: 'Кандидат показал отличные технические навыки в области React и TypeScript. Демонстрирует хорошие коммуникативные способности и понимание современных подходов к разработке. Рекомендуется к найму на позицию Frontend Developer.',
                recommendations: [
                    'Рекомендуется к найму на позицию Frontend Developer',
                    'Подходит для работы в команде',
                    'Может стать техническим лидером в будущем'
                ],
                strengths: [
                    'Отличное знание React и TypeScript',
                    'Хорошие коммуникативные навыки',
                    'Понимание современных подходов к разработке',
                    'Опыт работы с командой'
                ],
                weaknesses: [
                    'Ограниченный опыт с тестированием',
                    'Нужно больше практики с DevOps инструментами'
                ],
                finalScore: 87,
                decision: 'hire'
            });

            setCandidate({
                id: candidateId,
                name: 'Анна Петрова',
                email: 'anna.petrova@email.com',
                position: 'Frontend Developer',
                experience: 3,
                skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
                status: 'interviewed',
                createdAt: '2024-01-15T10:00:00Z',
                interviewId: '1',
                score: 87,
                matchPercentage: 85
            });

            setInterview({
                id: '1',
                candidateId: candidateId,
                candidateName: 'Анна Петрова',
                position: 'Frontend Developer',
                status: 'completed',
                scheduledAt: '2024-01-15T10:00:00Z',
                completedAt: '2024-01-15T11:30:00Z',
                duration: 5400,
                score: 87
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (candidateId) {
            try {
                const blob = await apiClient.downloadReportPdf(candidateId);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `report_${candidate?.name || 'candidate'}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Failed to download PDF:', error);
                // Mock download
                const link = document.createElement('a');
                link.href = '#';
                link.download = `report_${candidate?.name || 'candidate'}.pdf`;
                link.click();
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Загрузка...</div>;
    }

    if (!report || !candidate) {
        return <div className="text-center py-12">Отчет не найден</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to={`/candidates/${candidateId}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Назад к кандидату
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Отчет по интервью</h1>
                        <p className="text-gray-600 mt-2">{candidate.name} - {candidate.position}</p>
                    </div>
                </div>
                <Button onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4 mr-2" />
                    Скачать PDF
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Report */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Резюме интервью
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
                        </CardContent>
                    </Card>

                    {/* Strengths and Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-green-700">
                                    <Star className="w-5 h-5 mr-2" />
                                    Сильные стороны
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-red-700">
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Области для развития
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {report.weaknesses.map((weakness, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Рекомендации</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {report.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-700">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Candidate Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Информация о кандидате
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Имя</p>
                                <p className="font-medium">{candidate.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Позиция</p>
                                <p className="font-medium">{candidate.position}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Опыт</p>
                                <p className="font-medium">{candidate.experience} лет</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-sm">{candidate.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interview Info */}
                    {interview && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Интервью
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Дата проведения</p>
                                    <p className="font-medium">{formatDate(interview.scheduledAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Длительность</p>
                                    <p className="font-medium">{Math.floor(interview.duration! / 60)} мин</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Статус</p>
                                    <Badge className="bg-green-100 text-green-800">
                                        Завершено
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Final Score */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Итоговая оценка</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {report.finalScore}%
                                </div>
                                <p className="text-sm text-gray-600">Общая оценка</p>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Прогресс</span>
                                    <span>{report.finalScore}%</span>
                                </div>
                                <Progress value={report.finalScore} />
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Решение:</span>
                                    <Badge
                                        className={
                                            report.decision === 'hire' ? 'bg-green-100 text-green-800' :
                                                report.decision === 'reject' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        }
                                    >
                                        {report.decision === 'hire' ? 'Нанять' :
                                            report.decision === 'reject' ? 'Отклонить' : 'Рассмотреть'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация об отчете</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Создан</p>
                                <p className="font-medium">{formatDate(report.generatedAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">ID отчета</p>
                                <p className="font-medium text-sm">{report.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
