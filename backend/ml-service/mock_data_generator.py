"""
Mock Lawyer Data Generator
Generates realistic lawyer profiles for testing purposes
"""

from faker import Faker
import random
import json

fake = Faker('en_IN')  # Indian locale

# Legal specializations with categories
SPECIALIZATIONS = {
    'Property and Estate': [
        'Property Law',
        'Real Estate Law',
        'Estate Planning',
        'Property Disputes',
        'Land Acquisition',
        'Tenancy Law'
    ],
    'Divorce': [
        'Divorce & Family Law',
        'Family Law',
        'Matrimonial Law',
        'Child Custody',
        'Alimony & Maintenance',
        'Domestic Violence'
    ],
    'Tax & Corporate': [
        'Corporate Law',
        'Tax Law',
        'Business Law',
        'GST Law',
        'Company Law',
        'Mergers & Acquisitions',
        'Startup Legal',
        'Contract Law'
    ],
    'Criminal': [
        'Criminal Defense',
        'Criminal Law',
        'White Collar Crimes',
        'Cyber Crime',
        'Drug Offenses',
        'Bail Matters'
    ],
    'More': [
        'Civil Law',
        'Consumer Protection',
        'Labour Law',
        'Intellectual Property',
        'Banking Law',
        'Insurance Law',
        'Immigration Law',
        'Environmental Law',
        'Constitutional Law',
        'Human Rights'
    ]
}

# Indian cities with courts
CITIES = [
    'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Chandigarh', 'Kochi', 'Indore', 'Nagpur', 'Coimbatore'
]

COURTS = [
    'High Court', 'District Court', 'Sessions Court',
    'Supreme Court', 'Civil Court', 'Family Court'
]

# Education institutions
LAW_SCHOOLS = [
    'National Law School of India University',
    'NALSAR University of Law',
    'National Law University, Delhi',
    'Gujarat National Law University',
    'Symbiosis Law School',
    'ILS Law College',
    'Government Law College',
    'University Law College',
    'Christ University School of Law',
    'Jindal Global Law School'
]

# Bar associations
BAR_COUNCILS = [
    'Bar Council of India',
    'Bar Council of Tamil Nadu',
    'Bar Council of Maharashtra',
    'Bar Council of Delhi',
    'Bar Council of Karnataka',
    'Bar Council of Telangana'
]


