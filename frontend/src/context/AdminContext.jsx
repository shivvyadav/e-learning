import React, { createContext, useState, useContext } from 'react';
import { STORAGE_KEYS } from '../lib/constants';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to parse admin:', error);
      localStorage.removeItem(STORAGE_KEYS.ADMIN);
      return null;
    }
  });

  // FIX: `viewedCourses` and `addViewedCourse` were consumed in Courses.jsx,
  // Home.jsx, and Profile.jsx but never defined or provided in this context.
  const [viewedCourses, setViewedCourses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VIEWED_COURSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addViewedCourse = (courseId) => {
    setViewedCourses(prev => {
      if (prev.includes(courseId)) return prev;
      const updated = [...prev, courseId];
      localStorage.setItem(STORAGE_KEYS.VIEWED_COURSES, JSON.stringify(updated));
      return updated;
    });
  };

  const login = (adminData) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
    localStorage.removeItem(STORAGE_KEYS.VIEWED_COURSES);
    setAdmin(null);
    setViewedCourses([]);
  };

  const isAuthenticated = !!admin;

  return (
    <AdminContext.Provider
      value={{
        admin,
        login,
        logout,
        isAuthenticated,
        loading: false,
        // FIX: Expose viewedCourses and addViewedCourse so consumers don't crash
        viewedCourses,
        addViewedCourse,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export default AdminContext;
