import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import MainLayout from "../components/layout/MainLayout";

function lazyWithPreload(importer) {
  const Component = lazy(importer);
  Component.preload = importer;
  return Component;
}

// Páginas existentes
export const Home = lazyWithPreload(() => import("../pages/home/Home"));
export const About = lazyWithPreload(() => import("../pages/about/About"));

// Nuevas páginas
const Infraestructura = lazyWithPreload(
  () => import("../pages/infraestructura/Infraestructura"),
);
const Proxmox = lazyWithPreload(() => import("../pages/proxmox/Proxmox"));
const Servicios = lazyWithPreload(() => import("../pages/servicios/Servicios"));
const Domotica = lazyWithPreload(() => import("../pages/domotica/Domotica"));
const IaAutomatizacion = lazyWithPreload(
  () => import("../pages/ia-automatizacion/IaAutomatizacion"),
);
const RedSeguridad = lazyWithPreload(
  () => import("../pages/red-seguridad/RedSeguridad"),
);
const Monitorizacion = lazyWithPreload(
  () => import("../pages/monitorizacion/Monitorizacion"),
);
const Backups = lazyWithPreload(() => import("../pages/backups/Backups"));
const Proyectos = lazyWithPreload(() => import("../pages/proyectos/Proyectos"));
const Documentacion = lazyWithPreload(
  () => import("../pages/documentacion/Documentacion"),
);

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="about"
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />

        <Route
          path="infraestructura"
          element={
            <Suspense fallback={null}>
              <Infraestructura />
            </Suspense>
          }
        />

        <Route
          path="proxmox"
          element={
            <Suspense fallback={null}>
              <Proxmox />
            </Suspense>
          }
        />

        <Route
          path="servicios"
          element={
            <Suspense fallback={null}>
              <Servicios />
            </Suspense>
          }
        />

        <Route
          path="domotica"
          element={
            <Suspense fallback={null}>
              <Domotica />
            </Suspense>
          }
        />

        <Route
          path="ia-automatizacion"
          element={
            <Suspense fallback={null}>
              <IaAutomatizacion />
            </Suspense>
          }
        />

        <Route
          path="red-seguridad"
          element={
            <Suspense fallback={null}>
              <RedSeguridad />
            </Suspense>
          }
        />

        <Route
          path="monitorizacion"
          element={
            <Suspense fallback={null}>
              <Monitorizacion />
            </Suspense>
          }
        />

        <Route
          path="backups"
          element={
            <Suspense fallback={null}>
              <Backups />
            </Suspense>
          }
        />

        <Route
          path="proyectos"
          element={
            <Suspense fallback={null}>
              <Proyectos />
            </Suspense>
          }
        />

        <Route
          path="documentacion"
          element={
            <Suspense fallback={null}>
              <Documentacion />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
