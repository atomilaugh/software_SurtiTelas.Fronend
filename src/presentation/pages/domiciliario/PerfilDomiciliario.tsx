import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Edit2, Check, Image as ImageIcon, User } from 'lucide-react';
import s from './PerfilDomiciliario.module.css';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

export const DomiciliarioPerfil: React.FC = () => {
  const [nombre, setNombre] = useState('Juan Pérez');
  const [telefono, setTelefono] = useState('310 234 5678');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [vehiculo, setVehiculo] = useState('moto');
  const [placa, setPlaca] = useState('ABC-123');
  const [turnoActivo, setTurnoActivo] = useState(true);
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
    if (!/^[\d\s-]{7,}$/.test(telefono.trim())) {
      setFormError('Ingresa un teléfono válido.');
      return false;
    }
    return true;
  };

  const guardarCambios = () => {
    if (!validarPerfil()) return;
    toast.success('Cambios guardados correctamente');
  };

  const finalizarTurno = () => {
    if (!turnoActivo) {
      toast.info('El turno ya está finalizado');
      return;
    }
    setTurnoActivo(false);
    toast.success('Turno finalizado correctamente');
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Mi Perfil</h1>
      <p className={s.pageSubtitle}>Datos personales y configuración de cuenta</p>

      <div className={s.perfilLayout}>
        <div className={s.perfilCard}>
          <div className={s.avatar}>
            J
            <button className={s.avatarEditBtn} title="Cambiar foto" type="button" onClick={() => setIsAvatarOpen(true)}>
              <Edit2 size={14} />
            </button>
          </div>
          <div className={s.perfilName}>{nombre}</div>
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
                <span className={s.turnoPulse} style={{ background: turnoActivo ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                {turnoActivo ? 'Activo' : 'Finalizado'}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={finalizarTurno}>{turnoActivo ? 'Finalizar turno' : 'Turno finalizado'}</Button>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <div className={s.formActions}>
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
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-info)] text-3xl font-bold text-white">
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
            <Button onClick={() => fileInputRef.current?.click()}>
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
