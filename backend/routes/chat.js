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
            'sdlc': "The **Software Development Life Cycle (SDLC)** consists of phases:\n1. Requirement Gathering\n2. Analysis & Planning\n3. Architecture & Design\n4. Implementation / Coding\n5. Testing & Quality Assurance\n6. Deployment\n7. Ongoing Maintenance",
            'agile': "**Agile Methodology** is an iterative, flexible approach focused on continuous collaboration, customer feedback, and short delivery cycles (Sprints).",
            'testing': "**Software Testing** verifies that software functions as expected without defects:\n• **Unit Testing:** Tests individual components.\n• **Integration Testing:** Tests interactions between components.\n• **Black-box:** Tests functionality without knowing internal code.\n• **White-box:** Tests internal structures and code paths.",
            'coupling': "**Cohesion** is how focused a single module's responsibilities are (aim for high cohesion). **Coupling** is how interconnected separate modules are (aim for loose coupling)."
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
            'normalization': "**Normalization** organizes tables to eliminate redundancy and prevent insertion, update, and deletion anomalies:\n• **1NF:** All column values must be atomic (indivisible).\n• **2NF:** In 1NF and no partial dependencies on composite keys.\n• **3NF:** In 2NF and no transitive dependencies (non-key attributes depend only on primary key).\n• **BCNF:** A stricter version where every determinant must be a candidate key.",
            'acid': "**ACID Properties** ensure database transaction reliability:\n• **A - Atomicity:** All operations succeed, or none do (rollback).\n• **C - Consistency:** Preserves database invariants before and after.\n• **I - Isolation:** Concurrent transactions execute without cross-interference.\n• **D - Durability:** Committed changes survive system crashes.",
            'sql': "**SQL (Structured Query Language)** is divided into:\n• **DDL:** Data Definition (`CREATE`, `ALTER`, `DROP`)\n• **DML:** Data Manipulation (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)\n• **TCL:** Transaction Control (`COMMIT`, `ROLLBACK`)",
            'join': "A **JOIN** matches rows between tables:\n• `INNER JOIN`: Only returns matching records.\n• `LEFT JOIN`: All rows from left table plus matched right rows.\n• `RIGHT JOIN`: All rows from right table plus matched left rows."
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
            "**Polymorphism & Templates:** Compile-time vs Run-time (virtual functions), Template functions and Template classes, Standard Template Library (STL)."
        ],
        faqAnswers: {
            'oop': "The 4 core pillars of **OOP** are:\n1. **Encapsulation:** Packaging data and methods together inside a class.\n2. **Abstraction:** Exposing essential features while hiding internal complexity.\n3. **Inheritance:** Reusing code by extending base classes into derived ones.\n4. **Polymorphism:** Performing a single action in different forms (e.g. virtual functions).",
            'virtual function': "A **Virtual Function** is defined in a base class using `virtual` and overridden in derived classes to achieve dynamic runtime polymorphism through a vtable.",
            'constructor': "A **Constructor** is an automatically invoked member function bearing the class's name, used to initialize object member variables."
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
            'stack': "A **Stack** is a linear data structure following **LIFO** (Last In, First Out). Core operations: `push()` (insert) and `pop()` (delete from top).",
            'queue': "A **Queue** is a linear data structure following **FIFO** (First In, First Out). Core operations: `enqueue()` (insert at rear) and `dequeue()` (remove from front).",
            'tree': "A **Binary Search Tree (BST)** satisfies: all nodes in the left subtree have values less than the parent, and all nodes in the right subtree have values greater. Average search is $O(\\log n)$."
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
        ]
    }
};

