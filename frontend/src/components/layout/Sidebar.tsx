import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Video,
  Briefcase,
  FileText,
  Settings,
  Plus,
  Bot
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navigation = [
  { name: 'Дашборд', href: '/', icon: Home },
  { name: 'Интервью', href: '/interviews', icon: Video },
  { name: 'AI-интервьюер', href: '/ai-interviewer', icon: Bot },
  { name: 'Кандидаты', href: '/candidates', icon: Users },
  { name: 'Вакансии', href: '/vacancies', icon: Briefcase },
  { name: 'Отчеты', href: '/reports', icon: FileText },
];

const quickActions = [
  { name: 'Добавить кандидата', href: '/candidates/new', icon: Plus },
  { name: 'Создать вакансию', href: '/vacancies/new', icon: Plus },
];

const Sidebar: React.FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Быстрые действия
          </h3>
          <nav className="mt-2 space-y-1">
            {quickActions.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <NavLink
            to="/settings/criteria"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Settings className="mr-3 h-5 w-5" />
            Настройки критериев
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
