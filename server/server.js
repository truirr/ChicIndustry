const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

// --- CORS ---
const allow = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map(s => s.trim());

app.use(cors({
  origin(origin, cb) {
    if (!origin || allow.includes("*") || allow.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error("CORS blocked"), false);
  }
}));

app.use(express.json({ limit: "200kb" }));

// Лимит на 20 писем в минуту
app.use("/api/contact", rateLimit({ windowMs: 60_000, max: 20 }));

// --- Nodemailer SMTP ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

transporter.verify((err) => {
  if (err) console.error("SMTP error:", err);
  else console.log("SMTP готово к отправке писем");
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name = "", email = "", message = "", company = "" } = req.body || {};
    if (!email || !message) return res.status(400).json({ ok:false, error:"email и message обязательны" });
    if (company.trim()) return res.json({ ok:true }); // honeypot

    await transporter.sendMail({
      from: `"Website" <${process.env.GMAIL_USER}>`,
      to: process.env.TARGET_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: "Новое сообщение с сайта",
      text: `Имя: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>Новое сообщение с сайта</h2>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Email/Телефон:</b> ${email}</p>
        <p><b>Сообщение:</b><br>${message}</p>
      `
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("Ошибка отправки:", e);
    res.status(500).json({ ok:false, error:"Не удалось отправить письмо" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Mailer listening on ${PORT}`));
