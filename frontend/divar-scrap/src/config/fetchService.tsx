import axios from "axios";
import { baseUrl } from "./url";
import { axiosInterCeptors } from "./Interceptors";
import qs from "qs";
interface FetchServiceOptions {
  data?: any;
  extraHeaders?: any;
  params?: any;
}

export const fetchService = async (
  method: string,
  route: string,
  options: FetchServiceOptions = {}
) => {
  const validMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!validMethods.includes(method)) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }

  const { data, extraHeaders = {}, params } = options;
  const url = `${baseUrl}/${route.replace(/^\//, "")}`;
  const customArray = ["Buyers"];
  const refactorParams =
    method === "GET" &&
    Object.keys(params || {}).some(
      (key) => customArray.includes(key) && Array.isArray(params?.[key])
    );

  const finalUrl = refactorParams
    ? `${url}?${qs.stringify(params, { arrayFormat: "repeat" })}`
    : url;
  try {
    const response = await axiosInterCeptors({
      method: method.toLowerCase(),
      url: finalUrl,
      data: method !== "GET" ? data : undefined,
      ...(refactorParams ? {} : { params }),
      headers: {
        ...extraHeaders,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};

export const renewToken = async () => {
  const data: any = {
    refresh_token: JSON.parse(localStorage.getItem("refresh_token") as string),
  };
  const result = await axios.post(`${baseUrl}/auth/renew-token`, data);
  if (result) return result;
};
