import LoadingPage from "@/shared/loading/LoadingPage";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const HomeScreen = lazy(() => import("@/features/home/index"));

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: (
      <Suspense fallback={<LoadingPage />}>
        <HomeScreen />
      </Suspense>
    ),
  },
]);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export default Routers;
