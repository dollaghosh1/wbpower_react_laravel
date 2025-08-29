import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import Post from "./pages/admin/PostListPage";
import PostForm from "./pages/admin/PostFormPage";
import PostCategory from "./pages/admin/PostCategoryListPage";
import PostCategoryForm from "./pages/admin/PostCategoryFormPage";
import Login from "./pages/admin/Login";
import "./assets/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Mycontext = createContext();

const isAuthenticated = () => localStorage.getItem("token") !== null;

const PrivateRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const values = {};

  return (
    <Mycontext.Provider value={values}>
      <BrowserRouter>
        <Routes>
          {/* Wrap all routes in AdminLayout */}
            {/* Public route */}
            {/* <Route path="login" element={<Login />} /> */}
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="post" element={<PrivateRoute><Post /></PrivateRoute>} />
            <Route path="postform/:id?" element={<PrivateRoute><PostForm /></PrivateRoute>} />
            <Route path="post-category" element={<PrivateRoute><PostCategory /></PrivateRoute>} />
             <Route path="post-category-form/:id?" element={<PrivateRoute><PostCategoryForm /></PrivateRoute>} />

            {/* Redirect unknown routes */}
            <Route
              path="*"
              element={
                isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Mycontext.Provider>
  );
}

export default App;