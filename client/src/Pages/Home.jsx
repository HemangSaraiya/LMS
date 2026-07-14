import React, { useEffect, useState } from 'react'
import api from "../api";
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(location.state?.alertMessage || '');
  const [userRole, setUserRole] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
  const navItems = [
  { label: 'Create Course', href: '/createcourse' },
  { label: 'My Courses', href: '/studentcourses' },
  { label: 'Instructor', href: '/my-courses' },
  { label: 'be Instructor', href: '/beinstructor' },
  { label: 'Admin', href: '/admin' },
]

  // useEffect(() => {
  //   const performSearch = async () => {
  //     try {
  //       if (searchKey.trim() === '') {
  //         const res = await api.get('/course/courses');
  //         setCourses(res.data);
  //       } else {
  //         const res = await api.get(`/course/search/${searchKey}`);
  //         setCourses(res.data);
  //       }
  //     } catch (err) {
  //       console.error('Search failed:', err);
  //     }
  //   };
  //   performSearch();
  // }, [searchKey]);

  const isCoursePurchased = (course) => {
    if (!userId || !course?.students) return false;
    return course.students.some(student => {
      const studentId = student?._id ? student._id.toString() : student?.toString();
      return studentId === userId;
    });
  };

  const isInstructorCourse = (course) => {
    if (!userId || !course?.instructor) return false;

    const instructorId = typeof course.instructor === 'object'
      ? course.instructor?._id
      : course.instructor;

    return instructorId?.toString() === userId.toString();
  };

  const handleBuyCourse = (courseId) => {
    
      navigate(`/buycourse/${courseId}`);
    
  };
  useEffect(()=>{
    const fetchUserRole=async()=>{
      try{
        const res=await api.get('/auth/me');
        setUserRole(res.data?.user?.role || '');
        setUserId(res.data?.user?._id || res.data?.user?.id || null);
      }
      catch(e){
        console.log('Failed to fetch user role:', e)
      }
    }
    fetchUserRole();
  },[])
  useEffect(()=>{
    if (location.state?.alertMessage) {
      setAlertMessage(location.state.alertMessage)
    }

    return () => {
      setAlertMessage('')
    }
  }, [location.state?.alertMessage])

  // useEffect(()=>{
  //   const fetchCourses=async()=>{
  //     try{
  //       const res=await api.get('/course/courses');
  //       if (res.data && res.data.length) {
  //         setCourses(res.data);
  //       }
  //     }
  //     catch(e){
  //       console.log('Course fetch failed:', e)
  //     }
  //   }
useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res=await api.get('/auth/me');
        setIsLoggedIn(Boolean(res.data?.user));
      }
      catch(e){
        setIsLoggedIn(false);
      }
    }

    checkAuth();
  }, [])

const fetchCourses = async (newPage = 1, newSearch = searchKey) => {
  try {
    setLoading(true);

    const res = await api.get(
      `/course/courses?page=${newPage}&limit=6&search=${newSearch}`
    );

    const newCourses = res.data.courses;

    if (newPage === 1) {
      setCourses(newCourses);
    } else {
      setCourses(prev => [...prev, ...newCourses]);
    }

    if (newCourses.length < 6) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

  } catch (err) {
    console.log("Fetch failed:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1)
      fetchCourses(1, searchKey)
    }, 400)

    return () => clearTimeout(delay)
  }, [searchKey])
useEffect(() => {
  fetchCourses(page, searchKey);
}, [page]);
const handleSearch = (value) => {
  setSearchKey(value);
  setPage(1);
  setCourses([]);
};

  const handleLogout=async()=>{
    try{
      await api.post('/auth/logout');
      setIsLoggedIn(false);
      navigate('/');
    }
    catch(e){
      console.log('Logout failed:', e)
    }
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/10">
              <span className="text-lg font-semibold">L M S</span>
            </div>
            
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
              <span className="text-sm font-medium text-slate-700">{userRole}</span>
              <button
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                onClick={handleLogout}
              >
                Log out
              </button>
              
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  Sign up
                </a>
              </>
            )}
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 transition md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            type="button"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="space-y-1 px-4 py-4">
              <span className="text-white px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500">{userRole}</span>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-2 pt-3">
                {isLoggedIn ? (
                  <button
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Log in
                    </a>
                    <a
                      href="/signup"
                      className="block rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        

        <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white px-6 py-14 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 sm:px-10">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Modern <span className="text-indigo-600">Learning Management System</span> dashboard for learners and instructors.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              Build, manage, and share course content with a clean dashboard experience designed for learning organizations and classrooms.
            </p>
          </div>
        </section>

        <section id='courses' className="mt-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Featured courses</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Courses built for today’s learners.
              </h2>
            </div>
            <a
              href="/createcourse"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create a Course
            </a>
          </div>
        <input type="text"
          value={searchKey}
         onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search courses..."
          className="bg-gray-200 w-full mt-3 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
        />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {loading?<p>loading...</p>:null}
            {courses.map((course) => (
              
              <article
                key={course._id}
                className="overflow-hidden rounded-[1.75rem] bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="overflow-hidden rounded-t-[1.75rem] bg-slate-900/5">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-52 w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    
                    <span className="text-sm font-semibold text-slate-900">{course.price}₹</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{course.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{course.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-500">
                    <p>Instructor</p>
                    <p className="font-semibold text-slate-900">
                      {typeof course.instructor === 'object'
                        ? course.instructor?.username || 'Instructor'
                        : course.instructor || 'Instructor'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const ownedByInstructor = isInstructorCourse(course);
                      const purchased = isCoursePurchased(course);

                      if (ownedByInstructor || purchased) {
                        navigate(`/viewcourse/${course._id}`);
                      } else {
                        handleBuyCourse(course._id);
                      }
                    }}
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition ${isInstructorCourse(course) || isCoursePurchased(course) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    {isInstructorCourse(course) ? 'Instructor view' : isCoursePurchased(course) ? 'View course' : 'Buy course'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
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
      </main>
    </div>
  )
}

export default Home
