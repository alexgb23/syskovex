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
const CACHE_TTL = 5 * 60 * 1000;

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

    const cached = resourceCache.get(cacheKey);
    const isFresh = cached && Date.now() - cached.time < CACHE_TTL;

    if (isFresh) {
      return {
        data: cached.data,
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
      return;
    }

    const cached = resourceCache.get(cacheKey);
    const isFresh = cached && Date.now() - cached.time < CACHE_TTL;

    if (isFresh) {
      setState({
        data: cached.data,
        loading: false,
        error: "",
        isRefreshing: false,
      });
      return;
    }

    let ignore = false;

    async function load() {
      setState((prev) => {
        const hasData = hasMeaningfulData(prev.data, initialValue);

        return {
          ...prev,
          loading: !hasData,
          isRefreshing: hasData,
          error: "",
        };
      });

      try {
        const result = await fetcher();

        if (ignore) return;

        const data = result ?? initialValue;

        resourceCache.set(cacheKey, {
          data,
          time: Date.now(),
        });

        setState({
          data,
          loading: false,
          error: "",
          isRefreshing: false,
        });
      } catch (err) {
        if (ignore) return;

        setState((prev) => ({
          ...prev,
          loading: false,
          isRefreshing: false,
          error: buildHookErrorMessage(label, err),
        }));
      }
    }

    load();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled]);

  return state;
}
