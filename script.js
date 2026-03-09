/* ============================================
   NMH Documentation — Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Dark Mode Toggle ----
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('nmh-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('nmh-theme', next);
        themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });

    // ---- Mobile Menu Toggle ----
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // ---- Active Section Highlight (Sidebar + Header Nav) ----
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const headerLinks = document.querySelectorAll('.header__nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    function updateActiveSection() {
        const scrollY = window.scrollY + 120;
        let currentId = '';

        sections.forEach(section => {
            if (section.offsetTop <= scrollY) {
                currentId = section.getAttribute('id');
            }
        });

        [sidebarLinks, headerLinks, mobileLinks].forEach(linkGroup => {
            linkGroup.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ---- Section Reveal Animation ----
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Accordion Toggle ----
    document.querySelectorAll('.accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            item.classList.toggle('open');
        });
    });

    // ---- Sidebar Toggle ----
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const savedSidebar = localStorage.getItem('nmh-sidebar');
    if (savedSidebar === 'collapsed') {
        sidebar.classList.add('collapsed');
        sidebarToggle.textContent = '»';
        sidebarToggle.title = 'Hiện mục lục';
    }
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebarToggle.textContent = isCollapsed ? '»' : '«';
        sidebarToggle.title = isCollapsed ? 'Hiện mục lục' : 'Ẩn mục lục';
        localStorage.setItem('nmh-sidebar', isCollapsed ? 'collapsed' : 'expanded');
    });

    // ---- Throttled Scroll Handler ----
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ---- Code Block Copy Buttons ----
    document.querySelectorAll('.code-block').forEach(block => {
        const header = block.querySelector('.code-block__header');
        const body = block.querySelector('.code-block__body');
        if (!header || !body) return;

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = '📋 Copy';
        header.appendChild(btn);

        btn.addEventListener('click', () => {
            const text = body.textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✅ Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // Initial calls
    updateScrollProgress();
    updateActiveSection();
});
