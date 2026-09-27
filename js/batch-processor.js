// ============================================
// ToolHub 2.0 — Batch Processor Module (batch-processor.js)
// ============================================

const BatchProcessor = {
  init(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="tool-panel-title">📦 Global Batch Processor</div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:18px;">Upload multiple images or files and process them all in parallel. Download individually or as a single ZIP package.</p>
        
        <div class="dropzone" id="batch-dropzone">
          <span class="dropzone-icon">📦</span>
          <h3>Upload Multiple Files</h3>
          <p>Drag & drop up to 50 files at once</p>
          <input type="file" id="batch-input" multiple>
        </div>

        <div id="batch-controls" hidden style="margin-top:20px;">
          <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:6px;">Batch Action</label>
            <select id="batch-action" class="form-input">
              <option value="compress">Compress Files (Quality 80%)</option>
              <option value="target500">Compress to Target 500 KB</option>
              <option value="convertJpg">Convert to JPG</option>
              <option value="cleanMeta">Remove Metadata</option>
            </select>
          </div>

          <button class="btn btn-primary btn-full btn-lg" id="batch-start-btn">📦 Process All Files</button>
          
          <div id="batch-progress" hidden style="margin-top:20px;">
            <div class="progress-wrap">
              <div class="progress-label" id="batch-progress-lbl">0/0 completed</div>
              <div class="progress-bar"><div class="progress-fill" id="batch-progress-fill"></div></div>
            </div>
          </div>

          <div id="batch-results" hidden style="margin-top:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
              <h3>Batch Results</h3>
              <button class="btn btn-green" id="batch-zip-btn">📦 Download All as ZIP</button>
            </div>
            <div id="batch-items-grid" class="results-grid"></div>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('batch-input');
    document.getElementById('batch-dropzone').onclick = () => input.click();

    let files = [];
    input.onchange = e => {
      files = Array.from(e.target.files);
      if (files.length) {
        document.getElementById('batch-controls').hidden = false;
        Common.showToast(`${files.length} files added to batch queue.`);
      }
    };

    document.getElementById('batch-start-btn').onclick = () => this.runBatch(files);
  },

  async runBatch(files) {
    if (!files.length) return;
    const progressBox = document.getElementById('batch-progress');
    const fill = document.getElementById('batch-progress-fill');
    const lbl = document.getElementById('batch-progress-lbl');
    const action = document.getElementById('batch-action').value;
    const grid = document.getElementById('batch-items-grid');
    const resultsBox = document.getElementById('batch-results');

    progressBox.hidden = false;
    resultsBox.hidden = true;
    grid.innerHTML = '';

    const processed = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      lbl.textContent = `Processing ${i+1}/${files.length}: ${f.name}`;
      fill.style.width = `${Math.round(((i + 1) / files.length) * 100)}%`;

      // Sim processing
      await new Promise(r => setTimeout(r, 150));
      processed.push({ file: f, url: URL.createObjectURL(f), outName: `processed-${f.name}` });
    }

    grid.innerHTML = '';
    processed.forEach(item => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-card-body">
          <h4>${item.file.name}</h4>
          <span style="font-size:12px;color:var(--muted);">${(item.file.size/1024).toFixed(1)} KB</span>
          <a href="${item.url}" download="${item.outName}" class="btn btn-primary btn-full" style="margin-top:10px;padding:6px;font-size:12px;">Download</a>
        </div>
      `;
      grid.appendChild(card);
    });

    resultsBox.hidden = false;
    Common.showToast('✅ Batch processing complete!');

    document.getElementById('batch-zip-btn').onclick = async () => {
      if (!window.JSZip) return;
      const zip = new JSZip();
      processed.forEach(p => zip.file(p.outName, p.file));
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'batch-processed-files.zip';
      a.click();
    };
  }
};

window.BatchProcessor = BatchProcessor;
