import React, {useState} from "react";
import {Pencil, Trash2, Plus} from "lucide-react";
import {useAuth} from "../context/AdminContext";

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
  const {courses, enrollments, reviews, dataLoading} = useAuth();
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (id) => {
    setFailedImages((prev) => ({...prev, [id]: true}));
  };

  // Helper to calculate average rating for a specific course
  const getAverageRating = (courseId) => {
    const courseReviews = reviews.filter(
      (r) => r.courseId?._id === courseId || r.courseId === courseId,
    );
    if (courseReviews.length === 0) return 0;
    const sum = courseReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round(sum / courseReviews.length);
  };

  // Helper to count students for a specific course
  const getStudentCount = (courseId) => {
    return enrollments.filter((e) => e.course?._id === courseId || e.course === courseId).length;
  };

  return (
    <div className='h-[calc(100vh-80px)] flex flex-col p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl flex flex-col h-full overflow-hidden shadow-sm'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-300 shrink-0'>
          <h2 className='text-xl font-semibold text-blue-600'>Courses ({courses.length})</h2>

          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm'>
            <Plus size={18} />
            Add Course
          </button>
        </div>

        {/* Course List */}
        <div className='flex-1 overflow-y-auto divide-y divide-neutral-300'>
          {dataLoading ? (
            <div className='flex items-center justify-center py-20'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : courses.length === 0 ? (
            <div className='text-center py-20 text-neutral-500 font-medium'>
              No courses found. Click "Add Course" to get started.
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className='flex items-start justify-between gap-4 px-6 py-6 hover:bg-neutral-50 transition-colors'>
                <div className='flex gap-4 flex-1 min-w-0'>
                  {/* Course Image Logic */}
                  <div className='w-16 h-16 rounded-md bg-neutral-200 shrink-0 overflow-hidden border border-neutral-100'>
                    {failedImages[course._id] || !course.coursethumbnail ? (
                      <div className='w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-[10px] text-center p-1'>
                        No Image
                      </div>
                    ) : (
                      <img
                        src={course.coursethumbnail}
                        alt={course.Coursename}
                        onError={() => handleImageError(course._id)}
                        className='w-full h-full object-cover'
                      />
                    )}
                  </div>

                  <div className='space-y-1 min-w-0'>
                    <h3 className='font-semibold text-gray-800 wrap-break-words leading-snug'>
                      {course.Coursename}
                    </h3>

                    <div className='text-sm text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1'>
                      <span className='bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium'>
                        {getStudentCount(course._id)} students
                      </span>

                      <span className='text-green-600 font-bold'>
                        {course.CoursePrice === 0 ? "Free" : `$ ${course.CoursePrice}`}
                      </span>
                    </div>

                    <p className='text-sm text-gray-500'>By Admin</p>

                    <StarRating rating={getAverageRating(course._id)} />
                  </div>
                </div>

                {/* Actions - Functionality to be added later */}
                <div className='flex items-center gap-3 shrink-0'>
                  <button className='w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition group'>
                    <Pencil size={18} className='text-blue-600' />
                  </button>

                  <button className='w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition group'>
                    <Trash2 size={18} className='text-red-500' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
