# Mlimi Anyamuke Initiative

Digital Agricultural Advisory Platform for Malawian Farmers

## About

Mlimi Anyamuke Initiative provides digital agricultural advisory and consultancy services for Malawian farmers. The platform offers expert guidance, weather alerts, personalized crop recommendations, and connects farmers with agricultural consultants.

## Project info

**URL**: https://mlimianyamuke.mw

## Setup & Development

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Weatherbit API key (get from [weatherbit.io](https://www.weatherbit.io/))

### Frontend Setup

```sh
# Clone the repository
git clone https://github.com/KizioTech/mlimianyamuke.git
cd mlimianyamuke

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your API keys
# REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_key_here

# Start development server
npm run dev
```

### Backend Setup

```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the API server
npm start
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:8081`.

### API Keys Required

1. **Weatherbit API Key**: Sign up at [weatherbit.io](https://www.weatherbit.io/) and get a free API key (500 calls/day free tier)
2. **Web3Forms Key** (optional): For fallback contact form handling from [web3forms.com](https://web3forms.com/)
3. **Africa's Talking API** (optional): For SMS services in Malawi from [africastalking.com](https://africastalking.com/)

### Environment Variables

Create `.env` file in the root directory:

```env
REACT_APP_WEATHERBIT_API_KEY=your_weatherbit_key_here
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WHATSAPP_NUMBER=265999000000
REACT_APP_WEB3FORMS_KEY=your_web3forms_key_here
```

## Features

- **Real-time Weather Data**: Integrated with Weatherbit API for accurate Malawi weather
- **Farmer Registration**: 5-step registration with validation
- **Contact Forms**: Functional contact and registration forms
- **SMS Alerts**: Integration ready for Africa's Talking SMS service
- **Market Prices**: Agricultural commodity price tracking
- **Voice Alerts**: Accessibility features for audio notifications
- **Translation Services**: Enhanced language support
- **Analytics Tracking**: User interaction and engagement tracking
- **Bilingual Support**: English and Chichewa languages
- **Mobile Optimized**: Responsive design for rural connectivity
- **Offline Ready**: Service worker and caching capabilities

## API Endpoints

The backend provides the following APIs:

### Core APIs
- `POST /api/contact` - Contact form submissions
- `POST /api/register` - Farmer registrations
- `POST /api/analytics` - Analytics events
- `GET /api/health` - Server health check

### Communication APIs
- `POST /api/send-sms` - SMS alerts via Africa's Talking
- `POST /api/voice-alert` - Voice call alerts for accessibility

### Data APIs
- `GET /api/market-prices` - Agricultural commodity prices
- `POST /api/translate` - Text translation between languages

### Weather API
- Integrated with Weatherbit API for real-time weather data
- Supports all 28 Malawi districts with accurate local forecasts

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To deploy this project, first build it for production:

```sh

npm run build

```

Then deploy the generated `dist` folder to your preferred hosting service such as Vercel, Netlify, or GitHub Pages.

## Can I connect a custom domain?

Yes, you can connect a custom domain through your hosting provider. The project is configured with the canonical URL https://mlimianyamuke.mw

Configure DNS settings according to your hosting service's documentation.
# mlimianyamuke
