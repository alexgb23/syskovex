import useAsyncResource from "../core/useAsyncResource";
import { homeLabResumenService } from "../../services/api";

const initialValue = {
  status: "success",
  service: "home-lab-resumen",
  social_links: [],
};

export default function useHomeLabResumen(enabled = true) {
  const { data, loading, error, isRefreshing, responseTime } = useAsyncResource(
    homeLabResumenService.getResumen,
    initialValue,
    [],
    "Home Lab Resumen",
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
    responseTime,
  };
}
