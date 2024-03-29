import React, { useState } from "react";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunction";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    roomResponse: { id: "" },
    bookingConfirmationCode: "",
    roomNNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuest: "",
  });

  const clearFindBookings = {
    id: "",
    roomResponse: { id: "" },
    bookingConfirmationCode: "",
    roomNNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuest: "",
  };

  const [isDeleted, setIsDeleted] = useState(false);

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
    } catch (error) {
      setBookingInfo(clearFindBookings);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.response);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingInfo.id);
      setIsDeleted(true);
      setBookingInfo(clearFindBookings);
      setSuccessMessage("Booking has been cancelled successfully.");
      setConfirmationCode("");
      setError("");
    } catch (error) {
      setError(error.message);
    }

    setTimeout(() => {
      setIsDeleted(false);
      setSuccessMessage("")
    }, 2000)
  };
  return (
    <>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2>Find My Booking </h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              id="confirmationcode"
              name="confirmationcode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter the booking confirmation code"
            />
            <button className="btn btn-hotel input-group-text">
              Find Booking
            </button>
          </div>
        </form>
        {isLoading ? (
          <div>Find Booking confirmation code</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : bookingInfo.bookingConfirmationCode ? (
          <div className="col-md-6 mt-4 mb-5">
            <h3>Booking information</h3>
            <p>
              Booking confirmation code: {bookingInfo.bookingConfirmationCode}
            </p>
            <p>Booking Id: {bookingInfo.id}</p>
            <p>Room Number: {bookingInfo.roomResponse.id}</p>
            <p>Check In Date: {bookingInfo.checkInDate}</p>
            <p>Check out Date: {bookingInfo.checkOutDate}</p>
            <p>Full Name: {bookingInfo.guestFullName}</p>
            <p>Email Address: {bookingInfo.guestEmail}</p>
            <p>Adults: {bookingInfo.numOfAdults}</p>
            <p>Children: {bookingInfo.numOfChildren}</p>
            <p>Total Guest: {bookingInfo.totalNumOfGuest}</p>
            {!isDeleted && (
              <button
                onClick={() => handleBookingCancellation(bookingInfo.id)}
                className="btn btn-danger"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ) : (
          <div>find booking...</div>
        )}
        {isDeleted && (
          <div className="alert alert-success mt-3 fade show">
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default FindBooking;
