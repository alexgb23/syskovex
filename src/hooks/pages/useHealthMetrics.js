import useAsyncResource from "../core/useAsyncResource";
import { healthService } from "../../services/api";

const initialValue = {
  status: "loading",
  service: "portfolio-backend",
  timestamp: null,
  runtime: {},
  database: {
    status: "unknown",
    driver: null,
    latency_ms: null,
  },
  cloudflare: {
    proxy_detected: false,
    ray_id: null,
    colo: null,
    api: {
      status: "unknown",
      latency_ms: null,
    },
  },
  render: {
    status: "unknown",
    latency_ms: null,
  },
  request_duration_ms: null,
};

export default function useHealthMetrics(enabled = true) {
  const { data, loading, error, isRefreshing, responseTime } = useAsyncResource(
    healthService.getMetrics,
    initialValue,
    [],
    "Health Metrics",
    enabled,
  );

  return {
    metrics: data ?? initialValue,
    loading,
    error,
    isRefreshing,
    responseTime,
  };
}
