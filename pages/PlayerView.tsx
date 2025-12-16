import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EventWithDetails, Registration, User } from '../types';
import { getUpcomingEvents, getUsers, upsertRegistration } from '../lib/supabase';
import { getUtensilIcon } from '../utils/icons';
import EventModal from '../components/player/EventModal';

export default function PlayerView() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, Registration>>({});
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [eventsData, usersData] = await Promise.all([
        getUpcomingEvents(),
        getUsers(),
      ]);

      setEvents(eventsData.slice(0, 3)); // Nur erste 3 Events anzeigen
      setUsers(usersData);

      // TODO: Load registrations
      setRegistrations({});
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRegistrationKey(eventId: string, userId: string) {
    return `${eventId}-${userId}`;
  }

  function getRegistrationStatus(eventId: string, userId: string) {
    const reg = registrations[getRegistrationKey(eventId, userId)];
    return reg?.status || 'pending';
  }

  function getGuestCount(eventId: string, userId: string) {
    const reg = registrations[getRegistrationKey(eventId, userId)];
    return reg?.guest_count || 0;
  }

  function handleStatusClick(event: EventWithDetails, clickedUser: User) {
    if (user?.id === clickedUser.id) {
      setSelectedEvent(event);
    }
  }

  async function handleRegistrationUpdate() {
    await loadData();
    setSelectedEvent(null);
  }

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <div className="player-view">
      <header className="header">
        <h1>⚽ Fußball Event Manager</h1>
        <p className="subtitle">Willkommen, {user?.name}</p>
        <button onClick={signOut} className="btn-logout">Abmelden</button>
      </header>

      <div className="scroll-container">
        <div className="matrix">
          {/* Header Row */}
          <div className="cell header-cell">
            <div style={{ color: '#888888', fontSize: '14px' }}>Spieler</div>
          </div>
          {events.map((event) => (
            <div
              key={event.id}
              className="cell header-cell"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-title">{event.title}</div>
              <div className="event-date">
                {new Date(event.event_date).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div className="event-time">
                {event.time_from} - {event.time_to}
              </div>
            </div>
          ))}

          {/* Player Rows */}
          {users.filter(u => !u.is_admin).map((player) => (
            <div key={player.id} className="matrix-row">
              <div className="cell player-name-cell">{player.name}</div>
              {events.map((event) => {
                const status = getRegistrationStatus(event.id, player.id);
                const guestCount = getGuestCount(event.id, player.id);

                return (
                  <div key={event.id} className="cell">
                    <button
                      className={`status-button status-${status}`}
                      onClick={() => handleStatusClick(event, player)}
                    >
                      <span>
                        {status === 'confirmed' && '✓'}
                        {status === 'declined' && '✗'}
                        {status === 'pending' && '?'}
                      </span>
                      {status === 'confirmed' && guestCount > 0 && (
                        <span className="guest-count">+{guestCount}</span>
                      )}
                      {/* TODO: Show utensil icons */}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <h2>Legende</h2>
        <div className="legend-item">
          <span className="legend-icon" style={{ color: '#00aa44' }}>✓</span>
          <span>Zugesagt (Grün)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon" style={{ color: '#cc0000' }}>✗</span>
          <span>Abgesagt (Rot)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon" style={{ color: '#888888' }}>?</span>
          <span>Keine Antwort (Grau)</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">+2</span>
          <span>Anzahl Gäste</span>
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={handleRegistrationUpdate}
        />
      )}
    </div>
  );
}
