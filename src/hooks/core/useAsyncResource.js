import { useEffect, useState } from "react";

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
const CACHE_TTL = 5 * 60 * 1000;

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

export default function useAsyncResource(
  fetcher,
  initialValue,
  deps = [],
  label = "Resource",
  enabled = true,
) {
  const cacheKey = JSON.stringify([label, enabled, ...deps]);

  const [state, setState] = useState(() => {
    if (!enabled) {
      return {
        data: initialValue,
        loading: false,
        error: "",
        isRefreshing: false,
      };
    }

    const cachedData = getCachedResource(cacheKey);

    if (cachedData !== null) {
      return {
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: false,
      };
    }

    return {
      data: initialValue,
      loading: true,
      error: "",
      isRefreshing: false,
    };
  });

  useEffect(() => {
    if (!enabled) {
      setState({
        data: initialValue,
        loading: false,
        error: "",
        isRefreshing: false,
      });

      return undefined;
    }

    const cachedData = getCachedResource(cacheKey);

    if (cachedData !== null) {
      setState({
        data: cachedData,
        loading: false,
        error: "",
        isRefreshing: false,
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
        error: "",
      };
    });

    getSharedRequest(cacheKey, fetcher)
      .then((data) => {
        if (ignore) return;

        setState({
          data: data ?? initialValue,
          loading: false,
          error: "",
          isRefreshing: false,
        });
      })
      .catch((error) => {
        if (ignore) return;

        setState((previous) => ({
          ...previous,
          loading: false,
          isRefreshing: false,
          error: buildHookErrorMessage(label, error),
        }));
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled]);

  return state;
}
