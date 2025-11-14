import { createBrowserRouter } from "react-router";
import Dashboard from "../Dashboard/Dashboard";
import Root from "../Root/Root";
import BookingList from "../Booking/BookingList";
import Home from "../Home/Home";
import RoomBook from "../Booking/BookingForm";
import BookingForm2 from "../Booking/BookingForm2";
import BookingForm from "../Booking/BookingForm";
import BookingInfo from "../Booking/BookingInfo";
import UpdateBooking from "../Booking/UpdateBooking";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,

      },
      {
        path: '/booking-list',
        Component: BookingList,
      },
      {
        path: 'dashboard',
        Component: Dashboard
      },
      {
        path: 'room-book',
        Component: BookingForm,
      },
      {
        path: '/booking-info/:id',
        Component: BookingInfo
      },
      {
        path: '/update-booking/:id',
        Component: UpdateBooking
      }
    ]
  },
]);