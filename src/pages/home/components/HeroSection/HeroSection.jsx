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
        <picture>
          {/* Móvil: hasta 639 px */}
          <source
            media="(max-width: 39.99rem)"
            type="image/avif"
            srcSet="/img_hero/img_hero_lab_480_avif.avif"
          />
          <source
            media="(max-width: 39.99rem)"
            type="image/webp"
            srcSet="/img_hero/img_hero_lab_480_webp.webp"
          />

          {/* Tablet: 640 px a 1023 px */}
          <source
            media="(max-width: 63.99rem)"
            type="image/avif"
            srcSet="/img_hero/img_hero_lab_768_avif.avif"
          />
          <source
            media="(max-width: 63.99rem)"
            type="image/webp"
            srcSet="/img_hero/img_hero_lab_768_webp.webp"
          />

          {/* Escritorio: 1024 px a 1439 px */}
          <source
            media="(max-width: 89.99rem)"
            type="image/avif"
            srcSet="/img_hero/img_hero_lab_1200_avif.avif"
          />
          <source
            media="(max-width: 89.99rem)"
            type="image/webp"
            srcSet="/img_hero/img_hero_lab_1200_webp.webp"
          />

          {/* Escritorio grande: desde 1440 px */}
          <source
            type="image/avif"
            srcSet="/img_hero/img_hero_lab_1600_avif.avif"
          />
          <source
            type="image/webp"
            srcSet="/img_hero/img_hero_lab_1600_webp.webp"
          />

          {/* Fallback para navegadores sin AVIF/WebP */}
          <img
            src="/img_hero/img_hero_lab_1600_webp.webp"
            alt=""
            width="1672"
            height="941"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}

export default HeroSection;
