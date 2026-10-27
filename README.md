# Smart Delivery Management Platform

A distributed platform for managing courier and parcel delivery operations. It centralizes shipment management, coordinates the roles involved in a delivery, and improves customer interaction with real-time tracking, map-based delivery points and an AI-powered virtual assistant.

## Features

- **Shipment management:** create shipments and follow them through the delivery lifecycle.
- **Shipment tracking:** visibility into the status of each delivery for the users involved.
- **Role-based interaction:** distinct workflows for the users who take part in a delivery.
- **Map visualization:** delivery points displayed on a map.
- **AI virtual assistant:** conversational support integrated through an external API, so users can get information without navigating complex flows.

## Tech Stack

- **Backend:** Java, Spring Boot, PostgreSQL, SQL
- **Mobile:** React Native, Android Studio, JavaScript
- **DevOps & tooling:** Docker, Git, GitHub

## Architecture

The system is split into a Spring Boot backend that handles delivery workflows, data persistence and integrations, and a mobile client built with React Native that exposes these workflows to users. The AI assistant is connected through an external API and is called from the application logic.

## Getting Started

### Prerequisites

- Java [version]
- Docker and Docker Compose
- Node.js [version] and npm (for the mobile client)
- Android Studio (for running the Android client)

### Backend

```bash
# Start PostgreSQL
docker compose up -d

# Run the Spring Boot application
./mvnw spring-boot:run
```

### Mobile client

```bash
cd [mobile-folder]
npm install
npx react-native run-android
```

### Configuration

Set the following environment variables before starting the backend:

| Variable | Description |
| --- | --- |
| `DB_URL` | PostgreSQL connection URL |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `GEMINI_API_KEY` | API key for the AI assistant |



## Author

**Raul-Gabriel Chiorean**
Software Engineer | Java Backend & Full Stack
[LinkedIn](https://www.linkedin.com/in/raul-chiorean-003039337/)
