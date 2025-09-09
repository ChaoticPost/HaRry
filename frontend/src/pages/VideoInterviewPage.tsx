import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft,
  MessageSquare,
  BarChart3,
  Mic,
  Video,
  Monitor,
  MoreVertical,
  Bell
} from 'lucide-react';
import apiClient from '../api/client';
import type { Interview, TranscriptEntry, InterviewMetrics, WebSocketMessage } from '../types';
import { formatDuration } from '../utils/format';
import WelcomeModal from '../components/ai/WelcomeModal';
import CompletionModal from '../components/ai/CompletionModal';
import RobotAvatar from '../components/ai/RobotAvatar';

const VideoInterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [metrics, setMetrics] = useState<InterviewMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'metrics'>('transcript');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnswerComplete, setIsAnswerComplete] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (id) {
      loadInterviewData(id);
      connectWebSocket(id);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [id]);

  const loadInterviewData = async (interviewId: string) => {
    try {
      const response = await apiClient.getInterview(interviewId);
      if ((response as any) && (response as any).data) {
        setInterview((response as any).data);
        setTranscript((response as any).data.transcript || []);
        setMetrics((response as any).data.metrics || null);
      }
    } catch (error) {
      console.error('Failed to load interview:', error);
      // Fallback to mock data
      setInterview({
        id: interviewId,
        candidateId: '1',
        candidateName: 'Анна Петрова',
        position: 'Frontend Developer',
        status: 'completed',
        scheduledAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-15T11:30:00Z',
        duration: 5400,
        score: 85
      });

      setTranscript([
        {
          id: '1',
          speaker: 'interviewer',
          text: 'Добро пожаловать на интервью! Расскажите о себе.',
          timestamp: 0,
          confidence: 0.95
        },
        {
          id: '2',
          speaker: 'candidate',
          text: 'Привет! Меня зовут Анна, я frontend разработчик с 3-летним опытом работы с React и TypeScript.',
          timestamp: 5,
          confidence: 0.92
        },
        {
          id: '3',
          speaker: 'interviewer',
          text: 'Отлично! Какие технологии вы используете в работе?',
          timestamp: 15,
          confidence: 0.98
        },
        {
          id: '4',
          speaker: 'candidate',
          text: 'В основном React, TypeScript, CSS модули. Также работаю с Node.js для бэкенда и имею опыт с Redux для управления состоянием.',
          timestamp: 20,
          confidence: 0.87
        }
      ]);

      setMetrics({
        pausesSec: 12,
        avgConfidence: 0.91,
        speakingRate: 150,
        sentimentScore: 0.8,
        keywordsUsed: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Redux'],
        technicalScore: 85,
        communicationScore: 90,
        overallScore: 87
      });
    }
  };

  const connectWebSocket = (interviewId: string) => {
    try {
      const ws = apiClient.createWebSocket(interviewId);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsRecording(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'transcript') {
            setTranscript(prev => [...prev, message.data]);
          } else if (message.type === 'metrics') {
            setMetrics(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsRecording(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };


  if (!interview) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        candidateName={interview?.candidateName}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        candidateName={interview?.candidateName}
      />

      {/* Main Video Interface */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <Link to="/interviews">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">{interview.candidateName}</h1>
            <p className="text-gray-300">{interview.position}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Запись идёт</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-900 p-8">
            <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
              {/* Candidate Video */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-sm">Кандидат</p>
                  </div>
                </div>
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Запись идёт</span>
                  </div>
                )}
              </div>

              {/* AI Robot Video */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <RobotAvatar size="xl" isActive={isRecording} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4">
              <div className="flex space-x-1 mb-4">
                <Button
                  variant={activeTab === 'transcript' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('transcript')}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Транскрипт
                </Button>
                <Button
                  variant={activeTab === 'metrics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('metrics')}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Метрики
                </Button>
              </div>

              {activeTab === 'transcript' ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-lg ${entry.speaker === 'candidate'
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-gray-50 border-l-4 border-gray-500'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium">
                          {entry.speaker === 'candidate' ? 'Кандидат' : 'AI Интервьюер'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDuration(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{entry.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(metrics.avgConfidence * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Уверенность</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {metrics.speakingRate}
                          </div>
                          <div className="text-sm text-gray-600">Слов/мин</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Метрики недоступны</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-gray-800 p-6">
          {/* Notification */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Не забудьте нажать кнопку, когда закончите говорить</span>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => {
                setIsAnswerComplete(!isAnswerComplete);
                if (!isAnswerComplete) {
                  setTimeout(() => setShowCompletionModal(true), 2000);
                }
              }}
              className={`px-8 py-3 rounded-xl text-lg font-medium ${isAnswerComplete
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                } text-white`}
            >
              {isAnswerComplete ? 'Завершить ответ' : 'Завершить ответ'}
            </Button>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`text-white hover:bg-gray-700 ${!isMicOn ? 'text-red-400' : ''}`}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`text-white hover:bg-gray-700 ${!isVideoOn ? 'text-red-400' : ''}`}
              >
                <Video className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
              >
                <Monitor className="w-5 h-5 mr-2" />
                Демонстрация
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewPage;