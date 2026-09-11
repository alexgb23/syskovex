import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Info, MonitorCog, X } from "lucide-react";

import styles from "./SystemStatus.module.css";

function formatMs(ms) {
  if (ms == null || Number.isNaN(Number(ms))) {
    return "—";
  }

  const value = Number(ms);

  if (value < 1000) {
    return `${value.toFixed(0)} ms`;
  }

  return `${(value / 1000).toFixed(1)} s`;
}

function formatValue(value) {
  if (value == null || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Ninguno";
  }

  return String(value);
}

function statusLabel(status) {
  if (status === "healthy") return "Saludable";
  if (status === "available") return "Disponible";
  if (status === "connected") return "Conectado";
  if (status === "unavailable") return "No disponible";
  if (status === "disconnected") return "Desconectado";
  if (status === "not_configured") return "No configurado";
  if (status === "not_suspended") return "Activo";

  return status || "Sin datos";
}

function clampPercent(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
}

function latencyPercent(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return clampPercent((number / 1000) * 100);
}

function createValue(label, value) {
  return {
    label,
    value: formatValue(value),
  };
}

function ServiceIcon({ type, size = 30 }) {
  if (type === "cloudflare") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Cloudflare"
        fill="none"
      >
        <path
          d="M46.8 43.5H18.2c-5.2 0-9.4-3.9-9.4-8.8 0-4.7 3.8-8.5 8.6-8.8C19.3 18.7 25.6 14 33 14c8.2 0 14.9 5.7 16.3 13.4.1 0 .3 0 .4 0 5.3 0 9.6 3.6 9.6 8.1s-4.3 8-9.6 8Z"
          fill="currentColor"
        />

        <path
          d="M18 43.5h30.5"
          stroke="#081526"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".7"
        />
      </svg>
    );
  }

  if (type === "render") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Render"
        fill="none"
      >
        <path
          d="M18 13v38M18 14h17c8 0 13 4.4 13 11s-5 11-13 11H18m17 0 13 15"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "database") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="PostgreSQL"
        fill="none"
      >
        <ellipse cx="32" cy="15" rx="18" ry="8" fill="currentColor" />

        <path
          d="M14 15v17c0 4.4 8.1 8 18 8s18-3.6 18-8V15"
          stroke="currentColor"
          strokeWidth="5"
        />

        <path
          d="M14 32v17c0 4.4 8.1 8 18 8s18-3.6 18-8V32"
          stroke="currentColor"
          strokeWidth="5"
        />
      </svg>
    );
  }

  return <MonitorCog size={size} strokeWidth={1.8} aria-label="Runtime" />;
}

