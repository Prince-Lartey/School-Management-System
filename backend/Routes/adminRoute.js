import express from 'express'
import connection from '../Utilities/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'
const saltRounds = 10;


const router = express.Router()

// Admin Login
router.post('/adminLogin', (req, res) => {
    const sql = "SELECT * FROM admin WHERE email = ?";
    const values = [req.body.email];

    connection.query(sql, values, async (error, result) => { 
        if (error) {
            console.error("Error executing SQL query:", error);
            return res.json({loginStatus: false, Error: "Internal Server Error"});
        }

        if (result.length > 0) {
            const storedPassword = result[0].password;
            const email = result[0].email;
            const plainPassword = req.body.password;

            // Check if the password is hashed
            const isPasswordHashed = await bcrypt.compare(plainPassword, storedPassword);
            
            if (isPasswordHashed) {
                // Password is hashed and correct
                const token = jwt.sign(
                    { role: "admin", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token);
                return res.json({ loginStatus: true });
            } else if (storedPassword === plainPassword) {
                // Password is not hashed yet, but correct
                // Hash the password and update in the database
                const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

                const updateSql = "UPDATE admin SET password = ? WHERE email = ?";
                connection.query(updateSql, [hashedPassword, email], (updateError) => {
                    if (updateError) {
                        console.error("Error updating password:", updateError);
                        return res.json({loginStatus: false, Error: "Internal Server Error"});
                    }

                    // Generate token after password update
                    const token = jwt.sign(
                        { role: "admin", email: email, id: result[0].id },
                        "jwt_secret_key",
                        { expiresIn: "1h" }
                    );
                    res.cookie('token', token);
                    return res.json({ loginStatus: true });
                });
            } else {
                return res.json({ loginStatus: false, Error: "Wrong email or password" });
            }
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

// Add Grade
router.post('/add_grade', (req, res) => {
    const { gradeName } = req.body;

    if (!gradeName) {
        return res.json({ Status: false, Error: "Grade name is required" });
    }

    const sql = "INSERT INTO grade (`gradeName`) VALUES (?)";
    const values = [gradeName]

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({ Status: false, Error: "Query Error", error });
        return res.json({ Status: true });
    });
})

// Retrieve Grade
router.get('/grade', (req, res) => {
    const sql = "SELECT * FROM grade"
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Retrieve gender
router.get('/gender', (req, res) => {
    const sql = "SELECT * FROM gender"
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Add Subject
router.post('/add_subject', (req, res) => {
    const { subjectName } = req.body;

    if (!subjectName) {
        return res.json({ Status: false, Error: "Subject name is required" });
    }

    const sql = "INSERT INTO subject (`subjectName`) VALUES (?)"
    const values = [subjectName]

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})  
        return res.json({Status: true})
    })
})

// Retrieve Subject
router.get('/subject', (req, res) => {
    const sql = "SELECT * FROM subject"
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Add announcement
router.post('/add_announcement', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.json({ Status: false, Error: "Message is required" });
    }

    const sql = "INSERT INTO announcement (`message`) VALUES (?)"
    const values = [message]

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})  
        return res.json({Status: true})
    })
})

// Retrieve announcement
router.get('/announcement', (req, res) => {
    const sql = "SELECT * FROM announcement"
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Delete announcement by id
router.delete('/delete_announcement/:id', (req, res) => {
    const id = req.params.id
    const sql = 'Delete from announcement WHERE id = ?'
    connection.query(sql, [id], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Add event
router.post('/add_event', (req, res) => {
    const { date, title, description } = req.body;

    if (!date || !title || !description) {
        return res.json({ Status: false, Error: "All fields are required" });
    }

    const sql = "INSERT INTO event (date, title, description) VALUES (?, ?, ?)"
    const values = [
        date,
        title,
        description
    ];

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})  
        return res.json({Status: true})
    })
})

// Retrieve event
router.get('/events', (req, res) => {
    const sql = 'SELECT * FROM event ORDER BY date';
    connection.query(sql, (error, results) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true, Result: results });
    });
});

