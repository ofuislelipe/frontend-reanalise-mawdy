// Tela de HISTÓRICO — lista de envios anteriores com filtros e ações.

const SAMPLE_HISTORY = [
  { id: 'h1', protocol: 'RFT-2026-04832', stage: 'done',       startedAt: Date.now() - 1000*60*60*5,        excelName: 'casos_funeral_abril.xlsx',  excelSize: 184320,  zipName: 'docs_abril.zip',   zipSize: 24837120, casesCount: 67, durationSec: 412 },
  { id: 'h2', protocol: 'RFT-2026-04829', stage: 'done',       startedAt: Date.now() - 1000*60*60*9,        excelName: 'lote_03_2026.xlsx',         excelSize: 92160,   zipName: 'comprovantes.zip', zipSize: 18243584, casesCount: 34, durationSec: 287 },
  { id: 'h3', protocol: 'RFT-2026-04821', stage: 'error',      startedAt: Date.now() - 1000*60*60*26,       excelName: 'casos_marco.xlsx',          excelSize: 71680,   zipName: 'docs_marco.zip',   zipSize: 9437184,  casesCount: 0,  durationSec: 24, errorMsg: 'Coluna "valor_servico" não encontrada' },
  { id: 'h4', protocol: 'RFT-2026-04810', stage: 'done',       startedAt: Date.now() - 1000*60*60*48,       excelName: 'sinistros_q1.xlsx',         excelSize: 245760,  zipName: 'q1_docs.zip',      zipSize: 47185920, casesCount: 89, durationSec: 624 },
  { id: 'h5', protocol: 'RFT-2026-04795', stage: 'done',       startedAt: Date.now() - 1000*60*60*72,       excelName: 'refat_lote_a.xlsx',         excelSize: 122880,  zipName: 'lote_a.zip',       zipSize: 33554432, casesCount: 51, durationSec: 388 },
  { id: 'h6', protocol: 'RFT-2026-04772', stage: 'done',       startedAt: Date.now() - 1000*60*60*96,       excelName: 'casos_fev_v2.xlsx',         excelSize: 163840,  zipName: 'fev_v2.zip',       zipSize: 28311552, casesCount: 73, durationSec: 501 },
];

function formatRelative(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `há ${hr} h`;
  const d = Math.floor(hr / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

function HistoryView({ items, onOpen, onDownload }) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const all = [...(items || []), ...SAMPLE_HISTORY];

  const filtered = all.filter(it => {
    if (filter !== 'all' && it.stage !== filter) return false;
    if (query && !it.protocol.toLowerCase().includes(query.toLowerCase()) &&
        !it.excelName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: all.length,
    done: all.filter(x => x.stage === 'done').length,
    error: all.filter(x => x.stage === 'error').length,
    cases: all.reduce((s, x) => s + (x.casesCount || 0), 0),
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Stat label="Envios totais" value={stats.total}/>
        <Stat label="Concluídos"   value={stats.done} accent="teal"/>
        <Stat label="Com erro"      value={stats.error} accent="pink"/>
        <Stat label="Casos analisados" value={stats.cases.toLocaleString('pt-BR')}/>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F4F3F3', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Icon.search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7F9398' }}/>
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Buscar por protocolo ou nome do arquivo…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#F4F3F3', padding: 4, borderRadius: 999 }}>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'done', label: 'Concluídos' },
              { id: 'error', label: 'Com erro' },
            ].map(f => (
              <button key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none',
                  fontWeight: 600, fontSize: 12.5,
                  background: filter === f.id ? 'white' : 'transparent',
                  color: filter === f.id ? '#002364' : '#7F9398',
                  boxShadow: filter === f.id ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
                }}>{f.label}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#FAFAFA' }}>
                {['Protocolo', 'Arquivos', 'Casos', 'Status', 'Quando', ''].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 700,
                    color: '#7F9398', letterSpacing: '0.08em', textTransform: 'uppercase',
                    borderBottom: '1px solid #F4F3F3'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(it => (
                <tr key={it.id} style={{ borderBottom: '1px solid #F4F3F3', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#002364', fontWeight: 700 }}>
                      {it.protocol}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', maxWidth: 280 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12.5 }}>
                      <span style={{ color: '#282E2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Icon.fileXls width="13" height="13" style={{ verticalAlign: 'middle', marginRight: 4, color: '#002364' }}/>
                        {it.excelName}
                      </span>
                      <span style={{ color: '#7F9398', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Icon.fileZip width="13" height="13" style={{ verticalAlign: 'middle', marginRight: 4 }}/>
                        {it.zipName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#454E4F', fontWeight: 600 }}>
                    {it.casesCount || '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Pill status={it.stage}/>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12.5, color: '#7F9398' }}>
                    {formatRelative(it.startedAt)}
                    {it.durationSec > 0 && <div style={{ fontSize: 11, color: '#A5B3B7' }}>{Math.floor(it.durationSec/60)}m {it.durationSec % 60}s</div>}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {it.stage === 'done' ? (
                      <button className="btn-text" style={{ fontSize: 12.5, fontWeight: 600 }} onClick={() => onDownload?.(it)}>
                        <Icon.download width="14" height="14" style={{ verticalAlign: 'middle', marginRight: 4 }}/>
                        Baixar
                      </button>
                    ) : (
                      <button className="btn-text" style={{ fontSize: 12.5, fontWeight: 600 }} onClick={() => onOpen?.(it)}>
                        Detalhes <Icon.arrowRight width="13" height="13" style={{ verticalAlign: 'middle', marginLeft: 4 }}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: '#A5B3B7', fontSize: 13 }}>
                  Nenhum envio encontrado com esses filtros.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  const color = accent === 'pink' ? '#D70064' : accent === 'teal' ? '#00615B' : '#002364';
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: '#7F9398', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, fontFamily: 'Raleway' }}>
        {value}
      </div>
    </div>
  );
}

window.HistoryView = HistoryView;
