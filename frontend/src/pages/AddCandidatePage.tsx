import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Upload, X } from 'lucide-react';
import apiClient from '../api/client';

const AddCandidatePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        skills: '',
        resume: null as File | null
    });
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills(prev => [...prev, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(prev => prev.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.position) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        try {
            setLoading(true);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('experience', formData.experience);
            formDataToSend.append('skills', JSON.stringify(skills));

            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }

            await apiClient.createCandidate(formDataToSend);
            navigate('/candidates');
        } catch (error) {
            console.error('Failed to create candidate:', error);
            alert('Ошибка при создании кандидата');
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
                    onClick={() => navigate('/candidates')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Добавить кандидата</h1>
                    <p className="text-gray-600 mt-2">Создание нового профиля кандидата</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Основная информация</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Имя и фамилия *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Иван Иванов"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="ivan@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Телефон</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+7 (999) 123-45-67"
                                />
                            </div>

                            <div>
                                <Label htmlFor="position">Позиция *</Label>
                                <Input
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    placeholder="Frontend Developer"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="experience">Опыт работы (лет)</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="3"
                                    min="0"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills and Resume */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Навыки и резюме</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Навыки</Label>
                                <div className="flex space-x-2 mb-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Добавить навык"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill} variant="outline">
                                        Добавить
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:bg-blue-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="resume">Резюме</Label>
                                <div className="mt-2">
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="resume"
                                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                                    >
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {formData.resume ? formData.resume.name : 'Загрузить резюме'}
                                            </p>
                                            <p className="text-xs text-gray-500">PDF</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/candidates')}
                    >
                        Отмена
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать кандидата'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddCandidatePage;