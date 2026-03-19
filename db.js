const subjects = [
  "Advance Programming",
  "Computer Vision",
  "Web Engineering",
  "Cyber Security",
  "Compiler Construction",
  "Parallel and Distributed Computing",
];

const students = JSON.parse(localStorage.getItem("students")) || [
  { id: 1, name: "Ali", roll: "101" },
  { id: 2, name: "Sara", roll: "102" },
];

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("attendance", JSON.stringify(attendance));
}
