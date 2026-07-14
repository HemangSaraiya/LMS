import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const Buycourse = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const handlePayment = async () => {
    try {
      await api.post(`/course/buycourse/${id}`)
      navigate('/')
    } catch (e) {
      console.log(e)
      window.alert('Unable to complete purchase right now')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 px-8 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-200">Course Checkout</p>
          <h1 className="mt-4 text-4xl font-semibold">Buy this course</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-100/80">
            Secure your spot and unlock the course content. Click the button below to complete your purchase and return to the dashboard.
          </p>
        </div>

        

          <button
            onClick={handlePayment}
            className="mt-10 w-full rounded-3xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Pay securely
          </button>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Note</p>
            <p className="mt-3 leading-6">
              This page is a simple project demo. You do not need to actually complete payment. Clicking the Pay button will redirect you to the home page.
            </p>
          </div>
        </div>
      </div>
    
  )
}

export default Buycourse
