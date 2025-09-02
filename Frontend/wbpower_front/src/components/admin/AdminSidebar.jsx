import { useState,useEffect } from "react";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { logout } from '../../redux/authSlice';
import { useDispatch,useSelector } from 'react-redux';
import api from "../../api/api";
import { selectAuthUser } from '../../redux/authSlice';

import {
  MdDashboard,
  MdSettings,
  MdInfo,
  MdExpandMore,
  MdExpandLess,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user_fname = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // redirect after logout
  };
   useEffect(() => {
    // Replace this URL with your actual API endpoint
    api.get('/userdetails')
      .then((response) => {
        setUser(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch user');
        setLoading(false);
      });
  }, []);
  //  
  const firstLetter = user_fname?.name?.charAt(0).toUpperCase() || '?';

  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard />, to: "/dashboard" },
    {
      label: "Post",
      icon: <MdInfo />,
      children: [
        { label: "Post", to: "/post" },
        { label: "Post Category", to: "/post-category" },
      ],
    },
    {
      label: "Settings",
      icon: <MdSettings />,
      children: [
        { label: "Profile", to: "/user-profile" },
    
      ],
    },
    { label: "Sign out", icon: <MdLogout />, isLogout: true },
  ];

  // ✅ Updated isActive using matchPath for exact matching
  const isActive = (path) => {
    return !!matchPath({ path, end: true }, location.pathname);
  };

  return (
    <aside className="fixed top-0 left-0 w-[16%] h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 shadow-md">

      {/* Header / Logo Section */}
      <div className="p-head p-4 border-b border-gray-200 shadow-sm">
        <h4 className="text-power font-semibold text-white flex items-center mb-0 justify-center gap-2">
          <i className="fa-solid fa-bolt text-white"></i> Power Dept
        </h4>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 text-sm font-medium">
        {menuItems.filter((item) => !item.isLogout).map((item, i) => (
          <div key={i}>
            {item.children ? (
              <>
                <button
                  onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-gray-700"
                >
                  <span className="flex items-center gap-3 text-base font-medium">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {openMenu === i ? (
                    <MdExpandLess className="text-lg" />
                  ) : (
                    <MdExpandMore className="text-lg" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openMenu === i ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  <div className="ml-6 border-l border-gray-200 pl-3 space-y-1">
                    {item.children.map((sub, j) => (
                      <Link
                        key={j}
                        to={sub.to}
                        className={`block py-1.5 px-2 rounded-lg text-sm transition ${
                          isActive(sub.to)
                            ? "bg-blue-100 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                to={item.to}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition ${
                  isActive(item.to)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Sign Out at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
            {firstLetter || 'U'}
          </div>
          <span className="text-base font-medium tracking-wide">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
