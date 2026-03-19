const studentList = document.getElementById("studentList");
const historyTable = document.getElementById("history");
const searchInput = document.getElementById("search");
const subjectSelect = document.getElementById("subject");
const historyStudentFilter = document.getElementById("historyStudentFilter");
const historySubjectFilter = document.getElementById("historySubjectFilter");
const studentSubjectHistory = document.getElementById("studentSubjectHistory");
const summary = document.getElementById("summary");
const alertContainer = document.getElementById("alertContainer");

function updateAlertStack() {
  const alerts = [...alertContainer.children];

  alerts.forEach((alert, index) => {
    alert.classList.toggle("alert-current", index === alerts.length - 1);
    alert.classList.toggle("alert-previous", index !== alerts.length - 1);
  });
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString();
}

function getEntryTimestamp(entry) {
  if (entry.createdAt) {
    return entry.createdAt;
  }

  const parsedDate = new Date(entry.date).getTime();
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function refreshStudentOptions(select, label) {
  const selectedValue = select.value;

  select.innerHTML = `<option value="">${label}</option>`;

  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = String(student.id);
    option.innerText = `${student.name} (${student.roll})`;
    select.appendChild(option);
  });

  if ([...select.options].some((option) => option.value === selectedValue)) {
    select.value = selectedValue;
  }
}

function loadSubjects() {
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  historySubjectFilter.innerHTML = `<option value="">All Subjects</option>`;

  subjects.forEach((sub) => {
    const subjectOption = document.createElement("option");
    subjectOption.value = sub;
    subjectOption.innerText = sub;
    subjectSelect.appendChild(subjectOption);

    const filterOption = document.createElement("option");
    filterOption.value = sub;
    filterOption.innerText = sub;
    historySubjectFilter.appendChild(filterOption);
  });
}

function refreshFilters() {
  refreshStudentOptions(historyStudentFilter, "All Students");
}

function getStudentAttendance(studentId, subject) {
  return attendance.filter(
    (entry) => entry.studentId === studentId && entry.subject === subject,
  );
}

function renderStudents(filter = "") {
  studentList.innerHTML = "";

  const filteredStudents = students.filter((s) => {
    const input = filter.toLowerCase().trim();
    const name = s.name.toLowerCase();

    if (!input) return true;
    if (name === input) return true;

    const words = name.split(" ");
    return words.some((word) => word.startsWith(input));
  });

  if (!filteredStudents.length) {
    studentList.innerHTML =
      '<div class="empty-state">No students found for this search.</div>';
    return;
  }

  filteredStudents.forEach((s) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${s.name}</h3>
      <p>Roll: ${s.roll}</p>
      <button class="present" onclick="mark(${s.id}, 'Present')">✔ Present</button>
      <button class="absent" onclick="mark(${s.id}, 'Absent')">✖ Absent</button>
      <button class="delete" onclick="deleteStudent(${s.id})">🗑 Delete</button>
    `;

    studentList.appendChild(card);
  });
}

function addStudent() {
  const name = document.getElementById("name");
  const roll = document.getElementById("roll");
  const trimmedName = name.value.trim();
  const trimmedRoll = roll.value.trim();

  if (!trimmedName || !trimmedRoll) {
    showAlert("Fill all fields", "warning");
    return;
  }

  const duplicateRoll = students.some(
    (student) => student.roll.toLowerCase() === trimmedRoll.toLowerCase(),
  );

  if (duplicateRoll) {
    showAlert("Roll number already exists", "warning");
    return;
  }

  students.push({
    id: Date.now(),
    name: trimmedName,
    roll: trimmedRoll,
  });

  saveData();
  refreshFilters();
  renderStudents(searchInput.value);
  renderHistory();
  renderStudentSubjectHistory();
  renderSummary();

  name.value = "";
  roll.value = "";

  showAlert("Student Added ✅", "success");
}

window.mark = function (id, status) {
  const subject = subjectSelect.value;

  if (!subject) {
    showAlert("Select subject first", "warning");
    return;
  }

  const student = students.find((st) => st.id === id);
  const today = formatDate();

  const exists = attendance.find(
    (a) => a.studentId === id && a.subject === subject && a.date === today,
  );

  if (exists) {
    showAlert("Already marked for this subject", "warning");
    return;
  }

  attendance.push({
    studentId: id,
    name: student.name,
    roll: student.roll,
    subject,
    status,
    date: today,
    createdAt: Date.now(),
  });

  saveData();
  renderHistory();
  renderStudentSubjectHistory();
  renderSummary();

  showAlert(`${status} marked for ${subject}`, "success");
};

window.deleteStudent = function (id) {
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return;
  }

  students.splice(studentIndex, 1);
  attendance = attendance.filter((entry) => entry.studentId !== id);

  saveData();
  refreshFilters();
  renderStudents(searchInput.value);
  renderHistory();
  renderStudentSubjectHistory();
  renderSummary();
  showAlert("Deleted 🗑", "warning");
};

function resetHistory() {
  showAlert("Resetting...", "warning");

  setTimeout(() => {
    attendance = [];
    saveData();
    renderHistory();
    renderStudentSubjectHistory();
    renderSummary();
    showAlert("Attendance Reset ✅", "error");
  }, 1000);
}

function renderHistory() {
  const selectedStudentId = historyStudentFilter.value;
  const selectedSubject = historySubjectFilter.value;

  historyTable.innerHTML = "";

  const filteredAttendance = attendance
    .filter((entry) => {
      const studentMatches =
        !selectedStudentId || String(entry.studentId) === selectedStudentId;
      const subjectMatches = !selectedSubject || entry.subject === selectedSubject;

      return studentMatches && subjectMatches;
    })
    .sort((a, b) => getEntryTimestamp(b) - getEntryTimestamp(a));

  if (!filteredAttendance.length) {
    historyTable.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">No attendance history found.</td>
      </tr>
    `;
    return;
  }

  filteredAttendance.forEach((entry) => {
    historyTable.innerHTML += `
      <tr>
        <td>${entry.name}</td>
        <td>${entry.roll}</td>
        <td>${entry.subject}</td>
        <td class="${entry.status === "Present" ? "status-present" : "status-absent"}">
          ${entry.status}
        </td>
        <td>${entry.date}</td>
      </tr>
    `;
  });
}

