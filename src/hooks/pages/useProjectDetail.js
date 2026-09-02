import useAsyncResource from "../core/useAsyncResource";
import { portfolioService } from "../../services/api";

export default function useProjectDetail(slug) {
  const { data, loading, error, isRefreshing } = useAsyncResource(
    () => portfolioService.getProjectDetail(slug),
    null,
    [slug],
    "Project detail",
    Boolean(slug),
  );


  return {
    project: data ?? null,
    loading,
    error,
    isRefreshing,
  };
}
