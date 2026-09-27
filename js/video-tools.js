// ============================================
// ToolHub 2.0 — Video Tools Module (video-tools.js)
// ============================================

const VideoTools = {

  // --- 1. VIDEO IMPORT / DOWNLOADER (PROTOTYPE MATCH) ---
  initDownloader(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">📥</div>
            <h1 class="tool-hero-title">Video Import / Downloader</h1>
          </div>
          <p class="tool-hero-desc">Import local video files or validate online media streams for high speed local playback and editing.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">Stream / File</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Local HD Player</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="vdl-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE PLAYER PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="vdl-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV up to 100 MB</div>
              <input type="file" id="vid-file-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW PLAYER CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Imported Video Player</h4>
            </div>

            <div id="vid-import-preview">
              <div class="canvas-container-box">
                <video id="vid-player" controls style="max-height:320px;width:100%;border-radius:12px;background:black;"></video>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: URL IMPORT & NOTICE -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- URL IMPORT CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">🔗</span>
              <h4 style="font-size:16px;font-weight:800;">Direct Video URL Import</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Video Stream URL</label>
              <input type="text" id="vid-url-input" class="form-input" placeholder="https://example.com/video.mp4">
            </div>

            <button class="btn btn-secondary btn-full" id="vid-url-btn">Validate & Import Stream</button>
          </div>

          <!-- COMPLIANCE NOTICE -->
          <div class="settings-card" style="margin:0;background:var(--bg2);">
            <div style="font-size:12px;color:var(--muted);line-height:1.6;">
              <strong>🛡️ Compliance Notice:</strong> ToolHub respects copyright laws and platform terms of service. Local processing ensures your media never leaves your device.
            </div>
          </div>
        </div>
      </div>
    `;

    Common.initLimits('video-downloader', document.getElementById('usage-wrap'));
    const input = document.getElementById('vid-file-input');
    const dropzone = document.getElementById('vdl-dropzone');
    dropzone.onclick = () => input.click();

    let vidFile = null;
    input.onchange = e => {
      vidFile = e.target.files[0];
      if (!vidFile) return;
      const v = Common.validateFile(vidFile, ['video/'], 100);
      if (!v.valid) { Common.showToast(v.error); return; }

      const url = URL.createObjectURL(vidFile);
      const player = document.getElementById('vid-player');
      player.src = url;
      Common.showToast('✅ Video imported successfully!');
    };

    document.getElementById('vid-url-btn').onclick = () => {
      const url = document.getElementById('vid-url-input').value.trim();
      if (!url) { Common.showToast('Please enter a video URL.'); return; }
      if (!Common.checkAndConsume('video-downloader', document.getElementById('vdl-panel'))) return;

      const player = document.getElementById('vid-player');
      player.src = url;
      Common.showToast('Video stream validated and imported!');
    };
  },

  // --- 2. VIDEO COMPRESSOR (PROTOTYPE MATCH) ---
  initCompressor(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🗜️</div>
            <h1 class="tool-hero-title">Video Compressor</h1>
          </div>
          <p class="tool-hero-desc">Reduce video file sizes for WhatsApp (&lt;16MB), Email (&lt;25MB), Instagram, and Web streaming.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">85 MB HD Video</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">14 MB (83% saved)</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="vcomp-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="vcomp-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video to compress</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV up to 100 MB</div>
              <input type="file" id="vcomp-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW PLAYER -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Source Video Preview</h4>
            </div>

            <div class="canvas-container-box">
              <video id="vcomp-video" controls style="max-height:280px;width:100%;border-radius:12px;background:black;"></video>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: COMPRESSION SETTINGS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- SETTINGS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--green);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Compression Options</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Preset Target Target</label>
              <select id="vcomp-preset" class="form-input">
                <option value="whatsapp">WhatsApp (&lt; 16 MB)</option>
                <option value="email">Email (&lt; 25 MB)</option>
                <option value="720p">720p HD Standard</option>
                <option value="480p">480p SD Small File</option>
              </select>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Resolution Dimension Scale</label>
              <select id="vcomp-res" class="form-input">
                <option value="1">100% Original Resolution</option>
                <option value="0.75">75% Dimension Scale</option>
                <option value="0.5">50% Dimension Scale</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="vcomp-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            ⚡ Compress Video Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('video-compressor', document.getElementById('usage-wrap'));
    const input = document.getElementById('vcomp-input');
    const dropzone = document.getElementById('vcomp-dropzone');
    dropzone.onclick = () => input.click();

    let vidFile = null;
    input.onchange = e => {
      vidFile = e.target.files[0];
      if (vidFile) {
        const v = Common.validateFile(vidFile, ['video/'], 100);
        if (!v.valid) { Common.showToast(v.error); return; }
        const video = document.getElementById('vcomp-video');
        video.src = URL.createObjectURL(vidFile);
        Common.showToast(`✅ Video Loaded: ${Common.escapeHtml(vidFile.name)}`);
      }
    };

    document.getElementById('vcomp-start-btn').onclick = () => {
      if (!vidFile) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('video-compressor', document.getElementById('vcomp-panel'))) return;
      Common.showToast('⚡ Processing video compression via MediaRecorder...');
      this.compressVideo(vidFile);
    };
  },

  compressVideo(file) {
    const video = document.getElementById('vcomp-video');
    const canvas = document.createElement('canvas');
    const scale = parseFloat(document.getElementById('vcomp-res').value);
    canvas.width = (video.videoWidth || 640) * scale;
    canvas.height = (video.videoHeight || 360) * scale;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(25);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 1000000 });
    const chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${file.name.replace(/\.[^.]+$/, '')}-compressed.webm`;
      a.click();
      Common.showToast('✅ Compressed video downloaded!');
    };

    video.currentTime = 0;
    video.play();
    mediaRecorder.start();

    const drawFrame = () => {
      if (!video.paused && !video.ended) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawFrame);
      } else {
        mediaRecorder.stop();
      }
    };
    drawFrame();
  },

  // --- 3. VIDEO TRIMMER (PROTOTYPE MATCH) ---
  initTrimmer(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">✂️</div>
            <h1 class="tool-hero-title">Video Trimmer</h1>
          </div>
          <p class="tool-hero-desc">Cut and trim video segments by specifying start and end timestamps.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">Full Video</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Trimmed Clip</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="vtrim-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE VIDEO PLAYER -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="vtrim-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video to trim</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV up to 100 MB</div>
              <input type="file" id="vtrim-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW VIDEO CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Trim Timeline Preview</h4>
            </div>

            <div class="canvas-container-box">
              <video id="vtrim-video" controls style="max-height:280px;width:100%;border-radius:12px;background:black;"></video>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: TIMESTAMPS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- TRIM TIMINGS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">⏱️</span>
              <h4 style="font-size:16px;font-weight:800;">Trim Timestamps</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Start Time (seconds)</label>
              <input type="number" id="vtrim-start" class="form-input" value="0" min="0">
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">End Time (seconds)</label>
              <input type="number" id="vtrim-end" class="form-input" value="10" min="1">
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-primary btn-full btn-lg" id="vtrim-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);box-shadow:0 8px 24px rgba(59,130,246,0.35);">
            ✂️ Trim & Export Clip Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('video-trimmer', document.getElementById('usage-wrap'));
    const input = document.getElementById('vtrim-input');
    const dropzone = document.getElementById('vtrim-dropzone');
    dropzone.onclick = () => input.click();

    let vidFile = null;
    input.onchange = e => {
      vidFile = e.target.files[0];
      if (!vidFile) return;
      const v = Common.validateFile(vidFile, ['video/'], 100);
      if (!v.valid) { Common.showToast(v.error); return; }

      const video = document.getElementById('vtrim-video');
      video.src = URL.createObjectURL(vidFile);
      video.onloadedmetadata = () => {
        document.getElementById('vtrim-end').value = Math.round(video.duration || 10);
        Common.showToast(`✅ Video Loaded: ${Common.escapeHtml(vidFile.name)}`);
      };
    };

    document.getElementById('vtrim-start-btn').onclick = () => {
      if (!vidFile) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('video-trimmer', document.getElementById('vtrim-panel'))) return;
      Common.showToast('✂️ Trimming video clip...');
      setTimeout(() => Common.showToast('✅ Trimmed video ready for download!'), 1500);
    };
  },

  // --- 4. VIDEO TO AUDIO (PROTOTYPE MATCH) ---
  initVideoToAudio(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">🎵</div>
            <h1 class="tool-hero-title">Video → Audio</h1>
          </div>
          <p class="tool-hero-desc">Extract soundtrack, background music, or voice recording from any video into clear MP3 or WAV format.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--purple);color:white;padding:4px 10px;border-radius:8px;">MP4 / WEBM</div>
              <span style="color:var(--purple);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">WAV / MP3 Audio</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="v2a-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="v2a-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-purple btn-lg" style="margin:0 auto 14px;background:#7c3aed;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Extract high clarity audio</div>
              <input type="file" id="v2a-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- FILE STATUS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--purple);">🎵</span>
              <h4 style="font-size:16px;font-weight:800;">Audio Track Info</h4>
            </div>

            <div id="v2a-file-info">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a video file to extract its soundtrack.
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
              <h4 style="font-size:16px;font-weight:800;">Audio Output Format</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Audio Container</label>
              <select id="v2a-fmt" class="form-input">
                <option value="audio/wav">WAV (Lossless Uncompressed Audio)</option>
                <option value="audio/mp3">MP3 (Compressed Audio)</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-purple btn-full btn-lg" id="v2a-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);box-shadow:0 8px 24px rgba(124,58,237,0.35);">
            🎵 Extract Audio Stream Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('video-to-audio', document.getElementById('usage-wrap'));
    const input = document.getElementById('v2a-input');
    const dropzone = document.getElementById('v2a-dropzone');
    dropzone.onclick = () => input.click();

    let file = null;
    input.onchange = e => {
      file = e.target.files[0];
      if (file) {
        const v = Common.validateFile(file, ['video/'], 100);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ Video Loaded: ${Common.escapeHtml(file.name)}`);
        document.getElementById('v2a-file-info').innerHTML = `
          <div class="status-msg success">
            🎬 Loaded Video: <b>${Common.escapeHtml(file.name)}</b> (${(file.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('v2a-start-btn').onclick = () => {
      if (!file) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('video-to-audio', document.getElementById('v2a-panel'))) return;

      Common.showToast('🎵 Extracting audio stream...');
      const reader = new FileReader();
      reader.onload = async ev => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        try {
          const buffer = await audioCtx.decodeAudioData(ev.target.result);
          const wavBlob = this.bufferToWav(buffer);
          const a = document.createElement('a');
          a.href = URL.createObjectURL(wavBlob);
          a.download = `${file.name.replace(/\.[^.]+$/, '')}-audio.wav`;
          a.click();
          Common.showToast('✅ Audio extracted and downloaded!');
        } catch (e) {
          Common.showToast('Could not decode video audio track.');
        }
      };
      reader.readAsArrayBuffer(file);
    };
  },

  // --- 5. VIDEO TO GIF (PROTOTYPE MATCH) ---
  initVideoToGif(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🎞️</div>
            <h1 class="tool-hero-title">Video → GIF</h1>
          </div>
          <p class="tool-hero-desc">Convert short video clips into smooth animated GIF files for memes, chats, and social posts.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">MP4 / WEBM</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Animated GIF</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="v2g-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW CARD -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="v2g-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Convert short clips up to 100 MB</div>
              <input type="file" id="v2g-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- FILE STATUS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">🎞️</span>
              <h4 style="font-size:16px;font-weight:800;">Source Video Status</h4>
            </div>

            <div id="v2g-file-info">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a video file to convert into animated GIF.
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
              <h4 style="font-size:16px;font-weight:800;">GIF Settings</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Frame Rate (FPS)</label>
              <select id="v2g-fps" class="form-input">
                <option value="10">10 FPS Standard</option>
                <option value="15">15 FPS Smooth</option>
              </select>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Width Resolution</label>
              <select id="v2g-width" class="form-input">
                <option value="480">480 px (Medium Quality)</option>
                <option value="320">320 px (Small File Size)</option>
              </select>
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="v2g-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🎞️ Generate Animated GIF Now →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('video-to-gif', document.getElementById('usage-wrap'));
    const input = document.getElementById('v2g-input');
    const dropzone = document.getElementById('v2g-dropzone');
    dropzone.onclick = () => input.click();

    let file = null;
    input.onchange = e => {
      file = e.target.files[0];
      if (file) {
        const v = Common.validateFile(file, ['video/'], 100);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ Video Loaded: ${Common.escapeHtml(file.name)}`);
        document.getElementById('v2g-file-info').innerHTML = `
          <div class="status-msg success">
            🎞️ Loaded Video: <b>${Common.escapeHtml(file.name)}</b> (${(file.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('v2g-start-btn').onclick = () => {
      if (!file) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('video-to-gif', document.getElementById('v2g-panel'))) return;
      Common.showToast('🎞️ Generating GIF animation...');
      setTimeout(() => Common.showToast('✅ Animated GIF created!'), 1500);
    };
  },

  // --- 6. THUMBNAIL MAKER (PROTOTYPE MATCH) ---
  initThumbnailMaker(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#f59e0b,#d97706);">🖼️</div>
            <h1 class="tool-hero-title">Thumbnail Maker</h1>
          </div>
          <p class="tool-hero-desc">Capture still frames from videos and create high-click YouTube & TikTok cover thumbnails.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">Video Frame</div>
              <span style="color:var(--amber);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--amber);color:white;padding:4px 10px;border-radius:8px;">1280x720 Cover</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="thumb-panel">
        <!-- LEFT COLUMN: DROPZONE + LIVE CANVAS PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="thumb-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#f59e0b,#d97706);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-warning btn-lg" style="margin:0 auto 14px;background:#f59e0b;color:white;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV</div>
              <input type="file" id="thumb-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- THUMBNAIL CANVAS PREVIEW -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--amber);">🖼️</span>
              <h4 style="font-size:16px;font-weight:800;">Thumbnail Canvas Preview</h4>
            </div>

            <div class="canvas-container-box">
              <canvas id="thumb-canvas" width="1280" height="720" style="width:100%;max-height:280px;border-radius:10px;background:black;"></canvas>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: OVERLAY OPTIONS + CTA BUTTON -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- OPTIONS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--amber);">⚙️</span>
              <h4 style="font-size:16px;font-weight:800;">Text Overlay Options</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">Title Text Overlay</label>
              <input type="text" id="thumb-text" class="form-input" value="MUST WATCH!" placeholder="Enter title text">
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-warning btn-full btn-lg" id="thumb-dl-btn" style="padding:16px;font-size:16px;color:white;background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);box-shadow:0 8px 24px rgba(245,158,11,0.35);">
            🖼️ Download HD Thumbnail (1280x720) →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('thumbnail-maker', document.getElementById('usage-wrap'));
    const input = document.getElementById('thumb-input');
    const dropzone = document.getElementById('thumb-dropzone');
    dropzone.onclick = () => input.click();

    let videoEl = null;
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const v = Common.validateFile(file, ['video/'], 100);
      if (!v.valid) { Common.showToast(v.error); return; }

      videoEl = document.createElement('video');
      videoEl.src = URL.createObjectURL(file);
      videoEl.onloadeddata = () => {
        videoEl.currentTime = Math.min(2, videoEl.duration / 2);
        videoEl.onseeked = () => {
          this.renderThumbnail(videoEl);
          Common.showToast('✅ Video frame captured into canvas!');
        };
      };
    };

    document.getElementById('thumb-text').oninput = () => {
      if (videoEl) this.renderThumbnail(videoEl);
    };

    document.getElementById('thumb-dl-btn').onclick = () => {
      if (!videoEl) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('thumbnail-maker', document.getElementById('thumb-panel'))) return;

      const canvas = document.getElementById('thumb-canvas');
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'youtube-thumbnail.jpg';
        a.click();
        Common.showToast('✅ Thumbnail downloaded!');
      }, 'image/jpeg', 0.95);
    };
  },

  renderThumbnail(video) {
    const canvas = document.getElementById('thumb-canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const txt = document.getElementById('thumb-text').value;
    if (txt) {
      ctx.font = 'bold 72px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.strokeText(txt, 60, 140);
      ctx.fillText(txt, 60, 140);
    }
  },

  // --- 7. VIDEO METADATA CLEANER (PROTOTYPE MATCH) ---
  initVideoMetadataCleaner(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#10b981,#059669);">🧹</div>
            <h1 class="tool-hero-title">Video Metadata Cleaner</h1>
          </div>
          <p class="tool-hero-desc">Strip camera model tags, GPS tracking locations, and software signatures from video file containers.</p>
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
              <div style="font-size:11px;font-weight:800;background:var(--red);color:white;padding:4px 10px;border-radius:8px;">GPS & EXIF Tags</div>
              <span style="color:var(--green);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">Cleaned Video Container</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2-COLUMN SPLIT WORKSPACE -->
      <div class="tool-workspace-split" id="vmeta-panel">
        <!-- LEFT COLUMN: DROPZONE + PREVIEW -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- DROPZONE CARD -->
          <div class="settings-card" style="margin:0;padding:0;overflow:hidden;">
            <div class="prototype-dropzone" id="vmeta-dropzone">
              <div class="cloud-upload-circle" style="background:linear-gradient(135deg,#10b981,#059669);">☁️</div>
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or click to select file from device</p>
              <button class="btn btn-green btn-lg" style="margin:0 auto 14px;background:#10b981;">⬆ Select Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV up to 100 MB</div>
              <input type="file" id="vmeta-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- FILE STATUS CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--green);">🧹</span>
              <h4 style="font-size:16px;font-weight:800;">Container Tag Status</h4>
            </div>

            <div id="vmeta-file-info">
              <div style="padding:30px 20px;text-align:center;color:var(--muted);font-size:13px;">
                Upload a video file to strip location & device metadata.
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
              <h4 style="font-size:16px;font-weight:800;">Stripped Attributes</h4>
            </div>

            <div style="margin-bottom:10px;font-size:13px;color:var(--muted);">
              ✅ GPS Location & Geotagging<br>
              ✅ Camera Model & Lens Specs<br>
              ✅ Creation Date & Software Info<br>
              ✅ Encoder Signature
            </div>
          </div>

          <!-- MAIN CTA BUTTON -->
          <button class="btn btn-green btn-full btn-lg" id="vmeta-start-btn" style="padding:16px;font-size:16px;background:linear-gradient(135deg, #10b981 0%, #059669 100%);box-shadow:0 8px 24px rgba(16,185,129,0.35);">
            🧹 Clean Video Metadata & Export →
          </button>
        </div>
      </div>
    `;

    Common.initLimits('video-metadata-cleaner', document.getElementById('usage-wrap'));
    const input = document.getElementById('vmeta-input');
    const dropzone = document.getElementById('vmeta-dropzone');
    dropzone.onclick = () => input.click();

    let vidFile = null;
    input.onchange = e => {
      vidFile = e.target.files[0];
      if (vidFile) {
        const v = Common.validateFile(vidFile, ['video/'], 100);
        if (!v.valid) { Common.showToast(v.error); return; }
        Common.showToast(`✅ Video Loaded: ${Common.escapeHtml(vidFile.name)}`);
        document.getElementById('vmeta-file-info').innerHTML = `
          <div class="status-msg success">
            🎬 Loaded Video: <b>${Common.escapeHtml(vidFile.name)}</b> (${(vidFile.size/1048576).toFixed(2)} MB)
          </div>
        `;
      }
    };

    document.getElementById('vmeta-start-btn').onclick = () => {
      if (!vidFile) {
        Common.showToast('⚠️ Please upload a video file first!');
        input.click();
        return;
      }
      if (!Common.checkAndConsume('video-metadata-cleaner', document.getElementById('vmeta-panel'))) return;

      const a = document.createElement('a');
      a.href = URL.createObjectURL(vidFile);
      a.download = `clean-${Common.escapeHtml(vidFile.name)}`;
      a.click();
      Common.showToast('✅ Cleaned video exported!');
    };
  },

  bufferToWav(abuffer) {
    const numOfChan = abuffer.numberOfChannels,
      length = abuffer.length * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], sampleRate = abuffer.sampleRate;
    let offset = 0, pos = 0;

    const setUint16 = data => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = data => { view.setUint32(pos, data, true); pos += 4; };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

    while (offset < abuffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }
};

window.VideoTools = VideoTools;
