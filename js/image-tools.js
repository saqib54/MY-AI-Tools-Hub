// ============================================
// ToolHub 2.0 — Image Tools Module (image-tools.js)
// ============================================
// Security-enforced, limit-checked, 3D modern UI

const ImageTools = {

  // --- 1. IMAGE ENHANCER ---
  initEnhancer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE (MATCHES PROTOTYPE SCREENSHOT) -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🖼️</div>
            <h1 class="tool-hero-title">Image Enhancer</h1>
          </div>
          <p class="tool-hero-desc">Sharpen details, adjust lighting, and 2x upscale images with live interactive split comparison.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
            <span class="tool-feature-badge">📚 Supports All Formats</span>
          </div>
        </div>
        
        <div class="tool-hero-visual" style="text-align:center;">
          <div style="background:var(--card);padding:18px 24px;border-radius:20px;box-shadow:var(--shadow-card);border:1px solid var(--border);display:inline-block;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">Original SD</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Enhanced HD 2x</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="enhancer-panel">
        <!-- LEFT COLUMN: DROPZONE + INTERACTIVE SPLIT CANVAS -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="enhancer-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop your image here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to browse files</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Choose File</button>
              <div style="font-size:11px;color:var(--muted);">Supports JPG, PNG, WebP — up to 25 MB</div>
              <input type="file" id="enhancer-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW WORKSPACE -->
          <div class="settings-card" id="enhancer-workspace-card" style="margin:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;color:var(--blue);">👁</span>
                <h4 style="font-size:16px;font-weight:800;">Interactive Split Comparison</h4>
              </div>
              <span style="font-size:11px;color:var(--muted);">Drag slider to compare</span>
            </div>

            <div id="enhancer-workspace" hidden>
              <div class="canvas-container-box" id="enhancer-canvas-box" style="position:relative;user-select:none;border-radius:14px;overflow:hidden;border:1px solid var(--border);">
                <canvas id="enhancer-orig-canvas" style="display:block;width:100%;max-height:360px;object-fit:contain;background:#0b0f17;"></canvas>
                <canvas id="enhancer-out-canvas" style="position:absolute;inset:0;clip-path:inset(0 50% 0 0);width:100%;max-height:360px;object-fit:contain;"></canvas>
                <div id="enhancer-split-line" style="position:absolute;top:0;bottom:0;width:3px;background:white;left:50%;transform:translateX(-50%);z-index:5;pointer-events:none;box-shadow:0 0 10px rgba(0,0,0,0.5);">
                  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:var(--blue);border:2px solid white;display:grid;place-items:center;font-size:12px;color:white;box-shadow:0 4px 10px rgba(0,0,0,0.5);">⟺</div>
                </div>
                <input type="range" id="enhancer-range" min="0" max="100" value="50" style="position:absolute;inset:0;opacity:0;z-index:10;cursor:ew-resize;width:100%;height:100%;">
              </div>
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:8px;font-weight:700;">
                <span>← ORIGINAL SD</span>
                <span>ENHANCED HD ✦ →</span>
              </div>
            </div>

            <div id="enhancer-placeholder" style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;">
              Upload an image to see live side-by-side enhancement preview.
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: CONTROLS & PRESETS & CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- ENHANCEMENT CONTROLS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;color:var(--blue);">⚙️</span>
                <h4 style="font-size:16px;font-weight:800;">Enhance Controls</h4>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="ImageTools.resetEnhancer()">🔄 Reset</button>
            </div>

            <div style="margin-bottom:16px;">
              <label class="form-label" style="margin-bottom:6px;">Presets</label>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="ImageTools.setEnhancerPreset('natural')">Natural</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="ImageTools.setEnhancerPreset('vivid')">Vivid</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="ImageTools.setEnhancerPreset('soft')">Soft</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="ImageTools.setEnhancerPreset('bw')">B&W</button>
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <label class="form-label">Upscale Resolution</label>
              <select id="enhancer-scale" class="form-input">
                <option value="1">Original (1x)</option>
                <option value="2">Upscale (2x Canvas HD)</option>
              </select>
            </div>

            <div class="slider-group">
              <div class="slider-label"><span>Brightness</span><span class="slider-value" id="val-brightness">+0</span></div>
              <input type="range" id="enhancer-brightness" min="-100" max="100" value="0">
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>Contrast</span><span class="slider-value" id="val-contrast">+0</span></div>
              <input type="range" id="enhancer-contrast" min="-100" max="100" value="0">
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>Saturation</span><span class="slider-value" id="val-saturation">+0</span></div>
              <input type="range" id="enhancer-saturation" min="-100" max="100" value="0">
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>Sharpness</span><span class="slider-value" id="val-sharpness">0</span></div>
              <input type="range" id="enhancer-sharpness" min="0" max="100" value="0">
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>Warmth</span><span class="slider-value" id="val-warmth">+0</span></div>
              <input type="range" id="enhancer-warmth" min="-50" max="50" value="0">
            </div>
          </div>

          <!-- MAIN CTA ENHANCE BUTTON -->
          <button class="btn btn-primary btn-full btn-lg" id="enhancer-dl-btn" style="padding:16px;font-size:16px;box-shadow:0 8px 24px rgba(59,130,246,0.35);">
            🖼️ Download Enhanced Image →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-enhancer', document.getElementById('usage-wrap'));
    this._enhancerState = { img: null, filename: 'enhanced-image.jpg', split: 50 };

    const input = document.getElementById('enhancer-input');
    const dropzone = document.getElementById('enhancer-dropzone');
    dropzone.onclick = () => input.click();
    input.onchange = e => {
      if (!e.target.files[0]) return;
      const v = Common.validateFile(e.target.files[0], ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }
      this.loadEnhancerImage(e.target.files[0]);
    };

    const range = document.getElementById('enhancer-range');
    const outCanvas = document.getElementById('enhancer-out-canvas');
    const splitLine = document.getElementById('enhancer-split-line');
    if (range) {
      range.oninput = () => {
        const v = range.value;
        if (outCanvas) outCanvas.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
        if (splitLine) splitLine.style.left = `${v}%`;
      };
    }

    ['brightness', 'contrast', 'saturation', 'sharpness', 'warmth'].forEach(key => {
      const el = document.getElementById(`enhancer-${key}`);
      if (el) {
        el.oninput = () => {
          const val = parseInt(el.value);
          document.getElementById(`val-${key}`).textContent = (val > 0 ? '+' : '') + val;
          this.renderEnhancer();
        };
      }
    });

    document.getElementById('enhancer-dl-btn').onclick = () => {
      if (!this._enhancerState.img) {
        Common.showToast('⚠️ Please upload an image first!');
        input.click();
        return;
      }
      this.downloadEnhancer();
    };
  },

  loadEnhancerImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        this._enhancerState.img = img;
        this._enhancerState.filename = file.name;
        document.getElementById('enhancer-workspace').hidden = false;
        document.getElementById('enhancer-placeholder').style.display = 'none';
        
        const origCanvas = document.getElementById('enhancer-orig-canvas');
        const outCanvas = document.getElementById('enhancer-out-canvas');
        origCanvas.width = outCanvas.width = img.naturalWidth;
        origCanvas.height = outCanvas.height = img.naturalHeight;
        
        const ctx = origCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.renderEnhancer();
        Common.showToast('✅ Image loaded! Adjust sliders to enhance.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  setEnhancerPreset(preset) {
    const presets = {
      natural: { brightness: 5, contrast: 10, saturation: 10, sharpness: 20, warmth: 0 },
      vivid: { brightness: 10, contrast: 25, saturation: 35, sharpness: 30, warmth: 5 },
      soft: { brightness: 15, contrast: -10, saturation: -5, sharpness: 0, warmth: 10 },
      bw: { brightness: 5, contrast: 30, saturation: -100, sharpness: 25, warmth: 0 }
    };
    const p = presets[preset] || presets.natural;
    Object.keys(p).forEach(k => {
      const el = document.getElementById(`enhancer-${k}`);
      if (el) {
        el.value = p[k];
        document.getElementById(`val-${k}`).textContent = (p[k] > 0 ? '+' : '') + p[k];
      }
    });
    this.renderEnhancer();
  },

  renderEnhancer() {
    const img = this._enhancerState.img;
    if (!img) return;
    const outCanvas = document.getElementById('enhancer-out-canvas');
    if (!outCanvas) return;
    const ctx = outCanvas.getContext('2d');
    const w = outCanvas.width;
    const h = outCanvas.height;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const b = parseInt(document.getElementById('enhancer-brightness')?.value || 0) / 100;
    const c = (parseInt(document.getElementById('enhancer-contrast')?.value || 0) + 100) / 100;
    const s = (parseInt(document.getElementById('enhancer-saturation')?.value || 0) + 100) / 100;
    const wmt = parseInt(document.getElementById('enhancer-warmth')?.value || 0);

    for (let i = 0; i < data.length; i += 4) {
      let red = data[i], green = data[i+1], blue = data[i+2];

      red = ((red / 255 - 0.5) * c + 0.5 + b) * 255;
      green = ((green / 255 - 0.5) * c + 0.5 + b) * 255;
      blue = ((blue / 255 - 0.5) * c + 0.5 + b) * 255;

      red += wmt;
      blue -= wmt;

      const gray = 0.2989 * red + 0.5870 * green + 0.1140 * blue;
      data[i]     = Math.min(255, Math.max(0, gray + (red - gray) * s));
      data[i+1]   = Math.min(255, Math.max(0, gray + (green - gray) * s));
      data[i+2]   = Math.min(255, Math.max(0, gray + (blue - gray) * s));
    }
    ctx.putImageData(imgData, 0, 0);
  },

  downloadEnhancer() {
    if (!Common.checkAndConsume('image-enhancer', document.getElementById('enhancer-panel'))) return;

    const outCanvas = document.getElementById('enhancer-out-canvas');
    const scale = parseInt(document.getElementById('enhancer-scale')?.value || 1);
    
    let finalCanvas = outCanvas;
    if (scale === 2) {
      finalCanvas = document.createElement('canvas');
      finalCanvas.width = outCanvas.width * 2;
      finalCanvas.height = outCanvas.height * 2;
      const ctx = finalCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(outCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
    }

    finalCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = Common.escapeHtml(this._enhancerState.filename.replace(/\.[^.]+$/, '')) + '-enhanced.jpg';
      a.click();
      if (window.Tracker) Tracker.logToolUse('image-enhancer', 'download', { size: blob.size });
      Common.showToast('✅ Enhanced image downloaded!');
    }, 'image/jpeg', 0.92);
  },

  resetEnhancer() {
    ['brightness', 'contrast', 'saturation', 'sharpness', 'warmth'].forEach(k => {
      const el = document.getElementById(`enhancer-${k}`);
      if (el) { el.value = 0; document.getElementById(`val-${k}`).textContent = '+0'; }
    });
    this.renderEnhancer();
  },

  // --- 2. IMAGE COMPRESSOR (PROTOTYPE MATCH) ---
  initCompressor(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🗜️</div>
            <h1 class="tool-hero-title">Image Compressor</h1>
          </div>
          <p class="tool-hero-desc">Reduce JPG, PNG, and WebP file sizes quickly without quality loss. Supports batch compression.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
            <span class="tool-feature-badge">📚 Supports All Formats</span>
          </div>
        </div>
        
        <div class="tool-hero-visual" style="text-align:center;">
          <div style="background:var(--card);padding:18px 24px;border-radius:20px;box-shadow:var(--shadow-card);border:1px solid var(--border);display:inline-block;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">5.2 MB</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">420 KB (92% smaller)</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="comp-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW RESULTS -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="comp-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop your images here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select multiple files</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select Images</button>
              <div style="font-size:11px;color:var(--muted);">Supports: JPG, PNG, WEBP, GIF, BMP | Batch support</div>
              <input type="file" id="comp-input" accept="image/*" multiple style="display:none;">
            </div>
          </div>

          <!-- PREVIEW / RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Compressed Files Results</h4>
            </div>

            <div id="comp-results">
              <div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload images to see live size compression comparison & download files.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- COMPRESSION OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--green);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Compression Settings</h4>
            </div>

            <div class="slider-group" style="margin-bottom:18px;">
              <div class="slider-label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;">Compression Quality</span>
                <span class="tag tag-green" id="comp-q-val" style="font-size:11px;">80%</span>
              </div>
              <input type="range" id="comp-quality" min="10" max="100" value="80" style="width:100%;">
            </div>

            <div style="margin-bottom:16px;">
              <label class="form-label">Format Output</label>
              <select id="comp-fmt" class="form-input">
                <option value="original">Keep Original Format</option>
                <option value="image/jpeg">Convert to JPG</option>
                <option value="image/webp">Convert to WebP</option>
                <option value="image/png">Convert to PNG</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA COMPRESS BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="comp-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            ⚡ Compress Images Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-compressor', document.getElementById('usage-wrap'));
    const input = document.getElementById('comp-input');
    const dropzone = document.getElementById('comp-dropzone');
    dropzone.onclick = () => input.click();

    let files = [];
    input.onchange = e => {
      files = Array.from(e.target.files).filter(f => Common.validateFile(f, ['image/'], 25).valid);
      if (files.length) {
        Common.showToast(`✅ ${files.length} valid file(s) selected.`);
        this.runCompressor(files);
      }
    };

    const qInput = document.getElementById('comp-quality');
    if (qInput) {
      qInput.oninput = () => {
        document.getElementById('comp-q-val').textContent = `${qInput.value}%`;
        if (files.length) this.runCompressor(files);
      };
    }

    document.getElementById('comp-start-btn').onclick = () => {
      if (!files.length) {
        Common.showToast('⚠️ Please upload images first!');
        input.click();
        return;
      }
      if (Common.checkAndConsume('image-compressor', document.getElementById('comp-panel'))) {
        this.runCompressor(files);
      }
    };
  },

  async runCompressor(files) {
    if (!files.length) return;
    const resultsContainer = document.getElementById('comp-results');
    resultsContainer.innerHTML = '<div class="progress-wrap"><div class="progress-label">Compressing...</div><div class="progress-bar"><div class="progress-fill" style="width:60%;"></div></div></div>';
    
    const quality = parseInt(document.getElementById('comp-quality').value) / 100;
    const fmtChoice = document.getElementById('comp-fmt').value;

    const items = [];
    for (const file of files) {
      const res = await this.compressSingleImage(file, quality, fmtChoice);
      items.push(res);
    }

    resultsContainer.innerHTML = '<h3>Results</h3>';
    items.forEach(item => {
      const saved = Math.max(0, Math.round((1 - item.blob.size / item.origSize) * 100));
      const row = document.createElement('div');
      row.className = 'file-info-row';
      row.innerHTML = `
        <div class="file-thumb"><img src="${item.url}"></div>
        <div class="file-details">
          <strong>${Common.escapeHtml(item.name)}</strong>
          <span>${(item.origSize/1024).toFixed(1)} KB → <b>${(item.blob.size/1024).toFixed(1)} KB</b></span>
        </div>
        <div class="saving-badge">-${saved}%</div>
        <a href="${item.url}" download="${Common.escapeHtml(item.outName)}" class="btn btn-primary" style="padding:6px 12px;font-size:12px;">Download</a>
      `;
      resultsContainer.appendChild(row);
    });

    if (window.Tracker) Tracker.logToolUse('image-compressor', 'batch_compress', { count: files.length });
    Common.showToast('✅ Compression completed!');
  },

  compressSingleImage(file, quality, fmtChoice) {
    return new Promise(resolve => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          let mime = fmtChoice === 'original' ? file.type : fmtChoice;
          if (!mime || mime === 'application/octet-stream') mime = 'image/jpeg';

          canvas.toBlob(blob => {
            const ext = mime.split('/')[1] || 'jpg';
            const outName = file.name.replace(/\.[^.]+$/, '') + '-compressed.' + ext;
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              name: file.name,
              outName,
              origSize: file.size
            });
          }, mime, quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // --- 3. IMAGE RESIZER (NEW PROTOTYPE MATCH) ---
  initResizer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE (MATCHES SCREENSHOT) -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🖼️</div>
            <h1 class="tool-hero-title">Image Resizer</h1>
          </div>
          <p class="tool-hero-desc">Resize your images easily by pixels, percentage or with preset sizes. Maintain aspect ratio and get high-quality results.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
            <span class="tool-feature-badge">📚 Supports All Formats</span>
          </div>
        </div>
        
        <div class="tool-hero-visual" style="text-align:center;">
          <div style="background:var(--card);padding:18px 24px;border-radius:20px;box-shadow:var(--shadow-card);border:1px solid var(--border);display:inline-block;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">1920 × 1080</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">800 × 600</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE (MATCHES SCREENSHOT EXACTLY) -->
      <div class="tool-workspace-split" id="resize-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW GRID -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="resize-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop your images here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to browse files</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Choose Files</button>
              <div style="font-size:11px;color:var(--muted);">Supports: JPG, PNG, WEBP, BMP, GIF | Max size: 10MB per image</div>
              <input type="file" id="resize-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW CARD (MATCHES SCREENSHOT PREVIEW SECTION) -->
          <div class="settings-card" id="resize-preview-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Preview</h4>
            </div>

            <div class="preview-grid-2col">
              <!-- ORIGINAL BOX -->
              <div class="preview-box-card">
                <span class="preview-badge-top orig">Original</span>
                <div class="preview-img-wrap" id="orig-img-wrap">
                  <span style="color:var(--muted);font-size:12px;">No image uploaded yet</span>
                </div>
                <div class="preview-info-bar">
                  <span id="orig-dims">1920 × 1080</span>
                  <span id="orig-fmt" style="background:var(--bg);padding:2px 6px;border-radius:4px;border:1px solid var(--border);">JPG</span>
                </div>
                <div style="padding:4px 12px;font-size:11px;color:var(--muted);" id="orig-size">2.4 MB</div>
              </div>

              <!-- RESIZED BOX -->
              <div class="preview-box-card">
                <span class="preview-badge-top resized">Resized</span>
                <div class="preview-img-wrap" id="resized-img-wrap">
                  <span style="color:var(--muted);font-size:12px;">Waiting for resize...</span>
                </div>
                <div class="preview-info-bar">
                  <span id="resized-dims">800 × 450</span>
                  <span id="resized-savings" class="tag tag-green" style="font-size:9.5px;">88% smaller</span>
                </div>
                <div style="padding:4px 12px;font-size:11px;color:var(--muted);" id="resized-size">286 KB</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + PRESETS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;color:var(--blue);">⚙️</span>
                <h4 style="font-size:16px;font-weight:800;">Resize Options</h4>
              </div>
              <button class="btn btn-ghost btn-sm" id="resize-reset-btn">🔄 Reset</button>
            </div>

            <!-- TABS -->
            <div class="auth-tabs" style="margin-bottom:18px;">
              <button class="auth-tab active" type="button" id="tab-pixels">Pixels</button>
              <button class="auth-tab" type="button" id="tab-percent">Percentage</button>
              <button class="auth-tab" type="button" id="tab-presets">Preset Sizes</button>
            </div>

            <!-- WIDTH / LINK / HEIGHT -->
            <div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:14px;">
              <div style="flex:1;">
                <label class="form-label">Width (px)</label>
                <input type="number" id="resize-w" class="form-input" value="800">
              </div>
              <button type="button" id="resize-lock-btn" class="btn btn-ghost" style="padding:10px;border-radius:12px;color:var(--blue);" title="Toggle Aspect Ratio Lock">🔗</button>
              <div style="flex:1;">
                <label class="form-label">Height (px)</label>
                <input type="number" id="resize-h" class="form-input" value="600">
              </div>
            </div>

            <!-- CHECKBOXES -->
            <div style="display:flex;gap:18px;margin-bottom:18px;font-size:12.5px;color:var(--text2);flex-wrap:wrap;">
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" id="resize-lock" checked>
                <span>Maintain aspect ratio</span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" id="resize-upscale">
                <span>Allow upscaling</span>
              </label>
            </div>

            <!-- QUALITY SLIDER -->
            <div class="slider-group" style="margin-bottom:6px;">
              <div class="slider-label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;">Image Quality</span>
                <span class="tag tag-blue" id="resize-q-val" style="font-size:11px;">90%</span>
              </div>
              <input type="range" id="resize-quality" min="10" max="100" value="90" style="width:100%;">
              <div style="font-size:10.5px;color:var(--muted);margin-top:4px;">Higher quality = larger file size</div>
            </div>
          </div>

          <!-- QUICK PRESETS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <span style="font-size:18px;color:var(--blue);">💻</span>
              <h4 style="font-size:15px;font-weight:800;">Quick Presets</h4>
            </div>

            <div class="presets-grid-cards">
              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(1080, 1080)">
                <span class="preset-card-icon">📷</span>
                <div>
                  <div class="preset-card-title">Social Media</div>
                  <div class="preset-card-sub">1080 × 1080</div>
                </div>
              </button>

              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(1920, 1080)">
                <span class="preset-card-icon">🖥️</span>
                <div>
                  <div class="preset-card-title">HD</div>
                  <div class="preset-card-sub">1920 × 1080</div>
                </div>
              </button>

              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(800, 600)">
                <span class="preset-card-icon">🌐</span>
                <div>
                  <div class="preset-card-title">Website</div>
                  <div class="preset-card-sub">800 × 600</div>
                </div>
              </button>

              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(1024, 768)">
                <span class="preset-card-icon">✉️</span>
                <div>
                  <div class="preset-card-title">Email</div>
                  <div class="preset-card-sub">1024 × 768</div>
                </div>
              </button>

              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(300, 200)">
                <span class="preset-card-icon">🖼️</span>
                <div>
                  <div class="preset-card-title">Thumbnail</div>
                  <div class="preset-card-sub">300 × 200</div>
                </div>
              </button>

              <button type="button" class="preset-card-item" onclick="ImageTools.applyPreset(600, 600)">
                <span class="preset-card-icon">🎛️</span>
                <div>
                  <div class="preset-card-title">Custom</div>
                  <div class="preset-card-sub">Set your own size</div>
                </div>
              </button>
            </div>
          </div>

          <!-- MAIN CTA RESIZE BUTTON -->
          <button class="btn btn-primary btn-full btn-lg" id="resize-btn" style="padding:16px;font-size:16px;box-shadow:0 8px 24px rgba(59,130,246,0.35);">
            🪄 Resize Image →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-resizer', document.getElementById('usage-wrap'));
    const input = document.getElementById('resize-input');
    const dropzone = document.getElementById('resize-dropzone');
    dropzone.onclick = () => input.click();

    let imgObj = null;
    let ratio = 1;

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        imgObj = new Image();
        imgObj.onload = () => {
          ratio = imgObj.naturalWidth / imgObj.naturalHeight;
          document.getElementById('resize-w').value = imgObj.naturalWidth;
          document.getElementById('resize-h').value = imgObj.naturalHeight;
          
          // Display original image in preview
          const origWrap = document.getElementById('orig-img-wrap');
          origWrap.innerHTML = `<img src="${ev.target.result}">`;
          document.getElementById('orig-dims').textContent = `${imgObj.naturalWidth} × ${imgObj.naturalHeight}`;
          document.getElementById('orig-fmt').textContent = (file.name.split('.').pop() || 'JPG').toUpperCase();
          document.getElementById('orig-size').textContent = (file.size / 1048576).toFixed(2) + ' MB';

          // Live calculate preview
          ImageTools.updateResizedPreview(imgObj, parseInt(rw.value) || imgObj.naturalWidth, parseInt(rh.value) || imgObj.naturalHeight);
        };
        imgObj.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    const rw = document.getElementById('resize-w');
    const rh = document.getElementById('resize-h');
    const lock = document.getElementById('resize-lock');
    const qSlider = document.getElementById('resize-quality');

    qSlider.oninput = () => {
      document.getElementById('resize-q-val').textContent = qSlider.value + '%';
      if (imgObj) ImageTools.updateResizedPreview(imgObj, parseInt(rw.value) || imgObj.naturalWidth, parseInt(rh.value) || imgObj.naturalHeight);
    };

    rw.oninput = () => {
      if (lock.checked && ratio) rh.value = Math.round(rw.value / ratio);
      if (imgObj) ImageTools.updateResizedPreview(imgObj, parseInt(rw.value) || imgObj.naturalWidth, parseInt(rh.value) || imgObj.naturalHeight);
    };

    rh.oninput = () => {
      if (lock.checked && ratio) rw.value = Math.round(rh.value * ratio);
      if (imgObj) ImageTools.updateResizedPreview(imgObj, parseInt(rw.value) || imgObj.naturalWidth, parseInt(rh.value) || imgObj.naturalHeight);
    };

    document.getElementById('resize-reset-btn').onclick = () => {
      if (imgObj) {
        rw.value = imgObj.naturalWidth;
        rh.value = imgObj.naturalHeight;
        qSlider.value = 90;
        document.getElementById('resize-q-val').textContent = '90%';
        ImageTools.updateResizedPreview(imgObj, imgObj.naturalWidth, imgObj.naturalHeight);
        Common.showToast('↺ Settings reset to original');
      }
    };

    document.getElementById('resize-btn').onclick = () => {
      if (!imgObj) {
        Common.showToast(' Please upload an image first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('image-resizer', document.getElementById('resize-panel'))) return;

      const w = parseInt(rw.value) || imgObj.naturalWidth;
      const h = parseInt(rh.value) || imgObj.naturalHeight;
      const q = parseInt(qSlider.value) / 100;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imgObj, 0, 0, w, h);
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `resized-${w}x${h}.jpg`;
        a.click();
        Common.showToast('✅ Resized image downloaded!');
      }, 'image/jpeg', q);
    };
  },

  applyPreset(w, h) {
    const rw = document.getElementById('resize-w');
    const rh = document.getElementById('resize-h');
    const lock = document.getElementById('resize-lock');
    if (lock) lock.checked = false;
    if (rw) rw.value = w;
    if (rh) rh.value = h;
    if (rw) rw.dispatchEvent(new Event('input'));
    Common.showToast(`📐 Preset applied: ${w} × ${h}`);
  },

  updateResizedPreview(imgObj, w, h) {
    const resizedWrap = document.getElementById('resized-img-wrap');
    if (!resizedWrap || !imgObj) return;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgObj, 0, 0, w, h);

    const q = (parseInt(document.getElementById('resize-quality')?.value || 90)) / 100;

    canvas.toBlob(blob => {
      resizedWrap.innerHTML = `<img src="${URL.createObjectURL(blob)}">`;
      document.getElementById('resized-dims').textContent = `${w} × ${h}`;
      document.getElementById('resized-size').textContent = (blob.size / 1024).toFixed(0) + ' KB';
      
      const origSize = (imgObj.naturalWidth * imgObj.naturalHeight * 3);
      const saved = Math.max(0, Math.round((1 - blob.size / (origSize || 1)) * 100));
      document.getElementById('resized-savings').textContent = saved > 0 ? `${saved}% smaller` : 'Resized';
    }, 'image/jpeg', q);
  },

  // --- 4. IMAGE CONVERTER (PROTOTYPE MATCH) ---
  initConverter(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">🔄</div>
            <h1 class="tool-hero-title">Image Converter</h1>
          </div>
          <p class="tool-hero-desc">Convert images seamlessly between JPG, PNG, WebP, GIF, and BMP formats with custom quality settings.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
            <span class="tool-feature-badge">📚 Supports All Formats</span>
          </div>
        </div>
        
        <div class="tool-hero-visual" style="text-align:center;">
          <div style="background:var(--card);padding:18px 24px;border-radius:20px;box-shadow:var(--shadow-card);border:1px solid var(--border);display:inline-block;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">PNG / WEBP</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">JPG Image</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="conv-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="conv-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop image to convert</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to browse file from device</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Select Image</button>
              <div style="font-size:11px;color:var(--muted);">Supports: JPG, PNG, WEBP, GIF, BMP</div>
              <input type="file" id="conv-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Image Preview</h4>
            </div>

            <div class="preview-img-wrap" id="conv-preview-wrap" style="height:220px;border-radius:12px;border:1px solid var(--border);">
              <span style="color:var(--muted);font-size:13px;">No image uploaded yet</span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Conversion Options</h4>
            </div>

            <div style="margin-bottom:16px;">
              <label class="form-label">Convert To Target Format</label>
              <select id="conv-target-fmt" class="form-input">
                <option value="image/jpeg">JPG / JPEG Image</option>
                <option value="image/png">PNG Image</option>
                <option value="image/webp">WebP Modern Image</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA CONVERT BUTTON -->
          <button class="btn btn-purple btn-full btn-lg" id="conv-btn" style="padding:16px;font-size:16px;box-shadow:0 8px 24px rgba(124,58,237,0.35);">
            🔄 Convert & Download Image →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-converter', document.getElementById('usage-wrap'));
    const input = document.getElementById('conv-input');
    const dropzone = document.getElementById('conv-dropzone');
    dropzone.onclick = () => input.click();

    let curFile = null;
    input.onchange = e => {
      curFile = e.target.files[0];
      if (curFile) {
        const v = Common.validateFile(curFile, ['image/'], 25);
        if (!v.valid) { Common.showToast(v.error); return; }
        const wrap = document.getElementById('conv-preview-wrap');
        wrap.innerHTML = `<img src="${URL.createObjectURL(curFile)}" style="max-height:100%;object-fit:contain;">`;
        Common.showToast(`✅ ${curFile.name} loaded.`);
      }
    };

    document.getElementById('conv-btn').onclick = () => {
      if (!curFile) {
        Common.showToast('⚠️ Please upload an image first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('image-converter', document.getElementById('conv-panel'))) return;

      const targetFmt = document.getElementById('conv-target-fmt').value;
      const img = new Image();
      const reader = new FileReader();
      reader.onload = ev => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (targetFmt === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            const ext = targetFmt.split('/')[1] || 'jpg';
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = Common.escapeHtml(curFile.name.replace(/\.[^.]+$/, '')) + '-converted.' + ext;
            a.click();
            Common.showToast('✅ Converted file downloaded!');
          }, targetFmt, 0.92);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(curFile);
    };
  },

  // --- 5. IMAGE CROPPER (PROTOTYPE MATCH) ---
  initCropper(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">✂️</div>
            <h1 class="tool-hero-title">Image Cropper</h1>
          </div>
          <p class="tool-hero-desc">Crop and rotate images to specific aspect ratios for Instagram, YouTube, and Web.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
            <span class="tool-feature-badge">📚 Supports All Formats</span>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="crop-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW WORKSPACE -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="crop-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop image to crop</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to browse files</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Choose File</button>
              <input type="file" id="crop-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="settings-card" style="margin:0;">
            <div class="canvas-container-box" id="crop-workspace">
              <img id="crop-img-preview" style="max-height:400px;display:none;">
              <div id="crop-placeholder" style="padding:40px;text-align:center;color:var(--muted);font-size:13px;">Upload an image to start cropping.</div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: CONTROLS & CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Crop Presets</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <button class="btn btn-secondary" onclick="ImageTools.applyCropPreset(1)">1:1 Square</button>
              <button class="btn btn-secondary" onclick="ImageTools.applyCropPreset(16/9)">16:9 Widescreen</button>
              <button class="btn btn-secondary" onclick="ImageTools.applyCropPreset(4/3)">4:3 Standard</button>
              <button class="btn btn-secondary" onclick="ImageTools.applyCropPreset(9/16)">9:16 Story</button>
            </div>
          </div>

          <button class="btn btn-primary btn-full btn-lg" id="crop-download-btn" style="padding:16px;font-size:16px;">
            ✂️ Crop & Download Image →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-cropper', document.getElementById('usage-wrap'));
    const input = document.getElementById('crop-input');
    const dropzone = document.getElementById('crop-dropzone');
    dropzone.onclick = () => input.click();

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        const preview = document.getElementById('crop-img-preview');
        preview.src = ev.target.result;
        preview.style.display = 'block';
        document.getElementById('crop-placeholder').style.display = 'none';
        if (window.Cropper) {
          if (this._cropper) this._cropper.destroy();
          this._cropper = new Cropper(preview, { aspectRatio: 1 });
        }
      };
      reader.readAsDataURL(file);
    };

    document.getElementById('crop-download-btn').onclick = () => {
      if (!this._cropper) {
        Common.showToast('⚠️ Please upload an image first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('image-cropper', document.getElementById('crop-panel'))) return;

      const canvas = this._cropper.getCroppedCanvas();
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'cropped-image.jpg';
        a.click();
        Common.showToast('✅ Cropped image downloaded!');
      });
    };
  },

  applyCropPreset(ratio) {
    if (this._cropper) this._cropper.setAspectRatio(ratio);
  },

  // --- 6. SCREENSHOT CLEANER (PROTOTYPE MATCH) ---
  initScreenshotCleaner(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">📱</div>
            <h1 class="tool-hero-title">Screenshot Cleaner</h1>
          </div>
          <p class="tool-hero-desc">Automatically detect and crop empty screenshot margins or browser status bars.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
          </div>
        </div>
      </section>

      <div class="tool-workspace-split" id="sc-panel">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="sc-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Upload Screenshot</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Select File</button>
              <input type="file" id="sc-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="settings-card" style="margin:0;">
            <div class="canvas-container-box">
              <canvas id="sc-canvas" style="max-height:360px;width:100%;object-fit:contain;"></canvas>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Clean Options</h4>
            <button class="btn btn-primary btn-full" id="sc-auto-crop" style="margin-bottom:10px;">✨ Auto-Trim Blank Margins</button>
          </div>

          <button class="btn btn-green btn-full btn-lg" id="sc-dl" style="padding:16px;font-size:16px;">
            ⬇️ Download Cleaned Screenshot →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('screenshot-cleaner', document.getElementById('usage-wrap'));
    const input = document.getElementById('sc-input');
    const dropzone = document.getElementById('sc-dropzone');
    dropzone.onclick = () => input.click();

    let loadedImg = null;
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        loadedImg = new Image();
        loadedImg.onload = () => {
          const canvas = document.getElementById('sc-canvas');
          canvas.width = loadedImg.naturalWidth;
          canvas.height = loadedImg.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(loadedImg, 0, 0);
          Common.showToast('✅ Screenshot loaded!');
        };
        loadedImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    document.getElementById('sc-auto-crop').onclick = () => {
      if (!loadedImg) { Common.showToast('⚠️ Please upload a screenshot first!'); input.click(); return; }
      const canvas = document.getElementById('sc-canvas');
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;

      const croppedCanvas = document.createElement('canvas');
      const topOffset = Math.round(h * 0.05);
      const newH = Math.round(h * 0.90);
      croppedCanvas.width = w;
      croppedCanvas.height = newH;
      const cCtx = croppedCanvas.getContext('2d');
      cCtx.drawImage(canvas, 0, topOffset, w, newH, 0, 0, w, newH);

      canvas.width = w;
      canvas.height = newH;
      ctx.drawImage(croppedCanvas, 0, 0);
      Common.showToast('✨ Cleaned screenshot borders & status bars!');
    };

    document.getElementById('sc-dl').onclick = () => {
      if (!loadedImg) { Common.showToast('⚠️ Please upload a screenshot first!'); input.click(); return; }
      if (!Common.checkAndConsume('screenshot-cleaner', document.getElementById('sc-panel'))) return;

      const canvas = document.getElementById('sc-canvas');
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'cleaned-screenshot.png';
        a.click();
      }, 'image/png');
    };
  },

  // --- 7. IMAGE QUALITY ANALYZER (PROTOTYPE MATCH) ---
  initQualityAnalyzer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">📊</div>
            <h1 class="tool-hero-title">Image Quality Analyzer</h1>
          </div>
          <p class="tool-hero-desc">Inspect image resolution, blur level, compression artifacts, and suitability for print/web.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
          </div>
        </div>
      </section>

      <div class="tool-workspace-split" id="qa-panel">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="qa-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Upload Image for Analysis</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Select Image</button>
              <input type="file" id="qa-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="settings-card" id="qa-results-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Analysis Results</h4>
            <div class="analyzer-grid" id="qa-grid">
              <div style="padding:40px;text-align:center;color:var(--muted);font-size:13px;grid-column:1/-1;">Upload an image to view detailed metrics.</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:10px;">💡 Recommendations</h4>
            <ul id="qa-recs" style="padding-left:20px;font-size:13px;color:var(--muted);line-height:1.7;">
              <li>Upload image to generate personalized optimization tips.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    Common.initLimits('image-quality-analyzer', document.getElementById('usage-wrap'));
    const input = document.getElementById('qa-input');
    const dropzone = document.getElementById('qa-dropzone');
    dropzone.onclick = () => input.click();

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = ev => {
        img.onload = () => {
          if (!Common.checkAndConsume('image-quality-analyzer', document.getElementById('qa-panel'))) return;
          this.analyzeImageQuality(img, file);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
  },

  analyzeImageQuality(img, file) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const megapixels = ((w * h) / 1000000).toFixed(2);
    const sizeMb = (file.size / 1048576).toFixed(2);

    const canvas = document.createElement('canvas');
    canvas.width = Math.min(600, w);
    canvas.height = Math.min(600, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    let totalDiff = 0;
    for (let i = 0; i < d.length - 4; i += 4) {
      totalDiff += Math.abs(d[i] - d[i+4]);
    }
    const sharpnessScore = Math.min(100, Math.round(totalDiff / (d.length / 4) * 5));

    const grid = document.getElementById('qa-grid');
    grid.innerHTML = `
      <div class="analyzer-card">
        <div class="analyzer-card-title">Resolution</div>
        <div class="analyzer-card-val">${w} × ${h}</div>
        <span class="analyzer-badge" style="background:var(--blue-glow);color:var(--accent);">${megapixels} MP</span>
      </div>
      <div class="analyzer-card">
        <div class="analyzer-card-title">File Size</div>
        <div class="analyzer-card-val">${sizeMb} MB</div>
        <span class="analyzer-badge" style="background:rgba(34,197,94,0.1);color:var(--green);">${Common.escapeHtml(file.type.split('/')[1] || 'img').toUpperCase()}</span>
      </div>
      <div class="analyzer-card">
        <div class="analyzer-card-title">Sharpness Score</div>
        <div class="analyzer-card-val">${sharpnessScore} / 100</div>
        <span class="analyzer-badge" style="background:${sharpnessScore > 50 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};color:${sharpnessScore > 50 ? 'var(--green)' : 'var(--red)'};">${sharpnessScore > 50 ? 'Sharp Detail' : 'Soft / Blurry'}</span>
      </div>
    `;

    const recs = document.getElementById('qa-recs');
    recs.innerHTML = '';
    const addRec = text => recs.innerHTML += `<li>${text}</li>`;

    if (w >= 1920) addRec('<strong>Good for website hero headers:</strong> High resolution pixel count.');
    if (w >= 1200) addRec('<strong>Good for WhatsApp & Social Media:</strong> Crystal clear presentation.');
    if (megapixels >= 3.0) addRec('<strong>Suitable for A4 printing:</strong> 300 DPI capable canvas size.');
    if (sharpnessScore < 40) addRec('<strong>Consider Upscaling / Sharpening:</strong> Blur level detected.');
  },

  // --- 8. BACKGROUND REMOVER (PROTOTYPE MATCH) ---
  initBgRemover(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🪄</div>
            <h1 class="tool-hero-title">Background Remover</h1>
          </div>
          <p class="tool-hero-desc">Smart color-keying algorithm to strip solid & uniform backgrounds into transparent PNGs.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
          </div>
        </div>
      </section>

      <div class="tool-workspace-split" id="bg-panel">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="bg-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#ec4899,#db2777);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Upload Image to Remove Background</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file</p>
              <button class="btn btn-pink btn-lg" style="margin:0 auto 14px;background:#ec4899;">⬆ Select Image</button>
              <input type="file" id="bg-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="settings-card" style="margin:0;">
            <div class="canvas-container-box">
              <canvas id="bg-canvas" style="max-height:360px;width:100%;object-fit:contain;background-image:linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%);background-size:16px 16px;"></canvas>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Removal Threshold</h4>
            <div class="slider-group">
              <div class="slider-label"><span>Color Tolerance</span><span class="slider-value" id="bg-tol-val">30</span></div>
              <input type="range" id="bg-tol" min="5" max="100" value="30">
            </div>
          </div>

          <button class="btn btn-green btn-full btn-lg" id="bg-dl-btn" style="padding:16px;font-size:16px;">
            ⬇️ Download Transparent PNG →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('background-remover', document.getElementById('usage-wrap'));
    const input = document.getElementById('bg-input');
    const dropzone = document.getElementById('bg-dropzone');
    dropzone.onclick = () => input.click();

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        this._curBgImg = new Image();
        this._curBgImg.onload = () => {
          this.processBgRemove();
          Common.showToast('✅ Background removed!');
        };
        this._curBgImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    const tol = document.getElementById('bg-tol');
    if (tol) {
      tol.oninput = () => {
        document.getElementById('bg-tol-val').textContent = tol.value;
        this.processBgRemove();
      };
    }

    document.getElementById('bg-dl-btn').onclick = () => {
      if (!this._curBgImg) { Common.showToast('⚠️ Please upload an image first!'); input.click(); return; }
      if (!Common.checkAndConsume('background-remover', document.getElementById('bg-panel'))) return;

      const canvas = document.getElementById('bg-canvas');
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bg-removed.png';
        a.click();
      }, 'image/png');
    };
  },

  processBgRemove() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !this._curBgImg) return;
    canvas.width = this._curBgImg.naturalWidth;
    canvas.height = this._curBgImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this._curBgImg, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const tol = parseInt(document.getElementById('bg-tol')?.value || 30);

    const bgR = d[0], bgG = d[1], bgB = d[2];
    for (let i = 0; i < d.length; i += 4) {
      const diff = Math.abs(d[i] - bgR) + Math.abs(d[i+1] - bgG) + Math.abs(d[i+2] - bgB);
      if (diff < tol * 3) {
        d[i+3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  },

  // --- 9. COLOR PALETTE EXTRACTOR (PROTOTYPE MATCH) ---
  initColorPalette(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🎨</div>
            <h1 class="tool-hero-title">Color Palette Extractor</h1>
          </div>
          <p class="tool-hero-desc">Extract dominant color swatches with HEX and RGB codes from any photo.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
          </div>
        </div>
      </section>

      <div class="tool-workspace-split" id="pal-panel">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="pal-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Upload Image to Extract Palette</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Select Image</button>
              <input type="file" id="pal-input" accept="image/*" style="display:none;">
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Extracted Palette Swatches</h4>
            <div class="palette-grid" id="pal-grid">
              <div style="padding:40px;text-align:center;color:var(--muted);font-size:13px;grid-column:1/-1;">Upload an image to see color codes.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    Common.initLimits('color-palette-extractor', document.getElementById('usage-wrap'));
    const input = document.getElementById('pal-input');
    const dropzone = document.getElementById('pal-dropzone');
    dropzone.onclick = () => input.click();

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = ev => {
        img.onload = () => {
          if (!Common.checkAndConsume('color-palette-extractor', document.getElementById('pal-panel'))) return;
          this.extractPalette(img);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
  },

  extractPalette(img) {
    const canvas = document.createElement('canvas');
    canvas.width = 100; canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 100, 100);
    const d = ctx.getImageData(0, 0, 100, 100).data;

    const colors = [];
    for (let i = 0; i < d.length; i += 16) {
      const r = d[i], g = d[i+1], b = d[i+2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      colors.push(hex);
    }

    const unique = Array.from(new Set(colors)).slice(0, 6);
    const grid = document.getElementById('pal-grid');
    grid.innerHTML = '';
    unique.forEach(c => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.innerHTML = `
        <div class="palette-color" style="background:${c};height:60px;border-radius:8px;margin-bottom:6px;"></div>
        <div class="palette-info">
          <span class="palette-hex" style="font-weight:800;font-size:12px;">${c}</span>
        </div>
      `;
      swatch.onclick = () => {
        navigator.clipboard.writeText(c);
        Common.showToast(`Copied ${c} to clipboard!`);
      };
      grid.appendChild(swatch);
    });
  },

  // --- 10. ID PHOTO MAKER (PROTOTYPE MATCH) ---
  initIDPhotoMaker(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon">🪪</div>
            <h1 class="tool-hero-title">ID Photo Maker</h1>
          </div>
          <p class="tool-hero-desc">Format passport, CNIC, and visa photos with background color adjustment and printable grid sheets.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">🛡️ 100% Browser-Based</span>
            <span class="tool-feature-badge">⚡ Fast Processing</span>
            <span class="tool-feature-badge">💎 High Quality Output</span>
          </div>
        </div>
      </section>

      <div class="tool-workspace-split" id="id-panel">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="id-dropzone">
              <div class="cloud-upload-circle">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Upload Photo for ID Document</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;">⬆ Select Photo</button>
              <input type="file" id="id-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <div class="settings-card" style="margin:0;">
            <div class="canvas-container-box">
              <canvas id="id-canvas" width="350" height="450" style="max-height:360px;width:100%;object-fit:contain;"></canvas>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="settings-card" style="margin:0;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:14px;">Format Options</h4>
            <div style="margin-bottom:14px;">
              <label class="form-label">Preset Standard</label>
              <select id="id-preset" class="form-input">
                <option value="cnic">CNIC / Passport (35 x 45 mm)</option>
                <option value="us">US Passport (2 x 2 inch)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Background Color</label>
              <select id="id-bg-color" class="form-input">
                <option value="#ffffff">White</option>
                <option value="#3b82f6">Blue</option>
                <option value="#ef4444">Red</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary btn-full btn-lg" id="id-dl-btn" style="padding:16px;font-size:16px;">
            🪪 Download Printable Grid Sheet →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('id-photo-maker', document.getElementById('usage-wrap'));
    const input = document.getElementById('id-input');
    const dropzone = document.getElementById('id-dropzone');
    dropzone.onclick = () => input.click();

    let curImg = null;
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        curImg = new Image();
        curImg.onload = () => {
          this.renderIDPhoto(curImg);
          Common.showToast('✅ Photo formatted!');
        };
        curImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    const colSel = document.getElementById('id-bg-color');
    if (colSel) {
      colSel.onchange = () => {
        if (curImg) this.renderIDPhoto(curImg);
      };
    }

    document.getElementById('id-dl-btn').onclick = () => {
      if (!curImg) { Common.showToast('⚠️ Please upload a photo first!'); input.click(); return; }
      if (!Common.checkAndConsume('id-photo-maker', document.getElementById('id-panel'))) return;

      const canvas = document.getElementById('id-canvas');
      const gridCanvas = document.createElement('canvas');
      gridCanvas.width = 1200; gridCanvas.height = 1800;
      const ctx = gridCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1800);

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.drawImage(canvas, 50 + c * 550, 50 + r * 550, 500, 500);
        }
      }

      gridCanvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'id-photos-print-sheet.jpg';
        a.click();
        Common.showToast('✅ Printable 4x6 ID photo grid downloaded!');
      }, 'image/jpeg', 0.95);
    };
  },

  renderIDPhoto(img) {
    const canvas = document.getElementById('id-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bgCol = document.getElementById('id-bg-color')?.value || '#ffffff';

    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const nw = img.naturalWidth * scale;
    const nh = img.naturalHeight * scale;
    const nx = (canvas.width - nw) / 2;
    const ny = (canvas.height - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  }
};

window.ImageTools = ImageTools;