// Delete event by id
router.delete('/delete_event/:id', (req, res) => {
    const id = req.params.id
    const sql = 'Delete from event WHERE id = ?'
    connection.query(sql, [id], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Add assignment
router.post('/add_assignment', (req, res) => {
    const { subject_id, title, description, grade_id, deadline } = req.body;

    if (!subject_id || !title || !description || !grade_id || !deadline) {
        return res.json({ Status: false, Error: "All fields are required" });
    }

    const sql = `INSERT INTO assignment (subject_id, title, description, grade_id, deadline) VALUES (?, ?, ?, ?, ?)` 
    const values = [subject_id, title, description, grade_id, deadline];

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: error})
        return res.json({Status: true})
    })
})

// Retrieve assignments
router.get('/assignment', (req, res) => {
    const sql =` SELECT a.id, s.subjectName, g.gradeName, a.title, a.description, a.deadline FROM assignment a JOIN subject s ON a.subject_id = s.id JOIN grade g ON a.grade_id = g.id`
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Update assignment
router.put('/update_assignment/:id', (req, res) => {
    const id = req.params.id;
    const { subject_id, title, description, grade_id, deadline } = req.body;

    // Validate required fields
    if (!subject_id || !title || !description || !grade_id || !deadline) {
        return res.json({ Status: false, Error: 'All fields are required.' });
    }

    const sql = `UPDATE assignment SET subject_id = ?, title = ?, description = ?, grade_id = ?, deadline = ? WHERE id = ?`;
    const values = [subject_id, title, description, grade_id, deadline, id];

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true });
    });
});

// Delete assignment
router.delete('/delete_assignment/:id', (req, res) => {
    const id = req.params.id
    const sql = 'Delete from assignment WHERE id = ?'
    connection.query(sql, [id], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Add book
router.post('/add_book', (req, res) => {
    const { bookname, author } = req.body;

    // Check if all required fields are filled
    if (!bookname || !author) {
        return res.json({ Status: false, Error: "All fields are required" });
    }

    const sql = `INSERT INTO library (bookname, author) VALUES (?, ?)` 
    const values = [
        bookname,
        author
    ];

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: error})
        return res.json({Status: true})
    })
})

// Retrieve book
router.get('/book', (req, res) => {
    const sql = "SELECT * FROM library"
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Delete book by id
router.delete('/delete_book/:id', (req, res) => {
    const id = req.params.id
    const sql = 'Delete from library WHERE id = ?'
    connection.query(sql, [id], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Book borrowing requests
router.get('/borrow_requests', (req, res) => {
    const sql = `
        SELECT 
            borrow_requests.id, 
            student.name AS studentName, 
            library.bookname, 
            borrow_requests.request_date, 
            borrow_requests.status, 
            borrow_requests.notification_sent
        FROM borrow_requests
        JOIN student ON borrow_requests.student_id = student.registrationNumber
        JOIN library ON borrow_requests.book_id = library.id
        ORDER BY borrow_requests.request_date DESC`;
    
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }
        return res.json({ Status: true, BorrowRequests: result });
    });
});

// Accept Borrow Request
router.post('/accept_borrow_request/:id', (req, res) => {
    const requestId = req.params.id;
    const updateStatusQuery = `
        UPDATE borrow_requests 
        SET status = 'Accepted'
        WHERE id = ?
    `;

    connection.query(updateStatusQuery, [requestId], (error, result) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }

        //return res.json({ Status: true });

        // Now remove the request from the table
        const deleteRequestQuery = `
            DELETE FROM borrow_requests 
            WHERE id = ?
        `;

        connection.query(deleteRequestQuery, [requestId], (error, result) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: 'Failed to delete request' });
            }

            return res.json({ Status: true });
        });
    });
});

// Decline Borrow Request
router.post('/decline_borrow_request/:id', (req, res) => {
    const requestId = req.params.id;
    const updateStatusQuery = `
        UPDATE borrow_requests 
        SET status = 'Declined'
        WHERE id = ?
    `;

    connection.query(updateStatusQuery, [requestId], (error, result) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }

        //return res.json({ Status: true });

        // Now remove the request from the table
        const deleteRequestQuery = `
            DELETE FROM borrow_requests 
            WHERE id = ?
        `;

        connection.query(deleteRequestQuery, [requestId], (error, result) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: 'Failed to delete request' });
            }

            return res.json({ Status: true });
        });
    });
});

