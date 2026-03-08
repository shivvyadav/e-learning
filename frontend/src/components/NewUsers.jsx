import React from "react";
import {Link} from "react-router-dom";

export default function NewUsers() {
  const users = [
    {name: "Zabed Manzarin", courses: 2, avatar: "https://i.pravatar.cc/40?img=1"},
    {name: "tamer mohamed", courses: 0, avatar: null, letter: "t", color: "bg-green-700"},
    {name: "Angshuman Hazarika", courses: 1, avatar: null, letter: "A", color: "bg-blue-500"},
    {name: "Richard Ikechukwu", courses: 0, avatar: null, letter: "r", color: "bg-red-500"},
    {name: "tamer mahfouz", courses: 3, avatar: null, letter: "t", color: "bg-purple-600"},
  ];

  return (
    <div className='bg-neutral-50 rounded-xl p-6 shadow-sm w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg font-semibold'>New Users</h2>
        <Link to='/users' className='text-blue-500 text-sm font-medium'>
          View All
        </Link>
      </div>

      <div className='space-y-5'>
        {users.map((user, index) => (
          <div key={index} className='flex items-center gap-4'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className='w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${user.color}`}>
                {user.letter}
              </div>
            )}

            <div>
              <p className='font-medium text-gray-800'>{user.name}</p>
              <p className='text-sm text-gray-500'>Enrolled Courses: {user.courses}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
