# 💜 HerSafety — AI-Powered Safety App for Women 

> “You are not alone.”

**HerSafety** is a personal safety app built to help women feel safer, smarter, and more supported — wherever they are. Whether you're out late, in a new city, or just want to share your location with a trusted friend, HerSafety is with you every step of the way.

No clutter. No fear. Just help when you need it most.

---

## 🌟 What Can HerSafety Do?

### 🚨 One-Tap SOS (or Voice, or Shake!)
- Send your **live GPS location** and a custom alert to **3 emergency contacts**
- Triggers via button, **voice command** (“help me”), or phone shake
- **Stealth mode** hides the SOS screen behind a fake app layout

### 🧠 Smart Guardian Mode
- Uses your phone’s mic and motion sensors to detect signs of distress
- Triggers SOS even when you can’t — voice detection, fall detection, panic code
- Records and encrypts audio automatically when activated

### 🗺 SafeRoute (Real-Time Safer Navigation)
- Suggests **safer routes** based on recent crime data, lighting, and police presence
- Shows **heatmaps** of danger zones and alternate routes
- Community-powered feedback: mark streets as “safe”, “avoid”, etc.

### 🛰 Live Threat Radar (Inspired by HearShot)
- Monitors **police alerts, news**, and **user-submitted incidents**
- AI (GPT) **summarizes** reports into clear warnings
- Sends **area-specific push alerts**:  
  _“Warning: Abduction reported 300m ahead. Avoid XYZ street.”_

### 📝 Report a Crime Anonymously
- Step-by-step form with optional photo, audio, and description
- GPS is auto-detected but editable
- Anonymous by default — you choose to share more if you want

### 📚 Learn & Get Empowered
- Understand **your legal rights**, what to do after an incident, and how to get help
- Includes verified emergency contacts for **every state in India**
- Clean design, **multi-language**, and mobile-friendly

### 🏥 Local Help Directory
- Browse verified **NGOs, police stations, hospitals, and shelters**
- Filter by location and type
- Tap to call or open in Maps

---

## 💻 Built With

| Tech | Stack |
|------|-------|
| **Frontend** | React.js + Tailwind CSS (Mobile-first, fast UI) |
| **Backend** | Node.js + Express.js |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **APIs Used** | Google Maps, OpenAI (GPT + Whisper), Twilio |
| **Hosting** | Vercel (Frontend) + Supabase Edge Functions |

---

## 📦 How to Run It Locally

```bash
# Clone the project
git clone https://github.com/yourusername/hersafety
cd hersafety

# Install dependencies
npm install

# Add your environment variables (.env)
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - OPENAI_API_KEY
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_PHONE_NUMBER
# - GOOGLE_MAPS_API_KEY

# Run the development server
npm run dev
