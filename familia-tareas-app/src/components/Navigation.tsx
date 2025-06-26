import React from 'react';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  TrophyIcon, 
  ClockIcon, 
  Cog6ToothIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  TrophyIcon as TrophyIconSolid, 
  ClockIcon as ClockIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid
} from '@heroicons/react/24/solid';

export type TabType = 'dashboard' | 'tareas' | 'recompensas' | 'historial' | 'admin' | 'penalizaciones';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showAdmin: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, showAdmin }) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: 'Familia',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      color: 'blue',
      show: true
    },
    {
      id: 'tareas' as TabType,
      name: 'Tareas',
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
      color: 'green',
      show: true
    },
    {
      id: 'recompensas' as TabType,
      name: 'Recompensas',
      icon: TrophyIcon,
      iconSolid: TrophyIconSolid,
      color: 'yellow',
      show: true
    },
    {
      id: 'penalizaciones' as TabType,
      name: 'Faltas',
      icon: ExclamationTriangleIcon,
      iconSolid: ExclamationTriangleIconSolid,
      color: 'orange',
      show: showAdmin
    },
    {
      id: 'historial' as TabType,
      name: 'Historial',
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      color: 'purple',
      show: true
    },
    {
      id: 'admin' as TabType,
      name: 'Configuración',
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      color: 'gray',
      show: showAdmin
    }
  ];

  const getTabColors = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-100 text-blue-700 border-blue-300' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
      green: isActive 
        ? 'bg-green-100 text-green-700 border-green-300' 
        : 'text-gray-600 hover:text-green-600 hover:bg-green-50',
      yellow: isActive 
        ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
        : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50',
      orange: isActive 
        ? 'bg-orange-100 text-orange-700 border-orange-300' 
        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
      purple: isActive 
        ? 'bg-purple-100 text-purple-700 border-purple-300' 
        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50',
      gray: isActive 
        ? 'bg-gray-100 text-gray-700 border-gray-300' 
        : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1 py-4">
          {tabs.filter(tab => tab.show).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = isActive ? tab.iconSolid : tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  isActive 
                    ? `border ${getTabColors(tab.color, true)} shadow-sm`
                    : `border-transparent ${getTabColors(tab.color, false)}`
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {tabs.filter(tab => tab.show).map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = isActive ? tab.iconSolid : tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-max transition-all duration-200 ${
                    isActive 
                      ? getTabColors(tab.color, true)
                      : getTabColors(tab.color, false)
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
