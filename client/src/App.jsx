import React from 'react'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import ProtectRoute from './Protected'
import Createcourse from './Pages/Createcourse'
import Onlyinstructor from './Onlyinstructor'
import Mycourses from './Pages/Mycourses'
import Buycourse from './Pages/Buycourse'
import Viewcourse from './Pages/Viewcourse'
import Beinstructor from './Pages/Beinstructor'
import Admin from './Pages/Admin'
import OnlyAdmin from './OnlyAdmin'
import Verifyemail from './Pages/Verifyemail'
import Studentcourses from './Pages/Studentcourses'
const App = () => {
  return (
      <div>
        <Routes>
          <Route path='/login' Component={Login}></Route>
          <Route path='/signup' Component={Signup}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/createcourse' element={<Onlyinstructor><Createcourse /></Onlyinstructor>}></Route>
          <Route path='/my-courses' element={<Onlyinstructor><Mycourses /></Onlyinstructor>}></Route>
          <Route path='/buycourse/:id' element={<ProtectRoute><Buycourse /></ProtectRoute>}></Route>
          <Route path='/viewcourse/:id' element={<Viewcourse />}></Route>
          <Route path='/beinstructor' element={<ProtectRoute><Beinstructor /></ProtectRoute>}></Route>
          <Route path='/admin' element={<OnlyAdmin><Admin /></OnlyAdmin>}></Route>
          <Route path='/verifyemail' element={<Verifyemail></Verifyemail>}></Route>
          <Route path='/studentcourses' element={<ProtectRoute><Studentcourses></Studentcourses></ProtectRoute>}></Route>
        </Routes>
      </div>
  )
}

export default App
