# Daystar DayCare Management System

## Project Structure
```
DD/
├── backend/
│   ├── config/                   # Database configuration
│   ├── controllers/              # Business logic handlers
│   ├── middleware/               # Authentication middleware
│   ├── models/                   # Database models
│   ├── routes/                   # API endpoint definitions
│   ├── SQL/                      # Database queries
│   ├── utils/                    # Utility functions
│   ├── index.js                  # Backend entry point
│   └── package.json              # Backend dependencies
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images and media
│   │   ├── pages/                # React page components
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # Frontend entry point
│   │   └── index.css             # Global styles
│   └── package.json              # Frontend dependencies
└── Project.pdf                   # Project documentation
```

## Backend API Documentation

### Authentication
- **POST /babySitter/login**: Authenticate babysitters
- **POST /manager/login**: Authenticate managers
- **POST /logout**: End user session

### Babysitter Operations
- **GET /mySchedule**: Get babysitter's schedule
- **POST /createIncident**: Report new incident
- **GET /incidentsReportedByMe**: View reported incidents

### Incident Management
- **POST /createIncident**: Create incident record
- **GET /getAllIncidents**: List all incidents
- **PUT /updateIncident/:id**: Modify incident
- **DELETE /deleteIncident/:id**: Remove incident

### Manager Operations
- **POST /registerBabysitter**: Add new babysitter
- **POST /registerChild**: Add new child
- **GET /babysitters**: List all babysitters
- **GET /children**: List all children
- **PUT /babysitters/:id**: Update babysitter
- **DELETE /children/:id**: Remove child record

### Schedule Management
- **POST /createSchedule**: Create new schedule
- **GET /getAllSchedules**: List all schedules
- **PUT /changeAttendanceStatus/:id**: Update attendance

### Financial Operations
- **POST /createExpense**: Record expense
- **POST /createParentPayment**: Record payment
- **GET /getAllExpenses**: List expenses
- **POST /sendPaymentReminder**: Send payment notification

## Frontend Pages

### Manager Interface
- **ManagerLogin.jsx**: Manager authentication
- **ManagerDashBoard.jsx**: Main management portal with navigation to:
  - Babysitter management
  - Child registration
  - Schedule viewing
  - Incident reports
  - Financial tracking

### Babysitter Interface
- **BabySitterLogin.jsx**: Babysitter authentication
- **BabySitterDashBoard.jsx**: Babysitter portal with:
  - Schedule viewing
  - Incident reporting
  - Payment history

## Dependencies

### Backend
- **express**: Web framework
- **mysql2**: Database driver
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **nodemailer**: Email notifications
- **cors**: Cross-origin support

### Frontend
- **react**: UI framework
- **react-router-dom**: Navigation
- **axios**: HTTP requests
- **react-icons**: UI components
- **tailwindcss**: Styling
- **chart.js**: Data visualization
