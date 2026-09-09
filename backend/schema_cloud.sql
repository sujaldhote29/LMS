-- Cloud-ready schema: Creates tables directly within the currently connected database
-- Avoids hardcoded CREATE DATABASE / USE commands which are restricted on managed cloud databases

CREATE TABLE IF NOT EXISTS Members (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Role ENUM('Admin', 'Librarian', 'Member') NOT NULL DEFAULT 'Member',
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Books (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(50) NOT NULL UNIQUE,
    Category VARCHAR(100),
    Stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Transactions (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    MemberID INT NOT NULL,
    BookID INT NOT NULL,
    IssueDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ReturnDate DATE,
    Status ENUM('Issued', 'Returned') NOT NULL DEFAULT 'Issued',
    FOREIGN KEY (MemberID) REFERENCES Members(ID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Books(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Fines (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    TransactionID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Status ENUM('Pending', 'Paid') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (TransactionID) REFERENCES Transactions(ID) ON DELETE CASCADE
);
