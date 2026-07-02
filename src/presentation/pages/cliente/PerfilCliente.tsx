import React, { useState } from 'react';
import { toast } from 'sonner';
import s from './PerfilCliente.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Edit2, Building, MapPin, Lock, Plus, Trash2, User, CreditCard, Phone } from 'lucide-react';
import { DetailModal } from '@/shared/ui/DetailModal';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';

interface Direccion {
  id: number;
  label: string;
  texto: string;
  ciudad: string;
  barrio: string;
  indicaciones: string;
}

interface ClienteForm {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nit: string;
  telefono: string;
  ciudad: string;
  empresa: string;
  sector: string;
  cargo: string;
  passwordActual: string;
  passwordNueva: string;
  passwordConfirm: string;
}

const perfilData = {
  nombre: 'Juan Pablo Martínez',
  iniciales: 'JM',
  tipoDocumento: 'CC',
  numeroDocumento: '12345678',
  empresa: 'Almacén El Sol',
  nit: '900.123.456-7',
  email: 'juan.martinez@almacenelsol.com',
  telefono: '310 234 5678',
  ciudad: 'Bogotá',
  sector: 'Comercio al por menor',
  cargo: 'Gerente de Compras',
  asesor: {
    nombre: 'Camila Torres',
    iniciales: 'CT',
    email: 'camila.torres@surtitelas.com',
    telefono: '315 678 9012',
  },
  estadisticas: {
    pedidos: 24,
    entregados: 21,
    totalComprado: '$8.4M',
    mesesActivo: 14,
  },
  direcciones: [
    { id: 1, label: 'Principal', texto: 'Cra 15 #45-23', ciudad: 'Bogotá', barrio: 'Chapinero', indicaciones: 'Edificio azul, local 102' },
    { id: 2, label: 'Secundaria', texto: 'Cl 80 #20-15', ciudad: 'Bogotá', barrio: 'Suba', indicaciones: 'Cerca al parque' },
  ],
};

const emptyDireccion: Omit<Direccion, 'id'> = {
  label: '',
  texto: '',
  ciudad: '',
  barrio: '',
  indicaciones: '',
};

