// Tela de UPLOAD — recebe 1 Excel + 1 ZIP. Drag & drop, validação,
// botão de envio, e callback para iniciar o processamento.

const ACCEPT_EXCEL = ['.xlsx', '.xls', '.csv'];
const ACCEPT_ZIP   = ['.zip'];
const MAX_MB = 200;

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

function UploadView({ onSubmit, layout = 'split' }) {
  const [excel, setExcel] = React.useState(null);
  const [zip, setZip] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const ready = excel && zip && !submitting;

  const handleSubmit = async () => {
    if (!ready) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit({ excel, zip });
    setSubmitting(false);
    setExcel(null); setZip(null);
  };

  // Layouts: split (lado a lado), stacked (vertical), single (cards inline com hero)
  const slotsClass = layout === 'stacked' ? 'slots-stacked' : 'slots-split';

  return (
    <div className="upload-view">
      <style>{`
        .slots-split { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .slots-stacked { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (max-width: 760px) { .slots-split { grid-template-columns: 1fr; } }
      `}</style>

      <div className={slotsClass} style={{ marginBottom: 28 }}>
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

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        padding: '20px 24px',
        background: 'white',
        borderTop: '1px solid #E3E0E2',
        borderRadius: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#454E4F', fontSize: 13 }}>
          <Icon.alert width="16" height="16" stroke="#7F9398"/>
          <span>
            {!excel && !zip && 'Adicione a planilha e o ZIP para continuar'}
            {excel && !zip && 'Falta o arquivo .zip com os documentos'}
            {!excel && zip && 'Falta a planilha com os casos'}
            {excel && zip && (
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
