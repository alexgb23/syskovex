import { Outlet } from "react-router";
import { createContext, useContext } from "react";

import Footer from "./footer/Footer";
import SidebarNav from "./SidebarNav/SidebarNav";
import TopNavbar from "./TopNavbar/TopNavbar";

import { useHomeLabResumen } from "../../hooks/usePortfolioData";

import styles from "./MainLayout.module.css";

const HomeLabDataContext = createContext(null);

export function useHomeLabDataContext() {
  const ctx = useContext(HomeLabDataContext);

  if (!ctx) {
    throw new Error("useHomeLabDataContext debe usarse dentro de MainLayout");
  }

  return ctx;
}

function MainLayout() {
  const {
    socialLinks,
    loading: socialLoading,
    error: socialError,
    isRefreshing: socialIsRefreshing,
    responseTime: socialResponseTime,
  } = useHomeLabResumen(true);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://syskovex.com/#website",
    name: "Laboratorio Real de Syskovex",
    url: "https://syskovex.com/",
    inLanguage: "es-ES",
  };

  const safeJsonLd = JSON.stringify(websiteSchema).replace(/<\//g, "<\\/");

  return (
    <HomeLabDataContext.Provider
      value={{
        socialLinks,
        socialLoading,
        socialError,
        socialIsRefreshing,
        socialResponseTime,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />

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
    </HomeLabDataContext.Provider>
  );
}

export default MainLayout;
