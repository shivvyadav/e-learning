import React from "react";
import {Link} from "react-router-dom";

export default function LatestPurchases() {
  const purchases = [
    {
      course: "React Mastery Course",
      student: "Sheikabbas S",
      price: "₹95.00",
    },
    {
      course: "JavaScript Fundamentals",
      student: "No Name",
      price: "$0.99",
    },
    {
      course: "Advanced CSS Bootcamp",
      student: "Atharav Joshi",
      price: "₹99",
    },
    {
      course: "Full Stack Development",
      student: "Lalit Sharma",
      price: "₹99",
    },
    {
      course: "UI/UX Design Complete Guide",
      student: "Sama Bac",
      price: "$US2.99",
    },
  ];

  return (
    <div className='bg-neutral-50 rounded-xl p-6 shadow-sm w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>Latest Purchases</h2>

        <Link to='/purchases' className='text-blue-500 text-sm font-medium hover:underline'>
          View All
        </Link>
      </div>

      <div className='space-y-5'>
        {purchases.map((item, index) => (
          <div key={index} className='flex justify-between items-start'>
            <div>
              <p className='font-medium text-gray-800 leading-snug'>{item.course}</p>

              <p className='text-sm text-gray-500 mt-1'>{item.student}</p>
            </div>

            <span className='text-green-600 font-semibold text-sm'>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
