const app = require("../server/server");
//const req = require("../server/request");
//import request from "supertest";
const request = require('supertest');
//const request = supertest(app);
describe('The page should be running', () => {
    test('Page response successfully.', async () => {
        const response = await request('http://localhost:8000').get('/');
        expect(response.statusCode).toBe(200);
    });
});