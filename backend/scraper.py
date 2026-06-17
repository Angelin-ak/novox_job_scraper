import time
import random
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from concurrent.futures import ThreadPoolExecutor, as_completed

class JobScraper:
    def __init__(self):
        self.chrome_options = Options()
        self.chrome_options.page_load_strategy = 'eager'
        self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        
        # Disable image loading
        prefs = {"profile.managed_default_content_settings.images": 2}
        self.chrome_options.add_experimental_option("prefs", prefs)

        self.preferred_browser = None  # Cache successful browser to prevent slow fallbacks
        self.last_driver_error = None

        # Only override binary_location on Linux systems
        import platform
        if platform.system() == "Linux":
            self.chrome_options.binary_location = "/usr/bin/google-chrome"
            render_chrome_path = "/opt/render/project/.render/chrome_v2/chrome-linux64/chrome"
            if os.path.exists(render_chrome_path):
                self.chrome_options.binary_location = render_chrome_path

    def _get_keywords(self, query):
        if not query:
            return ["python"]
        import re
        raw_keywords = re.split(r'\s+OR\s+|\s+or\s+|,\s*', query)
        keywords = [k.strip() for k in raw_keywords if k.strip()]
        if not keywords:
            return ["python"]
        # Limit to top 5 keywords to avoid too many page loads
        return keywords[:5]

    def _get_chrome_driver(self):
        try:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=self.chrome_options)
            return driver
        except Exception as e:
            import traceback
            self.last_chrome_error = traceback.format_exc()
            return None

    def _get_edge_driver(self):
        try:
            from selenium.webdriver.edge.service import Service as EdgeService
            from selenium.webdriver.edge.options import Options as EdgeOptions
            from webdriver_manager.microsoft import EdgeChromiumDriverManager
            
            edge_options = EdgeOptions()
            edge_options.page_load_strategy = 'eager'
            edge_options.add_argument("--headless")
            edge_options.add_argument("--no-sandbox")
            edge_options.add_argument("--disable-dev-shm-usage")
            edge_options.add_argument("--disable-gpu")
            edge_options.add_argument("--disable-blink-features=AutomationControlled")
            edge_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
            
            # Disable image loading
            prefs = {"profile.managed_default_content_settings.images": 2}
            edge_options.add_experimental_option("prefs", prefs)
            
            service = EdgeService(EdgeChromiumDriverManager().install())
            driver = webdriver.Edge(service=service, options=edge_options)
            return driver
        except Exception as e:
            import traceback
            self.last_edge_error = traceback.format_exc()
            return None

    def get_driver(self):
        import platform
        is_windows = platform.system() == "Windows"

        # On Windows, try Edge first to avoid slow Chrome timeouts if Chrome is not installed
        if is_windows:
            if self.preferred_browser == "chrome":
                driver = self._get_chrome_driver()
                if driver: return driver
            
            # Default to Edge first on Windows
            driver = self._get_edge_driver()
            if driver:
                self.preferred_browser = "edge"
                self.last_driver_error = None
                return driver
                
            # If Edge fails, try Chrome
            driver = self._get_chrome_driver()
            if driver:
                self.preferred_browser = "chrome"
                self.last_driver_error = None
                return driver
        else:
            # On Linux/Render, prioritize Chrome first
            if self.preferred_browser == "edge":
                driver = self._get_edge_driver()
                if driver: return driver

            driver = self._get_chrome_driver()
            if driver:
                self.preferred_browser = "chrome"
                self.last_driver_error = None
                return driver

            # Fallback to Edge
            driver = self._get_edge_driver()
            if driver:
                self.preferred_browser = "edge"
                self.last_driver_error = None
                return driver

        self.last_driver_error = f"Chrome Error:\n{getattr(self, 'last_chrome_error', 'N/A')}\n\nEdge Error:\n{getattr(self, 'last_edge_error', 'N/A')}"
        return None

    def scrape_naukri(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                q = kw.lower().replace(" ", "-")
                l = location.lower().replace(" ", "-")
                url = f"https://www.naukri.com/{q}-jobs-in-{l}"
                try:
                    driver.get(url)
                    # Wait for any of the common card selectors
                    WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".srp-jobtuple-wrapper, .jobTuple"))
                    )
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".srp-jobtuple-wrapper, .jobTuple")
                    for card in job_cards[:5]:
                        title_elem = card.select_one("a.title")
                        company_elem = card.select_one("a.comp-name")
                        loc_elem = card.select_one(".locWdth")
                        sal_elem = card.select_one(".sal-wrap")
                        desc_elem = card.select_one(".job-desc, .cust-job-desc, .job-description")
                        if title_elem:
                            link = title_elem.get("href", "")
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": sal_elem.get_text(strip=True) if sal_elem else "Not Disclosed",
                                "link": link if link.startswith("http") else f"https://www.naukri.com{link}",
                                "source": "Naukri",
                                "description": desc_elem.get_text(strip=True) if desc_elem else "View details on Naukri."
                            })
                except Exception as e:
                    print(f"Naukri individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"Naukri general Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_linkedin(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                url = f"https://www.linkedin.com/jobs/search?keywords={kw}&location={location}"
                try:
                    driver.get(url)
                    time.sleep(2)
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".base-search-card")
                    for card in job_cards[:5]:
                        title_elem = card.select_one(".base-search-card__title")
                        company_elem = card.select_one(".base-search-card__subtitle")
                        loc_elem = card.select_one(".job-search-card__location")
                        link_elem = card.select_one(".base-card__full-link")
                        desc_elem = card.select_one(".job-search-card__snippet")
                        if title_elem:
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": "Not Disclosed",
                                "link": link_elem.get("href", "") if link_elem else url,
                                "source": "LinkedIn",
                                "description": desc_elem.get_text(strip=True) if desc_elem else "View details on LinkedIn."
                            })
                except Exception as e:
                    print(f"LinkedIn individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"LinkedIn Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_internshala(self, query, location):
        import requests
        jobs = []
        keywords = self._get_keywords(query)
        for kw in keywords:
            q = kw.lower().replace(" ", "-")
            l = location.lower().replace(" ", "-")
            url = f"https://internshala.com/jobs/{q}-jobs-in-{l}"
            fallback_url = f"https://internshala.com/jobs/keywords-{kw.replace(' ', '%20')}"
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
                }
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200:
                    response = requests.get(fallback_url, headers=headers, timeout=10)
                    
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, "html.parser")
                    job_cards = soup.select(".individual_internship")
                    for card in job_cards:
                        title_elem = card.select_one(".job-title-href, .job-title-container a, .profile a")
                        company_elem = card.select_one(".company-name") or card.select_one(".company_name")
                        loc_elem = card.select_one(".locations span, .location_link")
                        sal_elem = card.select_one(".desktop, .stipend")
                        if title_elem:
                            link = title_elem.get("href", "")
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": sal_elem.get_text(strip=True) if sal_elem else "Not Disclosed",
                                "link": f"https://internshala.com{link}" if link.startswith("/") else link,
                                "source": "Internshala",
                                "description": "View details on Internshala."
                            })
            except Exception as e: print(f"Internshala Error for keyword '{kw}': {e}")
        return jobs

    def scrape_indeed(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                url = f"https://in.indeed.com/jobs?q={kw}&l={location}"
                try:
                    driver.get(url)
                    time.sleep(2)
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".job_seen_beacon")
                    for card in job_cards[:5]:
                        title_elem = card.select_one("h2.jobTitle span")
                        company_elem = card.select_one("[data-testid='company-name']")
                        loc_elem = card.select_one("[data-testid='text-location']")
                        sal_elem = card.select_one(".salary-snippet-container")
                        link_elem = card.select_one("h2.jobTitle a")
                        desc_elem = card.select_one(".job-snippet")
                        if title_elem:
                            link = link_elem.get("href", "") if link_elem else ""
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": sal_elem.get_text(strip=True) if sal_elem else "Not Disclosed",
                                "link": f"https://in.indeed.com{link}" if link.startswith("/") else link,
                                "source": "Indeed",
                                "description": desc_elem.get_text(strip=True) if desc_elem else "View details on Indeed."
                            })
                except Exception as e:
                    print(f"Indeed individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"Indeed Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_glassdoor(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                url = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={kw}&locK={location}"
                try:
                    driver.get(url)
                    time.sleep(2)
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".react-job-listing, .job-listing")
                    for card in job_cards[:5]:
                        title_elem = card.select_one(".job-title, [data-test='job-title']")
                        company_elem = card.select_one(".employer-name, [data-test='employer-name']")
                        loc_elem = card.select_one(".location, [data-test='location']")
                        sal_elem = card.select_one(".salary-estimate, [data-test='detailSalary']")
                        link_elem = card.select_one("a.job-link") or card.find("a", href=True)
                        if title_elem:
                            link = link_elem.get("href", "") if link_elem else ""
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": sal_elem.get_text(strip=True) if sal_elem else "Not Disclosed",
                                "link": link if link.startswith("http") else f"https://www.glassdoor.com{link}",
                                "source": "Glassdoor",
                                "description": "View details on Glassdoor."
                            })
                except Exception as e:
                    print(f"Glassdoor individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"Glassdoor Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_foundit(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                url = f"https://www.foundit.in/srp/results?query={kw}&locations={location}"
                try:
                    driver.get(url)
                    time.sleep(2)
                    WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".cardContainer"))
                    )
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".cardContainer")
                    for card in job_cards[:5]:
                        title_elem = card.select_one(".jobTitle, [id='jobCardTitle']")
                        company_elem = card.select_one(".companyName p, .companyName")
                        
                        details_spans = card.select(".details")
                        exp = "N/A"
                        loc = location
                        sal = "Not Disclosed"
                        if len(details_spans) > 0:
                            exp = details_spans[0].get_text(strip=True)
                        if len(details_spans) > 1:
                            loc = details_spans[1].get_text(strip=True)
                        if len(details_spans) > 2:
                            sal = details_spans[2].get_text(strip=True)
                            
                        card_id = card.get("id", "")
                        link = f"https://www.foundit.in/seeker/job-details?id={card_id}" if card_id else url
                        
                        if title_elem:
                            jobs.append({
                                "title": title_elem.get_text(strip=True),
                                "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                "location": loc,
                                "salary": sal,
                                "link": link,
                                "source": "Foundit",
                                "description": f"Experience required: {exp}. View details on Foundit."
                              })
                except Exception as e:
                    print(f"Foundit individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"Foundit general Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_shine(self, query, location):
        import requests
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                q = kw.lower().replace(" ", "-")
                l = location.lower().replace(" ", "-")
                url = f"https://www.shine.com/job-search/{q}-jobs-in-{l}"
                
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Referer": "https://www.shine.com/",
                }
                
                try:
                    response = requests.get(url, headers=headers, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, "html.parser")
                        job_cards = soup.select("[class*='jobCardNova']")
                        if not job_cards:
                            job_cards = soup.select(".jobCard_jobCard__jjUmu")
                            
                        for card in job_cards[:5]:
                            title_link = card.select_one("h3[class*='Title'] a, h3 a, a")
                            company_elem = card.select_one("span[class*='Company'], [class*='company'], .jdTruncationCompany")
                            loc_elem = card.select_one("[class*='location'], .jobCardNova_location")
                            exp_elem = card.select_one("[class*='experience'], [class*='exp'], .jobCardNova_experience")
                            sal_elem = card.select_one("[class*='salary'], .jobCardNova_salary")
                            
                            if title_link:
                                link = title_link.get("href", "")
                                if link and not link.startswith("http"):
                                    link = f"https://www.shine.com{link}"
                                    
                                jobs.append({
                                    "title": title_link.get_text(strip=True),
                                    "company": company_elem.get_text(strip=True) if company_elem else "N/A",
                                    "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                    "salary": sal_elem.get_text(strip=True) if sal_elem else "Not Disclosed",
                                    "link": link or url,
                                    "source": "Shine",
                                    "description": f"Experience: {exp_elem.get_text(strip=True) if exp_elem else 'N/A'}. View details on Shine.com."
                                })
                except Exception as e:
                    print(f"Shine individual keyword '{kw}' Error: {e}")
        except Exception as e:
            print(f"Shine general Error: {e}")
            
        return jobs

    def scrape_hirist(self, query, location):
        driver = self.get_driver()
        if not driver: return []
        jobs = []
        keywords = self._get_keywords(query)
        try:
            for kw in keywords:
                q = kw.lower().replace(" ", "-")
                url = f"https://www.hirist.tech/k/{q}-jobs"
                try:
                    driver.get(url)
                    time.sleep(2)
                    WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".joblist-card-v2"))
                    )
                    soup = BeautifulSoup(driver.page_source, "html.parser")
                    job_cards = soup.select(".joblist-card-v2")
                    for card in job_cards[:5]:
                        link_elem = card.select_one("a[href*='/j/']")
                        title_elem = card.select_one("[data-testid='job_title']")
                        exp_elem = card.select_one("[data-testid='job_experience']")
                        loc_elem = card.select_one("[data-testid='job_location']")
                        
                        if title_elem and link_elem:
                            full_title = title_elem.get_text(strip=True)
                            company = "N/A"
                            title = full_title
                            if " - " in full_title:
                                parts = full_title.split(" - ", 1)
                                company = parts[0].strip()
                                title = parts[1].strip()
                                
                            link = link_elem.get("href", "")
                            if link and not link.startswith("http"):
                                link = f"https://www.hirist.tech{link}"
                                
                            jobs.append({
                                "title": title,
                                "company": company,
                                "location": loc_elem.get_text(strip=True) if loc_elem else location,
                                "salary": "Not Disclosed",
                                "link": link or url,
                                "source": "Hirist",
                                "description": f"Experience required: {exp_elem.get_text(strip=True) if exp_elem else 'N/A'}. View details on Hirist."
                            })
                except Exception as e:
                    print(f"Hirist individual keyword '{kw}' Error: {e}")
        except Exception as e: print(f"Hirist general Error: {e}")
        finally: driver.quit()
        return jobs

    def scrape_weworkremotely(self, query, location):
        import requests
        url = "https://weworkremotely.com/categories/remote-programming-jobs.rss"
        jobs = []
        keywords = self._get_keywords(query)
        keywords_lower = [k.lower() for k in keywords]
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
            }
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                items = soup.find_all("item")
                for item in items[:40]:
                    title_elem = item.find("title")
                    link_elem = item.find("link")
                    desc_elem = item.find("description")
                    guid_elem = item.find("guid")
                    
                    title = title_elem.get_text(strip=True) if title_elem else "No Title"
                    
                    link = ""
                    if link_elem:
                        link = link_elem.get_text(strip=True)
                        if not link and link_elem.next_sibling and isinstance(link_elem.next_sibling, str):
                            link = link_elem.next_sibling.strip()
                    if not link and guid_elem:
                        link = guid_elem.get_text(strip=True)
                    
                    desc_raw = desc_elem.get_text() if desc_elem else ""
                    if desc_raw:
                        desc_soup = BeautifulSoup(desc_raw, "html.parser")
                        desc = desc_soup.get_text(separator="\n").strip()
                    else:
                        desc = ""
                    
                    company = "We Work Remotely"
                    job_title = title
                    if ":" in title:
                        parts = title.split(":", 1)
                        company = parts[0].strip()
                        job_title = parts[1].strip()
                        
                    matched = any(kw in job_title.lower() or kw in desc.lower() for kw in keywords_lower)
                    if matched:
                        jobs.append({
                            "title": job_title,
                            "company": company,
                            "location": "Remote",
                            "salary": "Not Disclosed",
                            "link": link or "https://weworkremotely.com",
                            "source": "WeWorkRemotely",
                            "description": desc[:300] + "..." if len(desc) > 300 else desc
                        })
        except Exception as e: print(f"WWR Error: {e}")
        return jobs

    def calculate_relevance(self, query, title, company, description):
        query_words = set(w.lower() for w in query.split() if len(w) > 1)
        if not query_words:
            return 100
            
        title_words = set(w.lower() for w in title.split())
        desc_words = set(w.lower() for w in description.split())
        company_words = set(w.lower() for w in company.split())
        
        score = 0
        for qw in query_words:
            # High weight on direct title match
            if qw in title_words:
                score += 40
            # Medium weight on partial title match
            elif any(qw in tw for tw in title_words):
                score += 20
                
            # Medium weight on description match
            if qw in desc_words:
                score += 10
            elif any(qw in dw for dw in desc_words):
                score += 5
                
            # Light weight on company match
            if qw in company_words:
                score += 5
                
        max_possible = len(query_words) * 55
        normalized_score = int(min(100, (score / max_possible) * 100)) if max_possible > 0 else 0
        return normalized_score

    def parse_rss_feed(self, name, url, query):
        import requests
        from bs4 import BeautifulSoup
        jobs = []
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, "html.parser")
                items = soup.find_all("item")
                for item in items:
                    title_elem = item.find("title")
                    link_elem = item.find("link")
                    desc_elem = item.find("description")
                    
                    title = title_elem.text.strip() if title_elem else "No Title"
                    link = link_elem.text.strip() if link_elem else "#"
                    desc = desc_elem.text.strip() if desc_elem else ""
                    
                    if desc:
                        try:
                            clean_desc = BeautifulSoup(desc, "html.parser").get_text()
                        except:
                            clean_desc = desc
                    else:
                        clean_desc = ""
                        
                    jobs.append({
                        "title": title,
                        "company": name,
                        "location": "Remote / Specified in Feed",
                        "salary": "Not Disclosed",
                        "description": clean_desc[:300] + "..." if len(clean_desc) > 300 else clean_desc,
                        "link": link,
                        "source": name
                    })
        except Exception as e:
            print(f"Error parsing custom feed '{name}' from {url}: {e}")
        return jobs

    def parse_xml_content(self, xml_content, name="Uploaded File"):
        jobs = []
        try:
            soup = BeautifulSoup(xml_content, "html.parser")
            items = soup.find_all("item")
            for item in items:
                title_elem = item.find("title")
                link_elem = item.find("link")
                desc_elem = item.find("description")
                
                title = title_elem.text.strip() if title_elem else "No Title"
                link = link_elem.text.strip() if link_elem else "#"
                desc = desc_elem.text.strip() if desc_elem else ""
                
                if desc:
                    try:
                        clean_desc = BeautifulSoup(desc, "html.parser").get_text()
                    except:
                        clean_desc = desc
                else:
                    clean_desc = ""
                    
                jobs.append({
                    "title": title,
                    "company": name,
                    "location": "Remote / Specified in Feed",
                    "salary": "Not Disclosed",
                    "description": clean_desc[:300] + "..." if len(clean_desc) > 300 else clean_desc,
                    "link": link,
                    "source": name
                })
        except Exception as e:
            print(f"Error parsing XML content: {e}")
        return jobs

    def process_xml_jobs(self, xml_content, query="Python", location="Kerala", filename="Uploaded File"):
        parsed_jobs = []
        keywords = self._get_keywords(query)
        try:
            soup = BeautifulSoup(xml_content, "html.parser")
            items = soup.find_all("item")
            for item in items:
                title_elem = item.find("title")
                link_elem = item.find("link")
                desc_elem = item.find("description")
                
                title = title_elem.text.strip() if title_elem else "No Title"
                link = link_elem.text.strip() if link_elem else "#"
                desc = desc_elem.text.strip() if desc_elem else ""
                
                if desc:
                    try:
                        clean_desc = BeautifulSoup(desc, "html.parser").get_text()
                    except:
                        clean_desc = desc
                else:
                    clean_desc = ""
                    
                # Look for potential location elements in item
                loc_elem = item.find("location") or item.find("job:location") or item.find("georss:point")
                job_location = loc_elem.text.strip() if loc_elem else "Remote / Specified in Feed"
                
                # Look for company name
                company_elem = item.find("company") or item.find("author") or item.find("dc:creator")
                company_name = company_elem.text.strip() if company_elem else filename
                
                # Check location match
                if not self.is_location_match(location, job_location):
                    continue
                    
                # Check relevance
                best_relevance = 0
                for kw in keywords:
                    relevance = self.calculate_relevance(kw, title, company_name, clean_desc)
                    if relevance > best_relevance:
                        best_relevance = relevance
                        
                if best_relevance >= 15:
                    parsed_jobs.append({
                        "title": title,
                        "company": company_name,
                        "location": job_location,
                        "salary": "Not Disclosed",
                        "description": clean_desc[:300] + "..." if len(clean_desc) > 300 else clean_desc,
                        "link": link,
                        "source": filename,
                        "relevance": best_relevance
                    })
        except Exception as e:
            print(f"Error processing XML jobs: {e}")
        return parsed_jobs

    def is_location_match(self, user_location, job_location):
        if not user_location:
            return True
            
        user_loc = user_location.lower().strip()
        job_loc = job_location.lower().strip()
        
        if not job_loc:
            is_user_remote = any(w in user_loc.split() for w in ["remote", "wfh", "home", "anywhere"])
            return is_user_remote
            
        import re
        def clean_text(text):
            text = re.sub(r'[/,()\-._\+]', ' ', text)
            return ' '.join(text.split())
            
        u_clean = clean_text(user_loc)
        j_clean = clean_text(job_loc)
        
        u_words = u_clean.split()
        j_words = j_clean.split()
        
        if not u_words:
            return True
            
        # Check for exact substring match first
        if u_clean in j_clean or j_clean in u_clean:
            return True
            
        # Check for remote/wfh jobs
        remote_keywords = ["remote", "wfh", "home", "anywhere"]
        is_user_remote = any(w in u_words for w in remote_keywords)
        is_job_remote = any(w in j_words for w in remote_keywords)
        
        # Synonym dictionary
        synonyms = {
            "cochin": "kochi",
            "kochi": "cochin",
            "trivandrum": "thiruvananthapuram",
            "thiruvananthapuram": "trivandrum",
            "bangalore": "bengaluru",
            "bengaluru": "bangalore",
            "bombay": "mumbai",
            "mumbai": "bombay",
            "madras": "chennai",
            "chennai": "madras",
            "calicut": "kozhikode",
            "kozhikode": "calicut",
            "gurgaon": "gurugram",
            "gurugram": "gurgaon",
        }
        
        # State-to-cities mapping
        state_cities = {
            "kerala": [
                "kerala", "kochi", "cochin", "trivandrum", "thiruvananthapuram", "calicut", "kozhikode", 
                "thrissur", "trichur", "kollam", "quilon", "kottayam", "alappuzha", "alleppey", 
                "palakkad", "palghat", "malappuram", "kannur", "cannanore", "kasaragod", "wayanad", 
                "idukki", "pathanamthitta", "ernakulam"
            ],
            "karnataka": [
                "karnataka", "bangalore", "bengaluru", "mysore", "mysuru", "mangalore", "mangaluru", 
                "hubli", "dharwad", "belgaum", "belagavi", "udupi", "manipal", "tumkur", "davanagere"
            ],
            "tamil nadu": [
                "tamil nadu", "tamilnadu", "chennai", "coimbatore", "madurai", "trichy", "tiruchirappalli", 
                "salem", "tirunelveli", "vellore", "erode", "thoothukudi", "thanjavur"
            ],
            "maharashtra": [
                "maharashtra", "mumbai", "bombay", "pune", "nagpur", "thane", "navi mumbai", "nashik", 
                "aurangabad", "solapur", "kolhapur", "amravati", "nanded"
            ],
            "delhi": [
                "delhi", "new delhi", "ncr", "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad"
            ],
            "telangana": [
                "telangana", "hyderabad", "secunderabad", "warangal", "nizamabad", "khammam"
            ],
            "andhra pradesh": [
                "andhra pradesh", "visakhapatnam", "vizag", "vijayawada", "guntur", "nellore", 
                "tirupati", "kakinada", "kurnool", "rajahmundry"
            ],
            "gujarat": [
                "gujarat", "ahmedabad", "surat", "vadodara", "baroda", "rajkot", "bhavnagar", "jamnagar", "gandhinagar"
            ],
            "west bengal": [
                "west bengal", "kolkata", "calcutta", "howrah", "darjeeling", "siliguri", "durgapur", "asansol"
            ]
        }
        
        has_user_physical = any(w not in remote_keywords for w in u_words)
        
        # Conflict check for physical user searches
        if has_user_physical:
            # Build set of allowed locations for this user search
            allowed_locations = set(u_words)
            for uw in u_words:
                if uw in synonyms:
                    allowed_locations.add(synonyms[uw])
                    
            # Expand state cities if user searched for a state name or "india"
            for state, cities in state_cities.items():
                if state in u_clean or "india" in u_clean:
                    allowed_locations.update(cities)
                    
            # Collect all known cities/states mentioned in the job location
            job_known_locations = []
            for state, cities in state_cities.items():
                if state in j_clean:
                    job_known_locations.append(state)
                for city in cities:
                    if city in j_clean:
                        job_known_locations.append(city)
                        
            # If the job specifies cities/states, they must belong to the user's allowed locations
            if job_known_locations:
                has_valid_location = any(loc in allowed_locations for loc in job_known_locations)
                user_physical_words = [w for w in u_words if w not in remote_keywords]
                has_direct_overlap = any(uw in j_words for uw in user_physical_words)
                if not has_valid_location and not has_direct_overlap:
                    return False
                    
        # If user searched for remote and job is remote, it's a match!
        if is_user_remote and is_job_remote:
            return True
            
        if is_user_remote and not is_job_remote:
            return False
            
        # If user searched for "india" and it passed the conflict check, any Indian location is a match!
        if "india" in u_clean:
            if job_known_locations or "india" in j_clean:
                return True
                
        # Check if any user word matches directly or via synonyms
        for uw in u_words:
            if uw in j_words:
                return True
            if uw in synonyms and synonyms[uw] in j_words:
                return True
                
        # Check state expansions
        for state, cities in state_cities.items():
            if state in u_clean:
                if any(city in j_clean for city in cities):
                    return True
                    
        return False


    def get_all_jobs(self, query="Python", location="Kerala", selected_platforms=None, custom_feeds=None):
        all_results = []
        debug_info = []
        print(f"Scraping results for '{query}' in '{location}'...")
        
        # Call each platform
        platforms = [
            ("Naukri", self.scrape_naukri),
            ("LinkedIn", self.scrape_linkedin),
            ("Internshala", self.scrape_internshala),
            ("Indeed", self.scrape_indeed),
            ("Glassdoor", self.scrape_glassdoor),
            ("Foundit", self.scrape_foundit),
            ("Shine", self.scrape_shine),
            ("Hirist", self.scrape_hirist),
            ("WeWorkRemotely", self.scrape_weworkremotely)
        ]
        
        # Filter platforms if selected_platforms is provided
        if selected_platforms:
            selected_lower = [p.lower() for p in selected_platforms]
            platforms = [p for p in platforms if p[0].lower() in selected_lower]
            
        total_workers = len(platforms) + (len(custom_feeds) if custom_feeds else 0)
        if total_workers == 0:
            return [{"error": "NO_SOURCES_SELECTED", "details": "Please select at least one job source platform."}]
        
        # Test driver first (only if Selenium-based platforms are selected)
        if len(platforms) > 0:
            test_driver = self.get_driver()
            if not test_driver:
                return [{"error": "CHROME_CRASH", "details": self.last_driver_error or "Driver initialized as None"}]
            test_driver.quit()
        
        # Run scraping concurrently to make it fast, but limit max_workers to 3 to prevent
        # Render's free tier from running out of memory (OOM) and crashing when launching 8 Chrome instances at once.
        with ThreadPoolExecutor(max_workers=3) as executor:
            future_to_platform = {
                executor.submit(scrape_func, query, location): name
                for name, scrape_func in platforms
            }
            
            if custom_feeds:
                for feed in custom_feeds:
                    feed_name = feed.get("name")
                    feed_url = feed.get("url")
                    if feed_name and feed_url:
                        future_to_platform[executor.submit(self.parse_rss_feed, feed_name, feed_url, query)] = feed_name
            
            for future in as_completed(future_to_platform):
                name = future_to_platform[future]
                try:
                    results = future.result()
                    if results:
                        all_results.extend(results)
                        print(f"Found {len(results)} jobs on {name}")
                    else:
                        debug_info.append(f"{name} returned 0 jobs. (Possible Anti-Bot Block)")
                        print(f"{name} returned 0 jobs.")
                except Exception as e:
                    debug_info.append(f"Error in {name} scraper: {e}")
                    print(f"Error in {name} scraper: {e}")
                    
        if not all_results:
            return [{"error": "NO_JOBS_FOUND", "details": debug_info}]
            
        # Calculate relevance and filter/sort (Make it accurate and support multiple keywords)
        processed_results = []
        seen_links = set()
        
        keywords = self._get_keywords(query)
        
        for job in all_results:
            link = job.get("link", "")
            if not link:
                link = f"{job.get('title')}-{job.get('company')}"
                
            if link in seen_links:
                continue
                
            # Filter out jobs that do not match the requested location
            if not self.is_location_match(location, job.get("location", "")):
                continue
                
            # Compute best relevance among all keywords
            best_relevance = 0
            for kw in keywords:
                relevance = self.calculate_relevance(
                    kw,
                    job.get("title", ""),
                    job.get("company", ""),
                    job.get("description", "")
                )
                if relevance > best_relevance:
                    best_relevance = relevance
                    
            # Filter out completely irrelevant results (threshold: 15%)
            if best_relevance >= 15:
                job["relevance"] = best_relevance
                seen_links.add(link)
                processed_results.append(job)
                
        if not processed_results:
            return [{"error": "NO_RELEVANT_JOBS_FOUND", "details": ["Scraped jobs were filtered out because they did not match the search keywords or location."]}]
            
        # Sort by relevance descending
        processed_results.sort(key=lambda x: x.get("relevance", 0), reverse=True)
        return processed_results

    def _parse_structured_description(self, text):
        if not text:
            return {
                "about": [],
                "responsibilities": [],
                "requirements": [],
                "benefits": []
            }
            
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        
        about = []
        responsibilities = []
        requirements = []
        benefits = []
        
        current_list = about
        
        for line in lines:
            lower_line = line.lower()
            
            # Check for header/section markers
            is_marker = False
            
            # Key Responsibilities
            if any(kw in lower_line for kw in ["responsibility", "responsibilities", "what you will do", "duties", "role overview", "expectations", "key tasks", "what you'll do", "what you do"]):
                current_list = responsibilities
                is_marker = True
            # Requirements
            elif any(kw in lower_line for kw in ["requirement", "requirements", "qualification", "qualifications", "skills", "what we look for", "what you need", "eligibility", "education", "experience", "what you'll bring", "what you bring"]):
                current_list = requirements
                is_marker = True
            # Benefits
            elif any(kw in lower_line for kw in ["benefit", "benefits", "perk", "perks", "what we offer", "compensation", "salary", "we offer", "remuneration"]):
                current_list = benefits
                is_marker = True
                
            if is_marker:
                continue
                
            # Filter boilerplate and non-essential lines
            boilerplate_keywords = [
                "equal opportunity employer", "affirmative action", "race, color, religion", "gender identity",
                "sexual orientation", "national origin", "disability status", "veteran status", "covid-19 vaccination",
                "background check", "apply online", "click here", "read more", "share this job", "apply now", 
                "auto-apply", "save job", "all jobs", "cookie policy", "privacy policy", "terms of service",
                "copyright ©", "rights reserved", "download our app", "about us", "contact us", "help center",
                "sign up", "sign in", "login", "register", "posted", "days ago", "hours ago", "we work remotely"
            ]
            if any(kw in lower_line for kw in boilerplate_keywords):
                continue
                
            # Filter out lines that are too long (e.g. long marketing blocks or compliance warnings)
            if len(line) > 280:
                continue
                
            # Filter out single symbols or short noise lines
            if len(line) < 3:
                continue
                
            # Normalize bullet points
            bullet_chars = ["•", "*", "-", "▪", "◦", "›", "»", "·", "✓", "o "]
            clean_line = line
            for bc in bullet_chars:
                if clean_line.startswith(bc):
                    clean_line = clean_line[len(bc):].strip()
                    break
                    
            if clean_line:
                # Limit size of lists to show only core needs
                if current_list is about and len(about) >= 4:
                    # Ignore general intro lines if we already have 4 points
                    continue
                elif current_list is responsibilities and len(responsibilities) >= 8:
                    continue
                elif current_list is requirements and len(requirements) >= 8:
                    continue
                elif current_list is benefits and len(benefits) >= 6:
                    continue
                    
                current_list.append(clean_line)
                
        return {
            "about": about,
            "responsibilities": responsibilities,
            "requirements": requirements,
            "benefits": benefits
        }

    def get_job_details(self, url, source):
        import requests
        import re
        
        detail_info = {
            "full_description": "Could not retrieve description.",
            "structured_description": {
                "about": [],
                "responsibilities": [],
                "requirements": [],
                "benefits": []
            },
            "emails": [],
            "phones": [],
            "hr_details": "Not Disclosed"
        }
        
        src_key = source.lower().strip()
        selectors = {
            "linkedin": [".show-more-less-html__markup", ".description__text", "#job-description", ".job-description", ".jobs-description__content"],
            "indeed": ["#jobDescriptionText", ".jobsearch-JobComponent-description", ".jobsearch-jobDescriptionText"],
            "naukri": [".job-desc", ".description", "[class*='job-desc']", ".styles_job-desc__25voo", "#job-desc"],
            "glassdoor": ["#JobDescriptionContainer", "[data-test='jobDescriptionText']", ".desc", ".jobDescriptionText"],
            "internshala": [".job_detail_container", ".text-container", ".internship_details"],
            "foundit": [".jobDesc", ".description", ".job-desc-text", "[class*='description']"],
            "shine": [".jobDetail_js-jobDesc__N2t08", ".jobDesc", ".description", "[class*='description']"],
            "hirist": [".joblist-detail-v2", ".description", "[class*='description']", ".MuiPaper-root"],
            "weworkremotely": [".lis-container__job__content__description", "#job-details", ".job-details", "#job-listing-show-container", ".listing-container", ".description"]
        }
        
        target_selectors = selectors.get(src_key, [".description", "[class*='description']"])
        
        html_content = ""
        success_with_requests = False
        
        # 1. Optimistic Fast Path: Try pure requests first!
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"}
            response = requests.get(url, headers=headers, timeout=6)
            if response.status_code == 200:
                soup_test = BeautifulSoup(response.text, "html.parser")
                # Ensure it's not a bot wall or empty SPA by checking if our target selector exists
                for sel in target_selectors:
                    if soup_test.select_one(sel):
                        html_content = response.text
                        success_with_requests = True
                        break
        except Exception as e:
            pass
            
        # 2. Fallback to Heavy Selenium if requests was blocked or it's an SPA
        if not success_with_requests:
            driver = self.get_driver()
            if driver:
                try:
                    driver.get(url)
                    time.sleep(2)
                    html_content = driver.page_source
                except Exception as e:
                    print(f"Error loading detail page via Selenium: {e}")
                finally:
                    driver.quit()
                
        if html_content:
            try:
                soup = BeautifulSoup(html_content, "html.parser")
                
                # Get raw text for email/phone extraction before stripping elements
                raw_text = soup.get_text(separator="\n")
                
                # Strip non-content elements to get clean text
                for element in soup(["script", "style", "nav", "footer", "header"]):
                    element.extract()
                
                # Try platform-specific selectors for the description container
                src_key = source.lower().strip()
                selectors = {
                    "linkedin": [
                        ".show-more-less-html__markup", 
                        ".description__text", 
                        "#job-description", 
                        ".job-description",
                        ".jobs-description__content"
                    ],
                    "indeed": [
                        "#jobDescriptionText", 
                        ".jobsearch-JobComponent-description", 
                        ".jobsearch-jobDescriptionText"
                    ],
                    "naukri": [
                        ".job-desc", 
                        ".description", 
                        "[class*='job-desc']", 
                        ".styles_job-desc__25voo",
                        "#job-desc"
                    ],
                    "glassdoor": [
                        "#JobDescriptionContainer", 
                        "[data-test='jobDescriptionText']", 
                        ".desc", 
                        ".jobDescriptionText"
                    ],
                    "internshala": [
                        ".job_detail_container", 
                        ".text-container", 
                        ".internship_details"
                    ],
                    "foundit": [
                        ".jobDesc",
                        ".description",
                        ".job-desc-text",
                        "[class*='description']"
                    ],
                    "shine": [
                        ".jobDetail_js-jobDesc__N2t08",
                        ".jobDesc",
                        ".description",
                        "[class*='description']"
                    ],
                    "hirist": [
                        ".joblist-detail-v2",
                        ".description",
                        "[class*='description']",
                        ".MuiPaper-root"
                    ],
                    "weworkremotely": [
                        ".lis-container__job__content__description",
                        "#job-details",
                        ".job-details",
                        "#job-listing-show-container",
                        ".listing-container",
                        ".description"
                    ]
                }
                
                detail_container = None
                if src_key in selectors:
                    for selector in selectors[src_key]:
                        detail_container = soup.select_one(selector)
                        if detail_container:
                            break
                            
                # Fallback to general selectors if specific source selector not found
                if not detail_container:
                    all_selectors = [
                        ".show-more-less-html__markup", ".description__text", "#job-description",
                        "#jobDescriptionText", ".jobsearch-JobComponent-description",
                        ".job-desc", ".description", "[class*='job-desc']",
                        "#JobDescriptionContainer", "[data-test='jobDescriptionText']",
                        ".job_detail_container", ".text-container"
                    ]
                    for selector in all_selectors:
                        detail_container = soup.select_one(selector)
                        if detail_container:
                            break
                            
                if detail_container:
                    text_for_desc = detail_container.get_text(separator="\n")
                else:
                    text_for_desc = soup.get_text(separator="\n")
                
                # Clean up lines and filter out obvious boilerplate/unwanted lines
                lines = []
                for line in text_for_desc.splitlines():
                    cleaned_line = line.strip()
                    if not cleaned_line:
                        continue
                    lower_line = cleaned_line.lower()
                    boilerplate_indicators = [
                        "cookie policy", "privacy policy", "terms of service", "terms & conditions",
                        "sign up", "sign in", "login", "register", "all rights reserved", "copyright ©",
                        "download our app", "about us", "contact us", "help center", "security center",
                        "cookies are used", "by continuing to use this website"
                    ]
                    if any(indicator in lower_line for indicator in boilerplate_indicators):
                        continue
                    lines.append(cleaned_line)
                    
                clean_text = "\n".join(lines[:120])
                detail_info["full_description"] = clean_text[:4000]
                detail_info["structured_description"] = self._parse_structured_description(clean_text)
                
                # Extract emails
                email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                emails = list(set(re.findall(email_pattern, raw_text)))
                
                # Obfuscated emails (e.g. hr [at] company.com, recruiter(at)company.com)
                obfuscated_pattern = r'[a-zA-Z0-9._%+-]+\s*(?:\[at\]|\(at\)|\@)\s*[a-zA-Z0-9.-]+\s*(?:\[dot\]|\(dot\)|\.)\s*[a-zA-Z]{2,}'
                found_obfuscated = re.findall(obfuscated_pattern, raw_text)
                for email_obf in found_obfuscated:
                    normalized = email_obf.replace("[at]", "@").replace("(at)", "@").replace("[dot]", ".").replace("(dot)", ".")
                    normalized = re.sub(r'\s+', '', normalized)
                    if "@" in normalized and "." in normalized:
                        emails.append(normalized)
                detail_info["emails"] = list(set(emails))
                
                # Extract phone numbers
                phone_patterns = [
                    r'\b\d{10}\b',                                    # 10 digit numbers
                    r'\+91[\s-]?\d{10}\b',                            # +91 followed by 10 digits
                    r'\b\d{5}[\s-]\d{5}\b',                           # 5 digits, space/dash, 5 digits
                    r'\b0\d{2,4}[-\s]?\d{5,8}\b',                     # landline (0-STD-number)
                    r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}' # general
                ]
                raw_phones = []
                for pattern in phone_patterns:
                    raw_phones.extend(re.findall(pattern, raw_text))
                    
                phones = []
                for p in raw_phones:
                    clean_p = re.sub(r'[-.\s\(\)]', '', p)
                    if len(clean_p) >= 10 and len(clean_p) <= 13:
                        phones.append(p.strip())
                detail_info["phones"] = list(set(phones))
                
                # Extract HR Details
                hr_matches = []
                for line in lines:
                    if any(kw in line.lower() for kw in ["hr manager", "hr recruiter", "contact person", "hiring manager", "recruiter", "recruit", "talent acquisition", "hiring team", "send resume to", "reach out to"]):
                        hr_matches.append(line)
                if hr_matches:
                    detail_info["hr_details"] = "\n".join(hr_matches[:3])
                    
            except Exception as parse_err:
                print(f"Error parsing detail page: {parse_err}")
                
        return detail_info

    def parse_resume(self, file_bytes, filename):
        import io
        from pypdf import PdfReader
        import re
        
        detail_info = {
            "skills": [],
            "achievements": [],
            "error": None
        }
        
        text = ""
        try:
            if filename.lower().endswith(".pdf"):
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    text += page.extract_text() or ""
            else:
                text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            detail_info["error"] = f"Failed to read resume file: {str(e)}"
            return detail_info
            
        if not text.strip():
            detail_info["error"] = "Resume text content is empty or unreadable."
            return detail_info
            
        # 1. Extract Skills
        COMMON_SKILLS = [
            "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "perl", "r", "sql", "html", "css", "sass", "less",
            "react", "react.js", "reactjs", "angular", "angularjs", "vue", "vue.js", "vuejs", "next.js", "nextjs", "nuxt", "nuxt.js", "svelte", "jquery", "bootstrap", "tailwind", "tailwindcss", "figma", "ui/ux",
            "node", "node.js", "nodejs", "express", "express.js", "django", "flask", "fastapi", "spring", "spring boot", "laravel", "codeigniter", "symfony", "asp.net", "net core", "rails", "ruby on rails",
            "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "sqlite", "oracle", "cassandra", "mariadb", "firebase", "dynamodb",
            "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "jenkins", "cicd", "ci/cd", "git", "github", "gitlab", "bitbucket", "terraform", "ansible", "linux", "nginx", "apache",
            "pytorch", "tensorflow", "keras", "pandas", "numpy", "scikit-learn", "sklearn", "matplotlib", "seaborn", "opencv", "nltk", "spacy", "nlp", "machine learning", "deep learning", "artificial intelligence", "ai", "llm", "langchain",
            "jest", "mocha", "cypress", "selenium", "pytest", "junit", "postman", "agile", "scrum", "rest api", "graphql", "microservices", "system design", "data structures", "algorithms", "oop", "mvc"
        ]
        
        SKILL_CASING = {
            "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript", "java": "Java", 
            "c++": "C++", "c#": "C#", "c": "C", "go": "Go", "golang": "Go", "rust": "Rust", "ruby": "Ruby", 
            "php": "PHP", "swift": "Swift", "kotlin": "Kotlin", "scala": "Scala", "perl": "Perl", "r": "R", 
            "sql": "SQL", "html": "HTML", "css": "CSS", "sass": "Sass", "less": "Less",
            "react": "React", "react.js": "React.js", "reactjs": "React.js", "angular": "Angular", 
            "angularjs": "Angular.js", "vue": "Vue", "vue.js": "Vue.js", "vuejs": "Vue.js", "next.js": "Next.js", 
            "nextjs": "Next.js", "nuxt": "Nuxt.js", "nuxt.js": "Nuxt.js", "svelte": "Svelte", "jquery": "jQuery", 
            "bootstrap": "Bootstrap", "tailwind": "Tailwind CSS", "tailwindcss": "Tailwind CSS", 
            "figma": "Figma", "ui/ux": "UI/UX", "node": "Node.js", "node.js": "Node.js", "nodejs": "Node.js", 
            "express": "Express.js", "express.js": "Express.js", "django": "Django", "flask": "Flask", 
            "fastapi": "FastAPI", "spring": "Spring Boot", "spring boot": "Spring Boot", "laravel": "Laravel", 
            "codeigniter": "CodeIgniter", "symfony": "Symfony", "asp.net": "ASP.NET", "net core": ".NET Core", 
            "rails": "Ruby on Rails", "ruby on rails": "Ruby on Rails", "mysql": "MySQL", "postgresql": "PostgreSQL", 
            "postgres": "PostgreSQL", "mongodb": "MongoDB", "mongo": "MongoDB", "redis": "Redis", 
            "sqlite": "SQLite", "oracle": "Oracle DB", "cassandra": "Cassandra", "mariadb": "MariaDB", 
            "firebase": "Firebase", "dynamodb": "DynamoDB", "aws": "AWS", "amazon web services": "AWS", 
            "azure": "Azure", "gcp": "GCP", "google cloud": "GCP", "docker": "Docker", "kubernetes": "Kubernetes", 
            "k8s": "Kubernetes", "jenkins": "Jenkins", "cicd": "CI/CD", "ci/cd": "CI/CD", "git": "Git", 
            "github": "GitHub", "gitlab": "GitLab", "bitbucket": "BitBucket", "terraform": "Terraform", 
            "ansible": "Ansible", "linux": "Linux", "nginx": "Nginx", "apache": "Apache", "pytorch": "PyTorch", 
            "tensorflow": "TensorFlow", "keras": "Keras", "pandas": "Pandas", "numpy": "NumPy", 
            "scikit-learn": "Scikit-Learn", "sklearn": "Scikit-Learn", "matplotlib": "Matplotlib", 
            "seaborn": "Seaborn", "opencv": "OpenCV", "nltk": "NLTK", "spacy": "SpaCy", "nlp": "NLP", 
            "machine learning": "Machine Learning", "deep learning": "Deep Learning", 
            "artificial intelligence": "AI", "ai": "AI", "llm": "LLMs", "langchain": "LangChain", 
            "jest": "Jest", "mocha": "Mocha", "cypress": "Cypress", "selenium": "Selenium", 
            "pytest": "PyTest", "junit": "JUnit", "postman": "Postman", "agile": "Agile", 
            "scrum": "Scrum", "rest api": "REST APIs", "graphql": "GraphQL", "microservices": "Microservices", 
            "system design": "System Design", "data structures": "Data Structures", 
            "algorithms": "Algorithms", "oop": "OOP", "mvc": "MVC"
        }
        
        text_lower = text.lower()
        extracted_skills = []
        for skill in COMMON_SKILLS:
            skill_escaped = re.escape(skill)
            pattern = ""
            if skill[0].isalnum():
                pattern += r"\b"
            pattern += skill_escaped
            if skill[-1].isalnum():
                pattern += r"\b"
                
            if re.search(pattern, text_lower):
                extracted_skills.append(skill)
                
        seen_normalized = set()
        unique_skills = []
        for skill in extracted_skills:
            normalized = SKILL_CASING.get(skill, skill)
            if normalized not in seen_normalized:
                seen_normalized.add(normalized)
                unique_skills.append(normalized)
                
        detail_info["skills"] = unique_skills
        
        # 2. Extract Achievements
        achievements = []
        achievement_keywords = [
            "award", "achieved", "won", "secured", "ranked", "scholarship", 
            "certified", "certification", "accomplished", "honored", "selected", 
            "first place", "winner", "top", "leader", "led", "developed", 
            "published", "patent", "implemented", "reduced", "improved", 
            "increased", "optimized", "built", "created", "designed", "resolved"
        ]
        
        lines = text.split("\n")
        for line in lines:
            line_strip = line.strip()
            if len(line_strip) < 15 or len(line_strip) > 200:
                continue
                
            cleaned_line = re.sub(r'^[•\-\*\d\.\s]+', '', line_strip).strip()
            if cleaned_line.endswith(":") or len(cleaned_line.split()) < 4:
                continue
                
            line_lower = cleaned_line.lower()
            is_achievement = False
            for kw in achievement_keywords:
                kw_pat = r"\b" + re.escape(kw) + r"\b" if kw.isalnum() else re.escape(kw)
                if re.search(kw_pat, line_lower):
                    has_metric = any(char.isdigit() for char in cleaned_line) or any(act in line_lower for act in ["percent", "%", "million", "team", "client", "company", "system", "performance"])
                    if has_metric or kw in ["award", "scholarship", "patent", "certified", "certification", "honored", "winner", "first place"]:
                        is_achievement = True
                        break
            
            if is_achievement:
                if cleaned_line not in achievements:
                    achievements.append(cleaned_line)
                    
        detail_info["achievements"] = achievements[:6]

        # 3. Extract Email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        detail_info["email"] = email_match.group(0) if email_match else ""

        # 4. Extract Name (guess first line in lines that is short and contains only letters/spaces)
        name = ""
        for line in lines[:8]:
            line_s = line.strip()
            if not line_s:
                continue
            if "@" in line_s or "resume" in line_s.lower() or "curriculum" in line_s.lower() or "cv" in line_s.lower():
                continue
            # Basic validation for name
            cleaned_name = re.sub(r'[^a-zA-Z\s]', '', line_s).strip()
            if len(cleaned_name) > 3 and len(cleaned_name) < 30 and len(cleaned_name.split()) >= 2 and len(cleaned_name.split()) <= 4:
                name = cleaned_name
                break
        detail_info["name"] = name

        return detail_info

if __name__ == "__main__":
    scraper = JobScraper()
    jobs = scraper.get_all_jobs("Python", "Kerala")
    print(f"\nTotal jobs found: {len(jobs)}")
    for j in jobs:
        print(f"[{j['source']}] {j['title']} - {j['company']}")
