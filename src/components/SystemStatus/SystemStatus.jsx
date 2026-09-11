import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  Database,
  Info,
  MonitorCog,
  Server,
  X,
} from "lucide-react";

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
  if (status === "available") return "Disponible";
  if (status === "connected") return "Conectado";
  if (status === "unavailable") return "No disponible";
  if (status === "disconnected") return "Desconectado";
  if (status === "not_configured") return "No configurado";

  return status || "Sin datos";
}

function statusClass(status) {
  if (status === "available" || status === "connected") {
    return styles.statusOk;
  }

  if (status === "unavailable" || status === "disconnected") {
    return styles.statusError;
  }

  return styles.statusUnknown;
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
      subtitle: `${runtime.php_version ?? "PHP"} · ${
        runtime.laravel_version ?? "Laravel"
      }`,
      Icon: MonitorCog,
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
        ["PHP", runtime.php_version],
        ["Laravel", runtime.laravel_version],
        ["Entorno", runtime.environment],
      ],
      details: [
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
      subtitle: "Neon Database",
      Icon: Database,
      accent: "green",
      status: database.status,
      primary: {
        label: "Latencia",
        value: latencyPercent(database.latency_ms),
        display: formatMs(database.latency_ms),
        caption: statusLabel(database.status),
      },
      values: [
        ["Estado", statusLabel(database.status)],
        ["Driver", database.driver],
        ["Latencia", formatMs(database.latency_ms)],
      ],
      details: [
        ["Estado", statusLabel(database.status)],
        ["Driver", database.driver],
        ["Latencia", formatMs(database.latency_ms)],
      ],
    },
    {
      id: "cloudflare",
      label: "Cloudflare",
      subtitle: cloudflare.colo ?? "Proxy y API",
      Icon: Cloud,
      accent: "orange",
      status: cloudflareApi.status,
      primary: {
        label: "Latencia",
        value: latencyPercent(cloudflareApi.latency_ms),
        display: formatMs(cloudflareApi.latency_ms),
        caption: statusLabel(cloudflareApi.status),
      },
      values: [
        ["API", statusLabel(cloudflareApi.status)],
        ["Centro", cloudflare.colo],
        ["Proxy", cloudflare.proxy_detected ? "Activo" : "No"],
      ],
      details: [
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
      subtitle: render.name ?? "Web service",
      Icon: Server,
      accent: "purple",
      status: render.status,
      primary: {
        label: "Latencia",
        value: latencyPercent(render.latency_ms),
        display: formatMs(render.latency_ms),
        caption: statusLabel(render.status),
      },
      values: [
        ["Estado", statusLabel(render.status)],
        ["Servicio", render.name],
        ["Tipo", render.type],
      ],
      details: [
        ["Estado", statusLabel(render.status)],
        ["Servicio", render.name],
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

  const slides = useMemo(() => getMetricSlides(metrics), [metrics]);

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
  const currentSlide = slides[activeSlide] ?? slides[0];

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
          onMouseDown={(event) => event.stopPropagation()}
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
            {slides.map((slide) => {
              const SlideIcon = slide.Icon;

              return (
                <article className={styles.modalCard} key={slide.id}>
                  <div
                    className={`${styles.modalCardTitle} ${
                      styles[slide.accent]
                    }`}
                  >
                    <SlideIcon size={20} strokeWidth={1.8} aria-hidden="true" />

                    <div>
                      <h3>{slide.label}</h3>
                      <span>{slide.subtitle}</span>
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
              );
            })}
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

  const { Icon, label, subtitle, primary, values, accent, status } =
    currentSlide;

  return (
    <>
      <div className={`${styles.container} ${styles.metricBar}`}>
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
              <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
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

              <strong>portfolio-backend</strong>

              <small>
                {subtitle} · {statusLabel(status)}
              </small>
            </div>
          </div>

          <div className={styles.primaryMetric}>
            <MetricRing {...primary} accent={accent} />
          </div>

          <div className={styles.valueGrid}>
            {values.map(([valueLabel, value]) => (
              <span className={styles.valueItem} key={valueLabel}>
                <small>{valueLabel}</small>
                <strong>{formatValue(value)}</strong>
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
