import axiosAdmin from "../../lib/axiosAdmin";

const adminEmployeeService = {
  getAll: () => axiosAdmin.get("/api/employees"),
  getReviews: () => axiosAdmin.get("/api/employee-reviews"),
};

export default adminEmployeeService;
