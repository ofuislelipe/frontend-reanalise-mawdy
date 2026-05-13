// Tela de ACOMPANHAMENTO — mostra o caso em processamento com etapas
// (upload → IA analisando → gerando excel → concluído) + download do resultado.

const STAGES = [
  { id: 'upload',     label: 'Upload recebido',          desc: 'Arquivos validados e armazenados' },
  { id: 'extracting', label: 'Extraindo documentos',     desc: 'Lendo planilha e descompactando ZIP' },
  { id: 'analyzing',  label: 'IA analisando casos',      desc: 'Cruzando comprovantes com a planilha' },
  { id: 'generating', label: 'Gerando planilha de retorno', desc: 'Compilando respostas em Excel' },
  { id: 'done',       label: 'Concluído',                desc: 'Pronto para download' },
];

function StageList({ currentIdx, hasError }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {STAGES.map((s, i) => {
        const isPast = i < currentIdx;
        const isNow = i === currentIdx && !hasError;
        const isError = i === currentIdx && hasError;
        const isFuture = i > currentIdx;

        return (
          <div key={s.id} style={{
            display: 'flex', gap: 16, padding: '14px 0',
            borderBottom: i < STAGES.length - 1 ? '1px solid #F4F3F3' : 'none',
          }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isPast ? '#002364' : isNow ? 'white' : isError ? '#A3004C' : 'white',
                border: isFuture ? '1.5px solid #C6C2C5' : isNow ? '1.5px solid #D70064' : 'none',
                color: isPast || isError ? 'white' : isNow ? '#D70064' : '#A5B3B7',
                display: 'grid', placeItems: 'center', flexShrink: 0,
                fontSize: 12, fontWeight: 700,
                boxShadow: isNow ? '0 0 0 4px rgba(215,0,100,.12)' : 'none',
              }}>
                {isPast ? <Icon.check width="14" height="14"/> :
                 isError ? <Icon.alert width="14" height="14"/> :
                 isNow ? <span className="pulse-dot" style={{ width: 8, height: 8, background: '#D70064', borderRadius: '50%' }}/> :
                 i + 1}
              </div>
              {i < STAGES.length - 1 && (
                <div style={{
                  flex: 1, width: 1.5, marginTop: 6,
                  background: isPast ? '#002364' : '#E3E0E2',
                  minHeight: 24,
                }}/>
              )}
            </div>

            <div style={{ flex: 1, paddingTop: 2 }}>
              <div style={{
                fontWeight: 700, fontSize: 14,
                color: isPast ? '#002364' : isNow ? '#D70064' : isError ? '#A3004C' : '#7F9398'
              }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12.5, color: '#7F9398', marginTop: 2 }}>
                {isError ? 'Falha ao processar — tente reenviar' : s.desc}
              </div>
              {isNow && (
                <div className="progress-track" style={{ marginTop: 10, maxWidth: 340 }}>
                  <div className="progress-fill" style={{ width: '60%', animation: 'pulseW 1.6s ease-in-out infinite' }}/>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes pulseW { 0%,100% { width: 30%; } 50% { width: 80%; } }
        @keyframes pulseDot { 0%,100% { opacity: .4; } 50% { opacity: 1; } }
        .pulse-dot { animation: pulseDot 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function TrackingView({ submission, onBack, onClear, onDownload }) {
  if (!submission) {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ color: '#7F9398', fontSize: 14, marginBottom: 16 }}>
          Nenhum envio em andamento.
        </div>
        <button className="btn btn-ghost" onClick={onBack}>
          <Icon.arrowRight style={{ transform: 'rotate(180deg)' }}/> Voltar para upload
        </button>
      </div>
    );
  }

  const idx = STAGES.findIndex(s => s.id === submission.stage);
  const done = submission.stage === 'done';
  const hasError = submission.stage === 'error';

  const elapsed = Math.floor((Date.now() - submission.startedAt) / 1000);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
      <style>{`
        @media (max-width: 880px) { .tracking-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7F9398', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
              Protocolo · {submission.protocol}
            </div>
            <div className="cnp-titlebox" style={{ fontSize: 22 }}>
              {done ? 'Refaturamento concluído' : hasError ? 'Falha no processamento' : 'Processando seus arquivos'}
            </div>
          </div>
          <Pill status={done ? 'done' : hasError ? 'error' : 'processing'}/>
        </div>

        <StageList currentIdx={idx >= 0 ? idx : 0} hasError={hasError}/>

        {done && (
          <div style={{
            marginTop: 24, padding: 20, background: '#F4F3F3', borderRadius: 4,
            display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 4, background: '#00B4AA',
              color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Icon.fileXls width="22" height="22"/>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#002364' }}>
                refaturamento_{submission.protocol}.xlsx
              </div>
              <div style={{ fontSize: 12, color: '#7F9398', marginTop: 2 }}>
                Resposta da IA · {submission.casesCount || 42} casos analisados
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => onDownload?.(submission)}>
              <Icon.download/> Baixar Excel
            </button>
          </div>
        )}

        {hasError && (
          <div style={{
            marginTop: 24, padding: 16, background: 'rgba(215,0,100,.06)',
            border: '1px solid rgba(215,0,100,.2)', borderRadius: 4,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <Icon.alert stroke="#A3004C"/>
            <div style={{ flex: 1, fontSize: 13, color: '#454E4F', lineHeight: 1.5 }}>
              <strong style={{ color: '#A3004C' }}>{submission.errorMsg || 'Erro inesperado'}</strong><br/>
              Verifique se a planilha contém as colunas obrigatórias e tente novamente.
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7F9398', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
            Detalhes do envio
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <DetailRow icon={<Icon.fileXls/>} label="Planilha" value={submission.excelName} sub={formatBytes(submission.excelSize)}/>
            <DetailRow icon={<Icon.fileZip/>} label="Documentos" value={submission.zipName} sub={formatBytes(submission.zipSize)}/>
            <DetailRow icon={<Icon.clock/>} label="Tempo decorrido" value={`${min}m ${sec.toString().padStart(2,'0')}s`} sub={new Date(submission.startedAt).toLocaleString('pt-BR')}/>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={onClear}>
            Limpar visualização
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={onBack}>
            Novo envio
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, sub }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ color: '#002364', flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#7F9398', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#282E2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 12, color: '#A5B3B7', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

window.TrackingView = TrackingView;
