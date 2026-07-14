import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from '../api'
const Signup = () => {
    const navigate=useNavigate();
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading,setIsLoading]=useState(false)
    const handleSubmit=async (e)=>{
        
        e.preventDefault()
        setIsLoading(true)
        try{
            await api.post('/auth/signup',{username:userName,email,password,role:"student"})
            navigate('/verifyemail');
        }
        catch(e){
            window.alert("email already exists")
            console.log(e)
        }
        finally{
          setIsLoading(false)
        }
        setEmail('')
        setPassword('')
        setUserName('')
    }
  return (
    <div>
      <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
            <input required onChange={(e)=>{setUserName(e.target.value)}} value={userName} type="text" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Username" />
          <input required onChange={(e)=>{setEmail(e.target.value)}} value={email} type="email" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Email address" />
          <input required onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Password" />
          
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-gray-900 mt-4">Already have an account? <a href="/login" className="text-sm text-blue-500 -200 hover:underline mt-4">Login</a></p>
          </div>
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-gray-900 mt-4">Already have an account? <a href="/login" className="text-sm text-blue-500 -200 hover:underline mt-4">Login</a></p>
          </div>
         <button type="submit" disabled={isLoading} className=" bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">{isLoading?('Wait...'):('Sign Up')}</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Signup
