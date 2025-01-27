const express = require("express") 
const mysql = require("mysql2/promise") 
const jwt = require("jsonwebtoken") 
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser") 
const { log } = require("console")
const { CLIENT_RENEG_LIMIT } = require("tls")
const { clearScreenDown } = require("readline")

const app = express() 
const PORT = 5018 
const JWT_SECRET = "Lijinfeng20225018" 
app.use(bodyParser.json()) 

const db = mysql.createPool({
    host: "localhost",
    user: "neu_study",
    password: "NEU_STUDY", 
    database: "neu_study", 
}) 

app.post("/api/auth", async (req, res) => {
    const { username, password } = req.body 
    try {
        const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]) 

        if (users.length > 0) {
            const user = users[0] 
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
                const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" }) 
                return res.status(200).json({ message: "登录成功", token }) 
            } else {
                return res.status(401).send("密码错误") 
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10) 
            await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
                username,
                hashedPassword,
            ]) 
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" }) 
            return res.status(201).json({ message: "注册成功", token }) 
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("服务器错误") 
    }
}) 

function authenticateToken(req, res, next) {
    const token = req.header("Authorization") 
    if (!token) return res.status(401).send("未授权访问") 

    try {
        const user = jwt.verify(token, JWT_SECRET) 
        req.body.username = user.username
        next() 
    } catch {
        res.status(403).send("令牌无效") 
    }
}

app.post("/api/store-json", authenticateToken, async (req, res) => {
    const { json } = req.body 
    if (!json || !Array.isArray(json)) return res.status(400).send("无效的 JSON 数据") 
    try {
        const query = `
            INSERT INTO user_json_data (username, json_data)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE json_data = VALUES(json_data) 
        ` 
        await db.query(query, [req.body.username, JSON.stringify(json)]) 
        res.status(201).send("保存成功") 
    } catch (err) {
        console.log(err)
        res.status(500).send("服务器错误") 
    }
}) 

app.get("/api/all-json", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT users.username, user_json_data.json_data 
            FROM users
            JOIN user_json_data ON users.username = user_json_data.username
        `) 
        res.status(201).json(rows) 
    } catch (err) {
        console.log(err)
        res.status(500).send("服务器错误") 
    }
}) 


app.listen(PORT, () => {
    console.log(`关注???喵，关注???谢谢喵`) 
}) 