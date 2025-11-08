import { createBrowserRouter } from "react-router";
import Dashboard from "../Dashboard/Dashboard";
import Root from "../Root/Root";
import BookingList from "../Booking/BookingList";
import Home from "../Home";
import RoomBook from "../Booking/BookingForm";
import BookingForm2 from "../Booking/BookingForm2";
import BookingForm from "../Booking/BookingForm";

export const router = createBrowserRouter([
  {
    path: "/",
    id: 'root',
    loader: () => fetch('menu.json'),
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,

      },
      {
        path: '/booking-list',
        loader: ()=>fetch('http://localhost:5000/users').then(res=>res.json()),
        Component: BookingList,
      },
      {
        path: 'dashboard',
        Component: Dashboard
      },
      {
        path: 'room-book',
        Component: BookingForm,
      }
    ]
  },
]);