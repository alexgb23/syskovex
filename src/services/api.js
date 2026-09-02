import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
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

async function postRequest(url, data, label) {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    throw new Error(buildAxiosErrorMessage(label, error), {
      cause: error,
    });
  }
}

export const portfolioService = {
  getHomeData: () => getRequest("/portfolio-home", "Portfolio Home"),
  getAboutData: () => getRequest("/portfolio-home/about", "Portfolio About"),
  getProjects: () => getRequest("/projects", "Projects"),
  getProjectDetail: (slug) => getRequest(`/projects/${slug}`, "Project Detail"),
};

export const laboratoriosRealesService = {
  getHome: () => getRequest("/laboratorios-reales/home", "Laboratorios Home"),
  getHomeLab: () => getRequest("/laboratorios-reales/home-lab", "Laboratorios HomeLab"),
  getList: () => getRequest("/laboratorios-reales", "Laboratorios List"),
  getDetail: (slug) =>
    getRequest(`/laboratorios-reales/${slug}`, "Laboratorio Detail"),
};

export const contactService = {
  sendMessage: (payload) =>
    postRequest("/contact-messages", payload, "Contact Message"),
};

export { apiClient, getRequest, postRequest };
