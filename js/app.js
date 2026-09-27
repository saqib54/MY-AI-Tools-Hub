// ============================================
// ToolHub 2.0 — Main App & Router (app.js)
// ============================================

const App = {
  tools: [
    // Image Tools
    { id: 'image-enhancer', name: 'Image Enhancer', cat: 'image', icon: '🖼️', tag: 'IMAGE', tagColor: 'blue', desc: 'Sharpen details & 2x upscale with live comparison.', tags: ['enhance', 'sharpen', 'upscale', 'brighten', 'clarity'] },
    { id: 'image-compressor', name: 'Image Compressor', cat: 'image', icon: '🗜️', tag: 'IMAGE', tagColor: 'blue', desc: 'Reduce JPG, PNG, and WebP file sizes without quality loss.', tags: ['compress', 'shrink', 'smaller', 'make image smaller', 'reduce size'] },
    { id: 'image-resizer', name: 'Image Resizer', cat: 'image', icon: '📐', tag: 'IMAGE', tagColor: 'blue', desc: 'Resize width and height in pixels or percentage with aspect ratio lock.', tags: ['resize', 'dimensions', 'width', 'height', 'scale'] },
    { id: 'image-converter', name: 'Image Converter', cat: 'image', icon: '🔄', tag: 'IMAGE', tagColor: 'blue', desc: 'Convert between JPG, PNG, WebP, GIF, and BMP formats.', tags: ['convert', 'format', 'jpg to png', 'png to jpg', 'webp'] },
    { id: 'image-cropper', name: 'Image Cropper', cat: 'image', icon: '✂️', tag: 'IMAGE', tagColor: 'blue', desc: 'Crop images with presets for 1:1, 16:9, 4:3, and freeform shapes.', tags: ['crop', 'cut', 'aspect ratio', 'square', 'story'] },
    { id: 'screenshot-cleaner', name: 'Screenshot Cleaner', cat: 'image', icon: '📱', tag: 'IMAGE', tagColor: 'blue', desc: 'Auto-trim unnecessary blank margins and status bar borders from screenshots.', tags: ['screenshot', 'trim', 'clean', 'borders', 'status bar'] },
    { id: 'image-quality-analyzer', name: 'Image Quality Analyzer', cat: 'image', icon: '📊', tag: 'IMAGE', tagColor: 'blue', desc: 'Analyze resolution, blur level, compression artifacts, and suitability for web/print.', tags: ['analyze', 'quality', 'blur', 'resolution', 'dpi'] },
    { id: 'background-remover', name: 'Background Remover', cat: 'image', icon: '🪄', tag: 'IMAGE', tagColor: 'blue', desc: 'Smart background removal using color-keying and threshold controls.', tags: ['background', 'remove bg', 'transparent', 'cutout'] },
    { id: 'color-palette-extractor', name: 'Color Palette Extractor', cat: 'image', icon: '🎨', tag: 'IMAGE', tagColor: 'blue', desc: 'Extract dominant color palettes with HEX and RGB codes.', tags: ['palette', 'colors', 'hex', 'extract color', 'swatches'] },
    { id: 'id-photo-maker', name: 'ID Photo Maker', cat: 'image', icon: '🪪', tag: 'IMAGE', tagColor: 'blue', desc: 'Passport and CNIC photo maker with printable 4x6 grid sheet output.', tags: ['passport', 'cnic', 'id photo', 'visa photo', 'badge'] },

    // PDF Tools (10 tools matching prototype image 2)
    { id: 'pdf-compressor', name: 'PDF Compressor', cat: 'pdf', icon: '📄', tag: 'PDF', tagColor: 'red', desc: 'Shrink PDF file size while keeping quality crisp.', tags: ['pdf compressor', 'make pdf smaller', 'shrink pdf', 'reduce pdf size'] },
    { id: 'pdf-merger', name: 'PDF Merger', cat: 'pdf', icon: '🧩', tag: 'PDF', tagColor: 'red', desc: 'Merge multiple PDFs into a single file.', tags: ['pdf merger', 'combine pdf', 'join pdf', 'merge pdf'] },
    { id: 'pdf-splitter', name: 'PDF Splitter', cat: 'pdf', icon: '✂️', tag: 'PDF', tagColor: 'red', desc: 'Split PDF into separate pages or ranges.', tags: ['split pdf', 'extract pdf pages', 'cut pdf'] },
    { id: 'pdf-to-image', name: 'PDF → Image', cat: 'pdf', icon: '🖼️', tag: 'PDF', tagColor: 'red', desc: 'Convert PDF pages to JPG, PNG or WEBP.', tags: ['pdf to image', 'pdf to png', 'pdf to jpg', 'extract pages'] },
    { id: 'image-to-pdf', name: 'Image → PDF', cat: 'pdf', icon: '🔄', tag: 'PDF', tagColor: 'red', desc: 'Convert images to PDF with custom settings.', tags: ['image to pdf', 'convert picture to pdf', 'jpg to pdf', 'photos to pdf'] },
    { id: 'pdf-to-text', name: 'PDF → Text', cat: 'pdf', icon: '📝', tag: 'PDF', tagColor: 'red', desc: 'Extract text from PDF quickly and accurately.', tags: ['pdf to text', 'extract text', 'read pdf', 'copy text'] },
    { id: 'pdf-watermark', name: 'PDF Watermark', cat: 'pdf', icon: '💧', tag: 'PDF', tagColor: 'red', desc: 'Add text or image watermark to PDF.', tags: ['watermark', 'pdf mark', 'confidential', 'stamp'] },
    { id: 'pdf-page-organizer', name: 'PDF Page Organizer', cat: 'pdf', icon: '🗂️', tag: 'PDF', tagColor: 'red', desc: 'Reorder, rotate, delete or rearrange PDF pages.', tags: ['rotate pdf', 'reorder pdf', 'delete page', 'organize pdf'] },
    { id: 'pdf-metadata-cleaner', name: 'PDF Metadata Cleaner', cat: 'pdf', icon: '🛡️', tag: 'PDF', tagColor: 'red', desc: 'Remove metadata for better privacy.', tags: ['clean metadata', 'pdf privacy', 'remove author info'] },
    { id: 'pdf-ocr', name: 'PDF OCR (Scan to Text)', cat: 'pdf', icon: '🔍', tag: 'PDF', tagColor: 'red', desc: 'Convert scanned PDFs to editable text.', tags: ['ocr', 'scan pdf', 'read scanned pdf', 'text recognition'] },

    // Video Tools
    { id: 'video-downloader', name: 'Video Downloader', cat: 'video', icon: '📥', tag: 'VIDEO', tagColor: 'purple', desc: 'Download videos from YouTube, Instagram, TikTok and more (with permission).', tags: ['video downloader', 'import video', 'url video'] },
    { id: 'video-compressor', name: 'Video Compressor', cat: 'video', icon: '🗜️', tag: 'VIDEO', tagColor: 'purple', desc: 'Compress video files for WhatsApp, Email, TikTok, and YouTube.', tags: ['compress video', 'shrink video', 'whatsapp video', 'small video'] },
    { id: 'video-trimmer', name: 'Video Trimmer', cat: 'video', icon: '✂️', tag: 'VIDEO', tagColor: 'purple', desc: 'Cut and trim video segments by specifying start and end times.', tags: ['trim video', 'cut video', 'clip video', 'timeline'] },
    { id: 'video-to-audio', name: 'Video → Audio', cat: 'video', icon: '🎵', tag: 'VIDEO', tagColor: 'purple', desc: 'Extract audio track from video and save as WAV or MP3.', tags: ['video to audio', 'extract audio', 'mp3 from video', 'audio converter'] },
    { id: 'video-to-gif', name: 'Video → GIF', cat: 'video', icon: '🎞️', tag: 'VIDEO', tagColor: 'purple', desc: 'Convert short video clips into animated GIF files.', tags: ['video to gif', 'make gif', 'animated gif'] },
    { id: 'thumbnail-maker', name: 'Thumbnail Maker', cat: 'video', icon: '🖼️', tag: 'VIDEO', tagColor: 'purple', desc: 'Extract video frames and design YouTube & TikTok thumbnails.', tags: ['thumbnail', 'youtube thumbnail', 'cover photo', 'frame extractor'] },
    { id: 'video-metadata-cleaner', name: 'Video Metadata Cleaner', cat: 'video', icon: '🧹', tag: 'VIDEO', tagColor: 'purple', desc: 'Strip camera and location tags from video containers.', tags: ['video metadata', 'clean video EXIF'] },

    // Smart Tools
    { id: 'target-compressor', name: 'Target Size Compressor', cat: 'smart', icon: '🎯', tag: 'UNIQUE', tagColor: 'green', isUnique: true, desc: 'Auto-fit your image to exact 100KB, 500KB or MB targets.', tags: ['target size', 'compress to size', '500kb compress', '100kb image'] },
    { id: 'document-scanner', name: 'Document Scanner', cat: 'smart', icon: '📄', tag: 'SMART', tagColor: 'pink', isUnique: true, desc: 'Auto crop, enhance and convert to clean PDF.', tags: ['scanner', 'scan document', 'perspective crop', 'contrast enhancement'] },
    { id: 'privacy-redactor', name: 'Privacy Redactor', cat: 'smart', icon: '🔒', tag: 'SECURITY', tagColor: 'green', isUnique: true, desc: 'Auto-blackout CNIC, phone numbers & sensitive details.', tags: ['redact', 'privacy', 'blackout', 'cnic redact', 'remove private information'] },
    { id: 'file-quality-analyzer', name: 'File Quality Analyzer', cat: 'smart', icon: '🔍', tag: 'SMART', tagColor: 'pink', desc: 'Inspect file headers, structural integrity, and MIME health.', tags: ['file analyzer', 'health check', 'file format'] },
    { id: 'metadata-cleaner', name: 'General Metadata Cleaner', cat: 'smart', icon: '🧹', tag: 'SMART', tagColor: 'pink', desc: 'Strip EXIF camera model, GPS coordinates, and date tags.', tags: ['strip EXIF', 'remove GPS', 'metadata cleaner'] },
    { id: 'smart-file-fixer', name: 'Smart File Fixer', cat: 'smart', icon: '🛠️', tag: 'SMART', tagColor: 'pink', desc: 'Repair truncated JPEG end markers and damaged headers.', tags: ['repair file', 'fix corrupt image', 'file fixer'] }
  ],

  init() {
    this.bindEvents();
    this.handleRoute();
    window.onhashchange = () => this.handleRoute();

    // Keyboard shortcut Ctrl + K for search
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    });
  },

  bindEvents() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.oninput = e => this.handleSearch(e.target.value);
      searchInput.onfocus = e => this.handleSearch(e.target.value);
    }

    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.filterCategory(tab.dataset.cat);
      };
    });

    document.onclick = e => {
      const res = document.getElementById('search-results-dropdown');
      if (res && !e.target.closest('.hero-search-wrap')) {
        res.classList.remove('active');
      }
    };
  },

  handleRoute() {
    const hash = location.hash.replace('#', '') || 'home';
    const tool = this.tools.find(t => t.id === hash);

    // Update sidebar active link
    document.querySelectorAll('.sidebar-item').forEach(item => {
      const href = item.getAttribute('href');
      item.classList.toggle('active', href === `#${hash}`);
    });

    if (tool) {
      this.renderToolPage(tool);
    } else if (hash === 'image-tools') {
      this.renderCategoryView('image');
    } else if (hash === 'pdf-tools') {
      this.renderCategoryView('pdf');
    } else if (hash === 'video-tools') {
      this.renderCategoryView('video');
    } else if (hash === 'smart-tools') {
      this.renderCategoryView('smart');
    } else if (hash === 'settings') {
      this.renderSettingsPage();
    } else if (hash === 'support') {
      this.renderSupportPage();
    } else if (hash === 'about') {
      this.renderAboutPage();
    } else if (hash === 'privacy') {
      this.renderPrivacyPage();
    } else if (hash === 'terms') {
      this.renderTermsPage();
    } else {
      this.renderDashboard();
    }
  },

  renderDashboard() {
    const main = document.getElementById('app-main-content');
    if (!main) return;

    Common.initPage();

    main.innerHTML = `
      <!-- HERO CONTAINER -->
      <section class="hero-container">
        <div class="hero-banner">
          <div class="hero-content">
            <div class="hero-pill-badge">⚡ POWERFUL • FREE • BROWSER-BASED</div>
            <h1 class="hero-title">Tool <span class="gradient-text">Hub 2.0</span></h1>
            <h2 class="hero-subtitle">Compress. Convert. Enhance. Create. Protect.</h2>
            <p class="hero-desc">All your image, PDF and video tools in one place. Fast, 100% browser-local processing, mobile-responsive, and privacy-first.</p>
            
            <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
              <a href="#tools-section" class="btn btn-primary btn-lg">🚀 Explore All Tools →</a>
              <button type="button" class="btn btn-secondary btn-lg" onclick="Common.showToast('▶ Watch Demo coming soon! All tools are ready below.')">▶ Watch Demo</button>
            </div>

            <div class="popular-tags-row">
              <span class="popular-label">Popular:</span>
              <a href="#image-compressor" class="popular-tag">Image Compressor</a>
              <a href="#pdf-compressor" class="popular-tag">PDF Compressor</a>
              <a href="#video-downloader" class="popular-tag">Video Downloader</a>
              <a href="#background-remover" class="popular-tag">Background Remover</a>
              <a href="#video-to-audio" class="popular-tag">Video to MP3</a>
            </div>
          </div>

          <div class="hero-visual-card">
            <div class="hero-visual-box">
              <div class="visual-box-icon">🛠️</div>
              <div class="feature-stack">
                <div class="feature-stack-item">
                  <div class="fsi-icon blue">🔒</div>
                  <div><strong>100% Private</strong><br><small>Files stay on your device</small></div>
                </div>
                <div class="feature-stack-item">
                  <div class="fsi-icon orange">⚡</div>
                  <div><strong>Fast Processing</strong><br><small>Optimized for speed</small></div>
                </div>
                <div class="feature-stack-item">
                  <div class="fsi-icon purple">📱</div>
                  <div><strong>Works Everywhere</strong><br><small>Mobile • Tablet • Desktop</small></div>
                </div>
                <div class="feature-stack-item">
                  <div class="fsi-icon green">☁️</div>
                  <div><strong>No Installation</strong><br><small>Use directly in browser</small></div>
                </div>
              </div>

              <div class="floating-pill-badge">
                <span>✨</span> All Your Tools in One Place
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- METRICS BAR -->
      <div class="metrics-bar">
        <div class="metric-card">
          <div class="metric-icon blue">🗃️</div>
          <div><h4>30+</h4><p>Powerful Tools</p></div>
        </div>
        <div class="metric-card">
          <div class="metric-icon green">🛡️</div>
          <div><h4>100%</h4><p>Browser-Based</p></div>
        </div>
        <div class="metric-card">
          <div class="metric-icon orange">⚡</div>
          <div><h4>Fast</h4><p>Processing</p></div>
        </div>
        <div class="metric-card">
          <div class="metric-icon purple">📱</div>
          <div><h4>All Devices</h4><p>Mobile • Tablet • Desktop</p></div>
        </div>
        <div class="metric-card">
          <div class="metric-icon red">❤️</div>
          <div><h4>Free</h4><p>Always Free to Use</p></div>
        </div>
      </div>

      <!-- POPULAR TOOLS SECTION (WITH THEMED VISUAL GRAPHICS MATCHING PROTOTYPE) -->
      <section class="section-container" id="popular-section">
        <div class="section-header-flex">
          <div>
            <h3 class="section-title">🔥 Popular Tools</h3>
            <p class="section-subtitle">Most used tools by our community</p>
          </div>
          <a href="#tools-section" class="btn btn-secondary btn-sm">View All Tools →</a>
        </div>

        <div class="popular-tools-grid">
          <!-- 1. Image Enhancer -->
          <div class="popular-card">
            <div class="popular-card-image-box blue">
              <div class="visual-split-graphic">
                <div class="visual-split-left"><span>Original</span></div>
                <div class="visual-split-right"><span>HD 2x</span></div>
                <div class="visual-split-line"><div class="visual-split-thumb">⬌</div></div>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon blue">🖼️</div>
              <span class="tag tag-blue">IMAGE</span>
            </div>
            <h4>Image Enhancer</h4>
            <p>Sharpen details & 2x upscale with live comparison.</p>
            <a href="#image-enhancer" class="btn btn-primary btn-full btn-sm">Try Now →</a>
          </div>

          <!-- 2. Target Size Compressor -->
          <div class="popular-card">
            <div class="popular-card-image-box green">
              <div style="text-align:center;">
                <div style="font-size:28px;margin-bottom:2px;">🎯</div>
                <div style="font-size:11px;font-weight:800;color:#10b981;background:white;padding:2px 10px;border-radius:20px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">500 KB Target</div>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon green">🎯</div>
              <span class="tag tag-green">UNIQUE</span>
            </div>
            <h4>Target Size Compressor</h4>
            <p>Auto-fit your image to exact 100KB, 500KB or MB targets.</p>
            <a href="#target-compressor" class="btn btn-green btn-full btn-sm">Try Now →</a>
          </div>

          <!-- 3. PDF Compressor -->
          <div class="popular-card">
            <div class="popular-card-image-box red">
              <div class="visual-pdf-graphic">
                <div class="visual-pdf-icon-card">
                  <span style="font-size:22px;">📄</span>
                  <span>PDF</span>
                </div>
                <div style="font-size:11px;font-weight:800;color:#ef4444;">
                  <span>15.2 MB</span><br>
                  <span class="visual-pdf-tag">⬇ 1.8 MB</span>
                </div>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon red">📄</div>
              <span class="tag tag-red">PDF</span>
            </div>
            <h4>PDF Compressor</h4>
            <p>Shrink PDF file size while keeping quality crisp.</p>
            <a href="#pdf-compressor" class="btn btn-red btn-full btn-sm">Try Now →</a>
          </div>

          <!-- 4. Video Downloader -->
          <div class="popular-card">
            <div class="popular-card-image-box purple">
              <div class="visual-video-graphic">
                <div class="visual-play-btn">▶</div>
                <span style="position:absolute;bottom:6px;right:8px;font-size:9px;background:rgba(0,0,0,0.7);color:white;padding:2px 6px;border-radius:4px;font-weight:800;">4K HD</span>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon purple">📥</div>
              <span class="tag tag-purple">VIDEO</span>
            </div>
            <h4>Video Downloader</h4>
            <p>Download videos from YouTube, Instagram, TikTok and more.</p>
            <a href="#video-downloader" class="btn btn-purple btn-full btn-sm">Try Now →</a>
          </div>

          <!-- 5. Document Scanner -->
          <div class="popular-card">
            <div class="popular-card-image-box orange">
              <div class="visual-scanner-graphic">
                <span style="font-size:24px;">📄</span>
                <span style="font-size:10px;font-weight:800;color:#f97316;">Auto-Crop PDF</span>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon orange">📄</div>
              <span class="tag tag-pink">SMART</span>
            </div>
            <h4>Document Scanner</h4>
            <p>Auto crop, enhance and convert to clean PDF.</p>
            <a href="#document-scanner" class="btn btn-pink btn-full btn-sm" style="background:#f97316;">Try Now →</a>
          </div>

          <!-- 6. Privacy Redactor -->
          <div class="popular-card">
            <div class="popular-card-image-box green">
              <div class="visual-checkerboard-graphic">
                <div class="visual-cutout-badge">🔒 Blackout Redact</div>
              </div>
            </div>
            <div class="popular-card-top">
              <div class="popular-icon green">🔒</div>
              <span class="tag tag-green">SECURITY</span>
            </div>
            <h4>Privacy Redactor</h4>
            <p>Auto-blackout CNIC, phone numbers & sensitive details.</p>
            <a href="#privacy-redactor" class="btn btn-green btn-full btn-sm">Try Now →</a>
          </div>
        </div>
      </section>

      <!-- BROWSE TOOLS BY CATEGORY -->
      <section class="section-container" id="tools-section">
        <div class="section-header-flex">
          <div>
            <h3 class="section-title">🗂️ Browse Tools by Category</h3>
            <p class="section-subtitle">Find the right tool for your needs</p>
          </div>
        </div>

        <div class="category-cards-grid">
          <!-- IMAGE TOOLS CARD -->
          <div class="category-block-card">
            <div class="cat-block-header">
              <div class="cat-block-icon blue">🖼️</div>
              <div>
                <h4>Image Tools</h4>
                <p>Enhance, compress, convert and edit your images</p>
              </div>
              <span class="cat-count-badge">10 Tools</span>
            </div>
            <div class="cat-block-links">
              <a href="#image-enhancer"><span>🖼️</span> Image Enhancer</a>
              <a href="#image-converter"><span>🔄</span> Image Converter</a>
              <a href="#image-compressor"><span>🗜️</span> Image Compressor</a>
              <a href="#background-remover"><span>🪄</span> Background Remover</a>
              <a href="#image-resizer"><span>📐</span> Image Resizer</a>
              <a href="#screenshot-cleaner"><span>📱</span> Screenshot Cleaner</a>
              <a href="#image-cropper"><span>✂️</span> Image Cropper</a>
              <a href="#id-photo-maker"><span>🪪</span> ID Photo Maker</a>
            </div>
            <a href="#image-enhancer" class="cat-block-action blue">Explore Image Tools →</a>
          </div>

          <!-- PDF TOOLS CARD -->
          <div class="category-block-card">
            <div class="cat-block-header">
              <div class="cat-block-icon red">📄</div>
              <div>
                <h4>PDF Tools</h4>
                <p>Compress, merge, split and manage PDF files</p>
              </div>
              <span class="cat-count-badge">8 Tools</span>
            </div>
            <div class="cat-block-links">
              <a href="#pdf-compressor"><span>📄</span> PDF Compressor</a>
              <a href="#pdf-merger"><span>🧩</span> PDF Merger</a>
              <a href="#image-to-pdf"><span>🔄</span> Image to PDF</a>
              <a href="#pdf-splitter"><span>✂️</span> PDF Splitter</a>
              <a href="#pdf-to-image"><span>🖼️</span> PDF to Image</a>
              <a href="#pdf-to-text"><span>📝</span> PDF to Text</a>
              <a href="#pdf-watermark"><span>💧</span> PDF Watermark</a>
              <a href="#pdf-page-organizer"><span>🗂️</span> PDF Page Organizer</a>
            </div>
            <a href="#pdf-compressor" class="cat-block-action red">Explore PDF Tools →</a>
          </div>

          <!-- VIDEO TOOLS CARD -->
          <div class="category-block-card">
            <div class="cat-block-header">
              <div class="cat-block-icon purple">🎥</div>
              <div>
                <h4>Video Tools</h4>
                <p>Download, compress, trim and convert videos</p>
              </div>
              <span class="cat-count-badge">7 Tools</span>
            </div>
            <div class="cat-block-links">
              <a href="#video-downloader"><span>✂️</span> Video Downloader</a>
              <a href="#video-to-audio"><span>🎵</span> Video to Audio</a>
              <a href="#video-compressor"><span>🗜️</span> Video Compressor</a>
              <a href="#video-to-gif"><span>🎞️</span> Video to GIF</a>
              <a href="#video-trimmer"><span>✂️</span> Video Trimmer</a>
              <a href="#thumbnail-maker"><span>🖼️</span> Thumbnail Maker</a>
            </div>
            <a href="#video-downloader" class="cat-block-action purple">Explore Video Tools →</a>
          </div>

          <!-- SMART TOOLS CARD -->
          <div class="category-block-card">
            <div class="cat-block-header">
              <div class="cat-block-icon green">⚡</div>
              <div>
                <h4>Smart Tools</h4>
                <p>Unique tools to make your work easier</p>
              </div>
              <span class="cat-count-badge">6 Tools</span>
            </div>
            <div class="cat-block-links">
              <a href="#target-compressor"><span>🎯</span> Target Size Compressor</a>
              <a href="#metadata-cleaner"><span>🧹</span> Metadata Cleaner</a>
              <a href="#document-scanner"><span>📄</span> Document Scanner</a>
              <a href="#file-quality-analyzer"><span>🔍</span> Image Quality Analyzer</a>
              <a href="#privacy-redactor"><span>🔒</span> Privacy Redactor</a>
              <a href="#smart-file-fixer"><span>🛠️</span> Smart File Fixer</a>
            </div>
            <a href="#target-compressor" class="cat-block-action green">Explore Smart Tools →</a>
          </div>
        </div>
      </section>

      <!-- WHY CHOOSE US -->
      <section class="section-container" style="margin-bottom:40px;">
        <h3 class="section-title" style="text-align:center;margin-bottom:24px;">⭐ Why Choose Tool Hub 2.0?</h3>
        <div class="metrics-bar why-choose-grid">
          <div class="metric-card" style="text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">⚡</div>
            <h4>Easy to Use</h4>
            <p style="font-size:12px;color:var(--muted);">Simple drag & drop interface</p>
          </div>
          <div class="metric-card" style="text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🚀</div>
            <h4>Fast Processing</h4>
            <p style="font-size:12px;color:var(--muted);">Instant browser calculation</p>
          </div>
          <div class="metric-card" style="text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">🔒</div>
            <h4>Privacy First</h4>
            <p style="font-size:12px;color:var(--muted);">Files never leave device</p>
          </div>
          <div class="metric-card" style="text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">📦</div>
            <h4>No Installation</h4>
            <p style="font-size:12px;color:var(--muted);">100% Web application</p>
          </div>
          <div class="metric-card" style="text-align:center;">
            <div style="font-size:32px;margin-bottom:8px;">📱</div>
            <h4>Works Everywhere</h4>
            <p style="font-size:12px;color:var(--muted);">Desktop, tablet & mobile</p>
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
  },

  renderToolsGrid(items) {
    const grid = document.getElementById('tools-grid-container');
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(t => {
      const card = document.createElement('a');
      card.href = `#${t.id}`;
      card.className = 'tool-card';
      card.innerHTML = `
        ${t.isUnique ? '<span class="tool-badge-unique">UNIQUE</span>' : ''}
        <div class="tool-icon blue">${t.icon}</div>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <div class="tool-card-btn blue">Open Tool →</div>
      `;
      grid.appendChild(card);
    });
  },

  filterCategory(cat) {
    if (cat === 'all') {
      this.renderToolsGrid(this.tools);
    } else {
      this.renderToolsGrid(this.tools.filter(t => t.cat === cat));
    }
  },

  handleSearch(query) {
    const dropdown = document.getElementById('search-results-dropdown');
    if (!dropdown) return;
    const q = query.trim().toLowerCase();

    if (!q) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = this.tools.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );

    if (!matches.length) {
      dropdown.innerHTML = '<div style="padding:12px;font-size:13px;color:var(--muted);text-align:center;">No matching tools found.</div>';
    } else {
      dropdown.innerHTML = '';
      matches.forEach(m => {
        dropdown.innerHTML += `
          <a href="#${m.id}" class="search-item">
            <div class="search-item-icon">${m.icon}</div>
            <div>
              <div class="search-item-title">${m.name}</div>
              <div class="search-item-desc">${m.desc}</div>
            </div>
            <span class="search-item-cat">${m.cat}</span>
          </a>
        `;
      });
    }
    dropdown.classList.add('active');
  },

  renderToolPage(tool) {
    const main = document.getElementById('app-main-content');
    if (!main) return;

    Common.initPage(tool.name);

    // STRICT LOGIN REQUIREMENT GUARD
    if (!window.Auth || !Auth.isLoggedIn()) {
      main.innerHTML = `
        <div class="tool-page">
          <div class="tool-page-header">
            <div class="breadcrumb">
              <a href="#home">Home</a> › <span>${tool.name}</span>
            </div>
            <h1>${tool.icon} ${tool.name}</h1>
            <p>${tool.desc}</p>
          </div>
          <div class="tool-panel" style="text-align:center;padding:56px 24px;">
            <div style="font-size:52px;margin-bottom:16px;">🔐</div>
            <h2 style="font-size:24px;font-weight:800;margin-bottom:10px;">Login Required to Use Tools</h2>
            <p style="color:var(--muted);max-width:460px;margin:0 auto 24px;font-size:15px;line-height:1.6;">
              You must be signed in to edit, compress, convert, or process files with <strong>${tool.name}</strong>. Create a free account in 10 seconds!
            </p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-primary btn-lg" onclick="Auth.openModal('login')">🔐 Sign In to Continue →</button>
              <button class="btn btn-secondary btn-lg" onclick="Auth.openModal('register')">✨ Create Free Account</button>
            </div>
          </div>
        </div>
      `;
      setTimeout(() => Auth.openModal('login'), 100);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    main.innerHTML = `
      <div class="tool-page">
        <div class="tool-page-header">
          <div class="breadcrumb">
            <a href="#home">Home</a> › <span>${tool.name}</span>
          </div>
          <h1>${tool.icon} ${tool.name}</h1>
          <p>${tool.desc}</p>
        </div>
        <div id="tool-active-container"></div>
      </div>
    `;

    const container = document.getElementById('tool-active-container');

    // Route tool initialization
    switch (tool.id) {
      case 'image-enhancer': ImageTools.initEnhancer(container); break;
      case 'image-compressor': ImageTools.initCompressor(container); break;
      case 'image-resizer': ImageTools.initResizer(container); break;
      case 'image-converter': ImageTools.initConverter(container); break;
      case 'image-cropper': ImageTools.initCropper(container); break;
      case 'screenshot-cleaner': ImageTools.initScreenshotCleaner(container); break;
      case 'image-quality-analyzer': ImageTools.initQualityAnalyzer(container); break;
      case 'background-remover': ImageTools.initBgRemover(container); break;
      case 'color-palette-extractor': ImageTools.initColorPalette(container); break;
      case 'id-photo-maker': ImageTools.initIDPhotoMaker(container); break;

      case 'pdf-compressor': PDFTools.initCompressor(container); break;
      case 'image-to-pdf': PDFTools.initImageToPdf(container); break;
      case 'pdf-to-image': PDFTools.initPdfToImage(container); break;
      case 'pdf-merger': PDFTools.initPdfMerger(container); break;
      case 'pdf-splitter': PDFTools.initPdfSplitter(container); break;
      case 'pdf-to-text': PDFTools.initPdfToText(container); break;
      case 'pdf-page-organizer': PDFTools.initPdfOrganizer(container); break;
      case 'pdf-watermark': PDFTools.initPdfWatermark(container); break;

      case 'video-downloader': VideoTools.initDownloader(container); break;
      case 'video-compressor': VideoTools.initCompressor(container); break;
      case 'video-trimmer': VideoTools.initTrimmer(container); break;
      case 'video-to-audio': VideoTools.initVideoToAudio(container); break;
      case 'video-to-gif': VideoTools.initVideoToGif(container); break;
      case 'thumbnail-maker': VideoTools.initThumbnailMaker(container); break;
      case 'video-metadata-cleaner': VideoTools.initVideoMetadataCleaner(container); break;

      case 'target-compressor': SmartTools.initTargetSizeCompressor(container); break;
      case 'document-scanner': SmartTools.initDocumentScanner(container); break;
      case 'privacy-redactor': SmartTools.initPrivacyRedactor(container); break;
      case 'file-quality-analyzer': SmartTools.initFileQualityAnalyzer(container); break;
      case 'metadata-cleaner': SmartTools.initMetadataCleaner(container); break;
      case 'smart-file-fixer': SmartTools.initSmartFileFixer(container); break;
      
      default:
        container.innerHTML = '<p>Tool module ready.</p>';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderPrivacyPage() {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    main.innerHTML = `
      <div class="tool-page" style="max-width:860px;">
        <div class="tool-page-header">
          <div class="breadcrumb"><a href="#home">Home</a> › <span>Privacy Policy</span></div>
          <h1>🔒 Privacy Policy</h1>
          <p>Effective Date: September 2026 | Project Tool Hub 2.0</p>
        </div>
        <div class="tool-panel" style="line-height:1.8;color:var(--text2);font-size:14px;">
          <h3 style="color:var(--text);margin-bottom:10px;">1. 100% Client-Side Processing</h3>
          <p style="margin-bottom:16px;">Project Tool Hub 2.0 operates on a strict browser-local architecture. All processing for images, PDFs, videos, and documents takes place entirely within your device's web browser using HTML5 Canvas, WebAssembly, and local JavaScript APIs. Your uploaded files are <strong>never transmitted, uploaded, or saved</strong> to any external server or cloud database.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">2. Zero File Data Collection</h3>
          <p style="margin-bottom:16px;">We do not collect, view, store, or sell any of your media files, documents, extracted text, or metadata. Once you close or refresh your browser tab, transient canvas memory is automatically cleared by your web browser.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">3. Cookies & Local Storage</h3>
          <p style="margin-bottom:16px;">We use standard browser <code>localStorage</code> exclusively for necessary functional features:
          <br>• Theme Preference (Dark / Light Mode)
          <br>• User login session state
          <br>• Daily rate-limiting counter (5 free uses per tool per 24 hours)</p>

          <h3 style="color:var(--text);margin-bottom:10px;">4. Security & Data Protection</h3>
          <p style="margin-bottom:16px;">We enforce strict client-side security measures, including input file sanitization, executable file blocking (`.exe`, `.php`, `.sh`), and permanent pixel-level burn-in redactions for the Privacy Redactor tool.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">5. Third-Party Libraries</h3>
          <p style="margin-bottom:16px;">ToolHub 2.0 utilizes trusted client-side open-source libraries loaded via secure CDN (PDF.js, Cropper.js, jsPDF, pdf-lib, JSZip). These libraries execute locally within your browser context.</p>

          <div class="status-msg success" style="margin-top:20px;">
            ✅ <strong>Privacy Summary:</strong> Your files never leave your device. Complete local privacy guaranteed.
          </div>
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderTermsPage() {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    main.innerHTML = `
      <div class="tool-page" style="max-width:860px;">
        <div class="tool-page-header">
          <div class="breadcrumb"><a href="#home">Home</a> › <span>Terms & Conditions</span></div>
          <h1>📜 Terms & Conditions</h1>
          <p>Effective Date: September 2026 | Project Tool Hub 2.0</p>
        </div>
        <div class="tool-panel" style="line-height:1.8;color:var(--text2);font-size:14px;">
          <h3 style="color:var(--text);margin-bottom:10px;">1. Acceptance of Terms</h3>
          <p style="margin-bottom:16px;">By accessing or using Project Tool Hub 2.0, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please refrain from using our services.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">2. Permitted Use & User Authorization</h3>
          <p style="margin-bottom:16px;">You are granted a non-exclusive right to use ToolHub 2.0 for personal or commercial media and document processing. You warrant that you own or possess all necessary legal permissions, copyrights, and authorizations for any file you upload or process.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">3. Prohibited Conduct</h3>
          <p style="margin-bottom:16px;">Users are strictly prohibited from:
          <br>• Processing illegal, defamatory, or copyright-infringing content without authorization.
          <br>• Attempting to upload malicious software, viruses, or executable scripts.
          <br>• Attempting to bypass platform access controls, DRM, or rate limits improperly.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">4. Intellectual Property & File Ownership</h3>
          <p style="margin-bottom:16px;">Users retain 100% full ownership and intellectual property rights over all original and processed files. Project Tool Hub 2.0 asserts zero claim of ownership or copyright over your files.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">5. Fair Use & Daily Limits</h3>
          <p style="margin-bottom:16px;">To ensure fair availability and system responsiveness, free usage is subject to a rate limit of 5 uses per tool per 24-hour period per user. Limits reset automatically after 24 hours.</p>

          <h3 style="color:var(--text);margin-bottom:10px;">6. Disclaimer of Warranties & Limitation of Liability</h3>
          <p style="margin-bottom:16px;">Project Tool Hub 2.0 is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. Quality scores, document scanner enhancements, and automated redacting recommendations are automated assistance tools and do not constitute legal guarantees.</p>

          <div class="status-msg info" style="margin-top:20px;">
            ℹ️ <strong>Questions?</strong> Contact support or visit our documentation for details.
          </div>
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderCategoryView(catKey) {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    Common.initPage();

    const catMap = {
      image: { titlePrefix: 'Image', titleSuffix: 'Tools', tag: 'IMAGE TOOLS', color: 'blue', desc: 'Compress, convert, upscale, crop and enhance your photos with easy-to-use tools.', bannerNote: 'All Image Tools in One Place' },
      pdf: { titlePrefix: 'PDF', titleSuffix: 'Tools', tag: 'PDF TOOLS', color: 'red', desc: 'Compress, merge, split, convert and manage your PDF files with easy-to-use tools.', bannerNote: 'All PDF Tools in One Place' },
      video: { titlePrefix: 'Video', titleSuffix: 'Tools', tag: 'VIDEO TOOLS', color: 'purple', desc: 'Download, compress, trim, convert and process your video files with local browser tools.', bannerNote: 'All Video Tools in One Place' },
      smart: { titlePrefix: 'Smart', titleSuffix: 'Tools', tag: 'SMART UTILITIES', color: 'green', desc: 'Unique AI-powered privacy, scanning, target compression, and diagnostic tools.', bannerNote: 'All Smart Tools in One Place' }
    };

    const catInfo = catMap[catKey] || catMap.image;
    const catTools = this.tools.filter(t => t.cat === catKey);

    main.innerHTML = `
      <div class="tool-page" style="max-width:1280px;">
        <div class="breadcrumb"><a href="#home">Home</a> › <span>${catInfo.titlePrefix} ${catInfo.titleSuffix}</span></div>
        
        <!-- CATEGORY HERO BANNER (MATCHES PROTOTYPE IMAGE 2 EXACTLY) -->
        <section class="hero-banner" style="margin-bottom:32px;">
          <div class="hero-content">
            <span class="tag tag-${catInfo.color}" style="font-size:11px;padding:4px 12px;margin-bottom:12px;display:inline-block;">${catInfo.tag}</span>
            <h1 class="hero-title"><span style="color:var(--${catInfo.color});">${catInfo.titlePrefix}</span> ${catInfo.titleSuffix}</h1>
            <p class="hero-desc">${catInfo.desc}</p>
            
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">
              <span class="floating-pill-badge">🛡️ 100% Browser-Based</span>
              <span class="floating-pill-badge">⚡ Fast Processing</span>
              <span class="floating-pill-badge">📱 Supports All Platforms</span>
            </div>
          </div>
          
          <div class="hero-visual-card">
            <div class="hero-visual-box" style="text-align:center;padding:32px;">
              <div style="font-size:48px;margin-bottom:10px;">📄</div>
              <div style="font-size:16px;font-weight:800;color:var(--text);">${catInfo.bannerNote}</div>
            </div>
          </div>
        </section>

        <!-- 5-COLUMN CATEGORY TOOL CARDS GRID (MATCHES PROTOTYPE IMAGE 2) -->
        <div class="popular-tools-grid category-grid-5">
          ${catTools.map(t => `
            <a href="#${t.id}" class="popular-card category-item-card">
              <div class="popular-card-image-box ${t.tagColor || 'blue'}">
                <div style="font-size:36px;">${t.icon}</div>
              </div>
              <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <h4 style="font-size:14px;font-weight:800;margin-bottom:4px;">${t.name}</h4>
                  <p style="font-size:11.5px;color:var(--muted);line-height:1.4;">${t.desc}</p>
                </div>
                <div style="display:flex;justify-content:flex-end;margin-top:12px;">
                  <div class="cat-circle-arrow-btn ${t.tagColor || 'blue'}">➔</div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderSettingsPage() {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    Common.initPage();

    const user = Auth.getCurrentUser() || { name: 'Saqib', email: 'saqib@example.com' };
    const initial = (user.name || 'S')[0].toUpperCase();

    main.innerHTML = `
      <div class="tool-page" style="max-width:1180px;">
        <div class="breadcrumb"><a href="#home">Home</a> › <span>Settings</span></div>
        <h1 style="font-size:26px;font-weight:900;margin-bottom:6px;">⚙️ Settings</h1>
        <p style="color:var(--muted);font-size:14px;margin-bottom:24px;">Manage your account, preferences and app settings</p>

        <div class="settings-grid">
          <!-- LEFT MENU (MATCHES PROTOTYPE IMAGE 3) -->
          <div class="settings-menu">
            <button type="button" class="settings-menu-item active">👤 Account Settings</button>
            <button type="button" class="settings-menu-item" onclick="Theme.toggle()">⚙️ Appearance (${document.documentElement.getAttribute('data-theme') || 'light'})</button>
            <button type="button" class="settings-menu-item" onclick="Common.showToast('🔔 Notifications enabled.')">🔔 Notifications</button>
            <button type="button" class="settings-menu-item" onclick="location.hash='#privacy'">🔒 Privacy & Data</button>
            <button type="button" class="settings-menu-item" onclick="Common.showToast('💾 Storage: local browser storage')">💾 Storage & Files</button>
            <button type="button" class="settings-menu-item" onclick="Common.showToast('🌐 Language: English')">🌐 Language</button>
            <button type="button" class="settings-menu-item" onclick="Common.showToast('⚡ Advanced settings enabled')">⚙️ Advanced</button>
            <button type="button" class="settings-menu-item" onclick="Common.showToast('🔗 Connected Accounts: None')">🔗 Connected Accounts</button>
          </div>

          <!-- MIDDLE PANEL: ACCOUNT INFORMATION (MATCHES PROTOTYPE IMAGE 3) -->
          <div class="settings-card" style="margin:0;">
            <h3>Account Information</h3>
            <p style="font-size:12px;color:var(--muted);margin-bottom:18px;">Update your personal information and account details</p>

            <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
              <div style="position:relative;">
                <div class="nav-avatar lg" style="width:64px;height:64px;font-size:24px;border:2px solid var(--blue);">${initial}</div>
                <div style="position:absolute;bottom:0;right:0;width:20px;height:20px;border-radius:50%;background:var(--blue);color:white;display:grid;place-items:center;font-size:10px;">📷</div>
              </div>
              <div>
                <div style="font-weight:900;font-size:16px;">${Common.escapeHtml(user.name || 'Saqib')}</div>
                <div style="font-size:12px;color:var(--muted);">${Common.escapeHtml(user.email)}</div>
                <span class="plan-badge">${user.isOwner ? '👑 OWNER ADMIN' : 'Free Plan'}</span>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" style="margin-left:auto;font-size:11px;" onclick="Common.showToast('📷 Photo upload supported via gravatar/avatar.')">Change Photo</button>
            </div>

            <form onsubmit="event.preventDefault(); Common.showToast('✅ Account information saved successfully!');">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input class="form-input" type="text" value="${Common.escapeHtml(user.name || 'Saqib')}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" value="${Common.escapeHtml(user.email)}" required readonly style="opacity:0.75;">
              </div>
              <div class="form-group">
                <label class="form-label">Bio (Optional)</label>
                <textarea class="form-input" id="settings-bio-text" rows="3" placeholder="Tell us a little about yourself..." maxlength="200" oninput="document.getElementById('bio-counter').textContent = this.value.length + '/200'"></textarea>
                <div style="text-align:right;font-size:10px;color:var(--muted);margin-top:2px;" id="bio-counter">0/200</div>
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>

          <!-- RIGHT PANEL: SUBSCRIPTION PLAN & ACTIONS (MATCHES PROTOTYPE IMAGE 3) -->
          <div style="display:flex;flex-direction:column;gap:18px;">
            <!-- SUBSCRIPTION CARD -->
            <div class="settings-card" style="margin:0;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <div class="pro-crown-badge" style="margin:0;width:32px;height:32px;font-size:16px;">👑</div>
                <div>
                  <h4 style="font-size:15px;font-weight:900;">Subscription Plan</h4>
                  <div style="font-size:11px;color:var(--muted);">You are currently on <strong>Free Plan</strong></div>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.5;">
                <div><span style="color:#10b981;font-weight:900;">✓</span> Access to all basic tools</div>
                <div><span style="color:#10b981;font-weight:900;">✓</span> Browser-based processing</div>
                <div><span style="color:#10b981;font-weight:900;">✓</span> Standard file size limits</div>
                <div><span style="color:#10b981;font-weight:900;">✓</span> Save recent files (local)</div>
              </div>

              <div style="padding:14px;background:linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.15));border:1px solid rgba(124,58,237,0.3);border-radius:14px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <span style="font-size:16px;">👑</span>
                  <strong style="font-size:13px;color:var(--purple);">Upgrade to Pro Plan</strong>
                </div>
                <p style="font-size:11px;color:var(--muted);margin-bottom:10px;">Contact owner on WhatsApp (+92 329 2899993) to unlock unlimited daily tool usage.</p>
                <a href="https://wa.me/92329289993?text=Hello%20Saqib%2C%20I%20want%20to%20buy%20ToolHub%20PRO%20Plan" target="_blank" class="btn btn-purple btn-full btn-sm" style="text-decoration:none;text-align:center;display:block;">💬 Buy Pro via WhatsApp (+92329289993) →</a>
              </div>
            </div>

            <!-- ACCOUNT ACTIONS CARD -->
            <div class="settings-card" style="margin:0;">
              <h4 style="font-size:15px;font-weight:900;margin-bottom:12px;">Account Actions</h4>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <button type="button" class="support-card" style="padding:10px 14px;" onclick="Auth.openModal('login')">
                  <span style="font-size:15px;">🔒</span>
                  <div style="text-align:left;">
                    <div style="font-size:12.5px;font-weight:700;">Change Password</div>
                    <div style="font-size:10px;color:var(--muted);">Update your account password</div>
                  </div>
                  <span style="margin-left:auto;color:var(--muted);">›</span>
                </button>

                <button type="button" class="support-card" style="padding:10px 14px;border-color:rgba(239,68,68,0.3);" onclick="if(confirm('Permanently delete your account?')){ Auth.logout(); location.reload(); }">
                  <span style="font-size:15px;color:var(--red);">🗑️</span>
                  <div style="text-align:left;">
                    <div style="font-size:12.5px;font-weight:700;color:var(--red);">Delete Account</div>
                    <div style="font-size:10px;color:var(--muted);">Permanently delete account & data</div>
                  </div>
                  <span style="margin-left:auto;color:var(--red);">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderSupportPage() {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    Common.initPage();

    main.innerHTML = `
      <div class="tool-page" style="max-width:1180px;">
        <div class="breadcrumb"><a href="#home">Home</a> › <span>Help & Support</span></div>

        <!-- HELP HERO BANNER (MATCHES PROTOTYPE IMAGE 4) -->
        <section class="hero-banner" style="margin-bottom:32px;background:linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.12));">
          <div class="hero-content">
            <h1 class="hero-title">Help & <span class="gradient-text">Support</span></h1>
            <p class="hero-desc">Find answers, guides and get the help you need. We're here for you!</p>
            <div class="hero-search-box" style="max-width:480px;">
              <span class="search-box-icon">🔍</span>
              <input type="text" class="search-box-input" placeholder="Search for help... (e.g. how to compress PDF)" oninput="Common.showToast('Searching help articles...')">
              <button class="btn btn-primary btn-sm">Search</button>
            </div>
          </div>
          <div class="hero-visual-card">
            <div class="hero-visual-box" style="text-align:center;padding:32px;">
              <div style="font-size:52px;margin-bottom:10px;">🎧</div>
              <div style="font-size:16px;font-weight:800;color:var(--text);">We're Here to Help You!</div>
            </div>
          </div>
        </section>

        <!-- 8 SUPPORT CARDS GRID (MATCHES PROTOTYPE IMAGE 4) -->
        <div class="support-cards-grid">
          <a href="https://wa.me/92329289993" target="_blank" class="support-card" style="border-color:rgba(34,197,94,0.4);">
            <div class="support-card-icon" style="background:rgba(34,197,94,0.15);color:#22c55e;">💬</div>
            <div>
              <h4>WhatsApp Support</h4>
              <p>+92 329 2899993</p>
            </div>
            <div class="support-arrow" style="background:#22c55e;color:white;">→</div>
          </a>

          <a href="#tools-section" class="support-card">
            <div class="support-card-icon" style="background:rgba(59,130,246,0.12);color:var(--blue);">🚀</div>
            <div>
              <h4>Getting Started</h4>
              <p>Learn the basics & explore all features.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#" onclick="event.preventDefault(); Common.showToast('▶ Video tutorials coming soon!')" class="support-card">
            <div class="support-card-icon" style="background:rgba(239,68,68,0.12);color:var(--red);">▶️</div>
            <div>
              <h4>Video Tutorials</h4>
              <p>Step-by-step guides for every tool.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#about" class="support-card">
            <div class="support-card-icon" style="background:rgba(139,92,246,0.12);color:var(--purple);">💬</div>
            <div>
              <h4>FAQ</h4>
              <p>Find quick answers to common questions.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#about" class="support-card">
            <div class="support-card-icon" style="background:rgba(16,185,129,0.12);color:var(--green);">🔧</div>
            <div>
              <h4>Troubleshooting</h4>
              <p>Fix common issues easily.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#about" class="support-card">
            <div class="support-card-icon" style="background:rgba(59,130,246,0.12);color:var(--blue);">✉️</div>
            <div>
              <h4>Contact Support</h4>
              <p>Get in touch with our team.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#about" class="support-card">
            <div class="support-card-icon" style="background:rgba(249,115,22,0.12);color:var(--orange);">💡</div>
            <div>
              <h4>Feature Requests</h4>
              <p>Suggest new features.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>

          <a href="#about" class="support-card">
            <div class="support-card-icon" style="background:rgba(239,68,68,0.12);color:var(--red);">🐛</div>
            <div>
              <h4>Report a Bug</h4>
              <p>Help us improve.</p>
            </div>
            <div class="support-arrow">→</div>
          </a>
        </div>

        <!-- GET IN TOUCH / CONTACT SUPPORT SECTION (MATCHES PROTOTYPE IMAGE 4) -->
        <div style="margin-top:40px;">
          <span class="tag tag-purple" style="font-size:11px;padding:4px 12px;margin-bottom:8px;display:inline-block;">CONTACT SUPPORT</span>
          <h2 style="font-size:28px;font-weight:900;margin-bottom:6px;">Get in <span style="color:var(--purple);">Touch</span></h2>
          <p style="color:var(--muted);font-size:14px;margin-bottom:28px;max-width:560px;">Have a question, found a bug, or need help? Send us a message or chat with us directly on WhatsApp.</p>

          <div style="display:grid;grid-template-columns: 1fr 1.15fr;gap:24px;">
            <!-- LEFT SUPPORT CHANNELS -->
            <div style="display:flex;flex-direction:column;gap:14px;">
              <a href="https://wa.me/92329289993" target="_blank" class="support-card" style="padding:18px;border-color:rgba(34,197,94,0.4);">
                <div class="support-card-icon" style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:24px;">💬</div>
                <div>
                  <h4 style="font-size:14px;font-weight:800;">WhatsApp Direct Chat</h4>
                  <p style="font-size:12px;color:#22c55e;font-weight:800;">+92 329 2899993</p>
                  <p style="font-size:11px;color:var(--muted);">Buy PRO plan or get instant assistance</p>
                </div>
              </a>
              <div class="support-card" style="padding:18px;">
                <div class="support-card-icon" style="background:rgba(59,130,246,0.12);color:var(--blue);">✉️</div>
                <div>
                  <h4 style="font-size:14px;font-weight:800;">Email Support</h4>
                  <p style="font-size:12px;color:var(--blue);font-weight:700;">support@toolhub.com</p>
                  <p style="font-size:11px;color:var(--muted);">Usually reply within 24 hours</p>
                </div>
              </div>

              <div class="support-card" style="padding:18px;">
                <div class="support-card-icon" style="background:rgba(236,72,153,0.12);color:var(--pink);">💬</div>
                <div>
                  <h4 style="font-size:14px;font-weight:800;">Live Chat</h4>
                  <p style="font-size:12px;color:var(--pink);font-weight:700;">Cour support team</p>
                  <p style="font-size:11px;color:var(--muted);">Available 9 AM – 9 PM (PKT)</p>
                </div>
              </div>

              <div class="support-card" style="padding:18px;">
                <div class="support-card-icon" style="background:rgba(239,68,68,0.12);color:var(--red);">🐛</div>
                <div>
                  <h4 style="font-size:14px;font-weight:800;">Report a Bug</h4>
                  <p style="font-size:11.5px;color:var(--muted);">Help us improve the platform. Let us know what went wrong.</p>
                </div>
              </div>

              <div class="support-card" style="padding:18px;">
                <div class="support-card-icon" style="background:rgba(249,115,22,0.12);color:var(--orange);">💡</div>
                <div>
                  <h4 style="font-size:14px;font-weight:800;">Feature Request</h4>
                  <p style="font-size:11.5px;color:var(--muted);">Suggest a new tool or feature. We love your ideas!</p>
                </div>
              </div>
            </div>

            <!-- RIGHT MESSAGE FORM WITH CHAR COUNTER (MATCHES PROTOTYPE IMAGE 4) -->
            <div class="settings-card" style="margin:0;">
              <h3>Send a Message</h3>
              <form onsubmit="event.preventDefault(); Common.showToast('✅ Message sent! Thank you for contacting ToolHub support.'); this.reset();">
                <div class="form-group">
                  <label class="form-label">👤 Your Name</label>
                  <input class="form-input" type="text" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                  <label class="form-label">✉️ Your Email</label>
                  <input class="form-input" type="email" placeholder="you@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">📌 Subject</label>
                  <input class="form-input" type="text" placeholder="What is this about?" required>
                </div>
                <div class="form-group">
                  <label class="form-label">💬 Message</label>
                  <textarea class="form-input" id="support-msg-text" rows="4" placeholder="Describe your issue or question..." maxlength="500" oninput="document.getElementById('msg-counter').textContent = this.value.length + '/500'" required></textarea>
                  <div style="text-align:right;font-size:10px;color:var(--muted);margin-top:2px;" id="msg-counter">0/500</div>
                </div>
                <button type="submit" class="btn btn-purple btn-full btn-lg">✈️ Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderAboutPage() {
    const main = document.getElementById('app-main-content');
    if (!main) return;
    Common.initPage();

    main.innerHTML = `
      <div class="tool-page" style="max-width:1180px;">
        <div class="breadcrumb"><a href="#home">Home</a> › <span>About</span></div>

        <!-- ABOUT HERO BANNER (MATCHES PROTOTYPE IMAGE 4) -->
        <section class="hero-banner" style="margin-bottom:32px;">
          <div class="hero-content">
            <span class="tag tag-blue" style="font-size:11px;padding:4px 12px;margin-bottom:12px;display:inline-block;">ABOUT US</span>
            <h1 class="hero-title">About <span class="gradient-text">Tool Hub 2.0</span></h1>
            <h2 class="hero-subtitle">Your All-in-One Media Toolkit</h2>
            <p class="hero-desc">Tool Hub 2.0 is a powerful, easy-to-use and completely browser-based platform that helps you compress, convert, enhance, create and protect your images, PDFs and videos.</p>
          </div>
          <div class="hero-visual-card">
            <div class="hero-visual-box" style="text-align:center;padding:32px;">
              <div style="font-size:48px;margin-bottom:10px;">🛠️</div>
              <div style="font-size:16px;font-weight:800;color:var(--text);">Simple • Fast • Private</div>
            </div>
          </div>
        </section>

        <!-- 4 CARDS GRID (MATCHES PROTOTYPE IMAGE 4) -->
        <div class="popular-tools-grid" style="grid-template-columns: repeat(4, 1fr); gap: 18px;">
          <div class="settings-card" style="text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">🎯</div>
            <h4 style="font-size:16px;font-weight:800;margin-bottom:6px;">Our Mission</h4>
            <p style="font-size:12.5px;color:var(--muted);line-height:1.6;">To make powerful media tools simple, accessible and free for everyone worldwide.</p>
          </div>

          <div class="settings-card" style="text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">⭐</div>
            <h4 style="font-size:16px;font-weight:800;margin-bottom:6px;">Why Tool Hub?</h4>
            <p style="font-size:12.5px;color:var(--muted);line-height:1.6;">Fast, secure, easy to use and works directly in your browser on any device.</p>
          </div>

          <div class="settings-card" style="text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">🔒</div>
            <h4 style="font-size:16px;font-weight:800;margin-bottom:6px;">Privacy First</h4>
            <p style="font-size:12.5px;color:var(--muted);line-height:1.6;">Your files stay on your device. We don't store or transmit your private files.</p>
          </div>

          <div class="settings-card" style="text-align:center;">
            <div style="font-size:40px;margin-bottom:12px;">📊</div>
            <h4 style="font-size:16px;font-weight:800;margin-bottom:6px;">Continuously Improving</h4>
            <p style="font-size:12.5px;color:var(--muted);line-height:1.6;">We keep adding new tools and features based on user feedback and modern web standards.</p>
          </div>
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());

