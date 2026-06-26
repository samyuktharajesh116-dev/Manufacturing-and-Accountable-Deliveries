import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

export const addShipment = (shipment) => api.post("/add-shipment", shipment);
export const deleteShipment = (shipmentId) => api.delete(`/shipments/${encodeURIComponent(shipmentId)}`);
export const clearShipments = () => api.delete("/clear-shipments");
export const configureDocks = (config) => api.post("/configure-docks", config);
export const runScheduler = () => api.post("/run-scheduler");
export const getSchedule = () => api.get("/schedule");
export const getShipments = () => api.get("/shipments");
export const getDockConfig = () => api.get("/dock-config");