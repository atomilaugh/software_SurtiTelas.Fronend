import React, { useRef, useState } from 'react';
import { Edit2, Lock, Check, Image as ImageIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import styles from './PerfilAsesor.module.css';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

export const AsesorPerfil: React.FC = () => {
  const [nombre, setNombre] = useState('Camila Torres');
  const [telefono, setTelefono] = useState('310 234 5678');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validarPerfil = () => {
    setFormError('');
    if (!nombre.trim() || !telefono.trim() || !ciudad.trim()) {
      setFormError('Nombre, teléfono y ciudad son obligatorios.');
      return false;
    }

    const hayCambiosPassword = passwordActual || passwordNueva || passwordConfirm;
    if (hayCambiosPassword) {
      if (!passwordActual || !passwordNueva || !passwordConfirm) {
        setFormError('Completa todos los campos de contraseña.');
        return false;
      }
      if (passwordNueva.length < 8) {
        setFormError('La nueva contraseña debe tener al menos 8 caracteres.');
        return false;
      }
      if (passwordNueva !== passwordConfirm) {
        setFormError('La nueva contraseña no coincide con la confirmación.');
        return false;
      }
    }

    return true;
  };

  const guardarCambios = () => {
    if (!validarPerfil()) return;
    setPasswordActual('');
    setPasswordNueva('');
    setPasswordConfirm('');
    toast.success('Cambios guardados correctamente');
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Mi Perfil</h1>
      <p className={styles.pageSubtitle}>Datos personales y configuración de cuenta</p>

      <div className={styles.perfilLayout}>
        <div className={styles.perfilCard}>
          <div className={styles.avatar}>
            C
            <button className={styles.avatarEditBtn} title="Cambiar foto" type="button" onClick={() => setIsAvatarOpen(true)}>
              <Edit2 size={14} />
            </button>
          </div>
          <div className={styles.perfilName}>{nombre}</div>
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

          {formError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <div className={styles.formActions}>
            <Button onClick={guardarCambios}>
              <Check size={16} />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>

      <Modal open={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} title="Cambiar foto de perfil" size="sm">
        <div className="grid gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-3xl font-bold text-white">
              {nombre.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">Imagen actual</div>
              <div className="text-sm text-[var(--color-text-secondary)]">{avatarName || 'No hay imagen cargada en esta sesión'}</div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAvatarName(file.name);
              toast.success(`Foto seleccionada: ${file.name}`);
            }
            e.target.value = '';
          }} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAvatarOpen(false)}>Cancelar</Button>
            <Button onClick={() => { fileInputRef.current?.click(); }}>
              <ImageIcon size={16} />
              Seleccionar imagen
            </Button>
            {avatarName && (
              <Button variant="success" onClick={() => { toast.success('Foto de perfil actualizada'); setIsAvatarOpen(false); }}>
                <User size={16} />
                Aplicar foto
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
