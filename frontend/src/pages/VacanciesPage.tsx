import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Plus, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import apiClient from '../api/client';
import type { Vacancy } from '../types';
import { getStatusText, getStatusColor, formatDate } from '../utils/format';

const VacanciesPage: React.FC = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadVacancies();
    }, []);

    const loadVacancies = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getVacancies();
            setVacancies(response.data || []);
        } catch (error) {
            console.error('Failed to load vacancies:', error);
            // Fallback to mock data
            setVacancies([
                {
                    id: '1',
                    title: 'Frontend Developer',
                    department: 'Разработка',
                    location: 'Москва',
                    salary: {
                        min: 120000,
                        max: 180000,
                        currency: 'RUB'
                    },
                    requirements: ['React', 'TypeScript', '3+ лет опыта'],
                    responsibilities: ['Разработка UI компонентов', 'Оптимизация производительности'],
                    benefits: ['Медицинская страховка', 'Гибкий график'],
                    status: 'active',
                    createdAt: '2024-01-10T10:00:00Z',
                    applicantsCount: 15
                },
                {
                    id: '2',
                    title: 'Backend Developer',
                    department: 'Разработка',
                    location: 'Санкт-Петербург',
                    salary: {
                        min: 100000,
                        max: 160000,
                        currency: 'RUB'
                    },
                    requirements: ['Python', 'Django', 'PostgreSQL'],
                    responsibilities: ['API разработка', 'База данных'],
                    benefits: ['Удаленная работа', 'Обучение'],
                    status: 'active',
                    createdAt: '2024-01-12T14:30:00Z',
                    applicantsCount: 8
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredVacancies = vacancies.filter(vacancy => {
        const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vacancy.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatSalary = (salary: Vacancy['salary']) => {
        if (!salary) return 'Не указана';
        return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.currency}`;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Загрузка...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Вакансии</h1>
                    <p className="text-gray-600 mt-2">Управление открытыми позициями</p>
                </div>
                <Link to="/vacancies/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Создать вакансию
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
                                placeholder="Поиск по названию или отделу..."
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
                            <option value="active">Активные</option>
                            <option value="closed">Закрытые</option>
                            <option value="draft">Черновики</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Vacancies List */}
            <div className="space-y-4">
                {filteredVacancies.map((vacancy) => (
                    <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-semibold">{vacancy.title}</h3>
                                        <Badge className={getStatusColor(vacancy.status)}>
                                            {getStatusText(vacancy.status)}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{vacancy.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{vacancy.department}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{formatSalary(vacancy.salary)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(vacancy.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2">Требования:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {vacancy.requirements.slice(0, 4).map((req, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {req}
                                                </Badge>
                                            ))}
                                            {vacancy.requirements.length > 4 && (
                                                <Badge variant="outline">
                                                    +{vacancy.requirements.length - 4} еще
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            {vacancy.applicantsCount} кандидатов
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                Редактировать
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Просмотр
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredVacancies.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-500">Вакансии не найдены</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default VacanciesPage;
