import * as fs from "fs";

export class Student {
  static validCoursesSet = new Set(["A", "B", "C", "D", "E", "F"]);
  static students: Student[] = [];

  constructor(
    public fullName: string,
    public age: number,
    public address: string,
    public rollno: number,
    public courses: string[]
  ) {}

  static validate(student: Student): string[] {
    const error: string[] = [];

    if (!student.fullName.trim()) error.push("Full name is required.");
    if (isNaN(student.age) || student.age < 1)
      error.push("Age is required and must be positive.");
    if (!student.address.trim()) error.push("Address is required.");
    if (!student.rollno || isNaN(student.rollno) || student.rollno < 1)
      error.push("Roll number is required and must be positive.");

    if (!student.courses || student.courses.length !== 4) {
      error.push("Courses must be exactly 4, chosen from A, B, C, D, E, F.");
    } else {
      const seen = new Set<string>();
      for (const course of student.courses) {
        if (!Student.validCoursesSet.has(course)) {
          error.push(
            "Courses must be exactly 4, chosen from A, B, C, D, E, F."
          );
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

  static saveToFile(students: Student[], filePath: string) {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
  }

  static loadFromFile(filePath: string): Student[] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    const arr = JSON.parse(data);
    return arr.map(
      (s: any) => new Student(s.fullName, s.age, s.address, s.rollno, s.courses)
    );
  }
}
