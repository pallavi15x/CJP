import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, MessageCircle, Trophy, Users, ScrollText, AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react';
import { useData, useAuth } from '../contexts';
import { formatDate } from '../hooks';
import EmptyState from '../components/ui/EmptyState';
import { Notification } from '../contexts/DataContext';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearNotifications } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'comment': return <MessageCircle className="w-5 h-5 text-primary" />;
      case 'milestone': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'badge': return <Trophy className="w-5 h-5 text-purple-400" />;
      case 'community': return <Users className="w-5 h-5 text-green-400" />;
      case 'petition': return <ScrollText className="w-5 h-5 text-secondary" />;
      default: return <Bell className="w-5 h-5 text-text-muted" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-text-secondary text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary text-dark-bg' : 'bg-dark-card text-text-muted'
            }`}
          >
            {filter === 'all' ? 'Show Unread Only' : 'Show All'}
          </button>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-text-muted hover:text-secondary text-sm flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-12 h-12 text-text-muted" />}
          title="No Notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`card flex items-start gap-4 ${
                !notification.read ? 'bg-primary/5 border-primary/30' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-dark-hover flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-text-primary font-semibold">{notification.title}</p>
                    <p className="text-text-muted text-sm">{notification.message}</p>
                    <p className="text-text-muted text-xs mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="p-1.5 rounded-full hover:bg-dark-hover text-text-muted hover:text-primary transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {notification.link && (
                      <Link
                        to={notification.link}
                        onClick={() => handleMarkRead(notification.id)}
                        className="p-1.5 rounded-full hover:bg-dark-hover text-text-muted hover:text-primary transition-colors"
                        title="View"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
