# 🛠️ ToolHub — All-in-One Online File Tools

A free, fast, and completely private web toolkit for everyday file tasks.
All processing happens **directly in your browser** — your files are never uploaded to any server.

---

## ✨ Features

### 🔐 Account System
- **Register** with your name, email, and password
- **Login** securely — session lasts 7 days
- All accounts are protected with SHA-256 password hashing
- No email verification needed — instant access

---

### 🛠️ Available Tools

#### 🖼️ Image Enhancer
Improve the quality of any photo with smart, real-time adjustments.
- **Brightness, Contrast, Saturation, Sharpness, Warmth** sliders
- **Auto Enhance** — one-click balanced improvement
- **4 Presets** — Natural, Vivid, Soft, Black & White
- **Before / After compare slider** — drag to compare original vs enhanced
- Export as **JPG, PNG, or WebP** at 1× or 2× resolution
- Supports JPG, PNG, WebP up to **25 MB**

#### 🗜️ Image Compressor
Reduce image file sizes without visible quality loss.
- Upload **multiple images** at once
- **Quality slider** (10% – 100%) for full control
- **Output format options** — keep original, force JPG, or force WebP
- See **original vs compressed size** and savings % per image
- **Download All** button — get all compressed images in one click
- Supports JPG, PNG, WebP up to **25 MB each**

#### 📄 PDF Compressor
Shrink large PDF files while keeping them readable.
- **3 compression levels** — Low, Medium, High
- **Custom DPI** (50–150) and **image quality** (20%–95%) sliders
- **Live page thumbnails** preview while processing
- Displays original size, compressed size, and % saved
- Supports PDFs up to **50 MB**

#### 🔄 Image to PDF
Combine multiple images into a single PDF document.
- Upload **any number of images** — JPG, PNG, WebP
- **Drag to reorder** pages before converting
- **Page size options** — A4, Letter, A3, or Fit to Image
- **Orientation** — Portrait, Landscape, or Auto per image
- **Image quality** and **page margin** controls
- Download the final PDF instantly

---

### 📊 Daily Usage Limit
To keep the service fair and fast for everyone, each tool has a limit of:

> **5 uses per tool, per 24 hours**

- A **visual usage badge** on every tool page shows how many uses you have left
- The counter is **color-coded**: 🟢 3+ remaining · 🟡 2 remaining · 🔴 1 remaining
- When the limit is reached, a **countdown timer** shows exactly when it resets
- Limits reset automatically **24 hours after your first use** of the day

---

### 🌙 Light / Dark Mode
- Toggle between **dark mode** (default) and **light mode** using the ☀️/🌙 button in the navbar
- Your preference is **saved automatically** and remembered across visits

---

### 📱 Fully Mobile Responsive
- Works on all screen sizes — phones, tablets, and desktops
- **Hamburger menu** on mobile for easy navigation
- Tool layouts stack vertically on small screens
- Touch-friendly controls and drag-and-drop

---

## 🔒 Privacy & Security

| Feature | Details |
|---------|---------|
| File Processing | 100% in your browser — no file uploads |
| Password Storage | SHA-256 double-hashed with salt |
| Session | Secure random token, 7-day expiry |
| File Access | Files are read locally using browser APIs |
| Data Storage | Account data stored only in your browser (localStorage) |

---

## 🚀 Getting Started

1. Open the website
2. Click **"Create Free Account"** or **"Sign In"**
3. Choose any tool from the homepage
4. Upload your file and start processing!

---

## 🌐 Supported Formats

| Tool | Input Formats | Output Formats |
|------|--------------|----------------|
| Image Enhancer | JPG, PNG, WebP | JPG, PNG, WebP |
| Image Compressor | JPG, PNG, WebP | JPG, PNG, WebP |
| PDF Compressor | PDF | PDF |
| Image to PDF | JPG, PNG, WebP | PDF |

---

## 💡 Tips

- **Image Enhancer**: Use "Auto Enhance" first, then fine-tune with sliders
- **Image Compressor**: 70–80% quality is usually the sweet spot for web images
- **PDF Compressor**: Try "Medium" first — it balances file size and readability well
- **Image to PDF**: Drag images to reorder them before converting
- **Dark/Light Mode**: Switch modes anytime using the button in the top-right corner

---

## ⚡ Technical Details

- Built with **vanilla HTML, CSS, and JavaScript** — no frameworks needed
- Uses the **Canvas API** for image processing
- Uses **PDF.js** for PDF rendering
- Uses **jsPDF** for PDF generation
- Uses **Web Crypto API** for secure password hashing
- All data stored in **localStorage** — no backend required

---

*ToolHub — Simple Tools for a Better Digital Life* 🛠️
