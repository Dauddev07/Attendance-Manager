# Attendance Management System

A stylish web-based attendance tracker built with **HTML**, **CSS**, and **JavaScript**.  
It helps manage students, mark attendance by subject, and review detailed attendance records directly in the browser.

## Overview

This project is designed for quick classroom attendance management without requiring any backend setup.  
It features a modern dashboard-style interface, subject-wise attendance marking, detailed per-student history, and local data storage using `localStorage`.

## Features

- Add new students with name and roll number
- Prevent adding students with duplicate roll numbers
- Delete students from the list
- Select a subject before marking attendance
- Mark each student as `Present` or `Absent`
- Prevent duplicate attendance for the same student, subject, and day
- Search students by name with smart filtering
- Filter attendance history by both student and subject
- View detailed history for every student across all subjects
- Display a daily attendance summary for all students
- Enjoy a more modern and prominent dashboard-style UI
- Store all records locally in the browser

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Main dashboard structure and page sections |
| `style.css` | Modern UI styling, layout, effects, and responsive design |
| `db.js` | Subject list and local data storage logic |
| `app.js` | Core functionality for students, validation, attendance, alerts, filters, and summary |

## How To Run

1. Open `index.html` in any modern web browser.
2. Enter a student's name and roll number.
3. Add the student. Duplicate roll numbers will be rejected.
4. Select a subject from the dropdown.
5. Mark the student as present or absent.
6. Review the filtered history table, detailed student-subject history, and today's summary below.

## Live At:
https://dauddev07.github.io/Attendance-Manager/

## How It Works

- Student data and attendance records are saved in `localStorage`
- Each roll number must be unique before a student can be added
- Attendance is tracked subject-wise for the current day
- The app blocks duplicate marking for the same student and subject on the same date
- The history section can be filtered by student and subject
- Each student gets a subject-wise history card with totals and latest status
- The interface uses a polished dashboard layout with responsive sections and glass-style panels
- Search helps quickly find students from the list

## Notes

- No server or database is required
- The app includes sample student data by default
- Clearing browser storage will remove saved attendance records

## Future Improvements

- Edit student details
- Export attendance reports
- Add date-based filtering
- Support multiple classes or sections
