import React from "react";
import {Users, UserCheck, BookOpen, Star} from "lucide-react";

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
    <div className='w-full py-6 '>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between bg-neutral-50 rounded-xl shadow-sm p-6'>
            <div className='flex items-center gap-4'>
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bg}`}>
                {item.icon}
              </div>

              <div>
                <p className='text-gray-500 text-sm'>{item.title}</p>
                <p className='text-xl font-semibold'>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