function renderStudentSubjectHistory() {
  studentSubjectHistory.innerHTML = "";

  if (!students.length) {
    studentSubjectHistory.innerHTML =
      '<div class="empty-state">Add students to view detailed history.</div>';
    return;
  }

  students.forEach((student) => {
    const totalRecords = attendance.filter(
      (entry) => entry.studentId === student.id,
    ).length;
    const subjectCards = subjects
      .map((subject) => {
        const subjectHistory = getStudentAttendance(student.id, subject);
        const presentCount = subjectHistory.filter(
          (entry) => entry.status === "Present",
        ).length;
        const absentCount = subjectHistory.filter(
          (entry) => entry.status === "Absent",
        ).length;
        const latestEntry = [...subjectHistory].sort(
          (a, b) => getEntryTimestamp(b) - getEntryTimestamp(a),
        )[0];

        return `
          <div class="subject-history-card">
            <div class="subject-history-head">
              <h4>${subject}</h4>
              <span>${subjectHistory.length} record${subjectHistory.length === 1 ? "" : "s"}</span>
            </div>
            <p>Present: <strong>${presentCount}</strong></p>
            <p>Absent: <strong>${absentCount}</strong></p>
            <p>Last Status: <strong>${latestEntry ? latestEntry.status : "No Record"}</strong></p>
            <p>Last Date: <strong>${latestEntry ? latestEntry.date : "-"}</strong></p>
          </div>
        `;
      })
      .join("");

    studentSubjectHistory.innerHTML += `
      <section class="student-history-card">
        <div class="student-history-header">
          <div>
            <h3>${student.name}</h3>
            <p>Roll Number: ${student.roll}</p>
          </div>
          <span class="history-badge">${totalRecords} total record${totalRecords === 1 ? "" : "s"}</span>
        </div>
        <div class="subject-history-grid-inner">
          ${subjectCards}
        </div>
      </section>
    `;
  });
}

function renderSummary() {
  summary.innerHTML = "";

  const today = formatDate();

  if (!students.length) {
    summary.innerHTML =
      '<div class="empty-state">No students available for today&apos;s summary.</div>';
    return;
  }

  students.forEach((student) => {
    const todayAttendance = attendance.filter(
      (entry) => entry.studentId === student.id && entry.date === today,
    );
    const presentCount = todayAttendance.filter(
      (entry) => entry.status === "Present",
    ).length;
    const absentCount = todayAttendance.filter(
      (entry) => entry.status === "Absent",
    ).length;

    summary.innerHTML += `
      <div class="summary-card">
        <h3>${student.name}</h3>
        <p>Present Today: ${presentCount}</p>
        <p>Absent Today: ${absentCount}</p>
        <p>Total Marked: ${todayAttendance.length} / ${subjects.length}</p>
      </div>
    `;
  });
}

function searchStudent() {
  renderStudents(searchInput.value);
}

function showAlert(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `alert ${type}`;
  toast.innerText = msg;
  alertContainer.appendChild(toast);
  updateAlertStack();

  const visibleAlertsCount = alertContainer.children.length;
  const alertDuration = visibleAlertsCount > 1 ? 1000 : 3000;

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
      updateAlertStack();
    }, 250);
  }, alertDuration);
}

subjectSelect.addEventListener("change", renderHistory);
historyStudentFilter.addEventListener("change", renderHistory);
historySubjectFilter.addEventListener("change", renderHistory);

loadSubjects();
refreshFilters();
renderStudents();
renderHistory();
renderStudentSubjectHistory();
renderSummary();
