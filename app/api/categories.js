import { axiosInstance } from "./config";

const fetchAll = () => axiosInstance.get("/api/categories");

const categoriesApi = { fetchAll };

export default categoriesApi;
