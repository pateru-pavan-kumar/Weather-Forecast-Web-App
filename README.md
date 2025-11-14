# 🌦️ Weather Forecast Web App

A clean and responsive weather dashboard that shows **current weather** and a **3-day forecast**, powered by the **OpenWeatherMap API**.  
Live Demo: https://pateru-pavan-kumar.github.io/Weather-Forecast-Web-App/

---

## 🚀 Features
- Search weather by city name  
- Current temperature, humidity, wind speed, pressure  
- 3-day forecast with icons and min/max temperatures  
- Dynamic background themes (Clear, Clouds, Rain, Storm, Night)  
- Responsive UI (mobile friendly)  
- Built using HTML, CSS, and Vanilla JavaScript (no frameworks)

---

## 🛠️ Tech Stack
- **HTML5**
- **CSS3 / Custom animations**
- **JavaScript (ES6)**
- **OpenWeatherMap API**

---

## 📂 Project Structure
Weather-Forecast/
│── index.html
│── style.css
│── script.js
│── README.md


---

## ⚙️ How to Run Locally

1. Clone the repository
git clone https://github.com/<your-username>/Weather-Forecast.git
cd Weather-Forecast
2. Open the project
Just open index.html in your browser
OR
Run a local server:
python -m http.server 8000
Then visit:
http://localhost:8000

---

## 🔑 API Key Setup (Important)
This project uses OpenWeatherMap API.
Get your API key from: https://openweathermap.org/api
Open script.js
Replace this line:
const API_KEY = "YOUR_API_KEY_HERE";

---

## 📘 How It Works
Converts city name → latitude/longitude using Geocoding API
Gets weather details using:
/weather
/forecast (5-day, 3-hour interval)
Filters future dates → shows next 3 calendar days
Applies dynamic background based on weather + time of day

---

## 📤 Deployment (GitHub Pages)
Push your code to GitHub
Go to: Settings → Pages
Select branch: main and folder: /
Save
Your site will go live in a few seconds.

---

## ⭐ Future Enhancements
Add °C / °F toggle
Add hourly forecast
Add air quality index
Move API calls to backend/serverless (hide API key)
Better animations for different weather conditions
