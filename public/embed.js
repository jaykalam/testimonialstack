/**
 * TestimonialStack Embed Widget
 * Embeddable testimonials and social proof widgets
 */
(function () {
  'use strict'

  const WIDGET_CLASS = 'testimonialstack-widget'
  const APP_URL = (function () {
    // Find script tag and extract src URL
    const scripts = document.querySelectorAll('script[src*="embed.js"]')
    if (scripts.length > 0) {
      const url = new URL(scripts[0].src)
      return url.origin
    }
    return 'http://localhost:3000'
  })()

  const CACHE = new Map()
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Render widget based on layout type
   */
  function renderWidget(container, widget, testimonials) {
    const settings = widget.settings || {}
    const layout = widget.layout || 'grid'

    const containerStyle = {
      fontFamily: settings.fontFamily || 'system-ui, -apple-system, sans-serif',
      color: settings.textColor || '#1f2937',
      backgroundColor: settings.backgroundColor || '#ffffff',
      borderRadius: settings.borderRadius ? settings.borderRadius + 'px' : '8px',
      padding: '16px',
      margin: '0',
    }

    let html = ''

    switch (layout) {
      case 'grid':
        html = renderGridLayout(testimonials, settings)
        break
      case 'carousel':
        html = renderCarouselLayout(testimonials, settings)
        break
      case 'spotlight':
        html = renderSpotlightLayout(testimonials, settings)
        break
      case 'wall':
        html = renderWallLayout(testimonials, settings)
        break
      case 'badge':
        html = renderBadgeLayout(testimonials, settings)
        break
      default:
        html = renderGridLayout(testimonials, settings)
    }

    // Apply container styles
    Object.assign(container.style, containerStyle)

    // Create wrapper with scoped styles
    const wrapper = document.createElement('div')
    wrapper.className = `${WIDGET_CLASS} ${WIDGET_CLASS}--${widget.id}`
    wrapper.innerHTML = getWidgetStyles(widget.id, settings) + html

    container.innerHTML = ''
    container.appendChild(wrapper)

    // Add click tracking
    wrapper.addEventListener('click', function () {
      trackEvent(widget.id, 'click')
    })
  }

  /**
   * Grid layout - 3 column responsive grid
   */
  function renderGridLayout(testimonials, settings) {
    const maxTestimonials = settings.maxTestimonials || 10
    const items = testimonials.slice(0, maxTestimonials)

    let html = '<div class="testimonialstack-grid">'

    items.forEach((testimonial) => {
      html += renderTestimonialCard(testimonial, settings)
    })

    html += '</div>'

    if (settings.showBranding) {
      html +=
        '<div class="testimonialstack-branding">Powered by TestimonialStack</div>'
    }

    return html
  }

  /**
   * Carousel layout - single testimonial with indicator
   */
  function renderCarouselLayout(testimonials, settings) {
    if (testimonials.length === 0) return '<p>No testimonials available</p>'

    const testimonial = testimonials[0]
    let html = '<div class="testimonialstack-carousel">'
    html += renderTestimonialCard(testimonial, settings, true)

    if (testimonials.length > 1) {
      html += `<p class="testimonialstack-carousel-indicator">${testimonials.length} testimonials available</p>`
    }

    html += '</div>'

    if (settings.showBranding) {
      html +=
        '<div class="testimonialstack-branding">Powered by TestimonialStack</div>'
    }

    return html
  }

  /**
   * Spotlight layout - single featured testimonial
   */
  function renderSpotlightLayout(testimonials, settings) {
    if (testimonials.length === 0) return '<p>No testimonials available</p>'

    const testimonial = testimonials[0]
    let html = '<div class="testimonialstack-spotlight">'
    html += renderTestimonialCard(testimonial, settings, true)
    html += '</div>'

    if (settings.showBranding) {
      html +=
        '<div class="testimonialstack-branding">Powered by TestimonialStack</div>'
    }

    return html
  }

  /**
   * Wall of Love layout - compact grid
   */
  function renderWallLayout(testimonials, settings) {
    const maxTestimonials = settings.maxTestimonials || 10
    const items = testimonials.slice(0, maxTestimonials)

    let html = '<div class="testimonialstack-wall">'

    items.forEach((testimonial) => {
      const bgColor = settings.accentColor || '#3b82f6'
      const bgColorWithAlpha = hexToRgba(bgColor, 0.1)

      html += `
        <div class="testimonialstack-wall-item" style="background-color: ${bgColorWithAlpha}; border-left: 3px solid ${bgColor};">
          <p class="testimonialstack-wall-author">${escapeHtml(testimonial.author_name)}</p>
          <p class="testimonialstack-wall-content">${escapeHtml(testimonial.content.substring(0, 100))}</p>
        </div>
      `
    })

    html += '</div>'

    if (settings.showBranding) {
      html +=
        '<div class="testimonialstack-branding">Powered by TestimonialStack</div>'
    }

    return html
  }

  /**
   * Badge layout - compact single testimonial
   */
  function renderBadgeLayout(testimonials, settings) {
    if (testimonials.length === 0) return ''

    const testimonial = testimonials[0]
    let html = '<div class="testimonialstack-badge">'

    if (settings.showAvatar) {
      const initial = testimonial.author_name[0].toUpperCase()
      const bgColor = settings.accentColor || '#3b82f6'
      html += `
        <div class="testimonialstack-badge-avatar" style="background-color: ${bgColor};">
          ${initial}
        </div>
      `
    }

    html += '<div class="testimonialstack-badge-content">'
    html += `<p class="testimonialstack-badge-author">${escapeHtml(testimonial.author_name)}</p>`

    if (settings.showRating && testimonial.rating) {
      html += `<div class="testimonialstack-rating">${renderStars(testimonial.rating, settings.accentColor)}</div>`
    }

    html += `<p class="testimonialstack-badge-text">${escapeHtml(testimonial.content.substring(0, 80))}</p>`
    html += '</div></div>'

    return html
  }

  /**
   * Render individual testimonial card
   */
  function renderTestimonialCard(testimonial, settings, largeSizes = false) {
    const borderColor = settings.accentColor || '#3b82f6'
    const sizeClass = largeSizes ? '-large' : ''

    let html = `<div class="testimonialstack-card${sizeClass}" style="border-color: ${borderColor}; background-color: ${settings.backgroundColor || '#ffffff'}">`

    // Avatar and author info
    if (settings.showAvatar) {
      const initial = testimonial.author_name[0].toUpperCase()
      const bgColor = settings.accentColor || '#3b82f6'
      const sizeStyle = largeSizes
        ? 'width: 48px; height: 48px; font-size: 20px;'
        : 'width: 40px; height: 40px; font-size: 14px;'

      html += `
        <div class="testimonialstack-avatar" style="${sizeStyle} background-color: ${bgColor};">
          ${initial}
        </div>
      `

      html += '<div class="testimonialstack-author-info">'
      html += `<p class="testimonialstack-author-name">${escapeHtml(testimonial.author_name)}</p>`

      if (settings.showCompany && testimonial.author_company) {
        html += `<p class="testimonialstack-author-company">${escapeHtml(testimonial.author_company)}</p>`
      }

      html += '</div>'
    }

    // Rating
    if (settings.showRating && testimonial.rating) {
      html += `<div class="testimonialstack-rating">${renderStars(testimonial.rating, settings.accentColor)}</div>`
    }

    // Content
    html += `<p class="testimonialstack-content">${escapeHtml(testimonial.content)}</p>`

    // Date
    if (settings.showDate && testimonial.created_at) {
      const date = new Date(testimonial.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      html += `<p class="testimonialstack-date">${date}</p>`
    }

    html += '</div>'

    return html
  }

  /**
   * Render star rating
   */
  function renderStars(rating, accentColor) {
    const color = accentColor || '#3b82f6'
    let stars = ''
    for (let i = 1; i <= 5; i++) {
      const fill = i <= rating ? color : '#ccc'
      stars += `<span style="color: ${fill}; margin-right: 2px;">★</span>`
    }
    return stars
  }

  /**
   * Get scoped CSS for widget
   */
  function getWidgetStyles(widgetId, settings) {
    const borderRadius = settings.borderRadius || 8
    const accentColor = settings.accentColor || '#3b82f6'

    return `
    <style>
      .${WIDGET_CLASS}--${widgetId} {
        font-family: ${settings.fontFamily || 'system-ui, -apple-system, sans-serif'};
        color: ${settings.textColor || '#1f2937'};
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
        width: 100%;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-card {
        border: 1px solid ${accentColor};
        border-radius: ${borderRadius}px;
        padding: 16px;
        background-color: ${settings.backgroundColor || '#ffffff'};
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-card-large {
        border: 1px solid ${accentColor};
        border-radius: ${borderRadius}px;
        padding: 24px;
        background-color: ${settings.backgroundColor || '#ffffff'};
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-avatar {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        margin-right: 12px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-author-info {
        min-width: 0;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-author-name {
        font-weight: 600;
        font-size: 14px;
        margin: 0;
        line-height: 1.4;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-author-company {
        font-size: 12px;
        opacity: 0.7;
        margin: 0;
        line-height: 1.4;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-content {
        font-size: 14px;
        line-height: 1.6;
        margin: 12px 0 0;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-date {
        font-size: 12px;
        opacity: 0.5;
        margin: 8px 0 0;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-rating {
        margin: 8px 0;
        font-size: 14px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-carousel {
        max-width: 600px;
        margin: 0 auto;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-carousel-indicator {
        text-align: center;
        font-size: 12px;
        opacity: 0.7;
        margin-top: 12px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-spotlight {
        max-width: 600px;
        margin: 0 auto;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-wall {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-wall-item {
        padding: 12px;
        border-radius: 4px;
        font-size: 12px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-wall-author {
        font-weight: 600;
        margin: 0 0 4px;
        font-size: 12px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-wall-content {
        margin: 0;
        font-size: 11px;
        opacity: 0.8;
        line-height: 1.4;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-badge {
        border: 1px solid ${accentColor};
        border-radius: ${borderRadius}px;
        padding: 12px;
        background-color: ${settings.backgroundColor || '#ffffff'};
        display: inline-block;
        max-width: 300px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-badge-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-badge-content {
        font-size: 12px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-badge-author {
        font-weight: 600;
        margin: 0 0 4px;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-badge-text {
        margin: 4px 0 0;
        line-height: 1.4;
      }

      .${WIDGET_CLASS}--${widgetId} .testimonialstack-branding {
        text-align: center;
        font-size: 11px;
        opacity: 0.5;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding-top: 8px;
        margin-top: 8px;
      }
    </style>
    `
  }

  /**
   * Fetch and cache widget data
   */
  async function fetchWidget(widgetId) {
    const cacheKey = `widget-${widgetId}`
    const cached = CACHE.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    try {
      const response = await fetch(`${APP_URL}/api/widgets/${widgetId}/render`)

      if (!response.ok) {
        console.error(`Failed to fetch widget: ${response.status}`)
        return null
      }

      const data = await response.json()

      CACHE.set(cacheKey, {
        data: data,
        timestamp: Date.now(),
      })

      return data
    } catch (error) {
      console.error('Error fetching widget:', error)
      return null
    }
  }

  /**
   * Track user events
   */
  function trackEvent(widgetId, event) {
    // Fire and forget
    try {
      fetch(`${APP_URL}/api/widgets/${widgetId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: event,
        }),
      }).catch(() => {
        // Silently ignore tracking errors
      })
    } catch {
      // Silently ignore
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    if (!text) return ''
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return String(text).replace(/[&<>"']/g, (char) => map[char])
  }

  /**
   * Convert hex color to rgba
   */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /**
   * Initialize widgets on page load
   */
  async function init() {
    const containers = document.querySelectorAll('[id^="testimonialstack-widget-"]')

    if (containers.length === 0) return

    for (const container of containers) {
      const match = container.id.match(/testimonialstack-widget-(.+)/)
      if (!match) continue

      const widgetId = match[1]

      try {
        const data = await fetchWidget(widgetId)

        if (!data || !data.widget) {
          container.innerHTML = '<p style="opacity: 0.5; font-size: 12px;">Widget not found</p>'
          continue
        }

        renderWidget(container, data.widget, data.testimonials || [])
      } catch (error) {
        console.error(`Error loading widget ${widgetId}:`, error)
        container.innerHTML = ''
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Support dynamic widget insertion
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const added = Array.from(mutation.addedNodes)
          for (const node of added) {
            if (
              node.nodeType === 1 &&
              node.id &&
              node.id.startsWith('testimonialstack-widget-')
            ) {
              init()
              break
            }
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})()
