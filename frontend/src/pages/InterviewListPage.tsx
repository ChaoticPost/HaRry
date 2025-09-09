import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, Filter, Play, Clock, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '../api/client';
import type { Interview } from '../types';
import { getStatusText, getStatusColor, formatDate } from '../utils/format';

const InterviewListPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getInterviews();
      setInterviews(response.data || []);
    } catch (error) {
      console.error('Failed to load interviews:', error);
      // Fallback to mock data
      setInterviews([
        {
          id: '1',
          candidateId: '1',
          candidateName: 'Анна Петрова',
          position: 'Frontend Developer',
          status: 'completed',
          scheduledAt: '2024-01-15T10:00:00Z',
          completedAt: '2024-01-15T11:30:00Z',
          duration: 5400,
          score: 85
        },
        {
          id: '2',
          candidateId: '2',
          candidateName: 'Иван Сидоров',
          position: 'Backend Developer',
          status: 'scheduled',
          scheduledAt: '2024-01-20T14:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Интервью</h1>
        <p className="text-gray-600 mt-2">Управление интервью и их результатами</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по кандидату или позиции..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="scheduled">Запланированы</option>
              <option value="in_progress">В процессе</option>
              <option value="completed">Завершены</option>
              <option value="cancelled">Отменены</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <Card key={interview.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                      <p className="text-gray-600">{interview.position}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(interview.status)}`}>
                        {getStatusText(interview.status)}
                      </span>
                      {interview.score && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {interview.score}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(interview.scheduledAt)}</span>
                    </div>
                    {interview.duration && (
                      <div className="flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>{Math.floor(interview.duration / 60)} мин</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Интервью не найдены</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewListPage;
