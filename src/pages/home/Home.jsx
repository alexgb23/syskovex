import { useEffect, useState } from "react";
import HeroSection from "../../components/sections/heroSection/HeroSection";
import usePageTitle from "../../hooks/usePageTitle";

function Home() {
  usePageTitle(
    "Syskovex | Laboratorio, Sistemas, infraestructura y desarrollo de software",
  );

  const [countdown, setCountdown] = useState(20);
  const portfolioUrl = "https://alex.syskovex.com";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.href = portfolioUrl;
    }, 20000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [portfolioUrl]);

  return (
    <main id="main-content" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenido a Syskovex</h1>

      <HeroSection countdown={countdown} portfolioUrl={portfolioUrl} />
    </main>
  );
}

export default Home;
