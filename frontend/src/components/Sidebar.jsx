import {Link, useLocation} from "react-router-dom";
import {LayoutDashboard, BookOpen, Star, Users, ShoppingCart, X} from "lucide-react";

const menuItems = [
  {name: "Dashboard", path: "/", icon: LayoutDashboard},
  {name: "Courses", path: "/courses", icon: BookOpen},
  {name: "Purchases", path: "/purchases", icon: ShoppingCart},
  {name: "Users", path: "/users", icon: Users},
  {name: "Reviews", path: "/reviews", icon: Star},
];

const Sidebar = ({isOpen, setIsOpen}) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#3B4CCA] text-white z-50 transform transition-transform duration-300 border-r border-white/10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}>
        <div className='flex items-center justify-between px-6 py-5'>
          <h1 className='text-xl font-bold'>E-Learning</h1>

          <button className='lg:hidden' onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className='flex flex-col gap-2 mt-4 px-3'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${isActive ? "bg-white text-[#3B4CCA] font-semibold" : "hover:bg-white/10"}`}>
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
