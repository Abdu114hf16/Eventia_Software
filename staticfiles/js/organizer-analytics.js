/* ===================================================================
   ORGANIZER ANALYTICS  (redesigned)
   KPI cards  →  highlight cards  →  tab-based single chart
   + Per-event report renderer
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    function getLang() {
        return typeof window.getLang === 'function'
            ? window.getLang()
            : (localStorage.getItem('eventia_lang') || 'en');
    }

    function t(key) {
        const lang = getLang();
        if (window.I18N && window.I18N[lang] && window.I18N[lang][key]) {
            return window.I18N[lang][key];
        }
        return key;
    }

    /** Event catalogue → i18n keys (same as organizer-logic.js `eventCategoryMap`). */
    const eventCatalogCategoryMap = {
        'Conference': 'cat.conference',
        'Entertainment': 'cat.entertainment',
        'Exhibition': 'cat.exhibition',
        'Technology': 'cat.technology',
        'Tech': 'cat.tech',
        'Art': 'cat.art',
        'Business': 'cat.business',
        'Music': 'cat.music',
        'Education': 'cat.education',
        'Sports': 'cat.sports',
        'Workshop': 'cat.workshop',
        'Food & Culture': 'cat.foodCulture',
        'Culture': 'cat.culture',
        'Family': 'cat.family',
        'Shopping': 'cat.shopping',
        'Gaming': 'cat.gaming',
        'Automotive': 'cat.automotive',
        'Other': 'cat.other',
        'Innovation': 'vendor.cat.innovation',
        'Startup': 'vendor.cat.startup',
        'Fashion': 'vendor.cat.fashion',
        'Design': 'vendor.cat.design',
        'Networking': 'vendor.cat.networking',
        'Trade Show': 'vendor.cat.tradeShow',
        'Concert': 'vendor.cat.concert',
        'Festival': 'vendor.cat.festival',
        'Theater': 'vendor.cat.theater',
        'Training': 'vendor.cat.training',
        'Seminar': 'vendor.cat.seminar',
        'Marathon': 'vendor.cat.marathon',
        'Tournament': 'vendor.cat.tournament',
        'Fitness': 'vendor.cat.fitness',
        'Food': 'vendor.cat.foodBeverage',
        'Culinary': 'vendor.cat.culinary',
        'Wine Tasting': 'vendor.cat.wineTasting',
        'Food Festival': 'vendor.cat.foodFestival',
        'Health': 'vendor.cat.health',
        'Wellness': 'vendor.cat.wellness',
        'Yoga': 'vendor.cat.yoga',
        'Meditation': 'vendor.cat.meditation',
        'Charity': 'vendor.cat.charity',
        'Fundraising': 'vendor.cat.fundraising',
        'Community': 'vendor.cat.community',
        'Social': 'vendor.cat.social',
        'Expo': 'vendor.cat.expo',
        'Fair': 'vendor.cat.fair',
        'Celebration': 'vendor.cat.celebration'
    };

    const eventCatalogCategoryMapInsensitive = Object.create(null);
    Object.keys(eventCatalogCategoryMap).forEach((k) => {
        eventCatalogCategoryMapInsensitive[k.toLowerCase()] = eventCatalogCategoryMap[k];
    });

    function translateCategory(category) {
        if (category == null || String(category).trim() === '') {
            return t('org.analytics.common.uncategorized');
        }
        const trimmed = String(category).trim();
        let i18nKey = eventCatalogCategoryMap[trimmed] || eventCatalogCategoryMapInsensitive[trimmed.toLowerCase()];
        if (i18nKey) return t(i18nKey);
        const slugKey = `cat.${trimmed.toLowerCase()}`;
        const viaSlug = t(slugKey);
        if (viaSlug !== slugKey) return viaSlug;
        return trimmed;
    }

    /* Vendor service categories — mirrors organizer-logic.js mapping. */
    const vendorCategoryMap = {
        'Catering': 'common.catering',
        'Bakery & Desserts': 'common.bakeryDesserts',
        'Beverages': 'common.beverages',
        'Food Trucks': 'common.foodTrucks',
        'Venue': 'common.venue',
        'Conference Hall': 'common.conferenceHall',
        'Outdoor Venue': 'common.outdoorVenue',
        'AV Equipment': 'common.avEquipment',
        'Audio & Lighting': 'common.audioLighting',
        'LED Screens': 'common.ledScreens',
        'Stage & Rigging': 'common.stageRigging',
        'Live Streaming': 'common.liveStreaming',
        'Decoration': 'common.decoration',
        'Event Decoration': 'common.eventDecoration',
        'Floral Design': 'common.floralDesign',
        'Balloon Decor': 'common.balloonDecor',
        'Event Lighting': 'common.eventLighting',
        'Photography': 'common.photography',
        'Photography & Video': 'common.photographyVideo',
        'Aerial Photography': 'common.aerialPhotography',
        'Photo Booth': 'common.photoBooth',
        'DJ Services': 'common.dj',
        'Live Entertainment': 'common.liveEntertainment',
        'Kids Entertainment': 'common.kidsEntertainment',
        'Traditional Music': 'common.traditionalMusic',
        'Fireworks & Pyro': 'common.fireworks',
        'Transportation': 'common.transportation',
        'Shuttle Services': 'common.shuttle',
        'Valet Parking': 'common.valet',
        'Security': 'common.security',
        'Security Services': 'common.securityServices',
        'VIP Security': 'common.vipSecurity',
        'Medical Services': 'common.medical',
        'Event Staff': 'common.eventStaff',
        'Translation': 'common.translation',
        'MC & Hosting': 'common.mcHosting',
        'Tent Rentals': 'common.tents',
        'Furniture Rentals': 'common.furniture',
        'Table/Chair Rentals': 'common.tableChair',
        'Power Supply': 'common.power',
        'Printing': 'common.printing',
        'Printing & Signage': 'common.printingSignage',
        'Book Sales': 'common.bookSales',
        'Connectivity Services': 'common.connectivityServices',
        'Food & Beverages': 'common.foodBeverages',
        'Entertainment': 'common.entertainment',
        'Social Media Marketing': 'common.socialMedia',
        'Influencer Marketing': 'common.influencer',
        'Government Permits': 'common.governmentPermits',
        'Safety Permits': 'common.safetyPermits',
        'Sponsors': 'common.sponsors',
        'Brand Partners': 'common.brandPartners',
        'Henna Artists': 'common.henna',
        'Falconry Shows': 'common.falconry',
        'Horse Shows': 'common.horseShows',
        'Arabian Perfumes': 'common.perfumes',
        'Arabic Calligraphy': 'common.calligraphy',
        'VR/AR Experiences': 'common.vrAr',
        'Eco-Friendly Services': 'common.eco',
        'Gifts & Giveaways': 'common.gifts',
        'Audio Visual': 'common.audioVisual',
        'Florists': 'common.florists',
        'Cleaning': 'common.cleaning',
        'Professional Services': 'common.professionalServices',
        'Furniture Rental': 'common.furniture',
        'Permits & Licensing': 'common.permitsLicensing',
        'Facilities': 'common.facilities',
        'Special Effects': 'common.specialEffects',
        'Children Services': 'common.childrenServices',
        'Technology': 'common.technology',
        'Other': 'org.analytics.common.other'
    };

    const vendorCategoryMapInsensitive = Object.create(null);
    Object.keys(vendorCategoryMap).forEach((k) => {
        vendorCategoryMapInsensitive[k.toLowerCase()] = vendorCategoryMap[k];
    });

    function translateVendorCategory(category) {
        if (!category) return t('org.analytics.common.other');
        const trimmed = String(category).trim();
        let key = vendorCategoryMap[trimmed];
        if (!key) key = vendorCategoryMapInsensitive[trimmed.toLowerCase()];
        return key ? t(key) : trimmed;
    }

    /* Internal age-group keys are returned in their canonical English
       form so they remain stable across languages; the *display*
       label is translated via translateAgeGroup() at render time. */
    const AGE_GROUP_KEYS = {
        'Under 18': 'org.analytics.age.under18',
        '18–24':    'org.analytics.age.18_24',
        '25–34':    'org.analytics.age.25_34',
        '35–44':    'org.analytics.age.35_44',
        '45–54':    'org.analytics.age.45_54',
        '55+':      'org.analytics.age.55plus'
    };

    function translateAgeGroup(group) {
        return t(AGE_GROUP_KEYS[group] || group);
    }

    /* Event status keys — mirrors the dropdown filter in organizer-dashboard.html. */
    const EVENT_STATUS_KEYS = {
        'Pending':  'status.pendingApproval',
        'Approved': 'status.approved',
        'Rejected': 'status.rejected',
        'Upcoming': 'status.upcoming',
        'Ongoing':  'status.ongoing',
        'Past':     'status.past'
    };

    function translateEventStatus(status) {
        if (!status) return t('org.analytics.common.active');
        return t(EVENT_STATUS_KEYS[status] || status);
    }

    /** Numeric YYYY-MM-DD for the event report banner (same in EN and AR). */
    function formatEventBannerDate(dateStr) {
        if (!dateStr) return t('org.analytics.common.noDate');
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /** Attendee feedback uses `rating` (1–5); older data may use `satisfactionScore`. */
    function registrationSatisfaction(r) {
        const raw = r.satisfactionScore != null ? r.satisfactionScore : r.rating;
        if (raw == null || raw === '') return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }

    function setEvtBannerValue(elId, valueText) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.textContent = valueText == null ? '' : String(valueText);
    }

    const MONTH_KEYS = [
        'org.analytics.month.jan', 'org.analytics.month.feb', 'org.analytics.month.mar',
        'org.analytics.month.apr', 'org.analytics.month.may', 'org.analytics.month.jun',
        'org.analytics.month.jul', 'org.analytics.month.aug', 'org.analytics.month.sep',
        'org.analytics.month.oct', 'org.analytics.month.nov', 'org.analytics.month.dec'
    ];

    let activeChart = null;
    let activeEvtChart = null;
    let currentTab = 'attendance';
    let currentEvtTab = 'revenue-tier';
    let cachedData = null;

    const BRAND_SERIES = [
        '#004e92',  // navy (brand primary)
        '#1565c0',  // azure
        '#4dabf7',  // sky (brand light)
        '#22d3ee',  // cyan
        '#14b8a6',  // teal
        '#6366f1',  // indigo
        '#8b5cf6',  // violet
        '#0ea5e9',  // sky-500 (replaces pink — stays cool-toned)
        '#f59e0b',  // amber
        '#10b981'   // emerald
    ];

    const PALETTE = {
        primary: '#004e92',
        light:   '#4dabf7',
        teal:    '#14b8a6',
        purple:  '#6366f1',
        muted:   '#8b5cf6',
        amber:   '#f59e0b'
    };

    /* Brand-forward chart theme for the Overview panel.
       Anchors in the navy→sky brand gradient and cascades cool→warm so
       the dominant series is always brand-blue and warm tones appear only
       as tertiary accents. */
    const OVERVIEW_THEME = {
        title: '#0f3558',
        label: '#587084',
        grid: 'rgba(21, 101, 192, 0.12)',
        tooltipBorder: 'rgba(21, 101, 192, 0.16)',
        // Single-series gradients (brand signature → differentiated cyan accent)
        attendanceStart: '#004e92',   // primary navy
        attendanceEnd:   '#4dabf7',   // primary sky
        revenueStart:    '#003366',   // deep navy
        revenueEnd:      '#22d3ee',   // cyan
        series: BRAND_SERIES
    };

    const PIE_COLORS = BRAND_SERIES;

    const CHART_TEXT = {
        primary:   '#2d3436',
        secondary: '#636e72',
        grid:      'rgba(0,0,0,0.06)'
    };

    function tip() {
        return {
            backgroundColor: '#ffffff',
            titleFont: { family: 'Inter', size: 13, weight: '600' },
            titleColor: '#2d3436',
            bodyFont:  { family: 'Inter', size: 12 },
            bodyColor: '#636e72',
            borderColor: '#e0e8f0',
            borderWidth: 1,
            padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4
        };
    }

    function overviewTip() {
        return {
            ...tip(),
            borderColor: OVERVIEW_THEME.tooltipBorder
        };
    }

    function chartGradient(chart, startColor, endColor, horizontal = false) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return startColor;

        const gradient = horizontal
            ? ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
            : ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        return gradient;
    }

    function trunc(s, n) { return !s ? '' : s.length > n ? s.slice(0, n - 1) + '…' : s; }

    /* ----------------------------------------------------------
       DATA LOADERS  –  fetches from Django backend API
    ---------------------------------------------------------- */
    let _serverData = null;

    function loadData() {
        if (_serverData) return _serverData;
        // Return empty structure before async data arrives
        return {
            events: [], vendors: [], eventVendors: [], requests: [],
            messages: [], broadcasts: [], registrations: []
        };
    }

    async function fetchAnalyticsData() {
        const url = window.EVENTIA_ANALYTICS_URL;
        if (!url) {
            console.warn('Analytics API URL not set.');
            return loadData();
        }
        try {
            const resp = await fetch(url, { credentials: 'same-origin' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            _serverData = await resp.json();
            return _serverData;
        } catch (err) {
            console.error('Failed to load analytics data:', err);
            return loadData();
        }
    }

    /* ----------------------------------------------------------
       HELPERS  –  age group from birthday
    ---------------------------------------------------------- */
    function ageGroupFromBirthday(birthday) {
        if (!birthday) return null;
        const birth = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18)  return 'Under 18';
        if (age <= 24)  return '18–24';
        if (age <= 34)  return '25–34';
        if (age <= 44)  return '35–44';
        if (age <= 54)  return '45–54';
        return '55+';
    }

    /* ----------------------------------------------------------
       KPIs  (overview dashboard)
    ---------------------------------------------------------- */
    function renderKPIs(d) {
        const totalEvents   = d.events.length;
        const totalAtt      = d.events.reduce((s, e) => s + (e.attendees || 0), 0);
        const totalRevenue  = d.events.reduce((s, e) => {
            const minP = Math.min(...(e.tickets || []).map(t => parseFloat(t.price) || 0));
            return s + (e.attendees || 0) * minP;
        }, 0);
        const eventsWithAtt = d.events.filter(e => e.attendees > 0);
        const avgAtt        = eventsWithAtt.length ? Math.round(totalAtt / eventsWithAtt.length) : 0;

        const vendorWD = d.requests.filter(r =>
            r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;
        const attendeeWD = d.registrations.filter(r => r.status === 'Withdrawn').length;

        setText('kpi-total-events',        totalEvents);
        setText('kpi-total-attendees',     totalAtt.toLocaleString());
        const revenueEl = document.getElementById('kpi-total-revenue');
        if (revenueEl) revenueEl.innerHTML = totalRevenue.toLocaleString() + ' ' + SAR_ICON;
        setText('kpi-avg-attendance',      avgAtt.toLocaleString());
        setText('kpi-vendor-withdrawals',  vendorWD);
        setText('kpi-attendee-withdrawals', attendeeWD);
    }

    /* ----------------------------------------------------------
       HIGHLIGHT CARDS
    ---------------------------------------------------------- */
    function renderHighlights(d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        const topEvt = sorted[0];
        setText('highlight-top-event', topEvt
            ? `${trunc(topEvt.title, 24)} — ${topEvt.attendees.toLocaleString()} ${t('org.analytics.common.attendeesLower')}`
            : t('org.analytics.common.noDataYet'));

        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const topService = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
        setText('highlight-top-service', topService
            ? `${translateVendorCategory(topService[0])} — ${topService[1]} ${topService[1] !== 1 ? t('org.analytics.common.bookings') : t('org.analytics.common.booking')}`
            : t('org.analytics.common.noDataYet'));

        const catAtt = {};
        d.events.forEach(e => {
            if (!e.category) return;
            catAtt[e.category] = (catAtt[e.category] || 0) + (e.attendees || 0);
        });
        const bestCat = Object.entries(catAtt).sort((a, b) => b[1] - a[1])[0];
        setText('highlight-top-category', bestCat
            ? `${translateCategory(bestCat[0])} — ${bestCat[1].toLocaleString()} ${t('org.analytics.common.attendeesLower')}`
            : t('org.analytics.common.noDataYet'));

        // Avg satisfaction from attendee survey scores
        const surveyed = d.registrations.filter(r => r.status !== 'Withdrawn' && registrationSatisfaction(r) != null);
        const satEl = document.getElementById('highlight-avg-satisfaction');
        if (satEl) {
            if (surveyed.length > 0) {
                const avg = surveyed.reduce((s, r) => s + registrationSatisfaction(r), 0) / surveyed.length;
                const respLabel = surveyed.length !== 1 ? t('org.analytics.common.responses') : t('org.analytics.common.response');
                satEl.innerHTML = `${avg.toFixed(1)} ★<br><span style="font-size:0.7rem;font-weight:500;color:#636e72">${surveyed.length} ${respLabel}</span>`;
            } else {
                satEl.textContent = t('org.analytics.common.noDataYet');
            }
        }
    }

    /* ----------------------------------------------------------
       TAB SWITCHING  (overview)
    ---------------------------------------------------------- */
    function initTabs() {
        document.querySelectorAll('[data-ana-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab = btn.dataset.anaTab;
                renderCurrentChart();
            });
        });
    }

    function renderCurrentChart() {
        if (!cachedData) return;
        if (activeChart) { activeChart.destroy(); activeChart = null; }
        const ctx = document.getElementById('ana-chart-canvas');
        if (!ctx) return;

        switch (currentTab) {
            case 'attendance':  activeChart = chartAttendance(ctx, cachedData); break;
            case 'revenue':     activeChart = chartRevenue(ctx, cachedData);    break;
            case 'services':    activeChart = chartServices(ctx, cachedData);   break;
            case 'categories':  activeChart = chartCategories(ctx, cachedData); break;
        }
    }

    /* ----------------------------------------------------------
       CHART BUILDERS  (overview)
    ---------------------------------------------------------- */
    function chartAttendance(ctx, d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(e => trunc(e.title, 22)),
                datasets: [{
                    label: t('org.analytics.common.attendees'),
                    data: sorted.map(e => e.attendees),
                    backgroundColor: c => chartGradient(c.chart, OVERVIEW_THEME.attendanceStart, OVERVIEW_THEME.attendanceEnd, true),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(false, c => `${c.raw.toLocaleString()} ${t('org.analytics.common.attendeesLower')}`, t('org.analytics.title.attendanceByEvent'), t('org.analytics.axis.numAttendees'), t('org.analytics.axis.event'))
        });
    }

    function chartRevenue(ctx, d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        const data = sorted.map(e => {
            const min = Math.min(...(e.tickets || []).map(tk => parseFloat(tk.price) || 0));
            return e.attendees * min;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(e => trunc(e.title, 22)),
                datasets: [{
                    label: t('org.analytics.axis.revenueSar'),
                    data,
                    backgroundColor: c => chartGradient(c.chart, OVERVIEW_THEME.revenueStart, OVERVIEW_THEME.revenueEnd, true),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(false, c => `${c.raw.toLocaleString()} ${t('common.currencySar')}`, t('org.analytics.title.revenueByEvent'), t('org.analytics.axis.revenueSar'), t('org.analytics.axis.event'))
        });
    }

    function chartServices(ctx, d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, e) => s + e[1], 0);
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => translateVendorCategory(e[0])),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => OVERVIEW_THEME.series[i % OVERVIEW_THEME.series.length]),
                    borderColor: '#f8fbff',
                    borderWidth: 3,
                    spacing: 2,
                    hoverOffset: 10
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 },
                            padding: 14,
                            usePointStyle: true,
                            color: OVERVIEW_THEME.title,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#f8fbff',
                                        lineWidth: 3,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...overviewTip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        const bookingLabel = c.raw !== 1 ? t('org.analytics.common.bookings') : t('org.analytics.common.booking');
                        return ` ${c.label}: ${c.raw} ${bookingLabel} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center',
                        align: 'center',
                        textAlign: 'center',
                        textShadowBlur: 4,
                        textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function chartCategories(ctx, d) {
        const catMap = {};
        d.events.forEach(e => {
            if (!e.category) return;
            catMap[e.category] = (catMap[e.category] || 0) + (e.attendees || 0);
        });
        const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        const colors = OVERVIEW_THEME.series;
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => translateCategory(e[0])),
                datasets: [{
                    label: t('org.analytics.axis.totalAttendees'),
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => colors[i % colors.length]),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(true, c => `${c.raw.toLocaleString()} ${t('org.analytics.common.attendeesLower')}`, t('org.analytics.title.attendeesByCategory'), t('org.analytics.axis.category'), t('org.analytics.axis.totalAttendees'))
        });
    }

    function chartAgeGroups(ctx, d) {
        const groupOrder = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
        const counts = {};
        groupOrder.forEach(g => { counts[g] = 0; });
        d.registrations.forEach(r => {
            if (r.status === 'Withdrawn') return;
            const g = ageGroupFromBirthday(r.birthday);
            if (g && counts[g] !== undefined) counts[g]++;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder.map(translateAgeGroup),
                datasets: [{
                    label: t('org.analytics.common.attendees'),
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: groupOrder.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} ${t('org.analytics.common.attendeesLower')}`, t('org.analytics.title.attendeesByAgeGroup'), t('org.analytics.axis.ageGroup'), t('org.analytics.axis.numAttendees'))
        });
    }

    /* ----------------------------------------------------------
       SHARED CHART OPTIONS
    ---------------------------------------------------------- */
    function barOpts(vertical, labelCb, title, xLabel, yLabel) {
        const axis = vertical ? {} : { indexAxis: 'y' };
        return {
            ...axis,
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { ...tip(), callbacks: { label: labelCb } },
                datalabels: { display: false },
                title: {
                    display: !!title,
                    text: title || '',
                    font: { family: 'Inter', size: 15, weight: '600' },
                    color: CHART_TEXT.primary,
                    padding: { bottom: 16 }
                }
            },
            scales: {
                x: {
                    grid: { color: vertical ? 'transparent' : CHART_TEXT.grid },
                    ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.primary },
                    beginAtZero: true,
                    title: {
                        display: !!xLabel,
                        text: xLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: CHART_TEXT.secondary,
                        padding: { top: 8 }
                    }
                },
                y: {
                    grid: { color: vertical ? CHART_TEXT.grid : 'transparent' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.secondary },
                    beginAtZero: true,
                    title: {
                        display: !!yLabel,
                        text: yLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: CHART_TEXT.secondary,
                        padding: { bottom: 8 }
                    }
                }
            }
        };
    }

    function overviewBarOpts(vertical, labelCb, title, xLabel, yLabel) {
        const axis = vertical ? {} : { indexAxis: 'y' };
        return {
            ...axis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { ...overviewTip(), callbacks: { label: labelCb } },
                datalabels: { display: false },
                title: {
                    display: !!title,
                    text: title || '',
                    font: { family: 'Inter', size: 15, weight: '600' },
                    color: OVERVIEW_THEME.title,
                    padding: { bottom: 16 }
                }
            },
            scales: {
                x: {
                    grid: { color: vertical ? 'transparent' : OVERVIEW_THEME.grid },
                    ticks: { font: { family: 'Inter', size: 11 }, color: OVERVIEW_THEME.title },
                    beginAtZero: true,
                    title: {
                        display: !!xLabel,
                        text: xLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: OVERVIEW_THEME.label,
                        padding: { top: 8 }
                    }
                },
                y: {
                    grid: { color: vertical ? OVERVIEW_THEME.grid : 'transparent' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: OVERVIEW_THEME.label },
                    beginAtZero: true,
                    title: {
                        display: !!yLabel,
                        text: yLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: OVERVIEW_THEME.label,
                        padding: { bottom: 8 }
                    }
                }
            }
        };
    }

    /* ----------------------------------------------------------
       PER-EVENT REPORT  (on analytics page)
       Dropdown selector  →  KPIs + tabbed charts
    ---------------------------------------------------------- */
    let selectedEventId = null;

    function populateEventDropdown(events) {
        const sel = document.getElementById('ana-event-select');
        if (!sel) return;
        sel.innerHTML = `<option value="">${t('org.analytics.selectEventPlaceholder')}</option>`;
        events.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = e.title;
            sel.appendChild(opt);
        });
    }

    function initEventSelector() {
        const sel = document.getElementById('ana-event-select');
        if (!sel) return;
        sel.addEventListener('change', () => {
            selectedEventId = sel.value || null;
            const body = document.getElementById('ana-event-report-body');
            const placeholder = document.getElementById('ana-event-report-placeholder');
            if (!selectedEventId) {
                if (body) body.style.display = 'none';
                if (placeholder) placeholder.style.display = '';
                return;
            }
            if (body) body.style.display = '';
            if (placeholder) placeholder.style.display = 'none';
            renderEventReport(selectedEventId);
        });
    }

    function renderEventReport(eventId) {
        const d = loadData();
        const evt = d.events.find(e => e.id === eventId);
        if (!evt) return;

        const allRegs     = d.registrations.filter(r => r.eventId === eventId);
        const activeRegs  = allRegs.filter(r => r.status !== 'Withdrawn');
        const attendeeWD  = allRegs.filter(r => r.status === 'Withdrawn').length;

        const totalRevenue = activeRegs.reduce((s, r) => s + (parseFloat(r.ticketPrice) || 0), 0);

        const retention = allRegs.length > 0
            ? Math.round((activeRegs.length / allRegs.length) * 100) + '%'
            : '--';

        const evVendors   = d.eventVendors.filter(v => v.eventId === eventId);
        const confirmed   = evVendors.filter(v => v.status === 'Confirmed');
        const vendorWD    = d.requests.filter(r =>
            r.eventId === eventId && r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;

        setText('ana-evt-title-name', evt.title);
        setEvtBannerValue('ana-evt-title-date', formatEventBannerDate(evt.date));
        setEvtBannerValue('ana-evt-title-category', translateCategory(evt.category));
        setEvtBannerValue('ana-evt-title-status', translateEventStatus(evt.status));

        setText('ana-evt-kpi-attendees',   activeRegs.length.toLocaleString());
        const evtRevenueEl = document.getElementById('ana-evt-kpi-revenue');
        if (evtRevenueEl) evtRevenueEl.innerHTML = totalRevenue.toLocaleString() + ' ' + SAR_ICON;
        setText('ana-evt-kpi-retention',   retention);
        setText('ana-evt-kpi-vendors',     confirmed.length);
        setText('ana-evt-kpi-vendor-wd',   vendorWD);
        setText('ana-evt-kpi-attendee-wd', attendeeWD);

        // Per-event satisfaction
        const evtSurveyed = activeRegs.filter(r => registrationSatisfaction(r) != null);
        const satKpi = document.getElementById('ana-evt-kpi-satisfaction');
        if (satKpi) {
            if (evtSurveyed.length > 0) {
                const avg = evtSurveyed.reduce((s, r) => s + registrationSatisfaction(r), 0) / evtSurveyed.length;
                const respLabel = evtSurveyed.length !== 1 ? t('org.analytics.common.responses') : t('org.analytics.common.response');
                satKpi.innerHTML = `${avg.toFixed(1)} ★<br><span style="font-size:0.6rem;font-weight:500;color:#636e72">${evtSurveyed.length} ${respLabel}</span>`;
            } else {
                satKpi.textContent = '--';
            }
        }

        currentEvtTab = 'revenue-tier';
        document.querySelectorAll('[data-ana-evt-tab]').forEach(b => b.classList.remove('active'));
        const firstTab = document.querySelector('[data-ana-evt-tab="revenue-tier"]');
        if (firstTab) firstTab.classList.add('active');

        renderEvtChart(eventId, d);
    }

    function initEvtTabs() {
        document.querySelectorAll('[data-ana-evt-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-evt-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentEvtTab = btn.dataset.anaEvtTab;
                if (selectedEventId) renderEvtChart(selectedEventId, loadData());
            });
        });
    }

    function renderEvtChart(eventId, d) {
        if (activeEvtChart) { activeEvtChart.destroy(); activeEvtChart = null; }
        const ctx = document.getElementById('ana-evt-report-chart-canvas');
        if (!ctx) return;

        switch (currentEvtTab) {
            case 'revenue-tier':    activeEvtChart = evtChartRevenueTier(ctx, eventId, d);   break;
            case 'age-groups':      activeEvtChart = evtChartAgeGroups(ctx, eventId, d);     break;
            case 'reg-timeline':    activeEvtChart = evtChartRegTimeline(ctx, eventId, d);   break;
            case 'vendor-services': activeEvtChart = evtChartVendorServices(ctx, eventId, d); break;
        }
    }

    function evtChartRevenueTier(ctx, eventId, d) {
        const evt = d.events.find(e => e.id === eventId);
        if (!evt || !evt.tickets || evt.tickets.length === 0) return null;

        const regs = d.registrations.filter(r => r.eventId === eventId && r.status !== 'Withdrawn');
        const tierRevenue = {};
        const tierCount = {};
        evt.tickets.forEach(tk => { tierRevenue[tk.name] = 0; tierCount[tk.name] = 0; });
        regs.forEach(r => {
            if (r.ticketType && tierRevenue[r.ticketType] !== undefined) {
                tierRevenue[r.ticketType] += parseFloat(r.ticketPrice) || 0;
                tierCount[r.ticketType]++;
            }
        });

        const labels = evt.tickets.map(tk => tk.name);
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: t('org.analytics.axis.revenueSar'),
                    data: labels.map(l => tierRevenue[l] || 0),
                    backgroundColor: labels.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.55
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} ${t('common.currencySar')}`, t('org.analytics.title.revenueByTier'), t('org.analytics.axis.ticketTier'), t('org.analytics.axis.revenueSar'))
        });
    }

    function evtChartAgeGroups(ctx, eventId, d) {
        const regs = d.registrations.filter(r => r.eventId === eventId && r.status !== 'Withdrawn');
        const groupOrder = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
        const counts = {};
        groupOrder.forEach(g => { counts[g] = 0; });
        regs.forEach(r => {
            const g = ageGroupFromBirthday(r.birthday);
            if (g && counts[g] !== undefined) counts[g]++;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder.map(translateAgeGroup),
                datasets: [{
                    label: t('org.analytics.common.attendees'),
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: groupOrder.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} ${c.raw !== 1 ? t('org.analytics.common.attendeesLower') : t('org.analytics.common.attendee')}`, t('org.analytics.title.attendeesByAgeGroup'), t('org.analytics.axis.ageGroup'), t('org.analytics.axis.numAttendees'))
        });
    }

    function evtChartRegTimeline(ctx, eventId, d) {
        const regs = d.registrations.filter(r => r.eventId === eventId && r.registeredDate);
        if (regs.length === 0) return null;

        const sorted = [...regs].sort((a, b) => a.registeredDate.localeCompare(b.registeredDate));
        const dateMap = {};
        sorted.forEach(r => {
            dateMap[r.registeredDate] = (dateMap[r.registeredDate] || 0) + 1;
        });

        const dates = Object.keys(dateMap).sort();
        let cumulative = 0;
        const cumulativeData = dates.map(dt => {
            cumulative += dateMap[dt];
            return cumulative;
        });

        const shortLabels = dates.map(dt => {
            const parts = dt.split('-');
            return parts[1] + '/' + parts[2];
        });

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: shortLabels,
                datasets: [{
                    label: t('org.analytics.axis.totalRegistrations'),
                    data: cumulativeData,
                    borderColor: BRAND_SERIES[0],
                    backgroundColor: 'rgba(0, 78, 146, 0.08)',
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: BRAND_SERIES[0],
                    borderWidth: 2.5,
                    tension: 0.35
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { ...tip(), callbacks: { label: c => `${c.raw} ${c.raw !== 1 ? t('org.analytics.common.totalRegPlural') : t('org.analytics.common.totalRegSingular')}` } },
                    datalabels: { display: false },
                    title: {
                        display: true,
                        text: t('org.analytics.title.regTimeline'),
                        font: { family: 'Inter', size: 15, weight: '600' },
                        color: CHART_TEXT.primary,
                        padding: { bottom: 16 }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.primary, maxRotation: 45 }, title: { display: true, text: t('org.analytics.axis.date'), font: { family: 'Inter', size: 12, weight: '500' }, color: CHART_TEXT.secondary, padding: { top: 8 } } },
                    y: { grid: { color: CHART_TEXT.grid }, ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.secondary, stepSize: 1 }, beginAtZero: true, title: { display: true, text: t('org.analytics.axis.totalRegistrations'), font: { family: 'Inter', size: 12, weight: '500' }, color: CHART_TEXT.secondary, padding: { bottom: 8 } } }
                }
            }
        });
    }

    function evtChartVendorServices(ctx, eventId, d) {
        const evVendors = d.eventVendors.filter(v => v.eventId === eventId && v.status === 'Confirmed');
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const catCount = {};
        evVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });

        const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return null;

        const total = entries.reduce((s, e) => s + e[1], 0);
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => translateVendorCategory(e[0])),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff',
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        const vendorLabel = c.raw !== 1 ? t('org.analytics.common.vendors') : t('org.analytics.common.vendor');
                        return ` ${c.label}: ${c.raw} ${vendorLabel} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center',
                        align: 'center',
                        textAlign: 'center',
                        textShadowBlur: 4,
                        textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    /* ----------------------------------------------------------
       MARKET INSIGHTS  (tabbed: events-by-month / avg ticket price)
    ---------------------------------------------------------- */
    let activeMarketChart = null;
    let currentMarketTab = 'events-month';

    function initMarketTabs() {
        document.querySelectorAll('[data-ana-market-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-market-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMarketTab = btn.dataset.anaMarketTab;
                renderMarketInsights();
            });
        });

        const tierSelect = document.getElementById('ana-market-tier-select');
        if (tierSelect) {
            tierSelect.addEventListener('change', () => {
                renderMarketInsights();
            });
        }
    }

    function renderMarketInsights() {
        if (activeMarketChart) { activeMarketChart.destroy(); activeMarketChart = null; }
        const ctx = document.getElementById('ana-market-chart-canvas');
        if (!ctx) return;
        const d = loadData();

        const tierFilter = document.getElementById('ana-market-tier-filter');
        if (currentMarketTab === 'avg-price') {
            populateTierDropdown(d);
            if (tierFilter) tierFilter.style.display = '';
            const selectedTier = document.getElementById('ana-market-tier-select')?.value || 'all';
            activeMarketChart = chartAvgTicketPrice(ctx, d, selectedTier);
        } else {
            if (tierFilter) tierFilter.style.display = 'none';
            if (currentMarketTab === 'events-month') {
                activeMarketChart = chartEventsPerMonth(ctx, d);
            } else if (currentMarketTab === 'revenue-potential') {
                activeMarketChart = chartRevenuePotential(ctx, d);
            }
        }
    }

    function populateTierDropdown(d) {
        const sel = document.getElementById('ana-market-tier-select');
        if (!sel) return;
        const tiers = new Set();
        d.events.forEach(e => {
            if (!e.tickets) return;
            e.tickets.forEach(tk => { if (tk.name) tiers.add(tk.name); });
        });
        const current = sel.value;
        sel.innerHTML = `<option value="all">${t('org.analytics.market.allTiers')}</option>`;
        [...tiers].sort().forEach(tier => {
            const opt = document.createElement('option');
            opt.value = tier;
            opt.textContent = tier;
            sel.appendChild(opt);
        });
        // Preserve selection if still valid
        if ([...sel.options].some(o => o.value === current)) sel.value = current;
    }

    function chartEventsPerMonth(ctx, d) {
        const monthNames = MONTH_KEYS.map(k => t(k));
        const monthCounts = new Array(12).fill(0);
        d.events.forEach(e => {
            if (!e.date) return;
            const m = new Date(e.date).getMonth();
            if (!isNaN(m)) monthCounts[m]++;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: t('org.analytics.common.events'),
                    data: monthCounts,
                    backgroundColor: c => chartGradient(c.chart, BRAND_SERIES[0], BRAND_SERIES[2], true),
                    borderRadius: 8,
                    barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} ${c.raw !== 1 ? t('org.analytics.common.eventsLower') : t('org.analytics.common.eventLower')}`, t('org.analytics.title.eventsByMonth'), t('org.analytics.axis.month'), t('org.analytics.axis.numEvents'))
        });
    }

    function chartAvgTicketPrice(ctx, d, tierFilter) {
        // Gather all categories first
        const allCategories = new Set();
        const catPrices = {};
        d.events.forEach(e => {
            if (!e.category || !e.tickets || e.tickets.length === 0) return;
            allCategories.add(e.category);
            const tickets = tierFilter === 'all'
                ? e.tickets
                : e.tickets.filter(tk => tk.name === tierFilter);
            if (tickets.length === 0) return;
            if (!catPrices[e.category]) catPrices[e.category] = [];
            tickets.forEach(tk => {
                const price = parseFloat(tk.price) || 0;
                catPrices[e.category].push(price);
            });
        });

        // Build entries for ALL categories, 0 if no matching tier
        const entries = [...allCategories]
            .map(cat => {
                const prices = catPrices[cat] || [];
                const avg = prices.length > 0 ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;
                return [cat, avg];
            })
            .sort((a, b) => b[1] - a[1]);

        const chartTitle = tierFilter === 'all'
            ? t('org.analytics.title.avgPriceByCategory')
            : t('org.analytics.title.avgPriceByCategoryFmt').replace('{tier}', tierFilter);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => translateCategory(e[0])),
                datasets: [{
                    label: t('org.analytics.axis.avgPriceSar'),
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} ${t('common.currencySar')}`, chartTitle, t('org.analytics.axis.eventCategory'), t('org.analytics.axis.avgPriceSar'))
        });
    }

    function chartRevenuePotential(ctx, d) {
        const catRevenue = {};
        const catCount = {};
        d.events.forEach(e => {
            if (!e.category) return;
            const prices = (e.tickets || []).map(tk => parseFloat(tk.price) || 0);
            const minPrice = prices.length ? Math.min(...prices) : 0;
            const revenue = (e.attendees || 0) * minPrice;
            catRevenue[e.category] = (catRevenue[e.category] || 0) + revenue;
            catCount[e.category] = (catCount[e.category] || 0) + 1;
        });
        const entries = Object.entries(catRevenue)
            .map(([cat, rev]) => [cat, Math.round(rev / (catCount[cat] || 1))])
            .sort((a, b) => b[1] - a[1]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => translateCategory(e[0])),
                datasets: [{
                    label: t('org.analytics.axis.avgRevenuePerEvent'),
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} ${t('common.currencySar')}`, t('org.analytics.title.avgRevenueByCategory'), t('org.analytics.axis.eventCategory'), t('org.analytics.axis.revenueSar'))
        });
    }

    /* ----------------------------------------------------------
       ATTENDEES PANEL  (age groups + KPIs)
    ---------------------------------------------------------- */
    let activeAttChart = null;
    let currentAttTab = 'age-groups';

    function renderAttendeesPanel() {
        const d = loadData();

        const allRegs    = d.registrations;
        const active     = allRegs.filter(r => r.status !== 'Withdrawn');
        const withdrawn  = allRegs.filter(r => r.status === 'Withdrawn');
        const retention  = allRegs.length > 0
            ? Math.round((active.length / allRegs.length) * 100) + '%'
            : '--';

        setText('att-kpi-total',     allRegs.length.toLocaleString());
        setText('att-kpi-active',    active.length.toLocaleString());
        setText('att-kpi-withdrawn', withdrawn.length.toLocaleString());
        setText('att-kpi-retention', retention);

        const chartArea = document.querySelector('#ana-panel-attendees .ana-chart-area');
        const loyaltyContent = document.getElementById('att-loyalty-content');
        if (currentAttTab === 'loyalty') {
            if (chartArea) chartArea.style.display = 'none';
            if (loyaltyContent) loyaltyContent.style.display = '';
            renderLoyalAttendees(d);
        } else {
            if (chartArea) chartArea.style.display = '';
            if (loyaltyContent) loyaltyContent.style.display = 'none';
            renderAttChart(d);
        }
    }

    function initAttTabs() {
        document.querySelectorAll('[data-ana-att-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-att-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentAttTab = btn.dataset.anaAttTab;

                const chartArea = document.querySelector('#ana-panel-attendees .ana-chart-area');
                const loyaltyContent = document.getElementById('att-loyalty-content');

                if (currentAttTab === 'loyalty') {
                    if (chartArea) chartArea.style.display = 'none';
                    if (loyaltyContent) loyaltyContent.style.display = '';
                    renderLoyalAttendees(loadData());
                } else {
                    if (chartArea) chartArea.style.display = '';
                    if (loyaltyContent) loyaltyContent.style.display = 'none';
                    renderAttChart(loadData());
                }
            });
        });
    }

    function renderAttChart(d) {
        if (activeAttChart) { activeAttChart.destroy(); activeAttChart = null; }
        const ctx = document.getElementById('ana-att-chart-canvas');
        if (!ctx) return;

        switch (currentAttTab) {
            case 'age-groups':            activeAttChart = chartAgeGroups(ctx, d);             break;
            case 'ticket-types':          activeAttChart = chartTicketTypes(ctx, d);           break;
            case 'satisfaction-category': activeAttChart = chartSatisfactionByCategory(ctx, d); break;
        }
    }

    /* --- Ticket Type Distribution (doughnut) --- */
    function chartTicketTypes(ctx, d) {
        const active = d.registrations.filter(r => r.status !== 'Withdrawn');
        const unknownLabel = t('common.unknown');
        const typeCount = {};
        active.forEach(r => {
            const type = r.ticketType || unknownLabel;
            typeCount[type] = (typeCount[type] || 0) + 1;
        });
        const entries = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, e) => s + e[1], 0);

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        const attLabel = c.raw !== 1 ? t('org.analytics.common.attendeesLower') : t('org.analytics.common.attendee');
                        return ` ${c.label}: ${c.raw} ${attLabel} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center', align: 'center',
                        textAlign: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    /* --- Satisfaction by Event Category (bar) --- */
    function chartSatisfactionByCategory(ctx, d) {
        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const catScores = {};
        d.registrations.forEach(r => {
            const score = registrationSatisfaction(r);
            if (r.status === 'Withdrawn' || score == null) return;
            const evt = eventMap[r.eventId];
            if (!evt || !evt.category) return;
            if (!catScores[evt.category]) catScores[evt.category] = [];
            catScores[evt.category].push(score);
        });

        const entries = Object.entries(catScores)
            .map(([cat, scores]) => [cat, scores.reduce((s, v) => s + v, 0) / scores.length, scores.length])
            .sort((a, b) => b[1] - a[1]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => translateCategory(e[0])),
                datasets: [{
                    label: t('org.analytics.axis.avgSatisfaction'),
                    data: entries.map(e => parseFloat(e[1].toFixed(2))),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.6
                }]
            },
            options: {
                ...barOpts(true, c => {
                    const idx = c.dataIndex;
                    const count = entries[idx] ? entries[idx][2] : 0;
                    const respLabel = count !== 1 ? t('org.analytics.common.responses') : t('org.analytics.common.response');
                    return `${c.raw.toFixed(1)} ★  (${count} ${respLabel})`;
                }, t('org.analytics.title.satisfactionByCategory'), t('org.analytics.axis.eventCategory'), t('org.analytics.axis.avgScore')),
                scales: {
                    ...barOpts(true, null, '', '', '').scales,
                    y: {
                        ...barOpts(true, null, '', '', '').scales.y,
                        min: 0, max: 5,
                        ticks: {
                            font: { family: 'Inter', size: 11 },
                            color: CHART_TEXT.secondary,
                            stepSize: 1,
                            callback: v => v + ' ★'
                        },
                        title: {
                            display: true, text: t('org.analytics.axis.avgScore'),
                            font: { family: 'Inter', size: 12, weight: '500' },
                            color: CHART_TEXT.secondary, padding: { bottom: 8 }
                        }
                    }
                }
            }
        });
    }

    /* --- Loyal Attendees Honor List --- */
    function renderLoyalAttendees(d) {
        const container = document.getElementById('att-loyalty-list');
        if (!container) return;

        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const attendeeMap = {};
        d.registrations.filter(r => r.status !== 'Withdrawn').forEach(r => {
            const name = String(r.name ?? '').trim();
            if (!name) return;
            const key = name.toLowerCase();
            if (!attendeeMap[key]) {
                attendeeMap[key] = { name, events: new Set(), totalSpent: 0, scores: [] };
            }
            attendeeMap[key].events.add(r.eventId);
            attendeeMap[key].totalSpent += parseFloat(r.ticketPrice) || 0;
            const score = registrationSatisfaction(r);
            if (score != null) attendeeMap[key].scores.push(score);
        });

        const loyalList = Object.values(attendeeMap)
            .filter(a => a.events.size >= 2)
            .sort((a, b) => {
                if (b.events.size !== a.events.size) return b.events.size - a.events.size;
                return b.totalSpent - a.totalSpent;
            });

        if (loyalList.length === 0) {
            container.innerHTML = `<div class="att-loyalty-empty"><i class="fa-solid fa-user-group"></i>${t('org.analytics.loyalty.empty')}</div>`;
            return;
        }

        container.innerHTML = loyalList.map((a, i) => {
            const rank = i + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const badgeClass = rank === 1 ? 'badge-gold' : rank === 2 ? 'badge-silver' : rank === 3 ? 'badge-bronze' : 'badge-regular';
            const badgeLabel = rank === 1 ? t('org.analytics.loyalty.gold')
                             : rank === 2 ? t('org.analytics.loyalty.silver')
                             : rank === 3 ? t('org.analytics.loyalty.bronze')
                             : t('org.analytics.loyalty.loyal');
            const eventsLabel = a.events.size !== 1 ? t('org.analytics.common.eventsLower') : t('org.analytics.common.eventLower');
            return `<div class="att-loyalty-card">
                <div class="att-loyalty-rank ${rankClass}">${rank <= 3 ? '<i class="fa-solid fa-crown"></i>' : rank}</div>
                <div class="att-loyalty-info">
                    <div class="att-loyalty-name">${a.name}</div>
                    <div class="att-loyalty-meta">
                        <span><i class="fa-solid fa-calendar-check"></i> ${a.events.size} ${eventsLabel}</span>
                        <span><i class="fa-solid fa-sack-dollar"></i> ${a.totalSpent.toLocaleString()} ${SAR_ICON}</span>
                    </div>
                </div>
                <span class="att-loyalty-badge ${badgeClass}"><i class="fa-solid fa-medal"></i> ${badgeLabel}</span>
            </div>`;
        }).join('');
    }

    /* ----------------------------------------------------------
       UTILITIES
    ---------------------------------------------------------- */
    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* ----------------------------------------------------------
       VENDOR ANALYTICS PANEL
    ---------------------------------------------------------- */
    let activeVndChart = null;
    let currentVndTab = 'category-dist';

    function renderVendorsPanel() {
        const d = loadData();
        renderVendorKPIs(d);
        renderVendorHighlights(d);
        const chartArea = document.querySelector('#ana-panel-vendors .ana-chart-area');
        const allContent = document.getElementById('vnd-all-vendors-content');
        if (currentVndTab === 'all-vendors') {
            if (chartArea) chartArea.style.display = 'none';
            if (allContent) allContent.style.display = '';
            renderAllVendorsList(d);
        } else {
            if (chartArea) chartArea.style.display = '';
            if (allContent) allContent.style.display = 'none';
            renderVndChart(d);
        }
    }

    function renderVendorKPIs(d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const uniqueVendorIds = new Set(d.eventVendors.map(ev => ev.vendorId));
        const totalEngaged = uniqueVendorIds.size;
        const confirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const pending = d.eventVendors.filter(ev => ev.status === 'Pending').length;
        const declined = d.eventVendors.filter(ev => ev.status === 'Declined').length;

        const vendorWithdrawals = d.requests.filter(r =>
            r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;
        const totalDeclinedOrWD = declined + vendorWithdrawals;

        const totalAssignments = d.eventVendors.length;
        const acceptanceRate = totalAssignments > 0
            ? Math.round((confirmed / totalAssignments) * 100) + '%'
            : '--';

        const vendorEventMap = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            if (!vendorEventMap[ev.vendorId]) vendorEventMap[ev.vendorId] = new Set();
            vendorEventMap[ev.vendorId].add(ev.eventId);
        });
        const repeatVendors = Object.values(vendorEventMap).filter(s => s.size >= 2).length;

        setText('vnd-kpi-total', totalEngaged);
        setText('vnd-kpi-confirmed', confirmed);
        setText('vnd-kpi-pending', pending);
        setText('vnd-kpi-declined', totalDeclinedOrWD);
        setText('vnd-kpi-acceptance', acceptanceRate);
        setText('vnd-kpi-repeat', repeatVendors);
    }

    function renderVendorHighlights(d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const bookingCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            bookingCount[ev.vendorId] = (bookingCount[ev.vendorId] || 0) + 1;
        });
        const topVendorEntry = Object.entries(bookingCount).sort((a, b) => b[1] - a[1])[0];
        const topVendor = topVendorEntry ? vendorMap[topVendorEntry[0]] : null;
        const topVendorEventLabel = topVendorEntry && topVendorEntry[1] !== 1
            ? t('org.analytics.common.eventsLower')
            : t('org.analytics.common.eventLower');
        setText('vnd-highlight-top-vendor', topVendor
            ? `${trunc(topVendor.name, 22)} — ${topVendorEntry[1]} ${topVendorEventLabel}`
            : t('org.analytics.common.noDataYet'));

        const ratedVendors = d.vendors.filter(v => v.rating > 0).sort((a, b) => b.rating - a.rating);
        setText('vnd-highlight-top-rated', ratedVendors.length > 0
            ? `${trunc(ratedVendors[0].name, 22)} — ${ratedVendors[0].rating} ★`
            : t('org.analytics.common.noDataYet'));

        const catCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
        const topCatBookingLabel = topCat && topCat[1] !== 1
            ? t('org.analytics.common.bookings')
            : t('org.analytics.common.booking');
        setText('vnd-highlight-top-category', topCat
            ? `${translateVendorCategory(topCat[0])} — ${topCat[1]} ${topCatBookingLabel}`
            : t('org.analytics.common.noDataYet'));

        const eventIds = [...new Set(d.eventVendors.map(ev => ev.eventId))];
        const eventsWithVendors = eventIds.length;
        const totalConfirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const avgPerEvent = eventsWithVendors > 0
            ? (totalConfirmed / eventsWithVendors).toFixed(1)
            : '0';
        setText('vnd-highlight-avg-per-event', avgPerEvent);
    }

    function initVndTabs() {
        document.querySelectorAll('[data-ana-vnd-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-vnd-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentVndTab = btn.dataset.anaVndTab;

                const chartArea = document.querySelector('#ana-panel-vendors .ana-chart-area');
                const allContent = document.getElementById('vnd-all-vendors-content');

                if (currentVndTab === 'all-vendors') {
                    if (chartArea) chartArea.style.display = 'none';
                    if (allContent) allContent.style.display = '';
                    renderAllVendorsList(loadData());
                } else {
                    if (chartArea) chartArea.style.display = '';
                    if (allContent) allContent.style.display = 'none';
                    renderVndChart(loadData());
                }
            });
        });
    }

    function renderVndChart(d) {
        if (activeVndChart) { activeVndChart.destroy(); activeVndChart = null; }
        const ctx = document.getElementById('ana-vnd-chart-canvas');
        if (!ctx) return;

        switch (currentVndTab) {
            case 'category-dist':    activeVndChart = vndChartCategoryDist(ctx, d);    break;
            case 'status-breakdown': activeVndChart = vndChartStatusBreakdown(ctx, d); break;
            case 'vendors-per-event': activeVndChart = vndChartVendorsPerEvent(ctx, d); break;
        }
    }

    function vndChartCategoryDist(ctx, d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            catCount[v.category || 'Other'] = (catCount[v.category || 'Other'] || 0) + 1;
        });
        const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return null;
        const total = entries.reduce((s, e) => s + e[1], 0);

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => translateVendorCategory(e[0])),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        const bookingLabel = c.raw !== 1 ? t('org.analytics.common.bookings') : t('org.analytics.common.booking');
                        return ` ${c.label}: ${c.raw} ${bookingLabel} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center', align: 'center',
                        textAlign: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function vndChartStatusBreakdown(ctx, d) {
        const confirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const pending   = d.eventVendors.filter(ev => ev.status === 'Pending').length;
        const declined  = d.eventVendors.filter(ev => ev.status === 'Declined').length;
        const total = confirmed + pending + declined;
        if (total === 0) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    t('org.analytics.common.confirmed'),
                    t('org.analytics.common.pending'),
                    t('org.analytics.common.declined')
                ],
                datasets: [{
                    data: [confirmed, pending, declined],
                    backgroundColor: ['#2e7d32', '#ff9800', '#c62828'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        const assignmentLabel = c.raw !== 1 ? t('org.analytics.common.assignments') : t('org.analytics.common.assignment');
                        return ` ${c.label}: ${c.raw} ${assignmentLabel} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 14 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                            return value > 0 ? pct + '%' : '';
                        },
                        anchor: 'center', align: 'center',
                        textAlign: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function vndChartVendorsPerEvent(ctx, d) {
        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const evtCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            evtCount[ev.eventId] = (evtCount[ev.eventId] || 0) + 1;
        });

        const entries = Object.entries(evtCount)
            .map(([eid, count]) => {
                const evt = eventMap[eid];
                return [evt ? trunc(evt.title, 22) : eid, count];
            })
            .sort((a, b) => b[1] - a[1]);

        if (entries.length === 0) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: t('org.analytics.axis.confirmedVendors'),
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.6
                }]
            },
            options: barOpts(
                true,
                c => `${c.raw} ${c.raw !== 1 ? t('org.analytics.common.vendors') : t('org.analytics.common.vendor')}`,
                t('org.analytics.title.confirmedVendorsPerEvent'),
                t('org.analytics.axis.event'),
                t('org.analytics.axis.numVendors')
            )
        });
    }

    function renderAllVendorsList(d) {
        const container = document.getElementById('vnd-all-vendors-list');
        if (!container) return;

        const bookingStats = {};
        d.eventVendors.forEach(ev => {
            if (!bookingStats[ev.vendorId]) bookingStats[ev.vendorId] = { confirmed: 0, pending: 0, events: new Set() };
            const s = bookingStats[ev.vendorId];
            s.events.add(ev.eventId);
            if (ev.status === 'Confirmed') s.confirmed++;
            else if (ev.status === 'Pending') s.pending++;
        });

        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const list = Object.entries(bookingStats).map(([vid, stats]) => {
            const v = vendorMap[vid];
            return {
                name: v ? v.name : vid,
                category: v ? (v.category || 'Other') : 'Other',
                rating: v ? (v.rating || 0) : 0,
                location: v ? (v.location || '') : '',
                confirmed: stats.confirmed,
                pending: stats.pending,
                events: stats.events.size
            };
        }).sort((a, b) => b.events - a.events || b.confirmed - a.confirmed);

        if (list.length === 0) {
            container.innerHTML = `<div class="att-loyalty-empty"><i class="fa-solid fa-store"></i>${t('org.analytics.vendors.empty')}</div>`;
            return;
        }

        container.innerHTML = list.map((v, i) => {
            const rank = i + 1;
            const rankClass = rank <= 3 && v.events > 0 ? `rank-${rank}` : '';
            const eventLabel = v.events !== 1
                ? t('org.analytics.common.eventsLower')
                : t('org.analytics.common.eventLower');
            return `<div class="att-loyalty-card">
                <div class="att-loyalty-rank ${rankClass}">${rank <= 3 && v.events > 0 ? '<i class="fa-solid fa-crown"></i>' : rank}</div>
                <div class="att-loyalty-info">
                    <div class="att-loyalty-name">${v.name}</div>
                    <div class="att-loyalty-meta">
                        <span><i class="fa-solid fa-calendar-check"></i> ${v.events} ${eventLabel}</span>
                        <span><i class="fa-solid fa-handshake"></i> ${v.confirmed} ${t('org.analytics.common.confirmedLower')}</span>
                        ${v.pending > 0 ? `<span><i class="fa-solid fa-hourglass-half" style="color:#f59e0b"></i> ${v.pending} ${t('org.analytics.common.pendingLower')}</span>` : ''}
                        <span><i class="fa-solid fa-tag"></i> ${translateVendorCategory(v.category)}</span>
                        ${v.location ? `<span><i class="fa-solid fa-location-dot"></i> ${v.location}</span>` : ''}
                        ${v.rating > 0 ? `<span><i class="fa-solid fa-star" style="color:#f59e0b"></i> ${v.rating}</span>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    /* ----------------------------------------------------------
       MAIN-LEVEL TAB SWITCHING  (Overview ↔ Event Report)
    ---------------------------------------------------------- */
    function initMainTabs() {
        document.querySelectorAll('[data-ana-main]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-main]').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.ana-main-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById('ana-panel-' + btn.dataset.anaMain);
                if (panel) panel.classList.add('active');

                if (btn.dataset.anaMain === 'attendees') {
                    renderAttendeesPanel();
                }
                if (btn.dataset.anaMain === 'event-report') {
                    populateEventDropdown(loadData().events);
                }
                if (btn.dataset.anaMain === 'market-insights') {
                    renderMarketInsights();
                }
                if (btn.dataset.anaMain === 'vendors') {
                    renderVendorsPanel();
                }
            });
        });
    }

    /* ----------------------------------------------------------
       PDF EXPORT — Full-report multi-chart export
       Builds an off-screen staging container that includes KPIs
       and ALL chart tabs so the exported PDF is a complete report.
    ---------------------------------------------------------- */

    function pdfWaitForLayoutStable() {
        const fontsReady = document.fonts && document.fonts.ready
            ? document.fonts.ready.catch(() => {})
            : Promise.resolve();
        return fontsReady.then(() => new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(resolve, 500);
                });
            });
        }));
    }

    function pdfMakeCanvasOpts(canvasScale) {
        return {
            scale: canvasScale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f5f8fc',
            logging: false,
            foreignObjectRendering: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
                try {
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        .pdf-staging-container,
                        .pdf-staging-container *,
                        .pdf-staging-container *::before,
                        .pdf-staging-container *::after {
                            animation: none !important;
                            transition: none !important;
                        }
                        .pdf-staging-container .ana-kpi-card,
                        .pdf-staging-container .ana-kpi-value,
                        .pdf-staging-container .ana-kpi-label,
                        .pdf-staging-container .ana-highlight-card,
                        .pdf-staging-container .evt-kpi,
                        .pdf-staging-container .evt-kpi-value,
                        .pdf-staging-container .evt-kpi-label,
                        .pdf-staging-container .ana-evt-title-banner,
                        .pdf-staging-container .pdf-chart-wrapper,
                        .pdf-staging-container .pdf-section-heading,
                        .pdf-staging-container .pdf-report-title-banner {
                            opacity: 1 !important;
                            transform: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                } catch (e) { /* ignore */ }
            }
        };
    }

    function pdfSectionHeading(text) {
        const h = document.createElement('div');
        h.className = 'pdf-section-heading';
        h.textContent = text;
        return h;
    }

    /* Locale-aware date string for PDF banners ("Generated on …"). */
    function pdfDateString() {
        const lang = getLang();
        const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
        return new Date().toLocaleDateString(locale, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function nextFrame() {
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }

    function pdfRenderChartToImage(chartFn, width, height) {
        const w = width || 900;
        const h = height || 420;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + w + 'px;height:' + h + 'px;background:#ffffff;';
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.setAttribute('dir', 'ltr');
        tmpCanvas.style.cssText = 'display:block;width:100%;height:100%;';
        wrapper.appendChild(tmpCanvas);
        document.body.appendChild(wrapper);

        // Force Chart.js to skip animations for this render by overriding
        // its global defaults before creating the instance. We restore the
        // previous values when we're done. Without this, new Chart() draws
        // an empty first frame and toDataURL() captures a blank canvas.
        const ChartGlobal = window.Chart;
        const prevAnim = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.animation : undefined;
        const prevAnimations = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.animations : undefined;
        const prevTransitions = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.transitions : undefined;
        if (ChartGlobal && ChartGlobal.defaults) {
            ChartGlobal.defaults.animation = false;
            ChartGlobal.defaults.animations = {};
            ChartGlobal.defaults.transitions = {
                active: { animation: { duration: 0 } },
                resize: { animation: { duration: 0 } },
                show:   { animations: {} },
                hide:   { animations: {} }
            };
        }

        let instance = null;
        try {
            instance = chartFn(tmpCanvas);
        } catch (e) {
            console.warn('Chart render failed in PDF staging:', e);
        }

        return nextFrame()
            .then(() => {
                if (!instance) return null;
                try {
                    instance.resize();
                    instance.update('none');
                } catch (e) { /* ignore */ }
                return nextFrame().then(() => {
                    let dataUrl = null;
                    try {
                        dataUrl = tmpCanvas.toDataURL('image/png');
                    } catch (e) { /* ignore */ }
                    try { instance.destroy(); } catch (e) { /* ignore */ }
                    return dataUrl;
                });
            })
            .then(dataUrl => {
                if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
                if (ChartGlobal && ChartGlobal.defaults) {
                    ChartGlobal.defaults.animation = prevAnim;
                    ChartGlobal.defaults.animations = prevAnimations;
                    ChartGlobal.defaults.transitions = prevTransitions;
                }
                if (!dataUrl) return null;
                const img = document.createElement('img');
                img.src = dataUrl;
                img.style.width = '100%';
                img.style.display = 'block';
                return img;
            });
    }

    function pdfAppendChartSection(stage, label, chartFn) {
        stage.appendChild(pdfSectionHeading(label));
        const chartWrap = document.createElement('div');
        chartWrap.className = 'pdf-chart-wrapper';
        stage.appendChild(chartWrap);
        return pdfRenderChartToImage(chartFn, 900, 420).then(img => {
            if (img) {
                chartWrap.appendChild(img);
            } else {
                chartWrap.innerHTML = `<div style="padding:2rem;text-align:center;color:#8aa0b3;font-size:0.85rem;">${t('org.analytics.pdf.noChartData')}</div>`;
            }
        });
    }

    function pdfBuildOverviewStaging() {
        const d = loadData();
        if (!d) return Promise.resolve(null);

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const titleBanner = document.createElement('div');
        titleBanner.className = 'pdf-report-title-banner';
        titleBanner.innerHTML = `<h2><i class="fa-solid fa-chart-bar"></i> ${t('org.analytics.pdf.overviewTitle')}</h2>` +
            `<p>${t('org.analytics.pdf.generatedOn')}${pdfDateString()}</p>`;
        stage.appendChild(titleBanner);

        const kpiSource = document.querySelector('#ana-panel-overview .ana-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.kpiSection')));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const hlSource = document.querySelector('#ana-panel-overview .ana-highlight-grid');
        if (hlSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.highlightsSection')));
            stage.appendChild(hlSource.cloneNode(true));
        }

        const overviewCharts = [
            { label: t('org.analytics.pdf.section.attendanceByEvent'),   fn: ctx => chartAttendance(ctx, d) },
            { label: t('org.analytics.pdf.section.revenueByEvent'),      fn: ctx => chartRevenue(ctx, d) },
            { label: t('org.analytics.pdf.section.servicesDistribution'), fn: ctx => chartServices(ctx, d) },
            { label: t('org.analytics.pdf.section.eventCategories'),     fn: ctx => chartCategories(ctx, d) }
        ];

        return overviewCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    function pdfBuildEventStaging(eventId) {
        const d = loadData();
        if (!d) return Promise.resolve(null);
        const evt = d.events.find(e => e.id === eventId);
        if (!evt) return Promise.resolve(null);

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const bannerSource = document.querySelector('.ana-evt-title-banner');
        if (bannerSource) {
            stage.appendChild(bannerSource.cloneNode(true));
            const clonedBtn = stage.querySelector('#ana-evt-export-pdf');
            if (clonedBtn) clonedBtn.remove();
        }

        const kpiSource = document.querySelector('.evt-report-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.kpiSection')));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const evtCharts = [
            { label: t('org.analytics.pdf.section.revenueByTier'),  fn: ctx => evtChartRevenueTier(ctx, eventId, d) },
            { label: t('org.analytics.pdf.section.ageGroups'),      fn: ctx => evtChartAgeGroups(ctx, eventId, d) },
            { label: t('org.analytics.pdf.section.regTimeline'),    fn: ctx => evtChartRegTimeline(ctx, eventId, d) },
            { label: t('org.analytics.pdf.section.vendorServices'), fn: ctx => evtChartVendorServices(ctx, eventId, d) }
        ];

        return evtCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    function runFullPDFExport(stagingPromise, filename, triggerBtn, metaTitle) {
        const btn = triggerBtn || null;
        const originalHTML = btn ? btn.innerHTML : '';

        function resetExportButton() {
            if (!btn) return;
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${t('org.analytics.pdf.generating')}</span>`;
        }

        if (window.location.protocol === 'file:') {
            alert(t('org.analytics.pdf.fileError'));
            resetExportButton();
            return;
        }

        const jspdfMod = window.jspdf;
        const JsPDF = jspdfMod && (jspdfMod.jsPDF || jspdfMod);
        if (typeof JsPDF !== 'function') {
            alert(t('org.analytics.pdf.libError'));
            resetExportButton();
            return;
        }
        if (typeof html2canvas !== 'function') {
            alert(t('org.analytics.pdf.h2cError'));
            resetExportButton();
            return;
        }

        const captureMs = 120000;
        const canvasScale = Math.min(3, Math.max(2.35, (window.devicePixelRatio || 1) * 2.25));
        const canvasOpts = pdfMakeCanvasOpts(canvasScale);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(t('org.analytics.pdf.timeout'))), captureMs);
        });

        let stagingEl = null;

        stagingPromise
            .then(el => {
                if (!el) throw new Error(t('org.analytics.pdf.cantBuild'));
                stagingEl = el;
                document.body.appendChild(stagingEl);
                return pdfWaitForLayoutStable();
            })
            .then(() => Promise.race([html2canvas(stagingEl, canvasOpts), timeoutPromise]))
            .then(canvas => {
                if (!canvas.width || !canvas.height) throw new Error(t('org.analytics.pdf.emptyShot'));
                let imgData;
                try {
                    imgData = canvas.toDataURL('image/png');
                } catch (e) {
                    throw new Error(t('org.analytics.pdf.cantRead'));
                }

                const pdfW = 210;
                const margin = 12;
                const contentW = pdfW - margin * 2;
                const contentH = (canvas.height * contentW) / canvas.width;

                const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                try {
                    pdf.setProperties({
                        title: metaTitle || 'Eventia analytics report',
                        subject: 'Exported from Eventia organizer dashboard',
                        creator: 'Eventia'
                    });
                } catch (e) { /* ignore */ }

                const pageH = pdf.internal.pageSize.getHeight() - margin * 2;
                let yOffset = 0;
                while (yOffset < contentH) {
                    if (yOffset > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, margin - yOffset, contentW, contentH);
                    yOffset += pageH;
                }
                pdf.save(filename);
            })
            .catch(err => {
                console.error('PDF export failed:', err);
                const hint = err && err.message ? t('org.analytics.pdf.detailsPrefix') + err.message : '';
                alert(t('org.analytics.pdf.cantGenerate') + hint);
            })
            .finally(() => {
                if (stagingEl && stagingEl.parentNode) stagingEl.parentNode.removeChild(stagingEl);
                resetExportButton();
            });
    }

    /* ----------------------------------------------------------
       PDF STAGING — Attendees panel
    ---------------------------------------------------------- */
    function pdfBuildAttendeesStaging() {
        const d = loadData();
        if (!d) return Promise.resolve(null);

        /* Match on-screen KPIs (same as switching to this panel). */
        renderAttendeesPanel();

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const titleBanner = document.createElement('div');
        titleBanner.className = 'pdf-report-title-banner';
        titleBanner.innerHTML = `<h2><i class="fa-solid fa-users"></i> ${t('org.analytics.pdf.attendeesTitle')}</h2>` +
            `<p>${t('org.analytics.pdf.generatedOn')}${pdfDateString()}</p>`;
        stage.appendChild(titleBanner);

        const kpiSource = document.querySelector('#ana-panel-attendees .ana-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.kpiSection')));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const attendeeCharts = [
            { label: t('org.analytics.pdf.section.attByAgeGroup'), fn: ctx => chartAgeGroups(ctx, d) },
            { label: t('org.analytics.pdf.section.ticketTypes'),   fn: ctx => chartTicketTypes(ctx, d) },
            { label: t('org.analytics.pdf.section.satByCategory'), fn: ctx => chartSatisfactionByCategory(ctx, d) }
        ];

        return attendeeCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    /* ----------------------------------------------------------
       PDF STAGING — Vendors panel
    ---------------------------------------------------------- */
    function pdfBuildVendorsStaging() {
        const d = loadData();
        if (!d) return Promise.resolve(null);

        renderVendorsPanel();

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const titleBanner = document.createElement('div');
        titleBanner.className = 'pdf-report-title-banner';
        titleBanner.innerHTML = `<h2><i class="fa-solid fa-store"></i> ${t('org.analytics.pdf.vendorsTitle')}</h2>` +
            `<p>${t('org.analytics.pdf.generatedOn')}${pdfDateString()}</p>`;
        stage.appendChild(titleBanner);

        const kpiSource = document.querySelector('#ana-panel-vendors .ana-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.kpiSection')));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const hlSource = document.querySelector('#ana-panel-vendors .ana-highlight-grid');
        if (hlSource) {
            stage.appendChild(pdfSectionHeading(t('org.analytics.pdf.highlightsSection')));
            stage.appendChild(hlSource.cloneNode(true));
        }

        const vendorCharts = [
            { label: t('org.analytics.pdf.section.categoryDist'),    fn: ctx => vndChartCategoryDist(ctx, d) },
            { label: t('org.analytics.pdf.section.statusBreakdown'), fn: ctx => vndChartStatusBreakdown(ctx, d) },
            { label: t('org.analytics.pdf.section.vendorsPerEvent'), fn: ctx => vndChartVendorsPerEvent(ctx, d) }
        ];

        return vendorCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    /* ----------------------------------------------------------
       PDF STAGING — Market Insights panel
    ---------------------------------------------------------- */
    function pdfBuildMarketStaging() {
        const d = loadData();
        if (!d) return Promise.resolve(null);

        const tierForPdf = document.getElementById('ana-market-tier-select')?.value || 'all';

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const titleBanner = document.createElement('div');
        titleBanner.className = 'pdf-report-title-banner';
        titleBanner.innerHTML = `<h2><i class="fa-solid fa-lightbulb"></i> ${t('org.analytics.pdf.marketTitle')}</h2>` +
            `<p>${t('org.analytics.pdf.generatedOn')}${pdfDateString()}</p>`;
        stage.appendChild(titleBanner);

        const avgPriceLabel = tierForPdf === 'all'
            ? t('org.analytics.pdf.section.avgPriceByCat')
            : t('org.analytics.pdf.section.avgPriceByCatFmt').replace('{tier}', tierForPdf);

        const marketCharts = [
            { label: t('org.analytics.pdf.section.eventsByMonth'),    fn: ctx => chartEventsPerMonth(ctx, d) },
            { label: avgPriceLabel,                                   fn: ctx => chartAvgTicketPrice(ctx, d, tierForPdf) },
            { label: t('org.analytics.pdf.section.revenuePotential'), fn: ctx => chartRevenuePotential(ctx, d) }
        ];

        return marketCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    /* Delegated click routing — a single document-level handler dispatches
       each analytics export button by id. Using delegation makes the export
       buttons immune to DOM timing, panel visibility, or re-renders. */
    const EXPORT_ROUTES = {
        'ana-overview-export-pdf': (btn) => {
            runFullPDFExport(
                pdfBuildOverviewStaging(),
                'Eventia_Overview_Report.pdf',
                btn,
                t('org.analytics.pdf.overviewTitle')
            );
        },
        'ana-evt-export-pdf': (btn) => {
            if (!selectedEventId) return;
            const evtNameEl = document.getElementById('ana-evt-title-name');
            const name = evtNameEl
                ? evtNameEl.textContent.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_')
                : 'Event';
            runFullPDFExport(
                pdfBuildEventStaging(selectedEventId),
                'Eventia_Report_' + name + '.pdf',
                btn,
                'Eventia — ' + (evtNameEl ? evtNameEl.textContent.trim() : t('org.analytics.pdf.eventTitleFallback'))
            );
        },
        'ana-attendees-export-pdf': (btn) => {
            runFullPDFExport(
                pdfBuildAttendeesStaging(),
                'Eventia_Attendees_Report.pdf',
                btn,
                t('org.analytics.pdf.attendeesTitle')
            );
        },
        'ana-vendors-export-pdf': (btn) => {
            runFullPDFExport(
                pdfBuildVendorsStaging(),
                'Eventia_Vendors_Report.pdf',
                btn,
                t('org.analytics.pdf.vendorsTitle')
            );
        },
        'ana-market-export-pdf': (btn) => {
            runFullPDFExport(
                pdfBuildMarketStaging(),
                'Eventia_Market_Insights_Report.pdf',
                btn,
                t('org.analytics.pdf.marketTitle')
            );
        }
    };

    function initExportButtons() {
        if (document.__eventiaExportDelegated) return;
        document.__eventiaExportDelegated = true;

        document.addEventListener('click', (e) => {
            const btn = e.target && e.target.closest
                ? e.target.closest('.ana-export-pdf-btn')
                : null;
            if (!btn || btn.disabled) return;
            const route = EXPORT_ROUTES[btn.id];
            if (!route) return;
            e.preventDefault();
            try {
                route(btn);
            } catch (err) {
                console.error('Export button failed:', err);
                alert(t('org.analytics.pdf.cantStart'));
            }
        });
    }

    /* ----------------------------------------------------------
       MAIN ENTRY  –  called by switchView('analytics')
    ---------------------------------------------------------- */
    window.renderAnalytics = async function () {
        cachedData = await fetchAnalyticsData();
        renderKPIs(cachedData);
        renderHighlights(cachedData);
        renderCurrentChart();

        const sel = document.getElementById('ana-event-select');
        if (sel && cachedData.events) {
            const v = sel.value;
            populateEventDropdown(cachedData.events);
            if (v) sel.value = v;
        }
        if (selectedEventId) {
            renderEventReport(selectedEventId);
        }

        const activePanel = document.querySelector('.ana-main-panel.active');
        const pid = activePanel && activePanel.id;
        if (pid === 'ana-panel-attendees') {
            renderAttendeesPanel();
        } else if (pid === 'ana-panel-market-insights') {
            renderMarketInsights();
        } else if (pid === 'ana-panel-vendors') {
            renderVendorsPanel();
        }
    };

    initMainTabs();
    initTabs();
    initAttTabs();
    initEvtTabs();
    initMarketTabs();
    initVndTabs();
    initEventSelector();
    initExportButtons();

    /* Refresh chart-rendered copy when organizer uses the lang switch (applyLang). */
    if (typeof window.applyLang === 'function' && !window.__eventiaAnalyticsLangHook) {
        window.__eventiaAnalyticsLangHook = true;
        const _prevApplyLang = window.applyLang;
        window.applyLang = function (lang) {
            _prevApplyLang(lang);
            if (typeof window.renderAnalytics === 'function') {
                const p = window.renderAnalytics();
                if (p && typeof p.then === 'function') p.catch(() => {});
            }
        };
    }
});
