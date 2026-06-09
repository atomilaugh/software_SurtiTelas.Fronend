import React from 'react';
import s from './PerfilCliente.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Edit2, Building, MapPin, Lock, Plus, Trash2 } from 'lucide-react';

const perfilData = {
  nombre: 'Juan Pablo Martínez',
  iniciales: 'JM',
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

export const PerfilCliente: React.FC = () => {
  return (
    <div className={s.perfilLayout}>
      {/* Tarjeta lateral */}
      <div className={s.perfilCard}>
        <div className={s.avatar}>
          {perfilData.iniciales}
          <button className={s.avatarEditBtn}>
            <Edit2 size={14} />
          </button>
        </div>

        <div className={s.perfilNombre}>{perfilData.nombre}</div>
        <div className={s.perfilEmpresa}>{perfilData.empresa}</div>

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
          <div className={s.asesorMiniCard}>
            <div className={s.asesorMiniAvatar}>{perfilData.asesor.iniciales}</div>
            <div>
              <div className={s.asesorMiniName}>{perfilData.asesor.nombre}</div>
              <div className={s.asesorMiniRole}>Asesor de Ventas</div>
            </div>
          </div>
          <div className={s.asesorReadOnlyNote}>
            Tu asesor es asignado por el sistema y no puede ser modificado
          </div>
        </div>
      </div>

      {/* Formulario principal */}
      <div className={s.perfilFormContainer}>
        {/* Datos personales */}
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
                <input className={s.formInput} defaultValue={perfilData.nombre} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>NIT / CC</label>
                <input className={s.formInput} defaultValue={perfilData.nit} />
              </div>
            </div>
            <div className={s.formGrid2}>
              <div className={s.formField}>
                <label className={s.formLabel}>Teléfono</label>
                <input className={s.formInput} defaultValue={perfilData.telefono} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Ciudad</label>
                <input className={s.formInput} defaultValue={perfilData.ciudad} />
              </div>
            </div>
            <div className={s.formField}>
              <label className={s.formLabel}>Email</label>
              <input className={s.formInputReadOnly} defaultValue={perfilData.email} readOnly />
              <span className={s.readOnlyHint}>No se puede modificar el email</span>
            </div>
          </div>
        </div>

        {/* Datos de la empresa */}
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
                <input className={s.formInput} defaultValue={perfilData.empresa} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Sector</label>
                <input className={s.formInput} defaultValue={perfilData.sector} />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Cargo contacto</label>
                <input className={s.formInput} defaultValue={perfilData.cargo} />
              </div>
            </div>
          </div>
        </div>

        {/* Direcciones de entrega */}
        <div className={s.perfilSection}>
          <div className={s.perfilSectionHeader}>
            <h2 className={s.perfilSectionTitle}>
              <MapPin size={16} className={s.perfilSectionIcon} />
              Direcciones de entrega
            </h2>
            <Button variant="secondary" size="sm">
              <Plus size={14} />
              Agregar
            </Button>
          </div>
          <div className={s.direccionesSection}>
            {perfilData.direcciones.map(dir => (
              <div key={dir.id} className={`${s.direccionCard} ${dir.label === 'Principal' ? s.direccionCardPrincipal : ''}`}>
                <div className={s.direccionInfo}>
                  <div className={s.direccionLabel}>{dir.label}</div>
                  <div className={s.direccionText}>{dir.texto}</div>
                  <div className={s.direccionMeta}>{dir.barrio}, {dir.ciudad} • {dir.indicaciones}</div>
                </div>
                <div className={s.direccionActions}>
                  <button className="btn btn--secondary btn--sm" style={{ padding: '6px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn--ghost btn--sm" style={{ padding: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seguridad */}
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
                <input type="password" className={s.formInput} placeholder="••••••••" />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>Nueva contraseña</label>
                <input type="password" className={s.formInput} placeholder="••••••••" />
              </div>
            </div>
            <div className={s.formField}>
              <label className={s.formLabel}>Confirmar nueva contraseña</label>
              <input type="password" className={s.formInput} placeholder="••••••••" />
            </div>
          </div>
          <div className={s.perfilSectionFooter}>
            <Button variant="primary">Guardar cambios</Button>
          </div>
        </div>
      </div>
    </div>
  );
};