// General library policy & FAQ rules
const LIBRARY_FAQS = {
    borrowing: {
        keywords: ['borrow', 'issue', 'checkout', 'how to take', 'loan', 'limit', 'how many books', 'period', 'days'],
        reply: "📚 **Borrowing Rules:**\n• Members can borrow up to **3 books** simultaneously.\n• Standard loan duration is **14 days**.\n• Borrow books at the circulation desk or request via your member portal.",
        chips: ["🔍 Show available books", "💰 Fine policy", "⏱️ Loan duration"]
    },
    fines: {
        keywords: ['fine', 'fines', 'penalty', 'late fee', 'overdue', 'charges', 'pay fine'],
        reply: "💰 **Fine Policy:**\n• Overdue books are subject to a nominal late fee calculated upon return.\n• Check pending fines under **My Transactions** in your member dashboard.\n• Fines can be cleared with the Librarian.",
        chips: ["📖 How to return books", "🕒 Library hours", "📚 Browse catalog"]
    },
    returns: {
        keywords: ['return', 'renew', 'give back', 'bring back', 'renewal'],
        reply: "🔄 **Returning Books:**\n• Return your borrowed book at the circulation desk to Librarian Jane.\n• Once marked returned, your borrowing quota is restored instantly.",
        chips: ["📚 Check borrowing limit", "🔍 Search books"]
    },
    hours: {
        keywords: ['hours', 'timing', 'open', 'close', 'schedule', 'when is the library', 'time'],
        reply: "🕒 **Library Timings:**\n• **Monday – Friday:** 8:00 AM – 8:00 PM\n• **Saturday:** 9:00 AM – 5:00 PM\n• **Sunday & Holidays:** Closed\n• Digital catalog is accessible 24/7 online!",
        chips: ["📚 Search books", "👤 Contact librarian"]
    },
    contact: {
        keywords: ['contact', 'librarian email', 'admin email', 'reach out', 'helpdesk', 'phone'],
        reply: "📞 **Library Contacts:**\n• **Librarian Jane:** librarian@library.com | +1 098-765-4321\n• **System Admin:** admin@library.com | +1 123-456-7890\n• Main circulation desk in Building A, Room 101.",
        chips: ["📚 Search books", "🕒 Library hours"]
    }
};

