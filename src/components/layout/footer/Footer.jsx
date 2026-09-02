import { Mail, Zap, Thermometer, MapPin, ShieldCheck } from "lucide-react";
import styles from "./Footer.module.css";
import { usePortfolioHome } from "../../../hooks/usePortfolioData";

const footerMetrics = [
  {
    id: "power",
    label: "CONSUMO",
    value: "152 W",
    Icon: Zap,
  },
  {
    id: "temperature",
    label: "TEMPERATURA",
    value: "32 °C",
    Icon: Thermometer,
  },
  {
    id: "location",
    label: "UBICACIÓN",
    value: "España",
    Icon: MapPin,
  },
  {
    id: "security",
    label: "SEGURIDAD",
    value: "Firewall Activo",
    Icon: ShieldCheck,
  },
];

const iconMap = {
  github: Mail,
  linkedin: Mail,
  instagram: Mail,
  facebook: Mail,
  envelope: Mail,
};

function Footer() {
  const { socialLinks, loading } = usePortfolioHome(true);

  return (
    <footer className={styles.footer}>
      <div className={styles.metrics}>
        {footerMetrics.map((metric) => {
          const { Icon } = metric;

          return (
            <div className={styles.metric} key={metric.id}>
              <Icon
                className={styles.metricIcon}
                size={22}
                strokeWidth={1.7}
                aria-hidden="true"
              />

              <div className={styles.metricContent}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <nav className={styles.socials} aria-label="Redes sociales">
        {loading ? (
          <span className={styles.loading}>Cargando redes…</span>
        ) : socialLinks.length === 0 ? (
          <span className={styles.empty}>Sin redes configuradas</span>
        ) : (
          socialLinks.map((social) => {
            const IconComponent = iconMap[social.icon_key] || Mail;

            return (
              <a
                className={styles.socialLink}
                href={social.url}
                target={social.platform === "email" ? undefined : "_blank"}
                rel={social.platform === "email" ? undefined : "noreferrer"}
                aria-label={social.label}
                key={social.id}
                title={social.title}
              >
                <IconComponent
                  className={styles.socialIcon}
                  aria-hidden="true"
                />
              </a>
            );
          })
        )}
      </nav>
    </footer>
  );
}

export default Footer;
