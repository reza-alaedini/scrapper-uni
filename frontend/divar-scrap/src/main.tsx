import "./assets/css/main.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "react-query";

const handleQueryError = (error: any) => {
  const ignoredStatuses = [400, 401, 403];

  if (ignoredStatuses.includes(error?.status)) {
    return false;
  }

  if (error?.status === 429) {
    throw new Error("TOO_MANY_REQUESTS");
  }

  return true;
};
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 0,
      onError: (error: any) => {
        handleQueryError(error);
      },
    },
    mutations: {
      onError: (error: any) => {
        handleQueryError(error);
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
);
