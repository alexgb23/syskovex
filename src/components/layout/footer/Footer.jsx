import { Mail, MapPin, ShieldCheck, Thermometer, Zap } from "lucide-react";
import styles from "./Footer.module.css";

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

const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/TU_USUARIO",
    Icon: GitHubIcon,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/TU_USUARIO/",
    Icon: LinkedInIcon,
  },
  {
    id: "email",
    label: "Enviar un correo",
    href: "mailto:TU_CORREO",
    Icon: Mail,
  },
];

function Footer() {
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
        {socialLinks.map((social) => {
          const { Icon } = social;

          return (
            <a
              className={styles.socialLink}
              href={social.href}
              target={social.id === "email" ? undefined : "_blank"}
              rel={social.id === "email" ? undefined : "noreferrer"}
              aria-label={social.label}
              key={social.id}
            >
              <Icon className={styles.socialIcon} aria-hidden="true" />
            </a>
          );
        })}
      </nav>
    </footer>
  );
}

function GitHubIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2C6.477 2 2 6.589 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.096.682-.222.682-.493 0-.244-.009-1.05-.014-1.905-2.782.619-3.369-1.214-3.369-1.214-.455-1.186-1.11-1.502-1.11-1.502-.908-.639.069-.626.069-.626 1.004.072 1.532 1.058 1.532 1.058.892 1.568 2.34 1.115 2.91.853.09-.666.348-1.115.634-1.371-2.221-.261-4.556-1.143-4.556-5.086 0-1.124.391-2.043 1.03-2.764-.104-.261-.446-1.311.098-2.733 0 0 .84-.276 2.75 1.056A9.314 9.314 0 0 1 12 6.85c.85.004 1.706.118 2.505.347 1.909-1.332 2.748-1.056 2.748-1.056.545 1.422.203 2.472.1 2.733.64.721 1.028 1.64 1.028 2.764 0 3.953-2.34 4.822-4.568 5.078.358.32.676.947.676 1.909 0 1.378-.012 2.488-.012 2.827 0 .274.18.594.688.493C19.138 20.619 22 16.782 22 12.253 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.452 3H3.548A.548.548 0 0 0 3 3.548v16.904c0 .303.245.548.548.548h16.904a.548.548 0 0 0 .548-.548V3.548A.548.548 0 0 0 20.452 3ZM8.339 18.337H5.671V9.755h2.668v8.582ZM7.005 8.583a1.547 1.547 0 1 1 0-3.094 1.547 1.547 0 0 1 0 3.094Zm11.332 9.754h-2.666v-4.174c0-.995-.018-2.276-1.387-2.276-1.389 0-1.601 1.084-1.601 2.204v4.246h-2.666V9.755h2.559v1.173h.036c.356-.675 1.227-1.387 2.525-1.387 2.702 0 3.2 1.778 3.2 4.091v4.705Z" />
    </svg>
  );
}

export default Footer;
