"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
class Student {
    constructor(fullName, age, address, rollno, courses) {
        this.fullName = fullName;
        this.age = age;
        this.address = address;
        this.rollno = rollno;
        this.courses = courses;
    }
    static validate(student) {
        const error = [];
        if (!student.fullName.trim())
            error.push("fullName is required");
        if (isNaN(student.age) || student.age < 1)
            error.push("age is required");
        if (!student.address.trim())
            error.push("address is required");
        if (!student.rollno || isNaN(student.rollno) || student.rollno < 1)
            error.push("rollno is required");
        if (!student.courses ||
            student.courses.length !== 4 ||
            student.courses.some((courses) => !Student.validcourses.includes(courses))) {
            error.push("Course must be exactly 4 out of 6");
        }
        return error;
    }
}
exports.Student = Student;
Student.validcourses = ["A", "B", "C", "D", "E", "F"];
