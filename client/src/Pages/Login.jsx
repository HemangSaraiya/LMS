import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from '../api'
const Login = () => {
    const navigate=useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const [isLogging,setIsLogging]=useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLogging(true)
        try {
            await api.post('/auth/login', { email, password, role: "student" })
            setError('')
            navigate('/');
        } catch (e) {
            const message = e?.response?.data?.message || "Login failed"
            setError(message)
            console.log(e)
        }
        finally{
          setIsLogging(false)
        }
        setEmail('')
        setPassword('')
    }
  return (
    <div>
      <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
            
          <input required onChange={(e)=>{setEmail(e.target.value)}} value={email} type="email" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Email address" />
          <input required onChange={(e)=>{setPassword(e.target.value)}} value={password} type="password" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Password" />
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-gray-900 mt-4"> Don't have an account? <a href="/signup" className="text-sm text-blue-500 -200 hover:underline mt-4">Signup</a></p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button type="submit" disabled={isLogging} className=" bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">{isLogging?('Wait...'):('Login')}</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login
