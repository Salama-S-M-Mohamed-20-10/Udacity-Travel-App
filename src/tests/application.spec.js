// Import the js file to test
import { formHandler } from "../client/js/application"
describe("Testing the formHandler() to be defined", () => {
    test("It should return true", async () => {
           expect(formHandler).toBeDefined();
})});

describe('Testing,function formHandler() to be functions', () => {
    test("It should be a function", async () => {
           expect(typeof formHandler).toBe('function');
})});