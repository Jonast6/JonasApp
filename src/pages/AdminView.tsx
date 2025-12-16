import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import EventsTab from '../components/admin/EventsTab';
import UsersTab from '../components/admin/UsersTab';
import UtensilsTab from '../components/admin/UtensilsTab';

type TabType = 'events' | 'users' | 'utensils';

export default function AdminView() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('events');

  return (
    <div className="admin-view">
      <div className="header">
        <h1>⚽ Fußball Event Manager - Administration</h1>
        <p className="subtitle">Administrator Dashboard</p>
        <button onClick={signOut} className="btn-logout">Abmelden</button>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </div>
        <div
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Benutzer
        </div>
        <div
          className={`tab ${activeTab === 'utensils' ? 'active' : ''}`}
          onClick={() => setActiveTab('utensils')}
        >
          Utensilien
        </div>
      </div>

      <div className="content">
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'utensils' && <UtensilsTab />}
      </div>
    </div>
  );
}
