import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";
import AppRouter from "./router";

function App() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Si el usuario navega con Atrás/Adelante (POP), no tocamos el scroll.
    if (navType === "POP") return;

    // Para navegaciones PUSH o REPLACE, volvemos arriba.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, navType]);

  return <AppRouter />;
}

export default App;