export const PerfilCliente: React.FC = () => {
   const [form, setForm] = useState<ClienteForm>({
     nombre: perfilData.nombre,
     tipoDocumento: perfilData.tipoDocumento,
     numeroDocumento: perfilData.numeroDocumento,
     nit: perfilData.nit,
     telefono: perfilData.telefono,
     ciudad: perfilData.ciudad,
     empresa: perfilData.empresa,
     sector: perfilData.sector,
     cargo: perfilData.cargo,
     passwordActual: '',
     passwordNueva: '',
     passwordConfirm: '',
   });
  const [direcciones, setDirecciones] = useState<Direccion[]>(perfilData.direcciones);
  const [formError, setFormError] = useState('');
  const [direccionModal, setDireccionModal] = useState<{ open: boolean; mode: 'crear' | 'editar'; direccion?: Direccion }>({ open: false, mode: 'crear' });
  const [direccionDraft, setDireccionDraft] = useState<Omit<Direccion, 'id'>>(emptyDireccion);
  const [deleteDireccion, setDeleteDireccion] = useState<Direccion | null>(null);
  const [asesorModalOpen, setAsesorModalOpen] = useState(false);

  const abrirCrearDireccion = () => {
    setDireccionDraft(emptyDireccion);
    setDireccionModal({ open: true, mode: 'crear' });
  };

  const abrirEditarDireccion = (direccion: Direccion) => {
    setDireccionDraft({
      label: direccion.label,
      texto: direccion.texto,
      ciudad: direccion.ciudad,
      barrio: direccion.barrio,
      indicaciones: direccion.indicaciones,
    });
    setDireccionModal({ open: true, mode: 'editar', direccion });
  };

  const guardarDireccion = () => {
    if (!direccionDraft.label.trim() || !direccionDraft.texto.trim() || !direccionDraft.ciudad.trim()) {
      toast.error('Label, dirección y ciudad son obligatorios.');
      return;
    }

    if (direccionModal.mode === 'editar' && direccionModal.direccion) {
      setDirecciones(prev => prev.map(item => item.id === direccionModal.direccion?.id ? { ...item, ...direccionDraft } : item));
      toast.success('Dirección actualizada');
    } else {
      const nuevaDireccion: Direccion = { id: Math.max(0, ...direcciones.map(item => item.id)) + 1, ...direccionDraft };
      setDirecciones(prev => [...prev, nuevaDireccion]);
      toast.success('Dirección agregada');
    }
    setDireccionModal({ open: false, mode: 'crear' });
    setDireccionDraft(emptyDireccion);
  };

  const confirmarEliminarDireccion = () => {
    if (!deleteDireccion) return;
    setDirecciones(prev => prev.filter(item => item.id !== deleteDireccion.id));
    toast.success('Dirección eliminada');
    setDeleteDireccion(null);
  };

  const guardarCambios = () => {
    setFormError('');
    if (!form.nombre.trim() || !form.tipoDocumento.trim() || !form.numeroDocumento.trim() || !form.nit.trim() || !form.telefono.trim() || !form.ciudad.trim()) {
      setFormError('Nombre, tipo de documento, número de documento, NIT, teléfono y ciudad son obligatorios.');
      return;
    }

    const hayCambiosPassword = form.passwordActual || form.passwordNueva || form.passwordConfirm;
    if (hayCambiosPassword) {
      if (!form.passwordActual || !form.passwordNueva || !form.passwordConfirm) {
        setFormError('Completa todos los campos de contraseña.');
        return;
      }
      if (form.passwordNueva.length < 8) {
        setFormError('La nueva contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (form.passwordNueva !== form.passwordConfirm) {
        setFormError('La nueva contraseña no coincide con la confirmación.');
        return;
      }
    }

    toast.success('Cambios guardados correctamente');
    setForm({ ...form, passwordActual: '', passwordNueva: '', passwordConfirm: '' });
  };

  return (
    <div className={s.perfilLayout}>
      <div className={s.perfilCard}>
        <div className={s.avatar}>
          {perfilData.iniciales}
          <button className={s.avatarEditBtn} type="button">
            <Edit2 size={14} />
          </button>
        </div>

        <div className={s.perfilNombre}>{form.nombre}</div>
        <div className={s.perfilEmpresa}>{form.empresa}</div>

        <div className={s.rolTag}>
          <Badge variant="success" dot>
            Cliente
          </Badge>
        </div>

        <div className={s.perfilDivider} />

        <div className={s.perfilStats}>
          <div className={s.perfilStat}>
            <div className={s.perfilStatValue}>{perfilData.estadisticas.pedidos}</div>
            <div className={s.perfilStatLabel}>Pedidos</div>
          </div>
          <div className={s.perfilStat}>
            <div className={s.perfilStatValue}>{perfilData.estadisticas.entregados}</div>
            <div className={s.perfilStatLabel}>Entregas</div>
          </div>
          <div className={s.perfilStat}>
            <div className={s.perfilStatValue}>{perfilData.estadisticas.totalComprado}</div>
            <div className={s.perfilStatLabel}>Total</div>
          </div>
          <div className={s.perfilStat}>
            <div className={s.perfilStatValue}>{perfilData.estadisticas.mesesActivo}</div>
            <div className={s.perfilStatLabel}>Meses</div>
          </div>
        </div>

        <div className={s.asesorSection}>
          <div className={s.asesorSectionTitle}>Asesor asignado</div>
          <button type="button" className={s.asesorMiniCard} onClick={() => setAsesorModalOpen(true)}>
            <div className={s.asesorMiniAvatar}>{perfilData.asesor.iniciales}</div>
            <div>
              <div className={s.asesorMiniName}>{perfilData.asesor.nombre}</div>
              <div className={s.asesorMiniRole}>Asesor de Ventas</div>
            </div>
          </button>
          <div className={s.asesorReadOnlyNote}>
            Tu asesor es asignado por el sistema y no puede ser modificado
          </div>
        </div>
      </div>

      <div className={s.perfilFormContainer}>
        <div className={s.perfilSection}>
          <div className={s.perfilSectionHeader}>
            <h2 className={s.perfilSectionTitle}>
              <Edit2 size={16} className={s.perfilSectionIcon} />
              Datos personales
            </h2>
          </div>
<div className={s.perfilSectionBody}>
             <div className={s.formGrid2}>
               <div className={s.formField}>
                 <label className={s.formLabel}>Nombre completo</label>
                 <input className={s.formInput} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
               </div>
               <div className={s.formField}>
                 <label className={s.formLabel}>NIT / CC</label>
                 <input className={s.formInput} value={form.nit} onChange={e => setForm({ ...form, nit: e.target.value })} />
               </div>
             </div>
             <div className={s.formGrid2}>
               <div className={s.formField}>
                 <label className={s.formLabel}>Teléfono</label>
                 <input className={s.formInput} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
               </div>
               <div className={s.formField}>
                 <label className={s.formLabel}>Tipo de documento</label>
                 <select className={s.formInput} value={form.tipoDocumento} onChange={e => setForm({ ...form, tipoDocumento: e.target.value })}>
                   <option value="">Selecciona tipo</option>
                   <option value="CC">Cédula de Ciudadanía</option>
                   <option value="NIT">NIT</option>
                   <option value="Pasaporte">Pasaporte</option>
                   <option value="CE">Cédula de Extranjería</option>
                 </select>
               </div>
             </div>
             <div className={s.formField}>
               <label className={s.formLabel}>Número de documento</label>
               <input className={s.formInput} value={form.numeroDocumento} onChange={e => setForm({ ...form, numeroDocumento: e.target.value })} placeholder="Ej: 1023456789" maxLength="20" />
             </div>
             <div className={s.formGrid2}>
               <div className={s.formField}>
                 <label className={s.formLabel}>Ciudad</label>
                 <input className={s.formInput} value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
               </div>
             </div>
             <div className={s.formField}>
               <label className={s.formLabel}>Email</label>
               <input className={s.formInputReadOnly} value={perfilData.email} readOnly />
               <span className={s.readOnlyHint}>No se puede modificar el email</span>
             </div>
           </div>
        </div>

        <div className={s.perfilSection}>
          <div className={s.perfilSectionHeader}>
            <h2 className={s.perfilSectionTitle}>
              <Building size={16} className={s.perfilSectionIcon} />
              Datos de la empresa
            </h2>
          </div>
          <div className={s.perfilSectionBody}>
            <div className={s.formGrid3}>
              <div className={s.formField}>
                <label className={s.formLabel}>Nombre empresa</label>
                <input className={s.formInput} value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Sector</label>
                <input className={s.formInput} value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Cargo contacto</label>
                <input className={s.formInput} value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className={s.perfilSection}>
          <div className={s.perfilSectionHeader}>
            <h2 className={s.perfilSectionTitle}>
              <MapPin size={16} className={s.perfilSectionIcon} />
              Direcciones de entrega
            </h2>
            <Button variant="secondary" size="sm" onClick={abrirCrearDireccion}>
              <Plus size={14} />
              Agregar
            </Button>
          </div>
          <div className={s.direccionesSection}>
            {direcciones.map(dir => (
              <div key={dir.id} className={`${s.direccionCard} ${dir.label === 'Principal' ? s.direccionCardPrincipal : ''}`}>
                <div className={s.direccionInfo}>
                  <div className={s.direccionLabel}>{dir.label}</div>
                  <div className={s.direccionText}>{dir.texto}</div>
                  <div className={s.direccionMeta}>{dir.barrio}, {dir.ciudad} • {dir.indicaciones}</div>
                </div>
                <div className={s.direccionActions}>
                  <button className="btn btn--secondary btn--sm" style={{ padding: '6px' }} type="button" onClick={() => abrirEditarDireccion(dir)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn--ghost btn--sm" style={{ padding: '6px' }} type="button" onClick={() => setDeleteDireccion(dir)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.perfilSection}>
          <div className={s.perfilSectionHeader}>
            <h2 className={s.perfilSectionTitle}>
              <Lock size={16} className={s.perfilSectionIcon} />
              Cambiar contraseña
            </h2>
          </div>
          <div className={s.perfilSectionBody}>
            <div className={s.formGrid2}>
              <div className={s.formField}>
                <label className={s.formLabel}>Contraseña actual</label>
                <input type="password" className={s.formInput} placeholder="••••••••" value={form.passwordActual} onChange={e => setForm({ ...form, passwordActual: e.target.value })} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Nueva contraseña</label>
                <input type="password" className={s.formInput} placeholder="••••••••" value={form.passwordNueva} onChange={e => setForm({ ...form, passwordNueva: e.target.value })} />
              </div>
            </div>
            <div className={s.formField}>
              <label className={s.formLabel}>Confirmar nueva contraseña</label>
              <input type="password" className={s.formInput} placeholder="••••••••" value={form.passwordConfirm} onChange={e => setForm({ ...form, passwordConfirm: e.target.value })} />
            </div>
          </div>
          <div className={s.perfilSectionFooter}>
            <Button variant="primary" onClick={guardarCambios}>Guardar cambios</Button>
          </div>
        </div>

        {formError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {formError}
          </div>
        )}
      </div>

      <DetailModal
        children={null}
        open={direccionModal.open}
        onClose={() => setDireccionModal({ open: false, mode: 'crear' })}
        title={direccionModal.mode === 'editar' ? 'Editar dirección' : 'Agregar dirección'}
        subtitle="Información para entregas"
        size="md"
        sections={[
          {
            title: 'Datos de dirección',
            children: (
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Etiqueta
                    <input className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={direccionDraft.label} onChange={e => setDireccionDraft({ ...direccionDraft, label: e.target.value })} placeholder="Casa, Bodega, Principal..." />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Ciudad
                    <input className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={direccionDraft.ciudad} onChange={e => setDireccionDraft({ ...direccionDraft, ciudad: e.target.value })} />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                  Dirección
                  <input className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={direccionDraft.texto} onChange={e => setDireccionDraft({ ...direccionDraft, texto: e.target.value })} />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Barrio
                    <input className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={direccionDraft.barrio} onChange={e => setDireccionDraft({ ...direccionDraft, barrio: e.target.value })} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Indicaciones
                    <input className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-[var(--color-text-primary)] outline-none focus:border-[var(--border-focus)]" value={direccionDraft.indicaciones} onChange={e => setDireccionDraft({ ...direccionDraft, indicaciones: e.target.value })} />
                  </label>
                </div>
              </div>
            ),
          },
        ]}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDireccionModal({ open: false, mode: 'crear' })}>Cancelar</Button>
            <Button onClick={guardarDireccion}>Guardar dirección</Button>
          </div>
        }
      />

      <DetailModal
        children={null}
        open={Boolean(asesorModalOpen)}
        onClose={() => setAsesorModalOpen(false)}
        title="Asesor asignado"
        subtitle="Contacto comercial de tu cuenta"
        sections={[
          {
            title: 'Información de contacto',
            fields: [
              { label: 'Nombre', value: perfilData.asesor.nombre, icon: <User size={16} /> },
              { label: 'Email', value: perfilData.asesor.email, icon: <User size={16} /> },
              { label: 'Teléfono', value: perfilData.asesor.telefono, icon: <Phone size={16} /> },
              { label: 'Rol', value: 'Asesor de Ventas', icon: <User size={16} /> },
            ],
          },
          {
            title: 'Datos de cuenta',
            fields: [
              { label: 'NIT', value: perfilData.nit, icon: <CreditCard size={16} /> },
              { label: 'Empresa', value: perfilData.empresa, icon: <Building size={16} /> },
            ],
          },
        ]}
      />

      <ConfirmationModal
        open={Boolean(deleteDireccion)}
        onClose={() => setDeleteDireccion(null)}
        onConfirm={confirmarEliminarDireccion}
        title="Eliminar dirección"
        description={`¿Eliminar la dirección ${deleteDireccion?.label}? Esta acción no se puede deshacer.`}
        variant="danger"
        confirmLabel="Eliminar"
      />
    </div>
  );
};
