"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const fs_1 = __importDefault(require("fs"));
const student_1 = require("../models/student");
class Storage {
    static store(data) {
        fs_1.default.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
    }
    static fetch() {
        if (!fs_1.default.existsSync(this.filepath))
            return [];
        const data = fs_1.default.readFileSync(this.filepath, "utf-8");
        const res = JSON.parse(data);
        return res.map((s) => new student_1.Student(s.fullName, s.age, s.address, s.rollNumber, s.courses));
    }
}
exports.Storage = Storage;
Storage.filepath = "Student.json";
