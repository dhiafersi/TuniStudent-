# Step-by-Step Keycloak Configuration Guide

You're doing great! Keycloak is running. Follow these exact steps:

---

## Step 1: Login to Keycloak Admin Console

You should see a login page at http://localhost:8081

**Login with**:
- Username: `admin`
- Password: `admin`
- Click "Sign In"

---

## Step 2: Create the "tunistudent" Realm

1. After login, look at the **top-left corner** - you'll see "Master" with a dropdown arrow
2. Click on **"Master"**
3. Click **"Create Realm"** button
4. Enter realm name: `tunistudent`
5. Click **"Create"** button

✅ **You should now see "tunistudent" in the top-left instead of "Master"**

---

## Step 3: Create Roles

1. In the **left sidebar**, click **"Realm roles"**
2. Click **"Create role"** button

**Create first role**:
- Role name: `ADMIN`
- Click **"Save"**

**Create second role**:
- Click **"Create role"** again
- Role name: `STUDENT`
- Click **"Save"**

✅ **You should now see both ADMIN and STUDENT in the roles list**

---

## Step 4: Create the Client

1. In the **left sidebar**, click **"Clients"**
2. Click **"Create client"** button

**Page 1 - General Settings**:
- Client type: Keep as **"OpenID Connect"**
- Client ID: `tunistudent-client`
- Click **"Next"**

**Page 2 - Capability config**:
- Client authentication: Turn **OFF** (toggle should be gray/disabled)
- Click **"Next"**

**Page 3 - Login settings**:
- Valid redirect URIs: `http://localhost:4200/*`
- Web origins: `*`
- Click **"Save"**

✅ **You should now see "tunistudent-client" in the clients list**

---

## Step 5: Verify Your Setup

Before proceeding, verify:
- ✅ Top-left shows "tunistudent" realm
- ✅ Realm roles shows: ADMIN, STUDENT
- ✅ Clients shows: tunistudent-client

---

## Next: Run the Migration Script

Once you've completed all the above steps, let me know and I'll run the migration script to create all your users!

**Just type "done" when you've completed the Keycloak configuration above.**
