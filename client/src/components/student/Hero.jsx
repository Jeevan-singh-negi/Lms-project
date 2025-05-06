import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-cneter bg-gradient-to-b from-cyan-100/70'>
     <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>Empower your future with the course designed to <span className='text-blue-600'>fit your choice.</span> <img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0' /></h1>

     <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>Discover the perfect course for you. Whether you're a beginner or an experienced learner, our course selection is designed to meet your unique needs.</p>

     <p className='md:hidden block text-gray-500 max-w-sm mx-auto'> we bring together world-class instructors to help you you achive your professional goals.</p>

     <SearchBar />
    </div>
  )
}

export default Hero