// Create exam
router.post('/create_exam', (req, res) => {
    const { examName, subject_id, registrationCode, marks } = req.body;

    // Check if all required fields are filled
    if (!examName || !subject_id || !registrationCode || !marks) {
        return res.json({ Status: false, Error: "All fields are required" });
    }

    const sql = `INSERT INTO exam (examName, subject_id, registrationCode, marks) VALUES (?, ?, ?, ?)` 
    const values = [
        examName,
        subject_id,
        registrationCode,
        marks
    ];

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({Status: false, Error: error})
        return res.json({Status: true})
    })
})

// Retrieve exam
router.get('/exam', (req, res) => {
    const sql = `SELECT e.examName, s.subjectName, e.registrationCode, e.marks FROM exam e JOIN subject s ON e.subject_id = s.id`
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error})
        return res.json({Status: true, Result: result})
    })
})

// Retrieve exam details by registration code
router.get('/exam/:registrationCode', (req, res) => {
    const registrationCode = req.params.registrationCode;
    const sql = 'SELECT * FROM exam WHERE registrationCode = ?';
    connection.query(sql, [registrationCode], (error, results) => {
        if (error) return res.json({ Status: false, Error: "Query Error" });
        if (results.length > 0) return res.json({ Status: true, Result: results });
        return res.json({ Status: false, Error: "No data found" });
    });
});

// Edit exam by registration code
router.put('/edit_exam/:registrationCode', (req, res) => {
    const registrationCode = req.params.registrationCode
    const { examName, subject_id, marks } = req.body

    // Validate required fields
    if (!examName || !subject_id || marks === undefined) {
        return res.json({ Status: false, Error: 'All fields are required.' });
    }

    const sql = `UPDATE exam set examName = ?, subject_id = ?, marks = ? WHERE registrationCode = ?`
    const values = [examName, subject_id, marks];
    connection.query(sql, [...values, registrationCode], (error, result) => {
        if (error) return res.json({Status: false, Error: error})
        return res.json({Status: true, Result: result})
    })
})

// Delete exam by registration code
router.delete('/delete_exam/:registrationCode', (req, res) => {
    const registrationCode = req.params.registrationCode
    const sql = 'Delete from exam WHERE registrationCode = ?'
    connection.query(sql, [registrationCode], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Record exam results
router.post('/exam-results', (req, res) => {
    const { examRegCode, registrationNumber, marks } = req.body;

    // Validate input fields
    if (!examRegCode || !registrationNumber || marks === undefined || marks === null) {
        return res.json({ Status: false, Error: 'All fields are required' });
    }

    // Check if the student already has a recorded score for the exam
    const checkSql = `SELECT * FROM examresults WHERE examRegCode = ? AND registrationNumber = ?`;
    connection.query(checkSql, [examRegCode, registrationNumber], (checkError, checkResult) => {
        if (checkError) {
            console.error('Database query error:', checkError);
            return res.json({ Status: false, Error: checkError });
        }

        // If a result already exists, return an error
        if (checkResult.length > 0) {
            return res.json({ Status: false, Error: 'Score for this student and exam code already exists' });
        }

        // If no existing record, proceed to insert the new exam score
        const insertSql = `INSERT INTO examresults (examRegCode, registrationNumber, marks) VALUES (?, ?, ?)`;
        connection.query(insertSql, [examRegCode, registrationNumber, marks], (insertError, insertResult) => {
            if (insertError) {
                console.error('Database query error:', insertError);
                return res.json({ Status: false, Error: insertError });
            }
            return res.json({ Status: true });
        });
    });
});

// Get exam results by exam registration code
router.get('/exam-results/:examRegCode', (req, res) => {
    const examRegCode = req.params.examRegCode;
    const sql = `
        SELECT examresults.examRegCode, examresults.marks, student.name AS studentName, student.registrationNumber
        FROM examresults
        JOIN student ON examresults.registrationNumber = student.registrationNumber
        WHERE examresults.examRegCode = ?
    `;
    connection.query(sql, [examRegCode], (error, results) => {
        if (error) {
            console.error('Database query error:', error)
            return res.json({Status: false, Error: error})
        }
        return res.json({Status: true, Result: results})
    });
});

// Get all students
router.get('/students', (req, res) => {
    const sql = `SELECT registrationNumber, name FROM student ORDER BY name`;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({Status: false, Error: error});
        }
        return res.json({Status: true, Students: results});
    });
});

