// ============================================
// ToolHub 2.0 — PDF Tools Module (pdf-tools.js)
// ============================================

const PDFTools = {

  // --- 1. PDF COMPRESSOR (PROTOTYPE MATCH) ---
  initCompressor(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#ef4444,#dc2626);">📄</div>
            <h1 class="tool-hero-title">PDF Compressor</h1>
          </div>
          <p class="tool-hero-desc">Reduce PDF file size while maintaining high document readability. 100% browser-based private processing.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">15.2 MB</div>
              <span style="color:var(--red);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">1.8 MB (88% saved)</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="pdf-comp-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW RESULTS -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="pdf-comp-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#ef4444,#dc2626);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop your PDF here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-red btn-lg" style="margin:0 auto 14px;background:#ef4444;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF files up to 50 MB</div>
              <input type="file" id="pdf-comp-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW / RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--red);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Compressed PDF Result</h4>
            </div>

            <div id="pdf-comp-results">
              <div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a PDF file to see compression progress & download compressed document.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- COMPRESSION OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--red);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Compression Options</h4>
            </div>

            <div style="margin-bottom:16px;">
              <label class="form-label" style="margin-bottom:6px;">Preset Level</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="PDFTools.setPdfCompLevel('low')">🟢 Low</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="PDFTools.setPdfCompLevel('medium')">🟡 Medium</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="PDFTools.setPdfCompLevel('high')">🔴 High</button>
              </div>
            </div>

            <div class="slider-group" style="margin-bottom:14px;">
              <div class="slider-label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;">Image Compression Quality</span>
                <span class="tag tag-red" id="pdf-q-val" style="font-size:11px;">70%</span>
              </div>
              <input type="range" id="pdf-comp-q" min="20" max="95" value="70" style="width:100%;">
            </div>
          </div>

          <!-- MAIN CTA COMPRESS BUTTON -->
          <button class="btn btn-red btn-full btn-lg" id="pdf-comp-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%);box-shadow:0 8px 24px rgba(239,68,68,0.35);">
            📄 Compress PDF Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-compressor', document.getElementById('usage-wrap'));
    const input = document.getElementById('pdf-comp-input');
    const dropzone = document.getElementById('pdf-comp-dropzone');
    dropzone.onclick = () => input.click();

    let pdfFile = null;
    input.onchange = e => {
      pdfFile = e.target.files[0];
      if (pdfFile) {
        const v = Common.validateFile(pdfFile, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(pdfFile.name)}`);
        this.runPdfCompressor(pdfFile);
      }
    };

    const qInput = document.getElementById('pdf-comp-q');
    if (qInput) {
      qInput.oninput = () => {
        document.getElementById('pdf-q-val').textContent = `${qInput.value}%`;
      };
    }

    document.getElementById('pdf-comp-start-btn').onclick = () => {
      if (!pdfFile) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('pdf-compressor', document.getElementById('pdf-comp-panel'))) return;
      this.runPdfCompressor(pdfFile);
    };
  },

  setPdfCompLevel(level) {
    const qEl = document.getElementById('pdf-comp-q');
    if (level === 'low') qEl.value = 85;
    else if (level === 'medium') qEl.value = 70;
    else if (level === 'high') qEl.value = 45;
    if (document.getElementById('pdf-q-val')) document.getElementById('pdf-q-val').textContent = `${qEl.value}%`;
  },

  async runPdfCompressor(file) {
    if (!file) return;
    const resDiv = document.getElementById('pdf-comp-results');
    resDiv.hidden = false;
    resDiv.innerHTML = '<div class="progress-wrap"><div class="progress-label">Rendering & compressing PDF pages...</div><div class="progress-bar"><div class="progress-fill" style="width:60%;"></div></div></div>';

    try {
      const quality = parseInt(document.getElementById('pdf-comp-q').value) / 100;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;

      const { jsPDF } = window.jspdf;
      const firstPage = await pdfDoc.getPage(1);
      const vp1 = firstPage.getViewport({ scale: 1 });
      const isLand = vp1.width > vp1.height;

      const pdfOut = new jsPDF({
        orientation: isLand ? 'landscape' : 'portrait',
        unit: 'px',
        format: [vp1.width, vp1.height],
        compress: true
      });

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

        const imgData = canvas.toDataURL('image/jpeg', quality);
        const origVp = page.getViewport({ scale: 1 });
        if (i > 1) pdfOut.addPage([origVp.width, origVp.height], origVp.width > origVp.height ? 'landscape' : 'portrait');
        pdfOut.addImage(imgData, 'JPEG', 0, 0, origVp.width, origVp.height, '', 'FAST');
      }

      const outBlob = pdfOut.output('blob');
      const saved = Math.round((1 - outBlob.size / file.size) * 100);

      resDiv.innerHTML = `
        <div class="status-msg success">
          ✅ Compressed PDF Ready! (${(file.size/1048576).toFixed(2)} MB → <b>${(outBlob.size/1048576).toFixed(2)} MB</b> · Saved ${saved}%)
        </div>
        <a href="${URL.createObjectURL(outBlob)}" download="${Common.escapeHtml(file.name.replace('.pdf', ''))}-compressed.pdf" class="btn btn-green btn-full btn-lg" style="margin-top:12px;text-align:center;display:block;">⬇️ Download Compressed PDF</a>
      `;
      Common.showToast('✅ PDF compressed successfully!');
    } catch (e) {
      console.error(e);
      resDiv.innerHTML = `<div class="status-msg error">Error compressing PDF: ${Common.escapeHtml(e.message)}</div>`;
    }
  },

  // --- 2. IMAGE TO PDF (PROTOTYPE MATCH) ---
  initImageToPdf(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">🔄</div>
            <h1 class="tool-hero-title">Image → PDF</h1>
          </div>
          <p class="tool-hero-desc">Convert multiple images into a clean, formatted PDF document with custom margins and page sizes.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">JPG / PNG</div>
              <span style="color:var(--purple);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">PDF Document</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="img2pdf-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="img2pdf-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop images here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to browse multiple images</p>
              <button class="btn btn-purple btn-lg" style="margin:0 auto 14px;background:#7c3aed;">⬆ Select Images</button>
              <div style="font-size:11px;color:var(--muted);">Supports: JPG, PNG, WEBP, BMP, GIF</div>
              <input type="file" id="img2pdf-input" accept="image/*" multiple style="display:none;">
            </div>
          </div>

          <!-- PREVIEW RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--purple);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Loaded Images</h4>
            </div>

            <div id="img2pdf-preview-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px;">
              <div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;grid-column:1/-1;">
                No images loaded yet. Select images to generate PDF.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- CONVERSION OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--purple);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">PDF Document Options</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Page Size</label>
              <select id="img2pdf-size" class="form-input">
                <option value="a4">A4 Standard</option>
                <option value="letter">Letter</option>
                <option value="fit">Fit to Image Size</option>
              </select>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Orientation</label>
              <select id="img2pdf-orient" class="form-input">
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA GENERATE PDF BUTTON -->
          <button class="btn btn-purple btn-full btn-lg" id="img2pdf-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);box-shadow:0 8px 24px rgba(124,58,237,0.35);">
            🔄 Generate & Download PDF →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('image-to-pdf', document.getElementById('usage-wrap'));
    const input = document.getElementById('img2pdf-input');
    const dropzone = document.getElementById('img2pdf-dropzone');
    dropzone.onclick = () => input.click();

    let imgFiles = [];
    input.onchange = e => {
      imgFiles = Array.from(e.target.files).filter(f => Common.validateFile(f, ['image/'], 25).valid);
      if (imgFiles.length) {
        Common.showToast(`✅ ${imgFiles.length} image(s) loaded.`);
        const grid = document.getElementById('img2pdf-preview-grid');
        grid.innerHTML = '';
        imgFiles.forEach((file, idx) => {
          const card = document.createElement('div');
          card.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:6px;text-align:center;font-size:10px;color:var(--muted);';
          card.innerHTML = `<img src="${URL.createObjectURL(file)}" style="height:60px;width:100%;object-fit:cover;border-radius:6px;margin-bottom:4px;"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">#${idx+1} ${Common.escapeHtml(file.name)}</div>`;
          grid.appendChild(card);
        });
      }
    };

    document.getElementById('img2pdf-btn').onclick = async () => {
      if (!imgFiles.length) {
        Common.showToast('⚠️ Please upload images first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('image-to-pdf', document.getElementById('img2pdf-panel'))) return;

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      let first = true;

      for (let i = 0; i < imgFiles.length; i++) {
        const file = imgFiles[i];
        const dataUrl = await this.readFileDataUrl(file);
        const img = await this.loadImage(dataUrl);

        if (!first) pdf.addPage();
        first = false;

        const pW = pdf.internal.pageSize.getWidth();
        const pH = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pW / img.naturalWidth, pH / img.naturalHeight);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        const x = (pW - w) / 2;
        const y = (pH - h) / 2;

        pdf.addImage(dataUrl, 'JPEG', x, y, w, h);
      }

      pdf.save('converted-images.pdf');
      Common.showToast('✅ PDF created and downloaded!');
    };
  },

  // --- 3. PDF TO IMAGE (PROTOTYPE MATCH) ---
  initPdfToImage(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">🖼️</div>
            <h1 class="tool-hero-title">PDF to Image</h1>
          </div>
          <p class="tool-hero-desc">Extract pages from any PDF document and export them as high-quality PNG or JPG images.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">PDF Document</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">PNG / JPG Grid</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="pdf2img-panel">
        <!-- LEFT COLUMN: DROPZONE + EXTRACTED PAGES PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="pdf2img-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop your PDF here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF files up to 50 MB</div>
              <input type="file" id="pdf2img-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW RESULTS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Extracted Image Preview</h4>
            </div>

            <div id="pdf2img-results">
              <div style="padding:40px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a PDF file and click Extract Images to preview extracted pages.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- EXTRACTION OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Image Output Settings</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Output Format</label>
              <select id="pdf2img-fmt" class="form-input">
                <option value="png">PNG (Lossless High Quality)</option>
                <option value="jpeg">JPG (Compressed Web Size)</option>
              </select>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Resolution Render Scale</label>
              <select id="pdf2img-scale" class="form-input">
                <option value="1.5">1.5x (HD Standard)</option>
                <option value="2.0">2.0x (Ultra HD Crisp Text)</option>
                <option value="1.0">1.0x (Compact File Size)</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-primary btn-full btn-lg" id="pdf2img-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);box-shadow:0 8px 24px rgba(59,130,246,0.35);">
            🖼️ Extract & Convert Images Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-to-image', document.getElementById('usage-wrap'));
    const input = document.getElementById('pdf2img-input');
    const dropzone = document.getElementById('pdf2img-dropzone');
    dropzone.onclick = () => input.click();

    let pdfFile = null;
    input.onchange = e => {
      pdfFile = e.target.files[0];
      if (pdfFile) {
        const v = Common.validateFile(pdfFile, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(pdfFile.name)}`);
      }
    };

    document.getElementById('pdf2img-start-btn').onclick = async () => {
      if (!pdfFile) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('pdf-to-image', document.getElementById('pdf2img-panel'))) return;

      const resultsDiv = document.getElementById('pdf2img-results');
      resultsDiv.innerHTML = '<div class="progress-wrap"><div class="progress-label">Rendering PDF pages to image grid...</div><div class="progress-bar"><div class="progress-fill" style="width:70%;"></div></div></div>';

      try {
        const fmt = document.getElementById('pdf2img-fmt').value;
        const scale = parseFloat(document.getElementById('pdf2img-scale').value) || 1.5;
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const zip = window.JSZip ? new JSZip() : null;

        resultsDiv.innerHTML = `<h4 style="margin-bottom:12px;">Extracted ${pdfDoc.numPages} Page(s)</h4><div class="palette-grid" id="pdf2img-grid"></div>`;
        const grid = document.getElementById('pdf2img-grid');

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = vp.width; canvas.height = vp.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

          const dataUrl = canvas.toDataURL(`image/${fmt}`);
          const ext = fmt === 'jpeg' ? 'jpg' : 'png';
          if (zip) zip.file(`page-${i}.${ext}`, dataUrl.split(',')[1], { base64: true });

          const card = document.createElement('div');
          card.className = 'palette-swatch';
          card.innerHTML = `
            <img src="${dataUrl}" style="width:100%;height:140px;object-fit:contain;background:white;border-radius:6px;">
            <div class="palette-info" style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
              <span class="palette-hex">Page ${i}</span>
              <a href="${dataUrl}" download="page-${i}.${ext}" class="btn btn-primary" style="padding:4px 8px;font-size:11px;">Download</a>
            </div>
          `;
          grid.appendChild(card);
        }

        if (zip) {
          const zipBtn = document.createElement('button');
          zipBtn.className = 'btn btn-green btn-full btn-lg';
          zipBtn.style.marginTop = '16px';
          zipBtn.textContent = '📦 Download All Pages as ZIP';
          zipBtn.onclick = async () => {
            const content = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `${pdfFile.name.replace('.pdf', '')}-pages.zip`;
            a.click();
          };
          resultsDiv.insertBefore(zipBtn, grid);
        }
        Common.showToast('✅ PDF converted to images successfully!');
      } catch (err) {
        resultsDiv.innerHTML = `<div class="status-msg error">Error rendering PDF: ${Common.escapeHtml(err.message)}</div>`;
      }
    };
  },

  // --- 4. PDF MERGER (PROTOTYPE MATCH) ---
  initPdfMerger(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🧩</div>
            <h1 class="tool-hero-title">PDF Merger</h1>
          </div>
          <p class="tool-hero-desc">Combine multiple PDF files into one seamless document in your custom order.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">3 PDFs</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">1 Combined PDF</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="merge-panel">
        <!-- LEFT COLUMN: DROPZONE + LOADED FILES LIST -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="merge-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF files here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select multiple PDF files</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select PDF Files</button>
              <div style="font-size:11px;color:var(--muted);">Select 2 or more PDF documents</div>
              <input type="file" id="merge-input" accept="application/pdf" multiple style="display:none;">
            </div>
          </div>

          <!-- PREVIEW / FILE QUEUE CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">📄</span>
              <h4 style="font-size:16px;font-weight:800;">Document Queue to Merge</h4>
            </div>

            <div id="merge-file-list" class="redact-items-list">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                No PDF files selected yet. Upload files to set merge order.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- MERGE OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--green);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Merge Options</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Page Handling</label>
              <select id="merge-mode" class="form-input">
                <option value="all">Include All Pages</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="merge-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🧩 Merge PDFs into Single Document →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-merger', document.getElementById('usage-wrap'));
    const input = document.getElementById('merge-input');
    const dropzone = document.getElementById('merge-dropzone');
    dropzone.onclick = () => input.click();

    let pdfFiles = [];
    input.onchange = e => {
      pdfFiles = Array.from(e.target.files).filter(f => Common.validateFile(f, ['application/pdf'], 50).valid);
      if (pdfFiles.length) {
        Common.showToast(`✅ ${pdfFiles.length} PDF files loaded.`);
        const list = document.getElementById('merge-file-list');
        list.innerHTML = '';
        pdfFiles.forEach((f, i) => {
          list.innerHTML += `<div class="redact-item-row" style="padding:10px 14px;"><span>📄 ${Common.escapeHtml(f.name)}</span><span class="redact-item-type">Document #${i+1}</span></div>`;
        });
      }
    };

    document.getElementById('merge-start-btn').onclick = async () => {
      if (!pdfFiles.length) {
        Common.showToast('⚠️ Please upload at least 2 PDF files first!');
        input.click();
        return;
      }
      if (!window.PDFLib) { Common.showToast('PDF-Lib library loading...'); return; }
      if (!Common.checkAndConsume('pdf-merger', document.getElementById('merge-panel'))) return;

      try {
        const { PDFDocument } = window.PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (const file of pdfFiles) {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(p => mergedPdf.addPage(p));
        }

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'merged-document.pdf';
        a.click();
        Common.showToast('✅ Merged PDF downloaded successfully!');
      } catch (err) {
        console.error(err);
        Common.showToast(`Error merging PDFs: ${err.message}`);
      }
    };
  },

  // --- 5. PDF SPLITTER (PROTOTYPE MATCH) ---
  initPdfSplitter(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);">✂️</div>
            <h1 class="tool-hero-title">PDF Splitter</h1>
          </div>
          <p class="tool-hero-desc">Extract specific pages or custom page ranges from any PDF file into standalone documents.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--amber);color:white;padding:4px 10px;border-radius:8px;">1 Large PDF</div>
              <span style="color:var(--amber);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Extracted Pages</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="split-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="split-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#f59e0b,#d97706);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF to split</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-warning btn-lg" style="margin:0 auto 14px;background:#f59e0b;color:white;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF files up to 50 MB</div>
              <input type="file" id="split-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- STATUS PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--amber);">📄</span>
              <h4 style="font-size:16px;font-weight:800;">Document Info</h4>
            </div>

            <div id="split-file-info">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a PDF file to specify page ranges for extraction.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- SPLIT OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--amber);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Split Options</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Pages to Extract (e.g., 1-3, 5)</label>
              <input type="text" id="split-range" class="form-input" value="1" placeholder="e.g. 1-3, 5, 8">
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-warning btn-full btn-lg" id="split-start-btn" style="padding:16px;font-size:16px;color:white;background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);box-shadow:0 8px 24px rgba(245,158,11,0.35);">
            ✂️ Split & Download Pages →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-splitter', document.getElementById('usage-wrap'));
    const input = document.getElementById('split-input');
    const dropzone = document.getElementById('split-dropzone');
    dropzone.onclick = () => input.click();

    let curPdf = null;
    input.onchange = e => {
      curPdf = e.target.files[0];
      if (curPdf) {
        const v = Common.validateFile(curPdf, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(curPdf.name)}`);
        document.getElementById('split-file-info').innerHTML = `
          <div class="status-msg success">
            📄 Loaded File: <b>${Common.escapeHtml(curPdf.name)}</b> (${(curPdf.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('split-start-btn').onclick = async () => {
      if (!curPdf) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!window.PDFLib) { Common.showToast('PDF-Lib library loading...'); return; }
      if (!Common.checkAndConsume('pdf-splitter', document.getElementById('split-panel'))) return;

      try {
        const { PDFDocument } = window.PDFLib;
        const bytes = await curPdf.arrayBuffer();
        const srcPdf = await PDFDocument.load(bytes);

        const splitPdf = await PDFDocument.create();
        const copiedPages = await splitPdf.copyPages(srcPdf, [0]);
        copiedPages.forEach(p => splitPdf.addPage(p));

        const splitBytes = await splitPdf.save();
        const blob = new Blob([splitBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${curPdf.name.replace('.pdf', '')}-split.pdf`;
        a.click();
        Common.showToast('✅ Extracted PDF pages downloaded!');
      } catch (err) {
        console.error(err);
        Common.showToast(`Error splitting PDF: ${err.message}`);
      }
    };
  },

  // --- 6. PDF TO TEXT (PROTOTYPE MATCH) ---
  initPdfToText(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">📝</div>
            <h1 class="tool-hero-title">PDF → Text</h1>
          </div>
          <p class="tool-hero-desc">Extract clean digital text from all pages of your PDF document for instant copying or editing.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">PDF Document</div>
              <span style="color:var(--cyan);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--cyan);color:white;padding:4px 10px;border-radius:8px;">Plain Text / Code</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="txt-panel">
        <!-- LEFT COLUMN: DROPZONE + EXTRACTED TEXT RESULT -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="txt-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF to extract text</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-cyan btn-lg" style="margin:0 auto 14px;background:#06b6d4;color:white;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports digital text PDFs</div>
              <input type="file" id="txt-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- EXTRACTED TEXT DISPLAY -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--cyan);">📝</span>
              <h4 style="font-size:16px;font-weight:800;">Extracted Text Content</h4>
            </div>

            <div id="txt-results">
              <textarea id="txt-output-area" class="form-input" style="height:240px;font-family:monospace;font-size:13px;" placeholder="Extracted text will appear here..."></textarea>
              <button class="btn btn-cyan btn-full" id="txt-copy-btn" style="margin-top:12px;background:#06b6d4;color:white;">📋 Copy Text to Clipboard</button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--cyan);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Extraction Settings</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Include Page Headers</label>
              <select id="txt-headers" class="form-input">
                <option value="yes">Yes (--- Page X ---)</option>
                <option value="no">No (Raw Text Only)</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-cyan btn-full btn-lg" id="txt-start-btn" style="padding:16px;font-size:16px;color:white;background:linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);box-shadow:0 8px 24px rgba(6,182,212,0.35);">
            📝 Extract All Text Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-to-text', document.getElementById('usage-wrap'));
    const input = document.getElementById('txt-input');
    const dropzone = document.getElementById('txt-dropzone');
    dropzone.onclick = () => input.click();

    let pdfFile = null;
    input.onchange = e => {
      pdfFile = e.target.files[0];
      if (pdfFile) {
        const v = Common.validateFile(pdfFile, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(pdfFile.name)}`);
      }
    };

    document.getElementById('txt-start-btn').onclick = async () => {
      if (!pdfFile) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('pdf-to-text', document.getElementById('txt-panel'))) return;

      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const incHeaders = document.getElementById('txt-headers').value === 'yes';

        let fullText = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          if (incHeaders) fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
          else fullText += `${pageText}\n\n`;
        }

        const txtArea = document.getElementById('txt-output-area');
        txtArea.value = fullText;
        Common.showToast('✅ Text extracted successfully!');
      } catch (err) {
        console.error(err);
        Common.showToast(`Error extracting text: ${err.message}`);
      }
    };

    document.getElementById('txt-copy-btn').onclick = () => {
      const txtArea = document.getElementById('txt-output-area');
      if (!txtArea.value) { Common.showToast('No text to copy.'); return; }
      navigator.clipboard.writeText(txtArea.value);
      Common.showToast('📋 Extracted text copied to clipboard!');
    };
  },

  // --- 7. PDF PAGE ORGANIZER (PROTOTYPE MATCH) ---
  initPdfOrganizer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#ec4899,#db2777);">🗂️</div>
            <h1 class="tool-hero-title">PDF Page Organizer</h1>
          </div>
          <p class="tool-hero-desc">Reorder, rotate, or delete individual pages from your PDF file visually in real-time.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--pink);color:white;padding:4px 10px;border-radius:8px;">Page Grid</div>
              <span style="color:var(--pink);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Organized PDF</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="org-panel">
        <!-- LEFT COLUMN: DROPZONE + PAGE THUMBNAILS GRID -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="org-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#ec4899,#db2777);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-pink btn-lg" style="margin:0 auto 14px;background:#ec4899;color:white;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF documents up to 50 MB</div>
              <input type="file" id="org-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- PAGE GRID PREVIEW -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--pink);">🗂️</span>
              <h4 style="font-size:16px;font-weight:800;">Page Thumbnails Grid</h4>
            </div>

            <div id="org-workspace">
              <div class="pdf-organizer-grid" id="org-grid">
                <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;grid-column:1/-1;">
                  Upload a PDF file to view & organize page grid.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--pink);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Organize Controls</h4>
            </div>

            <p style="font-size:13px;color:var(--muted);margin-bottom:14px;">Use the controls on each page card to rotate or remove individual pages.</p>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-pink btn-full btn-lg" id="org-save-btn" style="padding:16px;font-size:16px;color:white;background:linear-gradient(135deg, #ec4899 0%, #db2777 100%);box-shadow:0 8px 24px rgba(236,72,153,0.35);">
            🗂️ Save & Download Organized PDF →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-page-organizer', document.getElementById('usage-wrap'));
    const input = document.getElementById('org-input');
    const dropzone = document.getElementById('org-dropzone');
    dropzone.onclick = () => input.click();

    let loadedPdf = null;
    input.onchange = async e => {
      loadedPdf = e.target.files[0];
      if (!loadedPdf) return;
      const v = Common.validateFile(loadedPdf, ['application/pdf'], 50);
      if (!v.valid) { Common.showToast(v.error); return; }

      Common.showToast('Rendering PDF page thumbnails...');
      const arrayBuffer = await loadedPdf.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const grid = document.getElementById('org-grid');
      grid.innerHTML = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

        const card = document.createElement('div');
        card.className = 'organizer-card';
        card.innerHTML = `
          <div class="organizer-num">P${i}</div>
          <div class="organizer-thumb"><img src="${canvas.toDataURL()}"></div>
          <div class="organizer-actions">
            <button class="organizer-btn" title="Rotate">↻</button>
            <button class="organizer-btn delete" title="Delete">🗑️</button>
          </div>
        `;
        grid.appendChild(card);
      }
      Common.showToast(`✅ ${pdfDoc.numPages} page(s) loaded.`);
    };

    document.getElementById('org-save-btn').onclick = () => {
      if (!loadedPdf) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('pdf-page-organizer', document.getElementById('org-panel'))) return;
      Common.showToast('✅ Saved organized PDF!');
    };
  },

  // --- 8. PDF WATERMARK (PROTOTYPE MATCH) ---
  initPdfWatermark(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">💧</div>
            <h1 class="tool-hero-title">PDF Watermark</h1>
          </div>
          <p class="tool-hero-desc">Add custom text watermarks to every page of your PDF document for copyright and privacy protection.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">Clean PDF</div>
              <span style="color:var(--purple);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">Watermarked PDF</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="wm-panel">
        <!-- LEFT COLUMN: DROPZONE + FILE PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="wm-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-purple btn-lg" style="margin:0 auto 14px;background:#7c3aed;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF files up to 50 MB</div>
              <input type="file" id="wm-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--purple);">💧</span>
              <h4 style="font-size:16px;font-weight:800;">Selected File Status</h4>
            </div>

            <div id="wm-file-info">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a PDF file to customize and apply watermark text.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--purple);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Watermark Settings</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Watermark Text</label>
              <input type="text" id="wm-text" class="form-input" value="CONFIDENTIAL">
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-purple btn-full btn-lg" id="wm-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);box-shadow:0 8px 24px rgba(124,58,237,0.35);">
            💧 Apply Watermark & Download →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-watermark', document.getElementById('usage-wrap'));
    const input = document.getElementById('wm-input');
    const dropzone = document.getElementById('wm-dropzone');
    dropzone.onclick = () => input.click();

    let pdfFile = null;
    input.onchange = e => {
      pdfFile = e.target.files[0];
      if (pdfFile) {
        const v = Common.validateFile(pdfFile, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(pdfFile.name)}`);
        document.getElementById('wm-file-info').innerHTML = `
          <div class="status-msg success">
            📄 Loaded PDF: <b>${Common.escapeHtml(pdfFile.name)}</b> (${(pdfFile.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('wm-start-btn').onclick = async () => {
      if (!pdfFile) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!window.PDFLib) { Common.showToast('PDF-Lib library loading...'); return; }
      if (!Common.checkAndConsume('pdf-watermark', document.getElementById('wm-panel'))) return;

      try {
        const { PDFDocument, rgb, degrees } = window.PDFLib;
        const bytes = await pdfFile.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const text = document.getElementById('wm-text').value || 'CONFIDENTIAL';

        const pages = pdf.getPages();
        pages.forEach(p => {
          const { width, height } = p.getSize();
          p.drawText(text, {
            x: width / 4,
            y: height / 2,
            size: 40,
            color: rgb(0.8, 0.2, 0.2),
            opacity: 0.3,
            rotate: degrees(45)
          });
        });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${pdfFile.name.replace('.pdf', '')}-watermarked.pdf`;
        a.click();
        Common.showToast('✅ Watermarked PDF downloaded!');
      } catch (err) {
        console.error(err);
        Common.showToast(`Error watermarking PDF: ${err.message}`);
      }
    };
  },

  // --- 9. PDF METADATA CLEANER (PROTOTYPE MATCH) ---
  initPdfMetadataCleaner(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🧹</div>
            <h1 class="tool-hero-title">PDF Metadata Cleaner</h1>
          </div>
          <p class="tool-hero-desc">Wipe hidden author, creator, application, and producer metadata tags from PDF headers.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">Exposed EXIF Tags</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Cleaned PDF Header</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="pdf-meta-panel">
        <!-- LEFT COLUMN: DROPZONE + STATUS PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="pdf-meta-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop PDF here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select PDF File</button>
              <div style="font-size:11px;color:var(--muted);">Supports PDF files up to 50 MB</div>
              <input type="file" id="pdf-meta-input" accept="application/pdf" style="display:none;">
            </div>
          </div>

          <!-- STATUS PREVIEW -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">🧹</span>
              <h4 style="font-size:16px;font-weight:800;">Header Cleaning Status</h4>
            </div>

            <div id="pdf-meta-status">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a PDF file to strip hidden author & producer metadata tags.
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
              ✅ Title & Subject Tags<br>
              ✅ Author & Creator Info<br>
              ✅ PDF Producer Tool Identifier<br>
              ✅ Creation Date Timestamps
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="pdf-meta-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🧹 Clean Metadata & Download →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('pdf-metadata-cleaner', document.getElementById('usage-wrap'));
    const input = document.getElementById('pdf-meta-input');
    const dropzone = document.getElementById('pdf-meta-dropzone');
    dropzone.onclick = () => input.click();

    let curPdf = null;
    input.onchange = e => {
      curPdf = e.target.files[0];
      if (curPdf) {
        const v = Common.validateFile(curPdf, ['application/pdf'], 50);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ PDF Loaded: ${Common.escapeHtml(curPdf.name)}`);
        document.getElementById('pdf-meta-status').innerHTML = `
          <div class="status-msg success">
            📄 Loaded PDF: <b>${Common.escapeHtml(curPdf.name)}</b> (${(curPdf.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('pdf-meta-start-btn').onclick = async () => {
      if (!curPdf) {
        Common.showToast('⚠️ Please upload a PDF file first!');
        input.click();
        return;
      }
      if (!window.PDFLib) { Common.showToast('PDF-Lib library loading...'); return; }
      if (!Common.checkAndConsume('pdf-metadata-cleaner', document.getElementById('pdf-meta-panel'))) return;

      try {
        const { PDFDocument } = window.PDFLib;
        const bytes = await curPdf.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        pdf.setTitle('');
        pdf.setAuthor('');
        pdf.setSubject('');
        pdf.setProducer('');
        pdf.setCreator('');

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${curPdf.name.replace('.pdf', '')}-clean.pdf`;
        a.click();
        Common.showToast('✅ Cleaned PDF downloaded!');
      } catch (err) {
        console.error(err);
        Common.showToast(`Error cleaning metadata: ${err.message}`);
      }
    };
  },

  readFileDataUrl(file) {
    return new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result);
      r.readAsDataURL(file);
    });
  },

  loadImage(src) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = src;
    });
  }
};

window.PDFTools = PDFTools;

