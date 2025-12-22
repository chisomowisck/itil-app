# ITIL 4 Foundation Exam Prep App 🎓

A comprehensive, interactive web application for preparing for the ITIL 4 Foundation exam. Built with Next.js 16, featuring 487 unique questions covering all ITIL 4 Foundation topics.

![ITIL 4 Exam Prep](https://img.shields.io/badge/ITIL%204-Foundation-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### 🎯 Mock Exams
- **Full-length practice exams** with 40 randomly selected questions
- **60-minute timer** to simulate real exam conditions
- **65% passing score** (26 out of 40 questions)
- **Comprehensive results** with detailed feedback on each question
- **Question navigation** - jump to any question during the exam
- **Visual indicators** showing answered/unanswered questions

### 🧠 Practice Mode
- **Immediate feedback** - see if you're correct right away
- **Learn as you go** with instant answer explanations
- **Track your progress** with correct/incorrect counters
- **Navigate freely** between questions
- **No time pressure** - take as long as you need

### ⚡ Flashcards
- **Interactive flashcard interface** for quick learning
- **Flip animation** to reveal answers
- **Shuffle feature** to randomize questions
- **Progress tracking** with visual progress bar
- **Perfect for memorization** of key concepts

### 📚 Category-Based Learning
- **15+ categories** covering all ITIL 4 topics:
  - Incident Management
  - Problem Management
  - Change Control & Enablement
  - Service Desk
  - Service Level Management
  - Service Request Management
  - Continual Improvement
  - Release & Deployment Management
  - IT Asset Management
  - Event & Monitoring Management
  - Information Security
  - Relationship Management
  - Supplier Management
  - Guiding Principles
  - Service Value System
  - Four Dimensions of Service Management
  - And more!

### 📖 Study Guide
- **Quick reference** for all ITIL 4 concepts
- **7 Guiding Principles** explained
- **4 Dimensions** of Service Management
- **Service Value Chain** activities
- **Key practices** overview
- **Exam tips** and strategies

### 🎨 Modern UI/UX
- **Beautiful gradient designs** with smooth animations
- **Dark mode support** for comfortable studying
- **Fully responsive** - works on desktop, tablet, and mobile
- **Intuitive navigation** with clear visual feedback
- **Accessible design** following best practices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd itil-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
itil-app/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── mock-exam/           # Mock exam feature
│   ├── practice/            # Practice mode
│   ├── flashcards/          # Flashcards feature
│   ├── categories/          # Category-based learning
│   ├── progress/            # Progress tracking (coming soon)
│   └── study-guide/         # Study guide
├── public/
│   └── data/
│       └── questions.json   # All 487 questions
├── scripts/
│   └── parse-questions.py   # Question parser script
└── README.md
```

## 📊 Question Database

- **487 unique questions** sourced from the [Ditectrev ITIL 4 Foundation Repository](https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers)
- **Automatically categorized** by topic
- **Multiple choice format** matching real exam style
- **Regularly updated** to reflect latest ITIL 4 standards

## 🛠️ Technologies Used

- **Next.js 16.1.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Beautiful icons
- **Python** - Question parsing script

## 🎯 Exam Information

- **Questions**: 40 multiple choice
- **Duration**: 60 minutes
- **Passing Score**: 65% (26 out of 40)
- **Format**: Multiple choice
- **Topics**: All ITIL 4 Foundation syllabus areas

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is for educational purposes. Questions are sourced from the public [Ditectrev repository](https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers).

## 🙏 Acknowledgments

- Questions sourced from [Ditectrev ITIL 4 Foundation Repository](https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers)
- Built with ❤️ for ITIL 4 exam candidates

## 📧 Support

Good luck with your ITIL 4 Foundation exam! 🎓✨

---

**Note**: This is a practice tool. Always refer to official ITIL 4 documentation and authorized training materials for comprehensive exam preparation.
