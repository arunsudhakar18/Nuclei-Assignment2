import { Student } from "../src/models/student";
import fs from "fs";

describe("Student class", () => {
  afterEach(() => {
    if (fs.existsSync("test_students.json"))
      fs.unlinkSync("test_students.json");
  });

  it("should validate a correct student", () => {
    const student = new Student("John Doe", 20, "123 Main St", 1, [
      "A",
      "B",
      "C",
      "D",
    ]);
    expect(Student.validate(student)).toEqual([]);
  });

  it("should catch missing fields", () => {
    const student = new Student("", 0, "", 0, []);
    const errors = Student.validate(student);
    expect(errors).toContain("Full name is required.");
    expect(errors).toContain("Age is required and must be positive.");
    expect(errors).toContain("Address is required.");
    expect(errors).toContain("Roll number is required and must be positive.");
    expect(errors).toContain(
      "Courses must be exactly 4, chosen from A, B, C, D, E, F."
    );
  });

  it("should catch invalid courses", () => {
    const student = new Student("Jane", 22, "Somewhere", 2, [
      "A",
      "B",
      "X",
      "Y",
    ]);
    const errors = Student.validate(student);
    expect(errors).toContain(
      "Courses must be exactly 4, chosen from A, B, C, D, E, F."
    );
  });

  it("should serialize and deserialize students", () => {
    const students = [
      new Student("Alice", 21, "Addr1", 1, ["A", "B", "C", "D"]),
      new Student("Bob", 22, "Addr2", 2, ["B", "C", "D", "E"]),
    ];
    Student.saveToFile(students, "test_students.json");
    const loaded = Student.loadFromFile("test_students.json");
    expect(loaded.length).toBe(2);
    expect(loaded[0].fullName).toBe("Alice");
    expect(loaded[1].courses).toContain("E");
  });

  it("should return empty array if file does not exist", () => {
    expect(Student.loadFromFile("nonexistent.json")).toEqual([]);
  });

  it("should handle corrupted JSON gracefully", () => {
    fs.writeFileSync("test_students.json", "{not valid json}");
    expect(() => Student.loadFromFile("test_students.json")).toThrow();
  });

  // Extra edge cases
  it("should catch duplicate courses", () => {
    const student = new Student("Dup", 20, "Addr", 3, ["A", "A", "B", "C"]);
    expect(Student.validate(student)).toContain(
      "Courses must not contain duplicates."
    );
  });

  it("should catch too many or too few courses", () => {
    const tooMany = new Student("TooMany", 20, "Addr", 4, [
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
    const tooFew = new Student("TooFew", 20, "Addr", 5, ["A", "B", "C"]);
    expect(Student.validate(tooMany)).toContain(
      "Courses must be exactly 4, chosen from A, B, C, D, E, F."
    );
    expect(Student.validate(tooFew)).toContain(
      "Courses must be exactly 4, chosen from A, B, C, D, E, F."
    );
  });

  it("should handle special characters in fields", () => {
    const student = new Student("O'Reilly", 21, "123 Main St. #5", 6, [
      "A",
      "B",
      "C",
      "D",
    ]);
    Student.saveToFile([student], "test_students.json");
    const loaded = Student.loadFromFile("test_students.json");
    expect(loaded[0].fullName).toBe("O'Reilly");
  });

  it("should catch non-integer roll number and age", () => {
    // @ts-expect-error
    const student = new Student("Test", "twenty", "Addr", "one", [
      "A",
      "B",
      "C",
      "D",
    ]);
    const errors = Student.validate(student);
    expect(errors).toContain("Age is required and must be positive.");
    expect(errors).toContain("Roll number is required and must be positive.");
  });

  it("should catch negative age and roll number", () => {
    const student = new Student("Test", -5, "Addr", -1, ["A", "B", "C", "D"]);
    const errors = Student.validate(student);
    expect(errors).toContain("Age is required and must be positive.");
    expect(errors).toContain("Roll number is required and must be positive.");
  });

  it("should handle courses with lowercase or mixed case", () => {
    const student = new Student("Case", 20, "Addr", 7, ["a", "B", "c", "D"]);
    // If your logic is case-sensitive, this should fail
    expect(Student.validate(student)).toContain(
      "Courses must be exactly 4, chosen from A, B, C, D, E, F."
    );
  });
});
