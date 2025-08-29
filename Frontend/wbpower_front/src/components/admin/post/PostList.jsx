import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
//import { ChevronLeft, ChevronRight } from "lucide-react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import api from "../../../api/api"; // axios instance

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/allpost");
        const formatted = res.data.data.map((p) => ({
          id: p.id,
          post_name: p.post_name,
          post_desc: p.post_desc,
          category_name: p.category?.category_name,
          post_image: p.post_image
            ? `${import.meta.env.VITE_IMG_URL}/${p.post_image}`
            : null,
        }));
        setPosts(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    };
    fetchPosts();
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.id?.toString(), p.post_name, p.post_desc].some((field) =>
        (field ?? "").toLowerCase().includes(q)
      )
    );
  }, [search, posts]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const AddPost = () => navigate("/postform");
  const handleEdit = (post) => navigate(`/postform/${post.id}`);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await api.delete(`/deletepost/${id}`);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="p-6">
      {/* Top Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins text-2xl">
          Posts
        </h1>

        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by id, title, body…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={AddPost}
            className="flex items-center gap-2 px-4 py-2 p-head text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            <FiPlus /> Add Post
          </button>
        </div>
      </div>

      {pending ? (
        <div className="p-6 text-gray-500">Loading posts...</div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">SL no</th>
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Body</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No posts found
                    </td>
                  </tr>
                ) : (
                  currentPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">
                        {indexOfFirstPost + index + 1}
                      </td>
                      <td className="px-4 py-2">
                        {post.post_image ? (
                          <img
                            src={post.post_image}
                            alt="post"
                            className="w-8 h-8 object-cover rounded-lg border"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-2 font-semibold">
                        {post.post_name}
                      </td>
                      <td className="px-4 py-2 text-gray-600 ">
                        {post.post_desc}
                      </td>
                      <td className="px-4 py-2">{post.category_name}</td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded-lg text-blue-600 transition"
                        >
                          <FiEdit size={15 } />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg text-red-600 transition"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6">
    {/* Prev */}
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className="w-9 h-9 flex items-center justify-center rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MdChevronLeft className="w-5 h-5" />
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => paginate(i + 1)}
        className={`w-9 h-9 flex items-center justify-center rounded border text-sm transition ${
          currentPage === i + 1
            ? "p-head text-white border-blue-600"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    {/* Next */}
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className="w-9 h-9 flex items-center justify-center rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MdChevronRight className="w-5 h-5" />
    </button>
  </div>
)}
        </>
      )}
    </div>
  );
}
