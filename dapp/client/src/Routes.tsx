import { Route, Routes } from "react-router-dom";
import { HomePage } from "../src/pages/HomePage";
import { PropertyPage } from "../src/pages/PropertyPage";
import MainLayout from "../src/layouts/MainLayout";
import { NotFoundPage } from "../src/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="property"
        element={
          <MainLayout>
            <PropertyPage />
          </MainLayout>
        }
      />
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}