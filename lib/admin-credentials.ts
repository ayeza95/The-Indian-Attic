export const ADMIN_CREDENTIALS = [
    {
        email: 'admin@indianattic.com',
        password: 'admin123',
        name: 'Admin',
    },
    {
        email: 'vikash@admin.com',
        password: 'vikash123',
        name: 'Vikash',
    },
];

// Function to check if credentials match any admin. (IMPORTANT)
export function validateAdminCredentials(email: string, password: string) {
    const admin = ADMIN_CREDENTIALS.find(
        (a) => a.email === email && a.password === password
    );
    return admin || null;
}
