import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserLayout = () => {
    return (
        <div className="flex">
            <Sidebar role="student" />
            <div className="ml-72 w-full p-8 bg-gray-50/50 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default UserLayout;
