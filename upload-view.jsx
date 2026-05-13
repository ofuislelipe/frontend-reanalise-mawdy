// Tela de UPLOAD — recebe 1 Excel + 1 ZIP. Drag & drop, validação,
// botão de envio que dispara POST FormData para webhook n8n.

const ACCEPT_EXCEL = ['.xlsx', '.xls', '.csv'];
const ACCEPT_ZIP   = ['.zip'];
const MAX_MB = 200;

// URL do webhook n8n. Substitua pela URL real exposta pelo seu workflow.
// Em produção, considere usar variável de ambiente / config global.
const N8N_WEBHOOK_URL = 'https://opexia.cnpseguradora.com.br/webhook/refaturamento-funeral';

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024*1024) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1024/1024).toFixed(1)} MB`;
}

function FileSlot({ kind, file, onPick, onClear, accept, hint, layout }) {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const [error, setError] = React.useState(null);

  const validate = (f) => {
    if (!f) return 'Arquivo inválido';
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!accept.includes(ext)) return `Formato não aceito. Use ${accept.join(', ')}`;
    if (f.size > MAX_MB * 1024 * 1024) return `Arquivo maior que ${MAX_MB} MB`;
    return null;
  };

  const handle = (f) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    onPick(f);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handle(f);
  };

  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handle(f);
  };

  const isXls = kind === 'excel';
  const accent = isXls ? 'navy' : 'pink';
  const FileIcon = isXls ? Icon.fileXls : Icon.fileZip;

  if (file) {
    return (
      <div className="dropzone dropzone--filled">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4,
            background: accent === 'navy' ? '#002364' : '#D70064',
            color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0
          }}>
            <FileIcon width="22" height="22"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#002364', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.name}
            </div>
            <div style={{ fontSize: 12, color: '#7F9398', marginTop: 2 }}>
              {formatBytes(file.size)} · pronto para envio
            </div>
          </div>
          <button onClick={onClear} className="btn-text" style={{ padding: 8, color: '#7F9398' }} title="Remover">
            <Icon.close/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dropzone ${drag ? 'dropzone--active' : ''} ${error ? 'dropzone--error' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{ cursor: 'pointer' }}
    >
      <input ref={inputRef} type="file" hidden accept={accept.join(',')} onChange={onChange}/>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: `1.5px solid ${accent === 'navy' ? '#002364' : '#D70064'}`,
          color: accent === 'navy' ? '#002364' : '#D70064',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon.upload width="22" height="22"/>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#002364', marginBottom: 4 }}>
            {isXls ? 'Planilha de casos' : 'Pasta com documentos'}
          </div>
          <div style={{ fontSize: 13, color: '#7F9398', maxWidth: 320, lineHeight: 1.4 }}>
            {hint}
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#A5B3B7', marginTop: 4 }}>
          Arraste e solte ou <span style={{ color: '#002364', fontWeight: 600, textDecoration: 'underline' }}>selecione um arquivo</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {accept.map(a => (
            <span key={a} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 999,
              background: '#F4F3F3', color: '#7F9398', fontWeight: 600, letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>{a}</span>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: 14, fontSize: 13, color: '#A3004C',
          display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600
        }}>
          <Icon.alert width="14" height="14"/> {error}
        </div>
      )}
    </div>
  );
}

// Componente simples de alerta. Empilha no canto superior direito.
function AlertBanner({ kind, message, onClose }) {
  const bg = kind === 'success' ? '#E6F4F3' : '#FBEAEA';
  const fg = kind === 'success' ? '#00615B' : '#A3004C';
  const border = kind === 'success' ? '#00615B' : '#A3004C';
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: bg, color: fg, border: `1.5px solid ${border}`,
      padding: '14px 18px', borderRadius: 4, maxWidth: 420,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 14, fontWeight: 600
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: fg, padding: 4, display: 'grid', placeItems: 'center'
      }}>
        <Icon.close width="16" height="16"/>
      </button>
    </div>
  );
}

function UploadView({ onSubmit, layout = 'split' }) {
  const [excel, setExcel] = React.useState(null);
  const [zip, setZip] = React.useState(null);
  const [competencia, setCompetencia] = React.useState('');
  const [observacoes, setObservacoes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [alert, setAlert] = React.useState(null); // { kind: 'success' | 'error', message: string }

  // Validação do formato AAAA-MM da competência
  const competenciaValida = /^\d{4}-(0[1-9]|1[0-2])$/.test(competencia);
  const ready = excel && zip && competenciaValida && !submitting;

  const showAlert = (kind, message) => {
    setAlert({ kind, message });
    // Auto-fechar sucesso após 6s; erro fica até o usuário fechar
    if (kind === 'success') {
      setTimeout(() => setAlert(null), 6000);
    }
  };

  const handleSubmit = async () => {
    if (!ready) return;
    setSubmitting(true);
    setAlert(null);

    try {
      // Monta FormData com os nomes EXATOS dos fieldLabel configurados no
      // Form Trigger do workflow REQUIEM v4 no n8n.
      const formData = new FormData();
      formData.append('Planilha xlsx', excel);
      formData.append('ZIP de sinistros', zip);
      formData.append('Competência (AAAA-MM)', competencia);
      formData.append('Observações (opcional)', observacoes);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        // NÃO setar Content-Type manualmente. O browser configura o
        // multipart/form-data com boundary automaticamente.
      });

      if (!response.ok) {
        // Tenta ler corpo de erro pra exibir motivo se houver
        let detalheErro = '';
        try {
          const data = await response.json();
          detalheErro = data.message || data.error || '';
        } catch (_) {
          detalheErro = await response.text().catch(() => '');
        }
        throw new Error(
          `Erro ${response.status}: ${response.statusText}` +
          (detalheErro ? ` — ${detalheErro}` : '')
        );
      }

      // Sucesso. Tenta extrair protocolo do response se houver
      let protocolo = '';
      try {
        const data = await response.json();
        protocolo = data.protocolo || data.execution_id || '';
      } catch (_) { /* response pode ser vazio, tudo bem */ }

      const msg = protocolo
        ? `Envio recebido com sucesso! Protocolo: ${protocolo}`
        : 'Envio recebido com sucesso. Você será notificado ao final do processamento.';
      showAlert('success', msg);

      // Notifica componente pai (mantém comportamento original)
      onSubmit?.({ excel, zip, competencia, observacoes, protocolo });

      // Limpa formulário
      setExcel(null);
      setZip(null);
      setCompetencia('');
      setObservacoes('');
    } catch (err) {
      console.error('Falha no envio para o webhook n8n:', err);
      showAlert('error', `Falha no envio: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const slotsClass = layout === 'stacked' ? 'slots-stacked' : 'slots-split';

  return (
    <div className="upload-view">
      <style>{`
        .slots-split { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .slots-stacked { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (max-width: 760px) { .slots-split { grid-template-columns: 1fr; } }
        .field-row { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; margin-top: 16px; }
        @media (max-width: 760px) { .field-row { grid-template-columns: 1fr; } }
        .input-cnp {
          width: 100%; padding: 10px 12px; font-size: 14px;
          border: 1px solid #E3E0E2; border-radius: 4px;
          font-family: inherit; color: #002364; background: white;
        }
        .input-cnp:focus { outline: none; border-color: #002364; }
        .input-cnp.invalid { border-color: #A3004C; }
        .field-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #002364; margin-bottom: 6px;
        }
        .field-hint { font-size: 11px; color: #7F9398; margin-top: 4px; }
      `}</style>

      {alert && <AlertBanner kind={alert.kind} message={alert.message} onClose={() => setAlert(null)}/>}

      <div className={slotsClass} style={{ marginBottom: 20 }}>
        <FileSlot
          kind="excel"
          file={excel}
          onPick={setExcel}
          onClear={() => setExcel(null)}
          accept={ACCEPT_EXCEL}
          hint="Excel ou CSV com a lista de casos a refaturar"
          layout={layout}
        />
        <FileSlot
          kind="zip"
          file={zip}
          onPick={setZip}
          onClear={() => setZip(null)}
          accept={ACCEPT_ZIP}
          hint="Arquivo .zip contendo as pastas com NFs, certidões e demais comprovantes"
          layout={layout}
        />
      </div>

      <div className="field-row">
        <div>
          <label className="field-label">Competência</label>
          <input
            type="text"
            className={`input-cnp ${competencia && !competenciaValida ? 'invalid' : ''}`}
            placeholder="2026-03"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value.trim())}
            maxLength={7}
          />
          <div className="field-hint">Formato: AAAA-MM</div>
        </div>
        <div>
          <label className="field-label">Observações (opcional)</label>
          <input
            type="text"
            className="input-cnp"
            placeholder="Ex: lote referente a sinistros pendentes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        padding: '20px 24px',
        background: 'white',
        borderTop: '1px solid #E3E0E2',
        borderRadius: 4,
        marginTop: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#454E4F', fontSize: 13 }}>
          <Icon.alert width="16" height="16" stroke="#7F9398"/>
          <span>
            {!excel && !zip && 'Adicione a planilha e o ZIP para continuar'}
            {excel && !zip && 'Falta o arquivo .zip com os documentos'}
            {!excel && zip && 'Falta a planilha com os casos'}
            {excel && zip && !competenciaValida && 'Informe a competência no formato AAAA-MM'}
            {excel && zip && competenciaValida && (
              <span style={{ color: '#00615B', fontWeight: 600 }}>
                Pronto · {formatBytes(excel.size + zip.size)} no total
              </span>
            )}
          </span>
        </div>

        <button
          className="btn btn-primary"
          disabled={!ready}
          onClick={handleSubmit}
        >
          {submitting ? (
            <>
              <span className="dots">Enviando</span>
            </>
          ) : (
            <>
              Enviar para refaturamento
              <Icon.arrowRight/>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

window.UploadView = UploadView;
