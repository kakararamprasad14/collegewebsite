/**
 * Omni-Search Module - Universal Student Command & Search
 * Accessible modal with real-time indexing across all student hubs
 */

import { studentData } from "./data.js";
import { getIcon } from "./icons.js";

export class SearchEngine {
  constructor(router) {
    this.router = router;
    this.modalEl = document.getElementById("search-modal");
    this.inputEl = document.getElementById("search-input");
    this.resultsEl = document.getElementById("search-results");
    this.closeBtn = document.getElementById("search-close-btn");
    this.triggerBtn = document.getElementById("header-search-btn");
    this.clearInputBtn = document.getElementById("search-clear-input-btn");

    this.isOpen = false;
    this.selectedIndex = -1;
    this.currentResults = [];

    // Load recent searches from localStorage
    try {
      this.recentSearches = JSON.parse(localStorage.getItem("student_recent_searches") || '["CS401", "Exam Fee", "Timetable", "Bonafide"]');
    } catch {
      this.recentSearches = ["CS401", "Exam Fee", "Timetable", "Bonafide"];
    }

    this.bindEvents();
  }

  saveRecentSearch(query) {
    const q = query.trim();
    if (!q || q.length < 2) return;
    this.recentSearches = [q, ...this.recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    try {
      localStorage.setItem("student_recent_searches", JSON.stringify(this.recentSearches));
    } catch (e) {
      console.warn("Storage error saving recent searches", e);
    }
  }

  clearRecentSearches() {
    this.recentSearches = [];
    try {
      localStorage.removeItem("student_recent_searches");
    } catch (e) {
      console.warn(e);
    }
    this.renderDefaultSuggestions();
  }

  bindEvents() {
    // Keyboard shortcut (Ctrl+K, Cmd+K, or /)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        this.open();
      } else if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    if (this.triggerBtn) {
      this.triggerBtn.addEventListener("click", () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.clearInputBtn) {
      this.clearInputBtn.addEventListener("click", () => {
        if (this.inputEl) {
          this.inputEl.value = "";
          this.clearInputBtn.classList.remove("visible");
          this.inputEl.focus();
          this.renderDefaultSuggestions();
        }
      });
    }

    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });

