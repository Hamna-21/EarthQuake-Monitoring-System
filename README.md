# 🌍 Earthquake Monitoring System

<div align="center">

<img width="947" height="402" alt="Earthquake Monitoring System" src="https://github.com/user-attachments/assets/6b974e22-2f07-4f39-af91-56306d306ca6" />

### Real-Time Monitoring • Interactive Maps • Historical Analytics • AI

**A full-stack earthquake monitoring platform built to turn live and historical seismic data into clear, interactive, and useful insights.**

<br />

<a href="#-features">
<img src="https://img.shields.io/badge/Features-Explore-6A11CB?style=for-the-badge" />
</a>

<a href="#-technology-stack">
<img src="https://img.shields.io/badge/Stack-Full--Stack-2575FC?style=for-the-badge" />
</a>

<a href="#-getting-started">
<img src="https://img.shields.io/badge/Setup-Get%20Started-00A8FF?style=for-the-badge" />
</a>

</div>

---

## 🌎 About the Project

The **Earthquake Monitoring System** is a full-stack web application designed to make earthquake information easier to monitor, explore, and understand.

Instead of presenting raw seismic data, the system transforms earthquake events into **interactive maps, visual analytics, historical insights, alerts, and AI-assisted information.**

It combines real-time data processing, geographic visualization, analytics, authentication, and AI into a single platform.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🌐 Live Earthquake Monitoring

Monitor recent earthquake activity using live seismic data and automatically updated feeds.

</td>

<td width="50%">

### 🗺️ Interactive Global Map

Explore earthquake locations, magnitude, depth, and geographic distribution through an interactive map.

</td>
</tr>

<tr>
<td width="50%">

### 🌍 3D Earth Visualization

Visualize global seismic activity through an interactive 3D globe.

</td>

<td width="50%">

### 📊 Historical Analytics

Analyze earthquake activity across different dates, magnitudes, depths, and regions.

</td>
</tr>

<tr>
<td width="50%">

### 🇵🇰 Pakistan Analytics

Explore historical earthquake activity specifically across Pakistan.

</td>

<td width="50%">

### 📍 Location Analysis

Investigate earthquake activity for selected geographic locations and regions.

</td>
</tr>

<tr>
<td width="50%">

### 🤖 GeoBot AI Assistant

An AI-powered assistant that helps users understand earthquake information and seismic concepts.

</td>

<td width="50%">

### 🚨 Alerts & Safety

Highlight important seismic events and provide earthquake preparedness and safety information.

</td>
</tr>
</table>

---

## 🧠 How It Works

```text
                 🌎 EARTHQUAKE DATA
                        │
                        ▼
              ┌───────────────────┐
              │   Data Ingestion   │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │ Data Processing & │
              │   Normalization   │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │ Cache & Request   │
              │    Optimization   │
              └─────────┬─────────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       ┌─────────────┐       ┌─────────────┐
       │ REST API    │       │  Analytics  │
       │   Backend   │       │   Services  │
       └──────┬──────┘       └──────┬──────┘
              │                     │
              └──────────┬──────────┘
                         ▼
               ┌───────────────────┐
               │ React + TypeScript│
               │     Frontend      │
               └─────────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Live Feed       Maps          Analytics
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  🤖 GeoBot + Alerts
```

---

## 🏗️ System Architecture

The application follows a full-stack architecture separating the frontend, backend, data services, analytics, and visualization layers.

```text
┌────────────────────────────────────────────────────┐
│                  FRONTEND                          │
│                                                    │
│ React • TypeScript • Vite • Ant Design • Tailwind │
│ Leaflet • React Globe • Recharts • Framer Motion  │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                   BACKEND                          │
│                                                    │
│ Node.js • Express • REST APIs • Authentication    │
│ Caching • Request Optimization • Data Services   │
└───────────────────────┬────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│                 DATA LAYER                         │
│                                                    │
│ USGS Earthquake Data • MongoDB • Analytics        │
└────────────────────────────────────────────────────┘
```

---

## ⚡ Engineering Highlights

### 🚀 Performance Optimization

The system was designed to avoid unnecessary API traffic and expensive frontend operations.

* Response caching
* Request deduplication
* Request-budget protection
* Silent background polling
* Optimized API communication
* Reusable data services
* Route-level code splitting

---

### 🌐 Advanced Visualization

The system combines multiple visualization techniques to make seismic information easier to understand.

* Interactive 2D maps
* 3D Earth visualization
* Earthquake markers
* Magnitude visualization
* Depth visualization
* Historical charts
* Regional analytics

---

### 📱 Responsive & Zoom-Resilient UI

