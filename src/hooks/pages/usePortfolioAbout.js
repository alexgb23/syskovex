import useAsyncResource from "../core/useAsyncResource";
import { portfolioService } from "../../services/api";

const initialValue = {
  highlights: [],
};

export default function usePortfolioAbout(enabled = true) {
  const { data, loading, error } = useAsyncResource(
    portfolioService.getAboutData,
    initialValue,
    [],
    "Portfolio about",
    enabled,
  );

  return {
    highlights: Array.isArray(data?.highlights) ? data.highlights : [],
    loading,
    error,
  };
}
