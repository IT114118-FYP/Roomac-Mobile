import { axiosInstance } from "./config";

const fetchFromCategory = (id) => axiosInstance.get("/api/categories/" + id);

const fetchTimeslots = (id, start, end) =>
	axiosInstance.get(
		`/api/resources/${id}/bookings?start=${start}&end=${end}`
	);

const fetchTimeslotsWithException = (id, start, end, exceptId) =>
	axiosInstance.get(
		`/api/resources/${id}/bookings?start=${start}&end=${end}&except=${exceptId}`
	);

const fetchTOS = (id) => axiosInstance.get(`/api/tos/${id}`);

const resourcesApi = {
	fetchFromCategory,
	fetchTimeslots,
	fetchTOS,
	fetchTimeslotsWithException,
};

export default resourcesApi;
