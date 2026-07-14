import {React,useState ,useEffect} from 'react'
import api from "../api";
import { useLocation, useNavigate } from 'react-router-dom'
const Mycourses = () => {
  const [courses, setCourses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    lectures: []
  });

    useEffect(()=>{
        const fetchCourses=async()=>{
            try {
                const response=await api.get("/auth/my-courses");   
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

const handleDeleteCourse=async(courseId)=>{
  try {
    await api.delete(`/course/deletecourse/${courseId}`);
    setCourses(courses.filter(course => course._id !== courseId));
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

const handleEditClick = (course) => {
  setEditingCourse(course);
  setEditFormData({
    title: course.title,
    description: course.description,
    price: course.price,
    image: null,
    lectures: course.lectures.map(l => ({
      title: l.title,
      description: l.description,
      video: null,
      existingVideo: l.video
    }))
  });
  setIsEditModalOpen(true);
};

const handleEditFormChange = (e) => {
  const { name, value } = e.target;
  setEditFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleImageChange = (e) => {
  setEditFormData(prev => ({
    ...prev,
    image: e.target.files[0]
  }));
};

const handleLectureChange = (index, field, value) => {
  setEditFormData(prev => ({
    ...prev,
    lectures: prev.lectures.map((lecture, i) =>
      i === index ? { ...lecture, [field]: value } : lecture
    )
  }));
};

const handleLectureVideoChange = (index, file) => {
  setEditFormData(prev => ({
    ...prev,
    lectures: prev.lectures.map((lecture, i) =>
      i === index ? { ...lecture, video: file } : lecture
    )
  }));
};

const handleUpdateCourse = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('title', editFormData.title);
    formData.append('description', editFormData.description);
    formData.append('price', editFormData.price);

    if (editFormData.image) {
      formData.append('image', editFormData.image);
    }

    const lecturesData = editFormData.lectures.map(lecture => ({
      title: lecture.title,
      description: lecture.description,
      video: lecture.video ? null : lecture.existingVideo
    }));
    formData.append('lectures', JSON.stringify(lecturesData));

    editFormData.lectures.forEach((lecture, index) => {
      if (lecture.video) {
        formData.append('lectureVideos', lecture.video);
      }
    });

    await api.put(`/course/updatecourse/${editingCourse._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Update the courses list
    const updatedCourses = courses.map(course =>
      course._id === editingCourse._id
        ? { ...course, ...editFormData }
        : course
    );
    setCourses(updatedCourses);
    setIsEditModalOpen(false);
    setEditingCourse(null);
  } catch (error) {
    console.error("Error updating course:", error);
  }
};

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
                 <div className="flex gap-3 mt-3">
                    <button 
                      key={course._id} 
                      className="flex-1 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700" 
                      onClick={() => handleEditClick(course)}
                    >
                      Edit Course
                    </button>
                    <button 
                      key={course._id} 
                      className="flex-1 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-red-700" 
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      Delete Course
                    </button>
                 </div>
                </div>
              </article>
            ))}
          </div>

      
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

           
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image (Optional)
                </label>
                {editFormData.image ? (
                  <p className="text-sm text-gray-600 mb-2">New image selected: {editFormData.image.name}</p>
                ) : (
                  <div className="mb-2">
                    <img src={editingCourse.image} alt="Current" className="w-32 h-24 object-cover rounded" />
                    <p className="text-sm text-gray-600 mt-1">Current image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lectures</h3>
                {editFormData.lectures.map((lecture, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lecture {index + 1} Title
                      </label>
                      <input
                        type="text"
                        value={lecture.title}
                        onChange={(e) => handleLectureChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lecture {index + 1} Description
                      </label>
                      <textarea
                        value={lecture.description}
                        onChange={(e) => handleLectureChange(index, 'description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lecture {index + 1} Video (Optional)
                      </label>
                      {lecture.video ? (
                        <p className="text-sm text-gray-600 mb-2">New video selected: {lecture.video.name}</p>
                      ) : (
                        <p className="text-sm text-gray-600 mb-2">Current video will be kept if not changed</p>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleLectureVideoChange(index, e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Mycourses
