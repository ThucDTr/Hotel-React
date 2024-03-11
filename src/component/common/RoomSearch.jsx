import moment from 'moment'
import React, { useState } from 'react'
import { getAvailableRooms } from '../utils/ApiFunction'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import RoomTypeSelector from './RoomTypeSelector'
import RoomSearchResult from './RoomSearchResult'

const RoomSearch = () => {
  const [searchQuery, setSearchQuery] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomType: ""
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableRooms, setAvailableRoom] = useState([])

  const hanldeSearch = (e) => {
    e.preventDefault()
    const checkInMoment = moment(searchQuery.checkInDate)
    const checkOutMoment = moment(searchQuery.checkOutDate)
    if(!checkInMoment.isValid() || !checkOutMoment.isValid()){
        setErrorMessage("Please enter valid date")
        return
    }
    if(!checkOutMoment.isSameOrAfter(checkInMoment)){
        setErrorMessage("check out date must be after check in date")
        return
    }
    setIsLoading(true)
    getAvailableRooms(searchQuery.checkInDate, searchQuery.checkOutDate, searchQuery.roomType)
        .then((response) => {
            setAvailableRoom(response.data)
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setIsLoading(false)
        })
  }

  const hanldeInputChange = (e) => {
    const {name, value} = e.target
    setSearchQuery({ ...searchQuery, [name]: value})
    const checkInDate = moment(searchQuery.checkInDate)
    const checkOutDate = moment(searchQuery.checkOutDate)
    if(checkInDate.isValid() && checkOutDate.isValid()){
        setErrorMessage("")
    }
  }

  const hanldeClearSearch = () => {
    setSearchQuery({
      checkInDate: "",
      checkOutDate: "",
      roomType: ""
    })
    setAvailableRoom([])
  }
  return (
    <>
        <Container className='shadow mt-n5 mb-5 py-5'>
            <Form onSubmit={hanldeSearch}>
                <Row className="justify-content-center">
                    <Col xs={12} md={3}>
                        <Form.Group controlId="checkInDate">
                            <Form.Label>Check In Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkInDate"
                                value={searchQuery.checkInDate}
                                onChange={hanldeInputChange}
                                min={moment().format("yyyy-MM-dd")}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
							<Form.Group controlId="checkOutDate">
								<Form.Label>Check-out Date</Form.Label>
								<Form.Control
									type="date"
									name="checkOutDate"
									value={searchQuery.checkOutDate}
									onChange={hanldeInputChange}
									min={moment().format("yyyy-MM-dd")}
								/>
							</Form.Group>
					</Col>
                    <Col xs={12} md={3}>
							<Form.Group controlId="roomType">
								<Form.Label>Room Type</Form.Label>
								<div className="d-flex">
									<RoomTypeSelector
										handleRoomInputChange={hanldeInputChange}
										newRoom={searchQuery}
									/>
									<Button variant="secondary" type="submit" className="ml-2">
										Search
									</Button>
								</div>
							</Form.Group>
					</Col>
                </Row>
            </Form>
            {isLoading ? (
					<p className="mt-4">Finding availble rooms....</p>
				) : availableRooms ? (
					<RoomSearchResult results={availableRooms} onClearSearch={hanldeClearSearch} />
				) : (
					<p className="mt-4">No rooms available for the selected dates and room type.</p>
				)}
			{errorMessage && <p className="text-danger">{errorMessage}</p>}
        </Container>
    </>
  )
}

export default RoomSearch