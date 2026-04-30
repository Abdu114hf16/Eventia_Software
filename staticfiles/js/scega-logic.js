/**
 * SCEGA DASHBOARD LOGIC
 * Zero localStorage usage. All data rendered server-side by Django.
 * Actions (approve/reject) POST to Django and reload the page.
 */

(function () {
    let currentRejectionId = null;

    // --- View Switching ---
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    }
    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    }

    window.switchView = function (viewId) {
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewId) item.classList.add('active');
        });
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === 'view-' + viewId) sec.classList.add('active');
        });
        const titles = { 'overview': 'Admin Dashboard', 'history': 'Approval History' };
        if (pageTitle) pageTitle.textContent = titles[viewId] || 'Admin Dashboard';
        if (window.innerWidth < 992) closeSidebar();
    };

    sidebarItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            var view = item.dataset.view;
            if (view) switchView(view);
        });
    });

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
    }
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // --- History Filter ---
    var filterButtons = document.querySelectorAll('.history-filter-btn');
    filterButtons.forEach(function (btn) {
        btn.style.background = btn.classList.contains('active') ? '#004e92' : '#f0f0f0';
        btn.style.color = btn.classList.contains('active') ? 'white' : '#666';

        btn.addEventListener('click', function () {
            filterButtons.forEach(function (b) {
                b.classList.remove('active');
                b.style.background = '#f0f0f0';
                b.style.color = '#666';
            });
            btn.classList.add('active');
            btn.style.background = '#004e92';
            btn.style.color = 'white';

            var filter = btn.dataset.filter;
            document.querySelectorAll('.history-card').forEach(function (card) {
                card.style.display = (filter === 'all' || card.dataset.status === filter) ? 'flex' : 'none';
            });
        });
    });

    // --- Actions: Approve / Reject via Django POST ---
    function postAction(eventId, action, reason) {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = window.location.pathname;

        var csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = 'csrfmiddlewaretoken';
        csrf.value = window.CSRF_TOKEN;
        form.appendChild(csrf);

        var idField = document.createElement('input');
        idField.type = 'hidden';
        idField.name = 'event_id';
        idField.value = eventId;
        form.appendChild(idField);

        var actionField = document.createElement('input');
        actionField.type = 'hidden';
        actionField.name = 'action';
        actionField.value = action;
        form.appendChild(actionField);

        if (reason) {
            var reasonField = document.createElement('input');
            reasonField.type = 'hidden';
            reasonField.name = 'rejection_reason';
            reasonField.value = reason;
            form.appendChild(reasonField);
        }

        document.body.appendChild(form);
        form.submit();
    }

    window.approveEvent = function (id) {
        if (confirm('Are you sure you want to approve this event?')) {
            postAction(id, 'approve');
        }
    };

    // --- Rejection Modal ---
    window.openRejectionModal = function (id) {
        currentRejectionId = id;
        var modal = document.getElementById('rejection-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('rejection-reason').value = '';
        }
    };

    window.closeRejectionModal = function () {
        currentRejectionId = null;
        var modal = document.getElementById('rejection-modal');
        if (modal) modal.style.display = 'none';
    };

    window.confirmRejection = function () {
        if (!currentRejectionId) return;
        var reason = document.getElementById('rejection-reason').value;
        postAction(currentRejectionId, 'reject', reason);
    };

    // --- View Event Details Modal ---
    window.viewEventDetails = function (id) {
        var evt = (window.SCEGA_EVENTS || {})[String(id)];
        if (!evt) return;

        var existing = document.getElementById('scega-detail-modal');
        if (existing) existing.remove();

        var sarIcon = '<img src="' + (window.STATIC_URL || '/static/') + 'assets/sar_symbol.svg" class="sar-icon" alt="SAR" style="height:1em;vertical-align:middle;">';
        var priceDisplay = evt.price && parseFloat(evt.price) > 0
            ? evt.price + ' ' + sarIcon
            : 'Free Event';

        var modal = document.createElement('div');
        modal.id = 'scega-detail-modal';
        modal.innerHTML =
            '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(3px);" onclick="if(event.target===this)this.parentElement.remove()">' +
            '<div style="background:white;border-radius:16px;width:90%;max-width:520px;max-height:85vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
            '<div style="background:linear-gradient(135deg,#3C50C8,#004e92);color:white;padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;">' +
            '<h2 style="margin:0;font-size:1.2rem;font-weight:600;"><i class="fa-solid fa-file-lines" style="margin-right:8px;"></i>Event Review</h2>' +
            '<button onclick="document.getElementById(\'scega-detail-modal\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>' +
            '<div style="padding:1.5rem;max-height:55vh;overflow-y:auto;">' +
            '<div style="margin-bottom:1.25rem;"><h3 style="margin:0 0 8px 0;font-size:1.4rem;color:#222;">' + evt.title + '</h3>' +
            '<span style="display:inline-block;background:#e8f0fe;color:#1a73e8;padding:4px 12px;border-radius:16px;font-size:0.8rem;font-weight:500;">' + evt.category + '</span></div>' +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:1.25rem;">' +
            '<div style="text-align:center;padding:12px;background:#f8f9fa;border-radius:10px;"><i class="fa-regular fa-calendar" style="color:#5f6368;font-size:1.25rem;"></i><div style="font-size:0.7rem;color:#5f6368;margin-top:4px;">DATE</div><div style="font-weight:600;font-size:0.85rem;">' + evt.date + '</div></div>' +
            '<div style="text-align:center;padding:12px;background:#f8f9fa;border-radius:10px;"><i class="fa-regular fa-clock" style="color:#5f6368;font-size:1.25rem;"></i><div style="font-size:0.7rem;color:#5f6368;margin-top:4px;">TIME</div><div style="font-weight:600;font-size:0.85rem;">' + evt.time + '</div></div>' +
            '<div style="text-align:center;padding:12px;background:#f8f9fa;border-radius:10px;"><i class="fa-solid fa-location-dot" style="color:#5f6368;font-size:1.25rem;"></i><div style="font-size:0.7rem;color:#5f6368;margin-top:4px;">LOCATION</div><div style="font-weight:600;font-size:0.75rem;word-break:break-word;">' + evt.location + '</div></div>' +
            '</div>' +
            '<div style="margin-bottom:1.25rem;"><div style="font-size:0.75rem;color:#5f6368;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Description</div><div style="background:#f8f9fa;padding:12px;border-radius:8px;font-size:0.9rem;line-height:1.5;color:#333;">' + evt.description + '</div></div>' +
            '<div><div style="font-size:0.75rem;color:#5f6368;text-transform:uppercase;font-weight:600;margin-bottom:6px;">Pricing</div><div style="background:#f8f9fa;padding:12px;border-radius:8px;font-size:1.1rem;font-weight:600;color:#1976d2;">' + priceDisplay + '</div></div>' +
            '</div>' +
            '<div style="padding:1rem 1.5rem;background:#f8f9fa;border-top:1px solid #e0e0e0;display:flex;gap:12px;">' +
            '<button onclick="document.getElementById(\'scega-detail-modal\').remove();approveEvent(' + evt.id + ')" style="flex:1;padding:12px;background:#2e7d32;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.9rem;"><i class="fa-solid fa-check" style="margin-right:6px;"></i>Approve</button>' +
            '<button onclick="document.getElementById(\'scega-detail-modal\').remove();openRejectionModal(' + evt.id + ')" style="flex:1;padding:12px;background:#c62828;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.9rem;"><i class="fa-solid fa-xmark" style="margin-right:6px;"></i>Reject</button>' +
            '</div></div></div>';
        document.body.appendChild(modal);
    };

    // --- Show Full Rejection Comment ---
    window.showFullComment = function (reason) {
        var existing = document.getElementById('comment-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'comment-modal';
        modal.innerHTML =
            '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:1000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(4px);" onclick="if(event.target===this)this.parentElement.remove()">' +
            '<div style="background:white;padding:0;border-radius:16px;width:90%;max-width:550px;max-height:80vh;box-shadow:0 25px 50px rgba(0,0,0,0.25);overflow:hidden;display:flex;flex-direction:column;">' +
            '<div style="background:linear-gradient(135deg,#c62828,#ef5350);color:white;padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;">' +
            '<h3 style="margin:0;font-size:1.1rem;font-weight:600;"><i class="fa-solid fa-comment" style="margin-right:0.5rem;"></i>Rejection Reason</h3>' +
            '<button onclick="document.getElementById(\'comment-modal\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>' +
            '<div style="padding:1.5rem;overflow-y:auto;flex:1;max-height:50vh;">' +
            '<div style="background:#f8f9fa;padding:1.25rem;border-radius:10px;border-left:4px solid #c62828;">' +
            '<p id="comment-content" style="margin:0;font-size:0.95rem;line-height:1.7;color:#333;white-space:pre-wrap;word-wrap:break-word;"></p>' +
            '</div></div>' +
            '<div style="padding:1rem 1.5rem;background:#f8f9fa;border-top:1px solid #e0e0e0;">' +
            '<button onclick="document.getElementById(\'comment-modal\').remove()" style="width:100%;padding:12px;background:#333;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.9rem;">Close</button>' +
            '</div></div></div>';
        document.body.appendChild(modal);
        document.getElementById('comment-content').textContent = reason;
    };
})();
