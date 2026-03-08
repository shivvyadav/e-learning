import React from "react";
import {Link} from "react-router-dom";
import {Star} from "lucide-react";

export default function LatestReviews() {
  const reviews = [
    {
      name: "Nexora technology",
      rating: 5,
      text: "very good",
      letter: "N",
      color: "bg-blue-700",
    },
    {name: "Samuel Moses", rating: 5, text: "", letter: "S", color: "bg-blue-600"},
    {name: "test", rating: 4, text: "", letter: "t", color: "bg-gray-400"},
    {name: "No Name", rating: 4.5, text: "", letter: "N", color: "bg-gray-400"},
    {
      name: "Virendra Meena",
      rating: 2.5,
      text: "Testing fase",
      letter: "V",
      color: "bg-orange-500",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className='text-yellow-500 fill-yellow-500' />);
    }

    return stars;
  };

  return (
    <div className='bg-neutral-50 rounded-xl p-6 shadow-sm w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>Latest Reviews</h2>
        <Link to='/reviews' className='text-blue-500 text-sm font-medium'>
          View All
        </Link>
      </div>

      <div className='space-y-5'>
        {reviews.map((review, index) => (
          <div key={index} className='flex gap-4'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${review.color}`}>
              {review.letter}
            </div>

            <div>
              <p className='font-medium text-gray-800'>{review.name}</p>

              <div className='flex items-center gap-2 mt-1'>
                <div className='flex'>{renderStars(review.rating)}</div>
                <span className='text-yellow-600 text-sm font-medium'>
                  {review.rating.toFixed(2)}
                </span>
              </div>

              {review.text && <p className='text-sm text-gray-500 mt-1'>{review.text}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
