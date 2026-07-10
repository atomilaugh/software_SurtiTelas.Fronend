import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, Clock, Send, MessageSquare, Plus, Archive, Paperclip, ChevronDown, AlertTriangle } from 'lucide-react';
import s from './ContactoEmpresa.module.css';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataTable } from '@/shared/ui/DataTable';

interface MensajeContacto {
  id: string;
  asunto: string;
  remitente: string;
  email: string;
  telefono?: string;
  empresa?: string;
  tipo: 'Consulta general' | 'Soporte técnico' | 'Cotización' | 'Reclamo' | 'Sugerencia';
  fecha: string;
  estado: 'Nuevo' | 'Leído' | 'Respondido' | 'Cerrado';
  mensaje: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
}

const mockMensajes: MensajeContacto[] = [
  { id: 'MSG-001', asunto: 'Solicitud de cotización para 500 camisas', remitente: 'Tienda La Esquina', email: 'contacto@laesquina.com', telefono: '310 123 4567', empresa: 'Tienda La Esquina', tipo: 'Cotización', fecha: '2024-06-10 09:15', estado: 'Nuevo', prioridad: 'Alta', mensaje: 'Buenos días, necesito una cotización para 500 camisas manga larga en tela algodón, tallas M y L. Requiero entrega en 15 días.' },
  { id: 'MSG-002', asunto: 'Problema con pedido ORD-2024-003', remitente: 'Distribuidora del Norte', email: 'pedidos@del norte.com', telefono: '311 234 5678', empresa: 'Distribuidora del Norte', tipo: 'Reclamo', fecha: '2024-06-10 08:30', estado: 'Leído', prioridad: 'Alta', mensaje: 'El pedido ORD-2024-003 llegó con 3 prendas defectuosas. Adjunto fotos. Solicito reposición urgente.' },
  { id: 'MSG-003', asunto: 'Información sobre materiales disponibles', remitente: 'Confecciones del Sur', email: 'info@confecciones.com', tipo: 'Consulta general', fecha: '2024-06-09 14:20', estado: 'Respondido', prioridad: 'Media', mensaje: 'Quisiera saber qué tipos de telas tienen disponibles para confección de uniformes empresariales.' },
  { id: 'MSG-004', asunto: 'Sugerencia para mejora de catálogo digital', remitente: 'Boutique Elegante', email: 'gerencia@boutique.com', telefono: '312 345 6789', empresa: 'Boutique Elegante', tipo: 'Sugerencia', fecha: '2024-06-09 11:00', estado: 'Nuevo', prioridad: 'Baja', mensaje: 'Sería útil agregar filtros por temporada en el catálogo digital. Actualmente es difícil encontrar prendas de invierno.' },
  { id: 'MSG-005', asunto: 'Soporte para sistema de pedidos', remitente: 'Moda Express', email: 'sistemas@modaexpress.com', tipo: 'Soporte técnico', fecha: '2024-06-08 16:45', estado: 'Respondido', prioridad: 'Media', mensaje: 'El sistema de pedidos no me permite modificar cantidades después de crear la orden. Necesito ayuda para resolver esto.' },
  { id: 'MSG-006', asunto: 'Interés en proveedor de insumos', remitente: 'Textiles del Valle', email: 'compras@textiles.com', telefono: '313 456 7890', empresa: 'Textiles del Valle', tipo: 'Consulta general', fecha: '2024-06-08 10:10', estado: 'Cerrado', prioridad: 'Baja', mensaje: 'Estamos interesados en conocer su lista de proveedores de insumos para evaluar posibles alianzas.' },
  { id: 'MSG-007', asunto: 'URGENTE: Retraso en entrega', remitente: 'Ropa Deportiva Pro', email: 'logistica@deportivapro.com', telefono: '314 567 8901', empresa: 'Ropa Deportiva Pro', tipo: 'Reclamo', fecha: '2024-06-10 07:00', estado: 'Nuevo', prioridad: 'Alta', mensaje: 'La orden ORD-2024-007 tenía fecha de entrega para ayer y no ha llegado. Necesitamos confirmar status urgente.' },
];

const mockInfoEmpresa = {
  nombre: 'SurtiTelas S.A.S',
  nit: '900.987.654-3',
  direccion: 'Calle 45 # 23-67, Bogotá, Colombia',
  telefono: '+57 1 234 5678',
  email: 'contacto@surtitelas.com',
  sitioWeb: 'www.surtitelas.com',
  horario: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM',
};