The interface was engineered to remain usable across different screen sizes and browser zoom levels.

Special handling was added for:

* Browser zoom up to **300%**
* Responsive layouts
* Content overflow
* Card and grid wrapping
* Map resizing
* 3D globe resizing
* Modal viewport containment
* Chromium backdrop-filter rendering issues

---

## 🤖 AI-Powered GeoBot

**GeoBot** brings an intelligent layer to the Earthquake Monitoring System.

It helps users understand:

* 🌋 Earthquake terminology
* 📊 Magnitude and depth
* 🌎 Seismic patterns
* 🛡️ Earthquake safety
* 📍 Monitoring information
* 🧠 General earthquake concepts

The purpose is simple:

> **Make complex earthquake information easier to understand.**

---

## 🛡️ Safety Hub

The Safety Hub provides practical earthquake preparedness information.

### Before an Earthquake

* Prepare emergency supplies
* Identify safe areas
* Create an emergency plan

### During an Earthquake

* Drop
* Cover
* Hold On
* Stay away from dangerous objects and structures

### After an Earthquake

* Check for injuries
* Expect possible aftershocks
* Avoid damaged buildings
* Follow official emergency information

---

## 🛠️ Technology Stack

<div align="center">

### Frontend

<img src="https://skillicons.dev/icons?i=react,ts,js,html,css,tailwind,vite" />

### Backend & Database

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,mysql" />

### Visualization

<img src="https://skillicons.dev/icons?i=threejs" />

### Tools & Development

<img src="https://skillicons.dev/icons?i=git,github,docker,postman" />

</div>

### Core Technologies

| Layer              | Technologies                        |
| ------------------ | ----------------------------------- |
| **Frontend**       | React, TypeScript, JavaScript, Vite |
| **UI**             | Ant Design, Tailwind CSS            |
| **Backend**        | Node.js, Express                    |
| **Database**       | MongoDB                             |
| **Maps**           | Leaflet, React Leaflet              |
| **3D**             | React Globe GL, Three.js            |
| **Charts**         | Recharts                            |
| **Animation**      | Framer Motion, GSAP                 |
| **Authentication** | JWT, Google OAuth                   |
| **AI**             | Google Gemini                       |
| **Development**    | Git, GitHub, Docker, Postman        |

---

## 📂 Project Structure

```text
Earthquake-Monitoring-System/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── styles/
│   │
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── utils/
│   │
│   └── ...
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Earthquake-Monitoring-System
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

Create the required `.env` files for the frontend and backend.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never commit API keys, database credentials, JWT secrets, or other sensitive values to GitHub.

### 4. Run the Application

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
npm run dev
```

---

## 🌎 Data Source

The primary earthquake data source used by the system is the **USGS Earthquake Hazards Program**.

The platform processes publicly available seismic information and transforms it into a format suitable for:

* Monitoring
* Visualization
* Historical analysis
* Geographic exploration
* User-friendly interpretation

> **Disclaimer:** This project is intended for educational, research, and informational purposes. It is **not an official earthquake warning or emergency-response system.**

For emergencies, always rely on official local authorities and emergency-management organizations.

---

## 🎯 What This Project Demonstrates

This project brings together several areas of modern software engineering:

* Full-stack web development
* REST API architecture
* Real-time data handling
* Geographic information visualization
* Data analytics
* Interactive mapping
* 3D WebGL visualization
* AI integration
* Authentication & OAuth
* API caching
* Request optimization
* Responsive UI engineering
* Performance optimization
* Component-based architecture

---

## 🔮 Future Improvements

* 📱 Progressive Web App support
* 🔔 Advanced alert subscriptions
* 📍 Personalized location monitoring
* 📡 Additional seismic data sources
* 🧠 More advanced AI analytics
* 📊 Advanced seismic trend analysis
* 🛰️ Additional geospatial datasets
* 📲 Push notifications
* 🗺️ Advanced earthquake risk visualization

---

## 💡 Why This Project?

The goal wasn't simply to display earthquake data.

The goal was to answer a bigger question:

> **How can raw seismic data become information that people can actually understand and use?**

The Earthquake Monitoring System approaches that problem through:

```text
RAW DATA
   ↓
PROCESSING
   ↓
VISUALIZATION
   ↓
ANALYTICS
   ↓
INTELLIGENCE
   ↓
BETTER UNDERSTANDING
```

---

<div align="center">

## 🌍 Earthquake Monitoring System

### Turning seismic data into understandable insights.

**Built with React • TypeScript • Node.js • MongoDB • Data Visualization • AI**

<br />

⭐ **If you found this project interesting, consider giving it a star!**

</div>
