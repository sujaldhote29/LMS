const express = require('express');
const router = express.Router();
const db = require('../db');

// Detailed Academic Knowledge Base for Catalog Books
const BOOK_KNOWLEDGE = {
    'bcs-051': {
        code: 'BCS-051',
        title: 'Introduction to Software Engineering',
        semester: '5th Semester',
        overview: "BCS-051 covers systematic approaches to software development, engineering principles, and quality assurance.",
        topics: [
            "**SDLC Models:** Waterfall, Iterative, Spiral, V-Model, and Agile/Scrum methodologies.",
            "**Software Requirements (SRS):** Functional and non-functional requirements, requirement validation, feasibility study.",
            "**Software Design:** Architectural design, modularity, cohesion, and coupling (high cohesion & loose coupling).",
            "**Software Testing:** Black-box testing, White-box testing, Unit testing, Integration testing, and System testing.",
            "**Maintenance & Metrics:** Cyclomatic complexity (McCabe's metric), Function Point (FP) analysis, COCOMO model for cost estimation."
        ],
        faqAnswers: {
            'sdlc': "The **Software Development Life Cycle (SDLC)** consists of phases: 1) Requirement Gathering, 2) Analysis & Planning, 3) Design, 4) Implementation/Coding, 5) Testing, 6) Deployment, and 7) Maintenance.",
            'agile': "**Agile Methodology** is an iterative, flexible approach to software development focused on continuous collaboration, customer feedback, and small, frequent releases (Sprints).",
            'testing': "**Software Testing** verifies that software functions as intended without defects. Key levels include Unit Testing (individual modules), Integration Testing (module interactions), and System Testing (entire application).",
            'coupling': "**Cohesion** refers to how focused a single module's tasks are (high cohesion is good). **Coupling** refers to the degree of interdependence between modules (loose coupling is desired)."
        }
    },
    'mcs-023': {
        code: 'MCS-023',
        title: 'Intro to Database Management Systems',
        semester: '3rd Semester',
        overview: "MCS-023 focuses on relational database design, data modeling, SQL, transaction management, and concurrency.",
        topics: [
            "**ER Modeling:** Entities, Attributes, Relationships, Cardinality ratios, and ER-to-Relational mapping.",
            "**Normalization:** 1NF (atomic values), 2NF (remove partial dependencies), 3NF (remove transitive dependencies), and BCNF.",
            "**SQL (Structured Query Language):** DDL (CREATE, ALTER), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE), JOINs and Subqueries.",
            "**Transactions (ACID Properties):** Atomicity, Consistency, Isolation, and Durability.",
            "**Concurrency Control & Recovery:** Two-Phase Locking (2PL), Deadlocks, Write-Ahead Logging (WAL), and Checkpoints."
        ],
        faqAnswers: {
            'normalization': "**Normalization** organizes tables to minimize data redundancy and prevent insertion, update, and deletion anomalies. Stages include 1NF (atomic columns), 2NF (no partial dependency on composite keys), and 3NF (no transitive dependency).",
            'acid': "**ACID Properties** ensure database transaction reliability:\n• **A - Atomicity:** All or nothing execution.\n• **C - Consistency:** Preserves database invariants before and after.\n• **I - Isolation:** Concurrent transactions execute without interfering with each other.\n• **D - Durability:** Committed changes persist even after crashes.",
            'sql': "**SQL** is the standard language for relational databases. It divides into **DDL** (defines schema like `CREATE TABLE`), **DML** (manipulates data like `SELECT`, `UPDATE`), and **TCL** (`COMMIT`, `ROLLBACK`).",
            'join': "A **JOIN** combines rows from two or more tables based on a related column (e.g. `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`)."
        }
    },
    'bcs-031': {
        code: 'BCS-031',
        title: 'Programming in C++',
        semester: '3rd Semester',
        overview: "BCS-031 teaches Object-Oriented Programming (OOP) concepts, memory management, and reusable code using C++.",
        topics: [
            "**Core OOP Principles:** Encapsulation, Abstraction, Inheritance, and Polymorphism.",
            "**Classes & Objects:** Data members, member functions, constructors (default, parameterized, copy), and destructors.",
            "**Operator Overloading & Type Conversion:** Overloading unary and binary operators, friend functions.",
            "**Inheritance:** Single, Multiple, Multilevel, Hierarchical, and Hybrid inheritance, virtual base classes.",
            "**Polymorphism & Templates:** Compile-time (function/operator overloading) vs Run-time (virtual functions), Template functions and Template classes, Standard Template Library (STL)."
        ],
        faqAnswers: {
            'oop': "The 4 core pillars of **OOP** are:\n1. **Encapsulation:** Bundling data and functions within a class.\n2. **Abstraction:** Hiding complex implementation details.\n3. **Inheritance:** Deriving new classes from existing ones to reuse code.\n4. **Polymorphism:** Performing a single action in different ways (e.g., method overriding via virtual functions).",
            'virtual function': "A **Virtual Function** is a member function in a base class declared with `virtual` that you expect to override in derived classes. It enables runtime polymorphism using dynamic binding via the vtable.",
            'constructor': "A **Constructor** is a special member function with the same name as the class that is invoked automatically upon object creation to initialize members."
        }
    },
    'mcs-021': {
        code: 'MCS-021',
        title: 'Data and File Structures',
        semester: '3rd Semester',
        overview: "MCS-021 covers fundamental data structures, memory representations, algorithms, complexity analysis, and file handling.",
        topics: [
            "**Linear Data Structures:** Arrays, Singly & Doubly Linked Lists, Stacks (LIFO), and Queues (FIFO, Circular Queue, Priority Queue).",
            "**Non-Linear Data Structures:** Trees (Binary Tree, Binary Search Tree, AVL Tree, B-Trees) and Graphs (BFS, DFS, Dijkstra's algorithm).",
            "**Searching & Sorting:** Linear Search, Binary Search, Bubble, Insertion, Selection, Merge Sort, and Quick Sort.",
            "**Hashing:** Hash functions, collision resolution techniques (Linear Probing, Quadratic Probing, Chaining).",
            "**File Organization:** Sequential, Index Sequential (ISAM), Direct/Hashed file organizations."
        ],
        faqAnswers: {
            'stack': "A **Stack** is a linear data structure following **LIFO** (Last In, First Out). Key operations are `push()` to add, `pop()` to remove, and `peek()` to inspect the top element.",
            'queue': "A **Queue** is a linear data structure following **FIFO** (First In, First Out). Key operations are `enqueue()` (insert at rear) and `dequeue()` (remove from front).",
            'tree': "A **Binary Search Tree (BST)** is a node-based tree where the left child key is strictly less than the parent, and the right child key is strictly greater."
        }
    },
    'bcs-053': {
        code: 'BCS-053',
        title: 'Web Programming',
        semester: '5th Semester',
        overview: "BCS-053 covers modern web development technologies including semantic HTML, styling with CSS, JavaScript, and backend web concepts.",
        topics: [
            "**Frontend Foundations:** HTML5 semantic tags, forms, input validations, CSS Box Model, Flexbox, Grid.",
            "**Client-Side Scripting:** JavaScript syntax, DOM manipulation, Event Handling, and Asynchronous JavaScript (Promises, async/await, fetch).",
            "**Client-Server Architecture:** HTTP request/response cycle, HTTP methods (GET, POST, PUT, DELETE), Status codes (200, 404, 500).",
            "**State Management:** Cookies, LocalStorage, SessionStorage, and Token-based authentication (JWT).",
            "**Web Security:** Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and SQL Injection prevention."
        ],
        faqAnswers: {
            'dom': "The **DOM (Document Object Model)** is a tree representation of an HTML document created by the browser, allowing JavaScript to dynamically read and modify element contents, attributes, and styles.",
            'http': "**HTTP (HyperText Transfer Protocol)** is the communication protocol of the web. Common methods are `GET` (retrieve), `POST` (create), `PUT` (update), and `DELETE` (remove).",
            'jwt': "**JWT (JSON Web Token)** is a compact URL-safe token used for stateless authentication. It consists of three parts: Header, Payload, and Signature."
        }
    },
    'mcs-012': {
        code: 'MCS-012',
        title: 'Computer Organization & Assembly Language',
        semester: '2nd Semester',
        overview: "MCS-012 explores digital logic, computer internal hardware architecture, memory hierarchies, and microprocessors.",
        topics: [
            "**Digital Logic & Circuits:** Boolean algebra, Logic gates, Flip-flops, Combinational and Sequential circuits.",
            "**CPU Architecture:** ALU, Control Unit, Registers (PC, MAR, MDR, IR).",
            "**Memory Hierarchy:** Cache memory, Primary RAM/ROM, Virtual Memory, and Secondary storage.",
            "**Instruction Cycle:** Fetch, Decode, Execute, and Interrupt handling; Addressing modes.",
            "**Assembly Language:** 8086 architecture, registers, data transfer, arithmetic, and logical instructions."
        ]
    },
    'bcs-012': {
        code: 'BCS-012',
        title: 'Basic Mathematics',
        semester: '1st Semester',
        overview: "BCS-012 introduces fundamental mathematics essential for computer science calculations, algorithms, and logic.",
        topics: [
            "**Set Theory & Relations:** Sets, subsets, unions, intersections, Cartesian products, equivalence relations.",
            "**Matrices & Determinants:** Matrix operations, inverse of matrices, Cramer's rule for solving linear systems.",
            "**Differential Calculus:** Limits, continuity, derivatives, product rule, quotient rule, chain rule, and maxima/minima.",
            "**Integral Calculus:** Definite and indefinite integrals, integration by parts, substitution method.",
            "**Vectors & Geometry:** Dot product, cross product, vectors in 2D and 3D coordinate spaces."
        ]
    }
};

