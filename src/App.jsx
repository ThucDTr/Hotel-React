import { useState } from 'react'
import './App.css'
import AddRoom from './component/room/AddRoom'
import ExistingRoom from './component/room/ExistingRoom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './component/home/Home'
import EditRoom from './component/room/EditRoom'
import Navbar from './component/layout/Navbar'
import Footer from './component/layout/Footer'
import RoomListing from './component/room/RoomListing'
import Admin from './component/admin/Admin'
import CheckOut from './component/booking/CheckOut'
import BookingSucces from './component/booking/BookingSucces'
import Bookings from './component/booking/Bookings'
import FindBooking from './component/booking/FindBooking'
import Login from './component/auth/Login'
import Registration from './component/auth/Registration'
import Profile from './component/auth/Profile'
import Logout from './component/auth/Logout'
import RequireAuth from './component/auth/RequireAuth'
import { AuthProvider } from './component/auth/AuthProvider'
function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <main>
          <Router>
              <Navbar />
              <Routes>
                  <Route path="/" element = {<Home />} />
                  <Route path="/edit-room/:roomId" element = {<EditRoom />} />
                  <Route path="/existing-rooms" element = {<ExistingRoom />} />
                  <Route path="/add-room" element = {<AddRoom />} />
                  <Route path="/book-room/:roomId"
                    element = {
                      <RequireAuth>                     
                        <CheckOut />
                      </RequireAuth>
                    }
                   />
                  <Route path="/booking-success" element = {<BookingSucces />} />
                  <Route path="/browse-all-rooms" element = {<RoomListing />} />
                  <Route path="/admin" element = {<Admin />} /> 
                  <Route path="/existing-bookings" element = {<Bookings />} /> 
                  <Route path="/find-booking" element = {<FindBooking />} />
                  <Route path="/login" element = {<Login />} />    
                  <Route path="/register" element = {<Registration />} /> 
                  <Route path="/profile" element = {<Profile />} />
                  <Route path="/logout" element = {<Logout />} />                                                    
              </Routes>
          </Router>
          <Footer />
      </main>
    </AuthProvider>
  )
}

export default App
