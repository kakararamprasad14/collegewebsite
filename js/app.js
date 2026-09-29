/**
 * Main Application Engine - Student-First College Digital Hub
 * High-craft interaction design, smart content prioritization, and personalized student workflows
 */

import { studentData, savePersistedPreferences } from "./data.js";
import { Router } from "./router.js";
import { SearchEngine } from "./search.js";
import { getIcon } from "./icons.js";
import { 
  renderPageHeader, 
  renderBadge, 
  renderStatusIndicator, 
  renderEmptyState, 
  toast, 
  modal 
} from "./components.js";

class StudentHubApp {
  constructor() {
    this.container = document.getElementById("view-container");
    this.primaryRoutes = ["home", "notices", "academics", "exams", "campus", "services", "search", "profile"];
    
    // Notice filtering state
    this.activeNoticeCategory = "all";
    this.activeNoticeStatus = "all";
    this.activeNoticeDept = "all";
    this.noticeSortOrder = "newest";
    this.noticeSearchQuery = "";
    
    // Bookmarks and Read status persistence
    try {
      this.bookmarks = JSON.parse(localStorage.getItem("student_bookmarks") || '["not-01"]');
      this.readNoticeIds = JSON.parse(localStorage.getItem("student_read_notices") || '["not-03", "not-04", "not-05", "not-06"]');
    } catch {
      this.bookmarks = ["not-01"];
      this.readNoticeIds = ["not-03", "not-04", "not-05", "not-06"];
    }

    // Initialize Router
    this.router = new Router(this.primaryRoutes, studentData.profile.preferences.defaultLanding || "home");
    this.router.subscribe((route, param) => this.renderView(route, param));

    // Initialize Search Engine
    this.searchEngine = new SearchEngine(this.router);

    this.bindGlobalEvents();
    this.updateHeaderUnreadBadge();
  }

  saveBookmarks() {
    try {
      localStorage.setItem("student_bookmarks", JSON.stringify(this.bookmarks));
    } catch (e) {
      console.warn(e);
    }
  }

  isBookmarked(id) {
    return this.bookmarks.includes(id);
  }

  toggleBookmark(id) {
    if (this.isBookmarked(id)) {
      this.bookmarks = this.bookmarks.filter(bId => bId !== id);
      toast.show({
        type: "info",
        title: "Bookmark Removed",
        message: "Notice removed from your saved items."
      });
    } else {
      this.bookmarks.push(id);
      toast.show({
        type: "success",
        title: "Notice Bookmarked",
        message: "Notice saved to your profile for quick offline access."
      });
    }
    this.saveBookmarks();
  }

  isNoticeRead(id) {
    return this.readNoticeIds.includes(id);
  }

  markNoticeAsRead(id) {
    if (!this.readNoticeIds.includes(id)) {
      this.readNoticeIds.push(id);
      try {
        localStorage.setItem("student_read_notices", JSON.stringify(this.readNoticeIds));
      } catch (e) {
        console.warn(e);
      }
      this.updateHeaderUnreadBadge();
    }
  }

  markAllNoticesAsRead() {
    this.readNoticeIds = studentData.notices.map(n => n.id);
    try {
      localStorage.setItem("student_read_notices", JSON.stringify(this.readNoticeIds));
    } catch (e) {
      console.warn(e);
    }
    this.updateHeaderUnreadBadge();
    toast.show({
      type: "success",
      title: "All Notices Marked as Read",
      message: "Unread indicators have been cleared."
    });
    if (this.router.currentRoute === "notices") {
      this.renderNotices();
    }
  }

  updateHeaderUnreadBadge() {
    const unreadCount = studentData.notices.filter(n => !this.readNoticeIds.includes(n.id)).length;
    const badge = document.querySelector(".unread-badge");
    if (badge) {
      badge.style.display = unreadCount > 0 ? "block" : "none";
    }
  }

