import React from 'react';
import Stats from '../../components/Stats';
import { motion } from 'framer-motion';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="card bg-base-100 shadow-xl mb-8 border-t-4 border-primary"
                >
                    <div className="card-body py-6">
                        <h2 className="card-title text-3xl font-bold text-primary">Admin Dashboard</h2>
                        <p className="text-sm text-gray-500">Real-time overview of your booking performance and statistics.</p>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <Stats />
            </div>
        </div>
    );
};

export default Dashboard;