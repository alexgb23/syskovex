import { useEffect, useRef, useState } from "react";

function buildHookErrorMessage(label, error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `${label}: esperando a que el servidor esté disponible`;
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

const CACHE_TTL = 5 * 60 * 1000;
const STARTUP_RETRY_MS = 3_000;
const READY_REFRESH_MS = 60_000;
const MAX_RETRY_DELAY_MS = 15_000;

function getCachedResource(cacheKey) {
  const cached = resourceCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  if (Date.now() - cached.time >= CACHE_TTL) {
    resourceCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

function setCachedResource(cacheKey, data) {
  resourceCache.set(cacheKey, {
    data,
    time: Date.now(),
  });
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
      setCachedResource(cacheKey, data);
      return data;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, request);

  return request;
}

/**
 * Carga un recurso asíncrono con:
 * - Caché en memoria.
 * - Peticiones compartidas.
 * - Reintentos continuos mientras el backend arranca.
 * - Refresco periódico cuando el backend ya responde.
 */
export default function useAsyncResource(
  fetcher,
  initialValue,
  deps = [],
  label = "Resource",
  enabled = true,
) {
  const cacheKey = JSON.stringify([label, enabled, ...deps]);

  const timerRef = useRef(null);
  const attemptRef = useRef(0);
  const requestStartedAtRef = useRef(null);
  const fetcherRef = useRef(fetcher);

  fetcherRef.current = fetcher;

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
    let cancelled = false;

    const clearScheduledRequest = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const schedule = (delay) => {
      clearScheduledRequest();

      timerRef.current = window.setTimeout(() => {
        void load();
      }, delay);
    };

    const load = async () => {
      if (cancelled || !enabled) {
        return;
      }

      const cachedData = getCachedResource(cacheKey);

      if (cachedData !== null && attemptRef.current === 0) {
        setState({
          data: cachedData,
          loading: false,
          error: "",
          isRefreshing: false,
          responseTime: null,
        });

        schedule(READY_REFRESH_MS);
        return;
      }

      setState((previous) => {
        const hasData = hasMeaningfulData(previous.data, initialValue);

        return {
          ...previous,
          loading: !hasData,
          isRefreshing: hasData,
          error: "",
        };
      });

      requestStartedAtRef.current = performance.now();

      try {
        const data = await getSharedRequest(cacheKey, fetcherRef.current);

        if (cancelled) {
          return;
        }

        const responseTime = requestStartedAtRef.current
          ? Math.round(performance.now() - requestStartedAtRef.current)
          : null;

        attemptRef.current = 0;

        setState({
          data: data ?? initialValue,
          loading: false,
          error: "",
          isRefreshing: false,
          responseTime,
        });

        schedule(READY_REFRESH_MS);
      } catch (error) {
        if (cancelled) {
          return;
        }

        attemptRef.current += 1;

        const retryDelay = Math.min(
          STARTUP_RETRY_MS * attemptRef.current,
          MAX_RETRY_DELAY_MS,
        );

        setState((previous) => {
          const hasData = hasMeaningfulData(previous.data, initialValue);

          return {
            ...previous,
            loading: !hasData,
            isRefreshing: hasData,
            error: hasData ? buildHookErrorMessage(label, error) : "",
          };
        });

        schedule(retryDelay);
      }
    };

    if (!enabled) {
      attemptRef.current = 0;
      clearScheduledRequest();

      setState({
        data: initialValue,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      });

      return () => {
        cancelled = true;
        clearScheduledRequest();
      };
    }

    attemptRef.current = 0;

    const cachedData = getCachedResource(cacheKey);

    if (cachedData !== null) {
      setState({
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: false,
        responseTime: null,
      });

      schedule(READY_REFRESH_MS);
    } else {
      void load();
    }

    return () => {
      cancelled = true;
      clearScheduledRequest();
    };
  }, [cacheKey, enabled]);

  return state;
}