// Fast Database Catalog Search Helper
async function searchCatalog(query) {
    let term = query
        .replace(/^(can you|please|could you|i want to|i need to|find me|find|search for|search|look for|do you have|show me|tell me about|any books for|any book for|any books on|any book on|books for|book for|books on|book on|recommend|about)\s+/gi, '')
        .replace(/\b(books|book|syllabus|notes|material|subject)\b/gi, '')
        .replace(/[?!.,;:]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Map common aliases
    if (term === 'maths' || term === 'math') term = 'math';
    if (term === 'dbms' || term === 'rdbms') term = 'database';
    if (term === 'se') term = 'software';
    if (term === 'ds' || term === 'dsa') term = 'data';
    if (term === 'cpp' || term === 'c') term = 'c++';
    if (term === 'web dev' || term === 'html') term = 'web';

    if (!term || term.length < 2) return [];

    const searchPattern = `%${term.toLowerCase()}%`;
    const [rows] = await db.query(
        `SELECT ID, Title, Author, ISBN, Category, Stock 
         FROM Books 
         WHERE LOWER(Title) LIKE ? 
            OR LOWER(Category) LIKE ? 
            OR LOWER(ISBN) LIKE ? 
            OR LOWER(Author) LIKE ?
         ORDER BY Stock DESC
         LIMIT 6`,
        [searchPattern, searchPattern, searchPattern, searchPattern]
    );

    return rows;
}

// Helper: Call Google Gemini API (with generous token limits so answers NEVER cut off)
async function callGeminiIfAvailable(userMessage, booksContext) {
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
    if (!apiKey) return null;

    const models = ['gemini-3.5-flash', 'gemini-flash-latest'];

    for (const model of models) {
        try {
            const prompt = `You are "Savant AI", a smart and friendly academic library assistant.
You help students with library books and explain academic concepts in computer science, software engineering, databases, programming, and mathematics.

AVAILABLE CATALOG:
${booksContext}

STUDENT'S QUESTION:
"${userMessage}"

FORMATTING GUIDELINES:
1. Provide a direct, structured, and complete answer in 2-4 concise paragraphs with clear bullet points.
2. If relevant, mention the matching book code (e.g. BCS-012, MCS-023) from the catalog.
3. NEVER leave your answer incomplete or cut off mid-sentence. Keep it under 250 words so it fits beautifully in the chat interface.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: 2048,
                        temperature: 0.4
                    }
                })
            });

            if (response.ok) {
                const result = await response.json();
                const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (replyText) return replyText;
            } else {
                const errText = await response.text();
                console.warn(`Gemini model ${model} error:`, response.status, errText);
            }
        } catch (err) {
            console.warn(`Gemini attempt with ${model} failed:`, err.message);
        }
    }
    return null;
}

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty.' });
        }

        const query = message.trim().toLowerCase();

        // 1. Greetings & Salutations (Instant <5ms)
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'good morning', 'good afternoon', 'good evening', 'start'];
        if (greetings.includes(query) || query === 'help' || query === 'who are you') {
            return res.json({
                reply: "👋 Hello! I am **Savant AI**, your academic library assistant.\n\nI can:\n• **Find books in our catalog** (e.g. *\"any book for maths\"*, *\"C++ programming\"*)\n• **Answer academic questions** (e.g. *\"Explain normalization in DBMS\"*, *\"What is SDLC?\"*)\n• Check borrowing rules, due dates, and fine policies.",
                books: [],
                chips: [
                    "📚 Any book for maths",
                    "🔍 Find DBMS books",
                    "📖 Explain Normalization in DBMS",
                    "⚙️ What is SDLC in BCS-051?",
                    "📚 3rd semester books",
                    "💰 Fine policy"
                ]
            });
        }

        // 2. Library Policy FAQs (Instant <5ms)
        for (const [key, faq] of Object.entries(LIBRARY_FAQS)) {
            const hasKeyword = faq.keywords.some(kw => query.includes(kw));
            if (hasKeyword && !query.includes('book') && !query.includes('explain') && !query.includes('what is')) {
                return res.json({
                    reply: faq.reply,
                    books: [],
                    chips: faq.chips
                });
            }
        }

        // 3. Semester-specific Queries (Instant <20ms)
        const semesterMatch = query.match(/(1st|2nd|3rd|4th|5th|6th)\s*(sem|semester)?/i);
        if (semesterMatch && (query.includes('book') || query.includes('syllabus') || query.includes('show') || query.includes('sem'))) {
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

        // 4. Direct Book / Catalog Search Requests (Instant <30ms)
        // Detect if user wants to FIND or BROWSE books (e.g. "any book for maths", "do you have c++")
        const isSearchIntent = (
            query.startsWith('any book') ||
            query.startsWith('any books') ||
            query.startsWith('find') ||
            query.startsWith('search') ||
            query.startsWith('look for') ||
            query.startsWith('do you have') ||
            query.startsWith('show') ||
            query.includes('book for') ||
            query.includes('books for') ||
            query.includes('book on') ||
            query.includes('books on') ||
            query.includes('have book')
        );

        if (isSearchIntent) {
            const matchedBooks = await searchCatalog(query);
            if (matchedBooks.length > 0) {
                return res.json({
                    reply: `🔎 We have **${matchedBooks.length}** book(s) in our catalog matching your request:`,
                    books: matchedBooks,
                    chips: [
                        `📖 Tell me about ${matchedBooks[0].ISBN}`,
                        "📖 How to borrow",
                        "📚 Other semester books"
                    ]
                });
            }
        }

        // 5. Deep Academic Questions / Concept Explanations -> Powered by Gemini AI
        if (process.env.GEMINI_API_KEY) {
            try {
                const [allBooks] = await db.query("SELECT Title, Author, ISBN, Category, Stock FROM Books LIMIT 25");
                const catalogSummary = allBooks.map(b => `- ${b.Title} (${b.ISBN}) [${b.Category}] - Stock: ${b.Stock}`).join('\n');
                const geminiReply = await callGeminiIfAvailable(message, catalogSummary);

                if (geminiReply) {
                    // Try to attach any relevant book mentioned
                    const [relatedBooks] = await db.query(
                        `SELECT Title, Author, ISBN, Category, Stock FROM Books 
                         WHERE LOWER(?) LIKE CONCAT('%', LOWER(ISBN), '%') 
                            OR LOWER(?) LIKE CONCAT('%', LOWER(Title), '%') 
                         LIMIT 3`,
                        [query + ' ' + geminiReply, query]
                    );

                    return res.json({
                        reply: geminiReply,
                        books: relatedBooks || [],
                        chips: ["🔍 Search books", "📖 How to borrow", "📚 Browse catalog"]
                    });
                }
            } catch (err) {
                console.warn("Gemini flow fallback:", err.message);
            }
        }

        // 6. Built-in Academic Concept Explanations (Fallback when Gemini is unavailable or slow)
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

        // 7. General Catalog Search Fallback
        const generalMatches = await searchCatalog(query);
        if (generalMatches.length > 0) {
            return res.json({
                reply: `🔎 Found **${generalMatches.length}** related book(s) in our catalog:`,
                books: generalMatches,
                chips: ["📖 How to borrow", "🔍 Search another topic", "🕒 Library hours"]
            });
        }

        // 8. Polite Fallback with Recommendations
        const [featuredBooks] = await db.query(
            "SELECT ID, Title, Author, ISBN, Category, Stock FROM Books WHERE Stock > 0 ORDER BY Title ASC LIMIT 3"
        );

        return res.json({
            reply: `I couldn't find an exact match for **"${query}"**. Here are some popular books available in our collection:`,
            books: featuredBooks,
            chips: [
                "📚 Any book for maths",
                "💻 OOP in C++",
                "📊 Normalization in DBMS",
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
