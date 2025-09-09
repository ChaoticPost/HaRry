import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, X } from 'lucide-react';
import apiClient from '../api/client';

const AddVacancyPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        currency: 'RUB',
        requirements: '',
        responsibilities: '',
        benefits: ''
    });
    const [requirements, setRequirements] = useState<string[]>([]);
    const [responsibilities, setResponsibilities] = useState<string[]>([]);
    const [benefits, setBenefits] = useState<string[]>([]);
    const [newRequirement, setNewRequirement] = useState('');
    const [newResponsibility, setNewResponsibility] = useState('');
    const [newBenefit, setNewBenefit] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = (type: 'requirements' | 'responsibilities' | 'benefits', value: string) => {
        if (value.trim()) {
            if (type === 'requirements') {
                setRequirements(prev => [...prev, value.trim()]);
                setNewRequirement('');
            } else if (type === 'responsibilities') {
                setResponsibilities(prev => [...prev, value.trim()]);
                setNewResponsibility('');
            } else if (type === 'benefits') {
                setBenefits(prev => [...prev, value.trim()]);
                setNewBenefit('');
            }
        }
    };

    const removeItem = (type: 'requirements' | 'responsibilities' | 'benefits', item: string) => {
        if (type === 'requirements') {
            setRequirements(prev => prev.filter(req => req !== item));
        } else if (type === 'responsibilities') {
            setResponsibilities(prev => prev.filter(resp => resp !== item));
        } else if (type === 'benefits') {
            setBenefits(prev => prev.filter(benefit => benefit !== item));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.department || !formData.location) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        try {
            setLoading(true);

            const vacancyData = {
                ...formData,
                salary: formData.salaryMin && formData.salaryMax ? {
                    min: parseInt(formData.salaryMin),
                    max: parseInt(formData.salaryMax),
                    currency: formData.currency
                } : undefined,
                requirements,
                responsibilities,
                benefits,
                status: 'active'
            };

            await apiClient.createVacancy(vacancyData);
            navigate('/vacancies');
        } catch (error) {
            console.error('Failed to create vacancy:', error);
            alert('Ошибка при создании вакансии');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/vacancies')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Создать вакансию</h1>
                    <p className="text-gray-600 mt-2">Добавление новой позиции</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Основная информация</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Название позиции *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Frontend Developer"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="department">Отдел *</Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        placeholder="Разработка"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">Локация *</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Москва"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="currency">Валюта</Label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="RUB">RUB</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Label htmlFor="salaryMin">Зарплата от</Label>
                                    <Input
                                        id="salaryMin"
                                        name="salaryMin"
                                        type="number"
                                        value={formData.salaryMin}
                                        onChange={handleInputChange}
                                        placeholder="100000"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="salaryMax">Зарплата до</Label>
                                    <Input
                                        id="salaryMax"
                                        name="salaryMax"
                                        type="number"
                                        value={formData.salaryMax}
                                        onChange={handleInputChange}
                                        placeholder="150000"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Требования</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    placeholder="Добавить требование"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', newRequirement))}
                                />
                                <Button type="button" onClick={() => addItem('requirements', newRequirement)} variant="outline">
                                    Добавить
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {requirements.map((req, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm">{req}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem('requirements', req)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Обязанности</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    value={newResponsibility}
                                    onChange={(e) => setNewResponsibility(e.target.value)}
                                    placeholder="Добавить обязанность"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('responsibilities', newResponsibility))}
                                />
                                <Button type="button" onClick={() => addItem('responsibilities', newResponsibility)} variant="outline">
                                    Добавить
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {responsibilities.map((resp, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm">{resp}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem('responsibilities', resp)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Преимущества</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    placeholder="Добавить преимущество"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', newBenefit))}
                                />
                                <Button type="button" onClick={() => addItem('benefits', newBenefit)} variant="outline">
                                    Добавить
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-sm">{benefit}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItem('benefits', benefit)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/vacancies')}
                    >
                        Отмена
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать вакансию'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddVacancyPage;
