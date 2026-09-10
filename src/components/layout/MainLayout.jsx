// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router";
import { createContext, useContext } from "react";
import Footer from "./footer/Footer";
import SidebarNav from "./SidebarNav/SidebarNav";
import TopNavbar from "./TopNavbar/TopNavbar";
import { usePortfolioHome } from "../../hooks/usePortfolioData";
import styles from "./MainLayout.module.css";

const PortfolioDataContext = createContext(null);

export function usePortfolioDataContext() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error("usePortfolioDataContext debe usarse dentro de MainLayout");
  }
  return ctx;
}

function MainLayout() {
  const { socialLinks, loading, error, responseTime } = usePortfolioHome(true);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://syskovex.com/#website",
    name: "Proyecto personal de Syskovex",
    url: "https://syskovex.com/",
    inLanguage: "es-ES",
  };

  const safeJsonLd = JSON.stringify(websiteSchema).replace(/<\//g, "<\\/");

  return (
    <PortfolioDataContext.Provider
      value={{ socialLinks, loading, error, responseTime }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

      {/* ServerWakeMonitor eliminado, ahora todo está en SystemStatus */}

      <div className={styles.layout}>
        <SidebarNav className={styles.sidebarArea} />

        <main className={styles.main}>
          <TopNavbar />

          <section className={styles.body} aria-label="Contenido principal">
            <Outlet />
          </section>
        </main>

        <Footer className={styles.footer} />
      </div>
    </PortfolioDataContext.Provider>
  );
}

export default MainLayout;
