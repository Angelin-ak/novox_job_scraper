import { useState, useEffect, useRef } from 'react'
import RunnerGame from './RunnerGame'
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

const MailIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const UserCardIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CopyIcon = () => (
  <svg className="icon-svg" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const SearchIcon = ({ size = 16 }) => (
  <svg className="icon-svg" viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const LogoIcon = ({ className = "" }) => (
  <svg className={`icon-svg logo-glow ${className}`} viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const LOADING_TRIVIA = [
  {
    icon: "💡",
    category: "Resume Tip",
    text: "Tailoring your resume to match the job description keywords can increase your recruiter callback rate by over 50%!"
  },
  {
    icon: "💻",
    category: "Tech Trivia",
    text: "The first computer bug was a real moth found trapped in a relay of the Harvard Mark II computer in 1947 by Grace Hopper."
  },
  {
    icon: "💡",
    category: "Interview Tip",
    text: "When answering behavioral questions, use the STAR method: Situation, Task, Action, and Result to structure your answers."
  },
  {
    icon: "💻",
    category: "Tech Trivia",
    text: "Python was named after the British comedy group 'Monty Python', not the snake!"
  },
  {
    icon: "💡",
    category: "Networking Tip",
    text: "About 70% to 80% of jobs are not published publicly. Professional networking is key to accessing this hidden job market."
  },
  {
    icon: "💻",
    category: "Tech Trivia",
    text: "Git was created by Linus Torvalds in 2005 to manage the development of the Linux kernel after BitKeeper withdrew free access."
  },
  {
    icon: "💡",
    category: "Skills Tip",
    text: "Adding clean, well-documented projects to your GitHub profile is one of the best ways to prove your skills to technical recruiters."
  },
  {
    icon: "💻",
    category: "Tech Trivia",
    text: "The world's first computer programmer was Ada Lovelace, who wrote an algorithm for Charles Babbage's Analytical Engine in 1843."
  },
  {
    icon: "💡",
    category: "Career Tip",
    text: "Continuous learning is essential in tech. Dedicate just 30 minutes a day to learning a new tool or concept to stay ahead of the curve."
  },
  {
    icon: "💻",
    category: "Tech Trivia",
    text: "The QWERTY keyboard layout was designed in 1873 to slow down typists to prevent mechanical arms from jamming on typewriters."
  }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function App() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusLogs, setStatusLogs] = useState([])
  const [showAdvancedPlatforms, setShowAdvancedPlatforms] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [parsingResume, setParsingResume] = useState(false)
  const [resumeAchievements, setResumeAchievements] = useState([])
  const [userProfile, setUserProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile')) || {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    let interval;
    if (loading) {
      setTriviaIndex(Math.floor(Math.random() * LOADING_TRIVIA.length));
      interval = setInterval(() => {
        setTriviaIndex(prev => (prev + 1) % LOADING_TRIVIA.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      let currentProgress = 0;
      interval = setInterval(() => {
        if (currentProgress < 30) {
          currentProgress += Math.floor(Math.random() * 8) + 4;
        } else if (currentProgress < 75) {
          currentProgress += Math.floor(Math.random() * 4) + 1;
        } else if (currentProgress < 95) {
          currentProgress += Math.floor(Math.random() * 2) + 0.5;
        } else if (currentProgress < 98) {
          currentProgress += 0.1;
        }
        setProgress(Math.min(currentProgress, 98));
      }, 200);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading]);
  
  // Custom Skills / Matching Feature
  const [skillsInput, setSkillsInput] = useState('')
  const [onlyShowSkillMatches, setOnlyShowSkillMatches] = useState(false)

  // Custom Autocomplete Dropdown suggestions list (YouTube search suggestions style)
  const INDIAN_LOCATIONS = [
    "Remote", "Bangalore", "Bengaluru", "Mumbai", "Delhi", "New Delhi", "Hyderabad", "Chennai", "Pune", 
    "Kochi", "Cochin", "Kerala", "Thiruvananthapuram", "Trivandrum", "Kozhikode", "Calicut", "Thrissur", 
    "Coimbatore", "Noida", "Gurgaon", "Gurugram", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", 
    "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", 
    "Faridabad", "Rajkot", "Varanasi", "Srinagar", "Amritsar", "Navi Mumbai", "Vijayawada", "Jodhpur", 
    "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Goa", "Maharashtra", "Karnataka", "Tamil Nadu", 
    "Telangana", "Andhra Pradesh", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Haryana", 
    "Punjab", "Bihar", "Madhya Pradesh", "Odisha", "Assam", "New York", "London", "San Francisco", 
    "California", "Texas"
  ]

  const [showLocSuggestionsMain, setShowLocSuggestionsMain] = useState(false)
  const [showLocSuggestionsResults, setShowLocSuggestionsResults] = useState(false)

  // List of hottest Indian job hubs with tags indicating specialty / opportunity level
  const HOT_MARKETS = {
    "Remote": "🌐 Work From Anywhere",
    "Bangalore": "🔥 Silicon Valley Tech Hub",
    "Bengaluru": "🔥 Silicon Valley Tech Hub",
    "Hyderabad": "🔥 Cyberabad IT Hub",
    "Pune": "🔥 IT & Automotive Zone",
    "Noida": "🔥 Delhi NCR IT Zone",
    "Gurgaon": "🔥 Financial Tech Zone",
    "Gurugram": "🔥 Financial Tech Zone",
    "Mumbai": "🔥 Financial Capital",
    "Chennai": "🔥 SaaS & Tech Hub",
    "Kochi": "🔥 Rising Startup Hub",
    "Cochin": "🔥 Rising Startup Hub",
    "Kerala": "🌴 Fast Growing Dev Hub"
  }

  const getFilteredLocations = (val) => {
    const cleanVal = (val || '').trim().toLowerCase()
    if (!cleanVal) {
      return [
        "Remote", "Bangalore", "Bengaluru", "Hyderabad", "Pune", "Noida", "Gurgaon", "Gurugram", 
        "Mumbai", "Chennai", "Kochi", "Cochin", "Kerala", "Thiruvananthapuram", "Trivandrum", 
        "Kozhikode", "Calicut", "Thrissur", "Coimbatore", "Kolkata", "Ahmedabad", "Surat", 
        "Jaipur", "Lucknow", "Goa"
      ]
    }
    return INDIAN_LOCATIONS.filter(loc => loc.toLowerCase().includes(cleanVal)).slice(0, 15)
  }

  // Scraping platform selections
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    Internshala: true,
    WeWorkRemotely: true,
    Shine: true,
    Naukri: true,
    LinkedIn: true
  })

  // Local XML upload file state
  const [xmlFile, setXmlFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.xml') && !file.name.endsWith('.rss')) {
        setError('Please upload a valid XML or RSS file.')
        return
      }
      setXmlFile(file)
      setError(null)
    }
  }

  const handleRemoveFile = () => {
    setXmlFile(null)
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setParsingResume(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/parse-resume`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        if (data.skills && data.skills.length > 0) {
          const skillsText = data.skills.join(', ')
          setSkillsInput(skillsText)
          
          if (data.name || data.email) {
            const updatedProfile = {
              name: data.name || userProfile.name || '',
              email: data.email || userProfile.email || ''
            }
            setUserProfile(updatedProfile)
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
          }
          
          // Use top 6 skills joined by OR to search for jobs (broad search for max results)
          const searchKeywords = data.skills.slice(0, 6).join(' OR ')
          setQuery(searchKeywords)
          
          if (data.achievements) {
            setResumeAchievements(data.achievements)
          }
          
          // Auto trigger search with parsed skills
          handleScrape(null, searchKeywords, location || 'Remote')
        } else {
          setError('No technical skills could be extracted from your resume. Please enter them manually.')
        }
      }
    } catch (err) {
      setError(`Failed to parse resume: ${err.message}. Make sure the FastAPI server is running.`)
    } finally {
      setParsingResume(false)
      // Reset file input value so same file can be uploaded again
      e.target.value = ''
    }
  }
  
  // Bookmarks persistence
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const local = localStorage.getItem('savedJobs')
      const parsed = local ? JSON.parse(local) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })

  // Recent searches persistence
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const local = localStorage.getItem('recentSearches')
      const parsed = local ? JSON.parse(local) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })



  // Active View Tab: 'feed' | 'bookmarks' | 'settings'
  const [activeTab, setActiveTab] = useState('feed')

  // Custom RSS Feeds state
  const [rssFeeds, setRssFeeds] = useState(() => {
    try {
      const local = localStorage.getItem('rssFeeds')
      const parsed = local ? JSON.parse(local) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (e) {
      return []
    }
  })
  const [newFeedName, setNewFeedName] = useState('')
  const [newFeedUrl, setNewFeedUrl] = useState('')

  const handleAddFeed = (e) => {
    if (e) e.preventDefault()
    if (!newFeedName.trim() || !newFeedUrl.trim()) return
    
    if (!newFeedUrl.startsWith('http://') && !newFeedUrl.startsWith('https://')) {
      setError('Feed URL must start with http:// or https://')
      return
    }

    const newFeed = { name: newFeedName.trim(), url: newFeedUrl.trim() }
    const updated = [...rssFeeds, newFeed]
    setRssFeeds(updated)
    localStorage.setItem('rssFeeds', JSON.stringify(updated))
    setNewFeedName('')
    setNewFeedUrl('')
    setError(null)
  }

  const handleDeleteFeed = (idx) => {
    const updated = rssFeeds.filter((_, i) => i !== idx)
    setRssFeeds(updated)
    localStorage.setItem('rssFeeds', JSON.stringify(updated))
  }

  // Client-side filtering and sorting
  const [localSearch, setLocalSearch] = useState('')
  const [selectedSource, setSelectedSource] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedJobDetails, setSelectedJobDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const detailsCache = useRef({})

  // Application Tracking state
  const [appliedJobLinks, setAppliedJobLinks] = useState(() => {
    try {
      const local = localStorage.getItem('appliedJobLinks')
      return local ? JSON.parse(local) : []
    } catch (e) {
      return []
    }
  })
  
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [appSearch, setAppSearch] = useState('')

  const fetchApplications = async () => {
    setLoadingApplications(true)
    try {
      const res = await fetch(`${API_BASE_URL}/applications`)
      if (res.ok) {
        const data = await res.json()
        setAppliedJobs(data)
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoadingApplications(false)
    }
  }

  const handleMarkApplied = async (job) => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: job.title || 'Job Opportunity',
          company: job.company || 'Unknown Company',
          location: job.location || 'Anywhere',
          link: job.link || '#'
        })
      })

      if (res.ok) {
        const newLinkList = [...appliedJobLinks, job.link]
        setAppliedJobLinks(newLinkList)
        localStorage.setItem('appliedJobLinks', JSON.stringify(newLinkList))
        fetchApplications()
      } else {
        const data = await res.json()
        setError(data.detail || 'Failed to submit application to server')
      }
    } catch (err) {
      console.error('Error recording application:', err)
      setError('Connection to backend failed. Make sure server is running.')
    }
  }

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications()
    }
  }, [activeTab])

  const getDescSnippet = (job) => {
    const desc = job.description || job.full_description || ''
    if (!desc) return 'No description details available. Open details to view more.'
    return desc.length > 130 ? desc.substring(0, 130) + '...' : desc
  }

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Effect to retrieve full details for selected jobs
  useEffect(() => {
    if (!selectedJob || !selectedJob.link) {
      setSelectedJobDetails(null)
      return
    }

    const fetchDetails = async () => {
      if (detailsCache.current[selectedJob.link]) {
        setSelectedJobDetails(detailsCache.current[selectedJob.link])
        return
      }

      setLoadingDetails(true)
      setSelectedJobDetails(null)
      try {
        const url = `${API_BASE_URL}/job-details?url=${encodeURIComponent(selectedJob.link)}&source=${encodeURIComponent(selectedJob.source || '')}`
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error('Failed to fetch job details')
        }
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setSelectedJobDetails(data)
        detailsCache.current[selectedJob.link] = data
      } catch (err) {
        console.error('Error fetching job details:', err)
        const fallback = {
          full_description: selectedJob.description || 'Could not retrieve full description.',
          emails: [],
          phones: [],
          hr_details: 'Not Disclosed',
          error: err.message
        }
        setSelectedJobDetails(fallback)
        detailsCache.current[selectedJob.link] = fallback
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [selectedJob])

  const [sortBy, setSortBy] = useState('default')
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
    localStorage.removeItem('userSkills')
    checkServerHealth()
    fetchApplications()
  }, [])

  // Save skills input to localStorage
  useEffect(() => {
    localStorage.setItem('userSkills', skillsInput)
  }, [skillsInput])

  const checkServerHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/`)
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

  // Parse comma separated skills list
  const userSkills = skillsInput
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  // Evaluate skills matched on each job
  const getJobSkillMatch = (job) => {
    if (!job) return { score: 100, matches: [] }
    if (userSkills.length === 0) return { score: 100, matches: [] }
    
    const title = (job.title || '').toLowerCase()
    const desc = (job.description || '').toLowerCase()
    
    const matches = userSkills.filter(skill => {
      const s = skill.toLowerCase()
      try {
        const regex = new RegExp(`\\b${s}\\b`, 'i')
        return regex.test(title) || regex.test(desc)
      } catch (e) {
        return title.includes(s) || desc.includes(s)
      }
    })
    
    const score = Math.round((matches.length / userSkills.length) * 100)
    return { score, matches }
  }

  // Detailed breakdown of skills match analysis for job detail side-panel
  const getJobSkillAnalysis = (job) => {
    if (!job) return { matched: [], missing: [], otherUserSkills: [] }
    
    const title = (job.title || '').toLowerCase()
    const desc = (job.description || '').toLowerCase()
    
    const matched = []
    const otherUserSkills = []
    
    userSkills.forEach(skill => {
      const s = skill.toLowerCase()
      let isMatch = false
      try {
        const regex = new RegExp(`\\b${s}\\b`, 'i')
        isMatch = regex.test(title) || regex.test(desc)
      } catch (e) {
        isMatch = title.includes(s) || desc.includes(s)
      }
      
      if (isMatch) {
        matched.push(skill)
      } else {
        otherUserSkills.push(skill)
      }
    })
    
    // Common tech skills dictionary to detect missing keywords requested in listing
    const COMMON_SKILLS = [
      "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "perl", "r", "sql", "html", "css", "sass", "less",
      "react", "angular", "vue", "next.js", "nextjs", "nuxt", "svelte", "jquery", "bootstrap", "tailwind", "figma", "ui/ux",
      "node", "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring boot", "laravel", "ruby on rails",
      "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "cassandra", "firebase", "dynamodb",
      "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab", "terraform", "ansible", "linux", "nginx",
      "pytorch", "tensorflow", "keras", "pandas", "numpy", "scikit-learn", "opencv", "nlp", "machine learning", "deep learning", "artificial intelligence", "ai", "llm", "langchain",
      "jest", "cypress", "selenium", "pytest", "postman", "agile", "scrum", "rest api", "graphql", "microservices"
    ]
    
    const SKILL_DISPLAY_NAMES = {
      "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript", "java": "Java", 
      "c++": "C++", "c#": "C#", "c": "C", "go": "Go", "golang": "Go", "rust": "Rust", "ruby": "Ruby", 
      "php": "PHP", "swift": "Swift", "kotlin": "Kotlin", "scala": "Scala", "perl": "Perl", "r": "R", 
      "sql": "SQL", "html": "HTML", "css": "CSS", "sass": "Sass", "less": "Less",
      "react": "React", "angular": "Angular", "vue": "Vue", "next.js": "Next.js", "nextjs": "Next.js", 
      "nuxt": "Nuxt.js", "svelte": "Svelte", "jquery": "jQuery", "bootstrap": "Bootstrap", "tailwind": "Tailwind CSS", 
      "figma": "Figma", "ui/ux": "UI/UX", "node": "Node.js", "node.js": "Node.js", "nodejs": "Node.js", 
      "express": "Express.js", "django": "Django", "flask": "Flask", "fastapi": "FastAPI", "spring boot": "Spring Boot", 
      "laravel": "Laravel", "ruby on rails": "Ruby on Rails", "mysql": "MySQL", "postgresql": "PostgreSQL", 
      "mongodb": "MongoDB", "redis": "Redis", "sqlite": "SQLite", "oracle": "Oracle DB", "cassandra": "Cassandra", 
      "firebase": "Firebase", "dynamodb": "DynamoDB", "aws": "AWS", "azure": "Azure", "gcp": "GCP", 
      "docker": "Docker", "kubernetes": "Kubernetes", "jenkins": "Jenkins", "git": "Git", "github": "GitHub", 
      "gitlab": "GitLab", "terraform": "Terraform", "ansible": "Ansible", "linux": "Linux", "nginx": "Nginx", 
      "pytorch": "PyTorch", "tensorflow": "TensorFlow", "keras": "Keras", "pandas": "Pandas", "numpy": "NumPy", 
      "scikit-learn": "Scikit-Learn", "opencv": "OpenCV", "nlp": "NLP", "machine learning": "Machine Learning", 
      "deep learning": "Deep Learning", "artificial intelligence": "AI", "ai": "AI", "llm": "LLMs", "langchain": "LangChain", 
      "jest": "Jest", "cypress": "Cypress", "selenium": "Selenium", "pytest": "PyTest", "postman": "Postman", 
      "agile": "Agile", "scrum": "Scrum", "rest api": "REST APIs", "graphql": "GraphQL", "microservices": "Microservices"
    }
    
    const missing = []
    COMMON_SKILLS.forEach(skill => {
      const hasSkill = userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
      if (!hasSkill) {
        let isMatch = false
        try {
          const regex = new RegExp(`\\b${skill}\\b`, 'i')
          isMatch = regex.test(title) || regex.test(desc)
        } catch (e) {
          isMatch = title.includes(skill) || desc.includes(skill)
        }
        
        if (isMatch) {
          const displayName = SKILL_DISPLAY_NAMES[skill] || skill.toUpperCase()
          if (!missing.includes(displayName)) {
            missing.push(displayName)
          }
        }
      }
    })
    
    return { matched, missing, otherUserSkills }
  }

  // Main scraper fetch trigger
  const handleScrape = async (e, customQuery = null, customLoc = null) => {
    if (e) e.preventDefault()
    
    if (customQuery !== null) setQuery(customQuery)
    if (customLoc !== null) setLocation(customLoc)
    
    let activeQuery = (customQuery || query).trim()
    if (!activeQuery && skillsInput) {
      // Auto-construct a broad OR query if search keywords are empty
      const userSkills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
      activeQuery = userSkills.slice(0, 6).join(' OR ')
    }
    const activeLoc = (customLoc || location || 'Remote').trim()

    if (!activeQuery) {
      setError('Please type a job title or keywords to search!')
      return
    }

    // Get selected platforms and custom feeds
    const activePlatforms = Object.keys(selectedPlatforms).filter(k => selectedPlatforms[k])
    if (activePlatforms.length === 0 && !xmlFile && rssFeeds.length === 0) {
      setError('Please select at least one job source platform, upload an XML/RSS file, or subscribe to an RSS feed.')
      return
    }

    setLoading(true)
    setError(null)
    setJobs([])
    setSelectedJob(null)
    setActiveTab('feed')
    setStatusLogs(['🔍 Initializing search...', '🌐 Connecting to job boards...'])

    // Dynamically generate logs based on selected platforms
    const logs = []
    activePlatforms.forEach(p => {
      logs.push(`🌐 Searching ${p}...`)
    })
    rssFeeds.forEach(feed => {
      logs.push(`📡 Reading RSS Feed: ${feed.name}...`)
    })
    if (xmlFile) {
      logs.push(`📁 Parsing XML file: "${xmlFile.name}"...`)
    }
    logs.push('📝 Extracting job descriptions...', '📋 Loading jobs list...')

    let logIndex = 0
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        setStatusLogs(prev => [...prev, logs[logIndex]])
        logIndex++
      } else {
        clearInterval(logInterval)
      }
    }, 1500)

    try {
      let allFoundJobs = [];
      let anySuccess = false;

      // === RUN FAST SOURCES FIRST === //
      
      // 1. Handle Custom Feeds (Instant)
      if (rssFeeds.length > 0) {
        try {
          const formData = new FormData()
          formData.append('query', activeQuery)
          formData.append('location', activeLoc)
          formData.append('custom_feeds', JSON.stringify(rssFeeds))
          const response = await fetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: formData })
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0 && !data[0].error) {
            anySuccess = true;
            allFoundJobs = [...allFoundJobs, ...data].sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
            setJobs(allFoundJobs);
            if (!selectedJob || allFoundJobs.length === data.length) setSelectedJob(allFoundJobs[0]);
          }
        } catch (err) {}
      }

      // 2. Handle XML File (Instant)
      if (xmlFile) {
        try {
          const formData = new FormData()
          formData.append('query', activeQuery)
          formData.append('location', activeLoc)
          formData.append('file', xmlFile)
          const response = await fetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: formData })
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0 && !data[0].error) {
            anySuccess = true;
            allFoundJobs = [...allFoundJobs, ...data].sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
            setJobs(allFoundJobs);
            if (!selectedJob) setSelectedJob(allFoundJobs[0]);
          }
        } catch (err) {}
      }

      // === RUN PLATFORM SCRAPERS IN BATCHES OF 2 === //
      // This doubles the speed (cuts total time in half) while keeping memory 
      // safely under Render's 512MB limit by only running 2 Chrome instances max!
      for (let i = 0; i < activePlatforms.length; i += 2) {
        const batch = activePlatforms.slice(i, i + 2);
        
        const fetchPromises = batch.map(async (platform) => {
          try {
            const formData = new FormData()
            formData.append('query', activeQuery)
            formData.append('location', activeLoc)
            formData.append('sources', platform)
            
            const response = await fetch(`${API_BASE_URL}/jobs`, {
              method: 'POST',
              body: formData
            })
            const data = await response.json()
            return data;
          } catch (err) {
            console.error(`Failed to fetch from ${platform}:`, err);
            return null;
          }
        });

        // Wait for this batch of 2 to finish
        const results = await Promise.all(fetchPromises);
        
        let batchUpdated = false;

        results.forEach(data => {
            if (Array.isArray(data) && data.length > 0 && !data[0].error) {
              anySuccess = true;
              batchUpdated = true;
              allFoundJobs = [...allFoundJobs, ...data];
            }
        });

        if (batchUpdated) {
            allFoundJobs.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
            setJobs([...allFoundJobs]); // create a new array to force React to re-render
            if (!selectedJob || allFoundJobs.length <= 100) { 
                setSelectedJob(allFoundJobs[0]);
            }
        }
      }

      clearInterval(logInterval)

      if (anySuccess) {
        updateRecentSearches(activeQuery, activeLoc)
      } else if (allFoundJobs.length === 0 && !error) {
        setError('🚦 Server is busy right now. Please try again later.')
      }

    } catch (err) {
      clearInterval(logInterval)
      setError(`Failed to connect to backend: ${err.message}. Make sure the FastAPI server is running.`)
    } finally {
      setLoading(false)
      clearInterval(logInterval)
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
    handleScrape(null, item.query, item.location)
  }

  const clearRecentSearches = (e) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const exportToCSV = () => {
    const listToExport = filteredJobs
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

  // Filter and Sort Active Job Sets
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
    
    if (userSkills.length > 0) {
      const { score } = getJobSkillMatch(job)
      if (score === 0) return false
    }

    return matchesSearch && matchesSource
  })

  // Filter and Sort Bookmarked Jobs
  const filteredBookmarks = (savedJobs || []).filter(job => {
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
    
    if (userSkills.length > 0) {
      const { score } = getJobSkillMatch(job)
      if (score === 0) return false
    }

    return matchesSearch && matchesSource
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (!a || !b) return 0
    
    if (sortBy === 'skillFit' && userSkills.length > 0) {
      const fitA = getJobSkillMatch(a).score
      const fitB = getJobSkillMatch(b).score
      return fitB - fitA
    }

    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '')
    } else if (sortBy === 'company') {
      return (a.company || '').localeCompare(b.company || '')
    } else if (sortBy === 'source') {
      return (a.source || '').localeCompare(b.source || '')
    }
    return 0
  })

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (!a || !b) return 0
    
    if (sortBy === 'skillFit' && userSkills.length > 0) {
      const fitA = getJobSkillMatch(a).score
      const fitB = getJobSkillMatch(b).score
      return fitB - fitA
    }

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
  const activeDataset = activeTab === 'bookmarks' ? (savedJobs || []) : (jobs || [])
  const sourceCounts = activeDataset.reduce((acc, job) => {
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
      case 'foundit': return 'badge-foundit'
      case 'shine': return 'badge-shine'
      case 'hirist': return 'badge-hirist'
      case 'weworkremotely': return 'badge-weworkremotely'
      default: return 'badge-generic'
    }
  }

  const searches = Array.isArray(recentSearches) ? recentSearches : []
  const bookmarksList = Array.isArray(savedJobs) ? savedJobs : []

  const detailSkillMatch = selectedJob ? getJobSkillMatch(selectedJob) : { score: 0, matches: [] }
  const missingSkills = selectedJob ? userSkills.filter(s => !detailSkillMatch.matches.includes(s)) : []

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="app-layout">
      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="header-container">
          <div className="app-logo" onClick={() => { setJobs([]); setSelectedJob(null); setActiveTab('feed'); }} title="Reset Search">
            <LogoIcon />
            <h2>Novox Job Finder</h2>
            <span className={`status-dot-sm ${serverStatus.toLowerCase()}`} title={`API Server: ${serverStatus}`}></span>
          </div>
        </div>
        
        <div className="header-subheader">
          <span>🔍 Real-Time Job Search Engine</span>
          <span>{currentDate}</span>
        </div>

        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('feed'); }}
          >
            Job Board
          </button>
          <button 
            className={`nav-btn ${activeTab === 'bookmarks' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('bookmarks'); if (bookmarksList.length > 0) { setSelectedJob(bookmarksList[0]); } }}
          >
            Saved Jobs ({bookmarksList.length})
          </button>
          <button 
            className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('applications'); }}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('settings'); }}
          >
            Settings
          </button>
        </nav>
      </header>

      {/* Main Workspace Area */}
      <main className="main-container">
        {loading && (
          <div className="console-progress-card-overlay animate-fade-in">
            <div className="console-progress-card premium-progress-card animate-slide-up">
              {/* Progress Bar Container */}
              <div className="loading-progress-bar-container">
                <div className="loading-progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              
              {/* Radar Scanner Area */}
              <div className="loading-scanner-container">
                <div className="radar-scanner">
                  <div className="radar-sweep"></div>
                  <div className="radar-circle ring-1"></div>
                  <div className="radar-circle ring-2"></div>
                  <div className="radar-circle ring-3"></div>
                  <div className="radar-pulse"></div>
                </div>
                <h3>Searching Job Boards...</h3>
                <p className="loading-subtitle">Scraping and analyzing job boards in real-time</p>
              </div>

              {/* Interactive Mini Game */}
              <RunnerGame />
              
              
              {/* Trivia Slideshow (Distraction & Value Addition) */}
              <div className="trivia-card">
                <div className="trivia-header">
                  <span className="trivia-icon">{LOADING_TRIVIA[triviaIndex]?.icon}</span>
                  <span className="trivia-category">{LOADING_TRIVIA[triviaIndex]?.category}</span>
                </div>
                <p className="trivia-text">"{LOADING_TRIVIA[triviaIndex]?.text}"</p>
              </div>
              
              {/* Terminal Logs console */}
              <div className="console-logs-header">
                <span>SYSTEM LOGS</span>
                <span className="console-percentage">{Math.round(progress)}%</span>
              </div>
              <div className="console-logs-list">
                {statusLogs.map((log, index) => (
                  <div key={index} className="log-line">
                    <span className="log-arrow">›</span> {log}
                  </div>
                ))}
                <div className="log-cursor-line">
                  <span className="log-arrow">›</span>
                  <span className="terminal-cursor">█</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="console-error-card" style={{ margin: '24px auto', maxWidth: '880px', width: '90%' }}>
            <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
          </div>
        )}

        {/* FEED TAB VIEW */}
        {activeTab === 'feed' && (
          <div className="feed-container">
            {jobs.length === 0 ? (
              /* Landing/Home Hub */
              <div className="home-scroll-container" style={{ padding: '40px 24px' }}>
                <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  
                  {/* Hero Section */}
                  <div className="hero-section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <LogoIcon className="large-hero-logo" />
                    <h1>Find Your Next Job</h1>
                    <p>Search across 9 major platforms instantly in real-time.</p>
                  </div>
                  
                  {/* Search Bar */}
                  <form onSubmit={(e) => handleScrape(e)} className="search-form-bar" style={{ margin: '0 auto', width: '100%' }}>
                    <div className="search-input-field">
                      <SearchIcon size={20} />
                      <input
                        id="query-main"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="1. What job do you want? (e.g. React, Writer)"
                        disabled={loading}
                      />
                    </div>
                    <div className="divider-vertical"></div>
                    <div className="search-input-field" style={{ maxWidth: '240px' }}>
                      <LocationIcon />
                      <input
                        id="location-main"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="2. Where? (e.g. Remote)"
                        disabled={loading}
                        onFocus={() => setShowLocSuggestionsMain(true)}
                        onBlur={() => setTimeout(() => setShowLocSuggestionsMain(false), 200)}
                        autoComplete="off"
                      />
                      {showLocSuggestionsMain && (
                        <div className="custom-autocomplete-dropdown">
                          {getFilteredLocations(location).map(loc => (
                            <div 
                              key={loc} 
                              className="autocomplete-item"
                              onMouseDown={() => {
                                setLocation(loc);
                                setShowLocSuggestionsMain(false);
                              }}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className="autocomplete-icon">🔍</span>
                                <span className="autocomplete-text">{loc}</span>
                              </div>
                              {HOT_MARKETS[loc] && (
                                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#d97706', background: 'rgba(245, 158, 11, 0.08)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
                                  {HOT_MARKETS[loc]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="divider-vertical"></div>
                    
                    {/* Resume Upload Option */}
                    <label className="resume-upload-label-bar" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', background: 'var(--primary-glow)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.15)', height: '40px', boxSizing: 'border-box', whiteSpace: 'nowrap', transition: 'var(--transition)' }} title="Upload Resume to Auto-Fill Skills & Auto-Search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{parsingResume ? 'Reading...' : 'Upload Resume'}</span>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        disabled={parsingResume}
                      />
                    </label>
                    
                    <button type="submit" className="btn btn-primary btn-search" disabled={loading || parsingResume} style={{ height: '40px' }}>
                      {loading ? 'Searching...' : '🔍 Search'}
                    </button>
                  </form>

                  {/* Always Visible Developer Skills row */}
                  <div className="skills-always-visible-row" style={{ textAlign: 'left', background: 'var(--bg-surface)', padding: '16px 20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '13.5px', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>🧠 Developer Skills</h3>
                    </div>
                    
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                      List your skills separated by commas (e.g. Python, SQL, React) to automatically highlight matches and score relevance in search results.
                    </p>
                    
                    <div className="input-group" style={{ marginTop: '4px' }}>
                      <input
                        id="userSkills-home"
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. Python, SQL, Django, React, AWS..."
                        disabled={parsingResume}
                      />
                    </div>

                    {/* Extracted Achievements display */}
                    {resumeAchievements.length > 0 && (
                      <div className="resume-achievements-box" style={{ marginTop: '4px', padding: '12px 14px', background: 'rgba(37, 99, 235, 0.03)', border: '1px dashed rgba(37, 99, 235, 0.2)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ fontSize: '12.5px', color: 'var(--primary)', margin: '0 0 6px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🏆 Detected achievements from your resume:</span>
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                          {resumeAchievements.map((ach, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Active Job Boards Platform Card Grid */}
                  <div className="platforms-drawer" style={{ margin: '0', background: 'var(--bg-surface)', width: '100%', maxWidth: '100%' }}>
                    <h3 style={{ fontSize: '13.5px', margin: '0 0 12px 0', fontWeight: 700, color: 'var(--text-main)', textAlign: 'left' }}>Active Job Boards:</h3>
                    <div className="platforms-grid">
                      {Object.keys(selectedPlatforms).map(platform => (
                        <div 
                          key={platform} 
                          className={`platform-card ${selectedPlatforms[platform] ? 'active' : 'inactive'}`}
                          onClick={() => handleCheckboxChange(platform)}
                          style={{ cursor: 'pointer' }}
                          title={`Toggle ${platform}`}
                        >
                          <div className="platform-header">
                            <span className={`badge-dot ${getSourceBadgeColor(platform)}`}></span>
                            <h4>{platform}</h4>
                          </div>
                          <span className="status-label">{selectedPlatforms[platform] ? 'Active' : 'Skip'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Job Roles */}
                  <div className="dashboard-section" style={{ textAlign: 'left' }}>
                    <h3>Popular Job Roles:</h3>
                    <div className="popular-searches-grid">
                      <div className="popular-search-card" onClick={(e) => handleScrape(e, 'React Developer', 'Remote')}>
                        <span className="card-icon">⚛</span>
                        <h4>React Developer</h4>
                        <p>Remote / Work from home</p>
                      </div>
                      <div className="popular-search-card" onClick={(e) => handleScrape(e, 'Python Developer', 'Remote')}>
                        <span className="card-icon">🐍</span>
                        <h4>Python Engineer</h4>
                        <p>Remote / Global</p>
                      </div>
                      <div className="popular-search-card" onClick={(e) => handleScrape(e, 'Game Developer', 'Remote')}>
                        <span className="card-icon">🎮</span>
                        <h4>Game Developer</h4>
                        <p>Remote / Hybrid</p>
                      </div>
                      <div className="popular-search-card" onClick={(e) => handleScrape(e, 'Web Designer', 'Remote')}>
                        <span className="card-icon">🎨</span>
                        <h4>Web Designer</h4>
                        <p>Remote / Anywhere</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {searches.length > 0 && (
                    <div className="dashboard-section" style={{ textAlign: 'left' }}>
                      <div className="section-header-row">
                        <h3>Recent Searches</h3>
                        <button onClick={clearRecentSearches} className="btn-text-clear">Clear History</button>
                      </div>
                      <div className="history-tags-grid">
                        {searches.map((item, idx) => (
                          item && (
                            <div key={idx} className="history-chip" onClick={() => runRecentSearch(item)}>
                              <span>{item.query}</span>
                              <span className="loc-text"><LocationIcon /> {item.location}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Results View: Fixed Search Bar & Skills, Scrollable Cards Below */
              <>
                {loading && (
                  <div style={{ background: '#f59e0b', color: 'white', textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    ⏳ Still fetching jobs from other platforms in the background... You can start browsing now!
                  </div>
                )}
                <div className="search-box-section results-view">
                  <form onSubmit={(e) => handleScrape(e)} className="search-form-bar">
                    <div className="search-input-field">
                      <SearchIcon size={20} />
                      <input
                        id="query-results"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="1. What job do you want? (e.g. React, Writer)"
                        disabled={loading}
                      />
                    </div>
                    <div className="divider-vertical"></div>
                    <div className="search-input-field" style={{ maxWidth: '240px' }}>
                      <LocationIcon />
                      <input
                        id="location-results"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="2. Where? (e.g. Remote)"
                        disabled={loading}
                        onFocus={() => setShowLocSuggestionsResults(true)}
                        onBlur={() => setTimeout(() => setShowLocSuggestionsResults(false), 200)}
                        autoComplete="off"
                      />
                      {showLocSuggestionsResults && (
                        <div className="custom-autocomplete-dropdown">
                          {getFilteredLocations(location).map(loc => (
                            <div 
                              key={loc} 
                              className="autocomplete-item"
                              onMouseDown={() => {
                                setLocation(loc);
                                setShowLocSuggestionsResults(false);
                              }}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className="autocomplete-icon">🔍</span>
                                <span className="autocomplete-text">{loc}</span>
                              </div>
                              {HOT_MARKETS[loc] && (
                                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#d97706', background: 'rgba(245, 158, 11, 0.08)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
                                  {HOT_MARKETS[loc]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="divider-vertical"></div>
                    
                    {/* Resume Upload Option */}
                    <label className="resume-upload-label-bar" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', background: 'var(--primary-glow)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.15)', height: '40px', boxSizing: 'border-box', whiteSpace: 'nowrap', transition: 'var(--transition)' }} title="Upload Resume to Auto-Fill Skills & Auto-Search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{parsingResume ? 'Reading...' : 'Upload Resume'}</span>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        disabled={parsingResume}
                      />
                    </label>
                    
                    <button type="submit" className="btn btn-primary btn-search" disabled={loading || parsingResume} style={{ height: '40px' }}>
                      {loading ? 'Searching...' : '🔍 Search'}
                    </button>
                  </form>

                  {/* Always Visible Developer Skills row in Results View */}
                  <div className="skills-results-view-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', background: 'var(--bg-surface)', padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', maxWidth: '880px', margin: '10px auto 0 auto', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>🧠 Developer Skills:</span>
                    <input
                      id="userSkills-results"
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. Python, SQL, React..."
                      style={{ flex: 1, padding: '6px 10px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-base)', color: 'var(--text-main)', outline: 'none' }}
                      disabled={parsingResume}
                    />
                  </div>

                  {/* Extracted Achievements display in Results View */}
                  {resumeAchievements.length > 0 && (
                    <div className="resume-achievements-box" style={{ marginTop: '8px', padding: '10px 14px', background: 'rgba(37, 99, 235, 0.03)', border: '1px dashed rgba(37, 99, 235, 0.2)', borderRadius: 'var(--radius-sm)', maxWidth: '880px', margin: '8px auto 0 auto', textAlign: 'left', boxSizing: 'border-box' }}>
                      <h4 style={{ fontSize: '12.5px', color: 'var(--primary)', margin: '0 0 4px 0', fontWeight: 700 }}>🏆 Detected achievements from your resume:</h4>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {resumeAchievements.map((ach, idx) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="advanced-options-row" style={{ margin: '8px 0 0 0' }}>
                    <button 
                      onClick={() => setShowAdvancedPlatforms(!showAdvancedPlatforms)} 
                      className="btn-text-clear"
                      type="button"
                    >
                      {showAdvancedPlatforms ? '▲ Hide Active Job Boards' : '⚙️ Select active job boards to search...'}
                    </button>
                  </div>

                  {/* Toggle Job Boards checklist drawer in Results View */}
                  {showAdvancedPlatforms && (
                    <div className="platforms-drawer" style={{ animation: 'slide-down 0.2s ease', margin: '10px auto 0 auto', background: 'var(--bg-surface)' }}>
                      <h3 style={{ fontSize: '13.5px', margin: '0 0 12px 0', fontWeight: 700, color: 'var(--text-main)', textAlign: 'left' }}>Active Job Boards:</h3>
                      <div className="platforms-grid">
                        {Object.keys(selectedPlatforms).map(platform => (
                          <div 
                            key={platform} 
                            className={`platform-card ${selectedPlatforms[platform] ? 'active' : 'inactive'}`}
                            onClick={() => handleCheckboxChange(platform)}
                            style={{ cursor: 'pointer' }}
                            title={`Toggle ${platform}`}
                          >
                            <div className="platform-header">
                              <span className={`badge-dot ${getSourceBadgeColor(platform)}`}></span>
                              <h4>{platform}</h4>
                            </div>
                            <span className="status-label">{selectedPlatforms[platform] ? 'Active' : 'Skip'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="jobs-grid-container">
                <div className="jobs-grid-wrapper">
                  <div className="grid-controls-row">
                    <div className="grid-filters-group">
                      <input
                        type="text"
                        className="search-filter-input"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Filter by title or company..."
                      />
                      <select 
                        className="sort-select" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="default">Default Sort</option>
                        {userSkills.length > 0 && (
                          <option value="skillFit">Sort by Skill Fit</option>
                        )}
                        <option value="title">Sort by Job Title</option>
                        <option value="company">Sort by Company</option>
                      </select>
                      <button onClick={exportToCSV} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}>
                        📥 Export to CSV
                      </button>
                    </div>

                    <div className="grid-source-tabs">
                      <button 
                        className={`tab-btn ${selectedSource === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedSource('All')}
                      >
                        All ({jobs.length})
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

                  <div className="grid-jobs-grid">
                    {sortedJobs.length > 0 ? (
                      sortedJobs.map((job, idx) => {
                        const skillMatch = getJobSkillMatch(job)
                        const isSaved = bookmarksList.some(x => x && x.link === job.link)
                        return (
                          <div 
                            key={idx} 
                            className="job-grid-card"
                            onClick={() => { setSelectedJob(job); setShowDetailsModal(true); }}
                          >
                            <div className="card-header">
                              <span className={`source-badge ${getSourceBadgeColor(job.source)}`}>
                                {job.source}
                              </span>
                              {appliedJobLinks.includes(job.link) && (
                                <span className="applied-badge">✓ Applied</span>
                              )}
                              <span className="card-salary">{job.salary || 'Not Disclosed'}</span>
                            </div>
                            <div className="card-main-info">
                              <h4 className="card-title">{job.title || 'Job Opportunity'}</h4>
                              <p className="card-company">{job.company || 'Unknown Company'}</p>
                              <p className="card-location">📍 {job.location || 'Anywhere'}</p>
                              <p className="card-desc-snippet">{getDescSnippet(job)}</p>
                              {userSkills.length > 0 && skillMatch.matches.length > 0 && (
                                <div className="card-skills-fit-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    <span>🧠 {skillMatch.score}% Fit</span>
                                    <span style={{ color: 'var(--border-hover)' }}>•</span>
                                    <span>Skills:</span>
                                  </div>
                                  <div className="skills-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {skillMatch.matches.map(s => (
                                      <span key={s} className="skill-badge matched" style={{ fontSize: '10px', padding: '2px 8px' }}>
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="card-actions">
                              <button 
                                className="btn btn-card-details"
                                onClick={(e) => { e.stopPropagation(); setSelectedJob(job); setShowDetailsModal(true); }}
                              >
                                Details
                              </button>
                              {appliedJobLinks.includes(job.link) ? (
                                <span className="applied-btn-badge">✓ Applied</span>
                              ) : (
                                <button 
                                  className="btn btn-applied-card"
                                  onClick={(e) => { e.stopPropagation(); handleMarkApplied(job); }}
                                >
                                  Applied
                                </button>
                              )}
                              <button 
                                className={`btn-card-save ${isSaved ? 'saved' : ''}`}
                                onClick={(e) => toggleBookmark(job, e)}
                                title={isSaved ? 'Remove from Saved' : 'Save Job'}
                              >
                                <HeartIcon filled={isSaved} />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="empty-pane-state">
                        <p>No jobs match your filters.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        )}

        {/* BOOKMARKS TAB VIEW */}
        {activeTab === 'bookmarks' && (
          bookmarksList.length === 0 ? (
            <div className="empty-state-card" style={{ margin: '40px auto 0 auto', maxWidth: '640px', width: '90%' }}>
              <div className="empty-icon">
                <HeartIcon filled={true} />
              </div>
              <h3>No Saved Jobs</h3>
              <p>Bookmark jobs to track them offline in this list.</p>
            </div>
          ) : (
            <div className="jobs-grid-container">
              <div className="jobs-grid-wrapper">
                <div className="grid-controls-row">
                  <div className="grid-filters-group">
                    <input
                      type="text"
                      className="search-filter-input"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Search saved jobs..."
                    />
                    <select 
                      className="sort-select" 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default Sort</option>
                      {userSkills.length > 0 && (
                        <option value="skillFit">Sort by Skill Fit</option>
                      )}
                      <option value="title">Sort by Job Title</option>
                      <option value="company">Sort by Company</option>
                    </select>
                  </div>

                  <div className="grid-source-tabs">
                    <button 
                      className={`tab-btn ${selectedSource === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedSource('All')}
                    >
                      All ({bookmarksList.length})
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

                <div className="grid-jobs-grid">
                  {sortedBookmarks.length > 0 ? (
                    sortedBookmarks.map((job, idx) => {
                      const skillMatch = getJobSkillMatch(job)
                      const isSaved = bookmarksList.some(x => x && x.link === job.link)
                      return (
                        <div 
                          key={idx} 
                          className="job-grid-card"
                          onClick={() => { setSelectedJob(job); setShowDetailsModal(true); }}
                        >
                          <div className="card-header">
                            <span className={`source-badge ${getSourceBadgeColor(job.source)}`}>
                              {job.source}
                            </span>
                            {appliedJobLinks.includes(job.link) && (
                              <span className="applied-badge">✓ Applied</span>
                            )}
                            <span className="card-salary">{job.salary || 'Not Disclosed'}</span>
                          </div>
                          <div className="card-main-info">
                            <h4 className="card-title">{job.title || 'Job Opportunity'}</h4>
                            <p className="card-company">{job.company || 'Unknown Company'}</p>
                            <p className="card-location">📍 {job.location || 'Anywhere'}</p>
                            <p className="card-desc-snippet">{getDescSnippet(job)}</p>
                            {userSkills.length > 0 && skillMatch.matches.length > 0 && (
                              <div className="card-skills-fit-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                                  <span>🧠 {skillMatch.score}% Fit</span>
                                  <span style={{ color: 'var(--border-hover)' }}>•</span>
                                  <span>Skills:</span>
                                </div>
                                <div className="skills-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {skillMatch.matches.map(s => (
                                    <span key={s} className="skill-badge matched" style={{ fontSize: '10px', padding: '2px 8px' }}>
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="card-actions">
                            <button 
                              className="btn btn-card-details"
                              onClick={(e) => { e.stopPropagation(); setSelectedJob(job); setShowDetailsModal(true); }}
                            >
                              Details
                            </button>
                            {appliedJobLinks.includes(job.link) ? (
                              <span className="applied-btn-badge">✓ Applied</span>
                            ) : (
                              <button 
                                className="btn btn-applied-card"
                                onClick={(e) => { e.stopPropagation(); handleMarkApplied(job); }}
                              >
                                Applied
                              </button>
                            )}
                            <button 
                              className={`btn-card-save ${isSaved ? 'saved' : ''}`}
                              onClick={(e) => toggleBookmark(job, e)}
                              title={isSaved ? 'Remove from Saved' : 'Save Job'}
                            >
                              <HeartIcon filled={isSaved} />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="empty-pane-state">
                      <p>No jobs match your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {/* APPLICATIONS VIEW */}
        {activeTab === 'applications' && (
          <div className="jobs-grid-container" style={{ margin: '40px auto 0 auto', maxWidth: '1200px', width: '95%' }}>
            <div className="card form-page-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📝 Server Application Registry
                  </h2>
                  <p className="page-desc" style={{ marginTop: '4px', margin: '0' }}>
                    View all job applications submitted to the server by users.
                  </p>
                </div>
                <button 
                  onClick={fetchApplications} 
                  className="btn btn-secondary" 
                  disabled={loadingApplications}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  {loadingApplications ? '🔄 Refreshing...' : '🔄 Refresh Registry'}
                </button>
              </div>
              
              <div className="divider-horizontal" style={{ margin: '16px 0' }}></div>
              
              {/* Metric Row */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL APPLICATIONS</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{appliedJobs.length}</div>
                </div>
                <div style={{ flex: '1 1 200px', background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>UNIQUE COMPANIES</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {new Set(appliedJobs.map(app => app.company)).size}
                  </div>
                </div>
                <div style={{ flex: '1 1 200px', background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATIONS TARGETED</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    {new Set(appliedJobs.map(app => app.location)).size}
                  </div>
                </div>
              </div>
            </div>

            <div className="jobs-grid-wrapper">
              <div className="grid-controls-row">
                <div className="grid-filters-group" style={{ width: '100%' }}>
                  <input
                    type="text"
                    className="search-filter-input"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search applications by company, job title, location..."
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {loadingApplications ? (
                <div className="empty-pane-state">
                  <p>Loading application registry from server...</p>
                </div>
              ) : (
                (() => {
                  const filteredApps = appliedJobs.filter(app => {
                    const search = appSearch.toLowerCase().trim();
                    if (!search) return true;
                    return (
                      (app.job_title || '').toLowerCase().includes(search) ||
                      (app.company || '').toLowerCase().includes(search) ||
                      (app.location || '').toLowerCase().includes(search)
                    );
                  });

                  if (filteredApps.length === 0) {
                    return (
                      <div className="empty-pane-state">
                        <p>{appSearch ? 'No applications match your search query.' : 'No application logs found on the server. Click "Applied" on any job to add it.'}</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid-jobs-grid">
                      {filteredApps.map((app, idx) => (
                        <div key={idx} className="job-grid-card application-grid-card" style={{ cursor: 'default' }}>
                          <div className="card-header">
                            <span className="source-badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                              💼 Applied Job
                            </span>
                            <span className="card-salary" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {app.applied_at ? new Date(app.applied_at).toLocaleString() : 'Date N/A'}
                            </span>
                          </div>
                          
                          <div className="card-main-info" style={{ gap: '6px' }}>
                            <h4 className="card-title" style={{ marginTop: '4px' }}>{app.job_title}</h4>
                            <p className="card-company">🏢 {app.company}</p>
                            <p className="card-location">📍 {app.location}</p>
                          </div>
                          
                          <div className="card-actions">
                            <a 
                              href={app.link || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-card-details"
                              style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}
                            >
                              Open Job Link ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="card form-page-card" style={{ margin: '40px auto 0 auto', maxWidth: '800px', width: '90%' }}>
            <h2>⚙️ Settings & RSS Feeds</h2>
            <p className="page-desc">Configure your search platforms, RSS feeds, and file uploads in a single place.</p>
            
            <div className="settings-grid">


              {/* Section 1: Active Job Boards */}
              <div className="settings-section">
                <h3>🔍 Active Job Boards</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Select which job boards will be searched.
                </p>
                <div className="settings-checkboxes-grid">
                  {Object.keys(selectedPlatforms).map(platform => (
                    <label key={platform} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms[platform]}
                        onChange={() => handleCheckboxChange(platform)}
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider-horizontal"></div>

              {/* Section 3: Parse Local XML File */}
              <div className="settings-section">
                <h3>📁 Parse Local XML / RSS File</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Upload an XML or RSS file of jobs to parse them.
                </p>
                <div className="file-upload-container">
                  {xmlFile ? (
                    <div className="uploaded-file-info">
                      <span className="file-icon">📁</span>
                      <span className="file-name" title={xmlFile.name}>{xmlFile.name}</span>
                      <button type="button" className="btn-delete" onClick={handleRemoveFile}>✕</button>
                    </div>
                  ) : (
                    <label className="file-upload-label">
                      <span className="upload-icon">📥</span>
                      <span className="upload-text">Choose XML/RSS file or drag here</span>
                      <input
                        type="file"
                        accept=".xml,.rss"
                        onChange={handleFileChange}
                        className="file-input-hidden"
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {xmlFile && (
                  <button onClick={(e) => handleScrape(e)} className="btn btn-primary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
                    Parse Uploaded File Now
                  </button>
                )}
              </div>

              <div className="divider-horizontal"></div>

              {/* Section 4: RSS Feed subscriptions list */}
              <div className="settings-section">
                <h3>📡 RSS Feed Subscriptions</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Subscribe to external RSS/Atom feed links.
                </p>
                
                {rssFeeds.length > 0 ? (
                  <div className="feeds-list" style={{ marginBottom: '16px' }}>
                    {rssFeeds.map((feed, idx) => (
                      <div key={idx} className="feed-item">
                        <span className="feed-info" title={feed.url}>
                          <strong>{feed.name}</strong> - <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{feed.url}</span>
                        </span>
                        <button type="button" className="btn-delete" onClick={() => handleDeleteFeed(idx)}>✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="feed-info-tip" style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No active RSS feeds. Add a feed URL below to include it in your searches.
                  </div>
                )}

                <form onSubmit={handleAddFeed} className="add-feed-form">
                  <input
                    type="text"
                    className="feed-input"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    placeholder="Feed Name..."
                    required
                  />
                  <input
                    type="url"
                    className="feed-input"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    placeholder="Feed RSS/Atom URL..."
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Add RSS Feed</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Job Details Modal Overlay */}
      {showDetailsModal && selectedJob && (
        <div className="details-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="details-modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="details-modal-header-bar">
              <h2>Job Details</h2>
              <button className="btn-modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </header>
            
            <div className="details-modal-body">
              <article className="details-modal-article">
                <header className="details-header">
                  <div className="details-meta">
                    <span className={`source-badge ${getSourceBadgeColor(selectedJob.source)}`}>
                      Source: {selectedJob.source || 'Unknown'}
                    </span>
                    <button 
                      onClick={(e) => toggleBookmark(selectedJob, e)}
                      className="btn-save-job"
                    >
                      {bookmarksList.some(x => x && x.link === selectedJob.link) ? '★ Saved' : '☆ Save Job'}
                    </button>
                  </div>
                  <h1 className="details-title">{selectedJob.title || 'Job Opportunity'}</h1>
                  <p className="details-subtitle">Company: <strong>{selectedJob.company || 'Unknown Company'}</strong> — Location: {selectedJob.location || 'Anywhere'}</p>
                  <p className="details-salary">Salary: {selectedJob.salary || 'Not Disclosed'}</p>
                  <div className="divider-horizontal"></div>
                </header>

                <div className="details-body">
                  {userSkills.length > 0 && (() => {
                    const { matched, missing, otherUserSkills } = getJobSkillAnalysis(selectedJob)
                    return (
                      <div className="skills-match-section">
                        <h4>🧠 Skill Match Analysis</h4>
                        <div className="skills-group">
                          {matched.length > 0 && (
                            <div className="skills-subgroup">
                              <span className="skills-label matched">Matched skills in your profile:</span>
                              <div className="skills-tags">
                                {matched.map(s => <span key={s} className="skill-badge matched">{s}</span>)}
                              </div>
                            </div>
                          )}
                          {missing.length > 0 && (
                            <div className="skills-subgroup">
                              <span className="skills-label missing">Required skills missing from your profile:</span>
                              <div className="skills-tags">
                                {missing.map(s => <span key={s} className="skill-badge missing">{s}</span>)}
                              </div>
                            </div>
                          )}
                          {otherUserSkills.length > 0 && (
                            <div className="skills-subgroup">
                              <span className="skills-label" style={{ color: 'var(--text-muted)' }}>Other skills in your profile (not requested):</span>
                              <div className="skills-tags">
                                {otherUserSkills.map(s => <span key={s} className="skill-badge profile">{s}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {loadingDetails && (
                    <div className="skeleton-loader" style={{ padding: '12px 0' }}>
                      <h4>Retrieving job details...</h4>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-text title"></div>
                      <div className="skeleton-text paragraph"></div>
                    </div>
                  )}

                  {!loadingDetails && selectedJobDetails && (
                    <div className="contact-section">
                      <h4>📞 Contact Information</h4>
                      <div className="contact-grid">
                        <div className="contact-row contact-row-full">
                          <div className="contact-icon">
                            <UserCardIcon />
                          </div>
                          <div className="contact-info">
                            <span className="contact-label">Contact Person / HR</span>
                            <span className="contact-value" style={{ whiteSpace: 'pre-line' }}>
                              {selectedJobDetails.hr_details && selectedJobDetails.hr_details !== 'Not Disclosed' 
                                ? selectedJobDetails.hr_details 
                                : 'Contact details not disclosed'}
                            </span>
                          </div>
                        </div>

                        <div className="contact-row">
                          <div className="contact-icon">
                            <MailIcon />
                          </div>
                          <div className="contact-info">
                            <span className="contact-label">Email</span>
                            <div className="contact-value">
                              {selectedJobDetails.emails?.length > 0 ? (
                                selectedJobDetails.emails.map((email, idx) => (
                                  <div key={`email-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                                    <a href={`mailto:${email}`}>{email}</a>
                                    <button 
                                      onClick={() => copyToClipboard(email, `email-${idx}`)}
                                      className="contact-copy-btn"
                                      title="Copy Email"
                                    >
                                      <CopyIcon />
                                    </button>
                                    {copiedField === `email-${idx}` && <span className="contact-copied-text">Copied!</span>}
                                  </div>
                                ))
                              ) : (
                                <span className="contact-value-empty">Not Listed</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="contact-row">
                          <div className="contact-icon">
                            <PhoneIcon />
                          </div>
                          <div className="contact-info">
                            <span className="contact-label">Phone</span>
                            <div className="contact-value">
                              {selectedJobDetails.phones?.length > 0 ? (
                                selectedJobDetails.phones.map((phone, idx) => (
                                  <div key={`phone-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                                    <a href={`tel:${phone}`}>{phone}</a>
                                    <button 
                                      onClick={() => copyToClipboard(phone, `phone-${idx}`)}
                                      className="contact-copy-btn"
                                      title="Copy Phone"
                                    >
                                      <CopyIcon />
                                    </button>
                                    {copiedField === `phone-${idx}` && <span className="contact-copied-text">Copied!</span>}
                                  </div>
                                ))
                              ) : (
                                <span className="contact-value-empty">Not Listed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="description-section">
                    <h4 className="description-title">📋 Job Description</h4>
                    {loadingDetails ? (
                      <div className="skeleton-loader" style={{ padding: '8px 0' }}>
                        <div className="skeleton-text title" style={{ width: '30%', marginBottom: '10px' }}></div>
                        <div className="skeleton-text paragraph" style={{ height: '60px', marginBottom: '15px' }}></div>
                        <div className="skeleton-text title" style={{ width: '45%', marginBottom: '10px' }}></div>
                        <div className="skeleton-text paragraph" style={{ height: '80px' }}></div>
                      </div>
                    ) : (
                      selectedJobDetails?.structured_description && 
                      (selectedJobDetails.structured_description.about?.length > 0 ||
                       selectedJobDetails.structured_description.responsibilities?.length > 0 ||
                       selectedJobDetails.structured_description.requirements?.length > 0 ||
                       selectedJobDetails.structured_description.benefits?.length > 0) ? (
                        <div className="structured-description">
                          {selectedJobDetails.structured_description.about?.length > 0 && (
                            <div className="description-block">
                              <h5>About the Role</h5>
                              <ul>
                                {selectedJobDetails.structured_description.about.map((item, idx) => (
                                  <li key={`about-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedJobDetails.structured_description.responsibilities?.length > 0 && (
                            <div className="description-block">
                              <h5>Key Responsibilities</h5>
                              <ul>
                                {selectedJobDetails.structured_description.responsibilities.map((item, idx) => (
                                  <li key={`resp-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedJobDetails.structured_description.requirements?.length > 0 && (
                            <div className="description-block">
                              <h5>Requirements & Skills</h5>
                              <ul>
                                {selectedJobDetails.structured_description.requirements.map((item, idx) => (
                                  <li key={`req-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedJobDetails.structured_description.benefits?.length > 0 && (
                            <div className="description-block">
                              <h5>Benefits & Perks</h5>
                              <ul>
                                {selectedJobDetails.structured_description.benefits.map((item, idx) => (
                                  <li key={`ben-${idx}`}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p style={{ whiteSpace: 'pre-line', fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                          {selectedJobDetails?.full_description || 
                           selectedJob.description || 
                           'No description details available. Click the button below to apply.'}
                        </p>
                      )
                    )}
                  </div>
                </div>

                <footer className="details-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  {appliedJobLinks.includes(selectedJob.link) ? (
                    <span className="applied-btn-badge" style={{ padding: '10px 18px', fontSize: '13px' }}>✓ Applied</span>
                  ) : (
                    <button 
                      className="btn btn-applied-card"
                      onClick={() => handleMarkApplied(selectedJob)}
                      style={{ padding: '10px 18px', fontSize: '13px' }}
                    >
                      Applied
                    </button>
                  )}
                  <a 
                    href={selectedJob.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-apply"
                    style={{ margin: 0 }}
                  >
                    Apply on Website ↗
                  </a>
                </footer>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
