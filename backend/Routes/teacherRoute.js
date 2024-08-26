import express, { response } from 'express'
import connection from '../Utilities/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/teacherLogin', (req, res) => {
    const sql = "SELECT * from teacher WHERE email = ?"
    connection.query(sql, [req.body.email], (error, result) => {
        if (error) return res.json({loginStatus: false, Error: "Query error"})
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (error, response) => {
                if (error) return res.json({loginStatus: false, Error: "Query error"})
                if (response) {
                    const email = result[0].email
                    const token = jwt.sign(
                        { role: "teacher", email: email, id: result[0].id },
                        "jwt_secret_key",
                        { expiresIn: "1h" }
                    )
                    res.cookie('token', token)
                    return res.json({ loginStatus: true, id: result[0].id})
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
    if (!token) return res.json({ auth: false, message: "No token provided" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ auth: false, message: "Failed to authenticate token" })
    
        const sql = `
        SELECT t.id, t.name, t.email, t.phone, t.address, t.qualification,
        GROUP_CONCAT(s.subjectName) AS subjects
        FROM teacher t
        LEFT JOIN teacher_subject ts ON t.id = ts.teacher_id
        LEFT JOIN subject s ON ts.subject_id = s.id
        WHERE t.id = ?
    `;
        connection.query(sql, [decoded.id], (error, result) => {
            if (error) return res.json({ auth: false, message: "Query error" });
            if (result.length > 0) {
                const teacher = result[0];
                return res.json({ auth: true, teacher });
            } else {
                return res.json({ auth: false, message: "No teacher found" });
            }
        })
    })
})

export {router as teacherRouter}