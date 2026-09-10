// src/pages/Home/Home.jsx
import usePageTitle from "../../hooks/usePageTitle";
import { usePortfolioDataContext } from "../../components/layout/MainLayout";
import HeroSection from "./components/HeroSection/HeroSection";
import OverviewStats from "./components/OverviewStats/OverviewStats";
import OverviewServices from "./components/OverviewServices/OverviewServices";
import styles from "./Home.module.css";

function Home() {
  usePageTitle("Syskovex | Resumen");

  const { socialLinks, loading, error, responseTime } =
    usePortfolioDataContext();

  return (
    <div className={styles.home}>
      <HeroSection
        loading={loading}
        error={error}
        responseTime={responseTime}
      />
      <OverviewStats />
      <OverviewServices />
    </div>
  );
}

export default Home;
