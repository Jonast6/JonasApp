import { useEffect, useState } from 'react';
import { Utensil } from '../../types';
import { getUtensils } from '../../lib/supabase';
import { getUtensilIcon } from '../../utils/icons';

export default function UtensilsTab() {
  const [utensils, setUtensils] = useState<Utensil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUtensils();
  }, []);

  async function loadUtensils() {
    try {
      const data = await getUtensils();
      setUtensils(data);
    } catch (error) {
      console.error('Error loading utensils:', error);
    } finally {
      setLoading(false);
    }
  }

  const winterUtensils = utensils.filter((u: any) => u.season?.name === 'winter');
  const summerUtensils = utensils.filter((u: any) => u.season?.name === 'summer');

  if (loading) return <div>Laden...</div>;

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2 className="section-title">Utensilien-Verwaltung</h2>
      </div>

      <div className="utensil-lists">
        <div className="utensil-section">
          <h3>❄️ Winter-Utensilien</h3>
          <ul className="utensil-list">
            {winterUtensils.map((utensil) => (
              <li key={utensil.id} className="utensil-item">
                <span className="utensil-name">
                  <span className="utensil-icon">{getUtensilIcon(utensil.name)}</span>
                  <span>{utensil.name}</span>
                </span>
                <div className="action-buttons">
                  <button className="btn-secondary" style={{ padding: '6px 12px' }}>Bearbeiten</button>
                  <button className="btn-danger" style={{ padding: '6px 12px' }}>Löschen</button>
                </div>
              </li>
            ))}
          </ul>
          <button className="add-utensil-btn">+ Neue Utensilie hinzufügen</button>
        </div>

        <div className="utensil-section">
          <h3>☀️ Sommer-Utensilien</h3>
          <ul className="utensil-list">
            {summerUtensils.map((utensil) => (
              <li key={utensil.id} className="utensil-item">
                <span className="utensil-name">
                  <span className="utensil-icon">{getUtensilIcon(utensil.name)}</span>
                  <span>{utensil.name}</span>
                </span>
                <div className="action-buttons">
                  <button className="btn-secondary" style={{ padding: '6px 12px' }}>Bearbeiten</button>
                  <button className="btn-danger" style={{ padding: '6px 12px' }}>Löschen</button>
                </div>
              </li>
            ))}
          </ul>
          <button className="add-utensil-btn">+ Neue Utensilie hinzufügen</button>
        </div>
      </div>
    </div>
  );
}
