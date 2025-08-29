import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import api from "../../../api/api";

export default function PostCategory() {
  const [postcategory, setPostcategory] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Adjust posts per page

  // Fetch posts using global Axios instance
  useEffect(() => {
    const fetchPostCategory = async () => {
      try {
        const res = await api.get("/allpostcategory");
        const formatted = res.data.data.map((p) => ({
          id: p.id,
          category_name: p.category_name,
          category_desc: p.category_desc,
        }));
        setPostcategory(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    };

    fetchPostCategory();
  }, []);

  // Filter posts based on search query
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return postcategory;
    return postcategory.filter((p) => {
      const id = (p.id ?? "").toString().toLowerCase();
      const title = (p.category_name ?? "").toLowerCase();
      const body = (p.category_desc ?? "").toLowerCase();
      return id.includes(q) || title.includes(q) || body.includes(q);
    });
  }, [search, postcategory]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPostcategory = filtered.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Placeholder edit/delete actions
  const handleEdit = (row) => console.log("Edit:", row);
  const handleDelete = (id) => console.log("Delete:", id);
const AddPostCategory = () => {
    navigate("/"); // the path of the page you want to open

  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 font-poppins text-2xl">
          Post Category
        </h1>
       <div className="flex gap-3 items-center">
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
        <button
          onClick={AddPostCategory}
          className="flex items-center gap-2 px-4 py-2 p-head text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Post Category
        </button>
      </div>
      </div>

      {pending ? (
        <div className="p-6">Loading posts...</div>
      ) : (
        
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Body</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
              {currentPostcategory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No posts category found
                  </td>
                </tr>
              ) : (
                currentPostcategory.map((post, index) => (
                  <tr key={post.id}>
                    <td className="px-4 py-2 font-medium">{indexOfFirstPost + index + 1}</td>
                    <td className="px-4 py-2 font-semibold">{post.category_name}</td>
                    <td className="px-4 py-2 text-gray-600 ">{post.category_desc}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 p-4">
              <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 border rounded">
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};