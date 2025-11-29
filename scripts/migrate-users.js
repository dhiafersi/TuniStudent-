const axios = require('axios');

// Configuration
const KEYCLOAK_URL = 'http://localhost:8081';
const REALM = 'tunistudent';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const DEFAULT_PASSWORD = '12345678';

// Users from SQL dump
const users = [
    { username: 'student', email: 'student@tunistudent.tn', roles: ['STUDENT'] },
    { username: 'dhia', email: 'fersidhia9@gmail.com', roles: ['STUDENT'] },
    { username: 'admin', email: 'admin@tunistudent.tn', roles: ['ADMIN'] },
    { username: 'eslem', email: 'kochabtieslem@gmail.com', roles: ['STUDENT'] },
    { username: 'iyed', email: 'iyed@gmail.com', roles: ['STUDENT'] },
    { username: 'chrifa', email: 'chrifa@gmail.com', roles: ['STUDENT'] },
    { username: 'tasnim', email: 'tasnim@gmail.com', roles: ['STUDENT'] },
    { username: 'user', email: 'test@gmail.com', roles: ['STUDENT'] }
];

async function getAdminToken() {
    const response = await axios.post(
        `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: 'password',
            client_id: 'admin-cli',
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
}

async function createUser(token, user) {
    try {
        // Create user
        await axios.post(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
            {
                username: user.username,
                email: user.email,
                enabled: true,
                emailVerified: true,
                credentials: [{
                    type: 'password',
                    value: DEFAULT_PASSWORD,
                    temporary: false
                }]
            },
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        console.log(`✓ Created user: ${user.username}`);

        // Get user ID
        const usersResponse = await axios.get(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${user.username}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const userId = usersResponse.data[0].id;

        // Assign roles
        for (const roleName of user.roles) {
            // Get role
            const rolesResponse = await axios.get(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${roleName}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const role = rolesResponse.data;

            // Assign role to user
            await axios.post(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
                [{ id: role.id, name: role.name }],
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
        }

        console.log(`  Assigned roles: ${user.roles.join(', ')}`);
    } catch (error) {
        if (error.response?.status === 409) {
            console.log(`⚠ User already exists: ${user.username}`);
        } else {
            console.error(`✗ Error creating user ${user.username}:`, error.response?.data || error.message);
        }
    }
}

async function main() {
    console.log('Starting user migration to Keycloak...\n');

    try {
        const token = await getAdminToken();
        console.log('✓ Obtained admin token\n');

        for (const user of users) {
            await createUser(token, user);
        }

        console.log('\n✓ Migration complete!');
        console.log(`\nDefault password for all users: ${DEFAULT_PASSWORD}`);
    } catch (error) {
        console.error('✗ Migration failed:', error.message);
        process.exit(1);
    }
}

main();
