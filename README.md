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

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=daystar_daycare

# Server Configuration 
PORT=3337 or any port of your choice

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173 or http://localhost:5174
```

### Environment Variables Description:

- **Database Configuration**
  - `DB_HOST`: Your MySQL database host
  - `DB_USER`: Database username
  - `DB_PASSWORD`: Database password
  - `DB_NAME`: Database name

- **Server Configuration**
  - `PORT`: Backend server port (default: 3337)

- **JWT Configuration**
  - `JWT_SECRET`: Secret key for JWT token generation
  - `JWT_EXPIRES_IN`: Token expiration time

- **Email Configuration**
  - `EMAIL_HOST`: SMTP server host
  - `EMAIL_PORT`: SMTP server port
  - `EMAIL_USER`: Email address for sending notifications
  - `EMAIL_PASS`: Email app password (for Gmail, use App Password)

- **Frontend Configuration**
  - `FRONTEND_URL`: URL of the frontend application (for CORS)

### Setting Up Email for Notifications

1. Create a Gmail account or use an existing one
2. Enable 2-step verification
3. Generate an App Password:
   - Go to Google Account settings
   - Select 'Security'
   - Under '2-Step Verification', select 'App passwords'
   - Generate a new app password for 'Mail'
4. Use this generated password as `EMAIL_PASS` in your .env file