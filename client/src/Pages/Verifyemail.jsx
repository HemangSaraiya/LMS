import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from '../api'

const Verifyemail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedCode = code.trim()
    if (!trimmedCode) return

    setIsLoading(true)
    try {
      await api.post('/auth/verifyemail', { code: trimmedCode })
      window.alert("Email verified successfully")
      navigate('/login')
    } catch (e) {
      window.alert("Wrong or Invalid Code")
      console.log("error in verification", e)
    } finally {
      setIsLoading(false)
      setCode('')
    }
  }
  return (
    <div>
      <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Email</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
            <input required onChange={(e)=>{setCode(e.target.value)}} value={code} type="text" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Enter Verification Code" />

          <button type="submit" disabled={isLoading} className=" bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Verifying...' : 'Verify'}</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Verifyemail
