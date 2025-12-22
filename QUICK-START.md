# Quick Start Guide

## 🚀 Running the Application

### In Your Terminal (Git Bash)
Simply run:
```bash
npm run dev
```

Then open your browser to:
```
http://localhost:3000
```

---

## 🎯 What You'll See

### Home Page
- Clean black and white design
- 6 feature cards (Mock Exams, Practice, Flashcards, etc.)
- Stats showing 487 questions, 15+ categories
- Large "Start Mock Exam" button

### Mock Exam Features

#### 1. **Sidebar (Left Side)**
- Shows all 40 questions in a grid
- Current question highlighted in black
- Answered questions have gray background
- Flagged questions show a small flag icon
- Click any number to jump to that question

#### 2. **Filter Buttons (In Sidebar)**
- **All (40)** - Show all questions
- **🚩 Flagged** - Show only flagged questions
- **Done (X)** - Show answered questions
- **Todo (Y)** - Show unanswered questions
- **Randomize** - Shuffle question order

#### 3. **Top Header**
- **👁️ Toggle** - Show/hide sidebar
- **Question 15 / 40** - Current position
- **Progress: 12/40** - How many answered
- **⏰ Time: 45:30** - Time remaining
- **🏠 Home** - Return to home page

#### 4. **Question Area (Center)**
- Category badge at top
- Large question text
- Options labeled A, B, C, D
- Clean black borders
- Selected option has black background

#### 5. **Bottom Navigation**
- **← Previous** - Go to previous question
- **Next →** - Go to next question
- **🚩 Flag / Flagged** - Mark question as difficult
- **Submit Exam** - Appears on last question

---

## 🎨 Design Features

### Colors
- **Background**: Pure white (or black in dark mode)
- **Text**: Black (or white in dark mode)
- **Borders**: 2px solid black/white
- **Selected**: Black background, white text
- **Hover**: Border changes to black

### Typography
- **Large headings**: 3xl to 7xl font size
- **Bold numbers**: Easy to read
- **Clean spacing**: Generous padding
- **Professional**: No gradients, clean lines

---

## 📝 How to Take an Exam

1. **Start**
   - Click "Start Mock Exam" on home page
   - Review exam information
   - Click "Start Exam" button

2. **During Exam**
   - Read question
   - Click an option (A, B, C, or D)
   - Use sidebar to navigate
   - Flag difficult questions
   - Use filters to focus

3. **Navigation**
   - Click numbers in sidebar to jump
   - Use Previous/Next buttons
   - Toggle sidebar for more space

4. **Flagging**
   - Click "Flag" button to mark question
   - Click "Flagged" filter to see all flagged
   - Review flagged questions before submitting

5. **Submit**
   - Navigate to last question
   - Click "Submit Exam"
   - View your results

6. **Results**
   - See your score percentage
   - View correct/incorrect count
   - Review all questions with answers
   - Retake or go to practice mode

---

## 🎯 Tips for Best Experience

### Navigation
- **Use sidebar** for quick jumps
- **Flag questions** you're unsure about
- **Filter by Todo** to see what's left
- **Review flagged** before submitting

### Study Strategy
- **First pass**: Answer easy questions
- **Flag difficult**: Mark hard questions
- **Second pass**: Focus on flagged
- **Review all**: Check before submit

### Time Management
- **Watch timer**: Keep an eye on time
- **Don't rush**: 60 minutes for 40 questions
- **Flag and move**: Don't get stuck
- **Review time**: Save 10 minutes to review

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Try with PowerShell bypass
powershell -ExecutionPolicy Bypass -Command "npm run dev"

# Or use cmd
cmd /c "npm run dev"
```

### Port Already in Use
```bash
# Kill process on port 3000
# Then restart
npm run dev
```

### Build Errors
```bash
# Clean install
rm -rf node_modules
npm install
npm run dev
```

---

## 📱 Responsive Design

### Desktop
- Full sidebar visible
- Large question text
- All features accessible

### Tablet
- Collapsible sidebar
- Touch-friendly buttons
- Optimized layout

### Mobile
- Hidden sidebar (toggle to show)
- Stacked layout
- Large tap targets

---

## 🎨 Dark Mode

The app automatically supports dark mode:
- **Light mode**: White background, black text
- **Dark mode**: Black background, white text
- **Borders**: Always high contrast
- **Readable**: Proper contrast ratios

---

## ✨ Key Shortcuts

- **Click question number**: Jump to question
- **Flag button**: Mark as difficult
- **Filter buttons**: Focus on specific questions
- **Toggle sidebar**: More reading space
- **Previous/Next**: Navigate sequentially

---

## 🎯 What Makes This Design Special

1. **Paper-like**: Clean, professional, like a real exam
2. **No distractions**: Pure black and white
3. **Easy navigation**: See all questions at once
4. **Smart filtering**: Focus on what matters
5. **Flagging system**: Mark difficult questions
6. **Large text**: Easy to read
7. **Clear feedback**: Know where you are
8. **Professional**: Looks like a real certification exam

---

## 🚀 Ready to Start!

Just run:
```bash
npm run dev
```

And open: **http://localhost:3000**

Good luck with your ITIL 4 Foundation exam! 🎓

