from fastapi import FastAPI, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from scraper import JobScraper


class JobSchema(BaseModel):
    title: str
    company: str
    location: str
    category: Optional[str] = None
    salary: Optional[str] = "Not Disclosed"
    description: Optional[str] = ""
    link: str
    source: str


app = FastAPI(
    title="Real-Time Job Scraper",
    description="API for scraping jobs from various portals without Auth/DB",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


scraper = JobScraper()

# Simple In-Memory Query Cache
import time
CACHE = {}
CACHE_TTL = 600  # 10 minutes cache duration

def get_cached_jobs(query: str, location: str, sources: Optional[str]):
    key = (query.lower().strip(), location.lower().strip(), sources or "")
    if key in CACHE:
        timestamp, results = CACHE[key]
        if time.time() - timestamp < CACHE_TTL:
            print(f"Cache hit for query: {query} in {location}")
            return results
    return None

def set_cached_jobs(query: str, location: str, sources: Optional[str], results):
    key = (query.lower().strip(), location.lower().strip(), sources or "")
    CACHE[key] = (time.time(), results)



@app.get("/", tags=["Root"])
async def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to the Real-Time Job Scraper API",
        "version": "2.0.0",
        "status": "Running (No Auth/DB Required)",
        "usage": "Go to /jobs?query=python&location=kerala to scrape jobs"
    }

@app.get("/jobs", tags=["Jobs"])
async def get_jobs(
    query: str = Query("Python", description="Job title or keywords"),
    location: str = Query("Kerala", description="Location to search in"),
    sources: Optional[str] = Query(None, description="Comma-separated list of job source boards to search"),
    custom_feeds: Optional[str] = Query(None, description="JSON string of custom RSS/Atom feeds")
):
    """
    Fetch jobs in real-time using the scraper (No DB/Auth)
    """
    try:
        if not custom_feeds:
            cached = get_cached_jobs(query, location, sources)
            if cached:
                return cached

        import json
        selected_platforms = [s.strip() for s in sources.split(",")] if sources else None
        
        parsed_custom_feeds = None
        if custom_feeds:
            try:
                parsed_custom_feeds = json.loads(custom_feeds)
            except Exception as parse_err:
                print(f"Error parsing custom_feeds parameter: {parse_err}")

        jobs = scraper.get_all_jobs(
            query=query, 
            location=location, 
            selected_platforms=selected_platforms, 
            custom_feeds=parsed_custom_feeds
        )
        
        if jobs and not (isinstance(jobs[0], dict) and "error" in jobs[0]) and not custom_feeds:
            set_cached_jobs(query, location, sources, jobs)

        return jobs
    except Exception as e:
        return {"error": f"Scraping failed: {str(e)}"}

@app.post("/jobs", tags=["Jobs"])
async def get_jobs_post(
    query: str = Form("Python"),
    location: str = Form("Kerala"),
    sources: Optional[str] = Form(None),
    custom_feeds: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Fetch jobs in real-time and/or parse an uploaded job XML/RSS file
    """
    try:
        if not file and not custom_feeds:
            cached = get_cached_jobs(query, location, sources)
            if cached:
                return cached

        selected_platforms = [s.strip() for s in sources.split(",")] if sources else None
        
        parsed_custom_feeds = None
        if custom_feeds:
            try:
                import json
                parsed_custom_feeds = json.loads(custom_feeds)
            except Exception as parse_err:
                print(f"Error parsing custom_feeds parameter: {parse_err}")

        jobs = []
        if selected_platforms or parsed_custom_feeds:
            jobs = scraper.get_all_jobs(
                query=query, 
                location=location, 
                selected_platforms=selected_platforms,
                custom_feeds=parsed_custom_feeds
            )
            if jobs and isinstance(jobs[0], dict) and "error" in jobs[0]:
                if jobs[0]["error"] == "CHROME_CRASH" and file:
                    jobs = []
                elif not file:
                    return jobs
        
        if file:
            content = await file.read()
            xml_text = content.decode("utf-8", errors="ignore")
            file_jobs = scraper.process_xml_jobs(xml_text, query=query, location=location, filename=file.filename)
            jobs.extend(file_jobs)
            
        if jobs:
            jobs = [j for j in jobs if isinstance(j, dict) and "error" not in j]
            jobs.sort(key=lambda x: x.get("relevance", 0), reverse=True)
            
        if not jobs:
            return [{"error": "NO_JOBS_FOUND", "details": ["No jobs found matching the search criteria."]}]
            
        if jobs and not file and not custom_feeds:
            set_cached_jobs(query, location, sources, jobs)

        return jobs
    except Exception as e:
        return {"error": f"Scraping/upload processing failed: {str(e)}"}


@app.post("/parse-resume", tags=["Resume"])
async def parse_resume(
    file: UploadFile = File(...)
):
    """
    Parse an uploaded resume (PDF or TXT) to extract skills and achievements
    """
    try:
        content = await file.read()
        parsed_data = scraper.parse_resume(content, file.filename)
        return parsed_data
    except Exception as e:
        return {"error": f"Failed to parse resume: {str(e)}"}


@app.get("/job-details", tags=["Jobs"])
async def get_job_details(
    url: str = Query(..., description="The URL of the job page to parse"),
    source: str = Query(..., description="The source site of the job (e.g. Internshala, LinkedIn)")
):
    """
    Fetch contact numbers, emails, HR details, and full description for a selected job
    """
    try:
        details = scraper.get_job_details(url, source)
        return details
    except Exception as e:
        return {"error": f"Failed to fetch job details: {str(e)}"}


# Persistent Job Applications Storage
import json
import os
from datetime import datetime

class ApplicationSchema(BaseModel):
    job_title: str
    company: str
    location: str
    link: str
    person_name: Optional[str] = None
    person_email: Optional[str] = None

@app.get("/applications", tags=["Applications"])
async def get_applications():
    """
    Get job applications (Placeholder endpoint)
    """
    return []

@app.post("/applications", tags=["Applications"])
async def create_application(app_data: ApplicationSchema):
    """
    Receive job application details and return success response instantly
    """
    new_app = app_data.dict()
    new_app["applied_at"] = datetime.utcnow().isoformat() + "Z"
    return {
        "status": "success",
        "message": "Application processed successfully.",
        "data": new_app
    }


@app.get("/debug", tags=["Debug"])
async def debug_env():
    """Check if Chrome is installed and driver works"""
    import os
    info = {
        "is_render": "RENDER" in os.environ,
        "render_chrome_exists": os.path.exists("/opt/render/project/.render/chrome/opt/google/chrome/google-chrome"),
        "docker_chrome_exists": os.path.exists("/usr/bin/google-chrome-stable") or os.path.exists("/usr/bin/google-chrome")
    }
    
    
    try:
        driver = scraper.get_driver()
        if driver:
            info["driver_status"] = "Success! Chrome launched."
            driver.quit()
        else:
            info["driver_status"] = "Failed (get_driver returned None)"
    except Exception as e:
        info["driver_status"] = f"Failed with exception: {str(e)}"
        
    return info

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=(os.getenv("PORT") is None))
