import "./HeroSection.css";

export default function HeroSection({ countdown, portfolioUrl }) {
  return (
    <section className="heroLanding" id="hero">
      <div className="heroLanding__content">
        <span className="heroLanding__kicker">Syskovex</span>
        <h1 className="heroLanding__title">Sitio oficial en construcción</h1>

        <p className="heroLanding__text">
          La web principal está en desarrollo. Serás redirigido automáticamente
          a mi portfolio interactivo en <strong>{countdown}</strong> segundos.
        </p>

        <div className="heroLanding__actions">
          <a href={portfolioUrl} className="heroLanding__link">
            Ir ahora al portfolio
          </a>

          <a
            href="/about"
            className="heroLanding__link heroLanding__link--ghost"
          >
            Ver sobre Syskovex
          </a>
        </div>
      </div>
    </section>
  );
}