// Get exam report for a specific student
router.get('/exam-report/:registrationNumber', (req, res) => {
    const registrationNumber = req.params.registrationNumber;
    const sql = `
        SELECT examresults.examRegCode, subject.subjectName, examresults.marks, student.name AS studentName, student.registrationNumber, student.grade_id AS grades FROM examresults
        JOIN student ON examresults.registrationNumber = student.registrationNumber
        JOIN exam ON examresults.examRegCode = exam.registrationCode
        JOIN subject ON exam.subject_id = subject.id
        WHERE student.registrationNumber = ?
    `;
    connection.query(sql, [registrationNumber], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({Status: false, Error: error});
        }

        // Calculate grade and remarks based on marks
        const report = results.map(result => {
            let grade = '';
            let remarks = '';
            const marks = result.marks;

            if (marks >= 80) {
                grade = 'A';
                remarks = 'Excellent';
            } else if (marks >= 70) {
                grade = 'B';
                remarks = 'Very Good';
            } else if (marks >= 60) {
                grade = 'C';
                remarks = 'Good';
            } else if (marks >= 50) {
                grade = 'D';
                remarks = 'Okay';
            } else {
                grade = 'F';
                remarks = 'Poor';
            }

            return { ...result, grade, remarks };
        });

        return res.json({ Status: true, Report: report });
    });
});

