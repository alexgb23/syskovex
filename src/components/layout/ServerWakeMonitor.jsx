// src/components/layout/ServerWakeMonitor.jsx
import { useEffect, useState } from "react";
import styles from "./ServerWakeMonitor.module.css";

function formatMs(ms) {
  if (ms == null || ms < 1000) return `${ms ?? 0} ms`;
  const s = (ms / 1000).toFixed(1);
  return `${s} s`;
}

function ServerWakeMonitor({
  loading,
  responseTime,
  error,
  serviceName = "API",
}) {
  const [elapsed, setElapsed] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsVisible(false);
      setElapsed(0);
      return;
    }

    setIsVisible(true);
    setElapsed(0);

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  const isSlow = (responseTime ?? elapsed) > 3000;

  if (!loading && !isSlow && !error) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden="true" />
        <div className={styles.text}>
          <strong>{serviceName} arrancando…</strong>
          <span className={styles.subtext}>
            El servidor está despertando. Tiempo estimado:{" "}
            {formatMs(responseTime ?? elapsed)}
          </span>
        </div>
        {error && <span className={styles.error}>Error: {error}</span>}
      </div>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{
            width: `${Math.min(100, ((responseTime ?? elapsed) / 10000) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ServerWakeMonitor;
