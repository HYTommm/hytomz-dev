// 侧边栏滚动高亮
(function() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const links = sidebar.querySelectorAll('a');
    if (!links.length) return;

    // 收集所有标题
    const headings = Array.from(document.querySelectorAll('.main h2, .main h3, .main h4'))
        .filter(h => h.id);

    function updateActiveTOC() {
        const scrollPos = window.scrollY + 100;
        let activeId = null;

        // 找到最接近当前滚动位置的标题
        for (let i = headings.length - 1; i >= 0; i--) {
            if (headings[i].offsetTop <= scrollPos) {
                activeId = headings[i].id;
                break;
            }
        }

        if (!activeId && headings.length > 0) {
            activeId = headings[0].id;
        }

        // 更新高亮
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }

    // 用 requestAnimationFrame 做节流
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveTOC();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateActiveTOC();
})();
