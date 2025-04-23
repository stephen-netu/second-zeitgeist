/**
 * Timeline.js - A simple timeline visualization for the Letter of Values
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if timeline container exists
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) return;

  // Function to create a timeline from changelog data
  function createTimeline(data) {
    // Clear container
    timelineContainer.innerHTML = '';
    
    // Create timeline header
    const header = document.createElement('h2');
    header.textContent = 'Evolution Timeline';
    timelineContainer.appendChild(header);
    
    // Create timeline visualization
    const timeline = document.createElement('div');
    timeline.className = 'timeline-visualization';
    
    // Create timeline line
    const timelineLine = document.createElement('div');
    timelineLine.className = 'timeline-line';
    timeline.appendChild(timelineLine);
    
    // Add timeline events
    data.forEach((item, index) => {
      const event = document.createElement('div');
      event.className = 'timeline-event';
      event.style.left = `${(index / (data.length - 1)) * 100}%`;
      
      const eventDot = document.createElement('div');
      eventDot.className = 'timeline-dot';
      
      const eventLabel = document.createElement('div');
      eventLabel.className = 'timeline-label';
      eventLabel.innerHTML = `
        <span class="timeline-date">${item.date}</span>
        <span class="timeline-title">${item.title}</span>
      `;
      
      event.appendChild(eventDot);
      event.appendChild(eventLabel);
      timeline.appendChild(event);
      
      // Add tooltip with description
      const tooltip = document.createElement('div');
      tooltip.className = 'timeline-tooltip';
      tooltip.textContent = item.description;
      event.appendChild(tooltip);
      
      // Show/hide tooltip on hover
      event.addEventListener('mouseenter', () => {
        tooltip.classList.add('visible');
      });
      
      event.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
    
    timelineContainer.appendChild(timeline);
  }
  
  // Load changelog data
  function loadChangelogData() {
    // Get data from the page (already loaded from Jekyll data)
    const changelogItems = document.querySelectorAll('.changelog-item');
    const data = [];
    
    changelogItems.forEach(item => {
      const date = item.querySelector('.change-date').textContent;
      const title = item.querySelector('h3').textContent;
      const description = item.querySelector('p').textContent;
      
      data.push({
        date,
        title,
        description
      });
    });
    
    return data;
  }
  
  // Initialize timeline
  const changelogData = loadChangelogData();
  if (changelogData.length > 0) {
    createTimeline(changelogData);
    
    // Add timeline styles if not already added
    if (!document.getElementById('timeline-styles')) {
      const styles = document.createElement('style');
      styles.id = 'timeline-styles';
      styles.textContent = `
        .timeline-visualization {
          position: relative;
          height: 200px;
          margin: 60px 0;
        }
        .timeline-line {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #eaecef;
          transform: translateY(-50%);
        }
        .timeline-event {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
        .timeline-dot {
          width: 16px;
          height: 16px;
          background-color: #0366d6;
          border-radius: 50%;
          margin: 0 auto;
        }
        .timeline-label {
          position: absolute;
          width: 120px;
          text-align: center;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.9rem;
        }
        .timeline-date {
          display: block;
          font-weight: 600;
          color: #24292e;
        }
        .timeline-title {
          display: block;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .timeline-event:nth-child(odd) .timeline-label {
          top: 30px;
        }
        .timeline-event:nth-child(even) .timeline-label {
          bottom: 30px;
        }
        .timeline-tooltip {
          position: absolute;
          background-color: #fff;
          border: 1px solid #eaecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 10px;
          border-radius: 4px;
          width: 200px;
          z-index: 10;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          font-size: 0.85rem;
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
        }
        .timeline-tooltip.visible {
          opacity: 1;
          visibility: visible;
        }
        @media (max-width: 768px) {
          .timeline-visualization {
            height: 300px;
          }
          .timeline-event:nth-child(n) .timeline-label {
            top: 30px;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }
}); 