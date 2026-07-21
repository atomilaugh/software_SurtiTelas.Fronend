import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Shield, AlertTriangle, Clock, User, Globe } from 'lucide-react';
import s from './SeguridadUsuarios.module.css';
import { Badge } from '../../../shared/ui/Badge';
import { auditApi, type AuditLog } from '../../../infrastructure/api/auditApi';
import { ESTADOS_AUDITORIA } from '@/shared/constants/options';

type EstadoAuditoria = (typeof ESTADOS_AUDITORIA)[number];

interface Auditoria {
  id: string;
  usuario: string;
  accion: string;
  modulo: string;
  ip: string;
  fecha: string;
  hora: string;
  estado: EstadoAuditoria;
}

function deriveEstado(accion: string): EstadoAuditoria {
  const a = accion.toLowerCase();
  if (a.includes('fallid') || a.includes('error') || a.includes('denegad') || a.includes('rechaz')) return 'Fallido';
  if (a.includes('no autorizado') || a.includes('intento') || a.includes('alerta') || a.includes('sospech')) return 'Alerta';
  return 'Éxito';
}

function toAuditoria(log: AuditLog): Auditoria {
  const created = new Date(log.createdAt);
  const validDate = !Number.isNaN(created.getTime());
  return {
    id: log.id,
    usuario: log.usuario?.nombre ?? 'Sistema',
    accion: log.accion,
    modulo: log.modulo,
    ip: log.ip ?? '—',
    fecha: validDate ? created.toISOString().slice(0, 10) : '—',
    hora: validDate ? created.toTimeString().slice(0, 8) : '—',
    estado: deriveEstado(log.accion),
  };
}

export const AdminSeguridadUsuarios: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'Todos' | EstadoAuditoria>('Todos');
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditApi.list();
      setAuditorias(data.map(toAuditoria));
    } catch {
      setError('No se pudieron cargar los registros de auditoría');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAuditorias();
  }, [fetchAuditorias]);

  const filteredAuditorias = useMemo(() => {
    const q = search.toLowerCase();
    return auditorias.filter(a =>
      (filtro === 'Todos' || a.estado === filtro) &&
      (a.usuario.toLowerCase().includes(q) ||
       a.accion.toLowerCase().includes(q) ||
       a.modulo.toLowerCase().includes(q))
    );
  }, [auditorias, filtro, search]);

  return (
    <div>
      <div className={s.header}>
        <div>
          <h1 className={s.pageTitle}>Seguridad de Usuarios</h1>
          <p className={s.pageSubtitle}>Auditoría y seguridad de usuarios</p>
        </div>
        <div className={s.statsRow}>
          <div className={s.statCard}>
            <Shield size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{auditorias.filter(a => a.estado === 'Éxito').length}</div>
              <div className={s.statLabel}>Éxitos</div>
            </div>
          </div>
          <div className={s.statCard}>
            <AlertTriangle size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{auditorias.filter(a => a.estado === 'Alerta').length}</div>
              <div className={s.statLabel}>Alertas</div>
            </div>
          </div>
          <div className={s.statCard}>
            <Clock size={20} className={s.statIcon} />
            <div>
              <div className={s.statValue}>{auditorias.length}</div>
              <div className={s.statLabel}>Registros</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={s.errorBox}>
          <span>{error}</span>
          <button className={s.retryBtn} onClick={() => void fetchAuditorias()}>Reintentar</button>
        </div>
      )}

      <div className={s.filters}>
        <div className={s.filterGroup}>
          {['Todos', ...ESTADOS_AUDITORIA].map(f => (
            <button
              key={f}
              className={`${s.filterBtn} ${filtro === f ? s.filterBtnActive : ''}`}
              onClick={() => setFiltro(f as typeof filtro)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Buscar en auditoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Módulo</th>
              <th>IP</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={s.loadingBox}>Cargando auditoría...</td>
              </tr>
            ) : filteredAuditorias.length === 0 ? (
              <tr>
                <td colSpan={8} className={s.loadingBox}>
                  {error ? error : 'No se encontraron registros de auditoría'}
                </td>
              </tr>
            ) : (
              filteredAuditorias.map(auditoria => (
                <tr key={auditoria.id}>
                  <td className={s.tdMono}>{auditoria.id}</td>
                  <td className={s.tdPrimary}>
                    <div className={s.usuarioCell}>
                      <User size={14} />
                      {auditoria.usuario}
                    </div>
                  </td>
                  <td>{auditoria.accion}</td>
                  <td>{auditoria.modulo}</td>
                  <td>
                    <div className={s.ipCell}>
                      <Globe size={14} />
                      {auditoria.ip}
                    </div>
                  </td>
                  <td>{auditoria.fecha}</td>
                  <td>{auditoria.hora}</td>
                  <td>
                    <Badge variant={
                      auditoria.estado === 'Éxito' ? 'success' :
                      auditoria.estado === 'Fallido' ? 'default' : 'warning'
                    }>
                      {auditoria.estado}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
