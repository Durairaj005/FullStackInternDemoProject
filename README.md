# Feedants Full-Stack Development Internship Technical Assignment
## Competition Details Module — Production-Grade Implementation

A functional full-stack **Competition Details Module** for the **Feedants Creator Competition Platform**, built with:
- **Frontend**: React Native (Expo) + TypeScript
- **Backend**: Node.js + Express.js (RESTful API, modular architecture)
- **Database**: MongoDB + Mongoose (atomic transactions, schema constraints, indexing)

---

## 📸 Design Reference Implementation

The screen faithfully implements every section and detail from the provided Feedants design specification:

1. **Header & Top Bar**:
   - "← Go back" action navigation.
   - Dual-language pill toggle: `[ENG]` (active Feedants teal `#00665C`) & `[हिंदी]`.

2. **Hero Header Card**:
   - Competition Title ("Feedants Classical Dance").
   - Dynamic user status tag (`[✓ Registered]` in soft teal pill or `[Open for entry]`).
   - Category tags: `Dance`, `Multi-Win`, `🏆 Winners get certificate`.
   - Financial stats: **Prize Pool** (`₹ 1,500` in emerald bold) & **Entry Fee** (`₹ 99`).
   - Participation counter: `👥 Only 19 spots left` with visual progress meter and `1 / 20 Booked`.

3. **Judge Profile Card**:
   - Circular avatar with subtle border.
   - Name ("Manju Dubey"), designation ("Professional Kathak Dancer"), and verified experience ("12+ Years of Experience").
   - Interactive circular `▶ Intro Video` play button.

4. **Real-Time Countdown Ribbon**:
   - Mint container (`#EBF5F3`) with live ticking timer: `01d : 06h : 28m : 32s`.
   - Dynamic urgency styling with `⏱ Hurry up!` badge when registration closes soon.

5. **Important Dates Grid (2x2)**:
   - 📅 **Register Before**: `10 Aug 26`, `11:50 PM`
   - 🚀 **Submission Starts**: `6 Aug 26`, `04:00 AM`
   - 📤 **Submission Ends**: `30 Aug 26`, `11:55 PM`
   - 🏆 **Result Date**: `1 Sept 26`, `11:50 PM`

6. **Previous Winners Carousel**:
   - Horizontal scrollable row of winner preview cards (Riya Shah, Aarav Mehta, Neha Verma, Ishita Chouhan).
   - Video overlay thumbnail with play icon and rank title (`1st Winner`, `2nd Winner`).

7. **Multi-Tab Details Section**:
   - **About Competition**: Expandable text toggle (`View more ∨` / `View less ∧`).
   - **Judging Parameters**: Scoring criteria with weighted percentages (`40%`, `30%`, `20%`, `10%`).
   - **Rules & Eligibility**: Eligibility rules, video guidelines, and submission requirements.

8. **Rewards (All Positions)**:
   - Rank breakdown from 1st to 6th with custom iconography (🥇 1st ₹550, 🥈 2nd ₹300, 🥉 3rd ₹240, 4th ₹200, 5th ₹130, 6th ₹80).

9. **Paid Participation Disclaimer**:
   - `ⓘ Disclaimer: Only contributions from paid participants will be considered for judging.`

10. **Trust Badges & Payment Security**:
    - "How will you receive prize money? Watch video to know more" with interactive playback alert.
    - Refund policy guarantee.
    - "Secure payments powered by **Razorpay**".

11. **Referral Discount Banner**:
    - "Refer & Earn more discount".
    - Referral URL box with functional `[Copy Link]` and native `[Refer Now]` share triggers.
    - "You earn ₹10 for every signup".

12. **Community Feedback & Ad Slots**:
    - "Hear From Our Users" preview row.
    - Dashed "📢 Ad Here" placeholder banner.

13. **Sticky Action CTA Bar**:
    - When unregistered: `Register Now` (Subtext: `₹99 Entry Fee` / `Spots Left`).
    - When registered: `Upload Submission` (Subtext: `Registered` with modal cancellation option).
    - When full or ended: State-aware disabled button (`Competition Full` / `Registration Closed`).

