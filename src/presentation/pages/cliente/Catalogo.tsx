import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Send, Package, User, Paperclip, CheckCircle2, Clock, CreditCard, FileText, Download, Archive, MessageCircle } from 'lucide-react';
import s from './Catalogo.module.css';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { DetailModal } from '@/shared/ui/DetailModal';
import { Badge } from '@/shared/ui/Badge';
import { Tooltip } from '@/shared/components/Tooltip';
import { usePedidos } from '@/core/stores';
import { useAuth } from '@/core/stores/authStore';

interface Mensaje {
  id: number;
  texto: string;
  remitente: 'asesor' | 'cliente';
  hora: string;
}

interface PedidoActivo {
  id: string;
  estado: 'En Proceso' | 'Completado';
  fecha: string;
  total: string;
  items: string;
}

const pedidosActivos: PedidoActivo[] = [
  { id: '#PED-8821', estado: 'En Proceso', fecha: '08 Jun, 2026', total: '$1.240.000', items: '18 artículos' },
  { id: '#PED-8810', estado: 'Completado', fecha: '01 Jun, 2026', total: '$860.000', items: '9 artículos' },
];

const descargarArchivo = (nombre: string, contenido: string) => {
  const blob = new Blob([contenido], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombre;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const CatalogoCliente: React.FC = () => {
  const navigate = useNavigate();
  const { createPedido } = usePedidos();
  const { user } = useAuth();
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [pedidoData, setPedidoData] = useState({ detalle: '', urgencia: 'Estándar' });
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<PedidoActivo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 1,
      texto: '¡Hola Andrés! Soy Camila, tu asesora asignada. ¿En qué te puedo ayudar hoy con tu inventario de SurtiTelas?',
      remitente: 'asesor',
      hora: '09:00 AM'
    },
    {
      id: 2,
      texto: 'Tengo una duda sobre los tiempos de entrega para un pedido de 50 unidades de lino.',
      remitente: 'cliente',
      hora: '09:05 AM'
    },
    {
      id: 3,
      texto: 'Claro que sí. Los pedidos estándar toman de 3 a 5 días hábiles. Si lo marcas como prioritario en el sistema, lo despachamos en 48 horas. ¿Te gustaría generar la solicitud de una vez?',
      remitente: 'asesor',
      hora: '09:06 AM'
    }
  ]);

  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      id: Date.now(),
      texto: nuevoMensaje,
      remitente: 'cliente',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje('');
    toast.success('Mensaje enviado a tu asesor');
  };

  const handleCrearPedido = () => {
    if (!pedidoData.detalle.trim()) {
      toast.error('Describe tu requerimiento');
      return;
    }
    const fecha = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    createPedido({
      cliente: user?.name || 'Cliente',
      asesor: 'Por asignar',
      fecha,
      items: 1,
      total: 'Por cotizar',
      estado: 'Nuevo',
      prioridad: pedidoData.urgencia as 'Estándar' | 'Prioritario',
      observaciones: pedidoData.detalle,
      itemsList: [{ nombre: pedidoData.detalle, precio: 0, cantidad: 1 }],
    });
    toast.success('Pedido enviado a tu asesor para cotización');
    setIsPedidoModalOpen(false);
    setPedidoData({ detalle: '', urgencia: 'Estándar' });
  };

  const handleAttach = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) toast.success(`Archivo adjunto: ${file.name}`);
    e.target.value = '';
  };

  return (
    <div className={s.container}>
      <header className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Soporte y Pedidos</h1>
          <p className={s.pageSubtitle}>Comunícate en tiempo real y gestiona tu cuenta comercial.</p>
        </div>
      </header>

      <div className={s.dashboardGrid}>
        <div className={s.chatContainer}>
          <div className={s.chatHeader}>
            <div className={s.asesorProfile}>
              <div className={s.avatarWrapper}>
                <User size={20} />
                <span className={s.statusDot}></span>
              </div>
              <div className={s.asesorMeta}>
                <h3>Camila Torres</h3>
                <span>Asesora de Cuenta • En línea</span>
              </div>
            </div>
          </div>

          <div className={s.chatBody}>
            {mensajes.map((msg) => (
              <div key={msg.id} className={`${s.messageWrapper} ${msg.remitente === 'cliente' ? s.messageRight : s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <p>{msg.texto}</p>
                  <span className={s.messageTime}>{msg.hora}</span>
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </div>

            <form className={s.chatInputArea} onSubmit={enviarMensaje}>
              <Tooltip title="Adjuntar archivo"><button type="button" className={s.attachBtn} onClick={handleAttach}>
                <Paperclip size={20} />
              </button></Tooltip>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
            <input
              type="text"
              className={s.chatInput}
              placeholder="Escribe tu mensaje aquí..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <Button type="submit" className={s.sendBtn}>
              <Send size={18} />
            </Button>
          </form>
        </div>

        <div className={s.sidebar}>
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Resumen de Cuenta</h3>
              <CreditCard size={18} className={s.widgetIcon} />
            </div>
            <div className={s.statsGrid}>
              <div className={s.statBox}>
                <span className={s.statLabel}>Saldo Pendiente</span>
                <span className={s.statValue}>$450.000</span>
              </div>
              <div className={s.statBox}>
                <span className={s.statLabel}>Pedidos este mes</span>
                <span className={s.statValue}>3</span>
              </div>
            </div>
          </div>

          <div className={s.widgetCard}>
            <h3>Gestión Rápida</h3>
            <p className={s.widgetText}>Inicia un requerimiento formal para que sea procesado por bodega.</p>
            <Button className={s.fullWidthBtn} onClick={() => setIsPedidoModalOpen(true)}>
              <Package size={16} />
              Crear Nuevo Pedido
            </Button>
          </div>

          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Pedidos Activos</h3>
              <Button variant="ghost" size="sm" className={s.textBtn} onClick={() => navigate('/cliente/pedidos')}>Ver todos</Button>
            </div>
            <div className={s.orderList}>
              {pedidosActivos.map((pedido) => (
                <button type="button" key={pedido.id} className={s.orderItem} onClick={() => setSelectedPedido(pedido)}>
                  <div className={s.orderIcon}><Clock size={16} color={pedido.estado === 'Completado' ? '#10b981' : '#3b82f6'} /></div>
                  <div className={s.orderInfo}>
                    <strong>{pedido.id}</strong>
                    <span>{pedido.estado} • {pedido.fecha}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Recursos Útiles</h3>
              <FileText size={18} className={s.widgetIcon} />
            </div>
            <div className={s.resourceList}>
              <a
                href="#"
                className={s.resourceItem}
                onClick={(e) => {
                  e.preventDefault();
                  descargarArchivo('Catálogo Telas Verano 2026.pdf', 'Catálogo de Telas Verano 2026 - SurtiTelas\n\nContenido de muestra para demostración.');
                  toast.success('Catálogo Telas Verano 2026.pdf descargado');
                }}
              >
                <div className={s.resourceIcon}><FileText size={16} /></div>
                <span className={s.resourceName}>Catálogo Telas Verano 2026.pdf</span>
                <Download size={14} className={s.downloadIcon} />
              </a>
              <a
                href="#"
                className={s.resourceItem}
                onClick={(e) => {
                  e.preventDefault();
                  descargarArchivo('Ficha Técnica de Lavado.pdf', 'Ficha Técnica de Lavado - SurtiTelas\n\n• Lavar a máquina máx 30°C\n• No usar blanqueador\n• Secar a la sombra');
                  toast.success('Ficha Técnica de Lavado.pdf descargado');
                }}
              >
                <div className={s.resourceIcon}><FileText size={16} /></div>
                <span className={s.resourceName}>Ficha Técnica de Lavado.pdf</span>
                <Download size={14} className={s.downloadIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isPedidoModalOpen} onClose={() => setIsPedidoModalOpen(false)} title="Generar Pedido Personalizado">
        <div className={s.form}>
          <div className={s.field}>
            <label className={s.label}>Detalles del requerimiento</label>
            <textarea
              className={s.textarea}
              placeholder="Ej: Necesito 2 rollos de algodón peinado negro y 1 de gris jaspeado..."
              value={pedidoData.detalle}
              onChange={(e) => setPedidoData({...pedidoData, detalle: e.target.value})}
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Nivel de Urgencia</label>
            <select className={s.select} value={pedidoData.urgencia} onChange={(e) => setPedidoData({...pedidoData, urgencia: e.target.value})}>
              <option value="Estándar">Estándar (3-5 días)</option>
              <option value="Prioritario">Prioritario (48 hrs)</option>
            </select>
          </div>
          <div className={s.modalActions}>
            <Button variant="secondary" onClick={() => setIsPedidoModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrearPedido}>Confirmar Pedido</Button>
          </div>
        </div>
      </Modal>

      <DetailModal
        children={null}
        open={Boolean(selectedPedido)}
        onClose={() => setSelectedPedido(null)}
        title={selectedPedido ? `Pedido ${selectedPedido.id}` : 'Pedido'}
        subtitle={selectedPedido?.fecha}
        header={{
          icon: <Archive size={18} />,
          status: selectedPedido ? <Badge variant={selectedPedido.estado === 'Completado' ? 'success' : 'info'}>{selectedPedido.estado}</Badge> : undefined,
        }}
        sections={[
          {
            title: 'Resumen',
            fields: [
              { label: 'Estado', value: selectedPedido?.estado, icon: <CheckCircle2 size={16} /> },
              { label: 'Fecha', value: selectedPedido?.fecha, icon: <Clock size={16} /> },
              { label: 'Artículos', value: selectedPedido?.items, icon: <Package size={16} /> },
              { label: 'Total estimado', value: selectedPedido?.total, icon: <CreditCard size={16} /> },
            ],
          },
          {
            title: 'Soporte',
            children: (
              <Button onClick={() => { setSelectedPedido(null); toast.success('Asesor notificado para revisar este pedido'); }}>
                <MessageCircle size={14} />
                Notificar a mi asesor
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};
