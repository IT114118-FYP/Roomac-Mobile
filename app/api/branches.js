import { axiosInstance } from "./config";

const fetchAll = () => axiosInstance.get("/api/branches");

const branchesApi = { fetchAll };

export default branchesApi;
