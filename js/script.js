/* ============================================
   MANAUS AUTO PEÇAS – script.js
   Versão simplificada para maior clareza e performance
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. MENU MOBILE (Abrir e Fechar)
     ============================================ */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link, .mobile-menu .btn');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : ''; // Evita scroll na página com menu aberto
  }

  // Clica no botão hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  // Fecha o menu ao clicar em um link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });


  /* ============================================
     2. CABEÇALHO FIXO (Sombra ao rolar a página)
     ============================================ */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Adiciona classe 'scrolled' (que coloca a sombra) se rolar mais de 20px
    if (header) {
      header.classList.toggle('scrolled', scrollY > 20);
    }
  }, { passive: true });


  /* ============================================
     3. MARCAR LINK ATIVO NO MENU AO ROLAR
     ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      
      // Se o meio da tela estiver dentro da seção, marca o link correspondente
      if (scrollMid >= top && scrollMid < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ============================================
     4. SLIDER PRINCIPAL (HERO)
     ============================================ */
  if (document.getElementById('hero-swiper')) {
    new Swiper('#hero-swiper', {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: {
        el: '.hero-pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.hero-prev',
        nextEl: '.hero-next',
      }
    });
  }


  /* ============================================
     5. CARROSSEL DA LOJA (Sobre Nós)
     ============================================ */
  if (document.getElementById('store-swiper')) {
    new Swiper('#store-swiper', {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.store-pagination',
        clickable: true,
      }
    });
  }


  /* ============================================
     6. CARROSSEL DE MARCAS
     ============================================ */
  if (document.getElementById('brands-swiper')) {
    new Swiper('#brands-swiper', {
      loop: true,
      speed: 600,
      slidesPerView: 2,
      spaceBetween: 20,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        prevEl: '#brands-prev',
        nextEl: '#brands-next',
      },
      // Responsividade do carrossel
      breakpoints: {
        480: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 24 },
        1024: { slidesPerView: 5, spaceBetween: 24 },
        1200: { slidesPerView: 6, spaceBetween: 28 },
      }
    });
  }


  /* ============================================
     6. ANIMAÇÃO DE NÚMEROS (Contadores)
     ============================================ */
  function animateCount(el, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cálculo linear simples
      const current = Math.round(start + (target - start) * progress);
      
      // Formata números grandes ex: 10000 vira 10K
      el.textContent = current >= 1000 ? (current / 1000).toFixed(0) + 'K' : current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target >= 1000 ? (target / 1000).toFixed(0) + 'K' : target;
      }
    }
    requestAnimationFrame(update);
  }

  // Usa IntersectionObserver para só rodar a animação quando a seção aparecer na tela
  const counterEls = document.querySelectorAll('.stat-item__number');
  let countersStarted = false;

  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counterEls.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            animateCount(el, target);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsBanner = document.getElementById('stats');
    if (statsBanner) counterObserver.observe(statsBanner);
  }


  /* ============================================
     7. BOTÃO VOLTAR AO TOPO
     ============================================ */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      // Mostra o botão após descer 400px
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================
     8. ROLAGEM SUAVE NOS LINKS (Âncoras)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();

      // Calcula a posição descontando o cabeçalho fixo
      const headerH = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ============================================
     9. FORMULÁRIO DE ORÇAMENTO (Redireciona pro WhatsApp)
     ============================================ */
  const quoteForm = document.getElementById('quote-form');
  const phoneInput = document.getElementById('form-whatsapp');

  // Máscara simples de telefone enquanto digita
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, ''); // Remove o que não é número
      if (val.length > 11) val = val.slice(0, 11);
      
      if (val.length > 7) {
        val = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3,7)}-${val.slice(7)}`;
      } else if (val.length > 6) {
        val = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3)}`;
      } else if (val.length > 2) {
        val = `(${val.slice(0,2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }

  // Validar e enviar form
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('form-nome');
      const whatsapp = document.getElementById('form-whatsapp');
      const peca = document.getElementById('form-peca');
      const veiculo = document.getElementById('form-veiculo');
      const ano = document.getElementById('form-ano');
      const mensagem = document.getElementById('form-mensagem');

      let valid = true;

      // Limpar erros anteriores
      [nome, whatsapp, peca].forEach(el => {
        el.classList.remove('error');
      });

      // Validar campos
      if (!nome.value.trim()) { nome.classList.add('error'); valid = false; }
      if (!whatsapp.value.trim() || whatsapp.value.replace(/\D/g,'').length < 10) { whatsapp.classList.add('error'); valid = false; }
      if (!peca.value.trim()) { peca.classList.add('error'); valid = false; }

      if (!valid) {
        alert("Por favor, preencha corretamente os campos obrigatórios (*).");
        return;
      }

      // Montar mensagem para o WhatsApp
      const lines = [
        `*Olá, Manaus Auto Peças!*`,
        ``,
        `Gostaria de solicitar um orçamento:`,
        ``,
        `*Nome:* ${nome.value.trim()}`,
        `*WhatsApp:* ${whatsapp.value.trim()}`,
      ];

      if (veiculo.value.trim()) {
        const anoStr = ano.value.trim() ? ` (${ano.value.trim()})` : '';
        lines.push(`*Veículo:* ${veiculo.value.trim()}${anoStr}`);
      }

      lines.push(`*Peça(s):* ${peca.value.trim()}`);

      if (mensagem.value.trim()) {
        lines.push(`*Observações:* ${mensagem.value.trim()}`);
      }

      // Converte texto para formato aceito em URL
      const waMessage = encodeURIComponent(lines.join('\n'));
      const waNumber = '5592991266860';
      const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

      // Feedback de envio
      const submitBtn = document.getElementById('form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Redirecionando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer'); // Abre WhatsApp em nova guia
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        quoteForm.reset();
      }, 500);
    });
  }

});
