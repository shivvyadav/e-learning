import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Admin from "./Admin.jsx";
import Navbar from "./components/Navbar.jsx";
// import Register from "./components/Register.jsx";
import Login from "./pages/Login.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
const Router = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Admin />,
        },
      ],
    },
    // {
    //   path: "/register",
    //   element: <Register />,
    // },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
