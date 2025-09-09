from datetime import datetime, timedelta
from typing import List, Dict, Any
from .schemas import Candidate, Interview, Vacancy, Report, InterviewDetail

# Mock Candidates
MOCK_CANDIDATES = [
    Candidate(
        id="1",
        name="Анна Петрова",
        email="anna.petrova@email.com",
        phone="+7 (999) 123-45-67",
        position="Frontend Developer",
        experience=3,
        skills=["React", "TypeScript", "CSS", "JavaScript", "Node.js"],
        resume_url="/api/resumes/anna_petrova.pdf",
        status="interviewed",
        created_at=datetime.now() - timedelta(days=5),
        interview_id="1",
        score=85,
        match_percentage=78
    ),
    Candidate(
        id="2",
        name="Иван Сидоров",
        email="ivan.sidorov@email.com",
        phone="+7 (999) 234-56-78",
        position="Backend Developer",
        experience=5,
        skills=["Python", "Django", "PostgreSQL", "Redis", "Docker"],
        resume_url="/api/resumes/ivan_sidorov.pdf",
        status="new",
        created_at=datetime.now() - timedelta(days=3),
        match_percentage=92
    ),
    Candidate(
        id="3",
        name="Мария Козлова",
        email="maria.kozlov@email.com",
        position="UI/UX Designer",
        experience=4,
        skills=["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research"],
        status="hired",
        created_at=datetime.now() - timedelta(days=10),
        interview_id="2",
        score=92,
        match_percentage=88
    ),
    Candidate(
        id="4",
        name="Алексей Волков",
        email="alexey.volkov@email.com",
        phone="+7 (999) 345-67-89",
        position="DevOps Engineer",
        experience=6,
        skills=["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
        status="rejected",
        created_at=datetime.now() - timedelta(days=7),
        interview_id="3",
        score=65,
        match_percentage=45
    )
]

# Mock Interviews
MOCK_INTERVIEWS = [
    Interview(
        id="1",
        candidate_id="1",
        candidate_name="Анна Петрова",
        position="Frontend Developer",
        status="completed",
        scheduled_at=datetime.now() - timedelta(days=5, hours=2),
        completed_at=datetime.now() - timedelta(days=5),
        duration=5400,  # 90 minutes
        score=85,
        notes="Отличные технические навыки, хорошая коммуникация"
    ),
    Interview(
        id="2",
        candidate_id="3",
        candidate_name="Мария Козлова",
        position="UI/UX Designer",
        status="completed",
        scheduled_at=datetime.now() - timedelta(days=10, hours=1),
        completed_at=datetime.now() - timedelta(days=10),
        duration=3600,  # 60 minutes
        score=92,
        notes="Превосходное портфолио, креативный подход"
    ),
    Interview(
        id="3",
        candidate_id="4",
        candidate_name="Алексей Волков",
        position="DevOps Engineer",
        status="completed",
        scheduled_at=datetime.now() - timedelta(days=7, hours=3),
        completed_at=datetime.now() - timedelta(days=7),
        duration=4500,  # 75 minutes
        score=65,
        notes="Ограниченный опыт с облачными технологиями"
    ),
    Interview(
        id="4",
        candidate_id="2",
        candidate_name="Иван Сидоров",
        position="Backend Developer",
        status="scheduled",
        scheduled_at=datetime.now() + timedelta(days=2, hours=2)
    )
]

# Mock Vacancies
MOCK_VACANCIES = [
    Vacancy(
        id="1",
        title="Frontend Developer",
        department="Разработка",
        location="Москва",
        salary_min=120000,
        salary_max=180000,
        currency="RUB",
        requirements=["React", "TypeScript", "3+ лет опыта", "Опыт с Redux"],
        responsibilities=["Разработка UI компонентов", "Оптимизация производительности", "Code review"],
        benefits=["Медицинская страховка", "Гибкий график", "Удаленная работа"],
        status="active",
        created_at=datetime.now() - timedelta(days=15),
        applicants_count=15
    ),
    Vacancy(
        id="2",
        title="Backend Developer",
        department="Разработка",
        location="Санкт-Петербург",
        salary_min=100000,
        salary_max=160000,
        currency="RUB",
        requirements=["Python", "Django", "PostgreSQL", "Опыт с API"],
        responsibilities=["API разработка", "Работа с базой данных", "Микросервисы"],
        benefits=["Удаленная работа", "Обучение", "Конференции"],
        status="active",
        created_at=datetime.now() - timedelta(days=12),
        applicants_count=8
    ),
    Vacancy(
        id="3",
        title="UI/UX Designer",
        department="Дизайн",
        location="Москва",
        salary_min=80000,
        salary_max=120000,
        currency="RUB",
        requirements=["Figma", "Sketch", "Опыт с мобильными приложениями"],
        responsibilities=["Создание макетов", "Прототипирование", "Исследования пользователей"],
        benefits=["Творческая свобода", "Современные инструменты", "Команда дизайнеров"],
        status="closed",
        created_at=datetime.now() - timedelta(days=20),
        applicants_count=25
    )
]

# Mock Reports
MOCK_REPORTS = [
    Report(
        id="1",
        candidate_id="1",
        interview_id="1",
        generated_at=datetime.now() - timedelta(days=5),
        summary="Кандидат показал отличные технические навыки в области React и TypeScript. Демонстрирует хорошие коммуникативные способности и понимание современных подходов к разработке. Рекомендуется к найму на позицию Frontend Developer.",
        recommendations=[
            "Рекомендуется к найму на позицию Frontend Developer",
            "Подходит для работы в команде",
            "Может стать техническим лидером в будущем"
        ],
        strengths=[
            "Отличное знание React и TypeScript",
            "Хорошие коммуникативные навыки",
            "Понимание современных подходов к разработке",
            "Опыт работы с командой"
        ],
        weaknesses=[
            "Ограниченный опыт с тестированием",
            "Нужно больше практики с DevOps инструментами"
        ],
        final_score=85,
        decision="hire"
    ),
    Report(
        id="2",
        candidate_id="3",
        interview_id="2",
        generated_at=datetime.now() - timedelta(days=10),
        summary="Кандидат продемонстрировал превосходные дизайнерские навыки и креативный подход. Портфолио впечатляет разнообразием проектов. Отлично подходит для позиции UI/UX Designer.",
        recommendations=[
            "Рекомендуется к найму на позицию UI/UX Designer",
            "Может возглавить дизайн-команду",
            "Отличный культурный фит"
        ],
        strengths=[
            "Превосходное портфолио",
            "Креативный подход",
            "Опыт с различными платформами",
            "Хорошие навыки презентации"
        ],
        weaknesses=[
            "Ограниченный опыт с анимацией",
            "Нужно больше практики с пользовательскими исследованиями"
        ],
        final_score=92,
        decision="hire"
    )
]

# Mock Transcript
MOCK_TRANSCRIPT = [
    {
        "id": "1",
        "speaker": "interviewer",
        "text": "Добро пожаловать на интервью! Расскажите о себе и своем опыте.",
        "timestamp": 0,
        "confidence": 0.95
    },
    {
        "id": "2",
        "speaker": "candidate",
        "text": "Привет! Меня зовут Анна, я frontend разработчик с 3-летним опытом работы с React и TypeScript.",
        "timestamp": 5,
        "confidence": 0.92
    },
    {
        "id": "3",
        "speaker": "interviewer",
        "text": "Отлично! Какие технологии вы используете в работе?",
        "timestamp": 15,
        "confidence": 0.98
    },
    {
        "id": "4",
        "speaker": "candidate",
        "text": "В основном React, TypeScript, CSS модули. Также работаю с Node.js для бэкенда и имею опыт с Redux для управления состоянием.",
        "timestamp": 20,
        "confidence": 0.89
    },
    {
        "id": "5",
        "speaker": "interviewer",
        "text": "Расскажите о самом сложном проекте, над которым вы работали.",
        "timestamp": 35,
        "confidence": 0.96
    },
    {
        "id": "6",
        "speaker": "candidate",
        "text": "Это был проект для банка, где нужно было создать сложную форму с множественными валидациями и интеграцией с внешними API. Использовал React Hook Form и Zod для валидации.",
        "timestamp": 40,
        "confidence": 0.87
    }
]

# Mock Metrics
MOCK_METRICS = {
    "pauses_sec": 12,
    "avg_confidence": 0.91,
    "speaking_rate": 150,
    "sentiment_score": 0.8,
    "keywords_used": ["React", "TypeScript", "JavaScript", "CSS", "Node.js", "Redux"],
    "technical_score": 85,
    "communication_score": 90,
    "overall_score": 87
}

# Mock Interview Details
MOCK_INTERVIEW_DETAILS = {
    "1": InterviewDetail(
        id="1",
        candidate_id="1",
        candidate_name="Анна Петрова",
        position="Frontend Developer",
        status="completed",
        scheduled_at=datetime.now() - timedelta(days=5, hours=2),
        completed_at=datetime.now() - timedelta(days=5),
        duration=5400,
        score=85,
        notes="Отличные технические навыки, хорошая коммуникация",
        transcript=MOCK_TRANSCRIPT,
        metrics=MOCK_METRICS
    )
}
