'use client'
import React from 'react'
import Title from './Title'

const ourSpecsData = [
  { title: "Free Shipping", description: "Enjoy fast, free delivery on every order.", color: "#05DF72" },
  { title: "7 Days Easy Return", description: "Return any item within 7 days, hassle free.", color: "#FF8904" },
  { title: "24/7 Support", description: "We're always here to help you anytime.", color: "#A684FF" }
];

const OurSpecs = () => {
  return (
    <div className='px-6 my-20 max-w-6xl mx-auto'>
      <Title visibleButton={false} title='Our Specifications' description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free." />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26'>
        {ourSpecsData.map((spec, index) => (
          <div key={index} className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group'
            style={{ backgroundColor: spec.color + "20", borderColor: spec.color }}>
            <h3 className='text-slate-800 font-medium'>{spec.title}</h3>
            <p className='text-sm text-slate-600 mt-3'>{spec.description}</p>
            <div className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition'
              style={{ backgroundColor: spec.color }}>
              ❤️
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default OurSpecs
