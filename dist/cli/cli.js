"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_1 = require("../models/student");
const crud_1 = require("../utils/crud");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
const filePath = "student.json";
const manager = new crud_1.crudOperations();
// Load from file if it exists
const loadedStudents = student_1.Student.loadFromFile(filePath);
if (loadedStudents.length > 0) {
    manager.loadStudents(loadedStudents);
}
function main() {
    while (true) {
        console.log("\n=== Student Management CLI ===");
        console.log("1. Add Student");
        console.log("2. Display Students");
        console.log("3. Delete Student");
        console.log("4. Save Student Details");
        console.log("5. Exit");
        const choice = prompt("Choose an option: ").trim();
        switch (choice) {
            case "1": {
                const fullName = prompt("Enter full name: ").trim();
                const age = parseInt(prompt("Enter age: ").trim());
                const address = prompt("Enter address: ").trim();
                const rollNumber = parseInt(prompt("Enter roll number: ").trim());
                const coursesInput = prompt("Enter 4 courses (comma-separated, from A–F): ").toUpperCase();
                const courses = coursesInput.split(",").map((c) => c.trim());
                const student = new student_1.Student(fullName, age, address, rollNumber, courses);
                const errors = manager.addstudent(student);
                if (errors.length > 0) {
                    errors.forEach((e) => console.log(`Error: ${e}`));
                }
                else {
                    console.log(`Success: Student '${fullName}' added successfully.`);
                }
                break;
            }
            case "2": {
                const sortField = prompt("Sort by (name/rollno/age/address): ")
                    .trim()
                    .toLowerCase();
                const sortOrder = prompt("Order (asc/desc): ").trim().toLowerCase();
                manager.display(sortField, sortOrder);
                break;
            }
            case "3": {
                const rollNoInput = prompt("Enter the roll number to delete: ").trim();
                const rollNumber = parseInt(rollNoInput);
                const deleted = manager.delete(rollNumber);
                if (deleted) {
                    console.log(`Success: Student with roll number ${rollNumber} deleted.`);
                }
                else {
                    console.log(`Error: Roll number ${rollNumber} not found.`);
                }
                break;
            }
            case "4": {
                const allStudents = manager.getStudents();
                student_1.Student.saveToFile(allStudents, filePath);
                console.log("Success: Data saved to file.");
                break;
            }
            case "5": {
                const save = prompt("Do you want to save changes (yes/no): ")
                    .trim()
                    .toLowerCase();
                if (save === "yes") {
                    const allStudents = manager.getStudents();
                    student_1.Student.saveToFile(allStudents, filePath);
                    console.log("Success: Data saved to file.");
                }
                console.log("Exiting... Goodbye!");
                return;
            }
            default: {
                console.log("Error: Invalid option. Please choose between 1-5.");
            }
        }
    }
}
main();
