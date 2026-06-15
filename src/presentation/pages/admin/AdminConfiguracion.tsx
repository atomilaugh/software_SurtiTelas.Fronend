import React from 'react';
import { toast } from 'sonner';
import { Save, Shield, Database, Bell, Building } from 'lucide-react';
import s from './AdminConfiguracion.module.css';

interface ConfigSection {
  id: string;
  title: string;
  icon: React.ElementType;
  fields: { label: string; value: string; type: 'text' | 'email' | 'tel' | 'number' | 'select'; options?: string[] }[];
}

const configSections: ConfigSection[] = [
  {
    id: 'empresa',
    title: 'Datos de la Empresa',
    icon: Building,
    fields: [
      { label: 'Nombre', value: 'Surtitelas', type: 'text' },
      { label: 'NIT', value: '900.123.456-7', type: 'text' },
      { label: 'Email', value: 'info@surtitelas.com', type: 'email' },
      { label: 'Teléfono', value: '018000123456', type: 'tel' },
    ],
  },
  {
    id: 'notificaciones',
    title: 'Notificaciones',
    icon: Bell,
    fields: [
      { label: 'Email notificaciones', value: 'sí', type: 'select', options: ['sí', 'no'] },
      { label: 'SMS recordatorios', value: 'no', type: 'select', options: ['sí', 'no'] },
      { label: 'Recordatorio día anterior', value: '24', type: 'number' },
    ],
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    icon: Shield,
    fields: [
      { label: 'Contraseña mínima', value: '8', type: 'number' },
      { label: 'Sesión máxima', value: '60', type: 'number' },
      { label: 'Autenticación 2FA', value: 'requerida', type: 'select', options: ['requerida', 'opcional', 'desactivada'] },
    ],
  },
  {
    id: 'integraciones',
    title: 'Integraciones',
    icon: Database,
    fields: [
      { label: 'API WhatsApp', value: 'activada', type: 'select', options: ['activada', 'desactivada'] },
      { label: 'API Domicilios', value: 'activada', type: 'select', options: ['activada', 'desactivada'] },
    ],
  },
];

export const AdminConfiguracion: React.FC = () => {
  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Configuración</h1>
          <p className={s.pageSubtitle}>Ajustes del sistema y la empresa</p>
        </div>
      </div>

      <div className={s.configGrid}>
        {configSections.map(section => (
          <div key={section.id} className={s.configCard}>
            <div className={s.configCardHeader}>
              <section.icon size={18} className={s.configCardIcon} />
              <h3 className={s.configCardTitle}>{section.title}</h3>
            </div>
            <div className={s.configCardBody}>
              {section.fields.map((field, i) => (
                <div key={i} className={s.field}>
                  <label className={s.label}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select className={s.select} defaultValue={field.value}>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={s.input}
                      defaultValue={field.value}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={s.actionsBar}>
        <button className={s.saveBtn} onClick={() => toast.success('Configuración guardada correctamente')}>
          <Save size={16} />
          Guardar cambios
        </button>
      </div>
    </div>
  );
};