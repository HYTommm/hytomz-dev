// 自动生成目录函数
function generateTOC() {
    const sidebar = document.querySelector('.sidebar ul');
    const headings = Array.from(document.querySelectorAll('.main h1, .main h2, .main h3'));

    // 清空现有目录
    sidebar.innerHTML = '';

    // 为每个标题生成目录项
    // 用于构建多级目录的栈
    // 新的多级目录生成逻辑，保证每个父项都拥有自己的子 ul
    const stack = [{level: 0, ul: sidebar}];
    headings.forEach(heading => {
        //const heading = headings[i];
        if (!heading.id) {
            heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        }
        
        
        const li = document.createElement('li'); // 创建目录项
        // 创建盒子
        const box = document.createElement('div');
        //box.style.paddingLeft = `${(heading.tagName === 'H2'? 20 : 40) + stack[stack.length - 1].level * 20}px`;
        
        const a = document.createElement('a'); // 创建链接
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;

        //const ul = document.createElement('ul'); // 创建子目录项 ul

        // 获取标题级别
        const tag = heading.tagName;
        let level = 1;
        if (tag === 'H1') level = 1;
        else if (tag === 'H2') level = 2;
        else if (tag === 'H3') level = 3;
        else if (tag === 'H4') level = 4;

        // 弹出栈直到找到合适的父级
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        //打印栈信息
        console.log(stack);
        
        // // 根据标题级别添加缩进类
        // if (heading.tagName === 'H1') {
        //     li.style.paddingLeft = '20px';
        // } else if (heading.tagName === 'H2') {
        //     li.style.paddingLeft = '40px';
        // } else if (heading.tagName === 'H3') {
        //     li.style.paddingLeft = '60px';
        // }
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.getElementById(heading.id);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                setTimeout(() => {
                    highlightTOCItem(heading.id);
                }, 50);
            } else {
                console.error('无法找到目标元素:', targetId);
            }
        });
        
        let childUl = null;
        let toggleBtn = null;
        if (level <= 3) {
            
            li.classList.add('parent-item');
            // 创建子目录项 ul
            childUl = document.createElement('ul');
            childUl.style.display = 'block';
            toggleBtn = document.createElement('span');
                toggleBtn.className = 'toggle-btn';
                toggleBtn.textContent = '-';
                toggleBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const parentLi = event.target.parentElement.parentElement;
                    const wasExpanded = parentLi.classList.contains('expanded');
                    parentLi.classList.toggle('expanded');
                    event.target.textContent = wasExpanded ? '+' : '-';
                    const childUl = parentLi.querySelector('ul');
                    if (childUl) {
                        childUl.style.display = wasExpanded ? 'none' : 'block';
                    }
                });
            if (level <= 2) {
                
                box.appendChild(toggleBtn);
                
            }
            box.appendChild(a);
            li.appendChild(box);
            li.appendChild(childUl);
            //sidebar.appendChild(li);
        } else {
            box.appendChild(a);
            li.appendChild(box);
            sidebar.appendChild(li);
        }
        
        // 插入到当前栈顶ul
        stack[stack.length - 1].ul.appendChild(li);
        console.log("toggleBtn.position: " + toggleBtn.position);
        // 如果有子ul，入栈
        if (childUl) {
            stack.push({level, ul: childUl});
        }
    });

    // 监听滚动事件，高亮当前可见的标题对应的目录项
    window.addEventListener('scroll', highlightActiveTOCItem);
    highlightActiveTOCItem(); // 初始高亮
}

// 高亮当前可见的标题对应的目录项
function highlightActiveTOCItem() {
    const headings = document.querySelectorAll('.main h1, .main h2, .main h3');
    const scrollPosition = window.scrollY + 80; // 考虑导航栏高度

    let currentActive = null;
    let minDistance = Infinity;

    // 找到距离视口顶部最近的标题
    headings.forEach(heading => {
        const headingTop = heading.offsetTop;
        const headingHeight = heading.offsetHeight;
        const distance = Math.abs(scrollPosition - headingTop);

        // 如果标题在视口中或距离最近
        if ((scrollPosition >= headingTop - 30 &&
            scrollPosition < headingTop + headingHeight - 30) ||
            distance < minDistance) {
            currentActive = heading.id;
            minDistance = distance;
        }
    });

    // 更新目录项高亮状态
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActive}`) {
            link.classList.add('active');
        }
    });
}

// 指定目录项进行高亮
function highlightTOCItem(id) {
    const link = document.querySelector(`.sidebar a[href="#${id}"]`);
    document.querySelectorAll('.sidebar a').forEach(l => {
        l.classList.remove('active');
    });
    if (link) {
        link.classList.add('active');
    }
}

// 导出函数以便其他文件可以使用
export { generateTOC, highlightActiveTOCItem, highlightTOCItem };
