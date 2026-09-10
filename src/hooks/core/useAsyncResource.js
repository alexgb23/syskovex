// src/hooks/core/useAsyncResource.js
import { useEffect, useState, useRef } from "react";

function buildHookErrorMessage(label, error) {
  if (error instanceof Error) {
    return error.message;
  }

  return `${label} error al cargar datos`;
}

function hasMeaningfulData(value, initialValue) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === "object") {
    if (!initialValue || typeof initialValue !== "object") {
      return true;
    }

    return Object.keys(value).some((key) => {
      const current = value[key];
      const initial = initialValue[key];

      if (Array.isArray(current)) {
        return current.length > 0;
      }

      if (current && typeof current === "object") {
        return true;
      }

      return current !== initial && current != null && current !== "";
    });
  }

  return value !== initialValue && value != null && value !== "";
}

const resourceCache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCachedResource(cacheKey) {
  const cached = resourceCache.get(cacheKey);

  if (!cached) return null;

  const isFresh = Date.now() - cached.time < CACHE_TTL;

  if (!isFresh) {
    resourceCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function getSharedRequest(cacheKey, fetcher) {
  const pending = pendingRequests.get(cacheKey);

  if (pending) {
    return pending;
  }

  const request = Promise.resolve()
    .then(fetcher)
    .then((result) => {
      const data = result ?? null;

      resourceCache.set(cacheKey, {
        data,
        time: Date.now(),
      });

      return data;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, request);

  return request;
}

/**
 * Hook profesional para cargar recursos asíncronos con:
 * - Caché en memoria (TTL configurable)
 * - Deduplicación de peticiones concurrentes
 * - Reintentos automáticos en caso de error
 * - Estados: loading, isRefreshing, error
 */
export default function useAsyncResource(
  fetcher,
  initialValue,
  deps = [],
  label = "Resource",
  enabled = true,
) {
  const cacheKey = JSON.stringify([label, enabled, ...deps]);

  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const prevEnabledRef = useRef(enabled);
  const startTimeRef = useRef(null);

  const [state, setState] = useState(() => {
    if (!enabled) {
      return {
        data: initialValue,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      };
    }

    const cachedData = getCachedResource(cacheKey);

    if (cachedData !== null) {
      return {
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      };
    }

    return {
      data: initialValue,
      loading: true,
      error: "",
      isRefreshing: false,
      responseTime: null,
    };
  });

  useEffect(() => {
    const prevEnabled = prevEnabledRef.current;
    prevEnabledRef.current = enabled;

    // Limpiar reintentos pendientes si cambia enabled o cacheKey
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (!enabled) {
      retryCountRef.current = 0;
      startTimeRef.current = null;
      setState({
        data: initialValue,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      });

      return undefined;
    }

    const cachedData = getCachedResource(cacheKey);

    if (cachedData !== null) {
      retryCountRef.current = 0;
      startTimeRef.current = null;
      setState({
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      });

      return undefined;
    }

    let ignore = false;

    setState((previous) => {
      const hasData = hasMeaningfulData(previous.data, initialValue);

      return {
        ...previous,
        loading: !hasData,
        isRefreshing: hasData,
        error: prevEnabled && !enabled ? "" : previous.error,
      };
    });

    // Marcamos tiempo de inicio para medir respuesta
    startTimeRef.current = performance.now();

    getSharedRequest(cacheKey, fetcher)
      .then((data) => {
        if (ignore) return;

        const responseTime = startTimeRef.current
          ? Math.round(performance.now() - startTimeRef.current)
          : null;

        retryCountRef.current = 0;
        startTimeRef.current = null;

        setState({
          data: data ?? initialValue,
          loading: false,
          error: "",
          isRefreshing: false,
          responseTime,
        });
      })
      .catch((error) => {
        if (ignore) return;

        retryCountRef.current += 1;

        const maxRetries = 2;
        const retryDelay = 6000; // 6s entre reintentos

        if (retryCountRef.current <= maxRetries) {
          retryTimeoutRef.current = setTimeout(() => {
            if (ignore || !enabled) return;

            setState((previous) => ({
              ...previous,
              loading: !hasMeaningfulData(previous.data, initialValue),
              isRefreshing: hasMeaningfulData(previous.data, initialValue),
              error: "",
            }));

            startTimeRef.current = performance.now();

            getSharedRequest(cacheKey, fetcher)
              .then((data) => {
                if (ignore) return;

                const responseTime = startTimeRef.current
                  ? Math.round(performance.now() - startTimeRef.current)
                  : null;

                retryCountRef.current = 0;
                startTimeRef.current = null;

                setState({
                  data: data ?? initialValue,
                  loading: false,
                  error: "",
                  isRefreshing: false,
                  responseTime,
                });
              })
              .catch((e) => {
                if (ignore) return;

                setState((previous) => ({
                  ...previous,
                  loading: false,
                  isRefreshing: false,
                  error: buildHookErrorMessage(label, e),
                }));
              });
          }, retryDelay);
        } else {
          setState((previous) => ({
            ...previous,
            loading: false,
            isRefreshing: false,
            error: buildHookErrorMessage(label, error),
          }));
        }
      });

    return () => {
      ignore = true;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled]);

  return state;
}
