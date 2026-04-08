document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Toggle (Mobile)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // 2. Tab/View Switcher Logic
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    window.switchView = function (viewId) {
        // Update Menu Active State
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewId) item.classList.add('active');
        });

        // Show Content Section
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `view-${viewId}`) sec.classList.add('active');
        });

        // Update Header Title
        if (pageTitle) {
            const titleMap = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'history': 'History',
                'requests': 'Requests'
            };
            pageTitle.textContent = titleMap[viewId] || 'Dashboard';
        }

        // Close mobile sidebar
        if (window.innerWidth < 992 && sidebar) {
            sidebar.classList.remove('open');
        }
    };

    // Attach Click Events to Sidebar
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) switchView(view);
        });
    });
});
