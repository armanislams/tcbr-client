import React from 'react';
import MyContainer from './MyContainer';

const Stats = () => {
    return (
        <MyContainer>
            <div className='flex justify-between items-center'>
                <div className='bg-white h-30 px-7 py-3 space-y-5 rounded-xl text-xl font-semibold'>
                    <h1>Today Booking</h1>
                    <h3>amount</h3>
                </div>
                <div className='bg-white h-30 px-7 py-3 space-y-5 rounded-xl text-xl font-semibold'>
                    <h1>Today Booking</h1>
                    <h3>amount</h3>
                </div>
                <div className='bg-white h-30 px-7 py-3 space-y-5 rounded-xl text-xl font-semibold'>
                    <h1>Total Amount</h1>
                    <h3>amount</h3>
                </div>
                <div className='bg-white h-30 px-7 py-3 space-y-5 rounded-xl text-xl font-semibold'>
                    <h1>Total Customer</h1>
                    <h3>amount</h3>
                </div>
            </div>
        </MyContainer>
    );
};

export default Stats;