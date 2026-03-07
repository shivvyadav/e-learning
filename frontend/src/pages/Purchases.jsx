import {useState} from "react";

const purchaseData = [
  {
    name: "Sheikabbas S",
    email: "sheikabbas242000@gmail.com",
    plan: "Weekly Plan (Prime LMS)",
    status: "Expired",
    price: "95.00",
    purchased: "19 September, 2025 02:50 AM",
  },
  {
    name: "No Name",
    email: "ashok.viruna@gmail.com",
    plan: "Weekly Plan",
    status: "Expired",
    price: "0.99",
    purchased: "26 April, 2025 11:02 AM",
  },
  {
    name: "Atharav Joshi",
    email: "arjl23pune@gmail.com",
    plan: "Weekly Plan",
    status: "Expired",
    price: "99",
    purchased: "12 February, 2025 12:21 AM",
  },
  {
    name: "Lalit Sharma",
    email: "lalitbhai7990@gmail.com",
    plan: "Weekly Plan",
    status: "Expired",
    price: "99",
    purchased: "21 December, 2024 05:00 PM",
  },
  {
    name: "Sama Bac",
    email: "samabac10@gmail.com",
    plan: "Monthly Plan",
    status: "Expired",
    price: "2.99",
    purchased: "16 December, 2024 05:54 PM",
  },
];

const Purchases = () => {
  return (
    <div className='p-4 md:p-6'>
      <div className='bg-white border border-neutral-300 rounded-xl overflow-hidden'>
        <div className='px-6 py-4 border-b border-neutral-300'>
          <h2 className='text-xl font-semibold text-blue-600'>Purchases</h2>
        </div>

        <div className='overflow-auto max-h-[calc(100vh-200px)]'>
          <table className='w-full min-w-175'>
            <thead className='bg-neutral-100  border-b border-neutral-300 sticky top-0 z-10'>
              <tr className='text-left text-neutral-700 text-sm md:text-base'>
                <th className='px-6 py-4 font-semibold'>User</th>
                <th className='px-6 py-4 font-semibold'>Subscription Plan</th>
                <th className='px-6 py-4 font-semibold'>Price</th>
                <th className='px-6 py-4 font-semibold'>Purchased At</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-neutral-300'>
              {purchaseData.map((item, index) => (
                <tr key={index} className='hover:bg-neutral-50 transition'>
                  <td className='px-6 py-4'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium'>
                        {item.name.charAt(0)}
                      </div>

                      <div className='min-w-0'>
                        <p className='font-medium text-neutral-800'>{item.name}</p>
                        <p className='text-sm text-neutral-500 break-all'>{item.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <span className='text-neutral-800'>{item.plan}</span>
                    <span className='text-red-500 ml-1'>({item.status})</span>
                  </td>

                  <td className='px-6 py-4 font-medium text-neutral-700'>Rs. {item.price}</td>

                  <td className='px-6 py-4 text-neutral-600 whitespace-nowrap'>{item.purchased}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
