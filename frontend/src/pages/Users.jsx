import {useState} from "react";
import {motion} from "framer-motion";
import {Search} from "lucide-react";

const usersData = [
  {id: 1, name: "Angshuman Hazarika", email: "angshuman@gmail.com", courses: 1},
  {id: 2, name: "Richard Ikechukwu", email: "richard@gmail.com", courses: 0},
  {id: 3, name: "Tamer Mahfouz", email: "tamer@gmail.com", courses: 3},
  {id: 4, name: "Yobsen Yooba", email: "yobsen@gmail.com", courses: 0},
  {id: 5, name: "Thafseer Ali", email: "thafseer@gmail.com", courses: 2},
  {id: 6, name: "Xahi ID", email: "xahi@gmail.com", courses: 1},
  {id: 7, name: "Monoj M", email: "monoj@gmail.com", courses: 4},
  {id: 8, name: "Sarah Khan", email: "sarah@gmail.com", courses: 2},
  {id: 9, name: "John Carter", email: "john@gmail.com", courses: 0},
  {id: 10, name: "Alex Brown", email: "alex@gmail.com", courses: 5},
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = usersData.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='w-full h-full p-4 flex justify-center items-start'>
      {/* Remove overflow-hidden from the card */}
      <div className='w-full lg:max-w-6xl bg-white border border-neutral-300 rounded-2xl flex flex-col h-[84vh]'>
        {/* Search bar */}
        <div className='px-6 py-4 border-b border-neutral-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-[600px]'>
          <h2 className='text-xl font-semibold text-blue-600'>Users</h2>
          <div className='relative w-full md:w-80'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400'
            />
            <input
              type='text'
              placeholder='Search by email'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Horizontal scroll wrapper */}
        <div className='overflow-x-auto flex-1'>
          <div className='min-w-[600px] flex flex-col h-full'>
            {/* Table header */}
            <div className='grid grid-cols-[40%_40%_20%] px-6 py-4 text-sm font-medium text-neutral-600 border-b border-neutral-300 bg-neutral-50'>
              <span>User</span>
              <span>Email</span>
              <span>Enrolled Courses</span>
            </div>

            {/* Table rows */}
            <div className='flex-1 overflow-y-auto'>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.2, delay: index * 0.02}}
                  className='grid grid-cols-[40%_40%_20%] px-6 py-4 border-b border-neutral-300 hover:bg-neutral-50'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold'>
                      {user.name.charAt(0)}
                    </div>
                    <span className='font-medium'>{user.name}</span>
                  </div>

                  <div className='text-neutral-600'>{user.email}</div>
                  <div className='font-medium'>{user.courses}</div>
                </motion.div>
              ))}

              {filteredUsers.length === 0 && (
                <div className='text-center py-10 text-neutral-500'>No users found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
