import {
  Activity,
  Boxes,
  Container,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  MonitorUp,
  Server,
} from "lucide-react";
import styles from "./OverviewStats.module.css";

const stats = [
  {
    id: "proxmox",
    title: "PROXMOX CLUSTER",
    Icon: Server,
    tone: "cyan",
    value: "3",
    unit: "NODOS ONLINE",
    detail: "Cluster HA Activo",
    meta: "v8.1.3",
    status: "online",
  },
  {
    id: "virtual-machines",
    title: "MÁQUINAS VIRTUALES",
    Icon: Boxes,
    tone: "purple",
    value: "18",
    unit: "VMs ACTIVAS",
    detail: "2 Suspendidas",
    meta: "0 Apagadas",
  },
  {
    id: "containers",
    title: "CONTENEDORES LXC",
    Icon: Container,
    tone: "violet",
    value: "24",
    unit: "LXC ACTIVOS",
    detail: "3 Plantillas",
    meta: "Imágenes: 12",
  },
  {
    id: "uptime",
    title: "UPTIME LAB",
    Icon: Activity,
    tone: "teal",
    value: "45",
    unit: "DÍAS",
    detail: "Desde 28/03/2025",
    meta: "Sin interrupciones",
  },
];

const resources = [
  {
    label: "CPU",
    value: "23%",
    detail: "28 / 120 Cores",
    progress: 23,
    tone: "ringCyan",
  },
  {
    label: "RAM",
    value: "41%",
    detail: "64 / 128 GB",
    progress: 41,
    tone: "ringBlue",
  },
  {
    label: "STORAGE",
    value: "62%",
    detail: "5.6 / 9 TB",
    progress: 62,
    tone: "ringPurple",
  },
];

function OverviewStats() {
  return (
    <section
      id="overview"
      className={styles.section}
      aria-labelledby="overview-title"
    >
      <h2 id="overview-title" className={styles.srOnly}>
        Estado general del laboratorio
      </h2>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}

        <ResourcesCard />
      </div>
    </section>
  );
}

function StatCard({ stat }) {
  const { Icon } = stat;

  return (
    <article className={`${styles.card} ${styles[stat.tone]}`}>
      <header className={styles.cardHeader}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon
            className={styles.icon}
            size={28}
            strokeWidth={1.8}
            absoluteStrokeWidth
          />
        </span>

        <h3>{stat.title}</h3>
      </header>

      <div className={styles.mainMetric}>
        <strong className={styles.value}>{stat.value}</strong>

        <span className={styles.unit}>
          {stat.unit}

          {stat.status === "online" && (
            <span className={styles.onlineDot} aria-label="Online" />
          )}
        </span>
      </div>

      <footer className={styles.details}>
        <span>{stat.detail}</span>
        <span>{stat.meta}</span>
      </footer>
    </article>
  );
}

function ResourcesCard() {
  return (
    <article className={`${styles.card} ${styles.resourcesCard}`}>
      <header className={styles.cardHeader}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Gauge
            className={styles.icon}
            size={28}
            strokeWidth={1.8}
            absoluteStrokeWidth
          />
        </span>

        <h3>RECURSOS DEL CLUSTER</h3>
      </header>

      <div className={styles.resourcesGrid}>
        {resources.map((resource) => (
          <ResourceMetric key={resource.label} resource={resource} />
        ))}
      </div>

      <button type="button" className={styles.monitorButton}>
        <MonitorUp size={15} strokeWidth={1.8} aria-hidden="true" />
        Ver monitorización
        <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}

function ResourceMetric({ resource }) {
  const ResourceIcon =
    resource.label === "CPU"
      ? Cpu
      : resource.label === "RAM"
        ? Database
        : HardDrive;

  return (
    <div className={styles.resourceMetric}>
      <div
        className={`${styles.resourceRing} ${styles[resource.tone]}`}
        style={{ "--progress": `${resource.progress}%` }}
      >
        <div className={styles.resourceRingContent}>
          <ResourceIcon
            className={styles.resourceIcon}
            size={12}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <strong>{resource.value}</strong>
        </div>
      </div>

      <div className={styles.resourceLabel}>
        <span>{resource.label}</span>
        <small>{resource.detail}</small>
      </div>
    </div>
  );
}

export default OverviewStats;
