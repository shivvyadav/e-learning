import {Trash2, Clock} from "lucide-react";

const reviews = [
  {
    name: "Nexora technology",
    course: "The Complete Flutter Development Bootcamp with Dart",
    rating: 5,
    text: "very good",
    date: "15 December, 2025 03:16 PM",
  },
  {
    name: "Samuel Moses",
    course: "A Crash Course In Wedding Photography",
    rating: 5,
    text: "",
    date: "13 December, 2025 02:29 PM",
  },
  {
    name: "test",
    course: "A Crash Course In Wedding Photography",
    rating: 4,
    text: "",
    date: "29 October, 2025 09:27 AM",
  },
  {
    name: "No Name",
    course: "User Experience Design Fundamentals",
    rating: 4.5,
    text: "",
    date: "21 October, 2025 02:14 PM",
  },
  {
    name: "Virendra Meena",
    course: "Salary Negotiation: How to Negotiate a Raise or Promotion",
    rating: 2.5,
    text: "Testing fase",
    date: "15 October, 2025",
  },
];

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

      <span className='text-yellow-500 font-medium'>{rating.toFixed(2)}</span>
    </div>
  );
};

const Reviews = () => {
  return (
    <div className='p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl overflow-hidden'>
        <div className='divide-y divide-neutral-300'>
          {reviews.map((review, index) => (
            <div key={index} className='flex items-start justify-between gap-4 px-6 py-6'>
              <div className='flex gap-4 flex-1 min-w-0'>
                <div className='w-12 h-12 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold'>
                  {review.name.charAt(0).toUpperCase()}
                </div>

                <div className='space-y-2 min-w-0'>
                  <div className='flex flex-wrap items-center gap-2 text-sm md:text-base'>
                    <span className='font-medium text-gray-800'>{review.name}</span>

                    <span className='text-blue-600 wrap-break-word-words'>{review.course}</span>
                  </div>

                  <StarRating rating={review.rating} />

                  {/* Comment */}
                  {review.text && <p className='text-gray-700 text-sm'>{review.text}</p>}

                  {/* Date */}
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Clock size={16} />
                    {review.date}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button className='shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition'>
                <Trash2 size={18} className='text-blue-600 hover:text-red-500' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