// General library policy & FAQ rules
const LIBRARY_FAQS = {
    borrowing: {
        keywords: ['borrow', 'issue', 'checkout', 'how to take', 'loan', 'limit', 'how many books', 'period', 'days'],
        reply: "📚 **Borrowing Rules:**\n• Members can borrow up to **3 books** at a time.\n• Standard loan duration is **14 days**.\n• To borrow a book, ask the Librarian at the issue desk or request via your member portal.",
        chips: ["🔍 Show available books", "💰 Fine policy", "⏱️ Loan duration"]
    },
    fines: {
        keywords: ['fine', 'fines', 'penalty', 'late fee', 'overdue', 'charges', 'pay fine'],
        reply: "💰 **Fine Policy:**\n• Overdue books are subject to a nominal late fee calculated upon return.\n• You can check any pending fines under **My Transactions** in your member dashboard.\n• Fines can be cleared with the Librarian.",
        chips: ["📖 How to return books", "🕒 Library hours", "📚 Browse catalog"]
    },
    returns: {
        keywords: ['return', 'renew', 'give back', 'bring back', 'renewal'],
        reply: "🔄 **Returning Books:**\n• Bring your borrowed book to the library circulation desk, or contact Librarian Jane.\n• Once marked as returned, your borrowing quota is immediately restored.",
        chips: ["📚 Check borrowing limit", "🔍 Search books"]
    },
    hours: {
        keywords: ['hours', 'timing', 'open', 'close', 'schedule', 'when is the library', 'time'],
        reply: "🕒 **Library Timings:**\n• **Monday – Friday:** 8:00 AM – 8:00 PM\n• **Saturday:** 9:00 AM – 5:00 PM\n• **Sunday & Holidays:** Closed\n• Digital catalog is accessible 24/7 online!",
        chips: ["📚 Search books", "👤 Contact librarian"]
    },
    contact: {
        keywords: ['contact', 'librarian email', 'admin email', 'reach out', 'helpdesk', 'phone'],
        reply: "📞 **Library Contact Information:**\n• **Librarian Jane:** librarian@library.com | +1 098-765-4321\n• **System Admin:** admin@library.com | +1 123-456-7890\n• Visit the main circulation desk in Building A, Room 101.",
        chips: ["📚 Search books", "🕒 Library hours"]
    },
    account: {
        keywords: ['register', 'signup', 'sign up', 'create account', 'password', 'login', 'reset password'],
        reply: "🔑 **Account Assistance:**\n• **New Members:** Click **Register** on the top menu to create a free account.\n• **Existing Members:** Log in with your email and password.\n• **Forgot Password?** Use the 'Forgot Password' link on the login page or ask an Admin to reset it for you.",
        chips: ["📚 Browse books", "🕒 Library hours"]
    }
};