function getMetricSlides(metrics) {
  const runtime = metrics?.runtime ?? {};
  const database = metrics?.database ?? {};
  const cloudflare = metrics?.cloudflare ?? {};
  const cloudflareApi = cloudflare.api ?? {};
  const render = metrics?.render ?? {};

  const memoryUsed = Number(runtime.memory_used_mb);
  const memoryLimit = Number.parseFloat(runtime.memory_limit);

  const memoryPercent =
    !Number.isNaN(memoryUsed) && !Number.isNaN(memoryLimit) && memoryLimit > 0
      ? clampPercent((memoryUsed / memoryLimit) * 100)
      : 0;

  return [
    {
      id: "runtime",
      label: "Runtime",
      serviceName: metrics?.service ?? "portfolio-backend",
      subtitle: `${runtime.php_version ?? "PHP"} · ${
        runtime.laravel_version ?? "Laravel"
      }`,
      iconType: "runtime",
      accent: "cyan",
      status: metrics?.status,

      primary: {
        label: "Memoria",
        value: memoryPercent,
        display: `${memoryPercent.toFixed(0)}%`,
        caption:
          runtime.memory_used_mb != null
            ? `${runtime.memory_used_mb} MB usados`
            : "Sin datos",
      },

      values: [
        createValue("PHP", runtime.php_version),
        createValue("Laravel", runtime.laravel_version),
        createValue("Entorno", runtime.environment),
      ],

      details: [
        ["Servicio", metrics?.service],
        ["PHP", runtime.php_version],
        ["Laravel", runtime.laravel_version],
        ["Entorno", runtime.environment],
        ["Zona horaria", runtime.timezone],
        [
          "Memoria usada",
          runtime.memory_used_mb != null
            ? `${runtime.memory_used_mb} MB`
            : null,
        ],
        [
          "Memoria reservada",
          runtime.memory_reserved_mb != null
            ? `${runtime.memory_reserved_mb} MB`
            : null,
        ],
        [
          "Pico de memoria",
          runtime.memory_peak_mb != null
            ? `${runtime.memory_peak_mb} MB`
            : null,
        ],
        ["Límite", runtime.memory_limit],
      ],
    },

    {
      id: "database",
      label: "PostgreSQL",
      serviceName: database.name ?? "PostgreSQL",
      subtitle: "Base de datos",
      iconType: "database",
      accent: "green",
      status: database.status,

      primary: {
        label: "Latencia",
        value: latencyPercent(database.latency_ms),
        display: formatMs(database.latency_ms),
        caption: statusLabel(database.status),
      },

      values: [
        createValue("Estado", statusLabel(database.status)),
        createValue("Driver", database.driver),
        createValue("Latencia", formatMs(database.latency_ms)),
      ],

      details: [
        ["Servicio", database.name],
        ["Estado", statusLabel(database.status)],
        ["Driver", database.driver],
        ["Latencia", formatMs(database.latency_ms)],
      ],
    },

    {
      id: "cloudflare",
      label: "Cloudflare",
      serviceName: cloudflareApi.name ?? "Cloudflare",
      subtitle: cloudflare.colo ?? "Proxy y API",
      iconType: "cloudflare",
      accent: "orange",
      status: cloudflareApi.status,

      primary: {
        label: "Latencia",
        value: latencyPercent(cloudflareApi.latency_ms),
        display: formatMs(cloudflareApi.latency_ms),
        caption: statusLabel(cloudflareApi.status),
      },

      values: [
        createValue("API", statusLabel(cloudflareApi.status)),
        createValue("Centro", cloudflare.colo),
        createValue("Proxy", cloudflare.proxy_detected ? "Activo" : "No"),
      ],

      details: [
        ["Servicio", cloudflareApi.name],
        ["API", statusLabel(cloudflareApi.status)],
        ["Proxy", cloudflare.proxy_detected ? "Activo" : "No detectado"],
        ["Centro", cloudflare.colo],
        ["Ray ID", cloudflare.ray_id],
        ["Zona", cloudflareApi.name],
        ["Estado de zona", cloudflareApi.zone_status],
        ["Plan", cloudflareApi.plan],
        ["Latencia API", formatMs(cloudflareApi.latency_ms)],
      ],
    },

    {
      id: "render",
      label: "Render",
      serviceName: render.name ?? "Render",
      subtitle: render.type ?? "Web service",
      iconType: "render",
      accent: "purple",
      status: render.status,

      primary: {
        label: "Latencia",
        value: latencyPercent(render.latency_ms),
        display: formatMs(render.latency_ms),
        caption: statusLabel(render.status),
      },

      values: [
        createValue("Estado", statusLabel(render.status)),
        createValue("Servicio", render.name),
        createValue("Tipo", render.type),
      ],

      details: [
        ["Servicio", render.name],
        ["Estado", statusLabel(render.status)],
        ["Tipo", render.type],
        ["Suspendido", render.suspended],
        ["Suspenders", render.suspenders],
        ["ID", render.service_id],
        ["Latencia API", formatMs(render.latency_ms)],
        ["Actualizado", render.updated_at],
      ],
    },
  ];
}

function MetricRing({ value, display, label, caption, accent }) {
  return (
    <div className={styles.ringGroup}>
      <div
        className={`${styles.ring} ${styles[accent]}`}
        style={{
          "--ring-progress": `${clampPercent(value)}%`,
        }}
      >
        <div className={styles.ringInner}>
          <strong>{display}</strong>
        </div>
      </div>

      <span className={styles.ringLabel}>{label}</span>

      <small className={styles.ringCaption}>{caption}</small>
    </div>
  );
}

