(() => {
  // ========================================
  // NAVIGASI
  // ========================================
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
      toggle.setAttribute('aria-label', expanded ? 'Buka menu navigasi' : 'Tutup menu navigasi');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka menu navigasi');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Tahun footer
  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  // ========================================
  // CV
  // ========================================
  const cvLink = document.querySelector('[data-cv-link]');

  if (cvLink) {
    fetch('assets/documents/cv.pdf', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          cvLink.href = 'assets/documents/cv.pdf';
          cvLink.target = '_blank';
          cvLink.rel = 'noopener';
          cvLink.removeAttribute('aria-disabled');
          cvLink.textContent = 'Lihat CV PDF ↗';
        }
      })
      .catch(() => {
        // Tombol tetap nonaktif jika file belum tersedia.
      });
  }

  // ========================================
  // MODAL PROYEK
  // ========================================
  const projectModal = document.querySelector('#project-modal');
  const projectDialog = projectModal?.querySelector('.project-modal-dialog');
  const projectButtons = document.querySelectorAll('.project-detail-button');
  const modalCloseButtons = projectModal?.querySelectorAll('[data-modal-close]');

  const modalTitle = document.querySelector('#modal-project-title');
  const modalCategory = document.querySelector('#modal-project-category');
  const modalImage = document.querySelector('#modal-project-image');
  const modalDescription = document.querySelector('#modal-project-description');
  const modalObjective = document.querySelector('#modal-project-objective');
  const modalTechnologies = document.querySelector('#modal-project-technologies');
  const modalFeatures = document.querySelector('#modal-project-features');
  const modalNotes = document.querySelector('#modal-project-notes');
  const modalNotesSection = document.querySelector('#modal-project-notes-section');
  const modalPrototypeSection = document.querySelector('#modal-project-prototype-section');
  const modalPrototypeLink = document.querySelector('#modal-project-prototype-link');

  const galleryMain = projectModal?.querySelector('.project-gallery-stage');
  const galleryCaption = document.querySelector('#gallery-caption');
  const galleryCounter = document.querySelector('#gallery-counter');
  const galleryThumbnails = document.querySelector('#gallery-thumbnails');
  const galleryPrev = document.querySelector('#gallery-prev');
  const galleryNext = document.querySelector('#gallery-next');

  let activeProject = null;
  let activeImageIndex = 0;
  let lastFocusedElement = null;
  let galleryAnimating = false;
  let galleryAnimationTimer = null;
  let resetProjectImageZoom = () => {};

  // ========================================
  // DATA PROYEK
  // ========================================
  const projectData = {
    absa: {
      category: 'DATA SCIENCE / TUGAS AKHIR',
      title: 'Analisis Sentimen Berbasis Aspek (ABSA)',
      description: 'Penelitian analisis sentimen pada unggahan X mengenai isu utang Kereta Cepat Jakarta–Bandung (Whoosh). Penelitian berfokus pada klasifikasi sentimen berdasarkan aspek ekonomi, pemerintah, dan sosial.',
      objective: 'Menganalisis pengaruh Borderline-SMOTE terhadap kinerja klasifikasi sentimen per aspek menggunakan pendekatan machine learning.',
      technologies: [
        'Python',
        'TF-IDF',
        'Multinomial Naïve Bayes',
        'Binary Relevance',
        'Borderline-SMOTE'
      ],
      features: [
        'Pengolahan dan pembersihan teks unggahan X.',
        'Representasi teks menggunakan TF-IDF.',
        'Klasifikasi multilabel untuk sembilan label sentimen pada tiga aspek.',
        'Penanganan ketidakseimbangan kelas menggunakan Borderline-SMOTE.',
        'Evaluasi model menggunakan metrik klasifikasi.'
      ],
      images: [
        {
          src: 'assets/images/projects/absa-1.jpg',
          alt: '',
          caption: 'Hasil metrik evaluasi model final tuning'
        },
        {
          src: 'assets/images/projects/absa-2.jpg',
          alt: '',
          caption: 'Hasil percobaan data baru — 1'
        },
        {
          src: 'assets/images/projects/absa-3.jpg',
          alt: '',
          caption: 'Hasil percobaan data baru — 2'
        },
        {
          src: 'assets/images/projects/absa-4.jpg',
          alt: '',
          caption: 'Distribusi dataset per-aspek'
        },
        {
          src: 'assets/images/projects/absa-5.jpg',
          alt: '',
          caption: 'Distribusi sentimen setiap aspek'
        },
        {
          src: 'assets/images/projects/absa-6.jpg',
          alt: '',
          caption: 'Distribusi data sebelum dan setelah resampling'
        }
      ]
    },

    wedding: {
      category: 'WEB DEVELOPMENT / PERSONAL PROJECT',
      title: 'Website Undangan Pernikahan',
      description: 'Website undangan pernikahan digital yang dikembangkan menggunakan PHP Native dan basis data MySQL/MariaDB, dengan halaman undangan untuk tamu dan dashboard administrasi.',
      objective: 'Membangun website undangan digital yang memudahkan pengelolaan informasi acara, konfirmasi kehadiran, dan interaksi dengan tamu undangan.',
      technologies: [
        'PHP Native',
        'MySQL / MariaDB',
        'HTML',
        'CSS',
        'JavaScript',
        'SweetAlert2',
        'Font Awesome'
      ],
      features: [
        'RSVP atau konfirmasi kehadiran tamu.',
        'Pengelolaan data tamu undangan.',
        'Pengiriman ucapan dan komentar.',
        'Pengelolaan hadiah.',
        'Dashboard admin.',
        'Pencatatan kunjungan pada website.'
      ],
      images: [
        {
          src: 'assets/images/projects/wedding-1.jpg',
          alt: 'Pratinjau cover undangan',
          caption: 'Cover saat pertama membuka website'
        },
        {
          src: 'assets/images/projects/wedding-2.jpg',
          alt: 'Pratinjau halaman utama undangan',
          caption: 'Halaman utama undangan'
        },
        {
          src: 'assets/images/projects/wedding-3.jpg',
          alt: 'Pratinjau informasi mempelai',
          caption: 'Informasi mempelai'
        },
        {
          src: 'assets/images/projects/wedding-4.jpg',
          alt: 'Pratinjau hitung mundur acara',
          caption: 'Countdown menuju hari pernikahan'
        },
        {
          src: 'assets/images/projects/wedding-5.jpg',
          alt: 'Pratinjau detail alamat acara',
          caption: 'Detail alamat dan Google Maps'
        },
        {
          src: 'assets/images/projects/wedding-6.jpg',
          alt: 'Pratinjau galeri foto mempelai',
          caption: 'Galeri mempelai'
        },
        {
          src: 'assets/images/projects/wedding-7.jpg',
          alt: 'Pratinjau halaman RSVP',
          caption: 'Konfirmasi kehadiran'
        },
        {
          src: 'assets/images/projects/wedding-8.jpg',
          alt: 'Pratinjau formulir ucapan',
          caption: 'Formulir ucapan'
        },
        {
          src: 'assets/images/projects/wedding-9.jpg',
          alt: 'Pratinjau halaman utama admin',
          caption: 'Halaman utama admin'
        },
        {
          src: 'assets/images/projects/wedding-10.jpg',
          alt: 'Pratinjau data tamu',
          caption: 'Data tamu'
        },
        {
          src: 'assets/images/projects/wedding-11.jpg',
          alt: 'Pratinjau formulir data tamu',
          caption: 'Formulir pengelolaan data tamu'
        },
        {
          src: 'assets/images/projects/wedding-12.jpg',
          alt: 'Pratinjau detail konfirmasi kehadiran',
          caption: 'Detail konfirmasi kehadiran tamu'
        },
        {
          src: 'assets/images/projects/wedding-13.jpg',
          alt: 'Pratinjau data ucapan tamu',
          caption: 'Data ucapan tamu'
        },
        {
          src: 'assets/images/projects/wedding-14.jpg',
          alt: 'Pratinjau pengelolaan hadiah',
          caption: 'Detail hadiah yang diterima'
        }
      ]
    },

    petfinder: {
      category: 'UI/UX DESIGN / MOBILE APPLICATION',
      title: 'PetFinder — Mobile App Design',
      description: 'Perancangan antarmuka aplikasi mobile PetFinder untuk mendukung pencarian dan adopsi hewan peliharaan serta penyampaian informasi hewan hilang dan ditemukan.',
      objective: 'Menyajikan pengalaman aplikasi mobile yang memudahkan pengguna menjelajahi informasi hewan, melihat detail hewan, dan mengakses fitur Lost & Found.',
      technologies: ['Figma', 'UI Design', 'Interactive Prototype'],
      features: [
        'Desain halaman pembuka dan login.',
        'Tampilan penelusuran dan adopsi hewan.',
        'Halaman detail hewan.',
        'Informasi hewan yang ditemukan melalui fitur Found.',
        'Prototype interaktif untuk memperlihatkan alur antarmuka.'
      ],
      prototype: 'LINK_PROTOTYPE_FIGMA_KAMU',
      images: [
        { 
          src: 'assets/images/projects/petfinder-1.jpg', 
          alt: 'Loading screen dan login PetFinder', 
          caption: 'Loading & Login Screen' 
        },
        { 
          src: 'assets/images/projects/petfinder-2.jpg', 
          alt: 'Dua layar halaman adopsi hewan PetFinder', 
          caption: 'Pet Adoption' 
        },
        { src: 'assets/images/projects/petfinder-3.jpg', 
          alt: 'Halaman detail hewan yang ditemukan di PetFinder', 
          caption: 'Found Pet Details' 
        }
      ]
    },

    inventory: {
      category: 'PENGALAMAN MAGANG',
      title: 'Sistem Pengadaan & Inventaris Internal',
      description: 'Pengembangan lanjutan sistem internal untuk mendukung proses pengadaan, layanan, penerimaan dan pengeluaran barang, serta pemantauan persediaan di gudang cabang.',
      objective: 'Mendukung pencatatan alur pengadaan dan pergerakan barang agar proses administrasi serta pemantauan stok gudang cabang lebih terstruktur.',
      technologies: [
        'Web Application',
        'Procurement',
        'Inventory Management',
        'Workflow'
      ],
      features: [
        'Pengelolaan proses Internal Memo.',
        'Pengelolaan PR BPPB.',
        'Pencatatan Goods Receipt dan Goods Issue (GR/GI).',
        'Pencatatan tanda terima barang.',
        'Pengelolaan proses layanan (Service).',
        'Pemantauan barang masuk, barang keluar, dan sisa stok gudang cabang.'
      ],
      images: [
        {
          src: 'assets/images/projects/inventory-1.jpg',
          alt: '',
          caption: 'Halaman procurement — internal memo'
        },
        {
          src: 'assets/images/projects/inventory-2.jpg',
          alt: '',
          caption: 'Internal memo — form input data'
        },
        {
          src: 'assets/images/projects/inventory-3.jpg',
          alt: '',
          caption: 'Halaman procurement — purchase request'
        },
        {
          src: 'assets/images/projects/inventory-4.jpg',
          alt: '',
          caption: 'Halaman procurement — good receive'
        },
        {
          src: 'assets/images/projects/inventory-5.jpg',
          alt: '',
          caption: 'Halaman procurement — tanda terima'
        },
        {
          src: 'assets/images/projects/inventory-6.jpg',
          alt: '',
          caption: 'Halaman kartu stock'
        }
      ]
    }
  };

  // ========================================
  // RENDER GALERI
  // ========================================
  function renderProjectGallery() {
    if (!activeProject || !modalImage) return;

    const images = activeProject.images || [];

    if (!images.length) {
      modalImage.removeAttribute('src');
      modalImage.alt = '';
      if (galleryCaption) galleryCaption.textContent = 'Belum ada gambar proyek.';
      if (galleryCounter) galleryCounter.textContent = '0 / 0';
      if (galleryThumbnails) galleryThumbnails.replaceChildren();
      resetProjectImageZoom();
      return;
    }

    activeImageIndex = (activeImageIndex + images.length) % images.length;
    const currentImage = images[activeImageIndex];

    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt || currentImage.caption || 'Gambar proyek';

    if (galleryCaption) galleryCaption.textContent = currentImage.caption || '';
    if (galleryCounter) {
      galleryCounter.textContent = `${activeImageIndex + 1} / ${images.length}`;
    }

    if (galleryThumbnails) {
      galleryThumbnails.replaceChildren();

      images.forEach((image, index) => {
        const thumbnail = document.createElement('button');
        thumbnail.type = 'button';
        thumbnail.className = 'gallery-thumbnail';
        thumbnail.setAttribute(
          'aria-label',
          `Tampilkan gambar ${index + 1}: ${image.caption || ''}`
        );
        thumbnail.setAttribute('aria-pressed', String(index === activeImageIndex));

        const thumbnailImage = document.createElement('img');
        thumbnailImage.src = image.src;
        thumbnailImage.alt = '';
        thumbnailImage.loading = 'lazy';

        thumbnail.appendChild(thumbnailImage);

        thumbnail.addEventListener('click', () => {
          if (galleryAnimating || index === activeImageIndex) return;
          changeGalleryImage(index > activeImageIndex ? 1 : -1, index);
        });

        galleryThumbnails.appendChild(thumbnail);
      });
    }

    if (galleryPrev) galleryPrev.disabled = images.length < 2;
    if (galleryNext) galleryNext.disabled = images.length < 2;

    resetProjectImageZoom();
  }

  // ========================================
  // BUKA MODAL
  // ========================================
  function openProjectModal(projectKey, triggerButton) {
    if (!projectModal || !projectDialog) return;

    const project = projectData[projectKey];
    if (!project) return;

    activeProject = project;
    activeImageIndex = 0;
    lastFocusedElement = triggerButton;
    galleryAnimating = false;
    clearTimeout(galleryAnimationTimer);

    if (modalCategory) modalCategory.textContent = project.category;
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDescription) modalDescription.textContent = project.description;
    if (modalObjective) modalObjective.textContent = project.objective;

    if (modalTechnologies) {
      modalTechnologies.replaceChildren();

      project.technologies.forEach(technology => {
        const tag = document.createElement('span');
        tag.textContent = technology;
        modalTechnologies.appendChild(tag);
      });
    }

    if (modalFeatures) {
      modalFeatures.replaceChildren();

      project.features.forEach(feature => {
        const item = document.createElement('li');
        item.textContent = feature;
        modalFeatures.appendChild(item);
      });
    }

    if (modalPrototypeSection && modalPrototypeLink) {
      if (project.prototype && project.prototype !== 'LINK_PROTOTYPE_FIGMA_KAMU') {
        modalPrototypeLink.href = project.prototype;
        modalPrototypeSection.hidden = false;
      } else {
        modalPrototypeLink.removeAttribute('href');
        modalPrototypeSection.hidden = true;
      }
    }

    if (modalNotesSection) {
      if (project.notes && modalNotes) {
        modalNotes.textContent = project.notes;
        modalNotesSection.hidden = false;
      } else {
        modalNotesSection.hidden = true;
      }
    }

    renderProjectGallery();

    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-modal-open');
    projectDialog.focus();
  }

  // ========================================
  // ANIMASI PERPINDAHAN GAMBAR
  // ========================================
  function changeGalleryImage(direction, targetIndex = null) {
    if (!activeProject || !modalImage || galleryAnimating) return;

    const images = activeProject.images || [];
    if (images.length < 2) return;

    const nextIndex = targetIndex !== null
      ? targetIndex
      : (activeImageIndex + direction + images.length) % images.length;

    if (nextIndex === activeImageIndex) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      activeImageIndex = nextIndex;
      renderProjectGallery();
      return;
    }

    galleryAnimating = true;

    modalImage.classList.remove(
      'swipe-in-left',
      'swipe-in-right',
      'swipe-out-left',
      'swipe-out-right'
    );

    const exitClass = direction >= 0 ? 'swipe-out-left' : 'swipe-out-right';
    const enterClass = direction >= 0 ? 'swipe-in-right' : 'swipe-in-left';

    modalImage.classList.add(exitClass);

    galleryAnimationTimer = window.setTimeout(() => {
      activeImageIndex = nextIndex;
      renderProjectGallery();

      modalImage.classList.remove(exitClass);
      modalImage.classList.add(enterClass);
      void modalImage.offsetWidth;

      galleryAnimationTimer = window.setTimeout(() => {
        modalImage.classList.remove(enterClass);
        galleryAnimating = false;
      }, 360);
    }, 160);
  }

  // ========================================
  // TUTUP MODAL
  // ========================================
  function closeProjectModal() {
    if (!projectModal) return;

    clearTimeout(galleryAnimationTimer);
    galleryAnimating = false;

    if (modalImage) {
      modalImage.classList.remove(
        'swipe-in-left',
        'swipe-in-right',
        'swipe-out-left',
        'swipe-out-right'
      );
    }

    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-modal-open');
    activeProject = null;
    resetProjectImageZoom();

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  projectButtons.forEach(button => {
    button.addEventListener('click', () => {
      openProjectModal(button.dataset.project, button);
    });
  });

  modalCloseButtons?.forEach(button => {
    button.addEventListener('click', closeProjectModal);
  });

  galleryPrev?.addEventListener('click', () => changeGalleryImage(-1));
  galleryNext?.addEventListener('click', () => changeGalleryImage(1));

  document.addEventListener('keydown', event => {
    if (!projectModal || projectModal.getAttribute('aria-hidden') !== 'false') return;

    if (event.key === 'Escape') {
      closeProjectModal();
    } else if (event.key === 'ArrowLeft') {
      changeGalleryImage(-1);
    } else if (event.key === 'ArrowRight') {
      changeGalleryImage(1);
    }
  });

  // ========================================
  // ZOOM, DRAG, PINCH, DAN SWIPE
  // ========================================
  if (galleryMain && modalImage) {
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let startX = 0;
    let startY = 0;
    let startPanX = 0;
    let startPanY = 0;
    let startZoom = 1;
    let startDistance = 0;
    let isPinching = false;
    let moved = false;

    const pointers = new Map();
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;

    // Tombol zoom dibuat otomatis.
    const controls = document.createElement('div');
    controls.className = 'zoom-controls';
    controls.setAttribute('aria-label', 'Kontrol zoom gambar');
    controls.innerHTML = `
      <button type="button" data-zoom="out" aria-label="Perkecil gambar">−</button>
      <button type="button" data-zoom="reset" aria-label="Reset zoom">↺</button>
      <button type="button" data-zoom="in" aria-label="Perbesar gambar">+</button>
    `;
    const galleryContainer = projectModal.querySelector('.project-gallery');

    if (galleryContainer) {
      galleryContainer.insertBefore(controls, galleryMain);
    } else {
      galleryMain.appendChild(controls);
    }

    const zoomOut = controls.querySelector('[data-zoom="out"]');
    const zoomReset = controls.querySelector('[data-zoom="reset"]');
    const zoomIn = controls.querySelector('[data-zoom="in"]');

    function updateZoom() {
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

      if (zoom === 1) {
        panX = 0;
        panY = 0;
      }

      const maxX = Math.max(
        0,
        (galleryMain.clientWidth * (zoom - 1)) / 2
      );
      const maxY = Math.max(
        0,
        (galleryMain.clientHeight * (zoom - 1)) / 2
      );

      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));

      modalImage.style.transform =
        `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;

      modalImage.style.cursor = zoom > 1 ? 'grab' : 'default';

      zoomOut.disabled = zoom <= MIN_ZOOM;
      zoomIn.disabled = zoom >= MAX_ZOOM;
      zoomReset.disabled = zoom <= MIN_ZOOM;
    }

    function resetZoom() {
      zoom = 1;
      panX = 0;
      panY = 0;
      updateZoom();
    }

    resetProjectImageZoom = resetZoom;

    function zoomAt(nextZoom, clientX, clientY) {
      const rect = galleryMain.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));

      panX = x - (x - panX) * (newZoom / zoom);
      panY = y - (y - panY) * (newZoom / zoom);
      zoom = newZoom;

      updateZoom();
    }

    function getDistance(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    controls.addEventListener('pointerdown', event => {
      event.stopPropagation();
    });

    controls.addEventListener('click', event => {
      const button = event.target.closest('button[data-zoom]');
      if (!button) return;

      if (button.dataset.zoom === 'reset') {
        resetZoom();
        return;
      }

      const rect = galleryMain.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const factor = button.dataset.zoom === 'in' ? 1.25 : 0.8;

      zoomAt(zoom * factor, centerX, centerY);
    });

    // Scroll mouse untuk zoom.
    galleryMain.addEventListener('wheel', event => {
      if (event.target.closest('.zoom-controls')) return;

      event.preventDefault();

      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomAt(zoom * factor, event.clientX, event.clientY);
    }, { passive: false });

    // Mulai drag atau pinch.
    galleryMain.addEventListener('pointerdown', event => {
      // Jangan tangani klik tombol navigasi sebagai gerakan drag.
      if (event.target.closest('.zoom-controls, .gallery-arrow')) return;

      if (event.pointerType === 'mouse' && event.button !== 0) return;

      event.preventDefault();

      pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      try {
        galleryMain.setPointerCapture(event.pointerId);
      } catch {}

      if (pointers.size === 1) {
        startX = event.clientX;
        startY = event.clientY;
        startPanX = panX;
        startPanY = panY;
        moved = false;
      } else if (pointers.size === 2) {
        const points = [...pointers.values()];
        startDistance = getDistance(points[0], points[1]);
        startZoom = zoom;
        isPinching = true;
      }
    });

    // Pergerakan mouse atau jari.
    galleryMain.addEventListener('pointermove', event => {
      if (!pointers.has(event.pointerId)) return;

      pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (pointers.size >= 2 && isPinching) {
        const points = [...pointers.values()];
        const currentDistance = getDistance(points[0], points[1]);

        if (startDistance > 0) {
          zoom = startZoom * currentDistance / startDistance;
          updateZoom();
        }

        moved = true;
        return;
      }

      if (pointers.size !== 1) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;

      // Ketika diperbesar, gerakan digunakan untuk menggeser gambar.
      if (zoom > 1) {
        panX = startPanX + dx;
        panY = startPanY + dy;
        updateZoom();
      }
    });

    function finishPointer(event) {
      if (!pointers.has(event.pointerId)) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const wasZoomed = zoom > 1;
      const wasPinching = isPinching;

      pointers.delete(event.pointerId);

      if (pointers.size < 2) isPinching = false;

      // Swipe hanya mengganti gambar ketika gambar tidak diperbesar.
      if (
        pointers.size === 0 &&
        !wasZoomed &&
        !wasPinching &&
        moved &&
        Math.abs(dx) >= 55 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        changeGalleryImage(dx < 0 ? 1 : -1);
      }

      if (pointers.size === 1) {
        const remaining = [...pointers.values()][0];
        startX = remaining.x;
        startY = remaining.y;
        startPanX = panX;
        startPanY = panY;
      }
    }

    galleryMain.addEventListener('pointerup', finishPointer);

    galleryMain.addEventListener('pointercancel', event => {
      pointers.delete(event.pointerId);
      isPinching = false;
    });

    galleryMain.addEventListener('lostpointercapture', event => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) isPinching = false;
    });

    // Mencegah gambar diseret sebagai file oleh browser.
    modalImage.addEventListener('dragstart', event => {
      event.preventDefault();
    });

    updateZoom();
  }

  // ========================================
  // CAROUSEL PROYEK
  // Desktop: 3 kartu
  // Tablet: 2 kartu
  // Mobile: 1 kartu
  // ========================================
  document.querySelectorAll('.project-carousel').forEach(carousel => {
    const viewport = carousel.querySelector('.project-carousel-viewport');
    const track = carousel.querySelector('.project-carousel-track');
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const pagination = carousel.parentElement.querySelector('.carousel-pagination');

    if (!viewport || !track || !prevButton || !nextButton || !pagination) return;

    const cards = [...track.querySelectorAll(':scope > .project-card')];

    let currentPage = 0;
    let startX = 0;
    let startY = 0;
    let resizeTimer;

    function getVisibleCards() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleCards = getVisibleCards();
      const totalPages = Math.max(
        1,
        Math.ceil(cards.length / visibleCards)
      );

      currentPage = Math.max(
        0,
        Math.min(currentPage, totalPages - 1)
      );

      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
      const maxOffset = Math.max(
        0,
        track.scrollWidth - viewport.clientWidth
      );

      const offset = Math.min(
        currentPage * visibleCards * (cardWidth + gap),
        maxOffset
      );

      track.style.transform = `translate3d(-${offset}px, 0, 0)`;

      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage >= totalPages - 1;

      pagination.replaceChildren();

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = `carousel-dot${i === currentPage ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Halaman proyek ${i + 1}`);
        dot.setAttribute('aria-current', String(i === currentPage));

        dot.addEventListener('click', () => {
          currentPage = i;
          updateCarousel();
        });

        pagination.appendChild(dot);
      }
    }

    prevButton.addEventListener('click', () => {
      currentPage--;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentPage++;
      updateCarousel();
    });

    // Swipe carousel di perangkat sentuh.
    viewport.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return;

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener('touchend', event => {
      if (event.changedTouches.length !== 1) return;

      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

      const totalPages = Math.max(
        1,
        Math.ceil(cards.length / getVisibleCards())
      );

      if (dx < 0 && currentPage < totalPages - 1) {
        currentPage++;
      } else if (dx > 0 && currentPage > 0) {
        currentPage--;
      }

      updateCarousel();
    }, { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCarousel, 120);
    });

    updateCarousel();
  });

  // ========================================
// CERTIFICATE PREVIEW MODAL
// ========================================

(() => {
  const certificateModal = document.querySelector('#certificate-modal');

  if (!certificateModal) return;

  const certificateDialog = certificateModal.querySelector(
    '.certificate-modal-dialog'
  );

  const certificateItems = document.querySelectorAll(
    '.certificate-clickable[data-certificate]'
  );

  const closeButtons = certificateModal.querySelectorAll(
    '[data-certificate-close]'
  );

  const modalTitle = document.querySelector('#certificate-modal-title');
  const modalCategory = document.querySelector('#certificate-modal-category');
  const detailTitle = document.querySelector('#certificate-detail-title');
  const detailDescription = document.querySelector(
    '#certificate-detail-description'
  );
  const detailIssuer = document.querySelector('#certificate-detail-issuer');
  const detailDate = document.querySelector('#certificate-detail-date');

  const pdfFrame = document.querySelector('#certificate-pdf-frame');
  const openPdfButton = document.querySelector('#certificate-open-pdf');
  const previewFallback = document.querySelector(
    '#certificate-preview-fallback'
  );

  // Informasi sertifikat.
  // Semua path mengarah ke folder assets/documents/certificates/.

  const certificates = {
    bnsp: {
      category: 'SERTIFIKASI KOMPETENSI',
      title: 'Associate Data Scientist',
      issuer: 'Badan Nasional Sertifikasi Profesi (BNSP)',
      date: '17 September 2026',
      description:
        'Sertifikasi kompetensi Associate Data Scientist. Sertifikasi ini ' +
        'menjadi bukti bahwa pemegangnya telah mengikuti uji kompetensi ' +
        'sesuai skema Associate Data Scientist.',
      file: 'assets/documents/certificates/bnsp-associate-data-scientist.pdf'
    },

    ccna: {
      category: 'NETWORKING',
      title: 'Introduction to Networks',
      issuer: 'Cisco Networking Academy',
      date: '22 Februari 2024',
      description:
        'Sertifikat penyelesaian program CCNAv7: Introduction to Networks ' +
        'melalui Cisco Networking Academy. Program ini berkaitan dengan ' +
        'dasar-dasar jaringan komputer.',
      file: 'assets/documents/certificates/ccna-introduction-to-networks.pdf'
    },

    ai: {
      category: 'ARTIFICIAL INTELLIGENCE',
      title: 'AI For Everyone',
      issuer: 'KORIKA',
      date: '23 Mei 2026',
      description:
        'Sertifikat pembelajaran AI For Everyone. Program ini membahas ' +
        'pemahaman umum mengenai kecerdasan buatan dan penerapannya.',
      file: 'assets/documents/certificates/ai-for-everyone.pdf'
    },

    participation: {
      category: 'PARTISIPASI',
      title: 'Unlock Your Potential, Let\'s Craft Your Career Path!',
      issuer: 'Blue bird group',
      date: '23 November 2024',
      description:
        'Workshop pengembangan karier yang membahas analisis SWOT ' +
      '(Strengths, Weaknesses, Opportunities, Threats) untuk ' +
      'mengenali potensi diri dan membantu merencanakan jalur karier. ' +
      'Kegiatan diikuti secara langsung (luring).',
      file: 'assets/documents/certificates/certificate-participation.pdf'
    }
  };

  let lastFocusedElement = null;

  // Membuka modal.
  function openCertificateModal(certificateKey, trigger) {
    const certificate = certificates[certificateKey];

    if (!certificate) return;

    lastFocusedElement = trigger;

    modalTitle.textContent = certificate.title;
    modalCategory.textContent = certificate.category;
    detailTitle.textContent = certificate.title;
    detailDescription.textContent = certificate.description;
    detailIssuer.textContent = certificate.issuer;
    detailDate.textContent = certificate.date;

    // Tampilkan dokumen PDF di dalam modal.
    // Fragment ini meminta PDF ditampilkan menyesuaikan lebar halaman.
    pdfFrame.src = `${certificate.file}#view=FitH`;

    // Sediakan tautan untuk membuka PDF di tab baru.
    openPdfButton.href = certificate.file;

    // Sembunyikan pesan alternatif ketika modal dibuka.
    previewFallback.hidden = true;

    certificateModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('certificate-modal-open');

    certificateDialog.focus();
  }

  // Menutup modal.
  function closeCertificateModal() {
    if (certificateModal.getAttribute('aria-hidden') !== 'false') {
      return;
    }

    certificateModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('certificate-modal-open');

    // Hentikan pemuatan PDF ketika modal ditutup.
    pdfFrame.removeAttribute('src');

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // Klik baris sertifikat.
  certificateItems.forEach(item => {
    item.addEventListener('click', () => {
      openCertificateModal(item.dataset.certificate, item);
    });

    // Dukungan keyboard: Enter dan Space.
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCertificateModal(item.dataset.certificate, item);
      }
    });
  });

  // Tombol X dan area di luar modal.
  closeButtons.forEach(button => {
    button.addEventListener('click', closeCertificateModal);
  });

  // Tutup menggunakan Escape.
  document.addEventListener('keydown', event => {
    if (certificateModal.getAttribute('aria-hidden') !== 'false') {
      return;
    }

    if (event.key === 'Escape') {
      closeCertificateModal();
    }
  });

})();

