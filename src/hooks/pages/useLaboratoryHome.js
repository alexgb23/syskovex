import { useMemo } from "react";
import useAsyncResource from "../core/useAsyncResource";
import { laboratoriosRealesService } from "../../services/api";

const initialValue = {
  featured_laboratories: [],
  stats: {},
};

const IMAGE_SCALES = [480, 768, 960];

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFirstString(value) {
  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim().length > 0,
    );
    return first?.trim() ?? "";
  }

  return typeof value === "string" ? value.trim() : "";
}

function buildResponsiveSources(basePath, extension) {
  const cleanBase =
    typeof basePath === "string" && basePath.trim().length > 0
      ? basePath.trim()
      : "";

  if (!cleanBase) {
    return {
      src: "",
      srcSet: "",
      byScale: {},
    };
  }

  const byScale = IMAGE_SCALES.reduce((acc, size) => {
    acc[size] = `${cleanBase}-${size}.${extension}`;
    return acc;
  }, {});

  const srcSet = IMAGE_SCALES.map((size) => `${byScale[size]} ${size}w`).join(", ");

  return {
    src: byScale[960] || byScale[768] || byScale[480] || "",
    srcSet,
    byScale,
  };
}

function buildLaboratoryBackgrounds(item) {
  const darkAvifBase = normalizeFirstString(item?.fondo_tarjeta_dark?.[0]);
  const darkWebpBase = normalizeFirstString(item?.fondo_tarjeta_dark?.[1]);

  const lightAvifBase = normalizeFirstString(item?.fondo_tarjeta_light?.[0]);
  const lightWebpBase = normalizeFirstString(item?.fondo_tarjeta_light?.[1]);

  return {
    dark: {
      avif: buildResponsiveSources(darkAvifBase, "avif"),
      webp: buildResponsiveSources(darkWebpBase, "webp"),
      fallback:
        buildResponsiveSources(darkWebpBase, "webp").src ||
        buildResponsiveSources(darkAvifBase, "avif").src ||
        "",
    },
    light: {
      avif: buildResponsiveSources(lightAvifBase, "avif"),
      webp: buildResponsiveSources(lightWebpBase, "webp"),
      fallback:
        buildResponsiveSources(lightWebpBase, "webp").src ||
        buildResponsiveSources(lightAvifBase, "avif").src ||
        "",
    },
  };
}

function normalizeLaboratoryItems(payload) {
  const source = Array.isArray(payload?.featured_laboratories)
    ? payload.featured_laboratories
    : [];

  return source.map((item) => ({
    id: item?.id ?? null,
    title: item?.titulo ?? "",
    slug: item?.slug ?? "",
    category: item?.categoria ?? "laboratorio",
    status: item?.estado ?? "",
    active: Boolean(item?.activo ?? item?.estado === "activo"),
    summary: item?.resumen ?? "",
    target_color: normalizeFirstString(item?.target_color),
    areas_relacionadas: normalizeArray(item?.areas_relacionadas),
    stack: normalizeArray(item?.stack).map((tech) => ({
      label: tech?.label ?? "",
      slug: tech?.slug ?? "",
    })),
    projects_count: Number(item?.projects_count) || 0,
    documentation_count: Number(item?.documentacion_count) || 0,
    background: buildLaboratoryBackgrounds(item),
  }));
}

function computeStatsFromItems(items = []) {
  const activeLabs = items.filter((lab) => lab.active).length;

  const projectsCount = items.reduce(
    (acc, lab) => acc + (Number(lab.projects_count) || 0),
    0,
  );

  const techSlugs = new Set();
  items.forEach((lab) => {
    normalizeArray(lab.stack).forEach((tech) => {
      if (tech.slug) techSlugs.add(tech.slug);
    });
  });

  const technologiesCount = techSlugs.size;

  const documentsCount = items.reduce(
    (acc, lab) => acc + (Number(lab.documentation_count) || 0),
    0,
  );

  return {
    active_laboratories: activeLabs,
    projects_count: projectsCount,
    technologies_count: technologiesCount,
    documents_count: documentsCount,
  };
}

function getTopTechnologiesFromItems(items = [], limit = 8) {
  const counter = new Map();

  items.forEach((lab) => {
    normalizeArray(lab.stack).forEach((tech) => {
      if (!tech.label) return;

      const key = tech.slug || tech.label.toLowerCase();

      if (!counter.has(key)) {
        counter.set(key, {
          label: tech.label,
          slug: tech.slug || "",
          count: 0,
        });
      }

      counter.get(key).count += 1;
    });
  });

  return Array.from(counter.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label, "es");
    })
    .slice(0, limit);
}

export default function useLaboratoryHome(enabled = true) {
  const { data, loading, error, isRefreshing } = useAsyncResource(
    laboratoriosRealesService.getHomeLab,
    initialValue,
    [],
    "Laboratory home",
    enabled,
  );

  const items = useMemo(() => normalizeLaboratoryItems(data), [data]);
  const featuredItems = useMemo(() => items, [items]);

  const stats = useMemo(() => {
    const computed = computeStatsFromItems(items);
    const apiStats = data?.stats ?? {};

    return {
      active_laboratories: Number(
        apiStats?.active_laboratories ?? computed.active_laboratories ?? 0,
      ),
      projects_count: Number(
        apiStats?.projects_count ?? computed.projects_count ?? 0,
      ),
      technologies_count: Number(
        apiStats?.technologies_count ?? computed.technologies_count ?? 0,
      ),
      documents_count: Number(
        apiStats?.documents_count ?? computed.documents_count ?? 0,
      ),
    };
  }, [data, items]);

  const topTechnologies = useMemo(
    () => getTopTechnologiesFromItems(items, 8),
    [items],
  );

  return {
    laboratoryHome: data,
    stats,
    items,
    featuredItems,
    topTechnologies,
    loading,
    error,
    isRefreshing,
  };
}