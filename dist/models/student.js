"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const fs = __importStar(require("fs"));
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
            error.push("Full name is required.");
        if (isNaN(student.age) || student.age < 1)
            error.push("Age is required and must be positive.");
        if (!student.address.trim())
            error.push("Address is required.");
        if (!student.rollno || isNaN(student.rollno) || student.rollno < 1)
            error.push("Roll number is required and must be positive.");
        if (!student.courses || student.courses.length !== 4) {
            error.push("Courses must be exactly 4, chosen from A, B, C, D, E, F.");
        }
        else {
            const seen = new Set();
            for (const course of student.courses) {
                if (!Student.validCoursesSet.has(course)) {
                    error.push("Courses must be exactly 4, chosen from A, B, C, D, E, F.");
                    break;
                }
                if (seen.has(course)) {
                    error.push("Courses must not contain duplicates.");
                    break;
                }
                seen.add(course);
            }
        }
        return error;
    }
    static sortStudent() {
        Student.students.sort((a, b) => {
            const cmp = a.fullName.localeCompare(b.fullName);
            if (cmp !== 0) {
                return cmp;
            }
            return a.rollno - b.rollno;
        });
    }
    static saveToFile(students, filePath) {
        fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
    }
    static loadFromFile(filePath) {
        if (!fs.existsSync(filePath))
            return [];
        const data = fs.readFileSync(filePath, "utf-8");
        const arr = JSON.parse(data);
        return arr.map((s) => new Student(s.fullName, s.age, s.address, s.rollno, s.courses));
    }
}
exports.Student = Student;
Student.validCoursesSet = new Set(["A", "B", "C", "D", "E", "F"]);
Student.students = [];
