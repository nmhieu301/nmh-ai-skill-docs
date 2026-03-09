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

    // ============================================
    // SKILL BUILDER
    // ============================================
    const skillEditor = document.getElementById('skillEditor');
    const skillResults = document.getElementById('skillResults');
    const skillCheck = document.getElementById('skillCheck');
    const skillCopy = document.getElementById('skillCopy');
    const skillDownload = document.getElementById('skillDownload');
    const tplBtns = document.querySelectorAll('.skill-builder__tpl-btn');

    // -- Templates --
    const templates = {
        standalone: `---
name: my-skill-name
description: "Mô tả ngắn gọn skill làm gì"
risk: low
source: personal
date_added: "${new Date().toISOString().split('T')[0]}"
---

# Tên Skill
Mô tả vai trò và mục đích chính của skill.

## Khi nào kích hoạt
- User yêu cầu [hành động cụ thể]
- Ngữ cảnh: [mô tả tình huống]

## Quy trình thực hiện
1. Xác nhận yêu cầu từ user
2. [Bước thực hiện chính]
3. [Bước kiểm tra / validation]
4. Trả kết quả cho user

## Convention
- [Quy tắc 1]
- [Quy tắc 2]

## Ví dụ đầu ra
[Mô tả hoặc demo mẫu output]`,

        workflow: `---
name: my-workflow-skill
description: "Skill tự động hóa workflow nhiều bước"
risk: medium
source: internal
date_added: "${new Date().toISOString().split('T')[0]}"
---

# Workflow Automation Skill
Skill thực hiện quy trình tự động gồm nhiều bước tuần tự.

## Khi nào kích hoạt
- User yêu cầu [quy trình]
- Khi phát hiện [điều kiện trigger]

## Input
- [Mô tả đầu vào bắt buộc]
- [Mô tả đầu vào tùy chọn]

## Quy trình thực hiện
1. **Bước 1 — Phân tích:** Thu thập và xác nhận yêu cầu
2. **Bước 2 — Chuẩn bị:** Tạo cấu trúc / setup cần thiết
3. **Bước 3 — Thực thi:** Thực hiện logic chính
4. **Bước 4 — Kiểm tra:** Validate output
5. **Bước 5 — Hoàn tất:** Trả kết quả và dọn dẹp

## Xử lý lỗi
- Nếu bước 2 thất bại: [fallback]
- Nếu bước 3 thất bại: [fallback]

## Output
- [Mô tả đầu ra mong muốn]`,

        blank: ''
    };

    // Load standalone template by default
    skillEditor.value = templates.standalone;

    // Template buttons
    tplBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tplBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            skillEditor.value = templates[btn.dataset.template];
            skillResults.innerHTML = '<div class="skill-builder__placeholder">Nhấn <strong>🔍 Kiểm tra format</strong> để xem kết quả.</div>';
        });
    });

    // Tab key support in editor
    skillEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = skillEditor.selectionStart;
            const end = skillEditor.selectionEnd;
            skillEditor.value = skillEditor.value.substring(0, start) + '  ' + skillEditor.value.substring(end);
            skillEditor.selectionStart = skillEditor.selectionEnd = start + 2;
        }
    });

    // -- Format Validation --
    skillCheck.addEventListener('click', () => {
        const content = skillEditor.value.trim();
        const results = [];
        let score = 0;
        const total = 10;

        if (!content) {
            skillResults.innerHTML = '<div class="skill-builder__placeholder">⚠️ Editor đang trống. Hãy viết nội dung hoặc chọn template.</div>';
            return;
        }

        // 1. Check frontmatter exists (--- ... ---)
        const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (fmMatch) {
            results.push({ pass: true, text: 'Frontmatter YAML (--- ... ---) được phát hiện' });
            score++;
        } else {
            results.push({ pass: false, text: 'Thiếu frontmatter — cần bắt đầu bằng --- và kết thúc bằng ---' });
        }

        const fm = fmMatch ? fmMatch[1] : '';

        // 2. Check name field
        const nameMatch = fm.match(/^name:\s*(.+)$/m);
        if (nameMatch) {
            const name = nameMatch[1].trim();
            results.push({ pass: true, text: `Có trường <strong>name</strong>: ${name}` });
            score++;

            // 3. Check kebab-case
            if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
                results.push({ pass: true, text: 'Tên skill đúng format <strong>kebab-case</strong>' });
                score++;
            } else {
                results.push({ pass: false, text: 'Tên skill chưa đúng <strong>kebab-case</strong> — nên dùng chữ thường, nối bằng dấu gạch (vd: my-skill-name)' });
            }
        } else {
            results.push({ pass: false, text: 'Thiếu trường <strong>name</strong> trong frontmatter' });
            results.push({ pass: false, text: 'Không thể kiểm tra kebab-case (chưa có name)' });
        }

        // 4. Check description
        if (/^description:\s*.+$/m.test(fm)) {
            results.push({ pass: true, text: 'Có trường <strong>description</strong>' });
            score++;
        } else {
            results.push({ pass: false, text: 'Thiếu trường <strong>description</strong> — cần mô tả ngắn gọn về skill' });
        }

        // 5. Check risk field
        if (/^risk:\s*(low|medium|high)/m.test(fm)) {
            results.push({ pass: true, text: 'Có trường <strong>risk</strong> hợp lệ' });
            score++;
        } else {
            results.push({ pass: false, text: 'Thiếu hoặc sai trường <strong>risk</strong> — nên là low, medium hoặc high' });
        }

        // 6. Check main heading (# ...)
        const bodyContent = fmMatch ? content.slice(fmMatch[0].length) : content;
        if (/^#\s+.+$/m.test(bodyContent)) {
            results.push({ pass: true, text: 'Có heading chính (<strong># Tiêu đề</strong>)' });
            score++;
        } else {
            results.push({ pass: false, text: 'Thiếu heading chính — nên có ít nhất 1 dòng bắt đầu bằng <strong>#</strong>' });
        }

        // 7. Check sub-headings (## ...)
        const subHeadings = bodyContent.match(/^##\s+.+$/gm);
        if (subHeadings && subHeadings.length >= 2) {
            results.push({ pass: true, text: `Có <strong>${subHeadings.length}</strong> sub-heading (## ...)` });
            score++;
        } else {
            results.push({ pass: false, text: 'Nên có ít nhất 2 sub-heading (<strong>##</strong>) để chia nhỏ nội dung' });
        }

        // 8. Check có section "Khi nào kích hoạt" hoặc trigger
        if (/kích hoạt|trigger|when to/i.test(bodyContent)) {
            results.push({ pass: true, text: 'Có mô tả <strong>trigger / kích hoạt</strong>' });
            score++;
        } else {
            results.push({ pass: false, text: 'Nên có phần mô tả <strong>khi nào kích hoạt</strong> skill' });
        }

        // 9. Check có quy trình / steps
        if (/quy trình|bước|step|1\.\s/i.test(bodyContent)) {
            results.push({ pass: true, text: 'Có mô tả <strong>quy trình / các bước</strong>' });
            score++;
        } else {
            results.push({ pass: false, text: 'Nên có phần <strong>quy trình thực hiện</strong> theo từng bước' });
        }

        // 10. Check content length
        if (content.length >= 200) {
            results.push({ pass: true, text: `Nội dung đủ chi tiết (<strong>${content.length}</strong> ký tự)` });
            score++;
        } else {
            results.push({ pass: false, text: `Nội dung hơi ngắn (<strong>${content.length}</strong> ký tự) — nên >= 200 ký tự` });
        }

        // Render results
        let html = results.map(r =>
            `<div class="skill-check-item skill-check-item--${r.pass ? 'pass' : 'fail'}">
                <span class="skill-check-icon">${r.pass ? '✅' : '❌'}</span>
                <span>${r.text}</span>
            </div>`
        ).join('');

        // Score
        const pct = Math.round((score / total) * 100);
        const cls = pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad';
        html += `<div class="skill-check-score skill-check-score--${cls}">${score}/${total} — ${pct}% hoàn thiện</div>`;

        skillResults.innerHTML = html;
    });

    // -- Copy --
    skillCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(skillEditor.value).then(() => {
            skillCopy.textContent = '✅ Copied!';
            setTimeout(() => { skillCopy.textContent = '📋 Copy'; }, 2000);
        });
    });

    // -- Download --
    skillDownload.addEventListener('click', () => {
        const blob = new Blob([skillEditor.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SKILL.md';
        a.click();
        URL.revokeObjectURL(url);
    });
});
