import { useEffect, useState } from "react";
import HeroSection from "../../components/sections/heroSection/HeroSection";
import usePageTitle from "../../hooks/usePageTitle";

function Home() {
  usePageTitle("Syskovex | Sitio oficial en construcción");

  const [countdown, setCountdown] = useState(10);
  const portfolioUrl = "https://portfolioalexsys.netlify.app/";

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = portfolioUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <HeroSection countdown={countdown} portfolioUrl={portfolioUrl} />;
}

export default Home;
