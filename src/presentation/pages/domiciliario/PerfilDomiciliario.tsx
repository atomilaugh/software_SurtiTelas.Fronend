import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import s from './PerfilDomiciliario.module.css';
import { Button } from '@/shared/ui/Button';

export const DomiciliarioPerfil: React.FC = () => {
  const [nombre, setNombre] = useState('Juan Pérez');
  const [telefono, setTelefono] = useState('310 234 5678');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [vehiculo, setVehiculo] = useState('moto');
  const [placa, setPlaca] = useState('ABC-123');

  return (
    <div>
      <h1 className={s.pageTitle}>Mi Perfil</h1>
      <p className={s.pageSubtitle}>Datos personales y configuración de cuenta</p>

      <div className={s.perfilLayout}>
        <div className={s.perfilCard}>
          <div className={s.avatar}>
            J
            <button className={s.avatarEditBtn} title="Cambiar foto">
              <Edit2 size={14} />
            </button>
          </div>
          <div className={s.perfilName}>Juan Pérez</div>
          <div className={s.perfilEmail}>juan.p@surtitelas.com</div>
          <div className={s.rolTag}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-info)' }} />
            Domiciliario
          </div>
          <div className={s.perfilStats}>
            <div className={s.perfilStat}>
              <div className={s.perfilStatValue}>187</div>
              <div className={s.perfilStatLabel}>Entregas</div>
            </div>
            <div className={s.perfilStat}>
              <div className={s.perfilStatValue}>4.8</div>
              <div className={s.perfilStatLabel}>Calificación</div>
            </div>
          </div>
        </div>

        <div className={s.perfilForm}>
          <div className={s.perfilFormSection}>
            <div className={s.perfilFormSectionTitle}>
              <Edit2 size={16} />
              Información Personal
            </div>
            <div className={s.formRow}>
              <div className={s.field}>
                <label className={s.label}>Nombre completo</label>
                <input
                  type="text"
                  className={s.input}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Teléfono</label>
                <input
                  type="text"
                  className={s.input}
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
              </div>
            </div>
            <div className={s.formRow}>
              <div className={s.field}>
                <label className={s.label}>Ciudad</label>
                <input
                  type="text"
                  className={s.input}
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={s.perfilFormSection}>
            <div className={s.perfilFormSectionTitle}>Datos de entrega</div>
            <div className={s.formRow}>
              <div className={s.field}>
                <label className={s.label}>Tipo de vehículo</label>
                <select className={s.select} value={vehiculo} onChange={e => setVehiculo(e.target.value)}>
                  <option value="moto">Moto</option>
                  <option value="bicicleta">Bicicleta</option>
                  <option value="pie">A pie</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Placa (si aplica)</label>
                <input
                  type="text"
                  className={s.input}
                  value={placa}
                  onChange={e => setPlaca(e.target.value)}
                  placeholder="ABC-123"
                />
              </div>
            </div>
          </div>

          <div className={s.perfilFormSection}>
            <div className={s.perfilFormSectionTitle}>Datos de acceso</div>
            <div className={s.readOnlyField}>
              <label className={s.readOnlyLabel}>Email</label>
              <div className={s.readOnlyValue}>juan.p@surtitelas.com</div>
              <div className={s.readOnlyNote}>
                El email es tu identificador de acceso y no puede cambiarse
              </div>
            </div>
            <div style={{ height: '16px' }} />
            <div className={s.readOnlyField}>
              <label className={s.readOnlyLabel}>Rol del sistema</label>
              <div className={s.readOnlyValue}>Domiciliario</div>
              <div className={s.readOnlyNote}>
                Los roles son asignados por el administrador
              </div>
            </div>
            <div style={{ height: '16px' }} />
            <div className={s.readOnlyField}>
              <label className={s.readOnlyLabel}>Zona asignada</label>
              <div className={s.readOnlyValue}>Bogotá Centro</div>
              <div className={s.readOnlyNote}>
                Tu zona de entregas es asignada por el administrador
              </div>
            </div>
          </div>

          <div className={s.turnoSection}>
            <div className={s.turnoInfo}>
              <div className={s.turnoLabel}>Estado del turno</div>
              <div className={s.turnoStatus}>
                <span className={s.turnoPulse} />
                Activo
              </div>
            </div>
            <Button variant="secondary" size="sm">Finalizar turno</Button>
          </div>

          <div className={s.formActions}>
            <Button onClick={() => alert('Cambios guardados')}>
              <Check size={16} />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};