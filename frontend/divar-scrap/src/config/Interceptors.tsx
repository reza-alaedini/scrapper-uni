import { ToastDanger } from "@/utils/utils";
import axios from "axios";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

export const tokenExits = JSON.parse(localStorage.getItem("token") as string);
export const axiosInterCeptors: any = axios.create();
// @ts-ignore
const isApp = window?.ReactNativeWebView;

axiosInterCeptors.interceptors.request.use(
  (req: any) => {
    req.headers = {
      Authorization: JSON.parse(localStorage.getItem("token") as string)
        ? `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
        : "",
      Accept: "application/json",
      TP_UID: JSON.parse(localStorage.getItem("TP_UID") as string) ?? undefined,
      TP_APPVERSION: isApp
        ? localStorage.getItem("nativeVersion")
        : localStorage.getItem("appVersion")
        ? `${localStorage.getItem("appVersion")}-w`
        : undefined,
      TP_ACTIVATIONCODE:
        JSON.parse(localStorage.getItem("TP_ACTIVATIONCODE") as string) ??
        undefined,
    };
    if (req.data) {
      if (req.data instanceof FormData) {
        req.headers["Content-Type"] = "multipart/form-data";
      } else if (typeof req.data === "object") {
        req.headers["Content-Type"] = "application/json";
      } else {
        req.headers["Content-Type"] = "application/json";
      }
    }

    return req;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
axiosInterCeptors.interceptors.response.use(
  (res: any) => {
    return res;
  },

  async (error: any) => {
    const originalRequest = error.config;
    
    if(!error?.response){
      ToastDanger("خطا در ارتباط با سرور")
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      localStorage.removeItem("token");
    } else if (error.response.status >= 500) {
      const config = error.config;
      config.retryCount = config.retryCount || 0;
      if (config.retryCount < MAX_RETRY_ATTEMPTS) {
        config.retryCount += 1;
        ToastDanger("مشکل در ارتباط با سرور، مجددا تلاش کنید.");
        return new Promise((resolve) =>
          setTimeout(
            () => resolve(axiosInterCeptors.request(config)),
            RETRY_DELAY_MS
          )
        );
      }
    } else if (error.response.status === 404) {
      ToastDanger(error.response.data.message);
    } else if (error.response.status === 400) {
      ToastDanger(error.response.data.message ?? error?.response?.data);
    } else if (error.response.status === 403) {
      ToastDanger("دسترسی نامعتبر");
    } else {
      ToastDanger("ارور ناشناخته");
    }
    return Promise.reject(error);
  }
);
