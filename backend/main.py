from fastapi import FastAPI, Query
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


scraper = JobScraper()



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
    sources: Optional[str] = Query(None, description="Comma-separated list of job source boards to search")
):
    """
    Fetch jobs in real-time using the scraper (No DB/Auth)
    """
    try:
        selected_platforms = [s.strip() for s in sources.split(",")] if sources else None
        jobs = scraper.get_all_jobs(query=query, location=location, selected_platforms=selected_platforms)
        return jobs
    except Exception as e:
        return {"error": f"Scraping failed: {str(e)}"}

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
