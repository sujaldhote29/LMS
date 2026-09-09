const express = require('express');
const router = express.Router();
const db = require('../db');

// Intelligent Library Knowledge Base & FAQ data
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
                reply: "👋 Hello! I am **Savant AI**, your academic library assistant.\n\nI can help you find books, check availability, answer borrowing and fine questions, or guide you through your courses!",
                books: [],
                chips: [
                    "🔍 Find DBMS books",
                    "💻 Web programming",
                    "📚 3rd semester books",
                    "📖 Borrowing rules",
                    "💰 Fine policy",
                    "🕒 Library hours"
                ]
            });
        }

        // 2. Semester-specific Queries
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

        // 3. Check for specific library FAQs
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

        // 4. Clean keywords to perform targeted book catalog search
        // Strip common conversational filler words
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

        // If no exact phrase match, try matching by significant words
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

        // 5. Intelligent Fallback: Recommend top available books
        const [featuredBooks] = await db.query(
            "SELECT ID, Title, Author, ISBN, Category, Stock FROM Books WHERE Stock > 0 ORDER BY Title ASC LIMIT 3"
        );

        return res.json({
            reply: `I couldn't find an exact match for **"${query}"**, but here are some popular books available in our collection:`,
            books: featuredBooks,
            chips: [
                "💻 Web Programming",
                "📊 Database Management",
                "⚙️ Software Engineering",
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
