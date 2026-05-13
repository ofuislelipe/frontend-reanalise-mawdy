// Logo CNP Seguradora — arquivo oficial fornecido pela marca.
// Proporção do PNG: 2406×769 (~3.13:1).
function CnpLogo({ size = 40 }) {
  // size = altura desejada em px
  return (
    <div className="cnp-logo" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img
        src="assets/cnp-logo.png"
        alt="CNP Seguradora"
        style={{ height: size, width: 'auto', display: 'block' }}
      />
    </div>
  );
}

window.CnpLogo = CnpLogo;
