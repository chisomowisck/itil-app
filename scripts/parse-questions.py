import re
import json

def parse_itil_questions(md_file_path):
    with open(md_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Split content by ### headers (questions)
    question_blocks = re.split(r'\n### ', content)
    
    for block in question_blocks[1:]:  # Skip the first split (header content)
        lines = block.strip().split('\n')
        if not lines:
            continue
            
        # First line is the question
        question_text = lines[0].strip()
        
        # Find options and correct answer
        options = []
        correct_answer = None
        
        for line in lines[1:]:
            line = line.strip()
            
            # Check for options (- [ ] or - [x])
            if line.startswith('- [x]'):
                option_text = line[6:].strip()
                options.append(option_text)
                correct_answer = len(options) - 1  # Index of correct answer
            elif line.startswith('- [ ]'):
                option_text = line[6:].strip()
                options.append(option_text)
            elif line.startswith('**[⬆ Back to Top]'):
                break
        
        # Only add if we have a valid question with options
        if question_text and len(options) >= 2 and correct_answer is not None:
            # Categorize question based on keywords
            category = categorize_question(question_text)
            
            questions.append({
                'id': len(questions) + 1,
                'question': question_text,
                'options': options,
                'correctAnswer': correct_answer,
                'category': category,
                'explanation': ''  # Can be added later
            })
    
    return questions

def categorize_question(question_text):
    """Categorize questions based on keywords"""
    question_lower = question_text.lower()
    
    categories = {
        'Incident Management': ['incident', 'unplanned interruption', 'service interruption'],
        'Problem Management': ['problem', 'known error', 'workaround', 'root cause'],
        'Change Control': ['change', 'change authority', 'change enablement', 'change schedule'],
        'Service Desk': ['service desk', 'single point of contact'],
        'Service Level Management': ['service level', 'sla', 'service level agreement'],
        'Service Request Management': ['service request', 'request fulfillment'],
        'Continual Improvement': ['continual improvement', 'improvement initiative', 'improvement model'],
        'Release Management': ['release', 'deployment'],
        'IT Asset Management': ['asset', 'configuration item', 'ci'],
        'Event Management': ['event', 'monitoring'],
        'Information Security': ['security', 'confidentiality', 'integrity', 'availability'],
        'Relationship Management': ['relationship', 'stakeholder'],
        'Supplier Management': ['supplier', 'vendor'],
        'Guiding Principles': ['guiding principle', 'focus on value', 'start where you are', 'progress iteratively', 
                               'collaborate and promote', 'think and work holistically', 'keep it simple', 'optimize and automate'],
        'Service Value System': ['service value system', 'svs', 'value chain'],
        'Four Dimensions': ['dimension', 'organizations and people', 'information and technology', 
                           'partners and suppliers', 'value streams and processes'],
        'General Concepts': []  # Default category
    }
    
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in question_lower:
                return category
    
    return 'General Concepts'

if __name__ == '__main__':
    questions = parse_itil_questions('itil-questions.md')
    
    # Save to JSON file
    with open('public/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"Parsed {len(questions)} questions")
    
    # Print category distribution
    categories = {}
    for q in questions:
        cat = q['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nCategory Distribution:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat}: {count}")

