# TuniStudent - Project Management Scripts

This document explains all the available scripts to manage your TuniStudent project.

## 📋 Available Scripts

### 1. **run_all.bat** ⭐ MAIN SCRIPT
**Purpose:** Complete startup script that runs the entire TuniStudent project.

**What it does:**
- ✅ Checks prerequisites (Docker, Maven, Node.js)
- ✅ Starts Docker services (Keycloak + PostgreSQL)
- ✅ Starts Discovery Server (Eureka)
- ✅ Starts API Gateway
- ✅ Starts all microservices (User, Deal, Notification, Backend)
- ✅ Starts Frontend (Angular)
- ✅ Opens the application in your browser

**Usage:**
```bash
# Double-click the file or run from command line:
run_all.bat
```

**Wait times:**
- Docker services: 20 seconds
- Discovery Server: 20 seconds
- API Gateway: 15 seconds
- Microservices: 20 seconds
- **Total startup time: ~2-3 minutes**

---

### 2. **stop_all.bat**
**Purpose:** Cleanly stops all running TuniStudent services.

**What it does:**
- Stops Docker containers (Keycloak + PostgreSQL)
- Kills all Java processes (Spring Boot microservices)
- Kills all Node.js processes (Angular frontend)

**Usage:**
```bash
stop_all.bat
```

---

### 3. **check_status.bat**
**Purpose:** Check the status of all TuniStudent services.

**What it does:**
- Shows Docker container status
- Checks if Discovery Server is running
- Checks if API Gateway is running
- Checks if Keycloak is running
- Checks if Frontend is running
- Lists all Java and Node processes

**Usage:**
```bash
check_status.bat
```

---

### 4. **rebuild_all.bat**
**Purpose:** Clean build all microservices from scratch.

**What it does:**
- Runs `mvn clean install -DskipTests` on all services
- Builds: Discovery Server, API Gateway, User Service, Deal Service, Notification Service, Backend
- Shows progress and error handling

**Usage:**
```bash
# Run this when you make code changes to any microservice:
rebuild_all.bat
```

**When to use:**
- After making code changes to any microservice
- After pulling updates from Git
- When you encounter build-related issues

---

### 5. **start_microservices.bat** (Legacy)
**Purpose:** Starts microservices only (without build checks).

**Note:** Use `run_all.bat` instead for a better experience.

---

### 6. **start_project.bat** (Legacy)
**Purpose:** Simple startup script for backend + frontend only.

**Note:** Use `run_all.bat` instead for the complete microservices architecture.

---

## 🚀 Quick Start Guide

### First Time Setup
1. Make sure Docker Desktop is running
2. Make sure you have Maven and Node.js installed
3. Run the build script first:
   ```bash
   rebuild_all.bat
   ```
4. Then start everything:
   ```bash
   run_all.bat
   ```

### Daily Development Workflow
1. Start your day:
   ```bash
   run_all.bat
   ```

2. Make code changes as needed

3. If you changed microservice code, rebuild:
   ```bash
   stop_all.bat
   rebuild_all.bat
   run_all.bat
   ```

4. End your day:
   ```bash
   stop_all.bat
   ```

### Troubleshooting
1. Check what's running:
   ```bash
   check_status.bat
   ```

2. If services won't start:
   ```bash
   stop_all.bat
   # Wait a few seconds
   run_all.bat
   ```

3. If you have errors, try a clean build:
   ```bash
   stop_all.bat
   rebuild_all.bat
   run_all.bat
   ```

---

## 🌐 Service URLs

After running `run_all.bat`, access these URLs:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:4200 | Main application UI |
| **API Gateway** | http://localhost:8080 | API entry point |
| **Discovery Server** | http://localhost:8761 | Service registry (Eureka) |
| **Keycloak Admin** | http://localhost:8081 | Auth server (admin/admin) |

### Backend APIs (via Gateway)
- User Service: `http://localhost:8080/api/users`
- Deal Service: `http://localhost:8080/api/deals`
- Notification Service: `http://localhost:8080/api/notifications`

---

## ⚙️ System Requirements

- **Docker Desktop** (running)
- **Java 17+** (with Maven)
- **Node.js 16+** (with npm)
- **Windows 10/11**

---

## 📝 Notes

- Each service opens in its own colored terminal window for easy identification
- Check the Discovery Server (http://localhost:8761) to verify all services are registered
- Docker containers persist data - use `docker-compose down -v` to reset everything
- The first startup may take longer while Docker pulls images

---

## 🐛 Common Issues

### "Docker is not running"
→ Start Docker Desktop and wait for it to fully initialize

### "Port already in use"
→ Run `stop_all.bat` to clean up existing processes

### Services show in Discovery but don't respond
→ Wait longer (services can take 1-2 minutes to fully initialize)
→ Check individual service terminal windows for errors

### Frontend build fails
→ Delete `frontend/node_modules` and run `npm install` in the frontend directory

---

## 📦 Project Structure

```
TuniStudent/
├── run_all.bat          ⭐ Main startup script
├── stop_all.bat         🛑 Stop all services
├── check_status.bat     🔍 Check service status
├── rebuild_all.bat      🔨 Rebuild all microservices
├── docker-compose.yml   🐳 Docker configuration
├── discovery-server/    📡 Eureka service registry
├── api-gateway/         🚪 API Gateway
├── user-service/        👤 User microservice
├── deal-service/        💰 Deal microservice
├── notification-service/📬 Notification microservice
├── backend/            🖥️ Main backend service
└── frontend/           🎨 Angular frontend
```

---

**Happy Coding! 🚀**
