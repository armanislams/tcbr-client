
# 🏨 Hotel Booking Management System for


A complete hotel booking management system built using React, Express.js, and MongoDB.
This project allows hotel staff to manage room bookings, customer details, payments, check-in/out dates, extra charges, and more — all through a clean and responsive UI.

## 🚀 Features
✅ Booking Management

Create new bookings

Update existing bookings

Auto-calculate payable amounts

Add dynamic extra charges

Validate required fields

- 🧾 Customer Details

Collect customer info (name, phone, nationality, etc.)

Store and update data cleanly in MongoDB

- 🏠 Layout

Responsive sidebar with auto-collapse on small screens

Full admin layout using Navbar, Sidebar, and Outlet

Toast notifications for all actions

- 💳 Payment Tracking

Paid & Due amounts

Payment status (Paid / Partial / Unpaid)

Editable during update

- 📆 Booking Dates

Manage check-in/check-out date

Validation & conflict handling

Dynamic extra charges module


## 🛠️ Tech Stack
- Frontend

React

React Router

TailwindCSS

React Icons

React Toastify

- Backend

Node.js / Express.js

MongoDB (with native driver)


## ⚙️ Backend API Routes
POST /create-booking

Creates a new booking.

GET /bookings

Fetches all bookings.

PATCH /course/:id

Updates an existing booking:

DELETE /booking/:id

Deletes a booking.

## 🧩 Key Components
BookingForm

Handles multi-section input

Uses reusable <FieldWrapper />

Dynamic extra charges

Automatic resetting using formRef.reset()

UpdateBooking

Shares the same UI as BookingForm

Pre-fills all existing data

Sends patch request to server

Sidebar

Expands on desktop

Automatically collapses on mobile

##📌 To-Do (Future Enhancements)

Role-based authentication (Admin / Staff)

Room availability calendar

PDF invoice generation

Dashboard with charts

Dark mode UI

Online payment integration
## Installation

Install project with npm

git clone <your-repo-url>
cd tcbr-client

## Install dependencies
npm install
npm run dev


## 🧑‍💻 Author

Arman Islam
Built with ❤️ and React.


## License

[MIT](https://choosealicense.com/licenses/mit/)