function SystemStatus({ loading, error, responseTime, metrics }) {
  const [elapsed, setElapsed] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchStartTime = useRef(null);

  const slides = useMemo(() => getMetricSlides(metrics), [metrics]);

  const currentSlide = slides[activeSlide] ?? slides[0];

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return undefined;
    }

    setElapsed(0);

    const interval = window.setInterval(() => {
      setElapsed((previous) => previous + 100);
    }, 100);

    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    setActiveSlide(0);
  }, [metrics]);

  useEffect(() => {
    if (loading || error || slides.length <= 1 || isModalOpen) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((previous) =>
        previous === slides.length - 1 ? 0 : previous + 1,
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, [loading, error, slides.length, isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  const displayTime = responseTime ?? elapsed;

  const closeModal = () => {
    setIsModalOpen(false);

    window.requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const goPrevious = () => {
    setActiveSlide((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1,
    );
  };

  const goNext = () => {
    setActiveSlide((previous) =>
      previous === slides.length - 1 ? 0 : previous + 1,
    );
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (event) => {
    if (
      touchStartX.current == null ||
      touchStartY.current == null ||
      touchStartTime.current == null
    ) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const duration = Date.now() - touchStartTime.current;

    touchStartX.current = null;
    touchStartY.current = null;
    touchStartTime.current = null;

    const minimumDistance = 42;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    const isFastEnough = duration < 700;

    if (!isHorizontal || !isFastEnough || Math.abs(deltaX) < minimumDistance) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrevious();
    }
  };

  const handleModalKeyDown = (event) => {
    if (event.key !== "Tab" || !modalRef.current) {
      return;
    }

    const focusable = Array.from(
      modalRef.current.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    );

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const renderModal = () => {
    if (!isModalOpen) {
      return null;
    }

    return createPortal(
      <div
        className={styles.modalBackdrop}
        role="presentation"
        onMouseDown={closeModal}
      >
        <section
          ref={modalRef}
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="system-status-title"
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={handleModalKeyDown}
        >
          <header className={styles.modalHeader}>
            <div>
              <span className={styles.modalEyebrow}>
                MONITOR DEL LABORATORIO
              </span>

              <h2 id="system-status-title">Estado completo del sistema</h2>

              <p>Petición total: {formatMs(metrics?.request_duration_ms)}</p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Cerrar detalles"
            >
              <X size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </header>

          <div className={styles.modalGrid}>
            {slides.map((slide) => (
              <article className={styles.modalCard} key={slide.id}>
                <div
                  className={`${styles.modalCardTitle} ${styles[slide.accent]}`}
                >
                  <ServiceIcon type={slide.iconType} size={20} />

                  <div>
                    <h3>{slide.label}</h3>
                    <span>{slide.serviceName}</span>
                  </div>
                </div>

                <div className={styles.modalRings}>
                  <MetricRing {...slide.primary} accent={slide.accent} />
                </div>

                <dl className={styles.detailsList}>
                  {slide.details.map(([label, value]) => (
                    <div
                      className={styles.detailRow}
                      key={`${slide.id}-${label}`}
                    >
                      <dt>{label}</dt>
                      <dd>{formatValue(value)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <footer className={styles.modalFooter}>
            <span>
              Estado general:{" "}
              <strong>
                {metrics?.status === "healthy"
                  ? "Saludable"
                  : formatValue(metrics?.status)}
              </strong>
            </span>

            <span>Actualización: {formatValue(metrics?.timestamp)}</span>
          </footer>
        </section>
      </div>,
      document.body,
    );
  };

  if (loading) {
    return (
      <div
        className={`${styles.container} ${styles.loadingContainer}`}
        role="status"
        aria-live="polite"
      >
        <div className={styles.loadingHeader}>
          <span className={styles.spinner} aria-hidden="true" />

          <div className={styles.loadingText}>
            <strong>Servidor despertando…</strong>

            <span>Render está iniciando el backend. Esperando respuesta.</span>
          </div>

          <span className={styles.loadingTime}>{formatMs(displayTime)}</span>
        </div>

        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{
              width: `${Math.min(100, (displayTime / 10000) * 100)}%`,
            }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${styles.container} ${styles.errorContainer}`}
        role="alert"
      >
        <div className={styles.errorHeader}>
          <Info size={20} strokeWidth={1.8} aria-hidden="true" />

          <div>
            <strong>API no disponible</strong>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSlide) {
    return null;
  }

  const {
    iconType,
    label,
    serviceName,
    subtitle,
    primary,
    values,
    accent,
    status,
  } = currentSlide;

  return (
    <>
      <div
        className={`${styles.container} ${styles.metricBar}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className={styles.sliderButton}
          onClick={goPrevious}
          aria-label="Métrica anterior"
        >
          <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <button
          ref={triggerRef}
          type="button"
          className={styles.metricMain}
          onClick={() => setIsModalOpen(true)}
          aria-label={`Abrir detalles de ${label}`}
        >
          <div className={styles.identity}>
            <div className={`${styles.logoBox} ${styles[accent]}`}>
              <ServiceIcon type={iconType} size={30} />
            </div>

            <div className={styles.identityText}>
              <div className={styles.healthLine}>
                <span className={styles.healthDot} />

                <span>
                  {metrics?.status === "healthy"
                    ? "HEALTHY"
                    : statusLabel(status)}
                </span>
              </div>

              <strong>{serviceName}</strong>

              <small>
                {label} · {subtitle} · {statusLabel(status)}
              </small>
            </div>
          </div>

          <div className={styles.primaryMetric}>
            <MetricRing {...primary} accent={accent} />
          </div>

          <div className={styles.valueGrid}>
            {values.map(({ label: valueLabel, value }) => (
              <span className={styles.valueItem} key={valueLabel}>
                <small>{valueLabel}</small>
                <strong>{value}</strong>
              </span>
            ))}
          </div>

          <div className={styles.requestMetric}>
            <small>REQUEST</small>

            <strong>{formatMs(metrics?.request_duration_ms)}</strong>
          </div>
        </button>

        <button
          type="button"
          className={styles.sliderButton}
          onClick={goNext}
          aria-label="Métrica siguiente"
        >
          <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      {renderModal()}
    </>
  );
}

export default SystemStatus;
