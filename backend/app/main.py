from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
import json
import asyncio
from datetime import datetime
from typing import List, Optional
from .schemas import *
from .data import *
from .websocket import manager

app = FastAPI(title="HaRry AI HR API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "HaRry AI HR API is running"}

# Interviews endpoints
@app.get("/api/interviews", response_model=ApiResponse)
async def get_interviews(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get list of interviews with pagination and filtering"""
    interviews = MOCK_INTERVIEWS.copy()
    
    # Filter by status
    if status and status != 'all':
        interviews = [i for i in interviews if i.status == status]
    
    # Filter by search term
    if search:
        search_lower = search.lower()
        interviews = [
            i for i in interviews 
            if search_lower in i.candidate_name.lower() or 
               search_lower in i.position.lower()
        ]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_interviews = interviews[start:end]
    
    return ApiResponse(data=paginated_interviews, success=True)

@app.get("/api/interviews/{interview_id}", response_model=ApiResponse)
async def get_interview(interview_id: str):
    """Get detailed interview information"""
    # Check if we have detailed data
    if interview_id in MOCK_INTERVIEW_DETAILS:
        return ApiResponse(data=MOCK_INTERVIEW_DETAILS[interview_id], success=True)
    
    # Fallback to basic interview data
    interview = next((i for i in MOCK_INTERVIEWS if i.id == interview_id), None)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return ApiResponse(data=interview, success=True)

# Candidates endpoints
@app.get("/api/candidates", response_model=ApiResponse)
async def get_candidates(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get list of candidates with pagination and filtering"""
    candidates = MOCK_CANDIDATES.copy()
    
    # Filter by status
    if status and status != 'all':
        candidates = [c for c in candidates if c.status == status]
    
    # Filter by search term
    if search:
        search_lower = search.lower()
        candidates = [
            c for c in candidates 
            if search_lower in c.name.lower() or 
               search_lower in c.position.lower()
        ]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_candidates = candidates[start:end]
    
    return ApiResponse(data=paginated_candidates, success=True)

@app.get("/api/candidates/{candidate_id}", response_model=ApiResponse)
async def get_candidate(candidate_id: str):
    """Get candidate by ID"""
    candidate = next((c for c in MOCK_CANDIDATES if c.id == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return ApiResponse(data=candidate, success=True)

@app.post("/api/candidates", response_model=ApiResponse)
async def create_candidate(
    name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    position: str = Form(...),
    experience: int = Form(...),
    skills: str = Form(...),  # JSON string
    resume: Optional[UploadFile] = File(None)
):
    """Create new candidate"""
    import uuid
    import json
    
    # Parse skills from JSON string
    skills_list = json.loads(skills) if skills else []
    
    # Create new candidate
    new_candidate = Candidate(
        id=str(uuid.uuid4()),
        name=name,
        email=email,
        phone=phone,
        position=position,
        experience=experience,
        skills=skills_list,
        resume_url=f"/api/resumes/{candidate_id}.pdf" if resume else None,
        status="new",
        created_at=datetime.now()
    )
    
    # Add to mock data
    MOCK_CANDIDATES.append(new_candidate)
    
    return ApiResponse(data=new_candidate, success=True, message="Candidate created successfully")

# Vacancies endpoints
@app.get("/api/vacancies", response_model=ApiResponse)
async def get_vacancies(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get list of vacancies with pagination and filtering"""
    vacancies = MOCK_VACANCIES.copy()
    
    # Filter by status
    if status and status != 'all':
        vacancies = [v for v in vacancies if v.status == status]
    
    # Filter by search term
    if search:
        search_lower = search.lower()
        vacancies = [
            v for v in vacancies 
            if search_lower in v.title.lower() or 
               search_lower in v.department.lower()
        ]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_vacancies = vacancies[start:end]
    
    return ApiResponse(data=paginated_vacancies, success=True)

@app.post("/api/vacancies", response_model=ApiResponse)
async def create_vacancy(vacancy_data: VacancyCreate):
    """Create new vacancy"""
    import uuid
    
    # Create new vacancy
    new_vacancy = Vacancy(
        id=str(uuid.uuid4()),
        title=vacancy_data.title,
        department=vacancy_data.department,
        location=vacancy_data.location,
        salary_min=vacancy_data.salary_min,
        salary_max=vacancy_data.salary_max,
        currency=vacancy_data.currency,
        requirements=vacancy_data.requirements,
        responsibilities=vacancy_data.responsibilities,
        benefits=vacancy_data.benefits,
        status=vacancy_data.status,
        created_at=datetime.now(),
        applicants_count=0
    )
    
    # Add to mock data
    MOCK_VACANCIES.append(new_vacancy)
    
    return ApiResponse(data=new_vacancy, success=True, message="Vacancy created successfully")

# Reports endpoints
@app.get("/api/reports/{candidate_id}", response_model=ApiResponse)
async def get_report(candidate_id: str):
    """Get report for candidate"""
    report = next((r for r in MOCK_REPORTS if r.candidate_id == candidate_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return ApiResponse(data=report, success=True)

@app.get("/api/reports/{candidate_id}/pdf")
async def download_report_pdf(candidate_id: str):
    """Download report PDF (mock)"""
    # In a real implementation, this would generate and return a PDF
    # For now, we'll return a mock PDF response
    return Response(
        content=b"Mock PDF content for report",
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{candidate_id}.pdf"}
    )

# Notifications endpoint
@app.post("/api/notifications", response_model=ApiResponse)
async def send_notification(notification_data: NotificationData):
    """Send notification (mock)"""
    # In a real implementation, this would send an actual notification
    return ApiResponse(
        data={"sent": True, "notification_id": "mock_id"},
        success=True,
        message="Notification sent successfully"
    )

# WebSocket endpoint
@app.websocket("/ws/interviews/{interview_id}")
async def websocket_endpoint(websocket: WebSocket, interview_id: str):
    await manager.connect(websocket, interview_id)
    try:
        # Start simulation in background
        asyncio.create_task(manager.simulate_interview(interview_id))
        
        while True:
            # Keep connection alive and handle any incoming messages
            data = await websocket.receive_text()
            # Echo back any received data
            await manager.send_personal_message(f"Echo: {data}", websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, interview_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
