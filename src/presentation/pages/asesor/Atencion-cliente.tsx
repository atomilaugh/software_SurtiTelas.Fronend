import React, { useState, useRef, useEffect } from 'react';
import { Send, Package, User, Paperclip, CheckCircle2, Clock, CreditCard, FileText, Download, UserCheck } from 'lucide-react';
import s from './Atencion-cliente.module.css';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

interface Mensaje {
  id: number;
  texto: string;
  remitente: 'asesor' | 'cliente';
  hora: string;
}

export const AtencionCliente: React.FC = () => {
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [pedidoData, setPedidoData] = useState({ detalle: '', urgencia: 'Normal', clienteId: 'CL-992' });
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  
  // 1. Ajustamos los mensajes iniciales para que el Asesor responda
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { 
      id: 1, 
      texto: '¡Hola! Tengo una duda sobre los tiempos de entrega para un pedido de 50 metros de lino.', 
      remitente: 'cliente', 
      hora: '09:05 AM' 
    },
    { 
      id: 2, 
      texto: '¡Hola! Claro que sí. Los pedidos estándar toman de 3 a 5 días hábiles. Si lo marco como prioritario en el sistema, lo despachamos en 48 horas hacia tu taller.', 
      remitente: 'asesor', 
      hora: '09:06 AM' 
    },
    { 
      id: 3, 
      texto: 'Perfecto, ¿me ayudas generando la solicitud de una vez?', 
      remitente: 'cliente', 
      hora: '09:08 AM' 
    }
  ]);

  const mensajesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    // 2. Ahora quien envía por defecto desde esta pantalla es el ASESOR
    const mensaje: Mensaje = {
      id: Date.now(),
      texto: nuevoMensaje,
      remitente: 'asesor', 
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje('');
  };

  return (
    <div className={s.container}>
      <header className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Centro de Atención</h1>
          <p className={s.pageSubtitle}>Gestiona las consultas, cotizaciones y pedidos de tus clientes asignados.</p>
        </div>
      </header>

      <div className={s.dashboardGrid}>
        
        {/* COLUMNA IZQUIERDA: Interfaz de Chat Integrado */}
        <div className={s.chatContainer}>
          <div className={s.chatHeader}>
            <div className={s.asesorProfile}>
              <div className={s.avatarWrapper}>
                <User size={20} />
                <span className={s.statusDot}></span>
              </div>
              <div className={s.asesorMeta}>
                {/* 3. El header muestra con quién estamos hablando (El Cliente) */}
                <h3>Confecciones La 70 SAS</h3>
                <span>Cliente Mayorista • Medellín, ANT</span>
              </div>
            </div>
          </div>

          <div className={s.chatBody}>
            {mensajes.map((msg) => (
              <div key={msg.id} className={`${s.messageWrapper} ${msg.remitente === 'asesor' ? s.messageRight : s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <p>{msg.texto}</p>
                  <span className={s.messageTime}>{msg.hora}</span>
                </div>
              </div>
            ))}
            <div ref={mensajesEndRef} />
          </div>

          <form className={s.chatInputArea} onSubmit={enviarMensaje}>
            <button type="button" className={s.attachBtn} title="Adjuntar catálogo o cotización">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              className={s.chatInput} 
              placeholder="Escribe tu respuesta al cliente..." 
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <Button type="submit" className={s.sendBtn}>
              <Send size={18} />
            </Button>
          </form>
        </div>

        {/* COLUMNA DERECHA: Widgets de Contexto para el ASESOR */}
        <div className={s.sidebar}>
          
          {/* Widget 1: Perfil del Cliente Actual */}
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Perfil del Cliente</h3>
              <UserCheck size={18} className={s.widgetIcon} />
            </div>
            <div className={s.statsGrid}>
              <div className={s.statBox}>
                <span className={s.statLabel}>Cartera Pendiente</span>
                <span className={s.statValue} style={{ color: '#ef4444' }}>$450.000</span>
              </div>
              <div className={s.statBox}>
                <span className={s.statLabel}>Cupo Disponible</span>
                <span className={s.statValue}>$1.550.000</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Acciones del Asesor */}
          <div className={s.widgetCard}>
            <h3>Acciones Rápidas</h3>
            <p className={s.widgetText}>Inicia un requerimiento formal en nombre de este cliente.</p>
            <Button className={s.fullWidthBtn} onClick={() => setIsPedidoModalOpen(true)}>
              <Package size={16} />
              Generar Pedido al Cliente
            </Button>
          </div>

          {/* Widget 3: Historial de Pedidos del Cliente */}
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Historial del Cliente</h3>
              <Button variant="ghost" size="sm" className={s.textBtn}>Ver todos</Button>
            </div>
            <div className={s.orderList}>
              <div className={s.orderItem}>
                <div className={s.orderIcon}><Clock size={16} color="#3b82f6" /></div>
                <div className={s.orderInfo}>
                  <strong>#PED-8821</strong>
                  <span>En Proceso • 08 Jun, 2026</span>
                </div>
              </div>
              <div className={s.orderItem}>
                <div className={s.orderIcon}><CheckCircle2 size={16} color="#10b981" /></div>
                <div className={s.orderInfo}>
                  <strong>#PED-8810</strong>
                  <span>Completado • 01 Jun, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 4: Herramientas de Venta */}
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Herramientas de Venta</h3>
              <FileText size={18} className={s.widgetIcon} />
            </div>
            <div className={s.resourceList}>
              <a href="#" className={s.resourceItem}>
                <div className={s.resourceIcon}><FileText size={16} /></div>
                <span className={s.resourceName}>Catálogo Telas Verano 2026.pdf</span>
                <Download size={14} className={s.downloadIcon} />
              </a>
              <a href="#" className={s.resourceItem}>
                <div className={s.resourceIcon}><FileText size={16} /></div>
                <span className={s.resourceName}>Listado_Precios_Mayoristas.pdf</span>
                <Download size={14} className={s.downloadIcon} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Modal para crear pedido A NOMBRE DEL CLIENTE */}
      <Modal open={isPedidoModalOpen} onClose={() => setIsPedidoModalOpen(false)} title="Generar Pedido para Confecciones La 70 SAS">
        <div className={s.form}>
          <div className={s.field}>
            <label className={s.label}>Detalles del requerimiento (Cantidades y Referencias)</label>
            <textarea 
              className={s.textarea}
              placeholder="Ej: 50 metros de lino blanco (REF-002)..."
              value={pedidoData.detalle}
              onChange={(e) => setPedidoData({...pedidoData, detalle: e.target.value})}
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Prioridad de Despacho</label>
            <select className={s.select} onChange={(e) => setPedidoData({...pedidoData, urgencia: e.target.value})}>
              <option>Estándar (3-5 días hábiles)</option>
              <option>Prioritario (48 hrs - Requiere aprobación)</option>
            </select>
          </div>
          <div className={s.modalActions}>
            <Button variant="secondary" onClick={() => setIsPedidoModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => {
              console.log('Pedido enviado a bodega:', pedidoData);
              setIsPedidoModalOpen(false);
            }}>
              Enviar a Bodega
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};