const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var cors = require('cors')
const app = express();
const port = 3000 || process.env.PORT;
dotenv.config();
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
const tableName = "ss"

// Create Table
app.get('/create-table', (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ss (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            OTP VARCHAR(10) NOT NULL,
            OTP_Exp DATETIME NOT NULL,
            OTP_Gen_Date DATETIME NOT NULL,
            Password VARCHAR(15)  NULL,
            otpSent BOOLEAN DEFAULT FALSE
        );
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).send('Error creating table');
        }
        console.log('emp table created successfully.');
        res.send('emp table created successfully.');
    });
});

// CREATE 1
app.post('/signup', (req, res) => {
    const { name, email, phone } = req.body;
    if (phone.length !== 10) return res.status(401).json({ err: "Invalid Phone Number" });
    const currentTime = new Date();
    const OTP_Gen_Date = currentTime;
    const OTP_Exp = new Date(currentTime.getTime() + 5 * 60000); // 60000 ms = 1 minute
    const OTP = generateOTP();

    db.query(`INSERT INTO ${tableName} (name,OTP, OTP_Exp, OTP_Gen_Date, email, phone, otpSent) VALUES (?, ?, ?, ?, ?, ?,?)`,
        [name, OTP, OTP_Exp, OTP_Gen_Date, email, phone, false], (err, result) => {
            if (err) return res.status(500).send(err.message);

            const insertedId = result.insertId; // Get the inserted ID
            db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [insertedId], (err, insertedData) => {
                if (err) return res.status(500).send(err.message);
                res.status(201).json({ result: "Created successfully", id: insertedData[0].id });

                console.log("phone : ", insertedData[0].phone);
                // Send Otp to Customer phone insertedData[0].phone
            });
        });
});
// OTP UPDATE 2
app.get('/OTPVerify/:id/:OTP', (req, res) => {
    const { id, OTP } = req.params;
    console.log("OTP", OTP, typeof (OTP));

    db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, insertedData) => {
        if (err) return res.status(500).send(err.message);

        const currentTime = new Date();
        const OTP_Exp = new Date(insertedData[0].OTP_Exp);

        if (currentTime > OTP_Exp) {
            return res.status(401).json({ result: "Time Out" });
        };
        if (insertedData[0].OTP != OTP) {
            return res.status(402).json({ result: "Invalid OTP" });
        } else {
            db.query(`UPDATE ${tableName} SET otpSent = ? WHERE id = ?`, [true, id], (err, result) => {
                if (err) return res.status(500).send(err.message);
                res.status(200).json({ result: "verify successfully",id: insertedData[0].id });
            });
        }
    });
});
// Password UPDATE 3
app.put('/PasswordUpdate/:id', (req, res) => {
    const { id } = req.params;
    const { Password, ConformPassword } = req.body;
    if (Password !== ConformPassword) return res.status(400).json({ err: "Passwords do not match" });

    db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, insertedData) => {
        if (err) return res.status(500).send(err.message);
        if (!insertedData.length || !insertedData[0].otpSent) return res.status(301).send({ err: "phone not validate" });

        db.query(`UPDATE ${tableName} SET Password = ? WHERE id = ?`, [Password, id], (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.status(200).json({ result: "Password Updated successfully" });
        });
    });
});
//LOG IN With phone 4
app.post('/login/phone', (req, res) => {
    const { phone } = req.body;
    db.query(`SELECT * FROM ${tableName} WHERE phone = ?`, [phone], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.length === 0) return res.status(401).send('Invalid phone');
        if (result[0].otpSent === 0) return res.status(301).json(result[0].id);
        const status = result[0].Password === "" ? 302 : 303;
        res.status(status).json(result[0].id);
    });
});



// READ
app.get('/Users', (req, res) => {
    db.query(`SELECT * FROM ${tableName}`, (err, results) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).json(results);
    });
});
// UPDATE
app.put('/UsersOTP/:id', (req, res) => {
    const { id } = req.params;
    const { OTP } = req.body;
    db.query('UPDATE Users SET OTP = ? WHERE id = ?', [OTP, id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).json({ result: "Updated successfully" });
    });
});
// OTP UPDATE 
app.put('/OTPUpdate/:id', (req, res) => {
    const { id } = req.params;
    const { OTP } = req.body;

    // Check OTP code here

    db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, insertedData) => {
        if (err) return res.status(500).send(err.message);

        const currentTime = new Date();
        const OTP_Exp = new Date(insertedData[0].OTP_Exp);

        if (currentTime > OTP_Exp) {
            return res.status(502).json({ result: "Time Out" });
        } else {
            db.query(`UPDATE ${tableName} SET OTP = ?, otpSent = ? WHERE id = ?`, [OTP, true, id], (err, result) => {
                if (err) return res.status(500).send(err.message);
                res.status(200).json({ result: "Updated successfully" });
            });
        }
    });
});
//LOG IN
app.post('/login', (req, res) => {
    const { User_Name, Password, OTP, OTP_Exp, OTP_Gen_Date } = req.body;
    db.query('SELECT * FROM Users WHERE Customer_Name = ? AND Password = ?', [User_Name, Password, OTP, OTP_Exp, OTP_Gen_Date], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.length > 0) {
            console.log("result:0", result[0]);

            var token = jwt.sign(result[0].id, 'privateKey');
            res.cookie('loginToken', token, { maxAge: 900000, httpOnly: false }).end(token);
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// DELETE
app.delete('/Users/:id', (req, res) => {
    const { id } = req.params;
    db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).json({ result: "Deleted successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

function generateOTP() {
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
