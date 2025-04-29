import { test, expect } from 'bun:test';

test('Test Untuk Pendaftaran SSO Login', async () => {
	const apiUrl = `${process.env.HOST_URL}${process.env.BASE_URL_API?.replace(/^\//, '')}auth/register`;
	console.log("API URL:", apiUrl);
	const response = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: 'test@erayadigital.co.id',
			phone: '08123456789',
			username: 'aries',
			password: 'password123',
			role: 1,
			registration_number: 'REG-12345',
		}),
	});

	expect(response.status).toBe(200);
	const responseBody = await response.json();
	expect(responseBody).toHaveProperty('success', true);
	expect(responseBody).toHaveProperty('message', 'Init test user registered successfully');
});