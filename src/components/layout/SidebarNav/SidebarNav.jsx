import { useEffect, useId, useState } from "react";
import {
  Activity,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CloudCog,
  Contact,
  FileText,
  Heart,
  Home,
  PackageCheck,
  Server,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router";
import styles from "./SidebarNav.module.css";

const navigationItems = [
  {
    label: "Resumen",
    to: "/",
    Icon: Home,
    available: true,
    end: true,
  },
  {
    label: "Infraestructura",
    to: "/infraestructura",
    Icon: Server,
    available: true,
  },
  {
    label: "Proxmox Cluster",
    to: "/proxmox",
    Icon: Boxes,
    available: true,
  },
  {
    label: "Servicios",
    to: "/servicios",
    Icon: PackageCheck,
    available: true,
  },
  {
    label: "Domótica",
    to: "/domotica",
    Icon: Home,
    available: true,
  },
  {
    label: "IA & Automatización",
    to: "/ia-automatizacion",
    Icon: Bot,
    available: true,
  },
  {
    label: "Red & Seguridad",
    to: "/red-seguridad",
    Icon: ShieldCheck,
    available: true,
  },
  {
    label: "Monitorización",
    to: "/monitorizacion",
    Icon: Activity,
    available: true,
  },
  {
    label: "Backups",
    to: "/backups",
    Icon: CloudCog,
    available: true,
  },
  {
    label: "Proyectos",
    to: "/proyectos",
    Icon: BriefcaseBusiness,
    available: true,
  },
  {
    label: "Documentación",
    to: "/documentacion",
    Icon: FileText,
    available: true,
  },
  {
    label: "Contacto",
    to: "/about",
    Icon: Contact,
    available: true,
  },
];

function SidebarNav({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  return (
    <div className={`${styles.sidebarShell} ${className}`}>
      <header className={styles.mobileHeader}>
        <NavLink
          to="/"
          end
          className={styles.mobileBrand}
          onClick={closeMenu}
          aria-label="Syskovex Lab: ir al resumen"
        >
          <img
            className={styles.brandLogo}
            src="/logoSyskovex-144.webp"
            alt=""
            width={144}
            height={144}
          />

          <span className={styles.brandText}>
            <strong>SYSKOVEX</strong>
            <small>LABORATORIO</small>
          </span>
        </NavLink>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={isOpen ? "Cerrar navegación" : "Abrir navegación"}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            {isOpen ? "×" : "☰"}
          </span>
        </button>
      </header>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <aside
        id={menuId}
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        aria-label="Navegación principal"
      >
        <div className={styles.sidebarInner}>
          <NavLink
            to="/"
            end
            className={styles.brand}
            onClick={closeMenu}
            aria-label="Syskovex Lab: ir al resumen"
          >
            <img
              className={styles.brandLogo}
              src="/logoSyskovex-144.webp"
              alt=""
              width={144}
              height={144}
            />

            <span className={styles.brandText}>
              <strong>SYSKOVEX</strong>
              <small>LABORATORIO</small>
            </span>
          </NavLink>

          <nav className={styles.navigation}>
            <ul className={styles.navigationList}>
              {navigationItems.map((item) => {
                const { Icon } = item;

                return (
                  <li key={item.label}>
                    {item.available ? (
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          [
                            styles.navigationLink,
                            isActive ? styles.navigationLinkActive : "",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
                      >
                        <Icon
                          className={styles.navigationIcon}
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        <span>{item.label}</span>
                      </NavLink>
                    ) : (
                      <span
                        className={[
                          styles.navigationLink,
                          styles.navigationLinkDisabled,
                        ].join(" ")}
                        aria-disabled="true"
                        title={`${item.label}: próximamente`}
                      >
                        <Icon
                          className={styles.navigationIcon}
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        <span>{item.label}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.sidebarCards}>
            <section
              className={styles.codeCard}
              aria-label="Mensaje de Syskovex"
            >
              <span className={styles.codeSymbol} aria-hidden="true">
                {"</>"}
              </span>

              <p>
                Building the future,
                <br />
                one script at a time.
              </p>
            </section>

            <section
              className={styles.statusCard}
              aria-label="Estado del laboratorio"
            >
              <span className={styles.statusTitle}>LAB STATUS</span>

              <p className={styles.statusOnline}>
                <span className={styles.statusDot} aria-hidden="true" />
                ONLINE
              </p>

              <p className={styles.statusDescription}>
                Todos los sistemas
                <br />
                operativos
              </p>

              <NavLink
                to="/about"
                className={styles.statusLink}
                onClick={closeMenu}
              >
                Ver detalles
                <span aria-hidden="true">→</span>
              </NavLink>
            </section>
          </div>

          <footer className={styles.sidebarFooter}>
            <strong>SYSKOVEX LAB v2.0</strong>

            <span>
              <Home size={12} strokeWidth={1.8} aria-hidden="true" />
              Hecho con
              <Heart
                className={styles.footerHeart}
                size={12}
                fill="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              desde casa
            </span>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export default SidebarNav;
