import { useMutation } from "react-query";
import { fetchService } from "@/config/fetchService";

export const useLanding = () => {
  const useIndexAds = () => {
    return useMutation((params?: any) =>
      fetchService("GET", "/ads", { params })
    );
  };

  return { useIndexAds };
};
