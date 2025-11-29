# Migration Instructions

## Running the User Migration

**Prerequisites**:
1. Keycloak must be running (`docker-compose up -d` from project root)
2. Keycloak realm `tunistudent` must exist with roles `ADMIN` and `STUDENT`
3. Client `tunistudent-client` must be configured

**Steps**:
1. Navigate to the scripts directory:
   ```bash
   cd scripts
   ```

2. Install dependencies (if not done):
   ```bash
   npm install
   ```

3. Run the migration script:
   ```bash
   npm run migrate-users
   ```

4. All users will be created with password: `12345678`

5. Users should change their passwords after first login.

## Setting up Keycloak Realm & Client

1. Access Keycloak at http://localhost:8081
2. Login with admin/admin
3. Create realm "tunistudent"
4. Create roles: ADMIN, STUDENT
5. Create client "tunistudent-client":
   - Client authentication: Off
   - Valid redirect URIs: http://localhost:4200/*
   - Web origins: *
