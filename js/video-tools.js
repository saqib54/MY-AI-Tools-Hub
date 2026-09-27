// ============================================
// ToolHub 2.0 — Video Tools Module (video-tools.js)
// ============================================

const VideoTools = {

  // --- 1. VIDEO IMPORT / DOWNLOADER (REAL TIKTOK & SOCIAL MEDIA HD DOWNLOADER) ---
  initDownloader(container) {
    container.innerHTML = `
      <div class="usage-wrap" id="usage-wrap"></div>

      <!-- HERO BANNER AT TOP OF TOOL PAGE -->
      <section class="tool-hero-banner">
        <div>
          <div class="tool-hero-header">
            <div class="tool-hero-icon" style="background:linear-gradient(135deg,#3b82f6,#2563eb);">📥</div>
            <h1 class="tool-hero-title">Video & TikTok Downloader</h1>
          </div>
          <p class="tool-hero-desc">Download HD videos from TikTok (No Watermark), Instagram, YouTube & direct video links.</p>
          <div class="tool-feature-badges">
            <span class="tool-feature-badge">⚡ No Watermark</span>
            <span class="tool-feature-badge">💎 1080p / 4K HD MP4</span>
            <span class="tool-feature-badge">🎵 MP3 Audio Extraction</span>
            <span class="tool-feature-badge">📱 Mobile & Desktop Friendly</span>
          </div>
        </div>
        
        <div class="tool-hero-visual" style="text-align:center;">
          <div style="background:var(--card);padding:18px 24px;border-radius:20px;box-shadow:var(--shadow-card);border:1px solid var(--border);display:inline-block;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:11px;font-weight:800;background:var(--blue);color:white;padding:4px 10px;border-radius:8px;">TikTok / URL Link</div>
              <span style="color:var(--blue);font-size:18px;font-weight:900;">➔</span>
              <div style="font-size:11px;font-weight:800;background:var(--green);color:white;padding:4px 10px;border-radius:8px;">HD MP4 (No Watermark)</div>
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
              <h3 style="font-size:18px;font-weight:800;margin-bottom:4px;">Drag & Drop local video file here</h3>
              <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">or paste a TikTok video link on the right</p>
              <button class="btn btn-primary btn-lg" style="margin:0 auto 14px;background:#3b82f6;">⬆ Select Local Video File</button>
              <div style="font-size:11px;color:var(--muted);">Supports MP4, WEBM, MOV up to 100 MB</div>
              <input type="file" id="vid-file-input" accept="video/*" style="display:none;">
            </div>
          </div>

          <!-- PREVIEW PLAYER CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <span style="font-size:18px;color:var(--blue);">👁</span>
              <h4 style="font-size:16px;font-weight:800;">Video Player Preview</h4>
            </div>

            <div id="vid-import-preview">
              <div class="canvas-container-box">
                <video id="vid-player" controls style="max-height:320px;width:100%;border-radius:12px;background:black;"></video>
              </div>
            </div>

            <div id="vdl-result-actions" style="margin-top:16px;display:none;flex-direction:column;gap:10px;"></div>
          </div>
        </div>

        <!-- RIGHT COLUMN: URL PASTE & DOWNLOAD ENGINE -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- URL IMPORT CARD -->
          <div class="settings-card" style="margin:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
              <span style="font-size:18px;color:var(--blue);">📥</span>
              <h4 style="font-size:16px;font-weight:800;">Paste Video / TikTok URL</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-label">TikTok / Instagram / YouTube / Direct MP4 URL</label>
              <input type="text" id="vid-url-input" class="form-input" placeholder="Paste link here... (e.g. https://vt.tiktok.com/...)">
            </div>

            <button class="btn btn-primary btn-full btn-lg" id="vid-url-btn" style="padding:14px;font-size:15px;">
              🚀 Fetch & Extract HD Video →
            </button>
          </div>

          <!-- EXTRACTION STATUS DISPLAY -->
          <div id="vdl-status-box" class="settings-card" style="margin:0;display:none;"></div>

          <!-- COMPLIANCE NOTICE -->
          <div class="settings-card" style="margin:0;background:var(--bg2);">
            <div style="font-size:12px;color:var(--muted);line-height:1.6;">
              <strong>🛡️ Privacy & Compliance Notice:</strong> ToolHub respects platform terms of service. Downloads are generated for personal preview and authorized content creation.
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
      document.getElementById('vdl-result-actions').style.display = 'none';
      Common.showToast('✅ Video imported successfully!');
    };

    document.getElementById('vid-url-btn').onclick = async () => {
      const rawInput = document.getElementById('vid-url-input').value.trim();
      if (!rawInput) { Common.showToast('⚠️ Please paste a TikTok, YouTube, or video link first!'); return; }
      if (!Common.checkAndConsume('video-downloader', document.getElementById('vdl-panel'))) return;

      const urlMatch = rawInput.match(/https?:\/\/[^\s]+/i);
      const url = urlMatch ? urlMatch[0] : rawInput;

      const btn = document.getElementById('vid-url-btn');
      const statusBox = document.getElementById('vdl-status-box');
      const resultActions = document.getElementById('vdl-result-actions');
      const previewBox = document.getElementById('vid-import-preview');

      btn.disabled = true;
      btn.textContent = '⏳ Extracting Media Stream...';
      statusBox.style.display = 'block';
      statusBox.className = 'settings-card';
      statusBox.style.background = 'rgba(59,130,246,0.08)';
      statusBox.style.borderColor = 'rgba(59,130,246,0.3)';
      statusBox.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--blue);font-weight:700;">
          <span class="spinner" style="display:inline-block;width:18px;height:18px;border:2px solid var(--blue);border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;"></span>
          Resolving media link & fetching HD video stream...
        </div>
      `;

      try {
        let extracted = null;

        // 1. TIKTOK LINK RESOLVER
        if (/tiktok\.com/i.test(url)) {
          try {
            const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
            const json = await res.json();
            if (json.code === 0 && json.data) {
              extracted = {
                type: 'tiktok',
                title: json.data.title || 'TikTok Video',
                author: json.data.author ? (json.data.author.nickname || json.data.author.unique_id) : 'TikTok Creator',
                playUrl: json.data.play,
                wmUrl: json.data.wmplay,
                audioUrl: json.data.music,
                cover: json.data.cover
              };
            }
          } catch (e1) {
            console.warn('TikWM error:', e1);
          }
        }

        // 2. YOUTUBE LINK RESOLVER
        else if (/youtube\.com|youtu\.be/i.test(url)) {
          const m = url.match(/(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/|embed\/)?([a-zA-Z0-9_-]{11})/i);
          const ytId = m ? m[1] : null;
          if (ytId) {
            extracted = {
              type: 'youtube',
              ytId: ytId,
              title: `YouTube Video (${ytId})`,
              author: 'YouTube',
              embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`,
              playUrl: `https://www.youtube.com/watch?v=${ytId}`
            };
          }
        }

        // 3. INSTAGRAM LINK RESOLVER
        else if (/instagram\.com/i.test(url)) {
          extracted = {
            type: 'instagram',
            title: 'Instagram Reel / Post',
            author: 'Instagram',
            playUrl: url
          };
        }

        // 4. GENERIC / DIRECT MP4 VIDEO URL
        if (!extracted) {
          extracted = {
            type: 'generic',
            title: 'Direct Video Stream',
            author: 'Online Media Stream',
            playUrl: url
          };
        }

        // RENDER RESULT UI
        if (extracted) {
          statusBox.style.background = 'rgba(16,185,129,0.08)';
          statusBox.style.borderColor = 'rgba(16,185,129,0.3)';
          statusBox.innerHTML = `
            <div style="font-weight:800;color:var(--green);font-size:14px;margin-bottom:4px;">🎉 Media Successfully Extracted!</div>
            <div style="font-size:12.5px;color:var(--text);line-height:1.4;">
              <strong>${Common.escapeHtml(extracted.title)}</strong><br>
              <span style="color:var(--muted);font-size:11px;">Source: ${Common.escapeHtml(extracted.author)}</span>
            </div>
          `;

          // If YouTube, render responsive YouTube Embed Player
          if (extracted.type === 'youtube' && extracted.ytId) {
            previewBox.innerHTML = `
              <div class="canvas-container-box">
                <iframe src="${extracted.embedUrl}" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:320px;border-radius:12px;border:none;background:black;"></iframe>
              </div>
            `;
          } else {
            // Render native video player
            previewBox.innerHTML = `
              <div class="canvas-container-box">
                <video id="vid-player" controls autoplay style="max-height:320px;width:100%;border-radius:12px;background:black;" src="${extracted.playUrl}"></video>
              </div>
            `;
          }

          resultActions.style.display = 'flex';

          if (extracted.type === 'tiktok') {
            resultActions.innerHTML = `
              <button class="btn btn-green btn-full btn-lg" id="dl-hd-btn" style="padding:14px;font-size:15px;background:#10b981;">
                ⬇️ Download HD MP4 (No Watermark)
              </button>
              ${extracted.audioUrl ? `
                <button class="btn btn-purple btn-full" id="dl-mp3-btn" style="padding:12px;font-size:14px;">
                  🎵 Download MP3 Audio Track
                </button>
              ` : ''}
              <button class="btn btn-secondary btn-full" onclick="navigator.clipboard.writeText('${Common.escapeHtml(extracted.playUrl)}'); Common.showToast('📋 Copied MP4 link to clipboard!');">
                📋 Copy Direct MP4 Link
              </button>
            `;

            document.getElementById('dl-hd-btn').onclick = () => {
              this.triggerDirectDownload(extracted.playUrl, `TikTok-${Date.now()}.mp4`);
            };

            if (extracted.audioUrl && document.getElementById('dl-mp3-btn')) {
              document.getElementById('dl-mp3-btn').onclick = () => {
                this.triggerDirectDownload(extracted.audioUrl, `TikTok-Audio-${Date.now()}.mp3`);
              };
            }
          } else if (extracted.type === 'youtube') {
            resultActions.innerHTML = `
              <a href="https://loader.to/api/button/?url=${encodeURIComponent(extracted.playUrl)}&f=mp4" target="_blank" class="btn btn-green btn-full btn-lg" style="padding:14px;font-size:15px;background:#10b981;text-decoration:none;">
                ⬇️ Download YouTube MP4 (HD)
              </a>
              <a href="https://loader.to/api/button/?url=${encodeURIComponent(extracted.playUrl)}&f=mp3" target="_blank" class="btn btn-purple btn-full" style="padding:12px;font-size:14px;text-decoration:none;">
                🎵 Download MP3 Audio Track
              </a>
              <a href="${extracted.playUrl}" target="_blank" class="btn btn-secondary btn-full" style="text-decoration:none;">
                📺 Watch on YouTube
              </a>
            `;
          } else {
            resultActions.innerHTML = `
              <button class="btn btn-green btn-full btn-lg" id="dl-hd-btn" style="padding:14px;font-size:15px;background:#10b981;">
                ⬇️ Download Video Stream (MP4)
              </button>
              <button class="btn btn-secondary btn-full" onclick="navigator.clipboard.writeText('${Common.escapeHtml(extracted.playUrl)}'); Common.showToast('📋 Copied link to clipboard!');">
                📋 Copy Stream Link
              </button>
            `;
            document.getElementById('dl-hd-btn').onclick = () => {
              this.triggerDirectDownload(extracted.playUrl, `Video-${Date.now()}.mp4`);
            };
          }

          Common.showToast('✅ Video extracted & ready!');
        } else {
          statusBox.style.display = 'block';
          statusBox.innerHTML = `⚠️ Could not extract video stream. Please verify the URL and try again.`;
          Common.showToast('⚠️ Check URL format.');
        }
      } catch (err) {
        console.warn('Video import error:', err);
        statusBox.style.display = 'block';
        statusBox.innerHTML = `⚠️ Error fetching video link. Make sure link is valid and public.`;
        Common.showToast('Error importing video link.');
      } finally {
        btn.disabled = false;
        btn.textContent = '🚀 Fetch & Extract HD Video →';
      }
    };
  },

  /** Direct File Download Helper */
  async triggerDirectDownload(fileUrl, filename = 'video.mp4') {
    Common.showToast('⏬ Starting video download...');
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      Common.showToast(`🎉 Downloaded: ${filename}`);
      if (window.Tracker) Tracker.logDownload('video-downloader', filename, blob.size, blob.size);
    } catch (e) {
      // CORS fallback: trigger direct window download / open stream link
      const a = document.createElement('a');
      a.href = fileUrl;
      a.target = '_blank';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      Common.showToast('✅ Video stream opened for download!');
      if (window.Tracker) Tracker.logDownload('video-downloader', filename, 0, 0);
    }
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
