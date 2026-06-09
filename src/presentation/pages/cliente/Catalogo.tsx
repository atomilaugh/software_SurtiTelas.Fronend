import React, { useState, useRef, useEffect } from 'react';
import { Send, Package, User, Paperclip, CheckCircle2, Clock, CreditCard, FileText, Download } from 'lucide-react';
import s from './Catalogo.module.css';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

interface Mensaje {
  id: number;
  texto: string;
  remitente: 'asesor' | 'cliente';
  hora: string;
}

export const CatalogoCliente: React.FC = () => {
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [pedidoData, setPedidoData] = useState({ detalle: '', urgencia: 'Normal' });
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  
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
        
        {/* COLUMNA IZQUIERDA: Interfaz de Chat Integrado */}
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
            <button type="button" className={s.attachBtn} title="Adjuntar archivo">
              <Paperclip size={20} />
            </button>
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

        {/* COLUMNA DERECHA: Widgets de Contexto y Herramientas */}
        <div className={s.sidebar}>
          
          {/* Widget 1: Resumen de Cuenta */}
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

          {/* Widget 2: Gestión Rápida */}
          <div className={s.widgetCard}>
            <h3>Gestión Rápida</h3>
            <p className={s.widgetText}>Inicia un requerimiento formal para que sea procesado por bodega.</p>
            <Button className={s.fullWidthBtn} onClick={() => setIsPedidoModalOpen(true)}>
              <Package size={16} />
              Crear Nuevo Pedido
            </Button>
          </div>

          {/* Widget 3: Pedidos Activos */}
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Pedidos Activos</h3>
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

          {/* Widget 4: Documentos y Recursos */}
          <div className={s.widgetCard}>
            <div className={s.widgetHeader}>
              <h3>Recursos Útiles</h3>
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
                <span className={s.resourceName}>Ficha Técnica de Lavado.pdf</span>
                <Download size={14} className={s.downloadIcon} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Modal para crear pedido */}
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
            <select className={s.select} onChange={(e) => setPedidoData({...pedidoData, urgencia: e.target.value})}>
              <option>Estándar (3-5 días)</option>
              <option>Prioritario (48 hrs)</option>
            </select>
          </div>
          <div className={s.modalActions}>
            <Button variant="secondary" onClick={() => setIsPedidoModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => {
              console.log('Pedido enviado:', pedidoData);
              setIsPedidoModalOpen(false);
            }}>
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};