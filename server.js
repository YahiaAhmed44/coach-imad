const fs = require('fs');
const path = require('path');
const axios = require("axios");
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// قراءة الملف وتحويله إلى base64
const filePath = path.join(__dirname, "assets", "free.pdf");
const fileContent = fs.readFileSync(filePath).toString("base64");

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files from /public folder


// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // Your Gmail address
    pass: process.env.EMAIL_PASS,     // Your Gmail App Password
  },
});

// Verify email connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

// ================= ROUTE: FREE BOOK =================
app.post('/api/free-book', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني مطلوبان' });
  }
  
  try {
    await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: {
              name: "Ahmed",
              email: process.env.EMAIL_USER
            },
            to: [
              {
                email: process.env.OWNER_EMAIL,
                name: "IMOKENWAY"
              }
            ],
            subject: "📥 طلب كتاب مجاني جديد",
            htmlContent: `
                <div dir="rtl" style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px; border-radius:8px;">
                  <h2 style="color:#ff6b35;">📥 طلب كتاب مجاني جديد</h2>
                  <table style="width:100%; border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px; font-weight:bold; color:#333;">الاسم:</td>
                      <td style="padding:8px; color:#555;">${name}</td>
                    </tr>
                    <tr style="background:#f0f0f0;">
                      <td style="padding:8px; font-weight:bold; color:#333;">البريد الإلكتروني:</td>
                      <td style="padding:8px; color:#555;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; font-weight:bold; color:#333;">التاريخ:</td>
                      <td style="padding:8px; color:#555;">${new Date().toLocaleString('ar-DZ')}</td>
                    </tr>
                  </table>
                </div>
              `
          },
          {
            headers: {
              "api-key": process.env.BREVO_API_KEY,
              "Content-Type": "application/json"
            }
          }
        );

    await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: {
              name: "عماد سالمي - مدرب لياقة",
              email: process.env.EMAIL_USER
            },
            to: [
              {
                email: email,
                name: name
              }
            ],
            subject: "🎁 كتابك المجاني جاهز!",
            htmlContent: `
                <div dir="rtl" style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px; border-radius:8px;">
                  <h2 style="color:#ff6b35;">مرحباً ${name}! 👋</h2>
                  <p style="color:#555; font-size:16px;">شكراً لاهتمامك! ستجد الكتاب المجاني مرفقاً في هذا الإيميل.</p>
                  <p style="color:#555; font-size:16px;">استمتع بقراءته وابدأ رحلتك اليوم 💪</p>
                  <hr style="border:1px solid #eee; margin:20px 0;">
                  <p style="color:#999; font-size:13px;">عماد سالمي - مدرب لياقة بدنية محترف</p>
                </div>
              `,
              attachment: [
                {
                  name: "الكتاب-المجاني-عماد-سالمي.pdf",
                  content: fileContent
                }
              ]
          },
          {
            headers: {
              "api-key": process.env.BREVO_API_KEY,
              "Content-Type": "application/json"
            }
          }
        );


    res.json({ success: true, message: 'شكراً! سيصلك الكتاب المجاني على بريدك الإلكتروني قريباً 📧' });
  } catch (error) {
    console.error('Free book email error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى' });
  }
});


// ================= ROUTE: CONTACT FORM =================
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني والرسالة مطلوبة' });
  }

  try {
    
    // Notify the owner with full message details
    await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: {
              name: "موقع عماد سالمي",
              email: process.env.EMAIL_USER
            },
            to: [
              {
                email: process.env.OWNER_EMAIL,
                name: "IMOKENWAY"
              }
            ],
            replyTo: {
              email: email,
              name: name
            }, // ← الرد يذهب مباشرة للعميل
            subject: `💬 رسالة جديدة من ${name}`,
            htmlContent: `
                <div dir="rtl" style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px; border-radius:8px;">
                  <h2 style="color:#ff6b35;">💬 رسالة تواصل جديدة</h2>
                  <table style="width:100%; border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px; font-weight:bold; color:#333;">الاسم:</td>
                      <td style="padding:8px; color:#555;">${name}</td>
                    </tr>
                    <tr style="background:#f0f0f0;">
                      <td style="padding:8px; font-weight:bold; color:#333;">البريد الإلكتروني:</td>
                      <td style="padding:8px; color:#555;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; font-weight:bold; color:#333;">رقم الهاتف:</td>
                      <td style="padding:8px; color:#555;">${phone || 'لم يُذكر'}</td>
                    </tr>
                    <tr style="background:#f0f0f0;">
                      <td style="padding:8px; font-weight:bold; color:#333;">التاريخ:</td>
                      <td style="padding:8px; color:#555;">${new Date().toLocaleString('ar-DZ')}</td>
                    </tr>
                  </table>
                  <div style="margin-top:20px; padding:16px; background:#fff; border-right:4px solid #ff6b35; border-radius:4px;">
                    <p style="font-weight:bold; color:#333; margin-bottom:8px;">الرسالة:</p>
                    <p style="color:#555; line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
                  </div>
                  <div style="margin-top:16px;">
                    <a href="mailto:${email}" style="background:#ff6b35; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none;">رد على ${name}</a>
                  </div>
                </div>
              `
          },
          {
            headers: {
              "api-key": process.env.BREVO_API_KEY,
              "Content-Type": "application/json"
            }
          }
        );

    res.json({ success: true, message: 'شكراً لتواصلك! سأرد عليك في أقرب وقت ممكن 💪' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى' });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});