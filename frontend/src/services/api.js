import axios from "axios";

const api = axios.create({
  baseURL: "http://https://helpdesk-ticket-system-se05.onrender.com",
});

export default api;