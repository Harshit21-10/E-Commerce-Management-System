'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

export default function RetailerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  const router = useRouter();

  useEffect(() => {
    // TODO: Fetch retailer stats from API
    // This will be implemented when we connect to the backend
  }, []);

  const dashboardCards = [
    {
      title: 'Products',
      value: stats.totalProducts,
      link: '/retailer/products',
      color: 'bg-blue-100',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      link: '/retailer/orders',
      color: 'bg-green-100',
    },
    {
      title: 'Pending',
      value: stats.pendingOrders,
      link: '/retailer/orders?status=pending',
      color: 'bg-yellow-100',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      link: '/retailer/revenue',
      color: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Retailer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Link href={card.link} key={index}>
            <div className={`${card.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/retailer/products/add">
              <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                Add New Product
              </div>
            </Link>
            <Link href="/retailer/profile">
              <div className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center">
                Edit Profile
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {/* This will be populated with actual data later */}
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
} 