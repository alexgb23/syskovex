// src/hooks/pages/usePortfolioHome.js
import useAsyncResource from "../core/useAsyncResource";
import { portfolioService } from "../../services/api";

const initialValue = {
  social_links: [],
};

export default function usePortfolioHome(enabled = true) {
  const { data, loading, error, isRefreshing, responseTime } = useAsyncResource(
    portfolioService.getHomeData,
    initialValue,
    [],
    "Social Links",
    enabled,
  );

  const socialLinks = Array.isArray(data?.social_links)
    ? data.social_links
    : [];

  return {
    socialLinks,
    loading,
    error,
    isRefreshing,
    responseTime, // ✅ AÑADIR ESTO
  };
}
