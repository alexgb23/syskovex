import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Code2,
  LogOut,
  Search,
  Settings,
  Terminal,
  UserRound,
  X,
} from "lucide-react";
import styles from "./TopNavbar.module.css";

const notifications = [
  {
    id: "backup",
    title: "Backup automático completado",
    time: "Hace 15 min",
    type: "success",
  },
  {
    id: "containers",
    title: "Contenedores actualizados",
    time: "Hace 1 hora",
    type: "info",
  },
  {
    id: "automation",
    title: "Nueva automatización creada",
    time: "Hace 3 horas",
    type: "info",
  },
];

function TopNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  const unreadNotifications = notifications.length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen((currentValue) => !currentValue);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((currentValue) => !currentValue);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((currentValue) => !currentValue);
    setIsNotificationsOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <header className={styles.topNavbar}>
      <div className={styles.actions}>
        <div ref={searchRef} className={styles.searchWrapper}>
          {isSearchOpen && (
            <div className={styles.searchPanel}>
              <Search
                className={styles.searchPanelIcon}
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Buscar en el laboratorio..."
                aria-label="Buscar en el laboratorio"
                autoFocus
              />

              {searchValue && (
                <button
                  type="button"
                  className={styles.clearSearchButton}
                  onClick={() => setSearchValue("")}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={15} strokeWidth={1.8} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            className={`${styles.iconButton} ${
              isSearchOpen ? styles.iconButtonActive : ""
            }`}
            onClick={toggleSearch}
            aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar"}
            aria-expanded={isSearchOpen}
            aria-controls="lab-search-panel"
          >
            {isSearchOpen ? (
              <X size={19} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Search size={19} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>

        <button
          type="button"
          className={styles.iconButton}
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
          }}
          aria-label="Abrir terminal"
        >
          <Terminal size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <div ref={notificationsRef} className={styles.notificationWrapper}>
          <button
            type="button"
            className={`${styles.iconButton} ${
              isNotificationsOpen ? styles.iconButtonActive : ""
            }`}
            onClick={toggleNotifications}
            aria-label={`Notificaciones: ${unreadNotifications} sin leer`}
            aria-expanded={isNotificationsOpen}
            aria-controls="notifications-panel"
          >
            <Bell size={18} strokeWidth={1.8} aria-hidden="true" />

            {unreadNotifications > 0 && (
              <span className={styles.notificationDot}>
                <span className={styles.srOnly}>
                  {unreadNotifications} sin leer
                </span>
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div
              id="notifications-panel"
              className={`${styles.dropdown} ${styles.notificationsPanel}`}
            >
              <div className={styles.dropdownHeader}>
                <h2>Notificaciones</h2>

                <span>{unreadNotifications} nuevas</span>
              </div>

              <ul className={styles.notificationList}>
                {notifications.map((notification) => (
                  <li className={styles.notificationItem} key={notification.id}>
                    <span
                      className={`${styles.notificationStatus} ${
                        notification.type === "success"
                          ? styles.notificationSuccess
                          : styles.notificationInfo
                      }`}
                      aria-hidden="true"
                    />

                    <div>
                      <p>{notification.title}</p>
                      <time>{notification.time}</time>
                    </div>
                  </li>
                ))}
              </ul>

              <button type="button" className={styles.dropdownAction}>
                Ver actividad completa
              </button>
            </div>
          )}
        </div>

        <div ref={profileRef} className={styles.profileWrapper}>
          <button
            type="button"
            className={`${styles.profileButton} ${
              isProfileOpen ? styles.profileButtonActive : ""
            }`}
            onClick={toggleProfile}
            aria-label="Abrir menú de Alex"
            aria-expanded={isProfileOpen}
            aria-controls="profile-menu"
          >
            <img
              className={styles.avatar}
              src="/favicon-48.png"
              alt=""
              width="32"
              height="32"
            />

            <span className={styles.profileInfo}>
              <strong>Alex</strong>
              <small>LAB OWNER</small>
            </span>

            <ChevronDown
              className={`${styles.chevron} ${
                isProfileOpen ? styles.chevronOpen : ""
              }`}
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div id="profile-menu" className={styles.dropdown}>
              <div className={styles.profileDropdownHeader}>
                <img src="/favicon-48.png" alt="" width="42" height="42" />

                <div>
                  <strong>Alex</strong>
                  <span>LAB OWNER</span>
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              <button type="button" className={styles.dropdownItem}>
                <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
                Ver perfil
              </button>

              <button type="button" className={styles.dropdownItem}>
                <Settings size={16} strokeWidth={1.8} aria-hidden="true" />
                Preferencias
              </button>

              <button type="button" className={styles.dropdownItem}>
                <Code2 size={16} strokeWidth={1.8} aria-hidden="true" />
                Estado del laboratorio
              </button>

              <div className={styles.dropdownDivider} />

              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
              >
                <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