// Add student
router.post('/add_student', (req, res) => {
    // Extract values from request body
    const { name, registrationNumber, email, password, grade_id, gender_id, guardianPhone } = req.body;

    // Validate that all fields are provided
    if (!name || !registrationNumber || !email || !password || !grade_id || !gender_id || !guardianPhone) {
        return res.json({ Status: false, Error: 'All fields must be filled' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (error, hash) => {
        if (error) return res.json({ Status: false, Error: 'Error hashing password' });

        const sql = `INSERT INTO student (name, registrationNumber, email, password, grade_id, gender_id, guardianPhone) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            name,
            registrationNumber,
            email,
            hash,
            grade_id,
            gender_id,
            guardianPhone
        ];

        connection.query(sql, values, (error, result) => {
            if (error) return res.json({ Status: false, Error: 'Error executing query' });
            return res.json({ Status: true });
        });
    });
});


// Retrieve student
router.get('/student', (req, res) => {
    const sql = `SELECT s.name, s.registrationNumber, s.email, s.password, g.gradeName, s.guardianPhone, ge.name AS genderName FROM student s 
        JOIN grade g ON s.grade_id = g.id 
        JOIN gender ge ON s.gender_id = ge.id 
        ORDER BY s.name ASC`
    connection.query(sql, (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Retrieve the number of students in each grade
router.get('/student_count_by_grade', (req, res) => {
    const sql = `
        SELECT g.gradeName, COUNT(s.registrationNumber) AS studentCount
        FROM student s
        JOIN grade g ON s.grade_id = g.id
        GROUP BY g.gradeName
        ORDER BY g.gradeName ASC
    `;
    connection.query(sql, (error, result) => {
        if (error) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Retrieve students by grade ID
router.get('/students_by_grade/:grade_id', (req, res) => {
    const gradeId = req.params.grade_id;
    const sql = `
        SELECT s.name, s.registrationNumber, s.email 
        FROM student s 
        WHERE s.grade_id = ? 
        ORDER BY s.name ASC`;

    connection.query(sql, [gradeId], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error", error});
        return res.json({Status: true, Result: result});
    });
});

// Retrieve student by registration number
router.get('/student/:registrationNumber', (req, res) => {
    const registrationNumber = req.params.registrationNumber
    const sql = `SELECT s.name, s.registrationNumber, s.email, g.gradeName, s.guardianPhone, ge.name AS genderName FROM student s 
        JOIN grade g ON s.grade_id = g.id 
        JOIN gender ge ON s.gender_id = ge.id 
        WHERE registrationNumber = ?`
    connection.query(sql, [registrationNumber], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Calculating the number students by gender
router.get('/student_gender_distribution', (req, res) => {
    const sql = `SELECT gender_id, COUNT(*) as count FROM student GROUP BY gender_id`;
    connection.query(sql, (error, result) => {
        if (error) return res.json({ Status: false, Error: "Query Error" });
        
        let maleCount = 0, femaleCount = 0;
        result.forEach(row => {
            if (row.gender_id === 2) maleCount = row.count;
            else if (row.gender_id === 1) femaleCount = row.count;
        });
        
        return res.json({
            Status: true,
            maleCount,
            femaleCount
        });
    });
});

// Edit student by registration number
router.put('/edit_student/:registrationNumber', (req, res) => {
    const registrationNumber = req.params.registrationNumber;
    const { name, email, grade_id, guardianPhone, gender_id } = req.body;

    // Validate required fields
    if (!name || !email || !grade_id || !guardianPhone || !gender_id) {
        return res.json({ Status: false, Error: 'All fields are required.' });
    }

    const sql = `UPDATE student SET name = ?, email = ?, grade_id = ?, guardianPhone = ?, gender_id = ? WHERE registrationNumber = ?`;
    const values = [name, email, grade_id, guardianPhone, gender_id];

    connection.query(sql, [...values, registrationNumber], (error, result) => {
        if (error) return res.json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Delete student by registration number
router.delete('/delete_student/:registrationNumber', (req, res) => {
    const registrationNumber = req.params.registrationNumber
    const sql = 'Delete from student WHERE registrationNumber = ?'
    connection.query(sql, [registrationNumber], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error" + error})
        return res.json({Status: true, Result: result})
    })
})

// Add teacher
router.post('/add_teacher', (req, res) => {
    const { name, email, password, phone, address, qualification, subjects } = req.body

    // Check if all fields are provided
    if (!name || !email || !password || !phone || !address || !qualification || !subjects || subjects.length === 0) {
        return res.json({ Status: false, Error: 'All fields are required and at least one subject must be selected.' });
    }

    const sqlTeacher = `INSERT INTO teacher (name, email, password, phone, address, qualification) VALUES (?, ?, ?, ?, ?, ?)`
    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) return res.json({Status: false, Error: "Query Error"})
        const valuesTeacher = [name, email, hash, phone, address, qualification]

        connection.query(sqlTeacher, valuesTeacher, (error, result) => {
            if (error) return res.json({Status: false, Error: error})
            
            const teacherId = result.insertId;
            const sqlSubjects = `INSERT INTO teacher_subject (teacher_id, subject_id) VALUES ?`;
            const valuesSubjects = subjects.map(subjectId => [teacherId, subjectId]);
            
            connection.query(sqlSubjects, [valuesSubjects], (error, result) => {
                if (error) return res.json({Status: false, Error: error});
                return res.json({Status: true});
            });
        })
    })
})

// Retrieve teacher
router.get('/teachers', (req, res) => {
    const sql = `
        SELECT t.id, t.name, t.email, t.phone, t.address, t.qualification, 
        GROUP_CONCAT(s.subjectName) AS subjects
        FROM teacher t
        LEFT JOIN teacher_subject ts ON t.id = ts.teacher_id
        LEFT JOIN subject s ON ts.subject_id = s.id
        GROUP BY t.id;
    `;
    
    connection.query(sql, (error, results) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true, Result: results });
    });
});

// Retrieve teacher by id
router.get('/teacher/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM teacher WHERE id = ?"
    connection.query(sql, [id], (error, result) => {
        if (error) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Delete teacher by id
router.delete('/delete_teacher/:id', (req, res) => {
    const id = req.params.id;
    const deleteTeacherSubjectsSql = 'DELETE FROM teacher_subject WHERE teacher_id = ?';
    const deleteTeacherSql = 'DELETE FROM teacher WHERE id = ?';

    connection.query(deleteTeacherSubjectsSql, [id], (error, result) => {
        if (error) return res.json({ Status: false, Error: "Error deleting teacher's subjects: " + error });
        
        connection.query(deleteTeacherSql, [id], (error, result) => {
            if (error) return res.json({ Status: false, Error: "Error deleting teacher: " + error });
            return res.json({ Status: true, Result: result });
        });
    });
});

// Check if attendance is already taken for a specific date
router.get('/check_attendance', (req, res) => {
    const { date } = req.query;

    const sql = 'SELECT COUNT(*) as count FROM attendance WHERE date = ?';
    connection.query(sql, [date], (error, result) => {
        if (error) return res.json({ Status: false, Error: error });

        if (result[0].count > 0) {
            return res.json({ Status: true, AttendanceTaken: true });
        } else {
            return res.json({ Status: true, AttendanceTaken: false });
        }
    });
});

// Add attendance
router.post('/add_attendance', (req, res) => {
    const { date, attendance } = req.body; // attendance is an array of { student_id, status }

    // Check if attendance is already taken for the date
    const checkSql = 'SELECT COUNT(*) as count FROM attendance WHERE date = ?';
    connection.query(checkSql, [date], (error, result) => {
        if (error) return res.json({ Status: false, Error: error });

        if (result[0].count > 0) {
            return res.json({ Status: false, Error: 'Attendance already taken for this date.' });
        }

        const values = attendance.map(record => [record.registrationNumber, date, record.status]);

        // Ensure that there are values to insert
        if (values.length === 0) {
            return res.json({ Status: false, Error: 'No attendance records provided.' });
        }

        const sql = 'INSERT INTO attendance (registrationNumber, date, status) VALUES ?';

        connection.query(sql, [values], (error, result) => {
            if (error) return res.json({ Status: false, Error: error });
            return res.json({ Status: true });
        });
    })
});

// Retrieve attendance
router.get('/attendance', (req, res) => {
    const { grade_id } = req.query;
    const sql = `
        SELECT s.registrationNumber, s.name, a.date, a.status
        FROM student s
        LEFT JOIN attendance a ON s.id = a.student_id
        WHERE s.grade_id = ?
        ORDER BY a.date DESC
    `;

    connection.query(sql, [grade_id], (error, results) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true, Result: results });
    });
});

// Retrieve attendance records
router.get('/attendance_summary', (req, res) => {
    const { registrationNumber } = req.query;

    if (!registrationNumber) {
        return res.json({ Status: false, Error: 'No student selected.' });
    }
    
    const sql = `
        SELECT s.name, a.date, a.status 
        FROM attendance a 
        JOIN student s ON a.registrationNumber = s.registrationNumber 
        WHERE a.registrationNumber = ? 
        ORDER BY a.date DESC
    `;

    connection.query(sql, [registrationNumber], (error, results) => {
        if (error) return res.json({ Status: false, Error: error });

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

// Retrieve attendance summary by date
router.get('/attendance_summary_by_date', (req, res) => {
    const sql = `
        SELECT date_table.date, COALESCE(COUNT(attendance.date), 0) AS present_count
        FROM (
            SELECT DISTINCT date
            FROM attendance
        ) AS date_table
        LEFT JOIN attendance 
        ON date_table.date = attendance.date AND attendance.status = 'Present'
        GROUP BY date_table.date
        ORDER BY date_table.date ASC;
    `;

    connection.query(sql, (error, results) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true, Result: results });
    });
})

// Retrieve recorded attendance dates
router.get('/recorded_dates', (req, res) => {
    const sql = `
        SELECT DISTINCT date 
        FROM attendance
        ORDER BY date DESC
    `;

    connection.query(sql, (error, results) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true, Result: results });
    });
});

// Retrieve attendance summary for a specific date
router.get('/attendance_details_by_date', (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.json({ Status: false, Error: 'No date selected.' });
    }

    const sql = `
        SELECT s.name, a.status 
        FROM attendance a 
        JOIN student s ON a.registrationNumber = s.registrationNumber 
        WHERE a.date = ? 
        ORDER BY s.name ASC
    `;

    connection.query(sql, [date], (error, results) => {
        if (error) return res.json({ Status: false, Error: error });

        // Calculate totals
        const totalPresent = results.filter(record => record.status === 'present').length;
        const totalAbsent = results.filter(record => record.status === 'absent').length;
        const totalStudents = results.length;

        return res.json({ 
            Status: true, 
            Result: results,
            Totals: {
                totalPresent,
                totalAbsent,
                totalStudents
            }
        });
        return res.json({ Status: true, Result: results });
    });
});

// Fetching attendance data for today
router.get('/attendance_summary_today', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    const sqlPresent = `
        SELECT COUNT(*) as present_count
        FROM attendance
        WHERE status = 'Present' AND date = ?
    `;
    
    const sqlAbsent = `
        SELECT COUNT(*) as absent_count
        FROM attendance
        WHERE status = 'Absent' AND date = ?
    `;
    
    connection.query(sqlPresent, [today], (error, presentResults) => {
        if (error) return res.json({ Status: false, Error: error });

        connection.query(sqlAbsent, [today], (error, absentResults) => {
            if (error) return res.json({ Status: false, Error: error });
            
            return res.json({
                Status: true,
                Present: presentResults[0].present_count,
                Absent: absentResults[0].absent_count,
            });
        });
    });
});

// Retrieving student performance data
router.get('/student_performance', (req, res) => {
    const sql = `
        SELECT s.registrationNumber, s.name, SUM(er.marks) AS totalScore
        FROM student s
        JOIN examresults er ON s.registrationNumber = er.registrationNumber
        GROUP BY s.registrationNumber, s.name
        ORDER BY totalScore DESC
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }
        return res.json({ Status: true, Result: results });
    });
});

// Calculating the average scores
router.get('/grade_performance', (req, res) => {
    // Calculate average score for each student
    const studentPerformanceSQL = `
        SELECT g.gradeName, s.registrationNumber, s.name, SUM(er.marks) / COUNT(DISTINCT er.examRegCode) AS avgScore
        FROM student s
        JOIN examresults er 
        ON s.registrationNumber = er.registrationNumber
        JOIN grade g 
        ON s.grade_id = g.id
        GROUP BY s.registrationNumber, s.name, g.gradeName
    `;

    connection.query(studentPerformanceSQL, (error, studentResults) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }

        // Calculate average score for each grade
        const gradePerformanceSQL = `
            SELECT gradeName, AVG(avgScore) AS gradeAvgScore
            FROM (${studentPerformanceSQL}) AS studentPerformance
            GROUP BY gradeName
        `;

        connection.query(gradePerformanceSQL, (error, gradeResults) => {
            if (error) {
                console.error('Database query error:', error);
                return res.json({ Status: false, Error: error });
            }

            return res.json({ 
                Status: true, 
                StudentPerformance: studentResults,
                GradePerformance: gradeResults 
            });
        });
    });
});

router.get('/best_performers', (req, res) => {
    const sql = `
        SELECT s.registrationNumber, s.name, SUM(er.marks) AS totalScore
        FROM student s
        JOIN examresults er ON s.registrationNumber = er.registrationNumber
        GROUP BY s.registrationNumber, s.name
        ORDER BY totalScore DESC
        LIMIT 5
    `;
    
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.json({ Status: false, Error: error });
        }
        return res.json({ Status: true, Result: results });
    });
});

//Upload picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/update_general_settings', upload.single('logo'), (req, res) => {
    const { school_name, address, email, phone_number, start_date, end_date, date_format } = req.body;
    const logo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `UPDATE general_settings SET school_name = ?, logo_url = ?, address = ?, email = ?, phone_number = ?, start_date = ?, end_date = ?, date_format = ? WHERE id = ?`;

    const values = [school_name, logo_url, address, email, phone_number, start_date, end_date, date_format, 1]; // assuming id = 1 for general settings

    connection.query(sql, values, (error, result) => {
        if (error) return res.json({ Status: false, Error: error });
        return res.json({ Status: true });
    });
});

export {router as adminRouter}