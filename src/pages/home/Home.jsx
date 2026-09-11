import usePageTitle from "../../hooks/usePageTitle";
import HeroSection from "./components/HeroSection/HeroSection";
import OverviewStats from "./components/OverviewStats/OverviewStats";
import OverviewServices from "./components/OverviewServices/OverviewServices";
import styles from "./Home.module.css";

function Home() {
  usePageTitle("Syskovex | Resumen");

  return (
    <div className={styles.home}>
      <HeroSection />
      <OverviewStats />
      <OverviewServices />
    </div>
  );
}

export default Home;
