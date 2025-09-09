import React from 'react';
import { Badge } from '../ui/badge';

interface SkillsListProps {
    skills: string[];
    maxVisible?: number;
    showAll?: boolean;
    onToggleShowAll?: () => void;
}

const SkillsList: React.FC<SkillsListProps> = ({
    skills,
    maxVisible = 5,
    showAll = false,
    onToggleShowAll
}) => {
    const visibleSkills = showAll ? skills : skills.slice(0, maxVisible);
    const hiddenCount = skills.length - maxVisible;

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
                {visibleSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                    </Badge>
                ))}
                {!showAll && hiddenCount > 0 && (
                    <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-gray-100"
                        onClick={onToggleShowAll}
                    >
                        +{hiddenCount} еще
                    </Badge>
                )}
            </div>

            {showAll && hiddenCount > 0 && onToggleShowAll && (
                <button
                    onClick={onToggleShowAll}
                    className="text-xs text-blue-600 hover:text-blue-800"
                >
                    Показать меньше
                </button>
            )}
        </div>
    );
};

export default SkillsList;
