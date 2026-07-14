import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import api from '../api'

const Createcourse = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [lectures, setLectures] = useState([{ title: "", description: "", videoFile: null }])
    const [isCreating, setIsCreating] = useState(false)

    const handleLectureChange = (index, field, value) => {
        const updatedLectures = [...lectures]
        updatedLectures[index][field] = value
        setLectures(updatedLectures)
    }

    const addLecture = () => {
        setLectures((prevLectures) => [...prevLectures, { title: "", description: "", videoFile: null }])
    }

    const removeLecture = (indexToRemove) => {
        setLectures((prevLectures) => prevLectures.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isCreating) return

        setIsCreating(true)
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('description', description)
            formData.append('price', Number(price))
            formData.append('lectures', JSON.stringify(lectures.filter((lecture) => lecture.title || lecture.description)))

            if (imageFile) {
                formData.append('image', imageFile)
            }

            lectures.forEach((lecture) => {
                if (lecture.videoFile) {
                    formData.append('lectureVideos', lecture.videoFile)
                }
            })

            await api.post('/course/createcourse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            navigate('/')
        }
        catch (e) {
            window.alert("Error creating course")
            console.log(e)
        }
        finally {
            setIsCreating(false)
            setImageFile(null)
            setTitle('')
            setDescription('')
            setPrice('')
            setLectures([{ title: "", description: "", videoFile: null }])
        }
    }

    return (
        <div>
            <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen py-8">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Course</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input required onChange={(e) => { setImageFile(e.target.files[0]) }} type="file" accept="image/*" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" />
                        <input required onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Title" />
                        <input required onChange={(e) => { setDescription(e.target.value) }} value={description} type="text" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Description" />
                        <input required onChange={(e) => { setPrice(e.target.value) }} value={price} type="number" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Price" />

                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">Lectures</label>
                                <button type="button" onClick={addLecture} className="text-sm text-blue-600 font-medium hover:text-blue-800">
                                    + Add Lecture
                                </button>
                            </div>

                            {lectures.map((lecture, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3 mb-3 bg-gray-50">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-700">Lecture {index + 1}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeLecture(index)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input required={index === 0} onChange={(e) => handleLectureChange(index, 'title', e.target.value)} value={lecture.title} type="text" className="bg-white text-gray-900 border border-gray-200 rounded-md p-2 mb-3 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Lecture Title" />
                                    <input required={index === 0} onChange={(e) => handleLectureChange(index, 'description', e.target.value)} value={lecture.description} type="text" className="bg-white text-gray-900 border border-gray-200 rounded-md p-2 mb-3 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Lecture Description" />
                                    <input onChange={(e) => handleLectureChange(index, 'videoFile', e.target.files[0])} type="file" accept="video/*" className="bg-white text-gray-900 border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className={`mt-4 flex items-center justify-center rounded-md py-2 px-4 font-bold text-white transition ease-in-out duration-150 ${isCreating ? 'cursor-not-allowed bg-indigo-400' : 'bg-blue-500 hover:bg-indigo-600'}`}
                        >
                            {isCreating ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                'Create'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Createcourse
