import { Student } from "./student";
import { crudOperations } from "./crud";
import promptsync from "prompt-sync";
import { Storage } from "./storage";

const prompt = promptsync();
const filepath = "student.json";

const manage = new crudOperations();

// Load from file if it exists
const loaded = Storage.fetch();
if (loaded.length > 0) {
  manage.loadStudents(loaded);
}

function main() {
  while (true) {
    console.log("Choose the option below:");
    console.log("1. Add user");
    console.log("2. Display user");
    console.log("3. Delete user");
    console.log("4. Save user details");
    console.log("5. Exit");

    const choice = prompt("Choose an option").trim();

    switch (choice) {
      case "1": {
        const fullName = prompt("Enter full name: ").trim();
        const age = parseInt(prompt("Enter age: ").trim());
        const address = prompt("Enter address: ").trim();
        const rollNumber = parseInt(prompt("Enter roll number: ").trim());
        const coursesInput = prompt(
          "Enter 4 courses (comma-separated, from A–F): "
        ).toUpperCase();
        const courses = coursesInput.split(",").map((c: string) => c.trim());

        const student = new Student(
          fullName,
          age,
          address,
          rollNumber,
          courses
        );

        const errors = manage.addstudent(student);

        if (errors.length > 0) {
          errors.forEach((e) => console.log(e));
        } else {
          console.log("Student details added successfully");
        }

        break;
      }

      case "2": {
        const sortField = prompt("Sort by (name/rollno/age/address): ")
          .trim()
          .toLowerCase();
        const sortOrder = prompt("Order (asc/desc): ").trim().toLowerCase();
        manage.display(sortField, sortOrder);
        break;
      }

      case "3": {
        const rollnoinput = prompt("Enter the rollno to delete :").trim();
        const roll = parseInt(rollnoinput);
        const check = manage.delete(roll);
        console.log(check ? "Student deleted" : "Roll not found ");
        break;
      }

      case "4": {
        const allStudents = manage.getStudents();
        Storage.store(allStudents);
        console.log("Data saved to file.");
        break;
      }

      case "5": {
        const save = prompt("Do you want to save changes (yes/no):")
          .trim()
          .toLowerCase();
        if (save === "yes") {
          const allStudents = manage.getStudents();
          Storage.store(allStudents);
          console.log("Data saved to file.");
        }
        console.log("Exiting...");
        return;
      }

      default: {
        console.log("Invalid option choose between 1-5");
      }
    }
  }
}

main();
