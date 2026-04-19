import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from './hooks/useAxios';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';

const Stats = () => {
  const AxiosInstance = useAxios();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await AxiosInstance.get('/admin-stats');
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds for "live" feel
  });

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats?.todayBookings || 0,
      icon: <FaCalendarAlt className="text-blue-500" />,
      color: "border-blue-500"
    },
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ? `RM ${Number(stats.totalRevenue).toFixed(2)}` : 'RM 0.00',
      icon: <FaMoneyBillWave className="text-green-500" />,
      color: "border-green-500"
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: <FaClock className="text-warning" />,
      color: "border-warning"
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: <FaUsers className="text-purple-500" />,
      color: "border-purple-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-32 w-full rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error loading dashboard statistics. Please check your connection.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`card bg-base-100 shadow-md border-l-4 ${card.color} hover:shadow-xl transition-all duration-300`}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.title}</p>
                <h3 className="text-2xl font-extrabold mt-2 text-base-content">{card.value}</h3>
              </div>
              <div className="text-3xl p-3 bg-base-200 rounded-lg">
                {card.icon}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;