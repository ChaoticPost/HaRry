import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Pause, Volume2, VolumeX, Search } from 'lucide-react';
import type { TranscriptEntry } from '../../types';
import { formatDuration } from '../../utils/format';

interface TranscriptViewerProps {
    transcript: TranscriptEntry[];
    currentTime?: number;
    onTimeSeek?: (time: number) => void;
    isPlaying?: boolean;
    onPlayPause?: () => void;
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
    transcript,
    currentTime = 0,
    onTimeSeek,
    isPlaying = false,
    onPlayPause
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTranscript, setFilteredTranscript] = useState<TranscriptEntry[]>(transcript);
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchTerm) {
            const filtered = transcript.filter(entry =>
                entry.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTranscript(filtered);
        } else {
            setFilteredTranscript(transcript);
        }
    }, [transcript, searchTerm]);

    useEffect(() => {
        // Auto-scroll to current time entry
        if (currentTime > 0) {
            const currentEntry = transcript.find(entry =>
                Math.abs(entry.timestamp - currentTime) < 2
            );
            if (currentEntry) {
                setSelectedEntry(currentEntry.id);
                // Scroll to entry
                const element = document.getElementById(`transcript-${currentEntry.id}`);
                if (element && containerRef.current) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }, [currentTime, transcript]);

    const handleEntryClick = (entry: TranscriptEntry) => {
        setSelectedEntry(entry.id);
        if (onTimeSeek) {
            onTimeSeek(entry.timestamp);
        }
    };

    const getSpeakerColor = (speaker: string) => {
        return speaker === 'candidate'
            ? 'bg-blue-50 border-l-4 border-blue-500'
            : 'bg-gray-50 border-l-4 border-gray-500';
    };

    const getSpeakerName = (speaker: string) => {
        return speaker === 'candidate' ? 'Кандидат' : 'Интервьюер';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Транскрипт интервью</span>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Поиск в транскрипте..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                            />
                        </div>
                        {onPlayPause && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onPlayPause}
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    ref={containerRef}
                    className="space-y-3 max-h-96 overflow-y-auto"
                >
                    {filteredTranscript.map((entry) => (
                        <div
                            key={entry.id}
                            id={`transcript-${entry.id}`}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedEntry === entry.id
                                    ? 'ring-2 ring-blue-500'
                                    : 'hover:bg-gray-50'
                                } ${getSpeakerColor(entry.speaker)}`}
                            onClick={() => handleEntryClick(entry)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {getSpeakerName(entry.speaker)}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {formatDuration(entry.timestamp)}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                        Уверенность: {Math.round(entry.confidence * 100)}%
                                    </span>
                                    <div className="w-16 bg-gray-200 rounded-full h-1">
                                        <div
                                            className="bg-blue-500 h-1 rounded-full"
                                            style={{ width: `${entry.confidence * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {entry.text}
                            </p>
                        </div>
                    ))}

                    {filteredTranscript.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {searchTerm ? 'Ничего не найдено' : 'Транскрипт пуст'}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TranscriptViewer;
