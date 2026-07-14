import React from 'react'
import { useState, useEffect } from 'react'
import api from '../api'

const Admin = () => {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState('') 

  const handleDeleteUser = async (userId) => {
    try {
      if (users.find(user => user._id === userId)?.role === 'admin') {
        alert("Admin user cannot be deleted")
        return
      }
      await api.delete(`/auth/deleteUser/${userId}`)
      setUsers(users.filter(user => user._id !== userId))
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/getUsers')
        setUsers(res.data)
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])


  const fetchCourses = async (newPage = 1, newSearch = searchKey) => {
    try {
      setLoading(true)

      const res = await api.get(
        `/course/courses?page=${newPage}&limit=6&search=${newSearch}`
      )

      const newCourses = res.data.courses

      if (newPage === 1) {
        setCourses(newCourses)
      } else {
        setCourses(prev => [...prev, ...newCourses])
      }

      if (newCourses.length < 6) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

    } catch (err) {
      console.log("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchCourses(1)
  }, [])

  useEffect(() => {
    if (page > 1) {
      fetchCourses(page)
    }
  }, [page])


  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1)
      fetchCourses(1, searchKey)
    }, 400)

    return () => clearTimeout(delay)
  }, [searchKey])

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/course/deletecourse/${courseId}`)
      setCourses(courses.filter(course => course._id !== courseId))
    } catch (err) {
      console.error('Error deleting course:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

       
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Admin Panel</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Welcome to the Admin Panel. Here you can manage users, courses, and other administrative tasks.
          </p>
        </div>

        {/* USERS */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 border-b-4 border-blue-500 pb-3 inline-block">
              Manage Users
            </h2>
            <p className="text-slate-600 mt-2">
              Total Users: <span className="font-bold text-slate-900">{users.length}</span>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{user.username}</h3>
                    <p className="text-sm text-slate-600 mt-1">{user.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'instructor'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={user.role === 'admin'}
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    user.role === 'admin'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {user.role === 'admin' ? 'Cannot Delete Admin' : 'Delete User'}
                </button>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <p className="text-center text-slate-500 py-8">No users found</p>
          )}
        </div>

   
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 border-b-4 border-green-500 pb-3 inline-block">
              Manage Courses
            </h2>
            <p className="text-slate-600 mt-2">
              Total Courses: <span className="font-bold text-slate-900">{courses.length}</span>
            </p>
          </div>


          <input
            type="text"
            placeholder="Search courses..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="mb-6 w-full p-3 border border-slate-300 rounded-lg"
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course._id}
                className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-slate-200"
              >
                <div className="overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 flex-1">{course.title}</h3>
                    <span className="text-xl font-bold text-green-600">{course.price}₹</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-3 py-4 border-t border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Instructor:</span>
                      <span className="font-semibold text-slate-900">
                        {typeof course.instructor === 'object'
                          ? course.instructor?.username || 'Instructor'
                          : course.instructor || 'Instructor'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Students:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {course.students?.length || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="w-full mt-4 bg-red-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete Course
                  </button>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full"
              >
                {loading ? "Loading..." : "View More"}
              </button>
            </div>
          )}

          {courses.length === 0 && (
            <p className="text-center text-slate-500 py-8">No courses found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin