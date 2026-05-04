import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Root from "../Root/Root";

// Lazy-loaded components
const Dashboard = lazy(() => import("../Dashboard/Dashboard"));
const BookingList = lazy(() => import("../Booking/BookingList"));
const Home = lazy(() => import("../Home/Home"));
const BookingForm = lazy(() => import("../Booking/BookingForm"));
const BookingInfo = lazy(() => import("../Booking/BookingInfo"));
const UpdateBooking = lazy(() => import("../Booking/UpdateBooking"));

// Fallback loader
const FallbackLoading = () => (
  <div className="flex justify-center items-center h-screen bg-base-200">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>
);

// Wrapper for lazy components
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<FallbackLoading />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: '/booking-list',
        element: (
          <LazyWrapper>
            <BookingList />
          </LazyWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'room-book',
        element: (
          <LazyWrapper>
            <BookingForm />
          </LazyWrapper>
        ),
      },
      {
        path: '/booking-info/:id',
        element: (
          <LazyWrapper>
            <BookingInfo />
          </LazyWrapper>
        ),
      },
      {
        path: '/update-booking/:id',
        element: (
          <LazyWrapper>
            <UpdateBooking />
          </LazyWrapper>
        ),
      }
    ]
  },
]);