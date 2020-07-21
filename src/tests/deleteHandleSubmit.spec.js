// Import the js file to test
import { deleteHandleSubmit } from "../client/js/deleteHandleSubmit"
describe("Testing the deleteHandleSubmit() to be defined", () => {
    test("It should return true", async () => {
           expect(deleteHandleSubmit).toBeDefined();
})});

describe('Testing,function deleteHandleSubmit() to be functions', () => {
    test("It should be a function", async () => {
           expect(typeof deleteHandleSubmit).toBe('function');
})});