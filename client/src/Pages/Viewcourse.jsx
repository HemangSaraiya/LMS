import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const Viewcourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [error, setError] = useState('')
  const [videoError, setVideoError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/viewcourse/${id}`)
        setCourse(res.data)
        setSelectedLecture(res.data.lectures?.[0] || null)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load course')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture)
  }

  const lectureVideoUrl = selectedLecture?.video?.trim();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white px-8 py-10 shadow-lg shadow-slate-300/30">
          <p className="text-lg font-medium text-slate-700">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white px-8 py-10 shadow-lg shadow-slate-300/30">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
    
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Course</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{course.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{course.description}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-center">
              <p className="text-sm font-medium text-slate-500">Price</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{course.price}₹</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/5">
            <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white">
              {selectedLecture ? (
                <>
                  <h2 className="text-2xl font-semibold">{selectedLecture.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{selectedLecture.description}</p>
                  <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-black">
                    <video
                      key={lectureVideoUrl}
                      src={lectureVideoUrl}
                      controls
                      preload="metadata"
                      playsInline
                      className="h-full w-full object-cover"
                      onError={() => setVideoError('Video failed to load. Check URL or browser support.')}
                      onLoadedData={() => setVideoError('')}
                    >
                      Your browser does not support this video format.
                    </video>
                    {videoError && (
                      <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {videoError}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-500 bg-slate-950/90 p-10 text-center">
                  <p className="text-lg font-semibold text-white">No lecture selected</p>
                  <p className="mt-2 text-sm text-slate-300">Choose a lecture from the list to start watching.</p>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Instructor</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{course.instructor?.username || 'Instructor'}</p>
                <p className="mt-1 text-sm text-slate-600">{course.instructor?.email || ''}</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Total lectures</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{course.lectures?.length || 0}</p>
                <p className="mt-2 text-sm text-slate-600">Watch at your own pace.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/5">
            <h2 className="text-xl font-semibold text-slate-900">Lectures</h2>
            <p className="mt-2 text-sm text-slate-500">Select a lecture to start watching.</p>
            <div className="mt-6 space-y-4">
              {course.lectures?.map((lecture, index) => {
                const isActive = selectedLecture?.title === lecture.title
                return (
                  <button
                    key={index}
                    onClick={() => handleLectureSelect(lecture)}
                    className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${isActive ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{lecture.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{lecture.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">Lecture {index + 1}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Viewcourse
