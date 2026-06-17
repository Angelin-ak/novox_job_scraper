# NovoxScraper: Real-Time Job Aggregator

NovoxScraper is a professional, full-stack real-time job aggregator that scrapes and aggregates job listings across multiple major career portals simultaneously. The project has a decoupled client-server architecture, featuring a FastAPI backend and a Vite-React frontend.

---

## Architecture Overview

The application is structured into two main components:
1.  **Backend (FastAPI)**: Handled under the `backend/` directory. Exposes API endpoints, manages headless web browser sessions using Selenium, and parses HTML DOM structures using BeautifulSoup4.
2.  **Frontend (Vite + React)**: Handled under the `frontend/` directory. Renders a responsive, glassmorphic dashboard for search operations, local result filtering, application bookmarking, and data export.

---

## Key Features

*   **Multi-Platform Scraping**: Fetches live data from LinkedIn, Naukri, Indeed, Glassdoor, and Internshala.
*   **Selective Platform Scraping**: Users can check or uncheck individual sources to query. Scraping only 1 or 2 selected portals reduces response times down to 6–8 seconds (compared to 40 seconds for all 5 portals).
*   **Headless Webdriver Optimization**: 
    *   **Windows**: Automatically detects the environment and prioritizes Microsoft Edge (pre-installed on Windows) to bypass slow ChromeDriver download/setup timeouts.
    *   **Linux/Render**: Defaults to Google Chrome for production cloud deployments.
    *   **Driver Caching**: Reuses successful browser drivers within a session, boosting speed by up to 5x.
*   **Offline Bookmarks Manager**: Users can bookmark job listings. Bookmarked items are persisted locally in `localStorage` and can be managed in a dedicated tab.
*   **CSV Spreadsheet Export**: Generates and downloads a `.csv` file containing the currently filtered search results for tracking applications in Excel or Google Sheets.
*   **Responsive Theme Switcher**: Toggle between Dark Mode and Light Mode with HSL variables.
*   **Custom Skills Fit Analysis**: Users can enter a comma-separated list of their skills. The dashboard highlights matched vs. missing skills on individual job cards and in the preview pane, showing a dynamic percentage score ("Skill Fit").
*   **Skill-Based Search Fallback**: If the Job Role/Title is left blank, the scraper automatically falls back to the user's skills input as the query keywords to discover related jobs.
*   **Sorting & Filtering by Skill Fit**: Filter listings to display only positions matching at least one user skill, and sort the list dynamically by match percentage.

---

## Project Structure

```text
D:/jobscrapper/
├── backend/
│   ├── Dockerfile             # Docker container configuration
│   ├── main.py                # FastAPI routes and server initialization
│   ├── scraper.py             # Core Selenium and BeautifulSoup scraping engines
│   ├── render-build.sh        # Shell build script for Render deployment
│   └── requirements.txt       # Python package dependencies
├── frontend/
│   ├── index.html             # Entry HTML document and metadata
│   ├── package.json           # Node.js project configuration
│   ├── src/
│   │   ├── App.css            # Custom dashboard and theme stylesheets
│   │   ├── App.jsx            # Main React layout, state handlers, and SVG icon sets
│   │   ├── index.css          # Global CSS typography variables and resets
│   │   └── main.jsx           # React app mount bootstrap
│   └── vite.config.js         # Vite configuration settings
└── README.md                  # Project documentation
```

---

## Installation and Setup

Ensure you have Python 3.10+ and Node.js installed on your machine.

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Activate your virtual environment (run from the root directory):
    *   **PowerShell**: `.\.venv\Scripts\Activate.ps1`
    *   **CMD**: `.\.venv\Scripts\activate.bat`
    *   **Git Bash / Linux**: `source .venv/Scripts/activate`

3.  Install Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4.  Run the development server:
    ```bash
    python main.py
    ```
    The API will be running at `http://localhost:8000/`.

---

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install packages:
    ```bash
    npm install
    ```

3.  Run the Vite development server:
    ```bash
    npm run dev
    ```
    The application interface will be running at `http://localhost:5173/`.

---

## API Endpoints Reference

### Get Scraped Jobs
*   **Endpoint**: `/jobs`
*   **Method**: `GET`
*   **Query Parameters**:
    *   `query` (string, default: `"Python"`): Job role or keywords to search.
    *   `location` (string, default: `"Kerala"`): Geographical location for the job search.
    *   `sources` (string, optional): Comma-separated list of target portals to query (e.g. `LinkedIn,Naukri`). If omitted, all portals are searched.
*   **Response**: JSON array containing aggregated job results.

### Debug Environment
*   **Endpoint**: `/debug`
*   **Method**: `GET`
*   **Description**: Evaluates if system webdrivers (Chrome/Edge) are set up correctly on the host.

---

## Docker Deployment (Production)

To containerize the backend application:

1.  Build the Docker image:
    ```bash
    docker build -t novoxscraper-backend ./backend
    ```

2.  Run the container:
    ```bash
    docker run -d -p 8000:8000 novoxscraper-backend
    ```
