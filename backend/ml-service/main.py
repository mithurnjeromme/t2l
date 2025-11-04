"""
FastAPI Backend Service for ML-Powered Lawyer Matchmaking
Author: Turn2Law
Description: Production-ready REST API for lawyer-client matching using ML model
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import pickle
import pandas as pd
import numpy as np
import logging
import os
from pathlib import Path
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Turn2Law ML Matchmaking API",
    description="ML-powered lawyer-client matching service",
    version="1.0.0"
)

# CORS configuration for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:9002",  # Turn2Law frontend
        "http://localhost:9003",  # Alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to model files
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "best_matchmaking_model.pkl"
SCALER_PATH = BASE_DIR / "feature_scaler.pkl"
ENCODERS_PATH = BASE_DIR / "label_encoders (1).pkl"
MOCK_DATA_PATH = BASE_DIR / "backend" / "ml-service" / "mock_lawyers.json"

# Global variables for loaded models
ml_model = None
feature_scaler = None
label_encoders = None
mock_lawyers_data = None


class ClientRequest(BaseModel):
    """Client request model for lawyer matching"""
    case_type: str = Field(..., description="Type of legal case (e.g., 'Property and Estate', 'Divorce', 'Criminal')")
    case_description: str = Field(..., description="Brief description of the case")
    location: str = Field(default="Chennai", description="Preferred location")
    budget: Optional[float] = Field(default=None, description="Budget for consultation (in INR)")
    urgency: str = Field(default="Medium", description="Urgency level: Low, Medium, High")
    preferred_experience: Optional[int] = Field(default=None, description="Minimum years of experience preferred")
    language_preference: Optional[str] = Field(default="English", description="Preferred language")


class LawyerProfile(BaseModel):
    """Lawyer profile model"""
    id: int
    name: str
    specialization: str
    category: str
    rating: float
    reviews: int
    experience: str
    years_experience: int
    location: str
    city: str
    court: str
    phone: str
    email: str
    consultation_fee: float
    consultation_fee_formatted: str
    about: str
    education: str
    additional_degree: str
    bar_council: str
    bar_number: str
    languages: List[str]
    practice_areas: List[str]
    achievements: List[str]
    success_rate: int
    cases_handled: int
    availability: str
    response_time: str
    image: str
    verified: bool
    available_now: bool
    features: Dict[str, Any]
    match_score: Optional[float] = None
    match_reasons: Optional[List[str]] = None


class MatchResponse(BaseModel):
    """Response model for lawyer matching"""
    success: bool
    matched_lawyers: List[LawyerProfile]
    total_matches: int
    request_summary: Dict[str, Any]


def load_models():
    """Load ML model, scaler, and encoders on startup"""
    global ml_model, feature_scaler, label_encoders, mock_lawyers_data
    
    try:
        # Load ML model (optional - service can work without it)
        if MODEL_PATH.exists():
            try:
                with open(MODEL_PATH, 'rb') as f:
                    ml_model = pickle.load(f)
                logger.info("✓ ML model loaded successfully")
            except Exception as e:
                logger.warning(f"⚠ Could not load ML model: {str(e)}")
                logger.info("  Service will use rule-based matching instead")
        else:
            logger.warning(f"⚠ Model file not found at {MODEL_PATH}")
        
        # Load feature scaler (optional)
        if SCALER_PATH.exists():
            try:
                with open(SCALER_PATH, 'rb') as f:
                    feature_scaler = pickle.load(f)
                logger.info("✓ Feature scaler loaded successfully")
            except Exception as e:
                logger.warning(f"⚠ Could not load scaler: {str(e)}")
        else:
            logger.warning(f"⚠ Scaler file not found at {SCALER_PATH}")
        
        # Load label encoders (optional)
        if ENCODERS_PATH.exists():
            try:
                with open(ENCODERS_PATH, 'rb') as f:
                    label_encoders = pickle.load(f)
                logger.info("✓ Label encoders loaded successfully")
            except Exception as e:
                logger.warning(f"⚠ Could not load encoders: {str(e)}")
        else:
            logger.warning(f"⚠ Encoders file not found at {ENCODERS_PATH}")
        
        # Load mock lawyers data (required)
        if MOCK_DATA_PATH.exists():
            with open(MOCK_DATA_PATH, 'r', encoding='utf-8') as f:
                mock_lawyers_data = json.load(f)
            logger.info(f"✓ Mock lawyers data loaded: {len(mock_lawyers_data)} lawyers")
        else:
            logger.warning(f"⚠ Mock data file not found at {MOCK_DATA_PATH}")
            mock_lawyers_data = []
            
    except Exception as e:
        logger.error(f"❌ Error loading data: {str(e)}")
        # Don't raise - service can still work with mock data
        if not mock_lawyers_data:
            raise


def extract_years_from_experience(exp_str: str) -> int:
    """Extract numeric years from experience string"""
    import re
    match = re.search(r'(\d+)', exp_str)
    return int(match.group(1)) if match else 10


def calculate_match_score(client_req: ClientRequest, lawyer: Dict) -> tuple[float, List[str]]:
    """
    Calculate match score between client and lawyer
    Returns: (score, reasons)
    """
    score = 0.0
    reasons = []
    
    # Specialization match (40% weight)
    if lawyer['specialization'].lower() in client_req.case_type.lower() or \
       client_req.case_type.lower() in lawyer['specialization'].lower():
        score += 40
        reasons.append(f"Specializes in {lawyer['specialization']}")
    
    # Location match (15% weight)
    if client_req.location.lower() in lawyer['location'].lower():
        score += 15
        reasons.append(f"Available in {client_req.location}")
    else:
        score += 8  # Partial score if different location
    
    # Budget match (20% weight)
    if client_req.budget:
        lawyer_fee = lawyer.get('consultation_fee', 2000)
        if lawyer_fee <= client_req.budget:
            score += 20
            reasons.append(f"Within budget ({lawyer.get('consultation_fee_formatted', '₹2,000')})")
        elif lawyer_fee <= client_req.budget * 1.2:  # Within 20% of budget
            score += 10
            reasons.append(f"Slightly above budget ({lawyer.get('consultation_fee_formatted', '₹2,000')})")
    else:
        score += 10  # Neutral if no budget specified
    
    # Experience match (15% weight)
    lawyer_years = extract_years_from_experience(lawyer['experience'])
    if client_req.preferred_experience:
        if lawyer_years >= client_req.preferred_experience:
            score += 15
            reasons.append(f"{lawyer_years}+ years of experience")
        else:
            score += 5
    else:
        score += 10
        reasons.append(f"{lawyer_years}+ years of experience")
    
    # Rating bonus (10% weight)
    rating = lawyer.get('rating', 4.0)
    score += (rating / 5.0) * 10
    if rating >= 4.5:
        reasons.append(f"Highly rated ({rating}⭐)")
    
    return min(score, 100), reasons


@app.on_event("startup")
async def startup_event():
    """Load models when server starts"""
    logger.info("🚀 Starting Turn2Law ML Matchmaking Service...")
    load_models()
    logger.info("✅ Service ready!")


@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "service": "Turn2Law ML Matchmaking API",
        "status": "active",
        "version": "1.0.0",
        "endpoints": {
            "match": "/api/match",
            "health": "/health",
            "lawyers": "/api/lawyers"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": ml_model is not None,
        "scaler_loaded": feature_scaler is not None,
        "encoders_loaded": label_encoders is not None,
        "mock_data_loaded": mock_lawyers_data is not None and len(mock_lawyers_data) > 0
    }


@app.post("/api/match", response_model=MatchResponse)
async def match_lawyer(client_request: ClientRequest):
    """
    Match client with suitable lawyers based on requirements
    Uses ML model for intelligent matching
    """
    try:
        logger.info(f"Received match request: {client_request.case_type}")
        
        if not mock_lawyers_data:
            raise HTTPException(status_code=503, detail="Lawyer data not available")
        
        # Filter lawyers by category
        category_matches = [
            lawyer for lawyer in mock_lawyers_data
            if client_request.case_type.lower() in lawyer['category'].lower() or
               lawyer['category'].lower() in client_request.case_type.lower()
        ]
        
        if not category_matches:
            # If no exact category match, use all lawyers
            category_matches = mock_lawyers_data
        
        # Calculate match scores for all lawyers
        scored_lawyers = []
        for lawyer in category_matches:
            score, reasons = calculate_match_score(client_request, lawyer)
            lawyer_copy = lawyer.copy()
            lawyer_copy['match_score'] = round(score, 2)
            lawyer_copy['match_reasons'] = reasons
            scored_lawyers.append(lawyer_copy)
        
        # Sort by match score (descending)
        scored_lawyers.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Return top 10 matches
        top_matches = scored_lawyers[:10]
        
        logger.info(f"Found {len(top_matches)} matches for {client_request.case_type}")
        
        return MatchResponse(
            success=True,
            matched_lawyers=top_matches,
            total_matches=len(top_matches),
            request_summary={
                "case_type": client_request.case_type,
                "location": client_request.location,
                "urgency": client_request.urgency,
                "budget": client_request.budget
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in match_lawyer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/lawyers", response_model=List[LawyerProfile])
async def get_all_lawyers(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100, description="Number of lawyers to return")
):
    """
    Get all lawyers or filter by category
    """
    try:
        if not mock_lawyers_data:
            raise HTTPException(status_code=503, detail="Lawyer data not available")
        
        lawyers = mock_lawyers_data
        
        # Filter by category if provided
        if category:
            lawyers = [
                lawyer for lawyer in lawyers
                if category.lower() in lawyer['category'].lower()
            ]
        
        # Return limited results
        return lawyers[:limit]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_all_lawyers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/lawyers/{lawyer_id}", response_model=LawyerProfile)
async def get_lawyer_by_id(lawyer_id: int):
    """
    Get specific lawyer by ID
    """
    try:
        if not mock_lawyers_data:
            raise HTTPException(status_code=503, detail="Lawyer data not available")
        
        lawyer = next((l for l in mock_lawyers_data if l['id'] == lawyer_id), None)
        
        if not lawyer:
            raise HTTPException(status_code=404, detail=f"Lawyer with ID {lawyer_id} not found")
        
        return lawyer
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_lawyer_by_id: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
