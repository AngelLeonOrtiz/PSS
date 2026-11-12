import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  module: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Tomamos la URL de la API y le quitamos el '/api' del final para conectar al host base del WebSocket
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const socketUrl = apiUrl.replace('/api', ''); 
    
    const socket: Socket = io(socketUrl);

    socket.on('new_notification', (data: Omit<AppNotification, 'id' | 'read'>) => {
      const newNotif: AppNotification = {
        id: Math.random().toString(36).substring(2, 10), // ID único temporal
        ...data,
        read: false,
      };
      
      setNotifications(prev => [newNotif, ...prev]);

      // Lanzar un Toast visual y elegante en la esquina de la pantalla
      let icon = 'ℹ️';
      if (data.type === 'success') icon = '✅';
      if (data.type === 'error') icon = '❌';
      if (data.type === 'warning') icon = '⚠️';

      toast((t) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-sm text-white">{data.title}</span>
          <span className="text-xs text-neutral-200">{data.message}</span>
        </div>
      ), { 
        icon,
        style: {
          backgroundColor: 'rgb(58, 29, 20)',
          color: '#fff',
        }
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
