# Keycloak Setup & User Migration Guide

## Prerequisites
- Docker Desktop installed and running
- Backend and frontend code updated (already done ✓)

## Step 1: Start Keycloak

Open a terminal in the project root (`TuniStudent - Copy (2)`) and run:

```bash
docker compose up -d
```

Wait about 30 seconds for Keycloak to fully start.

## Step 2: Configure Keycloak

1. **Access Keycloak Admin Console**
   - Open browser: http://localhost:8081
   - Login with:
     - Username: `admin`
     - Password: `admin`

2. **Create Realm**
   - Click dropdown (currently "Master") in top-left
   - Click "Create Realm"
   - Name: `tunistudent`
   - Click "Create"

3. **Create Roles**
   - In left sidebar, click "Realm roles"
   - Click "Create role"
   - Create two roles:
     - Role name: `ADMIN` → Save
     - Role name: `STUDENT` → Save

4. **Create Client**
   - In left sidebar, click "Clients"
   - Click "Create client"
   - Fill in:
     - Client ID: `tunistudent-client`
     - Click "Next"
   - **Capability config**:
     - Client authentication: **OFF**
     - Click "Next"
   - **Login settings**:
     - Valid redirect URIs: `http://localhost:4200/*`
     - Web origins: `*`
     - Click "Save"

## Step 3: Migrate Users

Open a new terminal in the `scripts` directory:

```bash
cd scripts
npm run migrate-users
```

You should see output like:
```
✓ Obtained admin token
✓ Created user: student
  Assigned roles: STUDENT
✓ Created user: dhia
  Assigned roles: STUDENT
...
✓ Migration complete!

Default password for all users: 12345678
```

## Step 4: Test the Application

1. **Start backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start frontend** (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Test login**:
   - Open http://localhost:4200
   - Click "Login"
   - Try logging in as:
     - Username: `dhia`
     - Password: `12345678`
   - You should be redirected to Keycloak login, then back to the app
   - Check your profile - old data (favorites, comments) should be there!

## Troubleshooting

### CORS Errors
- Ensure "Web origins" is set to `*` in Keycloak client settings

### Infinite Redirect Loop
- Check "Valid redirect URIs" includes `http://localhost:4200/*` (note the wildcard)

### Migration Script Fails
- Ensure Keycloak is running and accessible at http://localhost:8081
- Ensure realm `tunistudent` and roles `ADMIN`, `STUDENT` are created

### Users Can't Login
- Verify users exist in Keycloak (Admin Console → Users)
- Try resetting password in Keycloak if needed
