import express, { response } from 'express'
import connection from '../Utilities/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/studentLogin', (req, res) => {
    const sql = `
        SELECT s.*, g.gradeName 
        FROM student s 
        JOIN grade g ON s.grade_id = g.id 
        WHERE s.email = ?`;

    connection.query(sql, [req.body.email], (error, result) => {
        if (error) return res.json({loginStatus: false, Error: "Query error"})
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (error, response) => {
                if (error) return res.json({loginStatus: false, Error: "Query error"})
                if (response) {
                    const email = result[0].email
                    const gradeName = result[0].gradeName;

                    const token = jwt.sign(
                        { role: "student", email: email, registrationNumber: result[0].registrationNumber, gradeName: gradeName },
                        "jwt_secret_key",
                        { expiresIn: "1h" }
                    )
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true, // Ensure this is true if using HTTPS
                        sameSite: 'None' // This allows cookies to be sent in cross-origin requests
                    });
                    return res.json({ loginStatus: true, registrationNumber: result[0].registrationNumber})
                }
                else {
                    return res.json({ loginStatus: false, Error: "Wrong email or password" });
                }
            })
        }else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" })
        }
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

router.get('/detail', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ Status: false, Error: "No token provided" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ Status: false, Error: "Failed to authenticate token" })

        const registrationNumber = decoded.registrationNumber;
    
        const sql = "SELECT s.name, s.registrationNumber, s.email, g.gradeName, s.guardianPhone FROM student s JOIN grade g ON s.grade_id = g.id WHERE s.registrationNumber = ?"

        connection.query(sql, [registrationNumber], (error, result) => {
            if (error) return res.json({ Status: false, Error: "Query error" });
            return res.json({ Status: true, Result: result[0] });
        })
    })
})

// Retrieve assignments for a specific grade
router.get('/assignments', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.json({ Status: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ Status: false, Error: "Token Error" });

        // console.log("Decoded Token:", decoded)

        const gradeName = decoded.gradeName;  // Extract gradeName from the token

        const sql = `
            SELECT a.id, s.subjectName, g.gradeName, a.title, a.description, a.deadline 
            FROM assignment a 
            JOIN subject s ON a.subject_id = s.id 
            JOIN grade g ON a.grade_id = g.id 
            WHERE g.gradeName = ?`;

        connection.query(sql, [gradeName], (error, result) => {
            if (error) return res.json({ Status: false, Error: "Query Error" });
            return res.json({ Status: true, Result: result });
        });
    });
});

// calculate the number of assignment available for a specific grade
router.get('/assignmentsCount', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.json({ Status: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ Status: false, Error: "Token Error" });

        const gradeName = decoded.gradeName;

        const sql = `
            SELECT COUNT(*) as assignmentCount 
            FROM assignment a 
            JOIN grade g ON a.grade_id = g.id 
            WHERE g.gradeName = ?`;

        connection.query(sql, [gradeName], (error, result) => {
            if (error) return res.json({ Status: false, Error: "Query Error" });
            return res.json({ Status: true, Result: result[0].assignmentCount });
        });
    });
});

// Retrieve exam results for a specific student registration number
router.get('/student-exam-results', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.json({ Status: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ Status: false, Error: "Token Error" });

        const registrationNumber = decoded.registrationNumber;  // Extract registrationNumber from the token

        const sql = `
            SELECT examresults.examRegCode, examresults.marks, exam.examName, subject.subjectName
            FROM examresults
            JOIN exam ON examresults.examRegCode = exam.registrationCode
            JOIN subject ON exam.subject_id = subject.id
            WHERE examresults.registrationNumber = ?`;

        connection.query(sql, [registrationNumber], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: error });
            }
            return res.json({ Status: true, Result: results });
        });
    });
});

// Route to get attendance for the logged-in student
router.get('/attendance_summary', (req, res) => {
    // const token = req.cookies.token;
    // if (!token) return res.json({ Status: false, Error: 'No token provided' });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ Status: false, Error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
        if (err) return res.json({ Status: false, Error: 'Failed to authenticate token' });

        const registrationNumber = decoded.registrationNumber;

        const sql = `
            SELECT a.date, a.status
            FROM attendance a
            WHERE a.registrationNumber = ?
            ORDER BY a.date DESC
        `;

        connection.query(sql, [registrationNumber], (error, results) => {
            if (error) return res.json({ Status: false, Error: 'Query error' });

            // Calculate totals
            const totalPresent = results.filter(record => record.status === 'present').length;
            const totalAbsent = results.filter(record => record.status === 'absent').length;
            const totalRecords = results.length;

            return res.json({ 
                Status: true, 
                Result: results,
                Totals: {
                    totalPresent,
                    totalAbsent,
                    totalRecords
                }
            });
        });
    });
});

// Request to borrow a book
router.post('/borrow_book', (req, res) => {
    const token = req.cookies.token;  // Extract token from cookies

    if (!token) return res.json({ Status: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {  // Verify the token
        if (err) return res.json({ Status: false, Error: "Token Error" });

        const student_id = decoded.registrationNumber;  // Extract the student_id (or registrationNumber)
        const { book_id } = req.body;  // Get the book_id from the request body

        // Insert the borrow request into the database
        const sql = `
            INSERT INTO borrow_requests (student_id, book_id, request_date, status, notification_sent)
            VALUES (?, ?, NOW(), 'Pending', 0)`;

        connection.query(sql, [student_id, book_id], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: error });
            }
            return res.json({ Status: true, Message: 'Borrow request sent' });
        });
    });
});

// Get borrow requests for the logged-in student
router.get('/borrow_requests', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.json({ Status: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ Status: false, Error: "Token Error" });

        const student_id = decoded.registrationNumber;

        const sql = `
            SELECT borrow_requests.id, library.bookname, borrow_requests.request_date, borrow_requests.status
            FROM borrow_requests
            JOIN library ON borrow_requests.book_id = library.id
            WHERE borrow_requests.student_id = ?
            ORDER BY borrow_requests.request_date DESC`;

        connection.query(sql, [student_id], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: error });
            }
            return res.json({ Status: true, Requests: results });
        });
    });
});

export {router as studentRouter}