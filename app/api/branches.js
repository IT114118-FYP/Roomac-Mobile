import { axiosInstance } from "./config";

const fetchAll = () => axiosInstance.get("/api/branches");

const fetchOne = (id) => axiosInstance.get(`/api/branches/${id}`);

const branchesApi = { fetchAll, fetchOne };

export default branchesApi;