export const AdminContactoEmpresa: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Nuevo' | 'Leído' | 'Respondido' | 'Cerrado'>('Todos');
  const [filtroTipo, _setFiltroTipo] = useState<string>('Todos');
  const [showNuevoMensaje, setShowNuevoMensaje] = useState(false);
  const [respuesta, setRespuesta] = useState('');

  const filteredMensajes = useMemo(() => {
    return mockMensajes.filter(m =>
      (filtroEstado === 'Todos' || m.estado === filtroEstado) &&
      (filtroTipo === 'Todos' || m.tipo === filtroTipo) &&
      (m.asunto.toLowerCase().includes(search.toLowerCase()) ||
       m.remitente.toLowerCase().includes(search.toLowerCase()) ||
       m.empresa?.toLowerCase().includes(search.toLowerCase()) ||
       m.mensaje.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, filtroEstado, filtroTipo]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'warning';
      case 'Leído': return 'default';
      case 'Respondido': return 'primary';
      case 'Cerrado': return 'success';
      default: return 'default';
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Reclamo': return 'danger';
      case 'Cotización': return 'primary';
      case 'Soporte técnico': return 'warning';
      case 'Sugerencia': return 'default';
      default: return 'default';
    }
  };

  const _getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return s.prioridadAlta;
      case 'Media': return s.prioridadMedia;
      case 'Baja': return s.prioridadBaja;
      default: return '';
    }
  };

  const stats = {
    nuevos: mockMensajes.filter(m => m.estado === 'Nuevo').length,
    urgentes: mockMensajes.filter(m => m.prioridad === 'Alta' && m.estado !== 'Cerrado').length,
    respondidos: mockMensajes.filter(m => m.estado === 'Respondido').length,
    cerrados: mockMensajes.filter(m => m.estado === 'Cerrado').length,
  };

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Contacto con Empresa</h1>
          <p className={s.pageSubtitle}>Comunicación institucional</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowNuevoMensaje(!showNuevoMensaje)}>
          Nuevo Mensaje
        </Button>
      </div>

      {showNuevoMensaje && (
        <div className={s.nuevoMensajePanel}>
          <h3 className={s.nuevoMensajeTitle}>Redactar nuevo mensaje</h3>
          <div className={s.formGrid}>
            <div className={s.field}>
              <label className={s.label}>Destinatario / Empresa</label>
              <input type="text" className={s.input} placeholder="Nombre o empresa..." />
            </div>
            <div className={s.field}>
              <label className={s.label}>Email</label>
              <input type="email" className={s.input} placeholder="correo@empresa.com" />
            </div>
            <div className={s.field}>
              <label className={s.label}>Asunto</label>
              <input type="text" className={s.input} placeholder="Asunto del mensaje..." />
            </div>
            <div className={s.field}>
              <label className={s.label}>Tipo</label>
              <div className={s.selectWrapper}>
                <select className={s.select}>
                  <option value="">Seleccione...</option>
                  <option>Consulta general</option>
                  <option>Soporte técnico</option>
                  <option>Cotización</option>
                  <option>Reclamo</option>
                  <option>Sugerencia</option>
                </select>
                <ChevronDown size={16} className={s.selectIcon} />
              </div>
            </div>
            <div className={s.fieldFull}>
              <label className={s.label}>Mensaje</label>
              <textarea className={s.textarea} rows={4} placeholder="Escriba su mensaje..." />
            </div>
            <div className={s.fieldFull}>
              <label className={s.label}>Adjuntar archivo</label>
              <div className={s.adjuntoBox}>
                <Paperclip size={16} />
                <span>Haga clic para adjuntar archivo</span>
              </div>
            </div>
          </div>
          <div className={s.formActions}>
            <Button variant="secondary" onClick={() => setShowNuevoMensaje(false)}>Cancelar</Button>
            <Button leftIcon={<Send size={16} />} onClick={() => { alert('Mensaje enviado'); setShowNuevoMensaje(false); }}>Enviar mensaje</Button>
          </div>
        </div>
      )}

      <div className={s.infoBar}>
        <div className={s.infoCard}>
          <Mail size={18} className={s.infoIcon} />
          <div>
            <div className={s.infoLabel}>{mockInfoEmpresa.email}</div>
            <div className={s.infoValue}>Email</div>
          </div>
        </div>
        <div className={s.infoCard}>
          <Phone size={18} className={s.infoIcon} />
          <div>
            <div className={s.infoLabel}>{mockInfoEmpresa.telefono}</div>
            <div className={s.infoValue}>Teléfono</div>
          </div>
        </div>
        <div className={s.infoCard}>
          <MapPin size={18} className={s.infoIcon} />
          <div>
            <div className={s.infoLabel}>{mockInfoEmpresa.direccion}</div>
            <div className={s.infoValue}>Dirección</div>
          </div>
        </div>
        <div className={s.infoCard}>
          <Clock size={18} className={s.infoIcon} />
          <div>
            <div className={s.infoLabel}>{mockInfoEmpresa.horario}</div>
            <div className={s.infoValue}>Horario</div>
          </div>
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <MessageSquare size={20} className={s.statIcon} />
          <div>
            <div className={s.statValue}>{stats.nuevos}</div>
            <div className={s.statLabel}>Nuevos</div>
          </div>
        </div>
        <div className={`${s.statCard} ${s.statCardWarning}`}>
          <AlertTriangle size={20} className={s.statIconWarning} />
          <div>
            <div className={s.statValue}>{stats.urgentes}</div>
            <div className={s.statLabel}>Urgentes</div>
          </div>
        </div>
        <div className={s.statCard}>
          <Send size={20} className={s.statIconSuccess} />
          <div>
            <div className={s.statValue}>{stats.respondidos}</div>
            <div className={s.statLabel}>Respondidos</div>
          </div>
        </div>
        <div className={s.statCard}>
          <Archive size={20} className={s.statIconDone} />
          <div>
            <div className={s.statValue}>{stats.cerrados}</div>
            <div className={s.statLabel}>Cerrados</div>
          </div>
        </div>
      </div>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', 'Nuevo', 'Leído', 'Respondido', 'Cerrado'].map(estado => (
            <button
              key={estado}
              className={`${s.filterBtn} ${filtroEstado === estado ? s.filterBtnActive : ''}`}
              onClick={() => setFiltroEstado(estado as typeof filtroEstado)}
            >
              {estado}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por asunto, remitente o mensaje..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <DataTable<MensajeContacto>
        data={filteredMensajes}
        pageSize={10}
        emptyMessage="No se encontraron mensajes de contacto"
        maxVisibleColumns={5}
        detailPanel={{
          title: (m) => m.asunto,
          render: (m) => (
            <div className={s.detailPanel}>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Datos del contacto</h4>
                <div className={s.detailGrid}>
                  <div className={s.detailItem}><span className={s.detailLabel}>Remitente</span><span>{m.remitente}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Empresa</span><span>{m.empresa || '-'}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Email</span><span>{m.email}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Teléfono</span><span>{m.telefono || '-'}</span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Tipo</span><span><Badge variant={getTipoBadge(m.tipo)}>{m.tipo}</Badge></span></div>
                  <div className={s.detailItem}><span className={s.detailLabel}>Prioridad</span><span>{m.prioridad}</span></div>
                </div>
              </div>
              <div className={s.detailSection}>
                <h4 className={s.detailSectionTitle}>Mensaje</h4>
                <div className={s.detailItemFull}><span>{m.mensaje}</span></div>
              </div>
              {m.estado !== 'Cerrado' && (
                <div className={s.detailSection}>
                  <h4 className={s.detailSectionTitle}>Responder</h4>
                  <textarea className={s.textarea} rows={4} placeholder="Escriba su respuesta..." value={respuesta} onChange={e => setRespuesta(e.target.value)} />
                </div>
              )}
            </div>
          ),
        }}
        actions={(m) => [
           ...((m.estado === 'Nuevo' || m.estado === 'Leído') ? [{ label: 'Responder', icon: <Send size={14} />, onClick: () => { alert('Responder mensaje'); } }] : []),
          ...(m.estado === 'Respondido' ? [{ label: 'Cerrar mensaje', icon: <Archive size={14} />, onClick: () => alert(`Mensaje ${m.id} cerrado`) }] : []),
        ]}
        columns={[
          { key: 'id', header: 'ID', width: '80px', sortable: true, render: (m) => <span className={s.tdMono}>{m.id}</span> },
          { key: 'tipo', header: 'Tipo', width: '120px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Consulta general', label: 'Consulta general' },
            { value: 'Soporte técnico', label: 'Soporte técnico' },
            { value: 'Cotización', label: 'Cotización' },
            { value: 'Reclamo', label: 'Reclamo' },
            { value: 'Sugerencia', label: 'Sugerencia' },
          ], render: (m) => (
            <Badge variant={getTipoBadge(m.tipo)}>{m.tipo}</Badge>
          )},
          { key: 'asunto', header: 'Asunto', sortable: true, render: (m) => <span className={s.tdPrimary}>{m.asunto}</span> },
          { key: 'fecha', header: 'Fecha', width: '120px', sortable: true, render: (m) => (
            <div className={s.fechaCell}>
              <Clock size={14} />
              {m.fecha}
            </div>
          )},
          { key: 'prioridad', header: 'Prioridad', width: '100px', sortable: true, render: (m) => (
            <Badge variant={m.prioridad === 'Alta' ? 'danger' : m.prioridad === 'Media' ? 'warning' : 'success'}>{m.prioridad}</Badge>
          )},
          { key: 'estado', header: 'Estado', width: '110px', sortable: true, filterable: true, filterType: 'select', filterOptions: [
            { value: 'Nuevo', label: 'Nuevo' },
            { value: 'Leído', label: 'Leído' },
            { value: 'Respondido', label: 'Respondido' },
            { value: 'Cerrado', label: 'Cerrado' },
          ], render: (m) => (
            <Badge variant={getEstadoBadge(m.estado)}>{m.estado}</Badge>
          )},
        ]}
      />
    </div>
  );
};

