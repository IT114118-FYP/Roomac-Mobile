import { axiosInstance } from "./config";

const fetchFromUser = (id, start, end) =>
	axiosInstance.get(`/api/users/${id}/bookings?start=${start}&end=${end}`);

const fetchOne = (id) => axiosInstance.get(`/api/resourcebookings/${id}`);

const add = (id, date, start, end) =>
	axiosInstance.post(`/api/resources/${id}/bookings`, {
		date,
		start,
		end,
	});

const fetchRef = (id) => axiosInstance.get(`/api/resourcebookings/${id}/code`);

const bookingsApi = { fetchFromUser, add, fetchRef, fetchOne };

export default bookingsApi;
