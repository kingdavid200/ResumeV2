/*
 * script.js
 *
 * This file is responsible for dynamically populating the resume
 * template with data sourced from the data.json file. It also
 * implements interactive features such as the dark mode toggle,
 * animated skill bars, project detail modals and a contact form
 * that submits messages to a simple Java backend.
 */

// Immediately invoked function to avoid polluting the global scope
(function () {
  /**
   * Initialise the page once the DOM has loaded. Fetches the JSON data
   * and calls subsequent functions to build each section.
   */
  async function init() {
    applySavedTheme();
    attachThemeToggle();
    attachMenuToggle();
    let data;
    try {
      // Attempt to fetch the JSON from the same directory. When running from
      // the file protocol this may fail due to browser restrictions.
      const response = await fetch('data.json?v=2');
      if (!response.ok) throw new Error('Failed to load data.json');
      data = await response.json();
    } catch (err) {
      console.warn('Falling back to embedded resume data', err);
      data = fallbackData();
    }
    try {
      populateBasicInfo(data);
      buildSkills(data.skills);
      buildExperience(data.experience);
      buildEducation(data.education);
      buildCertifications(data.certifications);
      buildTraining(data.training, data.workshops);
      buildProjects(data.projects);
      buildCareerGoals(data.careerGoals);
      buildSocials(data.socials);
      setupSkillAnimations();
    } catch (err) {
      console.error('Error building resume sections', err);
    }
    attachContactHandler();
    attachModalHandlers();
  }

  /**
   * Fallback résumé data in case fetching data.json fails (e.g., when
   * opening the site via the file:// protocol). This data mirrors
   * the contents of data.json.
   * @returns {Object} The résumé JSON object
   */
  function fallbackData() {
    return {
      name: "HARRIS DAVID CHUKWUEBUKA",
      headline: "Computer Science Graduate • Technology Enthusiast • Cyber Security Master's Student",
      location: "Newport - Gwent, NP19 4AN United Kingdom",
      phone: "+44 7502 246881",
      email: "davidharris200111@gmail.com",
      website: "https://github.com/kingdavid200",
      summary:
        "I am a driven and enthusiastic Computer Science graduate looking for an opportunity to contribute my expertise in software development, IT services, and analytical thinking. I have a genuine passion for technology and a strong desire to gain real-world experience in a dynamic work setting. Known for being a reliable team player with solid leadership abilities, adaptability, and a forward-thinking mindset. I bring hands-on experience in delivering quality technical support and effectively troubleshooting to maintain smooth IT operations. Resourceful in identifying and resolving both hardware and software problems efficiently. I am skilled in clear communication, especially when translating technical ideas into user-friendly explanations.",
      experience: [
        {
          title: "Data Analyst",
          company: "Digital Echoes",
          location: "London, UK",
          startDate: "June 2025",
          endDate: "Present",
          details: [
            "Analyzed datasets from Google Analytics and Excel to identify trends in sessions, users, and acquisition channels.",
            "Created reusable Power BI templates and Excel visuals for consistent reporting and dashboard updates.",
            "Assisted in data formatting, testing, and integration across tools to ensure clean transitions and clear outputs.",
            "Managed data access and supported peers in troubleshooting data display and metric calculation issues.",
            "Reviewed performance metrics and built tracking for KPIs like session growth and country distribution.",
            "Produced structured reports that guided insights on resource placement and performance trends."
          ],
        },
        {
          title: "IT Technical Analyst",
          company: "Adventus IT Services (Philippines) Inc.",
          location: "Makati, Metro Manila, Philippines",
          startDate: "June 2024",
          endDate: "December 2025",
          details: [
            "Provided first-level technical support and resolved hardware, software, and network-related issues to minimize system downtime.",
            "Conducted system diagnostics and assisted in implementing solutions aligned with organizational IT standards.",
            "Collaborated with software developers to test applications, document bugs, and verify feature enhancements.",
            "Analyzed user requirements and contributed to system upgrades and process improvements.",
            "Created and maintained technical documentation, including system specifications and configuration guides.",
            "Participated in IT projects by gathering data, supporting deployments, and conducting post-implementation reviews.",
            "Assisted with the configuration and management of mobile and remote-access solutions to support a hybrid workforce.",
            "Supported IT asset management through inventory tracking and usage reporting."
          ],
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          school: "Arellano University",
          location: "Legarda, Philippines",
          year: "2025",
          details: "Dissertation in Software Development",
        },
        {
          degree: "Senior High School",
          school: "Kings Senior High School",
          location: "Nigeria",
          year: "2017",
          details: "",
        },
        {
          degree: "Junior High School",
          school: "Kings Junior High School",
          location: "Nigeria",
          year: "2014",
          details: "",
        },
        {
          degree: "Primary Education",
          school: "Kings Elementary School",
          location: "Nigeria",
          year: "2011",
          details: "",
        },
      ],
      skills: [
        { name: "Java", level: 85 },
        { name: "C, C++, C#", level: 80 },
        { name: "Python", level: 75 },
        { name: "Web Development (HTML, CSS, JavaScript)", level: 90 },
        { name: "Data Analysis", level: 80 },
        { name: "MySQL", level: 70 },
        { name: "IT Troubleshooting", level: 85 },
        { name: "Leadership & Teamwork", level: 80 },
        { name: "Critical Thinking", level: 85 },
        { name: "MS Office", level: 90 },
      ],
      certifications: [
        {
          title: "Certified in CC Domain 1: Security Principles",
          issuer: "(ISC)²",
          validity: "Jan 10 2025 – Jan 10 2028",
        },
        {
          title:
            "Certified in CC Domain 2: Incident Response, Business Continuity, and Disaster Recovery Concepts",
          issuer: "(ISC)²",
          validity: "Jan 11 2025 – Jan 11 2028",
        },
        {
          title: "Certified in CC Domain 3: Access Control Concepts",
          issuer: "(ISC)²",
          validity: "Jan 11 2025 – Jan 11 2028",
        },
        {
          title: "Certified in CC Domain 4: Network Security",
          issuer: "(ISC)²",
          validity: "Jan 12 2025 – Jan 12 2028",
        },
      ],
      training: [
        {
          title: "Data Analyst – Advance Careers UK",
          date: "April 2025",
          topics: [
            "Data preprocessing",
            "Descriptive statistics",
            "Regression analysis",
            "Data visualization using charts and PivotTables",
            "Excel functions like SUMIF, filtering, and conditional formatting",
            "Introduction to machine learning techniques",
            "Real-world applications in pharmaceutical and business data",
          ],
          projects: [
            "Sales performance analysis using Excel",
            "Predictive modeling using linear regression on pharmaceutical data",
            "Dashboard creation for summarizing large datasets",
          ],
        },
      ],
      workshops: [
        { title: "Techtutor 2021: The New Digital Life", date: "2021-10-16" },
        { title: "Techtutor 2021: The New Digital Life", date: "2021-10-23" },
        {
          title: "How to Level Up: Mastering Tech Skills for Future Innovators",
          date: "2024-01-12",
        },
        {
          title: "Innovating with Intelligence: AI Ethics and Big Data Transparency",
          date: "2024-03-20",
        },
      ],
      projects: [
        {
          title: "File Management System",
          description:
            "A structured system for organizing, storing, and retrieving digital files efficiently.",
          technologies: ["Java", "Python", "SQL"],
        },
        {
          title: "Document Tracking System",
          description:
            "A system designed to monitor, manage, and track the movement and status of documents within an organization.",
          technologies: ["PHP", "MySQL", "JavaScript"],
        },
        {
          title: "Smart Destination Alert System",
          description:
            "A mobile-based application that provides real-time alerts to commuters when approaching their designated stop, enhancing travel convenience.",
          technologies: ["Android", "Java", "GPS"],
        },
        {
          title: "Ticket Management System",
          description:
            "A system for handling and tracking support tickets, service requests, or customer issues in an organized manner.",
          technologies: ["Java", "Spring Boot", "MySQL"],
        },
        {
          title: "Arduino Line Tracking Robot Car",
          description:
            "A robotics project utilizing Arduino to build an autonomous car that follows a predefined path using sensors.",
          technologies: ["Arduino", "C++"],
        },
        {
          title: "PC Build",
          description:
            "A custom-built computer project optimized for performance, gaming, or professional work, tailored to specific needs.",
          technologies: ["Hardware", "PC Building"],
        },
        {
          title: "HTML and PHP-based Websites",
          description:
            "Dynamic and interactive websites developed using HTML for structure and PHP for backend functionality.",
          technologies: ["HTML", "PHP", "CSS", "JavaScript"],
        },
      ],
      careerGoals: [
        "Gain hands-on experience in software, mobile, and web development while enhancing problem-solving and analytical skills.",
        "Develop expertise in AI, machine learning, and emerging technologies to contribute to innovative tech solutions.",
      ],
      socials: [
        // Use emoji icons for social links to avoid dependency on external icon fonts
        { platform: 'GitHub', url: 'https://github.com/kingdavid200', icon: '🐱' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/david-harris', icon: '💼' },
        { platform: 'Twitter', url: 'https://twitter.com/kingdavid200', icon: '🐦' },
      ],
    };
  }

  /**
   * Apply the saved theme preference from localStorage on initial load.
   */
  function applySavedTheme() {
    const saved = localStorage.getItem('theme');
    const root = document.documentElement;
    const toggles = document.querySelectorAll('#darkModeToggle, #sidebarDarkToggle');
    if (saved === 'dark') {
      root.setAttribute('data-theme', 'dark');
      // Update the button text to a sun emoji when dark mode is active
      toggles.forEach((t) => (t.textContent = '☀️'));
    } else {
      root.removeAttribute('data-theme');
      // Update the button text to a moon emoji when light mode is active
      toggles.forEach((t) => (t.textContent = '🌙'));
    }
  }

  /**
   * Attach click listener to the dark mode toggle button.
   */
  function attachThemeToggle() {
    // Attach click listeners to all elements that toggle dark mode (e.g., sidebar and optional top toggle)
    const toggles = document.querySelectorAll('#darkModeToggle, #sidebarDarkToggle');
    toggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const root = document.documentElement;
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
          // Switch to light mode
          root.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          toggles.forEach((t) => (t.textContent = '🌙'));
        } else {
          // Switch to dark mode
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          toggles.forEach((t) => (t.textContent = '☀️'));
        }
      });
    });
  }

  /**
   * Attach handler for the sidebar menu toggle to open/close the navigation on small screens.
   */
  function attachMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  /**
   * Populate hero and summary sections with basic information.
   * @param {Object} data Parsed resume data
   */
  function populateBasicInfo(data) {
    // Update the sidebar title with a concise name (first and last name)
    const sidebarTitleEl = document.getElementById('sidebarTitle');
    if (sidebarTitleEl) {
      const parts = data.name.split(' ');
      // Use second and first parts to display "First Last" if possible
      if (parts.length >= 2) {
        sidebarTitleEl.textContent = `${parts[1]} ${parts[0]}`;
      } else {
        sidebarTitleEl.textContent = data.name;
      }
    }
    // Legacy site title element (in case present)
    const siteTitleEl = document.getElementById('siteTitle');
    if (siteTitleEl) {
      const parts = data.name.split(' ');
      if (parts.length >= 2) {
        siteTitleEl.textContent = `${parts[1]} ${parts[0]}`;
      } else {
        siteTitleEl.textContent = data.name;
      }
    }
    document.getElementById('heroName').textContent = data.name;
    document.getElementById('heroHeadline').textContent = data.headline;
    document.title = `${data.name} – Résumé`;
    // Summary
    document.getElementById('summaryText').textContent = data.summary;
    // Contact info (populate hero-contact)
    const heroContactEl = document.getElementById('heroContact');
    if (heroContactEl) {
      heroContactEl.innerHTML = '';
      // Address with emoji
      const addrSpan = document.createElement('span');
      addrSpan.textContent = `📍 ${data.location}`;
      heroContactEl.appendChild(addrSpan);
      // Phone with emoji
      const phoneSpan = document.createElement('span');
      phoneSpan.textContent = `📞 ${data.phone}`;
      heroContactEl.appendChild(phoneSpan);
      // Email with emoji
      const emailLink = document.createElement('a');
      emailLink.href = `mailto:${data.email}`;
      emailLink.textContent = `✉️ ${data.email}`;
      heroContactEl.appendChild(emailLink);
      // Website with emoji (strip protocol for neatness)
      const websiteLink = document.createElement('a');
      websiteLink.href = data.website;
      const stripped = data.website.replace(/^https?:\/\//i, '');
      websiteLink.textContent = `🌐 ${stripped}`;
      websiteLink.target = '_blank';
      heroContactEl.appendChild(websiteLink);
    }
  }

  /**
   * Build the skills section with animated progress bars.
   * @param {Array} skills List of skill objects
   */
  function buildSkills(skills) {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';
    // Map skill names to FontAwesome icon classes. Feel free to extend this map.
    const iconMap = {
      // Map each skill to an emoji. Using emojis avoids reliance on external icon fonts.
      Java: '☕',
      'C, C++, C#': '💻',
      Python: '🐍',
      'Web Development (HTML, CSS, JavaScript)': '🌐',
      'Data Analysis': '📈',
      MySQL: '🗄️',
      'IT Troubleshooting': '🛠️',
      'Leadership & Teamwork': '🤝',
      'Critical Thinking': '🧠',
      'MS Office': '📄',
    };
    skills.forEach((skill) => {
      const card = document.createElement('div');
      card.className = 'skill';
      card.dataset.level = skill.level;
      // Icon and name wrapper
      const header = document.createElement('div');
      header.className = 'skill-header';
      const iconEl = document.createElement('span');
      // Use the emoji from the map, or fall back to a generic symbol
      iconEl.textContent = iconMap[skill.name] || '⭐';
      const name = document.createElement('span');
      name.className = 'skill-name';
      name.textContent = skill.name;
      header.appendChild(iconEl);
      header.appendChild(name);
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-bar-fill';
      bar.appendChild(fill);
      card.appendChild(header);
      card.appendChild(bar);
      container.appendChild(card);
    });
  }

  /**
   * Build the professional experience timeline.
   * @param {Array} experience List of experience objects
   */
  function buildExperience(experience) {
    const timeline = document.getElementById('experienceTimeline');
    timeline.innerHTML = '';
    experience.forEach((exp) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      // dot
      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      item.appendChild(dot);
      // content
      const content = document.createElement('div');
      content.className = 'timeline-content';
      const heading = document.createElement('h3');
      heading.textContent = `${exp.title} – ${exp.company}`;
      const time = document.createElement('div');
      time.className = 'time';
      time.textContent = `${exp.startDate} – ${exp.endDate}`;
      const location = document.createElement('div');
      location.className = 'location';
      location.textContent = exp.location;
      // bullet list
      const list = document.createElement('ul');
      exp.details.forEach((d) => {
        const li = document.createElement('li');
        li.textContent = d;
        list.appendChild(li);
      });
      content.appendChild(heading);
      content.appendChild(time);
      content.appendChild(location);
      content.appendChild(list);
      item.appendChild(content);
      timeline.appendChild(item);
    });
  }

  /**
   * Build the education list.
   * @param {Array} education List of education objects
   */
  function buildEducation(education) {
    const list = document.getElementById('educationList');
    list.innerHTML = '';
    education.forEach((edu) => {
      const li = document.createElement('li');
      li.className = 'education-item';
      const title = document.createElement('h4');
      title.textContent = `${edu.degree}`;
      const info = document.createElement('p');
      info.textContent = `${edu.school}, ${edu.location} (${edu.year})`;
      li.appendChild(title);
      li.appendChild(info);
      if (edu.details) {
        const details = document.createElement('p');
        details.textContent = edu.details;
        li.appendChild(details);
      }
      list.appendChild(li);
    });
  }

  /**
   * Build the certifications list.
   * @param {Array} certifications List of certification objects
   */
  function buildCertifications(certifications) {
    const list = document.getElementById('certificationsList');
    list.innerHTML = '';
    certifications.forEach((cert) => {
      const li = document.createElement('li');
      li.className = 'certification-item';
      const title = document.createElement('p');
      title.innerHTML = `<strong>${cert.title}</strong> – ${cert.issuer}`;
      const validity = document.createElement('p');
      validity.textContent = `Validity: ${cert.validity}`;
      li.appendChild(title);
      li.appendChild(validity);
      list.appendChild(li);
    });
  }

  /**
   * Build training and workshop section.
   * @param {Array} training List of training courses
   * @param {Array} workshops List of workshops
   */
  function buildTraining(training, workshops) {
    const container = document.getElementById('trainingList');
    container.innerHTML = '';
    training.forEach((course) => {
      const item = document.createElement('div');
      item.className = 'training-item';
      const header = document.createElement('h4');
      header.textContent = `${course.title} (${course.date})`;
      item.appendChild(header);
      if (course.topics && course.topics.length) {
        const topicsTitle = document.createElement('p');
        topicsTitle.innerHTML = '<strong>Topics covered:</strong>';
        item.appendChild(topicsTitle);
        const topicsList = document.createElement('ul');
        course.topics.forEach((t) => {
          const li = document.createElement('li');
          li.textContent = t;
          topicsList.appendChild(li);
        });
        item.appendChild(topicsList);
      }
      if (course.projects && course.projects.length) {
        const projTitle = document.createElement('p');
        projTitle.innerHTML = '<strong>Projects:</strong>';
        item.appendChild(projTitle);
        const projList = document.createElement('ul');
        course.projects.forEach((p) => {
          const li = document.createElement('li');
          li.textContent = p;
          projList.appendChild(li);
        });
        item.appendChild(projList);
      }
      container.appendChild(item);
    });
    // Workshops
    if (workshops && workshops.length) {
      const item = document.createElement('div');
      item.className = 'training-item';
      const header = document.createElement('h4');
      header.textContent = 'Workshops Attended';
      item.appendChild(header);
      const list = document.createElement('ul');
      workshops.forEach((w) => {
        const li = document.createElement('li');
        li.textContent = `${w.title} (${w.date})`;
        list.appendChild(li);
      });
      item.appendChild(list);
      container.appendChild(item);
    }
  }

  /**
   * Build the projects grid and attach click events for modal display.
   * @param {Array} projects List of project objects
   */
  function buildProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    // Store projects globally for modal access
    window._projects = projects;
    projects.forEach((project, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.dataset.index = idx;
      const title = document.createElement('h3');
      title.textContent = project.title;
      const desc = document.createElement('p');
      // Shorten long descriptions for card view
      const truncated = project.description.length > 100 ? project.description.slice(0, 97) + '…' : project.description;
      desc.textContent = truncated;
      card.appendChild(title);
      card.appendChild(desc);
      card.addEventListener('click', () => openProjectModal(idx));
      grid.appendChild(card);
    });
  }

  /**
   * Build the career goals list.
   * @param {Array} goals List of goal strings
   */
  function buildCareerGoals(goals) {
    const list = document.getElementById('goalsList');
    list.innerHTML = '';
    goals.forEach((g) => {
      const li = document.createElement('li');
      li.className = 'goal-item';
      li.textContent = g;
      list.appendChild(li);
    });
  }

  /**
   * Build the socials section using FontAwesome icons.
   * @param {Array} socials List of social profiles
   */
  function buildSocials(socials) {
    const container = document.getElementById('socialIcons');
    if (!container) return;
    container.innerHTML = '';
    socials.forEach((social) => {
      const a = document.createElement('a');
      a.href = social.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-link';
      // Use a span for the icon and set its text to the provided emoji or symbol
      const iconSpan = document.createElement('span');
      iconSpan.textContent = social.icon || '🔗';
      a.appendChild(iconSpan);
      container.appendChild(a);
    });
  }

  /**
   * Set up IntersectionObserver to animate skill bars when they become visible.
   */
  function setupSkillAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const level = card.dataset.level;
            const fill = card.querySelector('.progress-bar-fill');
            if (fill) {
              fill.style.width = level + '%';
            }
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.skill').forEach((card) => observer.observe(card));
  }

  /**
   * Attach the submit handler for the contact form.
   */
  function attachContactHandler() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.color = '';
      status.textContent = '';
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
      };
      // Client-side validation
      const errors = [];
      // Name: letters and spaces only, maximum 15 characters
      if (!/^[a-zA-Z\s]{1,15}$/.test(formData.name)) {
        errors.push('Name must contain only letters and spaces (max 15 characters).');
      }
      // Email: must end with @gmail.com and have a basic structure
      const emailPattern = /^[^\s@]+@gmail\.com$/;
      if (!emailPattern.test(formData.email)) {
        errors.push('Please enter a valid @gmail.com email address.');
      }
      // Subject: no angle brackets and reasonable length
      if (/[<>]/.test(formData.subject) || formData.subject.length > 100) {
        errors.push('Subject cannot contain HTML characters and must be under 100 characters.');
      }
      // Message: no angle brackets and reasonable length
      if (/[<>]/.test(formData.message) || formData.message.length > 1000) {
        errors.push('Message cannot contain HTML characters and must be under 1000 characters.');
      }
      if (errors.length > 0) {
        status.textContent = errors.join(' ');
        status.style.color = 'red';
        return;
      }
      // Sanitize subject and message by stripping angle brackets
      formData.subject = formData.subject.replace(/[<>]/g, '');
      formData.message = formData.message.replace(/[<>]/g, '');
      status.textContent = 'Sending...';
      try {
        const res = await fetch('api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok || result.status !== 'success') {
          throw new Error(result.message || 'Failed to send message');
        }
        status.style.color = 'green';
        status.textContent = 'Your message has been sent! Thank you.';
        form.reset();
      } catch (err) {
        console.error(err);
        status.style.color = 'red';
        status.textContent = 'Failed to send message. Please try again later.';
      }
    });
  }

  /**
   * Attach modal close handlers to allow closing when user clicks outside or on the close button.
   */
  function attachModalHandlers() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalClose');
    if (!modal || !closeBtn) return;
    closeBtn.addEventListener('click', closeProjectModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });
  }

  /**
   * Open the project modal for a given project index.
   * @param {number} idx Index in the projects array
   */
  function openProjectModal(idx) {
    const modal = document.getElementById('projectModal');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDescription');
    const techEl = document.getElementById('modalTechnologies');
    if (!modal) return;
    const project = (window._projects || [])[idx];
    if (!project) return;
    titleEl.textContent = project.title;
    descEl.textContent = project.description;
    techEl.textContent = project.technologies.join(', ');
    modal.style.display = 'flex';
    // lock body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the project detail modal.
   */
  function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Kick off initialisation after DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})();
