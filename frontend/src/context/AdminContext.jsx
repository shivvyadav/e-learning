import React, {createContext, useContext, useEffect, useState, useCallback} from "react";
import axios from "axios";

const AuthContext = createContext();

export const AdminProvider = ({children}) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // --- Separate State Variables for Data ---
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // console.log(courses, users, enrollments, reviews);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    // Clear data on logout
    setCourses([]);
    setUsers([]);
    setEnrollments([]);
    setReviews([]);
  }, []);

  // Fetch function to populate all states
  const fetchAllData = useCallback(async () => {
    if (!token) return;

    setDataLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
      const res = await axios.get(`${BASE_URL}/api/misc/datas`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (res.data.data) {
        const {courses, users, enrollments, reviews} = res.data.data;
        setCourses(courses || []);
        setUsers(users || []);
        setEnrollments(enrollments || []);
        setReviews(reviews || []);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  // Load Auth state
  useEffect(() => {
    setLoading(false);
  }, []);

  // Fetch data whenever user is authenticated
  useEffect(() => {
    if (token && user) {
      fetchAllData();
    }
  }, [token, user, fetchAllData]);

  const login = (userData, userToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
        // Data States
        courses,
        users,
        enrollments,
        reviews,
        dataLoading,
        refreshAll: fetchAllData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AdminProvider");
  return context;
};
