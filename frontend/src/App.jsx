import { useState, useEffect } from 'react'
import './App.css'

// Professional SVG Icon Components
const LocationIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const HeartIcon = ({ filled = false }) => (
  <svg className={`icon-svg ${filled ? 'filled' : ''}`} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill={filled ? 'currentColor' : 'none'} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const SunIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SearchIcon = ({ size = 16 }) => (
  <svg className="icon-svg" viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const LogoIcon = () => (
  <svg className="icon-svg logo-glow" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

function App() {
  const [query, setQuery] = useState('Python')
  const [location, setLocation] = useState('Kerala')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusLogs, setStatusLogs] = useState([])
  
  // Advanced Features State (Safe initialization)
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    Naukri: true,
    LinkedIn: true,
    Indeed: true,
    Internshala: true,
    Glassdoor: true
  })
  
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const local = localStorage.getItem('savedJobs')
      const parsed = local ? JSON.parse(local) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const local = localStorage.getItem('recentSearches')
      const parsed = local ? JSON.parse(local) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })

  const [activeTab, setActiveTab] = useState('scraped') // 'scraped' | 'saved'
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) return localTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Client-side filtering and sorting
  const [localSearch, setLocalSearch] = useState('')
  const [selectedSource, setSelectedSource] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  // Server health/debug status
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    checkServerHealth()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const checkServerHealth = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/')
      if (res.ok) {
        setServerStatus('Online')
      } else {
        setServerStatus('Offline')
      }
    } catch (err) {
      setServerStatus('Offline')
    }
  }

  const handleCheckboxChange = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const handleScrape = async (e, customQuery = null, customLoc = null) => {
    if (e) e.preventDefault()
    
    const activeQuery = customQuery || query
    const activeLoc = customLoc || location

    if (!activeQuery.trim() || !activeLoc.trim()) return

    // Get selected platforms
    const activePlatforms = Object.keys(selectedPlatforms).filter(k => selectedPlatforms[k])
    if (activePlatforms.length === 0) {
      setError('Please select at least one job source platform.')
      return
    }

    setLoading(true)
    setError(null)
    setJobs([])
    setSelectedJob(null)
    setActiveTab('scraped')
    setStatusLogs(['Initializing Selenium Webdriver...', 'Connecting to Job Portals...'])

    // Dynamically generate logs based on selected platforms
    const logs = []
    activePlatforms.forEach(p => {
      logs.push(`Searching ${p}...`)
    })
    logs.push('Extracting job details...', 'Aggregating results...')

    let logIndex = 0
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        setStatusLogs(prev => [...prev, logs[logIndex]])
        logIndex++
      } else {
        clearInterval(logInterval)
      }
    }, 2000)

    try {
      const sourcesParam = activePlatforms.join(',')
      const url = `http://127.0.0.1:8000/jobs?query=${encodeURIComponent(activeQuery)}&location=${encodeURIComponent(activeLoc)}&sources=${encodeURIComponent(sourcesParam)}`
      const response = await fetch(url)
      const data = await response.json()
      
      clearInterval(logInterval)

      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].error) {
          const errObj = data[0]
          const errMsg = Array.isArray(errObj.details) ? errObj.details.join('\n') : (errObj.details || errObj.error)
          setError(errMsg)
          setJobs([])
        } else {
          setJobs(data)
          if (data.length > 0) {
            setSelectedJob(data[0])
          }
          // Save to search history
          updateRecentSearches(activeQuery, activeLoc)
        }
      } else if (data.error) {
        const errMsg = Array.isArray(data.details) ? data.details.join('\n') : (data.details || data.error)
        setError(errMsg)
        setJobs([])
      } else {
        setError('Unexpected server response format')
      }
    } catch (err) {
      clearInterval(logInterval)
      setError(`Failed to connect to backend: ${err.message}. Make sure the FastAPI server is running.`)
    } finally {
      setLoading(false)
    }
  }

  const updateRecentSearches = (newQuery, newLoc) => {
    const item = { query: newQuery, location: newLoc }
    const searches = Array.isArray(recentSearches) ? recentSearches : []
    const filtered = searches.filter(
      x => x && !(x.query?.toLowerCase() === newQuery.toLowerCase() && x.location?.toLowerCase() === newLoc.toLowerCase())
    )
    const updated = [item, ...filtered].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const toggleBookmark = (job, e) => {
    if (e) e.stopPropagation()
    if (!job || !job.link) return
    const bookmarks = Array.isArray(savedJobs) ? savedJobs : []
    const isBookmarked = bookmarks.some(x => x && x.link === job.link)
    let updated
    if (isBookmarked) {
      updated = bookmarks.filter(x => x && x.link !== job.link)
    } else {
      updated = [...bookmarks, job]
    }
    setSavedJobs(updated)
    localStorage.setItem('savedJobs', JSON.stringify(updated))
  }

  const runRecentSearch = (item) => {
    if (!item) return
    setQuery(item.query)
    setLocation(item.location)
    handleScrape(null, item.query, item.location)
  }

  const clearRecentSearches = (e) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const exportToCSV = () => {
    const listToExport = activeTab === 'scraped' ? filteredJobs : filteredSavedJobs
    if (listToExport.length === 0) return

    const headers = ['Title', 'Company', 'Location', 'Salary', 'Source', 'Link']
    const rows = listToExport.map(job => [
      `"${(job.title || '').replace(/"/g, '""')}"`,
      `"${(job.company || '').replace(/"/g, '""')}"`,
      `"${(job.location || '').replace(/"/g, '""')}"`,
      `"${(job.salary || 'Not Disclosed').replace(/"/g, '""')}"`,
      `"${job.source || ''}"`,
      `"${job.link || ''}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `scraped_jobs_${query.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter and Sort Active Job Sets with robust null checks
  const filteredJobs = (jobs || []).filter(job => {
    if (!job) return false
    const title = job.title || ''
    const company = job.company || ''
    const loc = job.location || ''
    const source = job.source || ''

    const matchesSearch = 
      title.toLowerCase().includes(localSearch.toLowerCase()) ||
      company.toLowerCase().includes(localSearch.toLowerCase()) ||
      loc.toLowerCase().includes(localSearch.toLowerCase())
    
    const matchesSource = selectedSource === 'All' || source === selectedSource
    return matchesSearch && matchesSource
  })

  const filteredSavedJobs = (savedJobs || []).filter(job => {
    if (!job) return false
    const title = job.title || ''
    const company = job.company || ''
    const loc = job.location || ''
    const source = job.source || ''

    const matchesSearch = 
      title.toLowerCase().includes(localSearch.toLowerCase()) ||
      company.toLowerCase().includes(localSearch.toLowerCase()) ||
      loc.toLowerCase().includes(localSearch.toLowerCase())
    
    const matchesSource = selectedSource === 'All' || source === selectedSource
    return matchesSearch && matchesSource
  })

  const activeJobs = activeTab === 'scraped' ? filteredJobs : filteredSavedJobs

  const sortedJobs = [...activeJobs].sort((a, b) => {
    if (!a || !b) return 0
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '')
    } else if (sortBy === 'company') {
      return (a.company || '').localeCompare(b.company || '')
    } else if (sortBy === 'source') {
      return (a.source || '').localeCompare(b.source || '')
    }
    return 0
  })

  // Counts based on active dataset
  const activeDatasetForCounts = activeTab === 'scraped' ? (jobs || []) : (savedJobs || [])
  const sourceCounts = activeDatasetForCounts.reduce((acc, job) => {
    if (job && job.source) {
      acc[job.source] = (acc[job.source] || 0) + 1
    }
    return acc
  }, {})

  const getSourceBadgeColor = (source) => {
    switch (source?.toLowerCase()) {
      case 'linkedin': return 'badge-linkedin'
      case 'naukri': return 'badge-naukri'
      case 'indeed': return 'badge-indeed'
      case 'internshala': return 'badge-internshala'
      case 'glassdoor': return 'badge-glassdoor'
      default: return 'badge-generic'
    }
  }

  const searches = Array.isArray(recentSearches) ? recentSearches : []
  const bookmarksList = Array.isArray(savedJobs) ? savedJobs : []

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="logo-section">
          <LogoIcon />
          <h1>ApexScrape</h1>
          <span className="tagline">v2.1.0</span>
        </div>
        <div className="nav-controls">
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Light/Dark Theme">
            {theme === 'dark' ? <><SunIcon /> Light</> : <><MoonIcon /> Dark</>}
          </button>
          <div className="server-status">
            <span className={`status-dot ${serverStatus.toLowerCase()}`}></span>
            API: {serverStatus}
          </div>
        </div>
      </header>

      {/* Main Board Layout */}
      <div className="dashboard-grid">
        {/* Left Control Sidebar */}
        <div className="left-panel">
          {/* Main search form */}
          <div className="card glass-card control-card">
            <h3>Search Parameters</h3>
            <form onSubmit={(e) => handleScrape(e)} className="search-form">
              <div className="input-group">
                <label htmlFor="query">Job Role / Title</label>
                <input
                  id="query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Python Developer..."
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kerala, Remote..."
                  disabled={loading}
                />
              </div>

              {/* Source Selectors */}
              <div className="source-checkbox-group">
                <label className="section-label">Select Platforms</label>
                <div className="checkboxes-grid">
                  {Object.keys(selectedPlatforms).map(platform => (
                    <label key={platform} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms[platform]}
                        onChange={() => handleCheckboxChange(platform)}
                        disabled={loading}
                      />
                      <span className="checkbox-custom"></span>
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Scraping Live Web...' : 'Launch Scraper'}
              </button>
            </form>

            {loading && (
              <div className="scraper-progress">
                <div className="spinner"></div>
                <div className="logs-container">
                  {statusLogs.map((log, index) => (
                    <div key={index} className="log-line">
                      <span className="log-arrow">›</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="error-card">
                <h4>Scraping Error</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
                <span className="error-tip">Tip: Deselecting slow platforms can speed up checks and bypass blocks.</span>
              </div>
            )}
          </div>

          {/* Recent Searches Panel */}
          {searches.length > 0 && (
            <div className="card glass-card recent-searches-card">
              <div className="card-header-row">
                <h3>Recent Searches</h3>
                <button onClick={clearRecentSearches} className="btn-text-clear">Clear</button>
              </div>
              <div className="recent-list">
                {searches.map((item, idx) => (
                  item && (
                    <div 
                      key={idx} 
                      className="recent-item" 
                      onClick={() => !loading && runRecentSearch(item)}
                      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      <span className="recent-query">{item.query || ''}</span>
                      <span className="recent-loc"><LocationIcon /> {item.location || ''}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary Panel */}
          {activeDatasetForCounts.length > 0 && (
            <div className="card glass-card stats-card">
              <h3>{activeTab === 'scraped' ? 'Scraped' : 'Bookmarked'} Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-val">{activeDatasetForCounts.length}</span>
                  <span className="stat-lbl">Jobs Count</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{Object.keys(sourceCounts).length}</span>
                  <span className="stat-lbl">Sources</span>
                </div>
              </div>
              <div className="source-distribution">
                <h4>Distribution</h4>
                {Object.entries(sourceCounts).map(([src, count]) => (
                  <div key={src} className="dist-row">
                    <span className="dist-name">{src}</span>
                    <div className="dist-bar-wrapper">
                      <div 
                        className={`dist-bar ${src.toLowerCase()}`} 
                        style={{ width: `${(count / activeDatasetForCounts.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Dashboard Area */}
        <div className="right-panel">
          {/* Tabs header: Switch between Live Scraped and Bookmarks */}
          <div className="dashboard-tabs">
            <button 
              className={`dashboard-tab ${activeTab === 'scraped' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('scraped')
                setSelectedJob(jobs[0] || null)
              }}
            >
              <GlobeIcon /> Scraped Listings ({(jobs || []).length})
            </button>
            <button 
              className={`dashboard-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('saved')
                setSelectedJob(bookmarksList[0] || null)
              }}
            >
              <HeartIcon filled={true} /> Bookmarked ({bookmarksList.length})
            </button>
          </div>

          {activeDatasetForCounts.length > 0 ? (
            <div className="results-container">
              {/* Filtering Controls */}
              <div className="card glass-card filter-card">
                <div className="filter-row">
                  <input
                    type="text"
                    className="local-search-input"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Filter current view by keyword, company, location..."
                  />
                  
                  <select 
                    className="sort-select" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default Sort</option>
                    <option value="title">Sort by Job Title</option>
                    <option value="company">Sort by Company</option>
                    <option value="source">Sort by Source</option>
                  </select>

                  <button onClick={exportToCSV} className="btn btn-secondary btn-export" title="Export as CSV Spreadsheet">
                    <DownloadIcon /> Export CSV
                  </button>
                </div>

                <div className="source-tabs">
                  <button 
                    className={`tab-btn ${selectedSource === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedSource('All')}
                  >
                    All ({activeDatasetForCounts.length})
                  </button>
                  {Object.entries(sourceCounts).map(([src, count]) => (
                    <button
                      key={src}
                      className={`tab-btn ${selectedSource === src ? 'active' : ''}`}
                      onClick={() => setSelectedSource(src)}
                    >
                      {src} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Split view for results */}
              <div className="results-split">
                {/* Job Cards List */}
                <div className="jobs-list">
                  {sortedJobs.length > 0 ? (
                    sortedJobs.map((job, idx) => {
                      if (!job) return null
                      const isBookmarked = bookmarksList.some(x => x && x.link === job.link)
                      return (
                        <div 
                          key={idx}
                          className={`job-card ${selectedJob?.link === job.link ? 'active' : ''}`}
                          onClick={() => setSelectedJob(job)}
                        >
                          <div className="job-card-header">
                            <span className={`source-badge ${getSourceBadgeColor(job.source)}`}>
                              {job.source || 'Unknown'}
                            </span>
                            <div className="job-card-actions">
                              <span className="job-salary">{job.salary || 'Not Disclosed'}</span>
                              <button 
                                onClick={(e) => toggleBookmark(job, e)}
                                className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
                                title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                              >
                                <HeartIcon filled={isBookmarked} />
                              </button>
                            </div>
                          </div>
                          <h4 className="job-title">{job.title || 'No Title'}</h4>
                          <p className="job-company">{job.company || 'Unknown Company'}</p>
                          <p className="job-location"><LocationIcon /> {job.location || 'Not Specified'}</p>
                        </div>
                      )
                    })
                  ) : (
                    <div className="empty-state card glass-card">
                      <p>No results match your local filters.</p>
                    </div>
                  )}
                </div>

                {/* Job Detail Preview Pane */}
                <div className="job-detail-pane">
                  {selectedJob ? (
                    <div className="card glass-card detail-card">
                      <div className="detail-header">
                        <div className="detail-meta-top">
                          <span className={`source-badge ${getSourceBadgeColor(selectedJob.source)}`}>
                            {selectedJob.source || 'Unknown'}
                          </span>
                          <button 
                            onClick={(e) => toggleBookmark(selectedJob, e)}
                            className="btn-detail-bookmark"
                          >
                            <HeartIcon filled={bookmarksList.some(x => x && x.link === selectedJob.link)} />
                            <span> {bookmarksList.some(x => x && x.link === selectedJob.link) ? 'Saved' : 'Save Job'}</span>
                          </button>
                        </div>
                        <h3>{selectedJob.title || 'No Title'}</h3>
                        <p className="detail-company">{selectedJob.company || 'Unknown Company'}</p>
                        <div className="detail-meta">
                          <span><LocationIcon /> {selectedJob.location || 'Not Specified'}</span>
                          <span><BriefcaseIcon /> {selectedJob.salary || 'Not Disclosed'}</span>
                        </div>
                      </div>

                      <div className="detail-body">
                        <h4>Job Description Summary</h4>
                        <p>{selectedJob.description || 'No description provided by scraper. Click the button below to view full details on the job board.'}</p>
                      </div>

                      <div className="detail-footer">
                        <a 
                          href={selectedJob.link || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-apply"
                        >
                          Apply on {selectedJob.source || 'Portal'} ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="detail-empty card glass-card">
                      <p>Select a job card from the list to view full details.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="empty-dashboard card glass-card">
                <div className="empty-illustration">
                  {activeTab === 'scraped' ? <SearchIcon size={52} /> : <HeartIcon filled={true} />}
                </div>
                <h3>{activeTab === 'scraped' ? 'No Jobs Scraped' : 'No Bookmarks Yet'}</h3>
                <p>
                  {activeTab === 'scraped' 
                    ? 'Enter search parameters in the left panel and click Launch Scraper to aggregate vacancies.'
                    : 'Click the save icon on any job card to bookmark it here for offline application tracking.'
                  }
                </p>
                {activeTab === 'scraped' && (
                  <div className="demo-suggestions">
                    <span>Try:</span>
                    <button onClick={() => { setQuery('React Developer'); setLocation('Kerala'); }} className="suggestion-tag">React Developer, Kerala</button>
                    <button onClick={() => { setQuery('Python'); setLocation('Remote'); }} className="suggestion-tag">Python, Remote</button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default App
