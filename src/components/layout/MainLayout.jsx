import { Outlet } from "react-router";
import Footer from "./footer/Footer";
import SidebarNav from "./SidebarNav/SidebarNav";
import TopNavbar from "./main/TopNavbar";
import styles from "./MainLayout.module.css";

function MainLayout() {
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
    <>
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

        <Footer />
      </div>
    </>
  );
}

export default MainLayout;
