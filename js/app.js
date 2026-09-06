// Mania Salgados - Core Application Logic
// Externalized to comply with strict CSP (script-src 'self')

(function () {
    'use strict';

    // Configurações Dinâmicas e Condicionais do Cliente
    const CLIENT_DATA = {
        whatsapp: "554833656022",
        phoneFormatted: "(48) 33656022",
        address: "R. Prof. Bayer Filho, 305 - Coqueiros, Florianópolis - SC, 88080300",
        hasPositiveReviews: true, // Avaliação Google 4.7 com 149 avaliações reais
        defaultMessage: "Olá, vim pelo site e gostaria de um atendimento!"
    };

    // Atribui a logo oficial aos elementos de imagem
    const brandLogoSrc = 'logo.png';
    const headerLogoEl = document.getElementById('headerLogo');
    const footerLogoEl = document.getElementById('footerLogo');
    if (headerLogoEl) headerLogoEl.src = brandLogoSrc;
    if (footerLogoEl) footerLogoEl.src = brandLogoSrc;

    // WhatsApp Dynamic Link Generator com encodeURIComponent
    function openWhatsApp(customMessage) {
        if (!CLIENT_DATA.whatsapp) return;
        const message = customMessage || CLIENT_DATA.defaultMessage;
        const encodedText = encodeURIComponent(message);
        const url = 'https://wa.me/' + CLIENT_DATA.whatsapp + '?text=' + encodedText;
        window.open(url, '_blank');
    }

    // Regra de Seções Inteligentes: Caso não exista WhatsApp ou Endereço, oculta elementos correspondentes
    function initSmartSections() {
        if (!CLIENT_DATA.whatsapp || CLIENT_DATA.whatsapp.trim() === '') {
            document.querySelectorAll('.whatsapp-dependent').forEach(el => el.remove());
        }
        if (!CLIENT_DATA.address || CLIENT_DATA.address.trim() === '') {
            document.querySelectorAll('.location-dependent').forEach(el => el.remove());
        }
        if (!CLIENT_DATA.hasPositiveReviews) {
            document.querySelectorAll('.reviews-dependent').forEach(el => el.remove());
        }
    }

    // Delegated click handler for WhatsApp buttons
    function initWhatsAppListeners() {
        document.addEventListener('click', (e) => {
            const waTarget = e.target.closest('[data-whatsapp-msg]');
            if (waTarget) {
                e.preventDefault();
                const msg = waTarget.getAttribute('data-whatsapp-msg');
                openWhatsApp(msg);
            }
        });
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }

    // Category Filter (Menu Showcase)
    function filterCategory(cat, activeBtn) {
        document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');

        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (cat === 'all' || card.classList.contains(cat)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function initFilters() {
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const cat = pill.getAttribute('data-filter') || 'all';
                filterCategory(cat, pill);
            });
        });
    }

    // Interactive Party Calculator Logic (Números agrupados de forma contínua)
    let guests = 30;
    let eventType = 'adult';

    const guestDisplay = document.getElementById('guestCountDisplay');
    const salgadosDisplay = document.getElementById('totalSalgadosDisplay');
    const centosDisplay = document.getElementById('totalCentosDisplay');
    const btnAdult = document.getElementById('btnAdult');
    const btnKids = document.getElementById('btnKids');

    function updateCalculator() {
        if (!guestDisplay || !salgadosDisplay || !centosDisplay) return;

        if (guests < 5) guests = 5;
        if (guests > 500) guests = 500;

        guestDisplay.textContent = guests;

        const multiplier = eventType === 'adult' ? 12 : 8;
        const totalSalgados = guests * multiplier;
        const totalCentos = Math.ceil(totalSalgados / 100);

        salgadosDisplay.textContent = totalSalgados;
        centosDisplay.textContent = totalCentos;
    }

    function changeGuests(amount) {
        guests += amount;
        updateCalculator();
    }

    function setEventType(type) {
        eventType = type;
        if (!btnAdult || !btnKids) return;
        if (type === 'adult') {
            btnAdult.className = "py-3 px-4 rounded-xl border-2 border-brand-500 bg-brand-500/10 text-brand-700 font-bold text-xs uppercase tracking-wider transition-all";
            btnKids.className = "py-3 px-4 rounded-xl border-2 border-brand-200 text-stone-600 font-bold text-xs uppercase tracking-wider hover:border-brand-300 transition-all";
        } else {
            btnKids.className = "py-3 px-4 rounded-xl border-2 border-brand-500 bg-brand-500/10 text-brand-700 font-bold text-xs uppercase tracking-wider transition-all";
            btnAdult.className = "py-3 px-4 rounded-xl border-2 border-brand-200 text-stone-600 font-bold text-xs uppercase tracking-wider hover:border-brand-300 transition-all";
        }
        updateCalculator();
    }

    function orderFromCalculator() {
        const eventName = eventType === 'adult' ? 'Festa Adulta / Empresa' : 'Festa Infantil / Família';
        const multiplier = eventType === 'adult' ? 12 : 8;
        const totalSalgados = guests * multiplier;
        const totalCentos = Math.ceil(totalSalgados / 100);
        
        const msg = 'Olá, fiz uma simulação na Calculadora do site da Mania Salgados!\n\n• Convidados: ' + guests + ' pessoas\n• Tipo: ' + eventName + '\n• Estimativa sugerida: ' + totalSalgados + ' salgados (~' + totalCentos + ' centos)\n\nGostaria de solicitar um orçamento e ver as opções de sabores!';
        openWhatsApp(msg);
    }

    function initCalculator() {
        const btnMinus = document.getElementById('btnDecreaseGuests');
        const btnPlus = document.getElementById('btnIncreaseGuests');
        const btnOrder = document.getElementById('btnOrderCalculator');

        if (btnMinus) {
            btnMinus.addEventListener('click', () => changeGuests(-5));
        }
        if (btnPlus) {
            btnPlus.addEventListener('click', () => changeGuests(5));
        }
        if (btnAdult) {
            btnAdult.addEventListener('click', () => setEventType('adult'));
        }
        if (btnKids) {
            btnKids.addEventListener('click', () => setEventType('kids'));
        }
        if (btnOrder) {
            btnOrder.addEventListener('click', () => orderFromCalculator());
        }

        updateCalculator();
    }

    // Initialize all logic on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initSmartSections();
            initWhatsAppListeners();
            initMobileMenu();
            initFilters();
            initCalculator();
        });
    } else {
        initSmartSections();
        initWhatsAppListeners();
        initMobileMenu();
        initFilters();
        initCalculator();
    }
})();
