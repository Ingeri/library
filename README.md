# Library Management System (LMS)

A simple Library Management System (LMS) to manage books, members, and transactions. This README describes the main components, data model and common workflows.

## Table of Contents
- Overview
- Main Components
- Data Model
- Workflows
    - Book registration
    - Member registration
    - Borrowing a book
    - Returning a book
    - Reserving a book
    - Search
    - Reports & statistics
- Notes

## Overview
The LMS helps librarians and members (students/teachers) find, borrow, return and manage books. It tracks availability, locations and basic reporting (overdue, most borrowed etc.).

## Main Components
1. Users
     - Librarians — manage books, members and records
     - Members / Students / Teachers — borrow, return and reserve books
2. Books database — central store of book records and copies
3. Transactions — borrow, return, renew and reserve actions
4. Search and reporting — book lookup and administrative reports

## Data Model (example fields)
- Book
    - id (unique)
    - title
    - author
    - isbn
    - category
    - copies_total
    - copies_available
    - shelf_location
- Member
    - member_id (unique)
    - name
    - role (student / teacher)
    - class / department
    - contact
- Transaction
    - transaction_id
    - member_id
    - book_id
    - copy_id (if applicable)
    - date_borrowed
    - due_date
    - date_returned
    - fine_amount (if any)
    - status (borrowed / returned / overdue / reserved)

## Workflows

### 1. Book registration
1. Librarian adds a new book record.
2. Enter metadata: title, author, ISBN, category, number of copies, shelf location.
3. System stores the record and updates available copy counts.

### 2. Member registration
1. Student/teacher registers for a library account.
2. Capture: name, class/department, contact, ID.
3. System issues a unique Member ID.

### 3. Borrowing a book
1. Member searches for a book.
2. System shows availability and shelf location.
3. Librarian issues the book (or member checks out online).
4. System records: borrower (member_id), book_id, date_borrowed and due_date; decrements copies_available.

### 4. Returning a book
1. Librarian scans the book or enters the copy/book ID.
2. System sets status to Available and increments copies_available.
3. If returned after due_date, calculate and record fine_amount.

### 5. Reserving a book
1. If a book is not available, member places a reservation.
2. System queues reservations and notifies the next member when a copy is returned.

### 6. Search function
Members can search by:
- Title
- Author
- Category
- ISBN
- Availability
Advanced filters: publication year, language, location.

### 7. Reports & statistics
Librarians can generate:
- Most borrowed books
- Overdue books and members with fines
- New arrivals
- Inventory per category
- Active member statistics

## Notes
- Fine policies, loan periods and reservation rules are configurable.
- Consider role-based access: librarians vs members.
- Back up the books database regularly and log transactions for audits.
