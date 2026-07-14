import {React,useState ,useEffect} from 'react'
import api from "../api";
import { useLocation, useNavigate } from 'react-router-dom'

const Studentcourses = () => {
    const navigate=useNavigate();
    const [courses, setCourses] = useState([]);
     useEffect(()=>{
        const fetchCourses=async()=>{
            try {
                const response=await api.get("/course/studentcourses");   
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);
  return (
    <div>
      <div className='mt-2 flex justify-center items-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>My Courses</h1>
      </div>
      <div className="mt-8 p-2 grid gap-6 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
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
                  <p className="mt-2 text-lg font-bold text-green-600">Total Students: {course.students?.length || 0}</p>
                 
                    <button 
                      key={course._id} 
                      className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700" 
                      onClick={() => navigate(`/viewcourse/${course._id}`)}
                    >
                      View Course
                    </button>
                    
                 
                </div>
              </article>
            ))}
            </div>
    </div>
  )
}

export default Studentcourses
