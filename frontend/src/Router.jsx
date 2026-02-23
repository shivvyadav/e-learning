import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import {useState} from "react";
import Admin from "./Admin.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";

import Users from "./pages/Users.jsx";
import Courses from "./pages/Courses.jsx";
import Purchases from "./pages/Purchases.jsx";
import Reviews from "./pages/Reviews.jsx";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='h-screen overflow-hidden flex'>
      <Navbar setIsOpen={setIsOpen} />
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className='flex-1 flex flex-col pt-20 lg:ml-64'>
        <div className='flex-1 overflow-y-auto px-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {path: "/", element: <Admin />},
        {path: "/courses", element: <Courses />},
        {path: "/reviews", element: <Reviews />},
        {path: "/users", element: <Users />},
        {path: "/purchases", element: <Purchases />},
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
