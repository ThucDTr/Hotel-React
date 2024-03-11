import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import RoomFilter from '../common/RoomFilter'
import RoomPaginator from '../common/RoomPaginator'
import { deleteRoom, getAllRooms } from '../utils/ApiFunction'
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom'

const ExistingRoom = () => {
  const [rooms, setRooms] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage, setRoomsPerPage] = useState(8)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredRooms, setFilteredRooms] = useState([])
  const [selectedroomType, setSelectedRoomType] = useState("")
  const [successMessage, setSusccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetchRooms()
    }, [])
  const fetchRooms = async () => {
     setIsLoading(true)
     try {
        const result = await getAllRooms()
        setRooms(result)
        setIsLoading(false)
     } catch (error) {
        setErrorMessage(error.message)
     }
  }

  useEffect(() => {
    if(selectedroomType === ""){
        setFilteredRooms(rooms)
    }else{
        const filtered = rooms.filter((room) => room.type === selectedroomType)
        setFilteredRooms(filtered)
    }
    setCurrentPage(1)
  }, [rooms, selectedroomType])

  const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
    const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length
    return Math.ceil(totalRooms / roomsPerPage)
  }

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDelete = async(roomId) => {
    try {
        const result = await deleteRoom(roomId)
        if(result === ""){
            setSusccessMessage(`Room No ${roomId} was delete`)
            fetchRooms()
        }else{
            console.error(`Error deleting room : ${result.message}`)
        }
    } catch (error) {
        setErrorMessage(error.message)
    }
    setTimeout(() => {
        setSusccessMessage("")
        setErrorMessage("")
    }, 3000)
  }

  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirtRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = filteredRooms.slice(indexOfFirtRoom, indexOfLastRoom)
  return (
    <>
        {isLoading ? (
            <p>Losading existing rooms</p>
        ): (
            <>
                <section className="mt-5 mb-5 container">
                    <div className="d-flex justify-content-center mb-3 mt-5">
                        <h2>Existing Rooms</h2>

                    </div>
                    <Row>
                        <Col md={6} className="mb-3 mb-md-0">
                            <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
                        </Col>
                        
                        <Col md={6} className="d-flex justify-content-end">
                            <Link to={"/add-room"}>
                                <FaPlus /> Add New Room
                            </Link>
                        </Col>
                    </Row>

                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr className="text-center">
                                <th>ID</th>
                                <th>Room Type</th>
                                <th>Room Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRooms.map((room) => (
                                <tr key={room.id} className="text-center">
                                    <td>{room.id}</td>
                                    <td>{room.roomType}</td>
                                    <td>{room.roomPrice}</td>
                                    <td className="gap-2">
                                        <Link to={`/edit-room/${room.id}`}>
                                            <span className="btn btn-info btn-sm">
                                                <FaEye />
                                            </span>
                                            <span className="btn btn-warning btn-sm">
                                                <FaEdit />
                                            </span>
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(room.id)}
                                        >
                                           <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <RoomPaginator
                        currentPage={currentPage}
                        totalPage={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
                        onPageChange={handlePaginationClick}
                    />
                </section>
            </>
        )
        }
    </>
  )
}

export default ExistingRoom