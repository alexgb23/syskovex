import { useMemo } from "react";
import useAsyncResource from "../core/useAsyncResource";
import { portfolioService } from "../../services/api";

const initialValue = {
  social_links: [],
  projects: [],
  laboratories: [],
};

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }

      if (typeof parsed === "string" && parsed.trim()) {
        return [parsed.trim()];
      }
    } catch {
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [trimmed];
    }
  }

  return [];
}

function normalizeProjects(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    ...item,
    technologies: normalizeList(item?.technologies ?? item?.tecnologías),
    card_background_dark: normalizeList(item?.card_background_dark),
    card_background_light: normalizeList(item?.card_background_light),
  }));
}

function normalizeLaboratories(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: item?.id ?? null,
    title: item?.titulo ?? "",
    slug: item?.slug ?? "",
    category: item?.categoria ?? "Laboratorio",
    status: item?.estado ?? "Activo",
    summary: item?.resumen ?? "Laboratorio técnico real.",
    relatedAreas: normalizeList(item?.areas_relacionadas).slice(0, 4),
    coverImage: item?.cover_image ?? null,
    documentationCount: Number(item?.documentacion_count) || 0,
    progressCount: Number(item?.avances_count) || 0,
  }));
}

export default function usePortfolioHome(enabled = true) {
  const { data, loading, error, isRefreshing } = useAsyncResource(
    portfolioService.getHomeData,
    initialValue,
    [],
    "Home",
    enabled,
  );

  const socialLinks = useMemo(
    () => (Array.isArray(data?.social_links) ? data.social_links : []),
    [data?.social_links],
  );

  const projects = useMemo(
    () => normalizeProjects(data?.projects),
    [data?.projects],
  );

  const laboratories = useMemo(
    () => normalizeLaboratories(data?.laboratories),
    [data?.laboratories],
  );

  return {
    socialLinks,
    projects,
    laboratories,
    loading,
    error,
    isRefreshing,
  };
}
