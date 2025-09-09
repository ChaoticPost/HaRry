export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatScore = (score: number): string => {
  return `${Math.round(score)}%`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'interviewed': return 'bg-yellow-100 text-yellow-800';
    case 'hired': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'scheduled': return 'bg-purple-100 text-purple-800';
    case 'in_progress': return 'bg-orange-100 text-orange-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'new': 'Новый',
    'interviewed': 'Проинтервьюирован',
    'hired': 'Нанят',
    'rejected': 'Отклонен',
    'scheduled': 'Запланировано',
    'in_progress': 'В процессе',
    'completed': 'Завершено',
    'cancelled': 'Отменено',
    'active': 'Активна',
    'closed': 'Закрыта',
    'draft': 'Черновик'
  };
  return statusMap[status] || status;
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'interviewed': return 'bg-yellow-100 text-yellow-800';
    case 'hired': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'scheduled': return 'bg-purple-100 text-purple-800';
    case 'in_progress': return 'bg-orange-100 text-orange-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
