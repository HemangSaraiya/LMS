import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import api from './api'
const ProtectRoute = ({children}) => {
    const [isAuth, setIsAuth] = useState(null)
    const navigate = useNavigate()
    useEffect(()=>{
api.get('/auth/me')
    .then(()=>setIsAuth(true))
    .catch(()=>setIsAuth(false))
    },[])
    if(isAuth===null){
        return <p>loading...</p>
    }if(!isAuth){
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white px-8 py-10 shadow-lg shadow-slate-300/30">
          <p className="text-lg font-medium text-red-600">You must be logged in to view this page.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to courses
          </button>
        </div>
      </div>

    }
    return children
}

export default ProtectRoute