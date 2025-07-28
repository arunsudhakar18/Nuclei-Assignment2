export class Student {
  static validcourses = ["A", "B", "C", "D", "E", "F"];

  constructor(
    public fullName: string,
    public age: number,
    public address: string,
    public rollno: number,
    public courses: string[]
  ) {}

  static validate(student: Student): string[] {
    const error: string[] = [];

    if (!student.fullName.trim()) error.push("fullName is required");
    if (isNaN(student.age) || student.age < 1) error.push("age is required");
    if (!student.address.trim()) error.push("address is required");
    if (!student.rollno || isNaN(student.rollno) || student.rollno < 1)
      error.push("rollno is required");

    if (
      !student.courses ||
      student.courses.length !== 4 ||
      student.courses.some((courses) => !Student.validcourses.includes(courses))
    ) {
      error.push("Course must be exactly 4 out of 6");
    }

    return error;
  }
}
