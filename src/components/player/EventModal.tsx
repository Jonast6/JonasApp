import { useState, useEffect } from 'react';
import { EventWithDetails, RegistrationStatus, Utensil } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getEventWithRegistrations, upsertRegistration } from '../../lib/supabase';
import { getUtensilIcon } from '../../utils/icons';

interface EventModalProps {
  event: EventWithDetails;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EventModal({ event, onClose, onUpdate }: EventModalProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<RegistrationStatus>('pending');
  const [guestCount, setGuestCount] = useState(0);
  const [selectedUtensils, setSelectedUtensils] = useState<string[]>([]);
  const [utensils, setUtensils] = useState<Utensil[]>([]);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    loadEventDetails();
  }, [event.id]);

  async function loadEventDetails() {
    try {
      const data = await getEventWithRegistrations(event.id);
      setUtensils(data.utensils);
      setParticipants(data.registrations);

      // Load current user's registration
      const myReg = data.registrations.find((r: any) => r.user_id === user?.id);
      if (myReg) {
        setStatus(myReg.status);
        setGuestCount(myReg.guest_count || 0);
        setSelectedUtensils(myReg.registration_utensils?.map((ru: any) => ru.utensil_id) || []);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  }

  async function handleSave() {
    if (!user) return;

    setLoading(true);
    try {
      await upsertRegistration(
        event.id,
        user.id,
        status,
        guestCount,
        selectedUtensils
      );
      onUpdate();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  }

  function toggleUtensil(utensilId: string) {
    if (selectedUtensils.includes(utensilId)) {
      setSelectedUtensils(selectedUtensils.filter(id => id !== utensilId));
    } else {
      setSelectedUtensils([...selectedUtensils, utensilId]);
    }
  }

  const confirmedParticipants = participants.filter(p => p.status === 'confirmed');
  const declinedParticipants = participants.filter(p => p.status === 'declined');
  const pendingParticipants = participants.filter(p => p.status === 'pending');
  const totalGuests = confirmedParticipants.reduce((sum, p) => sum + (p.guest_count || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h2>{event.title} - {new Date(event.event_date).toLocaleDateString('de-DE')}</h2>

        <div className="modal-section">
          <div className="modal-info"><strong>Datum:</strong> {new Date(event.event_date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div className="modal-info"><strong>Uhrzeit:</strong> {event.time_from} - {event.time_to}</div>
          <div className="modal-info"><strong>Ort:</strong> {event.location}</div>
          <div className="modal-info"><strong>Saison:</strong> {event.season_display_name} {event.season_name === 'winter' ? '❄️' : '☀️'}</div>
          {event.notes && <div className="modal-info"><strong>Notizen:</strong> {event.notes}</div>}
        </div>

        <div className="modal-section">
          <h3>Deine Anmeldung</h3>
          <div className="status-selector">
            <div
              className={`status-option status-confirmed ${status === 'confirmed' ? 'active' : ''}`}
              onClick={() => setStatus('confirmed')}
            >
              <div style={{ fontSize: '24px' }}>✓</div>
              <div style={{ marginTop: '8px' }}>Zusagen</div>
            </div>
            <div
              className={`status-option status-declined ${status === 'declined' ? 'active' : ''}`}
              onClick={() => setStatus('declined')}
            >
              <div style={{ fontSize: '24px' }}>✗</div>
              <div style={{ marginTop: '8px' }}>Absagen</div>
            </div>
            <div
              className={`status-option status-pending ${status === 'pending' ? 'active' : ''}`}
              onClick={() => setStatus('pending')}
            >
              <div style={{ fontSize: '24px' }}>?</div>
              <div style={{ marginTop: '8px' }}>Unentschieden</div>
            </div>
          </div>
        </div>

        {status === 'confirmed' && (
          <>
            <div className="modal-section">
              <h3>Anzahl Gäste</h3>
              <div className="guest-input">
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  max="10"
                />
                <span style={{ color: '#000' }}>Gast/Gäste</span>
              </div>
            </div>

            <div className="modal-section">
              <h3>Utensilien mitbringen</h3>
              {utensils.map((utensil) => (
                <label key={utensil.id} className="utensil-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUtensils.includes(utensil.id)}
                    onChange={() => toggleUtensil(utensil.id)}
                  />
                  <span className="icon">{getUtensilIcon(utensil.name)}</span>
                  <span>{utensil.name}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <div className="modal-section">
          <h3>Teilnehmer ({confirmedParticipants.length} Zusagen)</h3>
          
          {confirmedParticipants.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Zugesagt:</div>
              {confirmedParticipants.map((p: any) => (
                <div key={p.id} className="participant-row">
                  <span className="status-icon" style={{ color: '#00aa44' }}>✓</span>
                  <strong>{p.user.name}</strong>
                  {p.guest_count > 0 && <span style={{ color: '#666' }}>+{p.guest_count}</span>}
                  {p.registration_utensils?.map((ru: any) => (
                    <span key={ru.utensil_id}>{getUtensilIcon(ru.utensil?.name || '')}</span>
                  ))}
                </div>
              ))}
            </>
          )}

          {declinedParticipants.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>Abgesagt:</div>
              {declinedParticipants.map((p: any) => (
                <div key={p.id} className="participant-row">
                  <span className="status-icon" style={{ color: '#cc0000' }}>✗</span>
                  <strong>{p.user.name}</strong>
                </div>
              ))}
            </>
          )}

          {pendingParticipants.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>Keine Antwort:</div>
              {pendingParticipants.map((p: any) => (
                <div key={p.id} className="participant-row">
                  <span className="status-icon" style={{ color: '#888888' }}>?</span>
                  <strong>{p.user.name}</strong>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="event-stats">
          <div className="stat-row">
            <span className="stat-label">Gesamt:</span>
            <span className="stat-value">{participants.length} Spieler</span>
          </div>
          <div className="stat-row">
            <span className="stat-label stat-confirmed">✓ Zugesagt:</span>
            <span className="stat-value stat-confirmed">{confirmedParticipants.length} Spieler (+ {totalGuests} Gäste)</span>
          </div>
          <div className="stat-row">
            <span className="stat-label stat-declined">✗ Abgesagt:</span>
            <span className="stat-value stat-declined">{declinedParticipants.length} Spieler</span>
          </div>
          <div className="stat-row">
            <span className="stat-label stat-pending">? Keine Antwort:</span>
            <span className="stat-value stat-pending">{pendingParticipants.length} Spieler</span>
          </div>
        </div>

        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}
