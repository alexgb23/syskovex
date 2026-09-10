// src/components/SystemStatus/SystemStatus.jsx
import { useEffect, useState } from "react";
import styles from "./SystemStatus.module.css";

function formatMs(ms) {
  if (ms == null || ms < 1000) return `${ms ?? 0} ms`;
  const s = (ms / 1000).toFixed(1);
  return `${s} s`;
}

function SystemStatus({ loading, error, responseTime }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }

    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  const getStatusText = () => {
    if (error) return "Error";
    if (loading) return "Arrancando";
    if (responseTime == null) return "Sin datos";
    if (responseTime < 1000) return "Óptimo";
    if (responseTime < 3000) return "Normal";
    return "Lento";
  };

  const getStatusColor = () => {
    if (error) return "#f87171";
    if (loading) return "#fbbf24";
    if (responseTime == null) return "#a3a3a3";
    if (responseTime < 1000) return "#34d399";
    if (responseTime < 3000) return "#60a5fa";
    return "#f59e0b";
  };

  const showLoading = loading || error;
  const displayTime = responseTime ?? elapsed;

  return (
    <div className={styles.container}>
      {showLoading ? (
        // Estado de carga / error
        <>
          <div className={styles.loadingRow}>
            <div className={styles.spinner} aria-hidden="true" />
            <span className={styles.loadingText}>
              {error ? "Error de conexión" : "Servidor arrancando…"}
            </span>
          </div>
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{
                width: `${Math.min(100, (displayTime / 10000) * 100)}%`,
              }}
            />
          </div>
          <div className={styles.subtext}>{formatMs(displayTime)}</div>
          {error && <div className={styles.error}>{error}</div>}
        </>
      ) : (
        // Estado normal con métricas
        <>
          <div className={styles.row}>
            <span className={styles.label}>API</span>
            <span className={styles.status} style={{ color: getStatusColor() }}>
              {getStatusText()}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Latencia</span>
            <span className={styles.value}>
              {responseTime != null ? `${responseTime} ms` : "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default SystemStatus;
