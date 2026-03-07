import {Pencil, Trash2, Plus} from "lucide-react";

const courses = [
  {
    title: "Untitled",
    students: 1,
    price: "Free",
    author: "John Carter",
    rating: 0,
  },
  {
    title: "The Social Media Marketing & Management Masterclass 2023",
    students: 4,
    price: "Premium",
    author: "John Carter",
    rating: 0,
  },
  {
    title: "User Experience Design Fundamentals",
    students: 318,
    price: "Free",
    author: "John Carter",
    rating: 4,
  },
  {
    title: "Master Digital Product Design: UX Research & UI Design",
    students: 10,
    price: "Premium",
    author: "John Carter",
    rating: 5,
  },
];

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
  return (
    <div className='h-[calc(100vh-80px)] flex flex-col p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl flex flex-col h-full overflow-hidden'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-300 shrink-0'>
          <h2 className='text-xl font-semibold text-blue-600'>Courses</h2>

          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
            <Plus size={18} />
            Add Course
          </button>
        </div>

        <div className='flex-1 overflow-y-auto divide-y divide-neutral-300'>
          {courses.map((course, index) => (
            <div key={index} className='flex items-start justify-between gap-4 px-6 py-6'>
              <div className='flex gap-4 flex-1 min-w-0'>
                <div className='w-16 h-16 rounded-md bg-neutral-200 shrink-0'></div>

                <div className='space-y-2 min-w-0'>
                  <h3 className='font-semibold text-gray-800 wrap-break-words'>{course.title}</h3>

                  <div className='text-sm text-gray-600 flex flex-wrap gap-2'>
                    <span>{course.students} students</span>

                    <span className='text-blue-600 font-medium'>{course.price}</span>
                  </div>

                  <p className='text-sm text-gray-500'>By {course.author}</p>

                  <StarRating rating={course.rating} />
                </div>
              </div>

              <div className='flex items-center gap-3 shrink-0'>
                <button className='w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition'>
                  <Pencil size={18} className='text-blue-600' />
                </button>

                <button className='w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition'>
                  <Trash2 size={18} className='text-red-500' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
