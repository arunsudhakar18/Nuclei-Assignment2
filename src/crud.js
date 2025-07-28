"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudOperations = void 0;
const student_1 = require("./student");
class crudOperations {
    constructor() {
        this.students = [];
    }
    addstudent(student) {
        if (this.students.some((s) => s.rollno === student.rollno)) {
            return ["Roll number already exists."];
        }
        const err = student_1.Student.validate(student);
        if (err.length > 0) {
            return err;
        }
        this.students.push(student);
        this.sortStudent();
        return [];
    }
    delete(rollnumber) {
        const check = this.students.findIndex((s) => s.rollno === rollnumber);
        if (check === -1)
            return false;
        this.students.splice(check, 1);
        return true;
    }
    display(sortField, sortOrder) {
        let arr = [...this.students];
        if (sortField) {
            arr.sort((a, b) => {
                let cmp = 0;
                if (sortField === "name") {
                    cmp = a.fullName.localeCompare(b.fullName);
                    if (cmp === 0)
                        cmp = a.rollno - b.rollno;
                }
                else if (sortField === "rollno") {
                    cmp = a.rollno - b.rollno;
                    if (cmp === 0)
                        cmp = a.fullName.localeCompare(b.fullName);
                }
                else if (sortField === "age") {
                    cmp = a.age - b.age;
                    if (cmp === 0)
                        cmp = a.fullName.localeCompare(b.fullName);
                }
                else if (sortField === "address") {
                    cmp = a.address.localeCompare(b.address);
                    if (cmp === 0)
                        cmp = a.fullName.localeCompare(b.fullName);
                }
                if (sortOrder && sortOrder === "desc")
                    cmp = -cmp;
                return cmp;
            });
        }
        console.log("Name\t\tRoll Number\tAge\tAddress\t\tCourses");
        for (const s of arr) {
            console.log(`${s.fullName}\t${s.rollno}\t\t${s.age}\t${s.address}\t${s.courses.join(", ")}`);
        }
    }
    sortStudent() {
        this.students.sort((a, b) => {
            const cmp = a.fullName.localeCompare(b.fullName);
            if (cmp !== 0) {
                return cmp;
            }
            return a.rollno - b.rollno;
        });
    }
    getStudents() {
        return this.students;
    }
    loadStudents(data) {
        for (const s of data) {
            const student = new student_1.Student(s.fullName, s.age, s.address, s.rollno, s.courses);
            this.students.push(student);
        }
        this.sortStudent();
    }
}
exports.crudOperations = crudOperations;