14. **Bottom App Tab Bar**:
    - `🏠 Home`, `🔍 Explore`, `➕ (Center FAB)`, `🏆 Competitions (Active)`, `👤 Profile`.

---

## ⚡ Concurrency & Data Integrity Strategy

To ensure zero race conditions and prevent overbooking when multiple users register simultaneously:

1. **Atomic MongoDB Decrement (`$inc`) with Guard Condition**:
   ```javascript
   const competition = await Competition.findOneAndUpdate(
     {
       _id: competitionId,
       registeredCount: { $lt: maxParticipants } // Atomic concurrency guard
     },
     { $inc: { registeredCount: 1 } },
     { new: true, session }
   );
   ```
2. **MongoDB Multi-Document ACID Transactions**:
   - Registration record creation and competition spot counter increments are executed inside a unified transaction session.
   - If user is already registered or spots are exhausted, transaction automatically aborts without orphaned records.
3. **Unique Compound Indexing**:
   - `RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true })` ensures idempotent registrations.

---

## 🗂 Project Structure

```
FullStackIntern/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection
│   │   ├── constants/       # Lifecycle enums and statuses
│   │   ├── controllers/     # Competition & registration handlers
│   │   ├── middleware/      # Error handler, request logger, rate limiting
│   │   ├── models/          # Competition and Registration Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── scripts/         # Database seed script
│   │   ├── services/        # Business logic & concurrency coordination
│   │   └── utils/           # Date & validation utilities
│   ├── package.json
│   ├── server.js            # Express app entry point
│   └── .env.example         # Environment template (copy to .env locally)
│
└── mobile/
    ├── src/
    │   ├── api/             # Typed API client
    │   ├── components/      # Modular UI components
    │   ├── hooks/           # useCompetition custom React hook
    │   ├── screens/         # CompetitionDetailsScreen
    │   ├── theme/           # Feedants color palette, tokens, typography
    │   ├── types/           # TypeScript interfaces
    │   └── utils/           # Date formatting & currency helpers
    ├── App.tsx              # Mobile entry
    └── package.json
```

---

## 🚀 Running the Project

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js v24)
- **MongoDB**: Community Server running on `127.0.0.1:27017` (or MongoDB Atlas URI)

### 2. Configure Environment & Start the Backend

1. **Set Up Local Environment Variables**:
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cd backend
   cp .env.example .env
   # On Windows PowerShell:
   # Copy-Item .env.example .env
   ```
   *Note: `.env` is ignored by Git to protect sensitive settings. Fill in your own values (defaults to `PORT=5000` and `MONGODB_URI=mongodb://127.0.0.1:27017/feedants`).*

2. **Install Dependencies, Seed & Run**:
   ```bash
   npm install
   npm run seed     # Seeds 4 competitions across all lifecycle states
   npm start        # Starts server on http://localhost:5000
   ```
Health Check: `http://localhost:5000/health`

### 3. Start the Mobile Frontend
```bash
cd mobile
npm install
npm start        # Starts Expo dev server
```
- Press `w` to open in Web Browser.
- Or scan QR code using Expo Go on Android or iOS.

---

## 🧪 Evaluator Demo Toolbar

At the top of the mobile screen, an **Evaluator Demo Toolbar** is embedded to allow instant evaluation:
- **Simulate User**:
  - `User 1 (Registered)`: Demonstrates already registered state, viewing status, and upload submission action.
  - `User 2 (Unregistered)`: Demonstrates registration flow, dynamic spot decrement, and live UI updates.
- **Lifecycle Switcher**:
  - `Dance (Active)`: 19/20 spots open, live countdown ticking.
  - `Singing (Upcoming)`: Pre-registration stage.
  - `Painting (Full)`: 15/15 spots taken, disabled CTA.
  - `Poetry (Active)`: 24/30 spots taken, closing soon urgency.
