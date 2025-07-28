import fs from "fs";
import { Student } from "./student";

export class Storage {
  private static readonly filepath = "Student.json";

  static store(data: Student[]) {
    fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
  }

  static fetch(): Student[] {
    if (!fs.existsSync(this.filepath)) return [];
    const data = fs.readFileSync(this.filepath, "utf-8");
    const res = JSON.parse(data);
    return res.map(
      (s: any) =>
        new Student(s.fullName, s.age, s.address, s.rollNumber, s.courses)
    );
  }
}
