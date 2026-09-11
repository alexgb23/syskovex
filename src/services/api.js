import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://portfolio-api.syskovex.com"
).replace(/\/$/, "");

const API_BASE_URL = `${API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function buildAxiosErrorMessage(label, error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `${label} HTTP ${error.response.status}`;
    }

    if (error.request) {
      return `${label} sin respuesta del servidor`;
    }

    return `${label} ${error.message}`;
  }

  return `${label} error desconocido`;
}

async function getRequest(url, label) {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(buildAxiosErrorMessage(label, error), {
      cause: error,
    });
  }
}

export const homeLabResumenService = {
  getResumen: () =>
    getRequest("/laboratorios-reales/home-lab-resumen", "Home Lab Resumen"),
};

export const healthService = {
  getMetrics: () => getRequest("/health/metrics", "Health Metrics"),
};

export { apiClient, getRequest };
