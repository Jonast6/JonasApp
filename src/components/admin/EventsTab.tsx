import { useEffect, useState } from 'react';
import { EventWithDetails } from '../../types';
import { getEvents, deleteEvent } from '../../lib/supabase';

export default function EventsTab() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId: string) {
    if (!confirm('Event wirklich löschen?')) return;

    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Fehler beim Löschen');
    }
  }

  if (loading) return <div>Laden...</div>;

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2 className="section-title">Event-Verwaltung</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary">+ Einzelnes Event</button>
          <button className="btn-primary">+ Event-Serie</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Typ</th>
            <th>Titel</th>
            <th>Datum</th>
            <th>Uhrzeit</th>
            <th>Ort</th>
            <th>Saison</th>
            <th>Teilnehmer</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                <span className={`badge badge-${event.is_series ? 'series' : 'single'}`}>
                  {event.is_series ? 'Serie' : 'Einzeln'}
                </span>
              </td>
              <td><strong>{event.title}</strong></td>
              <td>{new Date(event.event_date).toLocaleDateString('de-DE')}</td>
              <td>{event.time_from} - {event.time_to}</td>
              <td>{event.location}</td>
              <td>
                <span className={`badge badge-${event.season_name}`}>
                  {event.season_name === 'winter' ? '❄️' : '☀️'} {event.season_display_name}
                </span>
              </td>
              <td>{event.confirmed_count} / {event.confirmed_count + event.declined_count + event.pending_count}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn-secondary">Ansehen</button>
                  <button className="btn-secondary">Bearbeiten</button>
                  <button className="btn-danger" onClick={() => handleDelete(event.id)}>Löschen</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
