import React from "react";
import {Clock} from "lucide-react";
import {useAuth} from "../context/AdminContext";

const StarRating = ({rating}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className='flex'>
        {stars.map((star) => (
          <span
            key={star}
            className={`text-lg ${
              rating >= star
                ? "text-yellow-400"
                : rating >= star - 0.5
                  ? "text-yellow-300"
                  : "text-gray-300"
            }`}>
            ★
          </span>
        ))}
      </div>
      <span className='text-yellow-500 font-medium'>
        {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
      </span>
    </div>
  );
};

const Reviews = () => {
  const {reviews, dataLoading} = useAuth();

  // Helper to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className='h-[calc(100vh-80px)] flex flex-col p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl flex flex-col h-full overflow-hidden shadow-sm'>
        <div className='border-b border-neutral-300 px-6 py-4 shrink-0 flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-blue-600'>Course Reviews</h2>
          <span className='text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium'>
            Total: {reviews.length}
          </span>
        </div>

        <div className='flex-1 overflow-y-auto divide-y divide-neutral-300'>
          {dataLoading ? (
            <div className='flex items-center justify-center py-20'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className='text-center py-20 text-neutral-500'>No reviews available yet.</div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className='flex items-start justify-between gap-4 px-6 py-6 hover:bg-neutral-50 transition-colors'>
                <div className='flex gap-4 flex-1 min-w-0'>
                  {/* User Initial Avatar */}
                  <div className='w-12 h-12 shrink-0 rounded-full bg-[#3B4CCA] text-white flex items-center justify-center font-semibold text-lg'>
                    {review.userId?.username?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className='space-y-2 min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base'>
                      <span className='font-bold text-gray-800'>
                        {review.userId?.username || "Anonymous User"}
                      </span>
                      <span className='text-neutral-300 hidden md:inline'>|</span>
                      <span className='text-blue-600 font-medium truncate'>
                        {review.courseId?.Coursename || "General Feedback"}
                      </span>
                    </div>

                    <StarRating rating={review.rating || 0} />

                    {review.comment ? (
                      <p className='text-gray-700 text-sm leading-relaxed max-w-3xl'>
                        {review.comment}
                      </p>
                    ) : (
                      <p className='text-gray-400 text-sm italic'>No written comment provided.</p>
                    )}

                    <div className='flex items-center gap-2 text-xs text-gray-500 mt-2'>
                      <Clock size={14} />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
