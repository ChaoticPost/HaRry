import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Download, 
  Play,
  Star,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import apiClient from '../api/client';
import type { Candidate, Interview, Report } from '../types';
import { formatDate, getStatusText, getStatusColor } from '../utils/format';

const CandidatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCandidateData(id);
    }
  }, [id]);

  const loadCandidateData = async (candidateId: string) => {
    try {
      setLoading(true);
      
      // Load candidate data
      const candidateResponse = await apiClient.getCandidate(candidateId);
      setCandidate(candidateResponse.data);
      
      // Load interview data if exists
      if (candidateResponse.data.interviewId) {
        const interviewResponse = await apiClient.getInterview(candidateResponse.data.interviewId);
        setInterview(interviewResponse.data);
      }
      
      // Load report data
      const reportResponse = await apiClient.getReport(candidateId);
      setReport(reportResponse.data);
      
    } catch (error) {
      console.error('Failed to load candidate data:', error);
      // Fallback to mock data
      setCandidate({
        id: candidateId,
        name: 'Анна Петрова',
        email: 'anna.petrova@email.com',
        phone: '+7 (999) 123-45-67',
        position: 'Frontend Developer',
        experience: 3,
        skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Node.js'],
        status: 'interviewed',
        createdAt: '2024-01-15T10:00:00Z',
        interviewId: '1',
        score: 85,
        matchPercentage: 78
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
        score: 85
      });
      
      setReport({
        id: '1',
        candidateId: candidateId,
        interviewId: '1',
        generatedAt: '2024-01-15T12:00:00Z',
        summary: 'Кандидат показал хорошие технические навыки и коммуникативные способности.',
        recommendations: ['Рекомендуется к найму', 'Подходит для команды'],
        strengths: ['React', 'TypeScript', 'Коммуникация'],
        weaknesses: ['Опыт с тестированием'],
        finalScore: 85,
        decision: 'hire'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    } else {
      // Mock download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${candidate?.name}_resume.pdf`;
      link.click();
    }
  };

  const handleDownloadReport = async () => {
    if (candidate?.id) {
      try {
        const blob = await apiClient.downloadReportPdf(candidate.id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report_${candidate.name}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download report:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  if (!candidate) {
    return <div className="text-center py-12">Кандидат не найден</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
          <p className="text-gray-600 mt-2">{candidate.position}</p>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(candidate.status)}>
            {getStatusText(candidate.status)}
          </Badge>
          {candidate.matchPercentage && (
            <Badge variant="outline">
              {candidate.matchPercentage}% соответствие
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Контактная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {formatDate(candidate.createdAt)}
                </span>
              </div>
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadResume}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать резюме
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Навыки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Опыт работы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidate.experience} лет</div>
              <p className="text-sm text-gray-600">в сфере разработки</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Section */}
          {interview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Интервью
                  </span>
                  <Badge className={getStatusColor(interview.status)}>
                    {getStatusText(interview.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Дата проведения</p>
                      <p className="font-medium">{formatDate(interview.scheduledAt)}</p>
                    </div>
                    {interview.duration && (
                      <div>
                        <p className="text-sm text-gray-600">Длительность</p>
                        <p className="font-medium">{Math.floor(interview.duration / 60)} мин</p>
                      </div>
                    )}
                  </div>
                  
                  {interview.score && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Общая оценка</span>
                        <span>{interview.score}%</span>
                      </div>
                      <Progress value={interview.score} />
                    </div>
                  )}
                  
                  {interview.status === 'completed' && (
                    <div className="pt-4">
                      <Link to={`/interviews/${interview.id}/video`}>
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Просмотреть интервью
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Section */}
          {report && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Отчет по интервью
                  </span>
                  <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Резюме</h4>
                  <p className="text-sm text-gray-600">{report.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Сильные стороны</h4>
                    <ul className="space-y-1">
                      {report.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <Star className="w-3 h-3 text-green-500 mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-700">Области для развития</h4>
                    <ul className="space-y-1">
                      {report.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <TrendingUp className="w-3 h-3 text-red-500 mr-2" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Рекомендации</h4>
                  <ul className="space-y-1">
                    {report.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Итоговое решение:</span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
