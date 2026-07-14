import React from 'react'

const Beinstructor = () => {
  return (
    <div className="max-w-2xl mx-auto my-10 p-10 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Become an Instructor</h1>
      <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">for this project, i will build a system that sends requests to be instructor to admin.</p>
      <p className="text-gray-700 text-base leading-relaxed mb-4 text-justify">but for now , if you want to experience instructor features(like creating courses), you can log in from given email and password.</p>
      <div className="bg-blue-50 p-4 mt-6 border-l-4 border-blue-500 rounded">
        <p className="text-gray-800 text-sm font-mono m-0 text-left">email: instructor@gmail.com</p>
        <p className="text-gray-800 text-sm font-mono m-0 text-left">password: instructor@password</p>
      </div>
    </div>
  )
}

export default Beinstructor
