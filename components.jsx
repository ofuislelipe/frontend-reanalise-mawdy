// Componentes UI compartilhados — fio de Ariadne, ícones, header, toast.

function Ariadne({ d, color = 'navy', width = 1.5, className = '', style = {} }) {
  const stroke = color === 'pink' ? '#D70064' : color === 'white' ? '#FFFFFF' : color === 'teal' ? '#00B4AA' : color === 'sky' ? '#39A8E5' : '#002364';
  return (
    <svg className={className} style={{ overflow: 'visible', ...style }} fill="none" stroke={stroke}
         strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

// Ícones de sistema — desenho de linha aberta, monocromático (cores nível 1/2)
const Icon = {
  upload: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 16V4M12 4l-5 5M12 4l5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>,
  file: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>,
  fileXls: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9 14l6 4M15 14l-6 4"/></svg>,
  fileZip: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M11 11h2M11 14h2M11 17h2"/></svg>,
  filePdf: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 14v4M11 14v4M11 14h2.5a1.5 1.5 0 0 1 0 3H11M16 14v4M16 16h2"/></svg>,
  download: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12M12 16l-5-5M12 16l5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>,
  check: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 13l4 4L19 7"/></svg>,
  close: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6l-6 12"/></svg>,
  alert: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>,
  clock: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  search: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  arrowRight: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  refresh: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>,
  spark: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
};

function Pill({ status }) {
  const cfg = {
    queued:     { cls: 'pill-queued',     label: 'Em fila',       icon: <Icon.clock width="12" height="12"/> },
    processing: { cls: 'pill-processing', label: 'Processando',   icon: <Icon.spark width="12" height="12"/> },
    done:       { cls: 'pill-done',       label: 'Concluído',     icon: <Icon.check width="12" height="12"/> },
    error:      { cls: 'pill-error',      label: 'Erro',          icon: <Icon.alert width="12" height="12"/> },
  }[status] || { cls: 'pill-queued', label: status };
  return <span className={`pill ${cfg.cls}`}>{cfg.icon}{cfg.label}</span>;
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const isError = toast.kind === 'error';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      background: isError ? '#A3004C' : '#002364', color: 'white',
      padding: '14px 18px 14px 16px', borderRadius: 4, minWidth: 280, maxWidth: 420,
      display: 'flex', alignItems: 'flex-start', gap: 12,
      boxShadow: '0 12px 36px -12px rgba(0,0,0,.35)',
      animation: 'slideIn .3s ease',
      fontSize: 14, fontWeight: 500,
    }}>
      <div style={{ marginTop: 1 }}>{isError ? <Icon.alert/> : <Icon.check/>}</div>
      <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.msg}</div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'white', opacity: .8, padding: 0 }}><Icon.close/></button>
    </div>
  );
}

Object.assign(window, { Ariadne, Icon, Pill, Toast });
