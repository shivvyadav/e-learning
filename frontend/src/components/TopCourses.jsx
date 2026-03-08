import React from "react";
import {Link} from "react-router-dom";

export default function TopCourses() {
  const courses = [
    {
      title: "A Crash Course In Wedding Photography",
      students: 422,
      price: "Free",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    },
    {
      title: "User Experience Design Fundamentals",
      students: 318,
      price: "Free",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    },
    {
      title: "Adobe XD Mega Course – User Experience Design",
      students: 173,
      price: "Free",
      image: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26",
    },
    {
      title: "The Complete Flutter Development Bootcamp with Dart",
      students: 165,
      price: "Free",
      image: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
    },
    {
      title: "Salary Negotiation: How to Negotiate a Raise",
      students: 126,
      price: "Free",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
  ];

  return (
    <div className='bg-neutral-50 rounded-xl p-6 shadow-sm w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>Top Courses</h2>

        <Link to='/courses' className='text-blue-500 text-sm font-medium hover:underline'>
          View All
        </Link>
      </div>

      <div className='space-y-6'>
        {courses.map((course, index) => (
          <div key={index} className='flex gap-4 items-start'>
            <img
              src={course.image}
              alt={course.title}
              className='w-14 h-14 rounded-md object-cover'
            />

            <div className='flex-1'>
              <p className='font-medium text-gray-800 leading-snug'>{course.title}</p>

              <p className='text-sm text-gray-500 mt-1'>
                {course.students} students&nbsp;&nbsp;
                {course.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
