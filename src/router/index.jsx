import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import MainLayout from "../components/layout/MainLayout";

// Helper para lazy + preload
function lazyWithPreload(importer) {
  const Component = lazy(importer);
  Component.preload = importer;
  return Component;
}

// Páginas (exportadas para posible reuso/preloading manual)
export const Home = lazyWithPreload(() => import("../pages/home/Home"));
export const About = lazyWithPreload(() => import("../pages/about/About"));

export default function AppRouter() {
  return (
    <Routes>
      {/* Ruta padre que envuelve a las páginas con el Layout común */}
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
