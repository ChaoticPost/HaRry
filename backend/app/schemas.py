from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class CandidateStatus(str, Enum):
    NEW = "new"
    INTERVIEWED = "interviewed"
    HIRED = "hired"
    REJECTED = "rejected"

class InterviewStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class VacancyStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class DecisionType(str, Enum):
    HIRE = "hire"
    REJECT = "reject"
    MAYBE = "maybe"

# Base Models
class CandidateBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    position: str
    experience: int
    skills: List[str]
    resume_url: Optional[str] = None
    status: CandidateStatus = CandidateStatus.NEW

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: str
    created_at: datetime
    interview_id: Optional[str] = None
    score: Optional[int] = None
    match_percentage: Optional[int] = None

class InterviewBase(BaseModel):
    candidate_id: str
    candidate_name: str
    position: str
    status: InterviewStatus
    scheduled_at: datetime

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: str
    completed_at: Optional[datetime] = None
    duration: Optional[int] = None
    score: Optional[int] = None
    notes: Optional[str] = None

class InterviewDetail(Interview):
    transcript: Optional[List[Dict[str, Any]]] = None
    metrics: Optional[Dict[str, Any]] = None

class VacancyBase(BaseModel):
    title: str
    department: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "RUB"
    requirements: List[str]
    responsibilities: List[str]
    benefits: List[str]
    status: VacancyStatus = VacancyStatus.ACTIVE

class VacancyCreate(VacancyBase):
    pass

class Vacancy(VacancyBase):
    id: str
    created_at: datetime
    applicants_count: int = 0

class ReportBase(BaseModel):
    candidate_id: str
    interview_id: str
    summary: str
    recommendations: List[str]
    strengths: List[str]
    weaknesses: List[str]
    final_score: int
    decision: DecisionType

class Report(ReportBase):
    id: str
    generated_at: datetime

class NotificationData(BaseModel):
    candidate_id: str
    subject: str
    body: str

class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any]
    timestamp: float

# Response Models
class ApiResponse(BaseModel):
    data: Any
    success: bool = True
    message: Optional[str] = None

class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 10
    search: Optional[str] = None
    status: Optional[str] = None
    sort_by: Optional[str] = None
    sort_order: Optional[str] = "asc"
