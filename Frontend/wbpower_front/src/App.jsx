import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './redux/authSlice';

import AdminLayout from "./components/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import Post from "./pages/admin/PostListPage";
import PostForm from "./pages/admin/PostFormPage";
import PostCategory from "./pages/admin/PostCategoryListPage";
import PostCategoryForm from "./pages/admin/PostCategoryFormPage";
import Login from "./pages/admin/Login";
import UserProfileFormPage from "./pages/admin/UserProfileFormPage";
import MenuFormPage from "./pages/admin/MenuFormPage";

import "./assets/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Mycontext = createContext();

// ✅ Renamed to avoid conflict with Redux state
const checkAuthToken = () => localStorage.getItem("token") !== null;

// ✅ Private route guard
const PrivateRoute = ({ children }) =>
  checkAuthToken() ? children : <Navigate to="/login" replace />;

// ✅ Public route guard
const PublicRoute = ({ children }) =>
  !checkAuthToken() ? children : <Navigate to="/dashboard" replace />;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // ✅ Fetch user if logged in and user data is missing
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const values = {}; // For context if needed

  return (
    <Mycontext.Provider value={values}>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected route wrapper */}
          <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="post" element={<Post />} />
            <Route path="postform/:id?" element={<PostForm />} />
            <Route path="post-category" element={<PostCategory />} />
            <Route path="post-category-form/:id?" element={<PostCategoryForm />} />
            <Route path="user-profile" element={<UserProfileFormPage />} />
             <Route path="menu" element={<MenuFormPage />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={
              checkAuthToken()
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </Mycontext.Provider>
  );
}

export default App;