import HeroSection from "../../components/sections/herosection/HeroSection";
import usePageTitle from "../../hooks/usePageTitle";

function Home() {
  usePageTitle("Syskovex | Sitio oficial en construcción");

  const portfolioUrl = "https://alex.syskovex.com/";

  return <HeroSection portfolioUrl={portfolioUrl} />;
}

export default Home;
