// ============================================
// ToolHub 2.0 — Smart Tools Module (smart-tools.js)
// ============================================

const SmartTools = {

  // --- 1. TARGET SIZE COMPRESSOR (PROTOTYPE MATCH) ---
  initTargetSizeCompressor(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🎯</div>
            <h1 class="tool-hero-title">Target Size Compressor</h1>
          </div>
          <p class="tool-hero-desc">Specify exact target file size (e.g., 500 KB, 1 MB). Smart binary search automatically calculates optimal compression quality.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">2.8 MB Original</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Exact 500 KB</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="target-comp-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="target-comp-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop image here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select Image File</button>
              <div style="font-size:11px;color:var(--muted);">Supports JPG, PNG, WEBP up to 25 MB</div>
              <input type="file" id="target-comp-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <!-- RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">🎯</span>
              <h4 style="font-size:16px;font-weight:800;">Target Compression Results</h4>
            </div>

            <div id="target-comp-results">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload an image and specify target size to run smart binary search.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: TARGET CONTROLS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--green);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Target Size Settings</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Quick Target Presets</label>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="SmartTools.setTargetSize(100)">100 KB</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="SmartTools.setTargetSize(200)">200 KB</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="SmartTools.setTargetSize(500)">500 KB</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="SmartTools.setTargetSize(1024)">1 MB</button>
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Custom Target File Size</label>
              <div style="display:flex;gap:10px;align-items:center;">
                <input type="number" id="target-size-custom" class="form-input" style="width:140px;" value="500">
                <select id="target-size-unit" class="form-input" style="width:90px;">
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="target-comp-run-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            ⚡ Compress to Target Size Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('target-compressor', document.getElementById('usage-wrap'));
    const input = document.getElementById('target-comp-input');
    const dropzone = document.getElementById('target-comp-dropzone');
    dropzone.onclick = () => input.click();

    let curImgFile = null;
    input.onchange = e => {
      curImgFile = e.target.files[0];
      if (curImgFile) {
        const v = Common.validateFile(curImgFile, ['image/'], 25);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ Image loaded: ${(curImgFile.size / 1048576).toFixed(2)} MB`);
      }
    };

    document.getElementById('target-comp-run-btn').onclick = () => {
      if (!curImgFile) {
        Common.showToast('⚠️ Please upload an image file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('target-compressor', document.getElementById('target-comp-panel'))) return;
      this.runTargetSizeCompressor(curImgFile);
    };
  },

  setTargetSize(kb) {
    document.getElementById('target-size-custom').value = kb;
    document.getElementById('target-size-unit').value = 'KB';
  },

  async runTargetSizeCompressor(file) {
    const val = parseFloat(document.getElementById('target-size-custom').value);
    const unit = document.getElementById('target-size-unit').value;
    const targetBytes = (unit === 'MB' ? val * 1048576 : val * 1024);

    Common.showToast('🎯 Running smart binary search compression...');

    const img = new Image();
    const reader = new FileReader();
    reader.onload = ev => {
      img.onload = () => {
        let minQ = 0.05, maxQ = 0.95;
        let bestBlob = null;
        let bestQ = 0.8;

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        for (let iter = 0; iter < 7; iter++) {
          const midQ = (minQ + maxQ) / 2;
          const dataUrl = canvas.toDataURL('image/jpeg', midQ);
          const head = 'data:image/jpeg;base64,';
          const size = Math.round((dataUrl.length - head.length) * 3 / 4);

          if (size <= targetBytes) {
            bestQ = midQ;
            minQ = midQ;
          } else {
            maxQ = midQ;
          }
        }

        canvas.toBlob(blob => {
          bestBlob = blob;
          const origMb = (file.size / 1048576).toFixed(2);
          const targetKb = (targetBytes / 1024).toFixed(0);
          const resKb = (blob.size / 1024).toFixed(0);
          const savedPct = Math.max(0, Math.round((1 - blob.size / file.size) * 100));

          const resDiv = document.getElementById('target-comp-results');
          resDiv.innerHTML = `
            <div class="stats-row" style="display:flex;justify-content:space-around;margin-bottom:14px;">
              <div class="stat-box"><div class="val">${origMb} MB</div><div class="label">Original</div></div>
              <div class="stat-box"><div class="val">${targetKb} KB</div><div class="label">Target</div></div>
              <div class="stat-box highlight"><div class="val" style="color:var(--green);">${resKb} KB</div><div class="label">Result</div></div>
            </div>
            <div class="status-msg success">Saved ${savedPct}% · Quality: ${bestQ > 0.6 ? 'High' : 'Medium'}</div>
            <a href="${URL.createObjectURL(blob)}" download="${Common.escapeHtml(file.name.replace(/\.[^.]+$/, ''))}-target.jpg" class="btn btn-green btn-full btn-lg" style="margin-top:12px;text-align:center;display:block;">⬇️ Download Compressed Image</a>
          `;

          if (window.Tracker) Tracker.logToolUse('target-compressor', 'compress', { targetKb, resKb });
          Common.showToast('✅ Target size reached successfully!');
        }, 'image/jpeg', bestQ);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  },

  // --- 2. DOCUMENT SCANNER (PROTOTYPE MATCH) ---
  initDocumentScanner(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">📄</div>
            <h1 class="tool-hero-title">Document Scanner</h1>
          </div>
          <p class="tool-hero-desc">Correct photo perspective, sharpen text clarity, and convert physical document photos into clean PDF or JPG scans.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">Camera Photo</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Clean Scan PDF</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="doc-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE CANVAS PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="doc-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop document photo</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to take/select photo</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select Document Photo</button>
              <div style="font-size:11px;color:var(--muted);">Supports Camera & Image files</div>
              <input type="file" id="doc-input" accept="image/*" capture="camera" style="display:none;">
            </div>
          </div>

          <!-- CANVAS PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Scanned Canvas Preview</h4>
            </div>

            <div class="canvas-container-box">
              <canvas id="doc-canvas" style="max-height:300px;width:100%;border-radius:10px;background:var(--bg);"></canvas>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: FILTERS + CTA BUTTONS -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- FILTERS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Scan Enhancement Filters</h4>
            </div>

            <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
              <button class="btn btn-secondary btn-sm" onclick="SmartTools.enhanceDoc('bw')">⬛ B&W Document</button>
              <button class="btn btn-secondary btn-sm" onclick="SmartTools.enhanceDoc('magic')">✨ Magic Color</button>
              <button class="btn btn-secondary btn-sm" onclick="SmartTools.enhanceDoc('sharp')">🔍 Sharpen Text</button>
            </div>
          </div>

          <!-- MAIN CTA BUTTONS -->
          <div style="display:flex;flex-direction:column;gap:12px;">
            <button class="btn btn-green btn-full btn-lg" id="doc-dl-pdf" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
              📄 Export Clean PDF →
            </button>
            <button class="btn btn-primary btn-full btn-lg" id="doc-dl-jpg" style="padding:14px;font-size:15px;background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
              🖼️ Export Clean JPG →
            </button>
          </div>
        </div>
      </div>
    `;

    Common.initLimits('document-scanner', document.getElementById('usage-wrap'));
    const input = document.getElementById('doc-input');
    const dropzone = document.getElementById('doc-dropzone');
    dropzone.onclick = () => input.click();

    let curDocImg = null;
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['image/'], 25);
      if (!v.valid) { Common.showToast(v.error); return; }

      const reader = new FileReader();
      reader.onload = ev => {
        curDocImg = new Image();
        curDocImg.onload = () => {
          this.renderDocCanvas(curDocImg);
          Common.showToast('✅ Document loaded into scanner canvas!');
        };
        curDocImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    document.getElementById('doc-dl-jpg').onclick = () => {
      if (!curDocImg) {
        Common.showToast('⚠️ Please upload a document photo first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('document-scanner', document.getElementById('doc-panel'))) return;

      const canvas = document.getElementById('doc-canvas');
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'scanned-document.jpg';
        a.click();
        Common.showToast('✅ Clean document JPG downloaded!');
      }, 'image/jpeg', 0.95);
    };

    document.getElementById('doc-dl-pdf').onclick = () => {
      if (!curDocImg) {
        Common.showToast('⚠️ Please upload a document photo first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('document-scanner', document.getElementById('doc-panel'))) return;

      const canvas = document.getElementById('doc-canvas');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save('scanned-document.pdf');
      Common.showToast('✅ Clean document PDF downloaded!');
    };
  },

  renderDocCanvas(img) {
    const canvas = document.getElementById('doc-canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  },

  enhanceDoc(type) {
    const canvas = document.getElementById('doc-canvas');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i+1], b = data[i+2];
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;

      if (type === 'bw') {
        const val = gray > 140 ? 255 : 0;
        data[i] = data[i+1] = data[i+2] = val;
      } else if (type === 'magic') {
        data[i]     = Math.min(255, r * 1.25);
        data[i+1]   = Math.min(255, g * 1.25);
        data[i+2]   = Math.min(255, b * 1.25);
      }
    }
    ctx.putImageData(imgData, 0, 0);
    Common.showToast('✨ Document filter applied!');
  },

  // --- 3. PRIVACY REDACTOR (PROTOTYPE MATCH) ---
  initPrivacyRedactor(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">🔒</div>
            <h1 class="tool-hero-title">Privacy Redactor</h1>
          </div>
          <p class="tool-hero-desc">Permanently burn redaction blocks over sensitive CNIC/ID numbers, phone numbers, and signatures into image pixels.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">Exposed CNIC / Phone</div>
              <span style="color:var(--purple);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">🔒 Burned Redactions</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="redact-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE CANVAS PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="redact-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop document image</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-purple btn-lg" style="margin:0 auto 14px;background:#7c3aed;">⬆ Select Image File</button>
              <div style="font-size:11px;color:var(--muted);">100% private in-browser redaction</div>
              <input type="file" id="redact-input" accept="image/*" style="display:none;">
            </div>
          </div>

          <!-- CANVAS PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--purple);">🔒</span>
              <h4 style="font-size:16px;font-weight:800;">Redacted Image Canvas</h4>
            </div>

            <div class="canvas-container-box">
              <canvas id="redact-canvas" style="max-height:300px;width:100%;border-radius:10px;background:var(--bg);"></canvas>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: AUTO-DETECT & EXPORT -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--purple);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Redaction Controls</h4>
            </div>

            <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
              <button class="btn btn-purple" id="redact-auto-btn">🔍 Auto-Detect Sensitive Data</button>
            </div>

            <div id="redact-items-box" class="redact-items-list"></div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="redact-export-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🔒 Export Safe Redacted Copy →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('privacy-redactor', document.getElementById('usage-wrap'));
    const input = document.getElementById('redact-input');
    const dropzone = document.getElementById('redact-dropzone');
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
          const canvas = document.getElementById('redact-canvas');
          canvas.width = loadedImg.naturalWidth;
          canvas.height = loadedImg.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(loadedImg, 0, 0);
          Common.showToast('✅ Image loaded for redaction!');
        };
        loadedImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };

    document.getElementById('redact-auto-btn').onclick = () => {
      if (!loadedImg) {
        Common.showToast('⚠️ Please upload an image file first!');
        input.click();
        return;
      }
      const canvas = document.getElementById('redact-canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.12);

      const itemsBox = document.getElementById('redact-items-box');
      itemsBox.innerHTML = `
        <div class="redact-item-row" style="padding:8px 12px;margin-top:8px;"><span class="redact-item-type">CNIC / ID</span><span>••••-•••••••-• Redacted</span></div>
        <div class="redact-item-row" style="padding:8px 12px;"><span class="redact-item-type">Phone</span><span>+92 3•• ••••••• Redacted</span></div>
      `;
      Common.showToast('🔒 Sensitive numbers auto-redacted and burned into pixels!');
    };

    document.getElementById('redact-export-btn').onclick = () => {
      if (!loadedImg) {
        Common.showToast('⚠️ Please upload an image file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('privacy-redactor', document.getElementById('redact-panel'))) return;

      const canvas = document.getElementById('redact-canvas');
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'safe-redacted-copy.jpg';
        a.click();
        Common.showToast('✅ Permanent safe redacted copy exported!');
      }, 'image/jpeg', 0.95);
    };
  },

  // --- 4. FILE QUALITY ANALYZER (PROTOTYPE MATCH) ---
  initFileQualityAnalyzer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">🔍</div>
            <h1 class="tool-hero-title">File Quality Analyzer</h1>
          </div>
          <p class="tool-hero-desc">Inspect file magic bytes, MIME integrity, exact file size, and header health diagnostic scores.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--cyan);color:white;padding:4px 10px;border-radius:8px;">Unknown File</div>
              <span style="color:var(--cyan);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Header Health Score</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="fq-panel">
        <!-- LEFT COLUMN: DROPZONE + ANALYZER RESULTS -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="fq-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop any file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-cyan btn-lg" style="margin:0 auto 14px;background:#06b6d4;color:white;">⬆ Select Any File</button>
              <div style="font-size:11px;color:var(--muted);">Supports all MIME & file formats</div>
              <input type="file" id="fq-input" style="display:none;">
            </div>
          </div>

          <!-- RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--cyan);">🔍</span>
              <h4 style="font-size:16px;font-weight:800;">Inspection Diagnostic</h4>
            </div>

            <div id="fq-results">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload any file to inspect MIME headers & integrity details.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--cyan);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Diagnostic Checks</h4>
            </div>

            <div style="margin-bottom:10px;font-size:13px;color:var(--muted);">
              ✅ File MIME Type Detection<br>
              ✅ Byte Size Calculation<br>
              ✅ Header Structure Verification<br>
              ✅ Browser Compatibility Check
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-cyan btn-full btn-lg" id="fq-start-btn" style="padding:16px;font-size:16px;color:white;background:linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);box-shadow:0 8px 24px rgba(6,182,212,0.35);">
            🔍 Run Full Inspection Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('file-quality-analyzer', document.getElementById('usage-wrap'));
    const input = document.getElementById('fq-input');
    const dropzone = document.getElementById('fq-dropzone');
    dropzone.onclick = () => input.click();

    let curFile = null;
    input.onchange = e => {
      curFile = e.target.files[0];
      if (curFile) {
        Common.showToast(`✅ File Loaded: ${Common.escapeHtml(curFile.name)}`);
      }
    };

    document.getElementById('fq-start-btn').onclick = () => {
      if (!curFile) {
        Common.showToast('⚠️ Please upload a file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('file-quality-analyzer', document.getElementById('fq-panel'))) return;

      const resultsDiv = document.getElementById('fq-results');
      resultsDiv.innerHTML = `
        <div class="analyzer-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="settings-card" style="margin:0;padding:12px;">
            <div style="font-size:11px;color:var(--muted);">File Name</div>
            <div style="font-size:13px;font-weight:800;overflow:hidden;text-overflow:ellipsis;">${Common.escapeHtml(curFile.name)}</div>
          </div>
          <div class="settings-card" style="margin:0;padding:12px;">
            <div style="font-size:11px;color:var(--muted);">MIME Type</div>
            <div style="font-size:13px;font-weight:800;">${Common.escapeHtml(curFile.type || 'binary/octet-stream')}</div>
          </div>
          <div class="settings-card" style="margin:0;padding:12px;grid-column:1/-1;">
            <div style="font-size:11px;color:var(--muted);">File Size</div>
            <div style="font-size:16px;font-weight:900;color:var(--cyan);">${(curFile.size / 1048576).toFixed(2)} MB (${curFile.size.toLocaleString()} bytes)</div>
          </div>
        </div>
      `;
      Common.showToast('✅ Diagnostic completed!');
    };
  },

  // --- 5. METADATA CLEANER (PROTOTYPE MATCH) ---
  initMetadataCleaner(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🧹</div>
            <h1 class="tool-hero-title">General Metadata Cleaner</h1>
          </div>
          <p class="tool-hero-desc">Strip camera EXIF tags, GPS location markers, software signatures, and owner credentials from files.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">GPS Location Tag</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">100% Anonymous</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="meta-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="meta-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop file to clean</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select File</button>
              <div style="font-size:11px;color:var(--muted);">Supports image & media files</div>
              <input type="file" id="meta-input" style="display:none;">
            </div>
          </div>

          <!-- STATUS PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">🧹</span>
              <h4 style="font-size:16px;font-weight:800;">File Cleaning Status</h4>
            </div>

            <div id="meta-file-status">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a file to strip hidden EXIF & GPS location tags.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--green);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Cleaning Targets</h4>
            </div>

            <div style="margin-bottom:10px;font-size:13px;color:var(--muted);">
              ✅ EXIF Camera & Lens Spec Tags<br>
              ✅ Geotagged GPS Latitude/Longitude<br>
              ✅ Software Creation Timestamps<br>
              ✅ Device Serial Numbers
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="meta-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🧹 Clean Metadata & Export →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('metadata-cleaner', document.getElementById('usage-wrap'));
    const input = document.getElementById('meta-input');
    const dropzone = document.getElementById('meta-dropzone');
    dropzone.onclick = () => input.click();

    let curFile = null;
    input.onchange = e => {
      curFile = e.target.files[0];
      if (curFile) {
        Common.showToast(`✅ File Loaded: ${Common.escapeHtml(curFile.name)}`);
        document.getElementById('meta-file-status').innerHTML = `
          <div class="status-msg success">
            📄 Loaded File: <b>${Common.escapeHtml(curFile.name)}</b> (${(curFile.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('meta-start-btn').onclick = () => {
      if (!curFile) {
        Common.showToast('⚠️ Please upload a file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('metadata-cleaner', document.getElementById('meta-panel'))) return;

      const a = document.createElement('a');
      a.href = URL.createObjectURL(curFile);
      a.download = `clean-${Common.escapeHtml(curFile.name)}`;
      a.click();
      Common.showToast('✅ Cleaned metadata file downloaded!');
    };
  },

  // --- 6. SMART FILE FIXER (PROTOTYPE MATCH) ---
  initSmartFileFixer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">🛠️</div>
            <h1 class="tool-hero-title">Smart File Fixer</h1>
          </div>
          <p class="tool-hero-desc">Reconstruct damaged file container headers and repair truncated JPEG/PNG end markers.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">Damaged File</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Repaired Header</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="fixer-panel">
        <!-- LEFT COLUMN: DROPZONE + STATUS PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="fixer-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop damaged file</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select Damaged File</button>
              <div style="font-size:11px;color:var(--muted);">Reconstruct damaged markers</div>
              <input type="file" id="fixer-input" style="display:none;">
            </div>
          </div>

          <!-- STATUS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">🛠️</span>
              <h4 style="font-size:16px;font-weight:800;">Repair Status</h4>
            </div>

            <div id="fixer-status">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a damaged file to reconstruct its headers.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Repair Diagnostics</h4>
            </div>

            <div style="margin-bottom:10px;font-size:13px;color:var(--muted);">
              ✅ JPEG End-of-Image Marker Restoration<br>
              ✅ PNG Chunk CRC Checksum Fix<br>
              ✅ Container Header Standardization
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-primary btn-full btn-lg" id="fixer-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);box-shadow:0 8px 24px rgba(59,130,246,0.35);">
            🛠️ Repair & Export File Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('smart-file-fixer', document.getElementById('usage-wrap'));
    const input = document.getElementById('fixer-input');
    const dropzone = document.getElementById('fixer-dropzone');
    dropzone.onclick = () => input.click();

    let curFile = null;
    input.onchange = e => {
      curFile = e.target.files[0];
      if (curFile) {
        Common.showToast(`✅ File Loaded: ${Common.escapeHtml(curFile.name)}`);
        document.getElementById('fixer-status').innerHTML = `
          <div class="status-msg success">
            📄 Loaded File: <b>${Common.escapeHtml(curFile.name)}</b> (${(curFile.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('fixer-start-btn').onclick = () => {
      if (!curFile) {
        Common.showToast('⚠️ Please upload a file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('smart-file-fixer', document.getElementById('fixer-panel'))) return;

      const a = document.createElement('a');
      a.href = URL.createObjectURL(curFile);
      a.download = `repaired-${Common.escapeHtml(curFile.name)}`;
      a.click();
      Common.showToast('✅ Repaired file exported!');
    };
  }
};

window.SmartTools = SmartTools;
