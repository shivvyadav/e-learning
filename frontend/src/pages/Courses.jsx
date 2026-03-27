import React, {useState} from "react";
import {Pencil, Trash2, Plus, X, Video, FileText, Loader2} from "lucide-react";
import {useAuth} from "../context/AdminContext";
import axios from "axios";
import {toast} from "react-hot-toast";

const StarRating = ({rating}) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className='flex text-lg'>
      {stars.map((star) => (
        <span key={star} className={rating >= star ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

const Courses = () => {
  const {courses, enrollments, reviews, dataLoading, setCourses} = useAuth();
  const [failedImages, setFailedImages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    Coursename: "",
    Coursedescription: "",
    CoursePrice: "",
    category: "",
    coursethumbnail: null,
    modules: [{title: "", videos: [{title: "", duration: ""}], pdfs: [{title: ""}]}],
  });

  const handleImageError = (id) => {
    setFailedImages((prev) => ({...prev, [id]: true}));
  };

  const getAverageRating = (courseId) => {
    const courseReviews = reviews.filter(
      (r) => r.courseId?._id === courseId || r.courseId === courseId,
    );
    if (courseReviews.length === 0) return 0;
    const sum = courseReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round(sum / courseReviews.length);
  };

  const getStudentCount = (courseId) => {
    return enrollments.filter((e) => e.course?._id === courseId || e.course === courseId).length;
  };

  // --- Modal Logic ---

  const openAddModal = () => {
    setSelectedCourse(null);
    setFormData({
      Coursename: "",
      Coursedescription: "",
      CoursePrice: "",
      category: "",
      coursethumbnail: null,
      modules: [{title: "", videos: [{title: "", duration: ""}], pdfs: [{title: ""}]}],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      Coursename: course.Coursename,
      Coursedescription: course.Coursedescription,
      CoursePrice: course.CoursePrice,
      category: course.category,
      coursethumbnail: null, // Files aren't pre-filled for security
      modules: course.modules || [],
    });
    setIsModalOpen(true);
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, {title: "", videos: [{title: ""}], pdfs: [{title: ""}]}],
    });
  };

  const updateModuleTitle = (index, val) => {
    const newModules = [...formData.modules];
    newModules[index].title = val;
    setFormData({...formData, modules: newModules});
  };

  // --- API Calls ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("Coursename", formData.Coursename);
    data.append("Coursedescription", formData.Coursedescription);
    data.append("CoursePrice", formData.CoursePrice);
    data.append("category", formData.category);
    data.append("modules", JSON.stringify(formData.modules));

    if (formData.coursethumbnail) {
      data.append("coursethumbnail", formData.coursethumbnail);
    }

    // Handle nested files logic would go here if uploading new assets
    // For brevity, assuming simple text/thumb update first.

    try {
      const url = selectedCourse
        ? `${import.meta.env.VITE_API_URL}/api/course/${selectedCourse._id}`
        : `${import.meta.env.VITE_API_URL}/api/courses`;

      const res = await axios({
        method: selectedCourse ? "patch" : "post",
        url,
        data,
        withCredentials: true,
      });

      toast.success(res.data.message);
      setIsModalOpen(false);
      // Update local state or re-fetch
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${selectedCourse._id}`, {
        withCredentials: true,
      });
      toast.success("Course deleted");
      setCourses(courses.filter((c) => c._id !== selectedCourse._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-[calc(100vh-80px)] flex flex-col p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl flex flex-col h-full overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-300 shrink-0'>
          <h2 className='text-xl font-semibold text-blue-600'>Courses ({courses.length})</h2>
          <button
            onClick={openAddModal}
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
            <Plus size={18} /> Add Course
          </button>
        </div>

        <div className='flex-1 overflow-y-auto divide-y divide-neutral-300'>
          {dataLoading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='animate-spin text-blue-600' />
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className='flex items-start justify-between gap-4 px-6 py-6 hover:bg-neutral-50 transition-colors'>
                <div className='flex gap-4 flex-1 min-w-0'>
                  <div className='w-16 h-16 rounded-md bg-neutral-200 shrink-0 overflow-hidden border border-neutral-100'>
                    <img
                      src={
                        failedImages[course._id] || !course.coursethumbnail
                          ? "https://via.placeholder.com/150"
                          : course.coursethumbnail
                      }
                      alt={course.Coursename}
                      onError={() => handleImageError(course._id)}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='space-y-1 min-w-0'>
                    <h3 className='font-semibold text-gray-800 truncate'>{course.Coursename}</h3>
                    <div className='text-sm text-gray-600 flex gap-3'>
                      <span className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs'>
                        {getStudentCount(course._id)} students
                      </span>
                      <span className='text-green-600 font-bold'>Rs. {course.CoursePrice}</span>
                    </div>
                    <StarRating rating={getAverageRating(course._id)} />
                  </div>
                </div>

                <div className='flex items-center gap-3 shrink-0'>
                  <button
                    onClick={() => openEditModal(course)}
                    className='w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center'>
                    <Pencil size={18} className='text-blue-600' />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsDeleteModalOpen(true);
                    }}
                    className='w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center'>
                    <Trash2 size={18} className='text-red-500' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className='fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl'>
            <div className='p-6 border-b flex justify-between items-center'>
              <h3 className='text-xl font-bold text-gray-800'>
                {selectedCourse ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-gray-400 hover:text-gray-600'>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='flex-1 overflow-y-auto p-6 space-y-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-700'>Course Name</label>
                  <input
                    required
                    className='w-full border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'
                    value={formData.Coursename}
                    onChange={(e) => setFormData({...formData, Coursename: e.target.value})}
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-700'>Category</label>
                  <input
                    required
                    className='w-full border border-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-sm font-medium text-gray-700'>Description</label>
                <textarea
                  required
                  className='w-full border border-gray-500 rounded-lg p-2 h-24 resize-none'
                  value={formData.Coursedescription}
                  onChange={(e) => setFormData({...formData, Coursedescription: e.target.value})}
                />
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-700'>Price (Rs.)</label>
                  <input
                    type='number'
                    required
                    className='w-full border border-gray-500 rounded-lg p-2'
                    value={formData.CoursePrice}
                    onChange={(e) => setFormData({...formData, CoursePrice: e.target.value})}
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-gray-700'>Thumbnail</label>
                  <input
                    type='file'
                    accept='image/*'
                    className='w-full text-sm'
                    onChange={(e) => setFormData({...formData, coursethumbnail: e.target.files[0]})}
                  />
                </div>
              </div>

              <div className='border-t pt-4'>
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='font-semibold text-gray-700'>Modules & Content</h4>
                  <button
                    type='button'
                    onClick={addModule}
                    className='text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline'>
                    <Plus size={14} /> Add Module
                  </button>
                </div>

                {formData.modules.map((mod, mIdx) => (
                  <div
                    key={mIdx}
                    className='bg-neutral-50 p-4 rounded-lg border border-gray-500 mb-4 space-y-3'>
                    <input
                      placeholder='Module Title'
                      className='w-full font-bold bg-transparent border-b border-gray-500 outline-none pb-1'
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                    />
                    <div className='flex gap-4 text-xs text-gray-500 italic'>
                      <span className='flex items-center gap-1'>
                        <Video size={12} /> {mod.videos?.length || 0} Videos
                      </span>
                      <span className='flex items-center gap-1'>
                        <FileText size={12} /> {mod.pdfs?.length || 0} PDFs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </form>

            <div className='p-6 border-t bg-gray-50 flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='px-6 py-2 rounded-lg border font-medium'>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2'>
                {loading && <Loader2 className='animate-spin' size={18} />}
                {selectedCourse ? "Update Course" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-110 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-2xl'>
            <h3 className='text-lg font-bold text-gray-800'>Delete Course?</h3>
            <p className='text-gray-600 mt-2'>
              This will permanently remove{" "}
              <span className='font-bold'>"{selectedCourse?.Coursename}"</span> and all associated
              files.
            </p>
            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='px-4 py-2 border rounded-lg'>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700'>
                {loading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
