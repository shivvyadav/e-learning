import React from "react";
import {Users, UserCheck, BookOpen, Star} from "lucide-react";

import NewUsers from "./components/NewUsers";
import LatestReviews from "./components/LatestReviews";
import LatestPurchases from "./components/LatestPurchases";
import TopCourses from "./components/TopCourses";

export default function Admin() {
  const stats = [
    {
      title: "Total Users",
      value: "1,164",
      icon: <Users size={20} className='text-white' />,
      bg: "bg-orange-500",
    },
    {
      title: "Total Enrolled Users",
      value: "834",
      icon: <UserCheck size={20} className='text-white' />,
      bg: "bg-blue-500",
    },
    {
      title: "Total Courses",
      value: "31",
      icon: <BookOpen size={20} className='text-white' />,
      bg: "bg-purple-500",
    },
    {
      title: "Total Reviews",
      value: "156",
      icon: <Star size={20} className='text-white' />,
      bg: "bg-teal-500",
    },
  ];

  return (
    <div className='p-4 md:p-6 space-y-6'>
      {/* Stats */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((item, index) => (
          <div
            key={index}
            className='flex items-center gap-4 bg-neutral-50 border border-neutral-300 rounded-xl p-6'>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bg}`}>
              {item.icon}
            </div>

            <div>
              <p className='text-sm text-gray-500'>{item.title}</p>
              <p className='text-xl font-semibold text-gray-800'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 1 */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <NewUsers />
        <LatestReviews />
      </div>

      {/* Section 2 */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <LatestPurchases />
        <TopCourses />
      </div>
    </div>
  );
}
