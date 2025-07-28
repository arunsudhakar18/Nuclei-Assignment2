import { Student } from "../src/models/student";
import { crudOperations } from "../src/utils/crud";

describe("crudOperations", () => {
  let crud: crudOperations;

  beforeEach(() => {
    Student.students = [];
    crud = new crudOperations();
  });

  it("should add a student", () => {
    const student = new Student("Test", 18, "Addr", 1, ["A", "B", "C", "D"]);
    const errors = crud.addstudent(student);
    expect(errors).toEqual([]);
    expect(Student.students.length).toBe(1);
  });

  it("should not add a student with duplicate roll number", () => {
    const s1 = new Student("A", 18, "Addr", 1, ["A", "B", "C", "D"]);
    const s2 = new Student("B", 19, "Addr", 1, ["A", "B", "C", "D"]);
    crud.addstudent(s1);
    const errors = crud.addstudent(s2);
    expect(errors).toContain("Roll number already exists.");
    expect(Student.students.length).toBe(1);
  });

  it("should delete a student by roll number", () => {
    const s = new Student("A", 18, "Addr", 1, ["A", "B", "C", "D"]);
    crud.addstudent(s);
    expect(crud.delete(1)).toBe(true);
    expect(Student.students.length).toBe(0);
  });

  it("should not delete a non-existent student", () => {
    expect(crud.delete(999)).toBe(false);
  });

  it("should return all students", () => {
    const s = new Student("A", 18, "Addr", 1, ["A", "B", "C", "D"]);
    crud.addstudent(s);
    expect(crud.getStudents().length).toBe(1);
  });
});
