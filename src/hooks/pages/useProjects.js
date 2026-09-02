import useAsyncResource from "../core/useAsyncResource";
import { portfolioService } from "../../services/api";

export default function useProjects(enabled = true) {
  const { data, loading, error, isRefreshing } = useAsyncResource(
    portfolioService.getProjects,
    [],
    [],
    "Projects",
    enabled,
  );

  return {
    projects: Array.isArray(data) ? data : [],
    loading,
    error,
    isRefreshing,
  };
}
