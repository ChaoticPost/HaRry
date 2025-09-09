import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Settings, Bot, Mic, Video, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RobotAvatar from '../components/ai/RobotAvatar';

const AIInterviewerPage: React.FC = () => {
    const navigate = useNavigate();
    const [interviewerConfig, setInterviewerConfig] = useState({
        name: 'AI Интервьюер',
        personality: 'friendly',
        language: 'ru',
        questions: [
            'Расскажите о себе и своем опыте работы',
            'Какие технологии вы используете в работе?',
            'Опишите свой самый интересный проект',
            'Как вы решаете сложные технические задачи?',
            'Какие у вас планы по развитию?'
        ],
        duration: 30,
        recordingEnabled: true,
        transcriptionEnabled: true,
        analysisEnabled: true
    });

    const [newQuestion, setNewQuestion] = useState('');

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setInterviewerConfig(prev => ({
                ...prev,
                questions: [...prev.questions, newQuestion.trim()]
            }));
            setNewQuestion('');
        }
    };

    const removeQuestion = (index: number) => {
        setInterviewerConfig(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const updateQuestion = (index: number, value: string) => {
        setInterviewerConfig(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) => i === index ? value : q)
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/interviews')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Настройка AI-интервьюера</h1>
                    <p className="text-gray-600 mt-2">Персонализация искусственного интеллекта для интервью</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Avatar Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Bot className="w-5 h-5" />
                            <span>AI Аватар</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <RobotAvatar size="xl" isActive={true} className="mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {interviewerConfig.name}
                        </h3>
                        <Badge variant="outline" className="mb-4">
                            {interviewerConfig.personality === 'friendly' ? 'Дружелюбный' : 'Профессиональный'}
                        </Badge>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-center space-x-2">
                                <Mic className="w-4 h-4" />
                                <span>Запись: {interviewerConfig.recordingEnabled ? 'Включена' : 'Отключена'}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>Видео: Включено</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Длительность: {interviewerConfig.duration} мин</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="w-5 h-5" />
                                <span>Основные настройки</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Имя интервьюера</Label>
                                <Input
                                    id="name"
                                    value={interviewerConfig.name}
                                    onChange={(e) => setInterviewerConfig(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="AI Интервьюер"
                                />
                            </div>

                            <div>
                                <Label htmlFor="personality">Личность</Label>
                                <select
                                    id="personality"
                                    value={interviewerConfig.personality}
                                    onChange={(e) => setInterviewerConfig(prev => ({ ...prev, personality: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="friendly">Дружелюбный</option>
                                    <option value="professional">Профессиональный</option>
                                    <option value="casual">Неформальный</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="duration">Длительность интервью (минуты)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={interviewerConfig.duration}
                                    onChange={(e) => setInterviewerConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    min="5"
                                    max="60"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MessageSquare className="w-5 h-5" />
                                <span>Вопросы для интервью</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {interviewerConfig.questions.map((question, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                                        <Textarea
                                            value={question}
                                            onChange={(e) => updateQuestion(index, e.target.value)}
                                            className="flex-1"
                                            rows={2}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeQuestion(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex space-x-2">
                                <Textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Добавить новый вопрос..."
                                    className="flex-1"
                                    rows={2}
                                />
                                <Button onClick={addQuestion} variant="outline">
                                    Добавить
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Функции</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Запись интервью</h4>
                                    <p className="text-sm text-gray-600">Автоматическая запись видео и аудио</p>
                                </div>
                                <Button
                                    variant={interviewerConfig.recordingEnabled ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setInterviewerConfig(prev => ({ ...prev, recordingEnabled: !prev.recordingEnabled }))}
                                >
                                    {interviewerConfig.recordingEnabled ? 'Включено' : 'Отключено'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Транскрипция</h4>
                                    <p className="text-sm text-gray-600">Автоматическое преобразование речи в текст</p>
                                </div>
                                <Button
                                    variant={interviewerConfig.transcriptionEnabled ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setInterviewerConfig(prev => ({ ...prev, transcriptionEnabled: !prev.transcriptionEnabled }))}
                                >
                                    {interviewerConfig.transcriptionEnabled ? 'Включено' : 'Отключено'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Анализ ответов</h4>
                                    <p className="text-sm text-gray-600">AI-анализ качества ответов кандидата</p>
                                </div>
                                <Button
                                    variant={interviewerConfig.analysisEnabled ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setInterviewerConfig(prev => ({ ...prev, analysisEnabled: !prev.analysisEnabled }))}
                                >
                                    {interviewerConfig.analysisEnabled ? 'Включено' : 'Отключено'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate('/interviews')}>
                    Отмена
                </Button>
                <Button onClick={() => {
                    // Save configuration
                    console.log('Saving AI interviewer config:', interviewerConfig);
                    navigate('/interviews');
                }}>
                    Сохранить настройки
                </Button>
            </div>
        </div>
    );
};

export default AIInterviewerPage;
