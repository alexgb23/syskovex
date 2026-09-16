import { useEffect, useRef, useState } from "react";

function buildHookErrorMessage(label, error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `${label}: esperando a que el servidor esté disponible`;
}

/**
 * Versión adaptada a métricas del sistema.
 * Considera "significativos" ciertos campos clave aunque otros estén vacíos.
 */
function hasMeaningfulData(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  // Campos que, si existen, ya consideramos que hay datos útiles
  if (value.status) return true;
  if (value.service) return true;
  if (value.timestamp) return true;
  if (value.request_duration_ms != null) return true;

  // Para arrays, requerimos al menos un elemento
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // Para objetos anidados (social_links, etc.), basta con algún valor no nulo
  return Object.values(value).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (v && typeof v === "object") {
      // En objetos anidados, también miramos status/service/timestamp si existen
      if (v.status || v.service || v.timestamp) return true;
      return Object.keys(v).length > 0;
    }
    return v != null && v !== "";
  });
}

const resourceCache = new Map();
const pendingRequests = new Map();

const STARTUP_RETRY_MS = 3_000;
const READY_REFRESH_MS = 60_000;
const MAX_RETRY_DELAY_MS = 15_000;

// TTL de 5 minutos para localStorage
const LOCAL_STORAGE_TTL_MS = 5 * 60 * 1000;

function getStorageKey(cacheKey, type = "local") {
  return `syskovex:resource:${type}:${cacheKey}`;
}

function getSessionResource(cacheKey) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(
      getStorageKey(cacheKey, "session"),
    );

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);

    if (!cached || typeof cached !== "object" || !cached.data || !cached.time) {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function setSessionResource(cacheKey, data) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      getStorageKey(cacheKey, "session"),
      JSON.stringify({
        data,
        time: Date.now(),
      }),
    );
  } catch {
    // Ignorar si sessionStorage no está disponible
  }
}

function getLocalResource(cacheKey) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(cacheKey, "local"));

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);

    if (!cached || typeof cached !== "object" || !cached.data || !cached.time) {
      return null;
    }

    const ageMs = Date.now() - cached.time;

    // Si ha pasado más que el TTL, lo ignoramos
    if (ageMs > LOCAL_STORAGE_TTL_MS) {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function setLocalResource(cacheKey, data) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      getStorageKey(cacheKey, "local"),
      JSON.stringify({
        data,
        time: Date.now(),
      }),
    );
  } catch {
    // Ignorar si localStorage no está disponible
  }
}

function getCachedResource(cacheKey) {
  // 1. Memoria
  const memoryCached = resourceCache.get(cacheKey);
  if (memoryCached) {
    return memoryCached.data;
  }

  // 2. localStorage (principal para persistencia)
  const localCached = getLocalResource(cacheKey);
  if (localCached) {
    resourceCache.set(cacheKey, localCached);
    return localCached.data;
  }

  // 3. sessionStorage (extra, sin depender de él)
  const sessionCached = getSessionResource(cacheKey);
  if (sessionCached) {
    resourceCache.set(cacheKey, sessionCached);
    return sessionCached.data;
  }

  return null;
}

function setCachedResource(cacheKey, data) {
  const cached = {
    data,
    time: Date.now(),
  };

  // Memoria
  resourceCache.set(cacheKey, cached);

  // localStorage como caché principal
  setLocalResource(cacheKey, data);

  // sessionStorage como extra
  setSessionResource(cacheKey, data);
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

      /*
       * No guardamos respuestas vacías. Si Render aún está arrancando
       * y tu fetcher devuelve null, {} o una respuesta sin contenido,
       * conservamos los últimos datos reales disponibles.
       */
      if (hasMeaningfulData(data)) {
        setCachedResource(cacheKey, data);
      }

      return data;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, request);

  return request;
}

/**
 * Hook para cargar recursos asíncronos.
 *
 * Características:
 * - Caché en memoria durante la sesión actual.
 * - Caché persistente mediante localStorage (TTL 5 min) y sessionStorage.
 * - Muestra datos previos mientras actualiza en segundo plano.
 * - Reintentos continuos cuando el backend de Render está suspendido.
 * - Refresco automático cada minuto cuando la API ya responde.
 * - Evita solicitudes duplicadas para el mismo recurso.
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

  // ÚNICA decisión sobre caché y estado inicial
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

    if (hasMeaningfulData(cachedData)) {
      return {
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: true,
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

      setState((previous) => {
        const hasPreviousData = hasMeaningfulData(previous.data);

        return {
          ...previous,
          loading: !hasPreviousData,
          isRefreshing: hasPreviousData,
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

        if (!hasMeaningfulData(data)) {
          throw new Error("La API aún no ha devuelto datos de estado");
        }

        attemptRef.current = 0;

        setState({
          data,
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
          const hasPreviousData = hasMeaningfulData(previous.data);

          return {
            ...previous,
            loading: !hasPreviousData,
            isRefreshing: hasPreviousData,
            error: buildHookErrorMessage(label, error),
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

    // Sin segunda comprobación de caché: confiamos en el initializer de useState.
    attemptRef.current = 0;
    void load();

    return () => {
      cancelled = true;
      clearScheduledRequest();
    };
  }, [cacheKey, enabled]);

  return state;
}
