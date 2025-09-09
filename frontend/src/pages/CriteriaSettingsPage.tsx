import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { Settings, Save } from 'lucide-react';
import type { CriteriaWeights } from '../types';

const CriteriaSettingsPage: React.FC = () => {
    const [weights, setWeights] = useState<CriteriaWeights>({
        technical: 30,
        communication: 25,
        experience: 20,
        culturalFit: 15,
        motivation: 10
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load saved weights from localStorage
        const savedWeights = localStorage.getItem('criteriaWeights');
        if (savedWeights) {
            setWeights(JSON.parse(savedWeights));
        }
    }, []);

    const handleWeightChange = (criterion: keyof CriteriaWeights, value: number) => {
        setWeights(prev => ({ ...prev, [criterion]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem('criteriaWeights', JSON.stringify(weights));
        setHasChanges(false);
        alert('Настройки сохранены!');
    };

    const handleReset = () => {
        const defaultWeights: CriteriaWeights = {
            technical: 30,
            communication: 25,
            experience: 20,
            culturalFit: 15,
            motivation: 10
        };
        setWeights(defaultWeights);
        setHasChanges(true);
    };

    const getTotalWeight = () => {
        return Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    };

    const getWeightPercentage = (weight: number) => {
        const total = getTotalWeight();
        return total > 0 ? Math.round((weight / total) * 100) : 0;
    };

    const criteria = [
        {
            key: 'technical' as keyof CriteriaWeights,
            label: 'Технические навыки',
            description: 'Знание технологий, опыт программирования, архитектурные решения',
            color: 'bg-blue-500'
        },
        {
            key: 'communication' as keyof CriteriaWeights,
            label: 'Коммуникация',
            description: 'Умение объяснять, работа в команде, презентационные навыки',
            color: 'bg-green-500'
        },
        {
            key: 'experience' as keyof CriteriaWeights,
            label: 'Опыт работы',
            description: 'Количество лет в индустрии, релевантный опыт, достижения',
            color: 'bg-purple-500'
        },
        {
            key: 'culturalFit' as keyof CriteriaWeights,
            label: 'Культурное соответствие',
            description: 'Соответствие ценностям компании, стиль работы, мотивация',
            color: 'bg-orange-500'
        },
        {
            key: 'motivation' as keyof CriteriaWeights,
            label: 'Мотивация',
            description: 'Заинтересованность в проекте, карьерные цели, энтузиазм',
            color: 'bg-pink-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Settings className="w-8 h-8 text-blue-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Настройки критериев</h1>
                    <p className="text-gray-600 mt-2">Управление весами критериев оценки кандидатов</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Criteria Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {criteria.map((criterion) => (
                        <Card key={criterion.key}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{criterion.label}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold">{weights[criterion.key]}</span>
                                        <span className="text-sm text-gray-500">баллов</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600">{criterion.description}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <Label>Вес критерия</Label>
                                        <span>{getWeightPercentage(weights[criterion.key])}% от общей оценки</span>
                                    </div>
                                    <Slider
                                        value={weights[criterion.key]}
                                        onValueChange={(value) => handleWeightChange(criterion.key, value)}
                                        min={0}
                                        max={50}
                                        step={1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0</span>
                                        <span>50</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded ${criterion.color}`} />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${criterion.color} h-2 rounded-full`}
                                            style={{ width: `${(weights[criterion.key] / 50) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Сводка</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Общий вес:</span>
                                    <span className="font-medium">{getTotalWeight()}/100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${getTotalWeight()}%` }}
                                    />
                                </div>
                                {getTotalWeight() !== 100 && (
                                    <p className="text-xs text-orange-600">
                                        Общий вес должен составлять 100 баллов
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Распределение весов:</h4>
                                {criteria.map((criterion) => (
                                    <div key={criterion.key} className="flex justify-between text-sm">
                                        <span>{criterion.label}:</span>
                                        <span>{getWeightPercentage(weights[criterion.key])}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Действия</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || getTotalWeight() !== 100}
                                className="w-full"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Сохранить настройки
                            </Button>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="w-full"
                            >
                                Сбросить к умолчанию
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Информация</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>• Веса критериев влияют на итоговую оценку кандидатов</p>
                                <p>• Общий вес должен составлять 100 баллов</p>
                                <p>• Настройки сохраняются локально в браузере</p>
                                <p>• Изменения применяются к новым интервью</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CriteriaSettingsPage;