      // Trap Tab key within search modal
      this.modalEl.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;
        const focusable = this.modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    if (this.inputEl) {
      this.inputEl.addEventListener("input", (e) => {
        const val = e.target.value;
        if (this.clearInputBtn) {
          if (val.length > 0) {
            this.clearInputBtn.classList.add("visible");
          } else {
            this.clearInputBtn.classList.remove("visible");
          }
        }
        this.handleSearch(val);
      });

      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.selectCurrent();
        }
      });
    }
  }

  open() {
    if (!this.modalEl) return;
    this.isOpen = true;
    this.selectedIndex = -1;
    this.modalEl.classList.add("open");
    this.modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (this.clearInputBtn) {
      this.clearInputBtn.classList.remove("visible");
    }
    if (this.inputEl) {
      this.inputEl.value = "";
      this.inputEl.focus();
    }
    this.renderDefaultSuggestions();
  }

  close() {
    if (!this.modalEl) return;
    this.isOpen = false;
    this.modalEl.classList.remove("open");
    this.modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (this.triggerBtn) {
      this.triggerBtn.focus();
    }
  }

  moveSelection(direction) {
    const items = this.resultsEl.querySelectorAll(".search-result-item");
    if (!items.length) return;

    this.selectedIndex += direction;
    if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;
    if (this.selectedIndex >= items.length) this.selectedIndex = 0;

    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add("highlighted");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("highlighted");
      }
    });
  }

  selectCurrent() {
    const items = this.resultsEl.querySelectorAll(".search-result-item");
    if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
      items[this.selectedIndex].click();
    } else if (items.length > 0) {
      items[0].click();
    }
  }

  handleSearch(query) {
    const rawQ = query.trim();
    this.selectedIndex = -1;

    if (!rawQ) {
      this.renderDefaultSuggestions();
      return;
    }

    const q = rawQ.toLowerCase();
    const tokens = q.split(/[\s,+/_-]+/).filter(t => t.length > 0);

    // Context synonyms & alias dictionary for academic queries
    const synonymMap = {
      "2nd": ["second", "2", "sem4", "sem-4", "4th-sem", "iv", "2nd-year"],
      "second": ["2nd", "2", "sem4", "sem-4", "4th-sem", "iv", "2nd-year"],
      "year": ["yr", "batch", "sem", "semester"],
      "exam": ["exams", "examination", "midterm", "mse", "assessment", "test"],
      "exams": ["exam", "examination", "midterm", "mse", "assessment", "test"],
      "timetable": ["schedule", "routine", "datesheet", "time-table", "timing", "almanac", "calendar"],
      "schedule": ["timetable", "routine", "timing", "datesheet"],
      "calendar": ["almanac", "dates", "schedule", "academic-calendar"],
      "fee": ["fees", "challan", "dues", "tuition", "payment", "receipt"],
      "fees": ["fee", "challan", "dues", "tuition", "payment", "receipt"],
      "result": ["results", "marks", "grades", "sgpa", "cgpa", "transcript", "gradecard"],
      "results": ["result", "marks", "grades", "sgpa", "cgpa", "transcript", "gradecard"],
      "hallticket": ["admit-card", "admit", "hall-ticket", "seating", "desk"],
      "admit": ["hallticket", "admit-card", "hall-ticket"],
      "library": ["book", "books", "borrow", "circulation", "catalog", "renew"],
      "event": ["events", "hackathon", "fest", "workshop", "competition"],
      "events": ["event", "hackathon", "fest", "workshop", "competition"]
    };

    const candidateItems = [];

    // Helper to evaluate item match & calculate relevance score
    const evaluateItem = (item, searchableText, bonusWeight = 0) => {
      const text = searchableText.toLowerCase();
      let score = bonusWeight;

      // Exact full query match
      if (text.includes(q)) {
        score += 120;
      }

      // Check token matches
      let matchedTokenCount = 0;
      tokens.forEach(token => {
        if (text.includes(token)) {
          matchedTokenCount++;
          score += 35;
        } else {
          // Check synonym match
          const syns = synonymMap[token] || [];
          if (syns.some(s => text.includes(s))) {
            matchedTokenCount++;
            score += 20;
          }
        }
      });

      // Bonus if all original query tokens matched
      if (tokens.length > 1 && matchedTokenCount === tokens.length) {
        score += 60;
      }

      if (score > 0) {
        candidateItems.push({
          ...item,
          _score: score
        });
      }
    };

    // A. Core Portals & Quick Nav Actions (Indexed for instant command discoverability)
    const portalNavItems = [
      {
        group: "Quick Navigation & Portals",
        type: "Exam Timetable",
        icon: "calendar",
        badgeClass: "badge--warning",
        title: "MSE-II Mid-Term Examination Timetable & Seating",
        desc: "2nd Year B.Tech Semester IV • Oct 12 - 21 • Hall Ticket & Desk Numbers",
        route: "exams",
        keywords: "2nd year exam timetable schedule mse-ii assessment hall ticket dates btech cse sem 4 mid-term second year"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Timetable",
        icon: "clock",
        badgeClass: "badge--primary",
        title: "Weekly Class Timetable (Semester IV-B)",
        desc: "Section IV-B (CSE) • Daily Lecture & Practical Schedule • Block A Room 304",
        route: "academics",
        keywords: "class timetable schedule routine weekly 2nd year cse room daily lecture second year"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Calendar",
        icon: "calendar",
        badgeClass: "badge--primary",
        title: "Semester IV Academic Calendar & Key Dates",
        desc: "Official Almanac • Term Milestones, Holidays & Examination Windows",
        route: "academics/calendar",
        keywords: "academic calendar exam dates holidays instruction closure schedule almanac 2nd year"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Service",
        icon: "file-text",
        badgeClass: "badge--danger",
        title: "Semester Examination Fee Payment Portal",
        desc: "Due in 3 days (Oct 3) • ₹2,400 Regular Exam Fee • Online Receipt",
        route: "services/fees",
        keywords: "fee fees payment challan receipt exam fee dues online dues ₹2400"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Exam Hall Ticket",
        icon: "file-text",
        badgeClass: "badge--warning",
        title: "Digital Hall Ticket & Desk Seating Allotment",
        desc: "Authenticated Admit Card for MSE-II Assessments • Hall 3 Block B",
        route: "exams/hallticket",
        keywords: "hall ticket admit card seating room desk exam timetable 2nd year"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Results",
        icon: "award",
        badgeClass: "badge--success",
        title: "Semester End Exam Results & Grade Transcripts",
        desc: "Cumulative CGPA: 8.64 • SGPA Semester III: 8.82 • Grade Cards",
        route: "results",
        keywords: "results grades marks cgpa sgpa grade card transcript exam result"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Library",
        icon: "book",
        badgeClass: "badge--neutral",
        title: "Digital Library & Book Renewal Portal",
        desc: "Active Loans • 1 Book Due Soon • Online Renewal & Catalog",
        route: "services/library",
        keywords: "library books renewal fine borrow catalog digital circulation"
      },
      {
        group: "Quick Navigation & Portals",
        type: "Campus Events",
        icon: "compass",
        badgeClass: "badge--success",
        title: "Campus Life & Upcoming Events Directory",
        desc: "CodeSpark Hackathon, AI Keynote, Cultural Pratibha Fest 2026",
        route: "campus/events",
        keywords: "events codespark hackathon pratibha tech fest sports upcoming"
      }
    ];

    portalNavItems.forEach(item => {
      evaluateItem(item, `${item.title} ${item.desc} ${item.keywords}`, 15);
    });

    // 1. Search in Notices
    studentData.notices.forEach(n => {
      const isUrgent = n.category === "urgent";
      const item = {
        group: "Official Circulars & Notices",
        type: "Notice",
        icon: isUrgent ? "alert-triangle" : "bell",
        badgeClass: isUrgent ? "badge--danger" : "badge--primary",
        title: n.headline,
        desc: `${n.refNo} • ${n.department} • ${n.date}`,
        route: `notices/${n.id}`
      };
      let extraContext = "";
      if (n.id === "not-02") extraContext = "2nd year second year semester 4 sem iv exam timetable schedule tests mse-ii";
      if (n.id === "not-01") extraContext = "2nd year second year lab practical exam postponement rain advisory";
      if (n.id === "not-06") extraContext = "2nd year second year semester iv exam fee payment receipt dues";
      evaluateItem(item, `${n.headline} ${n.snippet} ${n.refNo} ${n.department} ${n.category} ${extraContext}`, 10);
    });

    // 2. Search in Exams & Assessments
    studentData.examSchedule.forEach(ex => {
      const item = {
        group: "Examinations & Timetable",
        type: "Exam",
        icon: "calendar",
        badgeClass: "badge--warning",
        title: `${ex.code} - ${ex.subject}`,
        desc: `${ex.date} • ${ex.time} • Room: ${ex.room} (${ex.seatNo})`,
        route: "exams"
      };
      evaluateItem(item, `${ex.code} ${ex.subject} ${ex.room} ${ex.seatNo} ${ex.date} exam timetable schedule 2nd year semester iv`, 10);
    });

    // 3. Search in Classes & Timetable
    const allPeriods = [
      ...studentData.weeklyTimetable.Wednesday,
      ...studentData.weeklyTimetable.Thursday,
      ...studentData.weeklyTimetable.Monday
    ];
    const seenCodes = new Set();
    allPeriods.forEach(p => {
      if (!seenCodes.has(p.code)) {
        seenCodes.add(p.code);
        const item = {
          group: "Courses & Weekly Classes",
          type: "Course",
          icon: "book-open",
          badgeClass: "badge--primary",
          title: `${p.code}: ${p.name}`,
          desc: `${p.faculty} • ${p.room} (${p.building}) • 2nd Year CSE`,
          route: "academics"
        };
        evaluateItem(item, `${p.code} ${p.name} ${p.faculty} ${p.room} ${p.building} class timetable schedule 2nd year`, 5);
      }
    });

    // 4. Search in Academic Departments
    studentData.departments.forEach(d => {
      const item = {
        group: "Academic Departments",
        type: "Department",
        icon: "layers",
        badgeClass: "badge--primary",
        title: `${d.code} - Department of ${d.name}`,
        desc: `HOD: ${d.hod} • ${d.building}`,
        route: "academics/departments"
      };
      evaluateItem(item, `${d.name} ${d.code} ${d.hod} ${d.building} department engineering`);
    });

    // 5. Search in Campus Events & Clubs
    studentData.campusDirectory.upcomingEvents.forEach(e => {
      const item = {
        group: "Campus Life & Events",
        type: "Event",
        icon: "compass",
        badgeClass: "badge--success",
        title: e.title,
        desc: `${e.date} • ${e.venue} • ${e.organizedBy}`,
        route: "campus/events"
      };
      evaluateItem(item, `${e.title} ${e.venue} ${e.tag} ${e.organizedBy} ${e.description} event activity`);
    });

    // 6. Search in Student Services & Fees
    studentData.services.forEach(srv => {
      const item = {
        group: "Student Services",
        type: "Service",
        icon: "file-text",
        badgeClass: "badge--neutral",
        title: srv.title,
        desc: `${srv.category} • Turnaround: ${srv.turnaround}`,
        route: "services"
      };
      evaluateItem(item, `${srv.title} ${srv.description} ${srv.category} service fee document certificate`);
    });

    // 7. Search in Facilities
    studentData.campusDirectory.facilities.forEach(fac => {
      const item = {
        group: "Campus Facilities",
        type: "Facility",
        icon: "map-pin",
        badgeClass: "badge--neutral",
        title: fac.name,
        desc: `${fac.location} • Hours: ${fac.hours}`,
        route: "campus/facilities"
      };
      evaluateItem(item, `${fac.name} ${fac.location} ${fac.hours} facility campus`);
    });

    // Sort candidate items by score descending
    candidateItems.sort((a, b) => b._score - a._score);

    // Deduplicate by route/title
    const seenMap = new Set();
    const finalResults = [];
    for (const item of candidateItems) {
      const key = `${item.route}-${item.title}`;
      if (!seenMap.has(key)) {
        seenMap.add(key);
        finalResults.push(item);
      }
    }

    this.currentResults = finalResults;
    this.renderResults(finalResults, rawQ);
  }

  renderDefaultSuggestions() {
    if (!this.resultsEl) return;

    let recentSearchesHtml = "";
    if (this.recentSearches && this.recentSearches.length > 0) {
      recentSearchesHtml = `
        <div style="margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
            <span style="font-size: var(--text-label); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase;">
              Recent Searches
            </span>
            <button id="clear-search-history-btn" class="btn btn--ghost btn--sm" style="font-size: 11px; padding: 2px 6px;">
              Clear History
            </button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-1);">
            ${this.recentSearches.map(s => `
              <button class="btn btn--outline btn--sm recent-chip-btn" data-query="${s}">
                ${getIcon("clock", { size: 12 })} ${s}
              </button>
            `).join("")}
          </div>
        </div>
      `;
    }

    this.resultsEl.innerHTML = `
      ${recentSearchesHtml}
      <div class="search-result-group-title" style="font-size: var(--text-label); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase; margin-bottom: var(--space-2);">
        Suggested Academic Tasks
      </div>
      <div class="search-result-item" data-route="notices/not-01" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div style="color: var(--color-danger);">${getIcon("alert-triangle", { size: 18 })}</div>
          <div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small);">Rain & Laboratory Rescheduling Notice</div>
            <div style="font-size: var(--text-label); color: var(--color-text-muted);">COE/2026/089 • Academic Administration</div>
          </div>
        </div>
        <span class="badge badge--danger">Urgent</span>
      </div>
      <div class="search-result-item" data-route="exams" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div style="color: var(--color-primary);">${getIcon("calendar", { size: 18 })}</div>
          <div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small);">Mid-Term Assessment (MSE-II) Timetable</div>
            <div style="font-size: var(--text-label); color: var(--color-text-muted);">Starts Oct 12 • Download Digital Hall Ticket</div>
          </div>
        </div>
        <span class="badge badge--warning">Exams</span>
      </div>
      <div class="search-result-item" data-route="services/fees" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div style="color: var(--color-text-secondary);">${getIcon("file-text", { size: 18 })}</div>
          <div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small);">Semester Fee Payment & Online Receipts</div>
            <div style="font-size: var(--text-label); color: var(--color-text-muted);">Due in 3 days • Pay ₹2,400 exam fee</div>
          </div>
        </div>
        <span class="badge badge--neutral">Service</span>
      </div>
      <div class="search-result-item" data-route="academics" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer;">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div style="color: var(--color-primary);">${getIcon("book-open", { size: 18 })}</div>
          <div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small);">Class Timetable & Room Directory</div>
            <div style="font-size: var(--text-label); color: var(--color-text-muted);">Section IV-B • Room 304 Block A</div>
          </div>
        </div>
        <span class="badge badge--primary">Academics</span>
      </div>
    `;

    // Chip click triggers
    this.resultsEl.querySelectorAll(".recent-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-query");
        if (this.inputEl) {
          this.inputEl.value = q;
          this.handleSearch(q);
        }
      });
    });

    const clearHistoryBtn = this.resultsEl.querySelector("#clear-search-history-btn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => this.clearRecentSearches());
    }

    this.attachResultListeners();
  }

  renderResults(results, query) {
    if (!this.resultsEl) return;

    if (results.length === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: var(--space-8); text-align: center; color: var(--color-text-muted);">
          <div style="display: inline-flex; color: var(--color-text-muted); margin-bottom: var(--space-2);">
            ${getIcon("search", { size: 36 })}
          </div>
          <p style="font-weight: var(--font-weight-semibold); margin-bottom: 4px; color: var(--color-text-primary);">
            No results found for "${query}"
          </p>
          <p style="font-size: var(--text-small); margin-bottom: var(--space-4);">
            Try searching for "CS401", "Algorithms", "Timetable", "Exam Fee", or "Library".
          </p>
          <button class="btn btn--outline btn--sm" id="btn-reset-search-query">
            Clear Search
          </button>
        </div>
      `;

      const resetBtn = this.resultsEl.querySelector("#btn-reset-search-query");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (this.inputEl) {
            this.inputEl.value = "";
            this.inputEl.focus();
            this.renderDefaultSuggestions();
          }
        });
      }
      return;
    }

    // Group results by group field
    const grouped = {};
    results.forEach(item => {
      const g = item.group || "Other Results";
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(item);
    });

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
        <span style="font-size: var(--text-label); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); text-transform: uppercase;">
          Found ${results.length} result(s)
        </span>
        <span style="font-size: var(--text-meta); color: var(--color-text-muted);">Press ↑↓ to navigate, Enter to select</span>
      </div>
    `;

    Object.entries(grouped).forEach(([groupName, groupItems]) => {
      html += `
        <div class="search-result-group-title" style="font-size: var(--text-meta); font-weight: var(--font-weight-bold); color: var(--color-primary); text-transform: uppercase; margin: var(--space-3) 0 var(--space-1) 0; letter-spacing: 0.05em;">
          ${groupName} (${groupItems.length})
        </div>
      `;

      groupItems.forEach(item => {
        html += `
          <div class="search-result-item" data-route="${item.route}" data-query="${query}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border-radius: var(--radius-md); cursor: pointer; transition: background var(--motion-fast);">
            <div style="display: flex; align-items: center; gap: var(--space-3); min-width: 0;">
              <div style="color: var(--color-primary); flex-shrink: 0;">${getIcon(item.icon, { size: 18 })}</div>
              <div style="min-width: 0;">
                <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${this.highlightMatch(item.title, query)}
                </div>
                <div style="font-size: var(--text-label); color: var(--color-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${this.highlightMatch(item.desc, query)}
                </div>
              </div>
            </div>
            <span class="badge ${item.badgeClass}" style="flex-shrink: 0; margin-left: var(--space-2);">${item.type}</span>
          </div>
        `;
      });
    });

    this.resultsEl.innerHTML = html;
    this.attachResultListeners();
  }

  highlightMatch(text, query) {
    if (!text || !query) return text || "";
    const tokens = query.trim().split(/[\s,+/_-]+/).filter(t => t.length > 1);
    if (!tokens.length) return text;
    // Highlight longer tokens first to avoid nested replacement issues
    tokens.sort((a, b) => b.length - a.length);
    const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, `<mark style="background: var(--color-primary-subtle); color: var(--color-primary); font-weight: var(--font-weight-bold); border-radius: 2px; padding: 0 1px;">$1</mark>`);
  }

  attachResultListeners() {
    this.resultsEl.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        const route = item.getAttribute("data-route");
        const query = item.getAttribute("data-query") || (this.inputEl ? this.inputEl.value : "");
        if (query) this.saveRecentSearch(query);
        if (route) {
          this.close();
          this.router.navigate(route);
        }
      });
    });
  }
}
