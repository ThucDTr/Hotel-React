import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import { getRoomById, updateRoom } from '../utils/ApiFunction'

const EditRoom = () => {
  const [room, setRoom] = useState(
    {
        photo: null,
        roomType:"",
        roomPrice: ""
    }
  )

  const [imagePreview, setImagePreview] = useState("")
  const [susccessMessage, setSusccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const {roomId} = useParams()

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    setRoom({...room, photo: selectedImage})
    setImagePreview(URL.createObjectURL(selectedImage))
  }

  const handleInputChange = (e) => {
    const{name, value}= e.target
    setRoom({
      ...room,
        [name]: value
    })
}

useEffect(() => {
  const fetchRooms = async () => {
    try {
       const roomData = await getRoomById(roomId)
       setRoom(roomData)
       setImagePreview(roomData.photo)
    } catch (error) {
      console.error(error)
    }
  }
  
  fetchRooms()
  }, [roomId])


const handleSubmit = async(e) => {
  e.preventDefault()
  try {
      const response = await updateRoom(roomId, room.roomType, room.roomPrice)
      if(response.status === 200){
          setSusccessMessage("Room updated successfully!")
          const updateRoomData = await getRoomById(roomId)
          setRoom(updateRoomData)
          setImagePreview(updateRoomData.photo)
          setErrorMessage("")
      } else(
          setErrorMessage("Error updating room")
      )
  } catch (error) {
    console.error(error)
    setErrorMessage(error.message)
  }
}

return (
  <>
      <div className="container mt-5 mb-5">
         <h3 className="mt-5 mb-2">Edit Room</h3>
          <div className="row justify-content-center"> 
              <div className="col-md-8 col-lg-6">          
                  {susccessMessage && (
                      <div className="alert alert-success" role="alert">{susccessMessage}</div>
                  )}
                  {errorMessage && (
                      <div className="alert alert-danger" role="alert">{errorMessage}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label htmlFor="roomType" className="form-label hotel-color">Room Type</label>
                          <input type="text"
                              className="form-control"
                              id="roomType"
                              name="roomType"
                              value={room.roomType}
                              onChange={handleInputChange}
                          />
                      </div>

                      <div className="mb-3">
                          <label htmlFor="roomPrice" className="form-label hotel-color">Room Price</label>
                          <input 
                              type="number" 
                              className="form-control"
                              id= "roomPrice" 
                              name="roomPrice"
                              value={room.roomPrice}
                              onChange={handleInputChange}
                          />
                      </div>

                      <div className="mb-3">
                          <label htmlFor="photo" className="form-label hotel-color">Room Photo</label>
                          <input 
                              required
                              type="file" 
                              name="photo" 
                              id="photo" 
                              className="form-control"
                              onChange={handleImageChange}
                          />
                          {imagePreview && (
                              <img src={`data:image/jpg;base64, ${imagePreview}`} 
                              alt="Room Preview"
                              style={{maxWidth: "400px", maxHeight: "400px"}}
                              className="mt-3"
                              />
                          )}
                      </div>
                      <div className="d-grid gap-2 d-md-flex mt-2">
                          <Link to={"/existing-rooms"} className="btn btn-outline-info ml-5">
                              Back
                          </Link>
                          <button className="btn btn-outline-warning" type="submit">
                              Edit Room
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </>
)
}

export default EditRoom