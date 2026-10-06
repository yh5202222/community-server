const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// 数据库
const db = new sqlite3.Database('./app.db');
db.run(`CREATE TABLE IF NOT EXISTS user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT
)`);
db.run(`CREATE TABLE IF NOT EXISTS post(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 邮箱配置
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// 发帖接口
app.post('/api/post', (req,res)=>{
    const {content}=req.body;
    db.run(`INSERT INTO post(content) VALUES(?)`,[content],err=>{
        if(err) return res.json({code:0,msg:"失败"});
        res.json({code:1,msg:"发布成功"});
    })
})

// 获取帖子列表
app.get('/api/post/list',(req,res)=>{
    db.all(`SELECT * FROM post ORDER BY id DESC`,(err,rows)=>{
        res.json({code:1,data:rows})
    })
})

app.listen(port,()=>{
    console.log("服务启动");
})
