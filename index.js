const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WELLCOME TO ROOM BOOKING");
});

const room = [];
const booking = [];

//1. Creating a room:
app.post("/room", (req, res) => {
  const { AvailableSeates, amenities, pricePerHour } = req.body;
  const roomId = room.length + 1;
  const newRoom = {
    roomId,
    AvailableSeates,
    amenities,
    pricePerHour,
    booking: [],
  };
  room.push(newRoom);
  res.status(200).json(newRoom);
});

//2. Creating a booking:
app.post("/booking", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const rooms = room.find((room) => room.roomId === roomId);
  if (!rooms) {
    return res.status(404).json({ message: "Room not found" });
  }
  const bookedDate = rooms.booking.find((book) => book.date === date);
  if (bookedDate) {
    return res.status(404).json({ message: "This date already booked" });
  }
  const bookingId = booking.length + 1;
  const newBooking = {
    bookingId,
    customerName,
    date,
    startTime,
    endTime,
    roomId,
    status: "Booked",
  };
  rooms.booking.push(newBooking);
  booking.push(newBooking);
  res.status(200).json(newBooking);
});

//3. List all rooms with booking data:
app.get("/allrooms", (req, res) => {
  const allrooms = room.map((data) => ({
    RoomName: data.roomId,
    Bookings: data.booking.map((book) => ({
      BookingStatus: book.status,
      CustomerName: book.customerName,
      Date: book.date,
      StartTime: book.startTime,
      EndTime: book.endTime,
    })),
  }));
  res.json(allrooms);
});

//4. List all the customet with booked data:
app.get("/customers", (req, res) => {
  const customers = booking.map((customerData) => ({
    RoomID: customerData.roomId,
    CustomerName: customerData.customerName,
    Date: customerData.date,
    StartTime: customerData.startTime,
    EndTime: customerData.endTime,
  }));
  res.json(customers);
});

//5.List how many time a customer has booked the room with below details:
app.get("/customerDetails/:customerName", (req, res) => {
  const { customerName } = req.params;
  const customerDetails = booking.filter(
    (book) => book.customerName === customerName
  );
  const Booking = customerDetails.map((customer) => ({
    CustomerName: customer.customerName,
    RoomID: customer.roomId,
    Date: customer.date,
    StartTime: customer.startTime,
    EndTime: customer.endTime,
    BookingID: customer.bookingId,
    BookingDate: customer.date,
    BookingStatus: customer.status,
  }));
  res.json(Booking);
});

app.listen(PORT, () => {
  console.log(`server started on the port number ${PORT}`);
});