def generate_lawyer_profile(lawyer_id):
    """Generate a single realistic lawyer profile"""
    
    # Select category and specialization
    category = random.choice(list(SPECIALIZATIONS.keys()))
    specialization = random.choice(SPECIALIZATIONS[category])
    
    # Generate basic info
    first_name = fake.first_name()
    last_name = fake.last_name()
    full_name = f"{first_name} {last_name}"
    
    # Experience (5-30 years)
    years_experience = random.randint(5, 30)
    
    # Location
    city = random.choice(CITIES)
    court = random.choice(COURTS)
    location = f"{city} {court}"
    
    # Rating (3.5 to 5.0)
    rating = round(random.uniform(3.5, 5.0), 1)
    
    # Reviews (proportional to experience)
    reviews = random.randint(years_experience * 5, years_experience * 15)
    
    # Consultation fee (based on experience and rating)
    base_fee = 1000 + (years_experience * 100) + (rating * 200)
    fee_variation = random.randint(-500, 1000)
    consultation_fee = max(800, int(base_fee + fee_variation))
    
    # Round to nearest 100
    consultation_fee = round(consultation_fee / 100) * 100
    
    # Education
    law_school = random.choice(LAW_SCHOOLS)
    additional_degree = random.choice([
        'LL.M. in Corporate Law',
        'LL.M. in Constitutional Law',
        'LL.M. in Criminal Law',
        'LL.M. in Tax Law',
        'B.A. LL.B. (Hons.)',
        'B.Com LL.B.',
        ''
    ])
    
    # Bar registration
    bar_council = random.choice(BAR_COUNCILS)
    bar_number = f"BCI/{random.randint(10000, 99999)}/{random.randint(1990, 2018)}"
    
    # Languages
    languages = ['English', 'Hindi']
    regional_langs = ['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali']
    languages.extend(random.sample(regional_langs, random.randint(1, 3)))
    
    # Practice areas (2-4 related areas)
    related_specializations = [s for s in SPECIALIZATIONS[category] if s != specialization]
    practice_areas = [specialization] + random.sample(related_specializations, min(2, len(related_specializations)))
    
    # Achievements
    achievements = []
    if years_experience > 15:
        achievements.append(f"Senior Advocate with {years_experience}+ years of experience")
    if rating >= 4.7:
        achievements.append(f"Highly rated by {reviews}+ clients")
    if random.random() > 0.7:
        achievements.append(f"Empaneled with {city} Legal Services Authority")
    if random.random() > 0.8:
        achievements.append("Award winner for Legal Excellence")
    
    # Success rate
    success_rate = random.randint(75, 98)
    
    # Cases handled
    cases_handled = years_experience * random.randint(15, 40)
    
    # About
    about_templates = [
        f"Senior advocate specializing in {specialization.lower()} with {years_experience} years of extensive experience. Known for providing effective legal solutions and client-focused approach.",
        f"Experienced legal professional with expertise in {specialization.lower()}. Committed to delivering justice through ethical practices and thorough case preparation.",
        f"{years_experience}-year veteran in {specialization.lower()}, handling complex cases with a proven track record of success. Dedicated to client satisfaction and legal excellence.",
        f"Accomplished lawyer with specialization in {specialization.lower()}. Provides comprehensive legal services with attention to detail and strategic planning.",
    ]
    about = random.choice(about_templates)
    
    # Availability
    availability = random.choice([
        "Available for consultation Monday to Saturday, 10 AM - 6 PM",
        "Immediate consultation available",
        "Available for urgent matters 24/7",
        "Available Monday to Friday, 9 AM - 5 PM"
    ])
    
    # Response time
    response_time = random.choice([
        "Responds within 1 hour",
        "Responds within 2 hours",
        "Responds within 24 hours",
        "Responds same day"
    ])
    
    # Features for ML model
    features = {
        'years_experience': years_experience,
        'rating': rating,
        'reviews': reviews,
        'consultation_fee': consultation_fee,
        'success_rate': success_rate,
        'cases_handled': cases_handled,
        'specialization_encoded': list(SPECIALIZATIONS.keys()).index(category),
        'city_encoded': CITIES.index(city) if city in CITIES else 0,
    }
    
    return {
        'id': lawyer_id,
        'name': full_name,
        'specialization': specialization,
        'category': category,
        'rating': rating,
        'reviews': reviews,
        'experience': f"{years_experience}+ years",
        'years_experience': years_experience,
        'location': location,
        'city': city,
        'court': court,
        'phone': f"+91 {fake.phone_number()}",
        'email': f"{first_name.lower()}.{last_name.lower()}@lawfirm.com",
        'consultation_fee': consultation_fee,
        'consultation_fee_formatted': f"₹{consultation_fee:,}",
        'about': about,
        'education': law_school,
        'additional_degree': additional_degree,
        'bar_council': bar_council,
        'bar_number': bar_number,
        'languages': languages,
        'practice_areas': practice_areas,
        'achievements': achievements,
        'success_rate': success_rate,
        'cases_handled': cases_handled,
        'availability': availability,
        'response_time': response_time,
        'image': f'/images/lawyer-{(lawyer_id % 10) + 1}.jpg',
        'verified': random.random() > 0.2,  # 80% verified
        'available_now': random.random() > 0.6,  # 40% available now
        'features': features  # For ML model
    }


def generate_mock_lawyers(count=100):
    """Generate multiple lawyer profiles"""
    lawyers = []
    for i in range(1, count + 1):
        lawyer = generate_lawyer_profile(i)
        lawyers.append(lawyer)
    return lawyers


def save_mock_lawyers_to_json(count=100, filename='mock_lawyers.json'):
    """Generate and save lawyers to JSON file"""
    lawyers = generate_mock_lawyers(count)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(lawyers, f, indent=2, ensure_ascii=False)
    print(f"Generated {count} mock lawyers and saved to {filename}")
    return lawyers


if __name__ == "__main__":
    # Generate 150 lawyers for testing
    lawyers = save_mock_lawyers_to_json(150, 'mock_lawyers.json')
    print(f"\nSample lawyer profile:")
    print(json.dumps(lawyers[0], indent=2, ensure_ascii=False))