// Helper: Call Google Gemini API if API key is provided
async function callGeminiIfAvailable(userMessage, booksContext) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const prompt = `You are "Savant AI", an expert and friendly academic library assistant at a university.
You help students with library rules, books, and in-depth academic explanations of concepts in computer science, software engineering, databases, programming, and mathematics.

LIBRARY CATALOG CONTEXT:
${booksContext}

USER QUESTION:
"${userMessage}"

INSTRUCTIONS:
1. If the question asks about a specific book or academic concept (e.g. Normalization, OOP, Polymorphism, SDLC, Trees, Sorting, SQL), provide a clear, structured, and student-friendly explanation with key bullet points.
2. If relevant, reference the matching book code (e.g. MCS-023 or BCS-051) from our library catalog.
3. Keep the response concise, engaging, and well-formatted with markdown bolding and bullet points.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 600,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API HTTP Error:", response.status, errText);
            return null;
        }

        const result = await response.json();
        const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        return replyText || null;
    } catch (err) {
        console.error("Gemini API call failed:", err.message);
        return null;
    }
}

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, role } = req.body;
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty.' });
        }

        const query = message.trim().toLowerCase();

        // 1. Greetings & Salutations
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'good morning', 'good afternoon', 'good evening', 'start'];
        if (greetings.includes(query) || query === 'help' || query === 'who are you') {
            return res.json({
                reply: "👋 Hello! I am **Savant AI**, your academic library assistant.\n\nI can:\n• Find books in our catalog & check live stock\n• **Answer academic questions about any book or concept** (e.g. *\"Explain normalization in DBMS\"*, *\"What is SDLC?\"*, *\"What topics are in C++?\"*)\n• Guide you through borrowing, returns, and fine policies.",
                books: [],
                chips: [
                    "📖 Explain Normalization in DBMS",
                    "⚙️ What is SDLC in BCS-051?",
                    "🔍 Find C++ books",
                    "📚 3rd semester books",
                    "💰 Fine policy",
                    "🕒 Library hours"
                ]
            });
        }

        // 2. Check for General Library Policy FAQs
        for (const [key, faq] of Object.entries(LIBRARY_FAQS)) {
            const hasKeyword = faq.keywords.some(kw => query.includes(kw));
            if (hasKeyword) {
                return res.json({
                    reply: faq.reply,
                    books: [],
                    chips: faq.chips
                });
            }
        }

        // 3. Check for Specific Academic Concepts / Book Questions in Built-in Knowledge Base
        for (const [key, book] of Object.entries(BOOK_KNOWLEDGE)) {
            const mentionsBook = query.includes(key) || 
                                 query.includes(book.code.toLowerCase()) || 
                                 query.includes(book.title.toLowerCase());

            if (mentionsBook && (query.includes('topic') || query.includes('syllabus') || query.includes('about') || query.includes('cover') || query.includes('summary') || query.includes('what is') || query.includes('explain'))) {
                return res.json({
                    reply: `📖 **${book.title} (${book.code})** - *${book.semester}*\n\n${book.overview}\n\n**Key Syllabus & Topics Covered:**\n• ${book.topics.join('\n• ')}`,
                    books: [{
                        Title: book.title,
                        ISBN: book.code,
                        Category: book.semester,
                        Stock: 5
                    }],
                    chips: [
                        `🔍 Search ${book.code}`,
                        "📖 How to borrow",
                        "📚 Other semester books"
                    ]
                });
            }

            if (book.faqAnswers) {
                for (const [conceptKey, conceptExplanation] of Object.entries(book.faqAnswers)) {
                    if (query.includes(conceptKey)) {
                        return res.json({
                            reply: `💡 **Concept Explanation (${book.title} - ${book.code}):**\n\n${conceptExplanation}\n\n*Reference Book: ${book.title} (${book.code}) available in our library!*`,
                            books: [{
                                Title: book.title,
                                ISBN: book.code,
                                Category: book.semester,
                                Stock: 5
                            }],
                            chips: [
                                `📖 More topics in ${book.code}`,
                                "🔍 Search this book",
                                "📖 Borrowing rules"
                            ]
                        });
                    }
                }
            }
        }

        // 4. If GEMINI_API_KEY is configured, use Google Gemini AI to answer ANY academic question
        if (process.env.GEMINI_API_KEY) {
            try {
                const [allBooks] = await db.query("SELECT Title, Author, ISBN, Category, Stock FROM Books LIMIT 20");
                const catalogSummary = allBooks.map(b => `- ${b.Title} (${b.ISBN}) [${b.Category}] - Stock: ${b.Stock}`).join('\n');
                const geminiReply = await callGeminiIfAvailable(message, catalogSummary);
                if (geminiReply) {
                    return res.json({
                        reply: geminiReply,
                        books: [],
                        chips: ["🔍 Check book availability", "📖 How to borrow", "📚 Browse catalog"]
                    });
                }
            } catch (err) {
                console.error("Gemini flow fallback:", err.message);
            }
        }

        // 5. Semester-specific Queries
        const semesterMatch = query.match(/(1st|2nd|3rd|4th|5th|6th)\s*(sem|semester)?/i);
        if (semesterMatch) {
            const sem = semesterMatch[1].toLowerCase();
            const [books] = await db.query(
                "SELECT ID, Title, Author, ISBN, Category, Stock FROM Books WHERE LOWER(Category) LIKE ? OR LOWER(Title) LIKE ? ORDER BY Title ASC",
                [`%${sem}%`, `%${sem}%`]
            );

            if (books.length > 0) {
                return res.json({
                    reply: `📖 Here are the curriculum books available for **${sem.toUpperCase()} Semester**:`,
                    books: books,
                    chips: ["🔍 Check other semesters", "📖 Borrowing rules", "🕒 Library hours"]
                });
            }
        }

        // 6. Clean keywords to perform targeted book catalog search
        let cleaned = query
            .replace(/^(can you|please|could you|i want to|i need to|find me|find|search for|search|look for|do you have|show me|tell me about|any books on|books on|book on|about)\s+/gi, '')
            .replace(/\b(books|book|syllabus|notes)\b/gi, '')
            .replace(/[?!.,;:]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const searchTerm = cleaned.length > 0 ? cleaned : query;

        let [searchResults] = await db.query(
            `SELECT ID, Title, Author, ISBN, Category, Stock 
             FROM Books 
             WHERE LOWER(Title) LIKE ? 
                OR LOWER(Author) LIKE ? 
                OR LOWER(Category) LIKE ? 
                OR LOWER(ISBN) LIKE ?
             ORDER BY Stock DESC
             LIMIT 6`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );

        if (searchResults.length === 0 && searchTerm.includes(' ')) {
            const words = searchTerm.split(' ').filter(w => w.length > 2);
            if (words.length > 0) {
                const conditions = words.map(() => `(LOWER(Title) LIKE ? OR LOWER(Category) LIKE ? OR LOWER(Author) LIKE ?)`).join(' OR ');
                const params = [];
                words.forEach(w => {
                    params.push(`%${w}%`, `%${w}%`, `%${w}%`);
                });
                const [wordResults] = await db.query(
                    `SELECT ID, Title, Author, ISBN, Category, Stock FROM Books WHERE ${conditions} ORDER BY Stock DESC LIMIT 6`,
                    params
                );
                searchResults = wordResults;
            }
        }

        if (searchResults.length > 0) {
            return res.json({
                reply: `🔎 Found **${searchResults.length}** book(s) related to **"${searchTerm}"**:`,
                books: searchResults,
                chips: ["📖 How to borrow", "🔍 Search another topic", "🕒 Library hours"]
            });
        }

        // 7. Fallback: Popular available books
        const [featuredBooks] = await db.query(
            "SELECT ID, Title, Author, ISBN, Category, Stock FROM Books WHERE Stock > 0 ORDER BY Title ASC LIMIT 3"
        );

        return res.json({
            reply: `I couldn't find an exact match for **"${query}"**. You can ask me to explain concepts like **Normalization**, **SDLC**, **OOP in C++**, or browse our collection:`,
            books: featuredBooks,
            chips: [
                "📖 Explain Normalization",
                "💻 OOP concepts in C++",
                "⚙️ What is SDLC?",
                "📖 Borrowing rules"
            ]
        });

    } catch (err) {
        console.error("Chatbot API error:", err);
        return res.status(500).json({ 
            reply: "Sorry, I had a momentary hiccup retrieving library details. Please try asking again!",
            books: [],
            chips: ["🔍 Search books", "📖 Borrowing rules"]
        });
    }
});

module.exports = router;
