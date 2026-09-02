import {
  ArrowRight,
  Boxes,
  Clock3,
  Expand,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import styles from "./HeroSection.module.css";

const heroStats = [
  {
    value: "100%",
    label: "AUTOGESTIONADO",
    Icon: ServerCog,
    tone: "cyan",
  },
  {
    value: "24/7",
    label: "OPERATIVO",
    Icon: Clock3,
    tone: "blue",
  },
  {
    value: "SEGURO",
    label: "Y AISLADO",
    Icon: ShieldCheck,
    tone: "purple",
  },
  {
    value: "ESCALABLE",
    label: "Y MODULAR",
    Icon: Expand,
    tone: "teal",
  },
];

function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>BIENVENIDO A</p>

        <h1 id="hero-title" className={styles.title}>
          SYSKOVEX
          <span>LAB</span>
        </h1>

        <p className={styles.description}>
          Laboratorio personal especializado en infraestructura, virtualización,
          automatización, IA y domótica.
        </p>

        <div
          className={styles.stats}
          aria-label="Características del laboratorio"
        >
          {heroStats.map((stat) => {
            const { Icon } = stat;

            return (
              <div
                className={`${styles.stat} ${styles[stat.tone]}`}
                key={stat.value}
              >
                <Icon
                  className={styles.statIcon}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <div className={styles.statContent}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <a className={styles.primaryButton} href="#overview">
            Explorar laboratorio
            <ArrowRight
              className={styles.buttonIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>

          <a className={styles.secondaryButton} href="#overview">
            <Boxes
              className={styles.buttonIcon}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Ver infraestructura
          </a>
        </div>
      </div>

      <div className={styles.heroVisual} aria-hidden="true">
        <img src="/img_hero_lab.webp" alt="" width="1200" height="800" />
      </div>
    </section>
  );
}

export default HeroSection;
