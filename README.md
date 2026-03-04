# 🏋️ عماد سالمي - Backend Server

## الهيكل
```
backend/
├── server.js          ← الخادم الرئيسي
├── package.json
├── .env.example       ← نموذج متغيرات البيئة
├── .gitignore
└── public/
    ├── index.html     ← (انسخ ملفك هنا)
    ├── style.css      ← (انسخ ملفك هنا)
    └── script.js      ← (استخدم هذا الملف المحدّث)
```

---

## 🚀 خطوات التشغيل

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد البريد الإلكتروني

انسخ ملف `.env.example` وسمّه `.env`:
```bash
cp .env.example .env
```

ثم عدّله بمعلوماتك:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx   # App Password من Google
OWNER_EMAIL=emad@example.com     # بريدك لاستقبال الرسائل
PORT=3000
```

### 3. الحصول على Gmail App Password
1. اذهب إلى [myaccount.google.com](https://myaccount.google.com)
2. الأمان → التحقق بخطوتين (فعّله إذا لم يكن مفعّلاً)
3. التحقق بخطوتين → كلمات مرور التطبيقات
4. أنشئ كلمة مرور لـ "Mail" وانسخها في `EMAIL_PASS`

### 4. نقل ملفات الموقع
انسخ `index.html` و `style.css` (وأي صور) إلى مجلد `public/`.
ملف `script.js` الجديد موجود بالفعل في `public/`.

### 5. تشغيل الخادم
```bash
# للإنتاج
npm start

# للتطوير (مع إعادة تشغيل تلقائية)
npm run dev
```

الموقع سيعمل على: **http://localhost:3000**

---

## 📡 API Endpoints

| المسار | الطريقة | البيانات | الوصف |
|--------|---------|---------|-------|
| `/api/free-book` | POST | `{ name, email }` | طلب الكتاب المجاني |
| `/api/notify` | POST | `{ email }` | الاشتراك في قائمة الانتظار |
| `/api/contact` | POST | `{ name, email, phone, message }` | نموذج التواصل |

---

## ☁️ النشر على الإنترنت (Hosting)

**Railway** (الأسهل - مجاني):
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. أضف متغيرات البيئة في لوحة التحكم

**Render** (مجاني):
1. [render.com](https://render.com) → New Web Service
2. أضف متغيرات البيئة في Environment

**VPS** (مثل DigitalOcean / Hostinger):
```bash
# تثبيت PM2 لإدارة العملية
npm install -g pm2
pm2 start server.js --name "fitness-site"
pm2 save
pm2 startup
```