const cvModalElement = document.querySelector('#cv-modal');
const cvOpenTrigger = document.querySelector('#open-cv-modal');

if (!cvModalElement || !cvOpenTrigger) return;

const cvDialogElement = cvModalElement.querySelector(
  '.cv-modal-dialog'
);

const cvCloseTriggers = cvModalElement.querySelectorAll(
  '[data-cv-close]'
);

const cvFrameElement = document.querySelector('#cv-pdf-frame');

const cvPdfPath = 'assets/documents/cv.pdf';

let cvLastFocusedElement = null;

// Buka modal CV.
function openCvPreview() {
  cvLastFocusedElement = document.activeElement;

  cvFrameElement.src = `${cvPdfPath}#view=FitH`;

  cvModalElement.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cv-modal-open');

  cvDialogElement.focus();
}

// Tutup modal CV.
function closeCvPreview() {
  if (cvModalElement.getAttribute('aria-hidden') !== 'false') {
    return;
  }

  cvModalElement.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cv-modal-open');

  // Hentikan pemuatan PDF saat modal ditutup.
  cvFrameElement.removeAttribute('src');

  if (cvLastFocusedElement) {
    cvLastFocusedElement.focus();
    cvLastFocusedElement = null;
  }
}

// Klik tombol Lihat CV.
cvOpenTrigger.addEventListener('click', openCvPreview);

// Klik tombol X atau area backdrop.
cvCloseTriggers.forEach(trigger => {
  trigger.addEventListener('click', closeCvPreview);
});

// Tutup dengan tombol Escape.
document.addEventListener('keydown', event => {
  if (cvModalElement.getAttribute('aria-hidden') !== 'false') {
    return;
  }

  if (event.key === 'Escape') {
    closeCvPreview();
  }
});

const contactEmail = document.getElementById("contact-email");
const copyEmailStatus = document.getElementById("copy-email-status");

if (contactEmail && copyEmailStatus) {
  async function copyEmail() {
    const email = contactEmail.textContent.trim();

    try {
      await navigator.clipboard.writeText(email);

      copyEmailStatus.textContent = "Tersalin!";

      setTimeout(() => {
        copyEmailStatus.textContent = "Salin";
      }, 2000);
    } catch (error) {
      copyEmailStatus.textContent = "Gagal menyalin";
    }
  }

  contactEmail.addEventListener("click", copyEmail);

  contactEmail.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyEmail();
    }
  });
}

})();
