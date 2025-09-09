import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, Plus, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '../api/client';
import type { Candidate } from '../types';
import { getStatusIcon, getStatusText, getStatusColor } from '../utils/format';

const CandidatesListPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCandidates();
      if (response && response.data) {
        setCandidates(response.data);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
      // Fallback to mock data
      setCandidates([
        {
          id: '1',
          name: 'Анна Петрова',
          email: 'anna.petrova@email.com',
          phone: '+7 (999) 123-45-67',
          position: 'Frontend Developer',
          experience: 3,
          skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
          status: 'interviewed',
          createdAt: '2024-01-15T10:00:00Z',
          score: 85,
          matchPercentage: 78
        },
        {
          id: '2',
          name: 'Иван Сидоров',
          email: 'ivan.sidorov@email.com',
          position: 'Backend Developer',
          experience: 5,
          skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
          status: 'new',
          createdAt: '2024-01-14T15:30:00Z',
          matchPercentage: 92
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Кандидаты</h1>
          <p className="text-gray-600 mt-2">Управление базой кандидатов</p>
        </div>
        <Link to="/candidates/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить кандидата
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по имени или позиции..."
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
              <option value="new">Новые</option>
              <option value="interviewed">Проинтервьюированы</option>
              <option value="hired">Наняты</option>
              <option value="rejected">Отклонены</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
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
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                  {candidate.phone && (
                    <p className="text-sm text-gray-600">{candidate.phone}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Опыт: {candidate.experience} лет</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                {candidate.matchPercentage && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Соответствие</span>
                      <span>{candidate.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${candidate.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </span>
                  <Link to={`/candidates/${candidate.id}`}>
                    <Button variant="outline" size="sm">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Кандидаты не найдены</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidatesListPage;