  bindGlobalEvents() {
    // Desktop Nav clicks
    document.querySelectorAll(".nav-item-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        if (route) this.router.navigate(route);
      });
    });

    // Mobile More Drawer Sheet handling
    const moreSheet = document.getElementById("mobile-more-sheet");
    const closeMoreBtn = document.getElementById("close-more-sheet");

    const openMoreSheet = () => {
      if (moreSheet) {
        moreSheet.classList.add("open");
        moreSheet.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    };

    const closeMoreSheet = () => {
      if (moreSheet) {
        moreSheet.classList.remove("open");
        moreSheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    };

    if (closeMoreBtn) {
      closeMoreBtn.addEventListener("click", closeMoreSheet);
    }
    if (moreSheet) {
      moreSheet.addEventListener("click", (e) => {
        if (e.target === moreSheet) closeMoreSheet();
      });
    }

    // Mobile Bottom Nav clicks
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const route = btn.getAttribute("data-route");
        if (route === "more") {
          openMoreSheet();
        } else if (route === "search") {
          this.searchEngine.open();
        } else if (route) {
          this.router.navigate(route);
        }
      });
    });

    // Mobile more sheet internal links
    document.querySelectorAll(".more-sheet-link").forEach(link => {
      link.addEventListener("click", () => {
        closeMoreSheet();
        if (link.id === "mobile-sheet-search-trigger") {
          this.searchEngine.open();
        }
      });
    });

    // Brand logo click
    const brandLink = document.querySelector(".brand-section");
    if (brandLink) {
      brandLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.router.navigate("home");
      });
    }

    // Avatar pill click & keyboard navigation
    const avatarPill = document.querySelector(".student-avatar-pill");
    if (avatarPill) {
      avatarPill.addEventListener("click", () => {
        this.router.navigate("profile");
      });
      avatarPill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.router.navigate("profile");
        }
      });
    }
  }

  renderView(route, param) {
    if (!this.container) return;

    switch (route) {
      case "home":
        this.renderHome();
        break;
      case "notices":
        if (param) {
          this.renderNoticeDetail(param);
        } else {
          this.renderNotices();
        }
        break;
      case "academics":
        this.renderAcademics(param);
        break;
      case "exams":
        this.renderExams(param);
        break;
      case "campus":
        this.renderCampus(param);
        break;
      case "services":
        this.renderServices(param);
        break;
      case "search":
        this.searchEngine.open();
        this.renderHome();
        break;
      case "profile":
        this.renderProfile();
        break;
      default:
        this.renderHome();
    }
  }

  // ==========================================================================
  // VIEW: 1. HOME / DASHBOARD (Smart Prioritization & Personalization)
  // ==========================================================================
  renderHome() {
    const alert = studentData.urgentAlert;
    const schedule = studentData.todaySchedule;
    const activeClass = schedule.activeClass;
    const p = studentData.profile;
    const unreadCount = studentData.notices.filter(n => !this.readNoticeIds.includes(n.id)).length;

    this.container.innerHTML = `
      <!-- Pinned Urgent Broadcast Alert Banner -->
      <section class="card notice-card--urgent" style="margin-bottom: var(--space-5); padding: var(--space-4);" role="alert" aria-live="assertive">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3);">
          <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
            <div style="color: var(--color-danger); margin-top: 2px;">
              ${getIcon("alert-triangle", { size: 22 })}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 2px; flex-wrap: wrap;">
                ${renderBadge({ label: alert.tag, variant: "danger" })}
                <a href="#notices/${alert.noticeId}" style="font-weight: var(--font-weight-bold); font-size: var(--text-body); color: var(--color-danger); text-decoration: underline;">
                  ${alert.title}
                </a>
              </div>
              <p style="font-size: var(--text-small); color: var(--color-text-secondary); line-height: var(--leading-normal);">
                ${alert.description}
              </p>
              <div style="font-size: var(--text-meta); color: var(--color-danger); margin-top: 4px; font-weight: var(--font-weight-semibold);">
                ${alert.timestamp} • Verified by ${alert.authority}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: var(--space-2); flex-shrink: 0;">
            <a href="#notices/${alert.noticeId}" class="btn btn--outline btn--sm" aria-label="Read full notice">
              Read Notice
            </a>
            <button class="btn btn--ghost btn--sm" id="dismiss-urgent-alert" aria-label="Acknowledge notice">
              ${getIcon("x", { size: 16 })}
            </button>
          </div>
        </div>
      </section>

      <!-- Today at a Glance Card (Personalized Academic Context) -->
      <section class="card" style="background: linear-gradient(135deg, #0f2042 0%, #162a56 100%); color: var(--color-text-inverse); border-color: transparent; margin-bottom: var(--space-5);" aria-label="Today at a Glance">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
          <div>
            <div style="font-size: var(--text-small); color: #93c5fd; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-wider);">
              ${schedule.day}, ${schedule.date}
            </div>
            <h1 style="color: white; font-size: var(--text-h1); margin-top: 2px;">
              Good Morning, Rohan
            </h1>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="badge" style="background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.2);">
              ${p.program} • ${p.semester}
            </span>
            <span style="font-size: var(--text-meta); color: #93c5fd;">CGPA: ${p.cgpa} • Attendance: 88.4%</span>
          </div>
        </div>

        <!-- Current Class Box -->
        <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.16); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
            <span class="badge" style="background: #38bdf8; color: #082f49; font-weight: var(--font-weight-bold);">
              ${activeClass.status}
            </span>
            <span style="font-size: var(--text-label); color: #bae6fd;">
              Theory Session in Progress
            </span>
          </div>
          <div style="font-size: var(--text-h3); font-weight: var(--font-weight-bold); color: white;">
            ${activeClass.code}: ${activeClass.name}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-2); font-size: var(--text-small); color: #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 4px;">
              ${getIcon("clock", { size: 16 })}
              <span>${activeClass.time}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              ${getIcon("map-pin", { size: 16 })}
              <span>${activeClass.room}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              ${getIcon("user", { size: 16 })}
              <span>${activeClass.faculty}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); color: #cbd5e1; flex-wrap: wrap; gap: var(--space-2);">
          <div>
            Next Class: <strong style="color: white;">${schedule.upcomingClasses[0].code} ${schedule.upcomingClasses[0].name}</strong> (${schedule.upcomingClasses[0].time.split(" - ")[0]})
          </div>
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            <button id="btn-active-course-materials" class="btn btn--outline btn--sm" style="color: white; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1);">
              ${getIcon("book-open", { size: 14 })} Course Materials
            </button>
            <a href="#academics" style="color: #93c5fd; font-weight: var(--font-weight-semibold); text-decoration: underline;">
              Full Timetable &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- Today's Priorities Widget (Smart Focus) -->
      <section class="card" style="margin-bottom: var(--space-5); border-left: 4px solid var(--color-primary); padding: var(--space-4);" aria-label="Today's Priorities">
        <div class="card-header" style="margin-bottom: var(--space-3);">
          <h2 class="card-title" style="font-size: var(--text-h3);">
            ${getIcon("check", { size: 18 })}
            Today's Priorities for Rohan
          </h2>
          <span class="badge badge--primary">3 Key Actions</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--space-2);">
          ${studentData.priorities.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); background: var(--color-surface-subtle); border-radius: var(--radius-md); gap: var(--space-2);">
              <div style="display: flex; align-items: center; gap: var(--space-2); min-width: 0;">
                <span class="badge ${item.urgency === 'urgent' ? 'badge--danger' : item.urgency === 'important' ? 'badge--warning' : 'badge--primary'}" style="flex-shrink: 0; font-size: 11px;">
                  ${item.type}
                </span>
                <span style="font-size: var(--text-small); font-weight: var(--font-weight-medium); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${item.title}
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;">
                <span class="show-desktop" style="font-size: var(--text-meta); color: var(--color-text-muted);">
                  ${item.due}
                </span>
                <a href="#${item.route}" class="btn btn--outline btn--sm" style="font-size: 11px; padding: 2px 8px;">
                  ${item.actionText} &rarr;
                </a>
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- 8 Key Quick Action Tiles -->
      <section aria-label="Student Quick Actions">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
          <h2 style="font-size: var(--text-h3);">Quick Student Actions</h2>
          <span style="font-size: var(--text-label); color: var(--color-text-muted);">High-Frequency Tasks</span>
        </div>
        <div class="quick-action-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); margin-bottom: var(--space-6);">
          <a href="#notices" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("bell", { size: 20 })}</div>
            <div class="quick-action-label">Notices</div>
            <div class="quick-action-desc">${unreadCount} Unread</div>
          </a>
          <a href="#exams" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("calendar", { size: 20 })}</div>
            <div class="quick-action-label">Exam Timetable</div>
            <div class="quick-action-desc">MSE-II schedule</div>
          </a>
          <a href="#academics" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("book-open", { size: 20 })}</div>
            <div class="quick-action-label">Class Timetable</div>
            <div class="quick-action-desc">Today's lectures</div>
          </a>
          <a href="#exams/results" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("award", { size: 20 })}</div>
            <div class="quick-action-label">Results</div>
            <div class="quick-action-desc">SGPA 8.72</div>
          </a>
          <a href="#academics/calendar" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("clock", { size: 20 })}</div>
            <div class="quick-action-label">Academic Calendar</div>
            <div class="quick-action-desc">Holidays & terms</div>
          </a>
          <a href="#services/fees" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("file-text", { size: 20 })}</div>
            <div class="quick-action-label">Fees</div>
            <div class="quick-action-desc">Pay exam fee</div>
          </a>
          <a href="#services/library" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("book-open", { size: 20 })}</div>
            <div class="quick-action-label">Library</div>
            <div class="quick-action-desc">2 active loans</div>
          </a>
          <a href="#services" class="quick-action-tile">
            <div class="quick-action-icon-circle">${getIcon("layers", { size: 20 })}</div>
            <div class="quick-action-label">Student Services</div>
            <div class="quick-action-desc">Certificates & help</div>
          </a>
        </div>
      </section>

      <!-- Two-Column Primary Layout -->
      <div class="layout-grid-dashboard">
        <!-- Left: Tabbed Hub Overview -->
        <div>
          <div class="card" style="margin-bottom: var(--space-6);">
            <div class="tab-list" role="tablist" aria-label="Dashboard Feed Switcher">
              <button class="tab-item active" role="tab" id="home-tab-notices" aria-selected="true" data-tab="tab-notices">
                Latest Circulars (${studentData.notices.length})
              </button>
              <button class="tab-item" role="tab" id="home-tab-deadlines" aria-selected="false" data-tab="tab-deadlines">
                Upcoming Deadlines (${studentData.deadlines.length})
              </button>
              <button class="tab-item" role="tab" id="home-tab-events" aria-selected="false" data-tab="tab-events">
                Upcoming Events (${studentData.campusDirectory.upcomingEvents.length})
              </button>
            </div>

            <!-- Tab Panel 1: Notices -->
            <div id="panel-tab-notices" role="tabpanel" aria-labelledby="home-tab-notices">
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                ${studentData.notices.slice(0, 3).map(n => {
                  const unread = !this.isNoticeRead(n.id);
                  return `
                    <article class="notice-card" tabindex="0" data-notice-id="${n.id}">
                      <div class="notice-card-header">
                        <div style="display: flex; gap: var(--space-1); align-items: center;">
                          ${unread ? '<span class="status-dot" style="background: var(--color-primary); width: 8px; height: 8px; border-radius: 50%; display: inline-block;" title="Unread Notice"></span>' : ''}
                          ${renderBadge({ label: n.status, variant: n.status === 'IMPORTANT' ? 'danger' : n.status === 'NEW' ? 'primary' : 'neutral' })}
                          ${renderBadge({ label: n.categoryLabel, variant: n.category === 'urgent' ? 'danger' : 'primary' })}
                        </div>
                        <span style="font-size: var(--text-meta); color: var(--color-text-muted);">${n.date} • ${n.refNo}</span>
                      </div>
                      <h3 class="notice-card-title">${n.headline}</h3>
                      <p class="notice-card-snippet">${n.snippet}</p>
                      <div class="notice-card-footer">
                        <span style="color: var(--color-primary); font-weight: var(--font-weight-semibold); display: flex; align-items: center; gap: 4px;">
                          ${getIcon("download", { size: 14 })} ${n.attachment}
                        </span>
                        <div style="display: flex; align-items: center; gap: var(--space-2);">
                          <button class="btn-icon bookmark-trigger-btn" data-notice-id="${n.id}" aria-label="Bookmark notice">
                            ${getIcon(this.isBookmarked(n.id) ? "check" : "bookmark", { size: 16 })}
                          </button>
                          <a href="#notices/${n.id}" class="btn btn--outline btn--sm">View Notice &rarr;</a>
                        </div>
                      </div>
                    </article>
                  `;
                }).join("")}
              </div>
              <div style="margin-top: var(--space-4); text-align: center;">
                <a href="#notices" class="btn btn--outline btn--sm">
                  View Complete Circular Archive &rarr;
                </a>
              </div>
            </div>

            <!-- Tab Panel 2: Deadlines -->
            <div id="panel-tab-deadlines" role="tabpanel" aria-labelledby="home-tab-deadlines" style="display: none;">
              <div style="display: flex; flex-direction: column;">
                ${studentData.deadlines.map(dl => `
                  <div class="deadline-card">
                    <div class="deadline-info">
                      <span class="deadline-title">${dl.title}</span>
                      <span class="deadline-course">${dl.course}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--space-2);">
                      <span class="deadline-pill deadline-pill--${dl.status}">
                        ${dl.due}
                      </span>
                      <a href="#${dl.serviceRoute}" class="btn btn--outline btn--sm">
                        ${dl.actionText}
                      </a>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Tab Panel 3: Events -->
            <div id="panel-tab-events" role="tabpanel" aria-labelledby="home-tab-events" style="display: none;">
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                ${studentData.campusDirectory.upcomingEvents.map(e => `
                  <div class="event-card">
                    <div class="event-date-badge">
                      <span class="event-date-month">${e.date.split(" ")[0]}</span>
                      <span class="event-date-day">${e.date.split(" ")[1].replace(/,/g, "")}</span>
                    </div>
                    <div class="event-details">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                        <span class="badge badge--primary">${e.tag}</span>
                        <span class="badge ${e.rsvpStatus === 'Registered' ? 'badge--success' : 'badge--neutral'}">
                          ${e.rsvpStatus}
                        </span>
                      </div>
                      <h4 class="event-title">${e.title}</h4>
                      <div class="event-meta">📍 ${e.venue} • ${e.organizedBy}</div>
                      <div style="margin-top: var(--space-2);">
                        <button class="btn btn--sm rsvp-btn ${e.rsvpStatus === 'Registered' ? 'btn--outline' : 'btn--primary'}" data-event-id="${e.id}">
                          ${e.rsvpStatus === 'Registered' ? 'Cancel RSVP' : 'Register / RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Academic Highlights & Student Support -->
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          <!-- Academic Highlights Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                ${getIcon("award", { size: 18 })}
                Academic Snapshot
              </h2>
              ${renderStatusIndicator({ label: "Good Standing", status: "active", pulse: true })}
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-4);">
              <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md);">
                <div style="font-size: var(--text-label); color: var(--color-text-muted);">Current SGPA</div>
                <div style="font-size: var(--text-h2); font-weight: var(--font-weight-bold); color: var(--color-primary);">8.72</div>
              </div>
              <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md);">
                <div style="font-size: var(--text-label); color: var(--color-text-muted);">Cumulative CGPA</div>
                <div style="font-size: var(--text-h2); font-weight: var(--font-weight-bold); color: var(--color-text-primary);">8.64</div>
              </div>
            </div>
            <div style="font-size: var(--text-small); color: var(--color-text-secondary); line-height: var(--leading-snug); margin-bottom: var(--space-3);">
              Registered for 6 courses (22 Credits). Overall attendance stands at <strong>88.4%</strong> with zero active backlogs.
            </div>
            <a href="#exams/results" class="btn btn--outline btn--sm" style="width: 100%;">
              View Full Grade Statement &rarr;
            </a>
          </div>

          <!-- Pending Fees Urgent Box -->
          <div class="card" style="border-left: 4px solid var(--color-warning);">
            <div class="card-header">
              <h2 class="card-title" style="font-size: var(--text-body);">
                ${getIcon("alert-triangle", { size: 18 })}
                Semester Exam Fee Due
              </h2>
              <span class="badge badge--warning">₹ 2,400</span>
            </div>
            <p style="font-size: var(--text-small); margin-bottom: var(--space-3);">
              Semester IV regular exam fee payment portal closes in <strong>3 days</strong> (Oct 3, 5:00 PM).
            </p>
            <button class="btn btn--primary btn--sm" id="btn-home-pay-fee" style="width: 100%;">
              Pay Examination Fee Online
            </button>
          </div>

          <!-- Campus Hours Quick Status -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                ${getIcon("clock", { size: 18 })}
                Campus Facility Hours
              </h2>
              <a href="#campus/facilities" style="font-size: var(--text-small); font-weight: var(--font-weight-semibold);">
                Directory &rarr;
              </a>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              ${studentData.campusDirectory.facilities.slice(0, 3).map(f => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border);">
                  <div>
                    <div style="font-weight: var(--font-weight-medium);">${f.name}</div>
                    <div style="font-size: var(--text-meta); color: var(--color-text-muted);">${f.hours}</div>
                  </div>
                  ${renderBadge({ label: f.status, variant: f.status.includes('Open') ? 'success' : 'neutral' })}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachHomeEvents();
  }

  attachHomeEvents() {
    // Dismiss urgent alert
    const dismissAlertBtn = this.container.querySelector("#dismiss-urgent-alert");
    if (dismissAlertBtn) {
      dismissAlertBtn.addEventListener("click", () => {
        const banner = dismissAlertBtn.closest("section");
        if (banner) {
          banner.style.display = "none";
          toast.show({
            type: "info",
            title: "Alert Acknowledged",
            message: "You can review this circular in the Notices archive at any time."
          });
        }
      });
    }

    // Tab switcher with smooth feedback
    const tabs = this.container.querySelectorAll(".tab-item");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        const targetPanelId = `panel-${tab.getAttribute("data-tab")}`;
        ["panel-tab-notices", "panel-tab-deadlines", "panel-tab-events"].forEach(id => {
          const panel = document.getElementById(id);
          if (panel) {
            panel.style.display = id === targetPanelId ? "block" : "none";
          }
        });
      });
    });

    // Bookmarking handlers
    this.container.querySelectorAll(".bookmark-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const noticeId = btn.getAttribute("data-notice-id");
        this.toggleBookmark(noticeId);
        btn.innerHTML = getIcon(this.isBookmarked(noticeId) ? "check" : "bookmark", { size: 16 });
      });
    });

    // Notice card click through
    this.container.querySelectorAll(".notice-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        const id = card.getAttribute("data-notice-id");
        if (id) {
          this.markNoticeAsRead(id);
          this.router.navigate(`notices/${id}`);
        }
      });
    });

    // Pay fee button
    const payFeeBtn = this.container.querySelector("#btn-home-pay-fee");
    if (payFeeBtn) {
      payFeeBtn.addEventListener("click", () => {
        this.openFeePaymentModal();
      });
    }

    // Active course materials modal
    const courseMatBtn = this.container.querySelector("#btn-active-course-materials");
    if (courseMatBtn) {
      courseMatBtn.addEventListener("click", () => {
        modal.open({
          title: "CS402: Operating Systems & System Programming",
          bodyHtml: `
            <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--text-small); margin-bottom: var(--space-4);">
              <div><strong>Faculty:</strong> Prof. S. R. Kulkarni</div>
              <div><strong>Classroom:</strong> Room 304 (Academic Block A) • Credits: 4.0</div>
              <div><strong>Current Unit:</strong> Module 3 - Virtual Memory & Page Replacement</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: var(--text-small);">Official Syllabus (2026-27 Scheme)</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">PDF • 180 KB</div>
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'CS402 Syllabus downloaded.' })">
                  Download
                </button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: var(--text-small);">Lecture Notes: Memory Management & Threads</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">PDF • 5.1 MB</div>
                </div>
                <button class="btn btn--primary btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'OS Lecture Notes downloaded.' })">
                  Download
                </button>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: var(--text-small);">Solved MSE-I & MSE-II Question Banks</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">PDF • 1.6 MB</div>
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'Question Bank downloaded.' })">
                  Download
                </button>
              </div>
            </div>
          `,
          footerHtml: `
            <button class="btn btn--primary btn--md" onclick="window.appModal.close()">Close</button>
          `
        });
      });
    }

    // RSVP button handler
    this.container.querySelectorAll(".rsvp-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const eventId = btn.getAttribute("data-event-id");
        const ev = studentData.campusDirectory.upcomingEvents.find(e => e.id === eventId);
        if (ev) {
          ev.rsvpStatus = ev.rsvpStatus === "Registered" ? "Open" : "Registered";
          btn.textContent = ev.rsvpStatus === "Registered" ? "Cancel RSVP" : "Register / RSVP";
          btn.className = `btn btn--sm rsvp-btn ${ev.rsvpStatus === "Registered" ? "btn--outline" : "btn--primary"}`;
          toast.show({
            type: ev.rsvpStatus === "Registered" ? "success" : "info",
            title: ev.rsvpStatus === "Registered" ? "Registration Confirmed" : "RSVP Cancelled",
            message: `Event status updated for "${ev.title}".`
          });
        }
      });
    });
  }

  // ==========================================================================
  // VIEW: 2. NOTICES HUB (Date Ordering, Read/Unread States, Multi-Filters)
  // ==========================================================================
  renderNotices() {
    const unreadCount = studentData.notices.filter(n => !this.readNoticeIds.includes(n.id)).length;

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Official College Notices & Circulars",
        description: "Verified institutional updates, exam circulars, academic notices, and placement bulletins.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Notices" }
        ],
        actionsHtml: `
          ${unreadCount > 0 ? `
            <button class="btn btn--outline btn--sm" id="btn-mark-all-read">
              ${getIcon("check", { size: 14 })} Mark All Read (${unreadCount})
            </button>
          ` : `
            <span class="badge badge--success">${getIcon("check", { size: 12 })} All Read</span>
          `}
          <button class="btn btn--outline btn--sm" id="btn-notices-export">
            ${getIcon("download", { size: 14 })} Export PDF Archive
          </button>
        `
      })}

      <!-- Filter Controls Grid -->
      <div class="card" style="margin-bottom: var(--space-6); padding: var(--space-4);">
        <!-- Category Chips -->
        <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3); overflow-x: auto; padding-bottom: 2px;" role="toolbar" aria-label="Filter notices by category">
          <button class="btn btn--sm ${this.activeNoticeCategory === 'all' ? 'btn--primary' : 'btn--outline'}" data-category="all">All Categories</button>
          <button class="btn btn--sm ${this.activeNoticeCategory === 'urgent' ? 'btn--primary' : 'btn--outline'}" data-category="urgent">Urgent</button>
          <button class="btn btn--sm ${this.activeNoticeCategory === 'exam' ? 'btn--primary' : 'btn--outline'}" data-category="exam">Exams</button>
          <button class="btn btn--sm ${this.activeNoticeCategory === 'academic' ? 'btn--primary' : 'btn--outline'}" data-category="academic">Academics</button>
          <button class="btn btn--sm ${this.activeNoticeCategory === 'placement' ? 'btn--primary' : 'btn--outline'}" data-category="placement">Placements</button>
          <button class="btn btn--sm ${this.activeNoticeCategory === 'campus' ? 'btn--primary' : 'btn--outline'}" data-category="campus">Campus</button>
        </div>

        <!-- Search & Secondary Filter Dropdowns -->
        <div class="layout-grid-notices-filter">
          <div>
            <input type="text" id="notice-search-input" class="form-input" placeholder="Search by keyword, headline, or ref no..." value="${this.noticeSearchQuery}" />
          </div>
          <div>
            <select id="notice-dept-select" class="form-select">
              <option value="all">All Departments</option>
              <option value="Dean">Dean Academic</option>
              <option value="Controller">Controller of Exams</option>
              <option value="Computer Science">Computer Science & Engg</option>
              <option value="Placement">Training & Placement</option>
              <option value="Finance">Finance & Accounts</option>
              <option value="Student Welfare">Student Welfare</option>
            </select>
          </div>
          <div>
            <select id="notice-status-select" class="form-select">
              <option value="all">All Statuses</option>
              <option value="NEW">Status: NEW</option>
              <option value="IMPORTANT">Status: IMPORTANT</option>
              <option value="UPDATED">Status: UPDATED</option>
              <option value="ARCHIVED">Status: ARCHIVED</option>
            </select>
          </div>
          <div>
            <select id="notice-sort-select" class="form-select">
              <option value="newest" ${this.noticeSortOrder === 'newest' ? 'selected' : ''}>Sort: Newest First</option>
              <option value="oldest" ${this.noticeSortOrder === 'oldest' ? 'selected' : ''}>Sort: Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notice Cards Container -->
      <div id="notice-cards-container" style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${this.buildFilteredNoticesHtml()}
      </div>
    `;

    this.attachNoticesEvents();
  }

  buildFilteredNoticesHtml() {
    let filtered = studentData.notices.filter(n => {
      const matchCat = this.activeNoticeCategory === "all" || n.category === this.activeNoticeCategory;
      const matchStatus = this.activeNoticeStatus === "all" || n.status === this.activeNoticeStatus;
      const matchDept = this.activeNoticeDept === "all" || n.department.toLowerCase().includes(this.activeNoticeDept.toLowerCase());
      const q = this.noticeSearchQuery.toLowerCase().trim();
      const matchQuery = !q || n.headline.toLowerCase().includes(q) || n.snippet.toLowerCase().includes(q) || n.refNo.toLowerCase().includes(q) || n.department.toLowerCase().includes(q);

      return matchCat && matchStatus && matchDept && matchQuery;
    });

    // Date sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.date).getTime();
      const dateB = new Date(b.isoDate || b.date).getTime();
      return this.noticeSortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

    if (filtered.length === 0) {
      return renderEmptyState({
        icon: "file-text",
        title: "No Circulars Match Your Filter",
        description: "Try clearing search keywords or switching to 'All Categories' and 'All Statuses'.",
        actionText: "Reset All Filters",
        actionId: "btn-reset-notice-filters"
      });
    }

    const hasActiveFilters = this.activeNoticeCategory !== 'all' || this.activeNoticeStatus !== 'all' || this.activeNoticeDept !== 'all' || this.noticeSearchQuery;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); color: var(--color-text-muted); flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-1);">
        <span>Showing <strong>${filtered.length}</strong> of ${studentData.notices.length} official circulars</span>
        ${hasActiveFilters ? `
          <button id="btn-quick-reset-filters" class="btn btn--ghost btn--sm" style="font-size: 11px; color: var(--color-primary); padding: 2px 6px;">
            Reset Filters
          </button>
        ` : ''}
      </div>

      ${filtered.map(n => {
        const isUrgent = n.category === "urgent";
        const bookmarked = this.isBookmarked(n.id);
        const unread = !this.isNoticeRead(n.id);
        const userBranch = studentData.profile.branchCode || "CSE";
        const matchesBranch = n.department.toLowerCase().includes(userBranch.toLowerCase()) || 
                              n.headline.toLowerCase().includes(userBranch.toLowerCase());

        return `
          <article class="notice-card ${isUrgent ? 'notice-card--urgent' : ''}" tabindex="0" data-notice-id="${n.id}">
            <div class="notice-card-header">
              <div style="display: flex; gap: var(--space-1); align-items: center; flex-wrap: wrap;">
                ${unread ? '<span class="status-dot" style="background: var(--color-primary); width: 8px; height: 8px; border-radius: 50%; display: inline-block;" title="Unread Notice"></span>' : ''}
                ${renderBadge({ 
                  label: n.status, 
                  variant: n.status === 'IMPORTANT' ? 'danger' : n.status === 'NEW' ? 'primary' : 'neutral' 
                })}
                ${renderBadge({ 
                  label: n.categoryLabel, 
                  variant: isUrgent ? 'danger' : 'primary' 
                })}
                ${matchesBranch ? renderBadge({ label: `${userBranch} Branch`, variant: "success" }) : ''}
              </div>
              <span style="font-size: var(--text-meta); color: var(--color-text-muted);">
                ${n.date} • ${n.refNo}
              </span>
            </div>

            <h2 class="notice-card-title">${n.headline}</h2>
            <p class="notice-card-snippet">${n.snippet}</p>

            <div class="notice-card-footer">
              <span style="color: var(--color-text-muted); font-size: var(--text-small);">
                🏢 ${n.department}
              </span>
              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <button class="btn-icon bookmark-trigger-btn" data-notice-id="${n.id}" aria-label="Bookmark notice">
                  ${getIcon(bookmarked ? "check" : "bookmark", { size: 16 })}
                </button>
                <a href="#notices/${n.id}" class="btn btn--outline btn--sm">
                  Read Notice &rarr;
                </a>
              </div>
            </div>
          </article>
        `;
      }).join("")}
    `;
  }

  attachNoticesEvents() {
    // Category chips
    this.container.querySelectorAll("[data-category]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.container.querySelectorAll("[data-category]").forEach(b => {
          b.className = "btn btn--sm btn--outline";
        });
        btn.className = "btn btn--sm btn--primary";
        this.activeNoticeCategory = btn.getAttribute("data-category");
        this.refreshNoticeList();
      });
    });

    // Search input
    const searchInput = this.container.querySelector("#notice-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.noticeSearchQuery = e.target.value;
        this.refreshNoticeList();
      });
    }

    // Department select
    const deptSelect = this.container.querySelector("#notice-dept-select");
    if (deptSelect) {
      deptSelect.value = this.activeNoticeDept;
      deptSelect.addEventListener("change", (e) => {
        this.activeNoticeDept = e.target.value;
        this.refreshNoticeList();
      });
    }

    // Status select
    const statusSelect = this.container.querySelector("#notice-status-select");
    if (statusSelect) {
      statusSelect.value = this.activeNoticeStatus;
      statusSelect.addEventListener("change", (e) => {
        this.activeNoticeStatus = e.target.value;
        this.refreshNoticeList();
      });
    }

    // Sort order select
    const sortSelect = this.container.querySelector("#notice-sort-select");
    if (sortSelect) {
      sortSelect.value = this.noticeSortOrder;
      sortSelect.addEventListener("change", (e) => {
        this.noticeSortOrder = e.target.value;
        this.refreshNoticeList();
      });
    }

    // Mark all read button
    const markAllReadBtn = this.container.querySelector("#btn-mark-all-read");
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", () => this.markAllNoticesAsRead());
    }

    // Export archive button
    const exportBtn = this.container.querySelector("#btn-notices-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        toast.show({
          type: "success",
          title: "Archive Exported",
          message: "Notices compiled to College_Circular_Digest_2026.pdf"
        });
      });
    }

    this.attachNoticeCardClicks();
  }

  refreshNoticeList() {
    const listContainer = document.getElementById("notice-cards-container");
    if (listContainer) {
      listContainer.innerHTML = this.buildFilteredNoticesHtml();
      this.attachNoticeCardClicks();

      // Reset filters button listener
      const resetBtn = document.getElementById("btn-reset-notice-filters");
      const quickResetBtn = document.getElementById("btn-quick-reset-filters");
      const doReset = () => {
        this.activeNoticeCategory = "all";
        this.activeNoticeStatus = "all";
        this.activeNoticeDept = "all";
        this.noticeSearchQuery = "";
        this.noticeSortOrder = "newest";
        this.renderNotices();
        toast.show({
          type: "info",
          title: "Filters Cleared",
          message: "Showing all official notices and circulars."
        });
      };
      if (resetBtn) resetBtn.addEventListener("click", doReset);
      if (quickResetBtn) quickResetBtn.addEventListener("click", doReset);
    }
  }

  attachNoticeCardClicks() {
    this.container.querySelectorAll(".notice-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        const id = card.getAttribute("data-notice-id");
        if (id) {
          this.markNoticeAsRead(id);
          this.router.navigate(`notices/${id}`);
        }
      });
    });

    this.container.querySelectorAll(".bookmark-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-notice-id");
        this.toggleBookmark(id);
        btn.innerHTML = getIcon(this.isBookmarked(id) ? "check" : "bookmark", { size: 16 });
      });
    });
  }

  // ==========================================================================
  // VIEW: 3. NOTICE DETAIL
  // ==========================================================================
  renderNoticeDetail(noticeId) {
    const notice = studentData.notices.find(n => n.id === noticeId);

    // If notice not found, render error state
    if (!notice) {
      this.container.innerHTML = `
        ${renderPageHeader({
          title: "Notice Not Found",
          breadcrumbs: [
            { label: "Home", href: "#home" },
            { label: "Notices", href: "#notices" }
          ]
        })}
        ${renderEmptyState({
          icon: "alert-triangle",
          title: "Circular Not Located",
          description: "The notice you requested does not exist or may have been archived.",
          actionText: "Return to All Notices",
          actionId: "btn-return-notices"
        })}
      `;
      const retBtn = document.getElementById("btn-return-notices");
      if (retBtn) retBtn.addEventListener("click", () => this.router.navigate("notices"));
      return;
    }

    // Mark current notice as read immediately
    this.markNoticeAsRead(notice.id);

    const isBookmarked = this.isBookmarked(notice.id);
    const related = studentData.notices.filter(n => n.id !== notice.id && (notice.relatedNoticeIds?.includes(n.id) || n.category === notice.category)).slice(0, 2);

    this.container.innerHTML = `
      ${renderPageHeader({
        title: notice.headline,
        description: `Reference: ${notice.refNo} • Published by ${notice.authority}`,
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Notices", href: "#notices" },
          { label: notice.refNo }
        ],
        actionsHtml: `
          <button class="btn btn--outline btn--sm" id="btn-print-notice" title="Print Official Circular">
            ${getIcon("file-text", { size: 14 })} Print
          </button>
          <button class="btn btn--outline btn--sm" id="btn-copy-ref" title="Copy Reference Number">
            ${getIcon("file-text", { size: 14 })} Copy Ref
          </button>
          <button class="btn btn--outline btn--sm" id="btn-detail-bookmark">
            ${getIcon(isBookmarked ? "check" : "bookmark", { size: 16 })}
            ${isBookmarked ? "Bookmarked" : "Bookmark Notice"}
          </button>
          <a href="#notices" class="btn btn--outline btn--sm">
            &larr; Back to Notices
          </a>
        `
      })}

      <div class="layout-grid-notice-detail">
        <!-- Main Circular Document -->
        <article class="card" style="padding: var(--space-6);">
          <!-- Header Metadata -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); flex-wrap: wrap; gap: var(--space-2);">
            <div>
              <div style="display: flex; gap: var(--space-2); align-items: center; margin-bottom: var(--space-2);">
                ${renderBadge({ label: notice.status, variant: notice.status === 'IMPORTANT' ? 'danger' : 'primary' })}
                ${renderBadge({ label: notice.categoryLabel, variant: notice.category === 'urgent' ? 'danger' : 'primary' })}
              </div>
              <div style="font-size: var(--text-small); color: var(--color-text-muted);">
                Publishing Date: <strong>${notice.date}</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge--neutral">Official Verified Circular</span>
              <div style="font-size: var(--text-meta); color: var(--color-text-muted); margin-top: 2px;">${notice.readTime}</div>
            </div>
          </div>

          <!-- Official Department Banner -->
          <div style="background: var(--color-surface-subtle); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-6); font-size: var(--text-small);">
            <strong>Issuing Department:</strong> ${notice.department}
          </div>

          <!-- Notice Rich Body -->
          <div class="card-body" style="font-size: var(--text-body); line-height: var(--leading-relaxed); color: var(--color-text-primary);">
            ${notice.content}
          </div>

          <!-- Official Signature Box -->
          <div style="margin-top: var(--space-8); padding-top: var(--space-4); border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-2);">
            <div>
              <div style="font-size: var(--text-label); color: var(--color-text-muted); text-transform: uppercase;">Authenticated By</div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body); color: var(--color-text-primary); margin-top: 2px;">${notice.authority}</div>
              <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${notice.department}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge--success">${getIcon("check", { size: 12 })} Digitally Signed & Sealed</span>
            </div>
          </div>

          <!-- Download Attachment Box -->
          <div style="margin-top: var(--space-6); padding: var(--space-4); background: var(--color-primary-subtle); border: 1px solid var(--color-primary-border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
            <div>
              <div style="font-size: var(--text-small); font-weight: var(--font-weight-bold); color: var(--color-primary);">Official Attachment File</div>
              <div style="font-size: var(--text-meta); color: var(--color-text-secondary);">${notice.attachment} (${notice.attachmentSize || '150 KB'})</div>
            </div>
            <button class="btn btn--primary btn--sm" id="btn-download-attachment">
              ${getIcon("download", { size: 14 })} Download PDF
            </button>
          </div>
        </article>

        <!-- Sidebar: Related Circulars & Inquiries -->
        <aside style="display: flex; flex-direction: column; gap: var(--space-6);">
          <!-- Related Notices -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="font-size: var(--text-h3);">Related Notices</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${related.map(r => `
                <div style="padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border);">
                  <span class="badge ${r.category === 'urgent' ? 'badge--danger' : 'badge--primary'}" style="font-size: 10px;">${r.categoryLabel}</span>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small); margin: 2px 0;">
                    <a href="#notices/${r.id}" style="color: var(--color-text-primary); text-decoration: none;">${r.headline}</a>
                  </div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">${r.date}</div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Department Inquiry Helpdesk -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title" style="font-size: var(--text-h3);">Have Questions?</h3>
            </div>
            <p style="font-size: var(--text-small); margin-bottom: var(--space-3);">
              Contact the administrative office or file an official inquiry ticket regarding this circular.
            </p>
            <a href="#services" class="btn btn--outline btn--sm" style="width: 100%;">
              Open Student Helpdesk &rarr;
            </a>
          </div>
        </aside>
      </div>
    `;

    // Print circular
    const printBtn = this.container.querySelector("#btn-print-notice");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        toast.show({
          type: "info",
          title: "Preparing Document",
          message: "Opening print dialog for official circular."
        });
        setTimeout(() => window.print(), 300);
      });
    }

    // Copy reference number
    const copyRefBtn = this.container.querySelector("#btn-copy-ref");
    if (copyRefBtn) {
      copyRefBtn.addEventListener("click", () => {
        navigator.clipboard?.writeText(notice.refNo);
        toast.show({
          type: "success",
          title: "Reference Copied",
          message: `${notice.refNo} copied to clipboard.`
        });
      });
    }

    // Attachment download toast
    const downloadBtn = this.container.querySelector("#btn-download-attachment");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        toast.show({
          type: "success",
          title: "Document Downloaded",
          message: `${notice.attachment} saved successfully.`
        });
      });
    }

    // Detail bookmark toggle
    const detailBookmarkBtn = this.container.querySelector("#btn-detail-bookmark");
    if (detailBookmarkBtn) {
      detailBookmarkBtn.addEventListener("click", () => {
        this.toggleBookmark(notice.id);
        const active = this.isBookmarked(notice.id);
        detailBookmarkBtn.innerHTML = `
          ${getIcon(active ? "check" : "bookmark", { size: 16 })}
          ${active ? "Bookmarked" : "Bookmark Notice"}
        `;
      });
    }
  }

  // ==========================================================================
  // VIEW: 4. ACADEMICS HUB
  // ==========================================================================
  renderAcademics(activeTab = "timetable") {
    const timetable = studentData.weeklyTimetable;
    const isCalendar = activeTab === "calendar";
    const isDepts = activeTab === "departments";
    const isResources = activeTab === "resources";

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Academics & Curriculum",
        description: "Class timetables, academic calendars, academic departments, and study resources.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Academics" }
        ]
      })}

      <!-- Sub-Tabs Navigation -->
      <div class="tab-list" role="tablist">
        <button class="tab-item ${!isCalendar && !isDepts && !isResources ? 'active' : ''}" data-academics-tab="timetable">
          Class Timetable
        </button>
        <button class="tab-item ${isCalendar ? 'active' : ''}" data-academics-tab="calendar">
          Academic Calendar
        </button>
        <button class="tab-item ${isDepts ? 'active' : ''}" data-academics-tab="departments">
          Academic Departments
        </button>
        <button class="tab-item ${isResources ? 'active' : ''}" data-academics-tab="resources">
          Course Syllabi & Resources
        </button>
      </div>

      <div id="academics-content-container">
        ${isCalendar ? this.buildAcademicCalendarHtml() :
          isDepts ? this.buildAcademicDepartmentsHtml() :
          isResources ? this.buildAcademicResourcesHtml() :
          this.buildTimetableHtml()}
      </div>
    `;

    // Tab handlers
    this.container.querySelectorAll("[data-academics-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-academics-tab");
        this.router.navigate(`academics/${target}`);
      });
    });

    // Day switcher for timetable
    this.container.querySelectorAll(".timetable-day-btn").forEach(dayBtn => {
      dayBtn.addEventListener("click", () => {
        this.container.querySelectorAll(".timetable-day-btn").forEach(b => {
          b.className = "btn btn--sm btn--outline timetable-day-btn";
        });
        dayBtn.className = "btn btn--sm btn--primary timetable-day-btn";
        const day = dayBtn.getAttribute("data-day");
        const list = studentData.weeklyTimetable[day];
        const dayHeader = document.getElementById("timetable-day-header");
        const periodContainer = document.getElementById("timetable-period-list");
        if (dayHeader) dayHeader.textContent = `${day} Lecture & Practical Schedule`;
        if (periodContainer && list) {
          periodContainer.innerHTML = list.map(p => {
            const isLive = day === "Wednesday" && p.time.startsWith("09:00");
            return `
              <div class="${isLive ? 'live-period-card' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
                <div style="width: 140px; font-size: var(--text-small); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); display: flex; align-items: center; gap: 4px;">
                  ${getIcon("clock", { size: 14 })}
                  ${p.time}
                </div>
                <div style="flex: 1; min-width: 180px; padding: 0 var(--space-2);">
                  <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <span style="font-size: var(--text-label); font-weight: var(--font-weight-bold); color: var(--color-primary);">${p.code}</span>
                    ${isLive ? '<span class="live-period-badge">LIVE NOW</span>' : ''}
                  </div>
                  <div style="font-size: var(--text-body); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">${p.name}</div>
                  <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${p.faculty}</div>
                </div>
                <span class="badge badge--neutral">${p.room}</span>
              </div>
            `;
          }).join("");
        }
      });
    });
  }

  buildTimetableHtml() {
    const timetable = studentData.weeklyTimetable;
    return `
      <!-- Day Switcher -->
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4); overflow-x: auto;">
        ${timetable.days.map(d => `
          <button class="btn btn--sm ${d === 'Wednesday' ? 'btn--primary' : 'btn--outline'} timetable-day-btn" data-day="${d}">
            ${d} ${d === 'Wednesday' ? '(Today)' : ''}
          </button>
        `).join("")}
      </div>

      <!-- Class Periods List -->
      <div class="card" style="margin-bottom: var(--space-6);">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("calendar", { size: 18 })}
            <span id="timetable-day-header">Wednesday Lecture & Practical Schedule</span>
          </h2>
          <span style="font-size: var(--text-small); color: var(--color-text-muted);">Section IV-B • Room 304 Block A</span>
        </div>
        <div id="timetable-period-list" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${timetable.Wednesday.map(p => {
            const isLive = p.time.startsWith("09:00");
            return `
              <div class="${isLive ? 'live-period-card' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
                <div style="width: 140px; font-size: var(--text-small); font-weight: var(--font-weight-semibold); color: var(--color-text-muted); display: flex; align-items: center; gap: 4px;">
                  ${getIcon("clock", { size: 14 })}
                  ${p.time}
                </div>
                <div style="flex: 1; min-width: 180px; padding: 0 var(--space-2);">
                  <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <span style="font-size: var(--text-label); font-weight: var(--font-weight-bold); color: var(--color-primary);">${p.code}</span>
                    ${isLive ? '<span class="live-period-badge">LIVE NOW</span>' : ''}
                  </div>
                  <div style="font-size: var(--text-body); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">${p.name}</div>
                  <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${p.faculty}</div>
                </div>
                <span class="badge badge--neutral">${p.room}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  buildAcademicCalendarHtml() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("clock", { size: 18 })}
            Academic Calendar & Key Term Dates (Fall 2026)
          </h2>
          <span class="badge badge--primary">B.Tech Semester IV</span>
        </div>
        <div style="display: flex; flex-direction: column;">
          ${studentData.academicCalendar.map(cal => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
              <div>
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">${cal.event}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">${cal.date}</div>
              </div>
              ${renderBadge({ 
                label: cal.type, 
                variant: cal.type === 'Holiday' ? 'success' : cal.type === 'Deadline' ? 'warning' : 'primary' 
              })}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  buildAcademicDepartmentsHtml() {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
        ${studentData.departments.map(d => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
              <span class="badge badge--primary">${d.code}</span>
              <span style="font-size: var(--text-meta); color: var(--color-text-muted);">${d.studentsEnrolled} Students</span>
            </div>
            <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-1);">${d.name}</h3>
            <div style="font-size: var(--text-small); color: var(--color-text-secondary); margin-bottom: var(--space-2);">
              <strong>HOD:</strong> ${d.hod}
            </div>
            <div style="font-size: var(--text-small); color: var(--color-text-muted); margin-bottom: var(--space-3);">
              📍 ${d.building} • ${d.facultyCount} Faculty
            </div>
            <div style="font-size: var(--text-label); color: var(--color-text-secondary); margin-bottom: var(--space-3);">
              <strong>Key Labs:</strong> ${d.labs.join(", ")}
            </div>
            <button class="btn btn--outline btn--sm" style="width: 100%;" onclick="alert('Contact: ${d.email}')">
              Contact Department
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }

  buildAcademicResourcesHtml() {
    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        ${studentData.academicResources.map(r => `
          <div class="card">
            <div class="card-header">
              <div>
                <span class="badge badge--primary">${r.code}</span>
                <h3 style="font-size: var(--text-h3); margin-top: 2px;">${r.title}</h3>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">${r.faculty}</div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-3); margin-top: var(--space-3);">
              <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: var(--text-label); font-weight: var(--font-weight-bold);">Syllabus Copy</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">PDF document</div>
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'Syllabus downloaded.' })">
                  ${getIcon("download", { size: 14 })}
                </button>
              </div>
              <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: var(--text-label); font-weight: var(--font-weight-bold);">Lecture Notes</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">Modules 1 to 4</div>
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'Lecture notes saved.' })">
                  ${getIcon("download", { size: 14 })}
                </button>
              </div>
              <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: var(--text-label); font-weight: var(--font-weight-bold);">Question Bank</div>
                  <div style="font-size: var(--text-meta); color: var(--color-text-muted);">Solved Papers</div>
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Downloaded', message: 'Question bank saved.' })">
                  ${getIcon("download", { size: 14 })}
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ==========================================================================
  // VIEW: 5. EXAMS HUB
  // ==========================================================================
  renderExams(activeTab = "schedule") {
    const isResults = activeTab === "results";
    const isHallTicket = activeTab === "hallticket";

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Examinations & Academic Assessments",
        description: "Timetables, authenticated digital hall tickets, seating plans, and official result statements.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Exams" }
        ]
      })}

      <!-- Tabs -->
      <div class="tab-list" style="margin-bottom: var(--space-6);">
        <button class="tab-item ${!isResults && !isHallTicket ? 'active' : ''}" data-exam-tab="schedule">
          MSE-II Timetable & Seating
        </button>
        <button class="tab-item ${isHallTicket ? 'active' : ''}" data-exam-tab="hallticket">
          Digital Hall Ticket
        </button>
        <button class="tab-item ${isResults ? 'active' : ''}" data-exam-tab="results">
          Semester Results
        </button>
      </div>

      <div id="exams-subview-content">
        ${isResults ? this.buildExamResultsHtml() :
          isHallTicket ? this.buildHallTicketDetailHtml() :
          this.buildExamScheduleHtml()}
      </div>
    `;

    this.container.querySelectorAll("[data-exam-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-exam-tab");
        this.router.navigate(`exams/${tab}`);
      });
    });
  }

  buildExamScheduleHtml() {
    return `
      <!-- Digital Hall Ticket Shortcut Card -->
      <div class="card" style="margin-bottom: var(--space-6); background: var(--color-primary-subtle); border-color: var(--color-primary-border);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-4);">
          <div>
            ${renderBadge({ label: "Admit Card Ready", variant: "primary" })}
            <h3 style="margin-top: 4px; font-size: var(--text-h3);">Mid-Term Assessment (MSE-II) Digital Hall Ticket</h3>
            <p style="font-size: var(--text-small);">Rohan Sharma (1MS22CS084) • Center: Academic Block B</p>
          </div>
          <div style="display: flex; gap: var(--space-2);">
            <a href="#exams/hallticket" class="btn btn--outline btn--sm">View Hall Ticket</a>
            <button class="btn btn--primary btn--sm" onclick="window.showToast({ type: 'success', title: 'Hall Ticket Downloaded', message: 'PDF admit card saved with barcode token.' })">
              ${getIcon("download", { size: 14 })} Download PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Exam Timetable & Seating Grid -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("calendar", { size: 18 })}
            Semester IV Mid-Term Assessment Timetable
          </h2>
          <span style="font-size: var(--text-small); color: var(--color-text-muted);">Morning Session: 09:30 AM - 12:30 PM</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${studentData.examSchedule.map(e => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
              <div style="width: 170px;">
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">${e.date}</div>
                <div style="font-size: var(--text-label); color: var(--color-text-muted);">${e.time}</div>
              </div>
              <div style="flex: 1; padding: 0 var(--space-3); min-width: 200px;">
                <div style="font-size: var(--text-label); font-weight: var(--font-weight-bold); color: var(--color-primary);">${e.code}</div>
                <div style="font-size: var(--text-body); font-weight: var(--font-weight-semibold); color: var(--color-text-primary);">${e.subject}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${e.room}</div>
              </div>
              <span class="badge badge--primary">Seat: ${e.seatNo}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  buildHallTicketDetailHtml() {
    const p = studentData.profile;
    return `
      <div class="card" style="max-width: 720px; margin: 0 auto; border: 2px solid var(--color-primary);">
        <div style="text-align: center; padding-bottom: var(--space-4); border-bottom: 2px solid var(--color-border);">
          <div style="font-weight: var(--font-weight-bold); font-size: var(--text-h2); color: var(--color-primary);">M. S. RAMAIAH INSTITUTE OF TECHNOLOGY</div>
          <div style="font-size: var(--text-label); color: var(--color-text-muted);">Autonomous Institution Affiliated to VTU • Examination Cell</div>
          <h3 style="margin-top: 6px; font-size: var(--text-h3);">OFFICIAL EXAMINATION ADMIT CARD (HALL TICKET)</h3>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 100px; gap: var(--space-4); margin: var(--space-4) 0; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <div>
            <div style="display: grid; grid-template-columns: 130px 1fr; gap: 4px; font-size: var(--text-small);">
              <span style="color: var(--color-text-muted);">Candidate Name:</span>
              <strong>${p.name}</strong>
              <span style="color: var(--color-text-muted);">USN:</span>
              <strong style="font-family: var(--font-mono);">${p.rollNumber}</strong>
              <span style="color: var(--color-text-muted);">Program / Branch:</span>
              <span>${p.program}</span>
              <span style="color: var(--color-text-muted);">Semester:</span>
              <span>${p.semester}</span>
              <span style="color: var(--color-text-muted);">Exam Center:</span>
              <strong>Academic Block B (Halls 1 - 4)</strong>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--color-surface-subtle); border-radius: var(--radius-md); padding: var(--space-2);">
            <div style="width: 60px; height: 60px; background: #cbd5e1; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;">
              RS
            </div>
            <span style="font-size: 9px; color: var(--color-text-muted); margin-top: 4px;">Photo Verified</span>
          </div>
        </div>

        <div style="margin-bottom: var(--space-4); overflow-x: auto;">
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small); margin-bottom: var(--space-2);">Approved Subject Registrations:</div>
          <table style="width: 100%; border-collapse: collapse; font-size: var(--text-small);">
            <thead>
              <tr style="background: var(--color-surface-subtle); font-size: 11px; text-transform: uppercase;">
                <th style="padding: 6px;">Code</th>
                <th style="padding: 6px;">Subject Name</th>
                <th style="padding: 6px;">Date</th>
                <th style="padding: 6px;">Signature</th>
              </tr>
            </thead>
            <tbody>
              ${studentData.examSchedule.map(e => `
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: 6px; font-weight: bold;">${e.code}</td>
                  <td style="padding: 6px;">${e.subject}</td>
                  <td style="padding: 6px;">${e.date.split(" ")[0]} ${e.date.split(" ")[1]}</td>
                  <td style="padding: 6px; color: var(--color-text-muted);">Invigilator sign</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--color-border); flex-wrap: wrap; gap: var(--space-2);">
          <span style="font-size: var(--text-meta); color: var(--color-text-muted);">Barcode Token: #ADM-2026-9810-CS084</span>
          <button class="btn btn--primary btn--md" onclick="window.showToast({ type: 'success', title: 'Printed / Downloaded', message: 'Hall Ticket PDF downloaded with official QR code.' })">
            ${getIcon("download", { size: 16 })} Download Official PDF
          </button>
        </div>
      </div>
    `;
  }

  buildExamResultsHtml() {
    const res = studentData.resultsSummary;
    return `
      <div class="card">
        <div class="card-header">
          <div>
            ${renderBadge({ label: res.resultStatus, variant: "success" })}
            <h2 class="card-title" style="margin-top: 4px;">${res.semester} Result Statement</h2>
          </div>
          <div style="text-align: right;">
            <div style="font-size: var(--text-h1); font-weight: var(--font-weight-bold); color: var(--color-primary);">SGPA ${res.sgpa}</div>
            <div style="font-size: var(--text-small); color: var(--color-text-muted);">Cumulative CGPA: ${res.cgpa}</div>
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: var(--text-small); text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); color: var(--color-text-muted); font-size: var(--text-label); text-transform: uppercase;">
                <th style="padding: 10px 8px;">Course Code</th>
                <th style="padding: 10px 8px;">Subject Name</th>
                <th style="padding: 10px 8px;">Credits</th>
                <th style="padding: 10px 8px;">Grade</th>
                <th style="padding: 10px 8px;">Marks</th>
              </tr>
            </thead>
            <tbody>
              ${res.courses.map(c => `
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: 12px 8px; font-weight: 700; color: var(--color-primary);">${c.code}</td>
                  <td style="padding: 12px 8px; font-weight: 600;">${c.name}</td>
                  <td style="padding: 12px 8px;">${c.credits}</td>
                  <td style="padding: 12px 8px; font-weight: 700; color: var(--color-success);">${c.grade}</td>
                  <td style="padding: 12px 8px;">${c.marks} / 100</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div style="margin-top: var(--space-4); display: flex; justify-content: flex-end; gap: var(--space-2);">
          <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'info', title: 'Revaluation', message: 'Revaluation window opens Oct 5.' })">
            Apply for Revaluation
          </button>
          <button class="btn btn--primary btn--sm" onclick="window.showToast({ type: 'success', title: 'Grade Card', message: 'Downloading digitally attested grade card.' })">
            ${getIcon("download", { size: 14 })} Download Grade Sheet
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // VIEW: 6. CAMPUS HUB
  // ==========================================================================
  renderCampus(activeTab = "events") {
    const isClubs = activeTab === "clubs";
    const isFacilities = activeTab === "facilities";

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Campus Life & Facilities",
        description: "Upcoming collegiate events, student societies, facility hours, and interactive campus directory.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Campus" }
        ]
      })}

      <!-- Tabs -->
      <div class="tab-list" style="margin-bottom: var(--space-6);">
        <button class="tab-item ${!isClubs && !isFacilities ? 'active' : ''}" data-campus-tab="events">
          Upcoming Events & Fests
        </button>
        <button class="tab-item ${isClubs ? 'active' : ''}" data-campus-tab="clubs">
          Clubs & Student Societies
        </button>
        <button class="tab-item ${isFacilities ? 'active' : ''}" data-campus-tab="facilities">
          Facilities & Directory
        </button>
      </div>

      <div id="campus-subview-content">
        ${isClubs ? this.buildClubsHtml() :
          isFacilities ? this.buildFacilitiesHtml() :
          this.buildEventsHtml()}
      </div>
    `;

    this.container.querySelectorAll("[data-campus-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-campus-tab");
        this.router.navigate(`campus/${tab}`);
      });
    });
  }

  buildEventsHtml() {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-4);">
        ${studentData.campusDirectory.upcomingEvents.map(e => `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
                <span class="badge badge--primary">${e.tag}</span>
                <span class="badge ${e.rsvpStatus === 'Registered' ? 'badge--success' : 'badge--neutral'}">${e.rsvpStatus}</span>
              </div>
              <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-2);">${e.title}</h3>
              <p style="font-size: var(--text-small); color: var(--color-text-secondary); margin-bottom: var(--space-3);">${e.description}</p>
              <div style="font-size: var(--text-meta); color: var(--color-text-muted); display: flex; flex-direction: column; gap: 2px;">
                <span>📅 <strong>Date:</strong> ${e.date}</span>
                <span>📍 <strong>Venue:</strong> ${e.venue}</span>
                <span>👥 <strong>Organized by:</strong> ${e.organizedBy}</span>
              </div>
            </div>
            <div style="margin-top: var(--space-4);">
              <button class="btn btn--sm ${e.rsvpStatus === 'Registered' ? 'btn--outline' : 'btn--primary'} rsvp-btn" data-event-id="${e.id}" style="width: 100%;">
                ${e.rsvpStatus === 'Registered' ? 'Cancel RSVP' : 'Register for Event'}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  buildClubsHtml() {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4);">
        ${studentData.campusDirectory.clubs.map(c => `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
                <span class="badge badge--primary">${c.category}</span>
                <span style="font-size: var(--text-meta); color: var(--color-text-muted);">${c.members} Members</span>
              </div>
              <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-1);">${c.name}</h3>
              <div style="font-size: var(--text-small); color: var(--color-text-muted); margin-bottom: var(--space-3);">
                <strong>Lead:</strong> ${c.lead}
              </div>
              <p style="font-size: var(--text-small); color: var(--color-text-secondary); margin-bottom: var(--space-3);">
                ${c.description}
              </p>
              <div style="font-size: var(--text-meta); color: var(--color-text-muted);">
                ⏱ Meetings: ${c.meetingTime}
              </div>
            </div>
            <div style="margin-top: var(--space-4);">
              <button class="btn btn--outline btn--sm" style="width: 100%;" onclick="window.showToast({ type: 'success', title: 'Club Inquiry Sent', message: 'The lead coordinator will contact you.' })">
                Join / Contact Club
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  buildFacilitiesHtml() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("compass", { size: 18 })}
            Campus Amenities & Working Hours
          </h2>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${studentData.campusDirectory.facilities.map(f => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
              <div>
                <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-body);">${f.name}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">📍 ${f.location} • Contact: ${f.contact}</div>
                <div style="font-size: var(--text-label); color: var(--color-primary); margin-top: 2px;">Hours: ${f.hours}</div>
              </div>
              ${renderBadge({ label: f.status, variant: f.status.includes('Open') ? 'success' : 'neutral' })}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // VIEW: 7. STUDENT SERVICES HUB
  // ==========================================================================
  renderServices(activeTab = "catalog") {
    const isFees = activeTab === "fees";
    const isLibrary = activeTab === "library";
    const isTransport = activeTab === "transport";

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Student Services & Support Desk",
        description: "Submit certificate applications, clear tuition and exam dues, renew library books, and access helpdesk.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Student Services" }
        ]
      })}

      <!-- Tabs -->
      <div class="tab-list" style="margin-bottom: var(--space-6);">
        <button class="tab-item ${!isFees && !isLibrary && !isTransport ? 'active' : ''}" data-service-tab="catalog">
          Digital Certificates & Requests
        </button>
        <button class="tab-item ${isFees ? 'active' : ''}" data-service-tab="fees">
          Fee Management & Receipts
        </button>
        <button class="tab-item ${isLibrary ? 'active' : ''}" data-service-tab="library">
          Library & Digital Book Loans
        </button>
        <button class="tab-item ${isTransport ? 'active' : ''}" data-service-tab="transport">
          Transport & Support Contacts
        </button>
      </div>

      <div id="services-subview-content">
        ${isFees ? this.buildFeesHtml() :
          isLibrary ? this.buildLibraryHtml() :
          isTransport ? this.buildTransportHtml() :
          this.buildServiceCatalogHtml()}
      </div>
    `;

    this.container.querySelectorAll("[data-service-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-service-tab");
        this.router.navigate(`services/${tab}`);
      });
    });

    this.attachServicesEvents();
  }

  buildServiceCatalogHtml() {
    return `
      <!-- Active Requests -->
      <div class="card" style="margin-bottom: var(--space-6); background: var(--color-primary-subtle); border-color: var(--color-primary-border);">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("clock", { size: 18 })}
            Active Application Tracker
          </h2>
          ${renderBadge({ label: "1 In Progress", variant: "warning" })}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); background: white; border-radius: var(--radius-md); border: 1px solid var(--color-border); flex-wrap: wrap; gap: var(--space-2);">
          <div>
            <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-body);">Bonafide Certificate (Passport Application)</div>
            <div style="font-size: var(--text-small); color: var(--color-text-muted);">Application ID: #SR-2026-4412 • Submitted: Sep 28, 2026</div>
          </div>
          ${renderBadge({ label: "Under Review", variant: "warning" })}
        </div>
      </div>

      <h2 style="font-size: var(--text-h2); margin-bottom: var(--space-4);">Available Administrative Services</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4);">
        ${studentData.services.map(s => `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
                ${renderBadge({ label: s.category, variant: "primary" })}
                <span style="font-size: var(--text-meta); color: var(--color-text-muted); font-weight: var(--font-weight-semibold);">⏱ ${s.turnaround}</span>
              </div>
              <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-2);">${s.title}</h3>
              <p style="font-size: var(--text-small); color: var(--color-text-secondary); line-height: var(--leading-normal);">${s.description}</p>
            </div>
            <div style="margin-top: var(--space-4);">
              <button class="btn btn--primary btn--md request-service-btn" data-title="${s.title}" style="width: 100%;">
                Apply Online
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  buildFeesHtml() {
    const f = studentData.studentServicesData.fees;
    return `
      <div class="card" style="margin-bottom: var(--space-6);">
        <div class="card-header">
          <h2 class="card-title">
            ${getIcon("file-text", { size: 18 })}
            Semester Fee Breakdown & Settlement
          </h2>
          ${renderBadge({ label: "Fall 2026", variant: "primary" })}
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--color-surface-subtle); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
            <div>
              <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">Annual Academic Tuition Fee</div>
              <div style="font-size: var(--text-small); color: var(--color-text-muted);">Receipt No: ${f.tuitionReceiptNo}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; color: var(--color-success);">${f.tuitionAmount}</div>
              ${renderBadge({ label: f.tuitionFeeStatus, variant: "success" })}
            </div>
          </div>

          ${f.examFeeStatus.includes("PAID") ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--color-surface-subtle); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
              <div>
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">Semester IV Examination Fee</div>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">Receipt No: REC-2026-88129 • Paid Online via UPI</div>
              </div>
              <div style="text-align: right; display: flex; align-items: center; gap: var(--space-2);">
                <div>
                  <div style="font-weight: bold; color: var(--color-success); font-size: var(--text-body);">₹ 2,400</div>
                  ${renderBadge({ label: "PAID IN FULL", variant: "success" })}
                </div>
                <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'success', title: 'Receipt Downloaded', message: 'E-Receipt REC-2026-88129 downloaded.' })">
                  ${getIcon("download", { size: 14 })} Receipt
                </button>
              </div>
            </div>
          ` : `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: #fffdfa; border: 1px solid var(--color-warning); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
              <div>
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body); color: var(--color-warning);">Semester IV Examination Fee</div>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">Due by: ${f.examDueDate}</div>
              </div>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <div style="font-weight: bold; font-size: var(--text-body);">${f.examFeeAmount}</div>
                <button class="btn btn--primary btn--sm" id="btn-pay-exam-fee">
                  Pay Online
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  }

  buildLibraryHtml() {
    const lib = studentData.studentServicesData.library;
    return `
      <div class="card" style="margin-bottom: var(--space-6);">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              ${getIcon("book-open", { size: 18 })}
              Borrowed Books & Digital Loans
            </h2>
            <div style="font-size: var(--text-small); color: var(--color-text-muted);">Card ID: ${lib.membershipId} • Fines: ${lib.overdueFines}</div>
          </div>
          ${renderBadge({ label: "2 of 4 Books Borrowed", variant: "primary" })}
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${lib.activeBorrowings.map(b => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
              <div>
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">${b.title}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${b.author}</div>
                <div style="font-size: var(--text-label); color: var(--color-text-muted); margin-top: 2px;">
                  Borrowed: ${b.borrowedDate} • <strong>Due Date: ${b.dueDate}</strong>
                </div>
              </div>
              ${b.renewable ? `
                <button class="btn btn--outline btn--sm renew-book-btn" data-title="${b.title}">
                  Renew (+14 Days)
                </button>
              ` : `
                <span class="badge badge--success">Renewed</span>
              `}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  buildTransportHtml() {
    const t = studentData.studentServicesData.transport;
    const contacts = studentData.studentServicesData.supportContacts;

    return `
      <div class="layout-grid-fees">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              ${getIcon("map-pin", { size: 18 })}
              Campus Transport & Bus Route
            </h2>
            ${renderBadge({ label: t.passStatus, variant: "success" })}
          </div>
          <div style="font-size: var(--text-small); display: flex; flex-direction: column; gap: var(--space-2);">
            <div><strong>Assigned Route:</strong> ${t.routeNumber}</div>
            <div><strong>Pickup Point:</strong> ${t.pickupStop}</div>
            <div><strong>Morning Departure:</strong> ${t.pickupTime}</div>
            <div><strong>Evening Return:</strong> ${t.returnTime}</div>
            <div><strong>Driver Contact:</strong> ${t.busDriverContact}</div>
            <div><strong>Pass Valid Through:</strong> ${t.validUntil}</div>
          </div>
          <div style="margin-top: var(--space-4);">
            <button class="btn btn--outline btn--sm" onclick="window.showToast({ type: 'info', title: 'Pass Status', message: 'Your transport pass is verified through Dec 2026.' })">
              Download Bus Pass Copy
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">
              ${getIcon("shield", { size: 18 })}
              Important Student Contacts
            </h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${contacts.map(c => `
              <div style="padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border); font-size: var(--text-small);">
                <div style="font-weight: var(--font-weight-semibold);">${c.role}</div>
                <div style="color: var(--color-text-secondary);">${c.name}</div>
                <div style="font-size: var(--text-meta); color: var(--color-primary); margin-top: 1px;">📞 ${c.phone} • ✉ ${c.email}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  attachServicesEvents() {
    // Apply for service online
    this.container.querySelectorAll(".request-service-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        modal.open({
          title: `Apply for ${title}`,
          bodyHtml: `
            <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--text-small); margin-bottom: var(--space-4);">
              <div><strong>Student Name:</strong> Rohan Sharma</div>
              <div><strong>USN:</strong> 1MS22CS084</div>
              <div><strong>Program:</strong> B.Tech CSE (Semester IV)</div>
            </div>
            <div class="form-group">
              <label class="form-label" for="service-purpose">Purpose of Application</label>
              <select class="form-select" id="service-purpose">
                <option value="internship">Summer Internship Application</option>
                <option value="passport">Passport / Visa Processing</option>
                <option value="scholarship">Higher Education / Scholarship</option>
                <option value="competition">Hackathon / Technical Fest</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="service-notes">Remarks / Specific Addressee (Optional)</label>
              <textarea class="form-textarea" id="service-notes" placeholder="Enter recipient details if any..."></textarea>
            </div>
          `,
          footerHtml: `
            <button class="btn btn--outline btn--md" onclick="window.appModal.close()">Cancel</button>
            <button class="btn btn--primary btn--md" id="submit-service-confirm">Submit Application</button>
          `
        });

        setTimeout(() => {
          const submitBtn = document.getElementById("submit-service-confirm");
          if (submitBtn) {
            submitBtn.addEventListener("click", () => {
              modal.close();
              toast.show({
                type: "success",
                title: "Application Submitted",
                message: `Request for "${title}" filed. Tracking ID #SR-2026-${Math.floor(1000 + Math.random() * 9000)}.`
              });
            });
          }
        }, 50);
      });
    });

    // Pay exam fee online
    const payExamFeeBtn = this.container.querySelector("#btn-pay-exam-fee");
    if (payExamFeeBtn) {
      payExamFeeBtn.addEventListener("click", () => {
        this.openFeePaymentModal();
      });
    }

    // Renew book
    this.container.querySelectorAll(".renew-book-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        const b = studentData.studentServicesData.library.activeBorrowings.find(x => x.title === title);
        if (b) {
          b.dueDate = "Oct 18, 2026";
          b.renewable = false;
        }
        toast.show({
          type: "success",
          title: "Book Loan Extended",
          message: `Loan for "${title}" extended by 14 days without penalty.`
        });
        this.renderServices("library");
      });
    });
  }

  openFeePaymentModal() {
    modal.open({
      title: "Online Fee Remittance Gateway",
      bodyHtml: `
        <div style="background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); font-size: var(--text-small); margin-bottom: var(--space-4);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Fee Head:</span>
            <strong>Semester IV Examination Fee</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Student USN:</span>
            <strong>1MS22CS084</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--text-body); color: var(--color-primary); font-weight: bold; padding-top: 4px; border-top: 1px solid var(--color-border);">
            <span>Total Payable:</span>
            <span>₹ 2,400.00</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Select Payment Method</label>
          <div style="display: flex; gap: var(--space-2); margin-top: 4px;">
            <label style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-primary); border-radius: var(--radius-md); text-align: center; cursor: pointer; background: var(--color-primary-subtle); font-size: var(--text-small);">
              <input type="radio" name="payment-method" checked style="margin-right: 4px;" /> UPI / QR
            </label>
            <label style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-align: center; cursor: pointer; font-size: var(--text-small);">
              <input type="radio" name="payment-method" style="margin-right: 4px;" /> NetBanking / Card
            </label>
          </div>
        </div>
      `,
      footerHtml: `
        <button class="btn btn--outline btn--md" onclick="window.appModal.close()">Cancel</button>
        <button class="btn btn--primary btn--md" id="confirm-payment-btn">Authorize ₹ 2,400</button>
      `
    });

    setTimeout(() => {
      const confirmBtn = document.getElementById("confirm-payment-btn");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          modal.close();
          studentData.studentServicesData.fees.examFeeStatus = "PAID IN FULL";
          studentData.priorities = studentData.priorities.filter(p => p.id !== "prio-1");
          studentData.deadlines = studentData.deadlines.filter(d => d.id !== "dl-1");
          toast.show({
            type: "success",
            title: "Payment Successful",
            message: "Fee Remittance Confirmed. Receipt #REC-2026-88129 saved to your profile."
          });
          if (this.router.currentRoute === "services") {
            this.renderServices("fees");
          } else {
            this.renderHome();
          }
        });
      }
    }, 50);
  }

  // ==========================================================================
  // VIEW: 8. PROFILE & SETTINGS (Customization & State Persistence)
  // ==========================================================================
  renderProfile() {
    const p = studentData.profile;
    const bookmarkedNotices = studentData.notices.filter(n => this.isBookmarked(n.id));

    this.container.innerHTML = `
      ${renderPageHeader({
        title: "Student Profile & Preferences",
        description: "Official student records, academic mentor details, notification preferences, and saved notices.",
        breadcrumbs: [
          { label: "Home", href: "#home" },
          { label: "Profile" }
        ]
      })}

      <div class="layout-grid-profile">
        <!-- Left: Digital ID & Bookmarks -->
        <div>
          <!-- Digital Student ID Card -->
          <div class="card" style="background: linear-gradient(135deg, #0f2042 0%, #162a56 100%); color: white; border-color: transparent; margin-bottom: var(--space-6);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
              <div>
                <div style="font-size: var(--text-label); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: #93c5fd;">Student Identity Card</div>
                <h2 style="color: white; font-size: var(--text-h1); margin-top: 4px;">${p.name}</h2>
                <div style="font-size: var(--text-body); color: #e2e8f0; font-family: var(--font-mono); font-weight: var(--font-weight-semibold);">USN: ${p.rollNumber}</div>
              </div>
              <div style="width: 50px; height: 50px; border-radius: var(--radius-full); background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-weight: var(--font-weight-bold); font-size: var(--text-h2);">
                RS
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); padding-top: var(--space-3); border-top: 1px solid rgba(255,255,255,0.2); font-size: var(--text-small);">
              <div>
                <div style="color: #93c5fd; font-size: var(--text-label);">Department</div>
                <div>${p.department}</div>
              </div>
              <div>
                <div style="color: #93c5fd; font-size: var(--text-label);">Academic Year & Sem</div>
                <div>${p.year} • ${p.semester}</div>
              </div>
              <div>
                <div style="color: #93c5fd; font-size: var(--text-label);">Cumulative CGPA</div>
                <div style="font-weight: var(--font-weight-bold); font-size: var(--text-body);">${p.cgpa}</div>
              </div>
              <div>
                <div style="color: #93c5fd; font-size: var(--text-label);">Credits Completed</div>
                <div style="font-weight: var(--font-weight-semibold);">${p.creditsEarned} Credits</div>
              </div>
            </div>
          </div>

          <!-- Saved / Bookmarked Circulars List -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                ${getIcon("bookmark", { size: 18 })}
                Saved Circulars & Notices (${bookmarkedNotices.length})
              </h3>
            </div>
            ${bookmarkedNotices.length === 0 ? `
              <p style="font-size: var(--text-small); color: var(--color-text-muted); text-align: center; padding: var(--space-4);">
                No notices currently saved. Tap the bookmark icon on any circular to store it here for offline access.
              </p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                ${bookmarkedNotices.map(bn => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); flex-wrap: wrap; gap: var(--space-2);">
                    <div>
                      <span class="badge ${bn.category === 'urgent' ? 'badge--danger' : 'badge--primary'}" style="font-size: 10px;">${bn.categoryLabel}</span>
                      <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small); margin: 2px 0;">
                        <a href="#notices/${bn.id}" style="color: var(--color-text-primary);">${bn.headline}</a>
                      </div>
                      <div style="font-size: var(--text-meta); color: var(--color-text-muted);">${bn.date} • ${bn.refNo}</div>
                    </div>
                    <div style="display: flex; gap: var(--space-2);">
                      <a href="#notices/${bn.id}" class="btn btn--outline btn--sm">View</a>
                      <button class="btn btn--ghost btn--sm remove-bookmark-btn" data-notice-id="${bn.id}">Remove</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            `}
          </div>
        </div>

        <!-- Right: Advisor, Settings, and Personalization -->
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          <!-- Advisor & Helpline -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                ${getIcon("shield", { size: 18 })}
                Academic Mentor & Emergency Desk
              </h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div>
                <div style="font-size: var(--text-label); color: var(--color-text-muted); font-weight: var(--font-weight-semibold);">FACULTY MENTOR / ADVISOR</div>
                <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-body); margin-top: 2px;">${p.advisor}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-secondary);">${p.advisorCabin} • ✉ ${p.advisorEmail}</div>
              </div>
              <div style="padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
                <div style="font-size: var(--text-label); color: var(--color-danger); font-weight: var(--font-weight-bold);">CAMPUS 24/7 EMERGENCY HELPLINE</div>
                <div style="font-size: var(--text-body); font-weight: var(--font-weight-semibold); margin-top: 2px;">${p.emergencyContact}</div>
                <div style="font-size: var(--text-small); color: var(--color-text-muted);">Security Desk & Resident Medical Room</div>
              </div>
            </div>
          </div>

          <!-- Notification Preferences & Hub Settings -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                ${getIcon("settings", { size: 18 })}
                Hub Customization & Settings
              </h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              <div class="form-group" style="margin-bottom: var(--space-2);">
                <label class="form-label" for="pref-branch">Academic Branch & Department</label>
                <select class="form-select" id="pref-branch">
                  <option value="CSE" ${(p.branchCode || 'CSE') === 'CSE' ? 'selected' : ''}>Computer Science & Engineering (CSE)</option>
                  <option value="ISE" ${(p.branchCode || 'CSE') === 'ISE' ? 'selected' : ''}>Information Science & Engineering (ISE)</option>
                  <option value="ECE" ${(p.branchCode || 'CSE') === 'ECE' ? 'selected' : ''}>Electronics & Communication Engineering (ECE)</option>
                  <option value="MECH" ${(p.branchCode || 'CSE') === 'MECH' ? 'selected' : ''}>Mechanical Engineering (MECH)</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: var(--space-2);">
                <label class="form-label" for="pref-year">Current Academic Year</label>
                <select class="form-select" id="pref-year">
                  <option value="1st Year" ${p.year === '1st Year' ? 'selected' : ''}>1st Year (Freshman)</option>
                  <option value="2nd Year" ${p.year === '2nd Year' ? 'selected' : ''}>2nd Year (Sophomore - Current)</option>
                  <option value="3rd Year" ${p.year === '3rd Year' ? 'selected' : ''}>3rd Year (Junior)</option>
                  <option value="4th Year" ${p.year === '4th Year' ? 'selected' : ''}>4th Year (Senior)</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: var(--space-2);">
                <label class="form-label" for="pref-section">Enrolled Semester & Section</label>
                <select class="form-select" id="pref-section">
                  <option value="Semester IV (Section B)" ${p.semester.includes('IV') && p.semester.includes('B') ? 'selected' : ''}>Semester IV - Section B (Current)</option>
                  <option value="Semester IV (Section A)" ${p.semester.includes('IV') && p.semester.includes('A') ? 'selected' : ''}>Semester IV - Section A</option>
                  <option value="Semester IV (Section C)" ${p.semester.includes('IV') && p.semester.includes('C') ? 'selected' : ''}>Semester IV - Section C</option>
                  <option value="Semester III (Section A)" ${p.semester.includes('III') ? 'selected' : ''}>Semester III - Section A</option>
                  <option value="Semester V (Section B)" ${p.semester.includes('V') ? 'selected' : ''}>Semester V - Section B</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: var(--space-2);">
                <label class="form-label" for="pref-landing">Default Landing Hub</label>
                <select class="form-select" id="pref-landing">
                  <option value="home" ${p.preferences.defaultLanding === 'home' ? 'selected' : ''}>Dashboard (Home)</option>
                  <option value="notices" ${p.preferences.defaultLanding === 'notices' ? 'selected' : ''}>Notices Hub</option>
                  <option value="academics" ${p.preferences.defaultLanding === 'academics' ? 'selected' : ''}>Class Timetable (Academics)</option>
                  <option value="exams" ${p.preferences.defaultLanding === 'exams' ? 'selected' : ''}>Exams & Results</option>
                </select>
              </div>

              <div style="font-weight: var(--font-weight-semibold); font-size: var(--text-small); margin-top: var(--space-2); margin-bottom: 2px;">
                Alert Notification Channels
              </div>
              <label style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); cursor: pointer;">
                <span>Urgent Weather & Campus Closure SMS</span>
                <input type="checkbox" id="pref-sms" ${p.preferences.urgentSms ? 'checked' : ''} />
              </label>
              <label style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); cursor: pointer;">
                <span>Exam Schedule & Results Email Alerts</span>
                <input type="checkbox" id="pref-exams" ${p.preferences.examAlerts ? 'checked' : ''} />
              </label>
              <label style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); cursor: pointer;">
                <span>Daily Academic Digest Email</span>
                <input type="checkbox" id="pref-digest" ${p.preferences.emailDigest ? 'checked' : ''} />
              </label>
              <label style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-small); cursor: pointer;">
                <span>Club & Campus Life Announcements</span>
                <input type="checkbox" id="pref-clubs" ${p.preferences.clubUpdates ? 'checked' : ''} />
              </label>
            </div>

            <div style="margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
              <button class="btn btn--primary btn--sm" id="btn-save-prefs" style="width: 100%;">
                Save Settings & Preferences
              </button>
              <button class="btn btn--ghost btn--sm" id="btn-reset-demo" style="width: 100%; color: var(--color-text-muted);">
                Reset Demo Data State
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove bookmark handler
    this.container.querySelectorAll(".remove-bookmark-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-notice-id");
        this.toggleBookmark(id);
        this.renderProfile();
      });
    });

    // Save preferences
    const savePrefsBtn = this.container.querySelector("#btn-save-prefs");
    if (savePrefsBtn) {
      savePrefsBtn.addEventListener("click", () => {
        const branchCode = this.container.querySelector("#pref-branch")?.value || "CSE";
        const branchMap = {
          CSE: { name: "B.Tech Computer Science & Engineering", dept: "Department of Computer Science & Engineering" },
          ISE: { name: "B.Tech Information Science & Engineering", dept: "Department of Information Science & Engineering" },
          ECE: { name: "B.Tech Electronics & Communication Engineering", dept: "Department of Electronics & Communication" },
          MECH: { name: "B.Tech Mechanical Engineering", dept: "Department of Mechanical Engineering" }
        };
        const year = this.container.querySelector("#pref-year")?.value || "2nd Year";
        const section = this.container.querySelector("#pref-section")?.value || "Semester IV (Section B)";
        const landing = this.container.querySelector("#pref-landing")?.value || "home";

        savePersistedPreferences({
          year,
          program: branchMap[branchCode].name,
          department: branchMap[branchCode].dept,
          branchCode,
          semester: section,
          preferences: {
            defaultLanding: landing,
            urgentSms: this.container.querySelector("#pref-sms")?.checked ?? true,
            examAlerts: this.container.querySelector("#pref-exams")?.checked ?? true,
            emailDigest: this.container.querySelector("#pref-digest")?.checked ?? true,
            clubUpdates: this.container.querySelector("#pref-clubs")?.checked ?? false
          }
        });

        toast.show({
          type: "success",
          title: "Preferences Saved",
          message: "Profile preferences saved and synchronized across all hubs."
        });

        this.renderProfile();
      });
    }

    // Reset demo state
    const resetDemoBtn = this.container.querySelector("#btn-reset-demo");
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        localStorage.clear();
        this.bookmarks = ["not-01"];
        this.readNoticeIds = ["not-03", "not-04", "not-05", "not-06"];
        toast.show({
          type: "info",
          title: "Demo State Reset",
          message: "All bookmarks and filters restored to default."
        });
        setTimeout(() => window.location.reload(), 300);
      });
    }
  }
}

// Instantiate application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new StudentHubApp();
});
