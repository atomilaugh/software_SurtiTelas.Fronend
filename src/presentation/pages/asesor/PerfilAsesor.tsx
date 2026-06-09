import React, { useState } from 'react';
import { Edit2, Lock, Check } from 'lucide-react';
import styles from './PerfilAsesor.module.css';
import { Button } from '@/shared/ui/Button';

export const AsesorPerfil: React.FC = () => {
  const [nombre, setNombre] = useState('Camila Torres');
  const [telefono, setTelefono] = useState('310 234 5678');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <div>
      <h1 className={styles.pageTitle}>Mi Perfil</h1>
      <p className={styles.pageSubtitle}>Datos personales y configuración de cuenta</p>

      <div className={styles.perfilLayout}>
        <div className={styles.perfilCard}>
          <div className={styles.avatar}>
            C
            <button className={styles.avatarEditBtn} title="Cambiar foto">
              <Edit2 size={14} />
            </button>
          </div>
          <div className={styles.perfilName}>Camila Torres</div>
          <div className={styles.perfilEmail}>camila.t@surtitelas.com</div>
          <div className={styles.rolTag}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }} />
            Asesor de Ventas
          </div>
          <div className={styles.perfilStats}>
            <div className={styles.perfilStat}>
              <div className={styles.perfilStatValue}>43</div>
              <div className={styles.perfilStatLabel}>Clientes</div>
            </div>
            <div className={styles.perfilStat}>
              <div className={styles.perfilStatValue}>28</div>
              <div className={styles.perfilStatLabel}>Pedidos</div>
            </div>
          </div>
        </div>

        <div className={styles.perfilForm}>
          <div className={styles.perfilFormSection}>
            <div className={styles.perfilFormSectionTitle}>
              <Edit2 size={16} />
              Información Personal
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre completo</label>
                <input
                  type="text"
                  className={styles.input}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Teléfono</label>
                <input
                  type="text"
                  className={styles.input}
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Ciudad</label>
                <input
                  type="text"
                  className={styles.input}
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.perfilFormSection}>
            <div className={styles.perfilFormSectionTitle}>
              <Lock size={16} />
              Cambiar Contraseña
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Contraseña actual</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="******"
                  value={passwordActual}
                  onChange={e => setPasswordActual(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nueva contraseña</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  value={passwordNueva}
                  onChange={e => setPasswordNueva(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirmar nueva contraseña</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Repite la nueva contraseña"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.perfilFormSection}>
            <div className={styles.perfilFormSectionTitle}>Datos de acceso</div>
            <div className={styles.readOnlyField}>
              <label className={styles.readOnlyLabel}>Email</label>
              <div className={styles.readOnlyValue}>camila.t@surtitelas.com</div>
              <div className={styles.readOnlyNote}>
                El email es tu identificador de acceso y no puede cambiarse
              </div>
            </div>
            <div style={{ height: '16px' }} />
            <div className={styles.readOnlyField}>
              <label className={styles.readOnlyLabel}>Rol del sistema</label>
              <div className={styles.readOnlyValue}>Asesor de Ventas</div>
              <div className={styles.readOnlyNote}>
                Los roles son asignados por el administrador
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
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