import axios from "axios";

const api = axios.create({
  baseURL: "https://smg-lqmc.onrender.com/api" ,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  getMe:    ()     => api.get("/auth/me"),
};

export const studentAPI = {
  create:  (data)     => api.post("/students", data),
  getAll:  ()         => api.get("/students"),
  getById: (id)       => api.get(`/students/${id}`),
  update:  (id, data) => api.put(`/students/${id}`, data),
  delete:  (id)       => api.delete(`/students/${id}`),
};

export const teacherAPI = {
  create:  (data)     => api.post("/teachers", data),
  getAll:  ()         => api.get("/teachers"),
  getById: (id)       => api.get(`/teachers/${id}`),
  update:  (id, data) => api.put(`/teachers/${id}`, data),
  delete:  (id)       => api.delete(`/teachers/${id}`),
};

export const courseAPI = {
  create:  (data)     => api.post("/courses", data),
  getAll:  ()         => api.get("/courses"),
  update:  (id, data) => api.put(`/courses/${id}`, data),
  delete:  (id)       => api.delete(`/courses/${id}`),
};

export const attendanceAPI = {
  mark:         (data)      => api.post("/attendance", data),
  getByStudent: (studentId) => api.get(`/attendance/${studentId}`),
  getByDate:    (date)      => api.get(`/attendance/date/${date}`),
};

export const marksAPI = {
  add:          (data)      => api.post("/marks", data),
  getAll:       ()          => api.get("/marks"),
  getByStudent: (studentId) => api.get(`/marks/${studentId}`),
  delete:       (id)        => api.delete(`/marks/${id}`),
};

export const assignmentAPI = {
  create:       (formData)  => api.post("/assignments", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll:       ()          => api.get("/assignments"),
  getByStudent: (studentId) => api.get(`/assignments/student/${studentId}`),
  submit:       (id, fd)    => api.put(`/assignments/${id}/submit`, fd, { headers: { "Content-Type": "multipart/form-data" } }),
  delete:       (id)        => api.delete(`/assignments/${id}`),
};

export default api;
