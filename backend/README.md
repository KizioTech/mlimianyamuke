# Mlimi Anyamuke Backend API

A Node.js/Express backend API for the Mlimi Anyamuke Initiative agricultural advisory platform.

## Features

- **Contact Form API**: Handles contact form submissions
- **Farmer Registration API**: Processes farmer registrations
- **Analytics API**: Tracks user interactions
- **Health Check**: API status monitoring
- **CORS Support**: Cross-origin requests enabled
- **Security**: Helmet.js for security headers

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status and uptime

### Contact Form
- **POST** `/api/contact`
- Body: `{ name, email, phone, message, language, timestamp }`
- Logs contact form submissions

### Farmer Registration
- **POST** `/api/register`
- Body: `{ phone, name, district, crop, alertMethod, language, timestamp }`
- Logs farmer registrations

### Analytics
- **POST** `/api/analytics`
- Body: `{ name, properties, timestamp }`
- Logs analytics events

### SMS Alerts
- **POST** `/api/send-sms`
- Body: `{ phone, message, language }`
- Sends SMS alerts via Africa's Talking (integration ready)

### Voice Alerts
- **POST** `/api/voice-alert`
- Body: `{ phone, message, language }`
- Voice call alerts for accessibility (integration ready)

### Market Prices
- **GET** `/api/market-prices`
- Returns current agricultural commodity prices
- Mock data currently, ready for real market data integration

### Translation
- **POST** `/api/translate`
- Body: `{ text, from, to }`
- Translates between English and Chichewa (mock implementation)

## Example Usage

### Contact Form Submission
```javascript
fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Banda',
    email: 'john@example.com',
    phone: '+265999123456',
    message: 'Interested in your services',
    language: 'en',
    timestamp: new Date().toISOString()
  })
});
```

### Farmer Registration
```javascript
fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+265999123456',
    name: 'John Banda',
    district: 'Lilongwe',
    crop: 'Maize',
    alertMethod: 'sms',
    language: 'en',
    timestamp: new Date().toISOString()
  })
});
```

## Deployment

The backend can be deployed to services like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2

Make sure to set the `PORT` environment variable in production.

## Development

- Uses Express.js for the web framework
- CORS enabled for frontend communication
- Helmet.js for security headers
- dotenv for environment variable management