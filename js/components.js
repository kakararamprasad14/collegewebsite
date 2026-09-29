/**
 * Reusable Component Rendering Utilities
 * Student-First College Digital Hub
 */

import { getIcon } from "./icons.js";

// ============================================================================
// Toast Notification Manager
// ============================================================================
class ToastSystem {
  constructor() {
    this.container = document.querySelector(".toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      this.container.setAttribute("aria-live", "polite");
      document.body.appendChild(this.container);
    }
  }

  show({ type = "info", title = "", message = "", duration = 4000 }) {
    const iconName = type === "success" ? "check" :
                     type === "warning" ? "alert-triangle" :
                     type === "danger"  ? "alert-circle" : "info";

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "status");

    toast.innerHTML = `
      <div style="color: var(--color-${type}); flex-shrink: 0; margin-top: 1px;">
        ${getIcon(iconName, { size: 18 })}
      </div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ""}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">
        ${getIcon("x", { size: 16 })}
      </button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    const dismiss = () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      setTimeout(() => toast.remove(), 150);
    };

    closeBtn.addEventListener("click", dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    this.container.appendChild(toast);
  }
}

export const toast = new ToastSystem();
window.showToast = (opts) => toast.show(opts);

// ============================================================================
// Modal Manager
// ============================================================================
class ModalSystem {
  constructor() {
    this.backdrop = document.getElementById("app-modal");
    if (!this.backdrop) {
      this.backdrop = document.createElement("div");
      this.backdrop.id = "app-modal";
      this.backdrop.className = "modal-backdrop";
      this.backdrop.setAttribute("role", "dialog");
      this.backdrop.setAttribute("aria-modal", "true");
      this.backdrop.setAttribute("aria-hidden", "true");
      this.backdrop.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="card-title" id="modal-dialog-title">Modal Title</h2>
            <button class="btn-icon" id="modal-dialog-close" aria-label="Close dialog">
              ${getIcon("x", { size: 20 })}
            </button>
          </div>
          <div class="modal-body" id="modal-dialog-body"></div>
          <div class="modal-footer" id="modal-dialog-footer"></div>
        </div>
      `;
      document.body.appendChild(this.backdrop);
    }

    this.bindEvents();
  }

  bindEvents() {
    const closeBtn = this.backdrop.querySelector("#modal-dialog-close");
    closeBtn.addEventListener("click", () => this.close());
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) this.close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.backdrop.classList.contains("open")) {
        this.close();
      }
    });
  }

  open({ title, bodyHtml, footerHtml = "" }) {
    const titleEl = this.backdrop.querySelector("#modal-dialog-title");
    const bodyEl = this.backdrop.querySelector("#modal-dialog-body");
    const footerEl = this.backdrop.querySelector("#modal-dialog-footer");

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = footerHtml;

    this.backdrop.classList.add("open");
    this.backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.backdrop.classList.remove("open");
    this.backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

export const modal = new ModalSystem();
window.appModal = modal;

// ============================================================================
// Functional Component Renderers
// ============================================================================

export function renderBreadcrumbs(items = []) {
  if (!items.length) return "";
  return `
    <nav class="breadcrumbs" aria-label="Breadcrumb hierarchy">
      ${items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        if (isLast) {
          return `<span class="breadcrumb-item breadcrumb-current" aria-current="page">${item.label}</span>`;
        }
        return `
          <span class="breadcrumb-item">
            <a href="${item.href || '#'}">${item.label}</a>
          </span>
          <span class="breadcrumb-separator" aria-hidden="true">
            ${getIcon("chevron-right", { size: 14 })}
          </span>
        `;
      }).join("")}
    </nav>
  `;
}

export function renderPageHeader({ title, description = "", breadcrumbs = [], actionsHtml = "" }) {
  return `
    <header class="page-header">
      ${renderBreadcrumbs(breadcrumbs)}
      <div class="page-header-top">
        <div>
          <h1 class="page-header-title">${title}</h1>
          ${description ? `<p class="page-header-desc">${description}</p>` : ""}
        </div>
        ${actionsHtml ? `<div class="page-header-actions">${actionsHtml}</div>` : ""}
      </div>
    </header>
  `;
}

export function renderBadge({ label, variant = "neutral", dot = false }) {
  return `
    <span class="badge badge--${variant}">
      ${dot ? `<span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>` : ""}
      ${label}
    </span>
  `;
}

export function renderStatusIndicator({ label, status = "active", pulse = false }) {
  const pulseClass = pulse ? "status-indicator--pulse" : "";
  return `
    <span class="status-indicator status-indicator--${status} ${pulseClass}">
      <span class="status-dot"></span>
      <span>${label}</span>
    </span>
  `;
}

export function renderEmptyState({ icon = "info", title, description, actionText = "", actionId = "" }) {
  return `
    <div class="empty-state" role="status">
      <div class="empty-state-icon">
        ${getIcon(icon, { size: 28 })}
      </div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-desc">${description}</p>
      ${actionText ? `
        <button class="btn btn--primary btn--md" id="${actionId}">
          ${actionText}
        </button>
      ` : ""}
    </div>
  `;
}

export function renderSkeletonCard() {
  return `
    <div class="card" aria-hidden="true">
      <div class="skeleton skeleton-text" style="width: 35%;"></div>
      <div class="skeleton skeleton-text" style="width: 80%; height: 20px; margin: 12px 0;"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
    </div>
  `;
}
