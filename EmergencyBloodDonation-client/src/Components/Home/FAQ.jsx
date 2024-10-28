import React from 'react';

const FAQ = () => {
    return (
       <div className='flex justify-center items-center'>
         <div className='w-2/3 '>
            <h2 className='text-center text-4xl text-red-600 font-semibold p-10'>Any Confusion!!!</h2>
            <div className="collapse collapse-arrow bg-slate-100 mb-5 p-3 ">
                <input type="radio" name="my-accordion-2"  />
                <div className="collapse-title text-2xl font-medium">Are we a blood banker?</div>
                <div className="collapse-content">
                    <p className='text-lg'>No, we are not Blood Banker</p>
                </div>
            </div>
            <div className="collapse collapse-arrow bg-slate-100 mb-5 p-3">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-2xl font-medium">So what are we?</div>
                <div className="collapse-content">
                    <p className='text-lg'>We are only a medium where you can get blood</p>
                </div>
            </div>
            <div className="collapse collapse-arrow bg-slate-100 mb-5 p-3">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-2xl font-medium">Do we have to pay any money?</div>
                <div className="collapse-content">
                    <p className='text-lg'>No, This is free platform</p>
                </div>
            </div>
            
            <div className="collapse collapse-arrow bg-slate-100 mb-5 p-3">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-2xl font-medium">What is our goal?</div>
                <div className="collapse-content">
                    <p className='text-lg'>Our goal is to find you a blood donor during an emergency.</p>
                </div>
            </div>
        </div>
       </div>
    );
};

export default FAQ;