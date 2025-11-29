# 🎓 TuniStudent

> A comprehensive platform helping Tunisian students discover the best local deals across 24 cities

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![Keycloak](https://img.shields.io/badge/Keycloak-24.0.1-blue.svg)](https://www.keycloak.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## 🌟 Overview

TuniStudent is a full-stack microservices application designed to help Tunisian students discover and access exclusive deals from local businesses across Tunisia's 24 cities. The platform provides a seamless experience for students to browse deals, make reservations, and interact with businesses.

## ✨ Features

### For Students
- 🔐 **Secure Authentication** - OAuth2/OIDC via Keycloak
- 🏙️ **City-Based Deals** - Browse deals across 24 Tunisian cities
- 🏷️ **Category Filtering** - Find deals by category (food, entertainment, education, etc.)
- ⭐ **Ratings & Reviews** - Rate and review deals
- ❤️ **Favorites** - Save your favorite deals
- 📅 **Reservations** - Book deals directly through the platform
- 💬 **Real-time Chat** - Communicate with businesses
- 🔔 **Notifications** - Get notified about new deals and updates
- 🌙 **Dark Mode** - Modern glassmorphism UI with dark theme support

### For Administrators
- 📊 **Admin Dashboard** - Comprehensive admin panel
- 🛠️ **Deal Management** - CRUD operations for deals
- 📂 **Category Management** - Manage deal categories
- 🤖 **AI Moderation** - Automatic content moderation for comments
- 👥 **User Management** - Manage user accounts and roles
- 📈 **Analytics** - Track platform usage and statistics

## 🏗️ Architecture

TuniStudent follows a **microservices architecture** with the following components:

```
┌─────────────┐
│   Angular   │
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────────┐
│  API Gateway    │
│   (Port 8080)   │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬───────────────┬─────────────┐
    │         │          │               │             │
┌───▼───┐ ┌──▼──┐ ┌─────▼──────┐ ┌──────▼──────┐ ┌───▼────┐
│ User  │ │Deal │ │Notification│ │  Discovery  │ │Keycloak│
│Service│ │Svc  │ │  Service   │ │   Server    │ │  Auth  │
└───────┘ └─────┘ └────────────┘ └─────────────┘ └────────┘
```

### Microservices:
- **Discovery Server** - Service registry (Eureka)
- **API Gateway** - Single entry point, routing, and load balancing
- **User Service** - User management and profiles
- **Deal Service** - Deal listings, categories, and favorites
- **Notification Service** - Real-time notifications and alerts
- **Keycloak** - Authentication and authorization server

## 🛠️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Cloud** - Microservices framework
  - Eureka - Service discovery
  - Gateway - API Gateway
- **Spring Security** - OAuth2 Resource Server
- **Spring Data JPA** - Database ORM
- **MySQL** - Primary database
- **Keycloak** - Identity and access management
- **PostgreSQL** - Keycloak database
- **Maven** - Build tool

### Frontend
- **Angular 17** - Frontend framework (standalone components)
- **TypeScript** - Programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17+**
- **Node.js 18+** and **npm**
- **Maven 3.8+**
- **MySQL 8.0+**
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhiafersi/TuniStudent-.git
cd TuniStudent-
```

### 2. Start Keycloak and PostgreSQL

```bash
docker-compose up -d
```

Keycloak will be available at `http://localhost:8081`
- Admin username: `admin`
- Admin password: `admin`

### 3. Configure Keycloak

1. Access Keycloak admin console: `http://localhost:8081`
2. Create a realm named `tunistudent`
3. Create a client named `tunistudent-app`
4. Configure redirect URIs: `http://localhost:4200/*`
5. Enable standard flow and direct access grants

### 4. Set Up MySQL Database

Create the database:
```sql
CREATE DATABASE tunistudent;
```

### 5. Configure Backend Services

Each microservice needs configuration. Update the `application.properties` in each service:

**MySQL Configuration (User Service, Deal Service, Notification Service):**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tunistudent
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Keycloak Configuration:**
```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8081/realms/tunistudent
```

## ⚙️ Configuration

### Backend Configuration

Create `application.properties` files for each service from the examples provided:

```bash
# For each service
cd backend/src/main/resources
copy application.properties.example application.properties
# Edit with your database credentials
```

### Frontend Configuration

The frontend is pre-configured to connect to:
- Backend API: `http://localhost:8080`
- Keycloak: `http://localhost:8081`

Update `frontend/src/environments/environment.ts` if needed.

## 🎯 Running the Application

### Option 1: Using Batch Scripts (Windows)

**Start all microservices:**
```bash
start_microservices.bat
```

**Start the complete project:**
```bash
start_project.bat
```

### Option 2: Manual Startup

**1. Start Discovery Server:**
```bash
cd discovery-server
mvn spring-boot:run
```
Wait for: `Eureka server started`

**2. Start API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```

**3. Start Microservices:**
```bash
# In separate terminals
cd user-service
mvn spring-boot:run

cd deal-service
mvn spring-boot:run

cd notification-service
mvn spring-boot:run
```

**4. Start Frontend:**
```bash
cd frontend
npm install
npm start
```

### Access the Application

- **Frontend**: http://localhost:4200
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Keycloak Admin**: http://localhost:8081

### Default Users

After the first run, the following test users are seeded:

| Username | Password  | Role    |
|----------|-----------|---------|
| admin    | 12345678  | ADMIN   |
| student  | 12345678  | STUDENT |
| dhia     | 12345678  | STUDENT |

## 📚 API Documentation

API documentation is available via Swagger UI for each service:

- **API Gateway**: http://localhost:8080/swagger-ui/index.html
- **User Service**: http://localhost:8081/swagger-ui/index.html
- **Deal Service**: http://localhost:8082/swagger-ui/index.html
- **Notification Service**: http://localhost:8083/swagger-ui/index.html

## 📁 Project Structure

```
TuniStudent/
├── 📁 api-gateway/              # API Gateway service
├── 📁 discovery-server/         # Eureka service registry
├── 📁 user-service/             # User management microservice
├── 📁 deal-service/             # Deal management microservice  
├── 📁 notification-service/     # Notification microservice
├── 📁 frontend/                 # Angular frontend application
├── 📁 scripts/                  # Utility scripts
├── 📄 docker-compose.yml        # Docker services configuration
├── 📄 start_microservices.bat   # Start all services (Windows)
├── 📄 start_project.bat         # Start complete project (Windows)
├── 📄 rebuild_all.bat           # Rebuild all services (Windows)
└── 📄 README.md                 # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dhia Fersi**
- GitHub: [@dhiafersi](https://github.com/dhiafersi)

## 🙏 Acknowledgments

- Thanks to all Tunisian students who inspired this project
- Spring Boot and Angular communities for excellent documentation
- Keycloak team for the robust authentication solution

---

<div align="center">
  Made with ❤️ for Tunisian Students
</div>
