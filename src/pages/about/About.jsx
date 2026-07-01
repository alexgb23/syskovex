import usePageTitle from "../../hooks/usePageTitle";
import "./About.css";

function About() {
  usePageTitle("About");

  return (
    <section className="about-section" id="about">
      <div className="container about-container">
        <div className="about-center sysk-box sysk-edge theme-dark">
          <div className="sysk-content">
            <span className="about-kicker">// Sobre mí</span>

            <h1 className="about-title">About</h1>

            <p className="about-text">
              <span className="about-brand">Alex</span> |
              <span className="about-brand">Syskovex</span> representa una
              visión técnica centrada en infraestructura IT, software y
              automatización. A través de este laboratorio desarrollo y
              documento arquitecturas reales, entornos Linux, virtualización con
              Proxmox, redes segmentadas, integraciones inteligentes y
              soluciones digitales pensadas para evolucionar desde un portfolio
              profesional hasta una identidad tecnológica sólida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
