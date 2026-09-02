import {
  Boxes,
  BrainCircuit,
  Cloud,
  ExternalLink,
  House,
  Network,
  PanelTop,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import styles from "./OverviewServices.module.css";

const featuredServices = [
  {
    id: "home-assistant",
    name: "Home Assistant",
    category: "DOMÓTICA",
    Icon: House,
    tone: "blue",
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    category: "ALMACENAMIENTO",
    Icon: Cloud,
    tone: "cyan",
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    category: "MEDIA SERVER",
    Icon: PanelTop,
    tone: "purple",
  },
  {
    id: "pi-hole",
    name: "Pi-hole",
    category: "RED & DNS",
    Icon: ShieldCheck,
    tone: "red",
  },
  {
    id: "nginx-proxy-manager",
    name: "Nginx Proxy Manager",
    category: "PROXY",
    Icon: Network,
    tone: "orange",
  },
];

const automationServices = [
  {
    id: "ollama",
    name: "Ollama + OpenWebUI",
    category: "IA LOCAL",
    Icon: BrainCircuit,
    tone: "purple",
  },
  {
    id: "n8n",
    name: "n8n",
    category: "AUTOMATIZACIONES",
    Icon: Workflow,
    tone: "pink",
  },
  {
    id: "docker",
    name: "Docker",
    category: "CONTENEDORES",
    Icon: Boxes,
    tone: "cyan",
  },
  {
    id: "portainer",
    name: "Portainer",
    category: "GESTIÓN",
    Icon: Server,
    tone: "blue",
  },
];

const rooms = [
  {
    id: "salon",
    name: "Salón",
    devices: "4 dispositivos",
    Icon: House,
  },
  {
    id: "habitacion",
    name: "Habitación",
    devices: "5 dispositivos",
    Icon: Sparkles,
  },
  {
    id: "oficina",
    name: "Oficina",
    devices: "6 dispositivos",
    Icon: Terminal,
  },
  {
    id: "cocina",
    name: "Cocina",
    devices: "8 dispositivos",
    Icon: Router,
  },
];

const activities = [
  {
    id: "backup",
    text: "Backup automático completado",
    time: "Hace 15 min",
  },
  {
    id: "update",
    text: "Actualización de contenedores",
    time: "Hace 1 hora",
  },
  {
    id: "automation",
    text: "Nueva automatización creada",
    time: "Hace 3 horas",
  },
  {
    id: "cpu",
    text: "Alerta de CPU resuelta",
    time: "Hace 5 horas",
  },
  {
    id: "sync",
    text: "Sincronización de datos",
    time: "Hace 12 horas",
  },
];

function OverviewServices() {
  return (
    <section
      className={styles.section}
      aria-labelledby="services-overview-title"
    >
      <h2 id="services-overview-title" className={styles.srOnly}>
        Servicios, domótica, automatización y actividad del laboratorio
      </h2>

      <div className={styles.grid}>
        <FeaturedServicesCard />
        <HomeAutomationCard />
        <AutomationCard />
        <ActivityCard />
      </div>
    </section>
  );
}

function FeaturedServicesCard() {
  return (
    <article className={`${styles.card} ${styles.servicesCard}`}>
      <CardHeader title="SERVICIOS DESTACADOS" action="Ver todos" />

      <ul className={styles.serviceList}>
        {featuredServices.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </ul>
    </article>
  );
}

function HomeAutomationCard() {
  return (
    <article className={`${styles.card} ${styles.homeCard}`}>
      <CardHeader title="DOMÓTICA" action="Ver dashboard" Icon={House} accent />

      <div className={styles.automationMetrics}>
        <AutomationMetric value="23" label="DISPOSITIVOS" detail="Conectados" />

        <AutomationMetric
          value="8"
          label="HABITACIONES"
          detail="Automatizadas"
        />
      </div>

      <div className={styles.roomsGrid}>
        {rooms.map((room) => (
          <RoomItem key={room.id} room={room} />
        ))}
      </div>
    </article>
  );
}

function AutomationCard() {
  return (
    <article className={`${styles.card} ${styles.automationCard}`}>
      <CardHeader title="IA & AUTOMATIZACIÓN" action="Ver workflows" />

      <ul className={styles.serviceList}>
        {automationServices.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </ul>
    </article>
  );
}

function ActivityCard() {
  return (
    <article className={`${styles.card} ${styles.activityCard}`}>
      <CardHeader title="ACTIVIDAD RECIENTE" action="Ver logs" />

      <ul className={styles.activityList}>
        {activities.map((activity) => (
          <li className={styles.activityItem} key={activity.id}>
            <span className={styles.activityDot} aria-hidden="true" />

            <span className={styles.activityText}>{activity.text}</span>

            <time className={styles.activityTime}>{activity.time}</time>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CardHeader({ title, action, Icon, accent = false }) {
  return (
    <header className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        {Icon && (
          <Icon
            className={accent ? styles.headerAccentIcon : styles.headerIcon}
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}

        <h3>{title}</h3>
      </div>

      <button type="button" className={styles.cardAction}>
        {action}
        <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </header>
  );
}

function ServiceItem({ service }) {
  const { Icon } = service;

  return (
    <li className={styles.serviceItem}>
      <span className={`${styles.serviceIcon} ${styles[service.tone]}`}>
        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      </span>

      <span className={styles.serviceInfo}>
        <strong>{service.name}</strong>
        <small>{service.category}</small>
      </span>

      <span className={styles.onlineStatus}>
        Online
        <span className={styles.onlineDot} aria-label="Online" />
      </span>
    </li>
  );
}

function AutomationMetric({ value, label, detail }) {
  return (
    <div className={styles.automationMetric}>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{detail}</small>
    </div>
  );
}

function RoomItem({ room }) {
  const { Icon } = room;

  return (
    <div className={styles.room}>
      <Icon
        className={styles.roomIcon}
        size={21}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <strong>{room.name}</strong>
      <small>{room.devices}</small>
    </div>
  );
}

export default OverviewServices;
