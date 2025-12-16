import { useEffect, useState } from 'react';
import { User } from '../../types';
import { getUsers } from '../../lib/supabase';

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data.filter(u => !u.is_admin));
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Laden...</div>;

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2 className="section-title">Benutzer-Verwaltung</h2>
        <button className="btn-primary">+ Neuer Benutzer</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Erstellt am</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><strong>{user.name}</strong></td>
              <td>{user.email}</td>
              <td>{new Date(user.created_at).toLocaleDateString('de-DE')}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn-secondary">Bearbeiten</button>
                  <button className="btn-danger">Löschen</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
