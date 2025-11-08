import React from 'react';

const MyContainer = ({className, children}) => {
    return (
        <div  className='px-15'>
            {children}
        </div>
    );
};

export default MyContainer ;