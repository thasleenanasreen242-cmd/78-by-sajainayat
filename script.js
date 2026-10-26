const INSTAGRAM_URL = "https://www.instagram.com/78_bysajainayat/";
const WHATSAPP_URL = "https://wa.me/message/7XBYWSW3DGIGM1";
let enquiryProductId = null;
const products = [
  {id:"p1",name:"Everyday Muse",category:"Style",description:"Easy, effortless style inspiration.",image:"photo-1483985988355-763728e1935b",tag:"The edit",edits:["dropped","everyday"]},
  {id:"p2",name:"Soft Blush Bag",category:"Bags",description:"A sweet finishing-touch inspiration.",image:"photo-1548036328-c9fa89d128fa",tag:"Loved",edits:["occasion","everyday"]},
  {id:"p3",name:"Golden Hour Details",category:"Accessories",description:"Little details with a little sparkle.",image:"photo-1611652022419-a9419f74343d",tag:"Little details",edits:["occasion","budget"]},
  {id:"p4",name:"Weekend Mood",category:"Style",description:"A little inspiration for off-duty days.",image:"photo-1490481651871-ab68de25d43d",tag:"Weekend edit",edits:["dropped","everyday"]},
  {id:"p5",name:"Petal Pink Pouch",category:"Bags",description:"A pretty everyday companion idea.",image:"photo-1584917865442-de89df76afd3",tag:"Sweet pick",edits:["dropped","everyday","budget"]},
  {id:"p6",name:"Little Sparkle",category:"Accessories",description:"A hint of shine for your everyday.",image:"photo-1535632066927-ab7c9ab60908",tag:"Finishing touch",edits:["occasion","budget"]},
  {id:"p7",name:"Self-care Moment",category:"Beauty",description:"A tiny reminder to take a moment.",image:"photo-1608248543803-ba4f8c70ae0b",tag:"Me time",edits:["everyday","budget"]},
  {id:"p8",name:"The Classic Look",category:"Style",description:"Timeless inspiration worth saving.",image:"photo-1485230895905-ec40ba36b9bc",tag:"Classic",edits:["occasion","everyday"]}
].map(p => ({...p, imageUrl: `https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=760&q=82`}));

const $ = (id) => document.getElementById(id);
let activeCategory = "All";
let savedIds = new Set();
try { savedIds = new Set(JSON.parse(localStorage.getItem("78-sajainayat-favourites") || "[]")); } catch { savedIds = new Set(); }
let toastTimer;

function safeText(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function persistSaved() {
  try { localStorage.setItem("78-sajainayat-favourites", JSON.stringify([...savedIds])); } catch {}
}
function toast(message) {
  const node = $("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
}
function filteredProducts() {
  const query = $("searchInput").value.trim().toLowerCase();
  const sort = $("sortSelect").value;
  const result = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    [p.name, p.category, p.description, p.tag].join(" ").toLowerCase().includes(query));
  if (sort === "az") result.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === "za") result.sort((a,b) => b.name.localeCompare(a.name));
  return result;
}
function productCard(p, index) {
  const isSaved = savedIds.has(p.id);
  return `<article class="product-card" style="animation-delay:${Math.min(index*45,220)}ms">
    <div class="product-photo" data-quick="${p.id}" role="button" tabindex="0" aria-label="View details for ${safeText(p.name)}">
      <img src="${p.imageUrl}" alt="${safeText(p.name)} editorial inspiration" loading="lazy">
      <span class="product-tag">${safeText(p.tag)}</span>
      <button class="save-button ${isSaved ? "saved" : ""}" data-save="${p.id}" aria-label="${isSaved ? "Remove" : "Save"} ${safeText(p.name)} ${isSaved ? "from" : "to"} favourites" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
      <button class="quick-button" data-quick="${p.id}">Take a closer look ↗</button>
    </div>
    <div class="product-info"><p class="product-category">${safeText(p.category)}</p><h3>${safeText(p.name)}</h3>
      <div class="product-info-bottom"><p>${safeText(p.description)}</p><button class="enquire-link" data-enquire="${p.id}">Ask us ↗</button></div>
    </div>
  </article>`;
}
function renderProducts() {
  const shown = filteredProducts();
  $("productGrid").innerHTML = shown.length ? shown.map(productCard).join("") :
    '<div class="empty-state">No little finds match just yet ♡<button id="resetFilters">Show me everything</button></div>';
  $("resultCount").textContent = `Showing ${shown.length} ${shown.length === 1 ? "piece" : "pieces"}`;
  $("clearSearch").hidden = !$("searchInput").value;
}
function renderSavedCount() { $("savedCount").textContent = savedIds.size; }
function toggleSaved(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  if (savedIds.has(id)) { savedIds.delete(id); toast(`${product.name} removed from your little list`); }
  else { savedIds.add(id); toast(`${product.name} saved with love ♡`); }
  persistSaved(); renderProducts(); renderSavedCount();
  if ($("wishlistDrawer").classList.contains("open")) renderWishlist();
}
function askAbout(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  enquiryProductId = id;
  $("enquiryProduct").innerHTML = '<img src="' + product.imageUrl + '" alt=""><div><strong>' + safeText(product.name) + '</strong><small>' + safeText(product.category) + ' · ' + safeText(product.description) + '</small></div>';
  $("enquirySize").value = "Not sure yet";
  $("enquiryColour").value = "";
  $("enquiryNotes").value = "";
  $("enquiryDialog").showModal();
  $("enquirySize").focus();
}
function showQuickView(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;
  $("quickViewContent").innerHTML = `<div class="quick-content"><img src="${p.imageUrl}" alt="${safeText(p.name)} editorial inspiration"><div class="quick-copy"><p class="eyebrow">${safeText(p.category)} · THE BOUTIQUE EDIT</p><h2>${safeText(p.name)}</h2><p>${safeText(p.description)} This image is style inspiration rather than a confirmed product listing. Message us to ask about real products, current availability and prices.</p><button class="save-button ${savedIds.has(id) ? "saved" : ""}" data-save="${id}" aria-pressed="${savedIds.has(id)}">${savedIds.has(id) ? "♥ Saved to favourites" : "♡ Save to favourites"}</button><br><button class="button button-dark" data-enquire="${id}">Ask about this piece ↗</button></div></div>`;
  $("quickView").showModal();
}
function renderWishlist() {
  const list = products.filter(p => savedIds.has(p.id));
  $("wishlistItems").innerHTML = list.length ? list.map(p => `<article class="wishlist-row"><img src="${p.imageUrl}" alt="" loading="lazy"><div><h3>${safeText(p.name)}</h3><p>${safeText(p.category)} · Ask for details</p><button data-enquire="${p.id}">Ask us about this ↗</button></div><button data-save="${p.id}" aria-label="Remove ${safeText(p.name)}">Remove</button></article>`).join("") : '<div class="wishlist-empty">Your little list is waiting for something lovely ♡</div>';
}
function openWishlist() {
  renderWishlist(); $("wishlistDrawer").classList.add("open"); $("wishlistDrawer").setAttribute("aria-hidden","false");
  document.body.classList.add("drawer-open"); $("wishlistClose").focus();
}
function closeWishlist() {
  $("wishlistDrawer").classList.remove("open"); $("wishlistDrawer").setAttribute("aria-hidden","true");
  document.body.classList.remove("drawer-open"); $("wishlistOpen").focus();
}
document.querySelector(".curated-collections").addEventListener("click", event => {
  const tile = event.target.closest("[data-collection]");
  if (!tile) return;
  const edit = tile.dataset.collection;
  const labels = {dropped:"Just Dropped",occasion:"The Occasion Edit",everyday:"Everyday Essentials",budget:"Under ₹999"};
  $("searchInput").value = "";
  $("sortSelect").value = "featured";
  activeCategory = "All";
  $("filters").querySelectorAll("[data-category]").forEach(item => {
    const active = item.dataset.category === "All";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  const chosen = products.filter(product => product.edits.includes(edit));
  $("productGrid").innerHTML = chosen.map(productCard).join("");
  $("resultCount").textContent = labels[edit] + " · " + chosen.length + " curated picks";
  $("clearSearch").hidden = true;
  document.querySelector(".shop-toolbar").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",block:"start"});
});
$("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  $("filters").querySelectorAll("[data-category]").forEach(item => {
    const active = item === button; item.classList.toggle("active", active); item.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
});
$("searchInput").addEventListener("input", renderProducts);
$("clearSearch").addEventListener("click", () => { $("searchInput").value = ""; renderProducts(); $("searchInput").focus(); });
$("sortSelect").addEventListener("change", renderProducts);
$("productGrid").addEventListener("click", event => {
  const save = event.target.closest("[data-save]");
  const enquire = event.target.closest("[data-enquire]");
  const quick = event.target.closest("[data-quick]");
  if (save) { event.stopPropagation(); toggleSaved(save.dataset.save); return; }
  if (enquire) { event.stopPropagation(); askAbout(enquire.dataset.enquire); return; }
  if (quick) showQuickView(quick.dataset.quick);
  if (event.target.id === "resetFilters") { activeCategory = "All"; $("searchInput").value = ""; $("sortSelect").value = "featured"; $("filters").querySelectorAll("[data-category]").forEach(b => { const active = b.dataset.category === "All"; b.classList.toggle("active",active); b.setAttribute("aria-pressed",String(active)); }); renderProducts(); }
});
$("productGrid").addEventListener("keydown", event => {
  const target = event.target.closest(".product-photo[data-quick]");
  if (target && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); showQuickView(target.dataset.quick); }
});
$("wishlistItems").addEventListener("click", event => {
  const save = event.target.closest("[data-save]"), enquire = event.target.closest("[data-enquire]");
  if (save) toggleSaved(save.dataset.save);
  if (enquire) askAbout(enquire.dataset.enquire);
});
$("quickViewContent").addEventListener("click", event => {
  const save = event.target.closest("[data-save]"), enquire = event.target.closest("[data-enquire]");
  if (save) { toggleSaved(save.dataset.save); if ($("quickView").open) showQuickView(save.dataset.save); }
  if (enquire) askAbout(enquire.dataset.enquire);
});
$("wishlistOpen").addEventListener("click", openWishlist);
$("wishlistClose").addEventListener("click", closeWishlist);
$("drawerBackdrop").addEventListener("click", closeWishlist);
$("quickClose").addEventListener("click", () => $("quickView").close());
$("enquiryClose").addEventListener("click", () => $("enquiryDialog").close());
$("enquiryDialog").addEventListener("click", event => { if (event.target === $("enquiryDialog")) $("enquiryDialog").close(); });
$("enquiryForm").addEventListener("submit", event => {
  event.preventDefault();
  const product = products.find(p => p.id === enquiryProductId);
  if (!product) return;
  const size = $("enquirySize").value;
  const colour = $("enquiryColour").value.trim() || "Open to available colours";
  const notes = $("enquiryNotes").value.trim();
  const message = ["Hello 78 by Saja Inayat! ♡ I would like to enquire about this item.", "Item: " + product.name, "Category: " + product.category, "Preferred size: " + size, "Preferred colour: " + colour, notes ? "Additional details: " + notes : "", "Please confirm current availability, price and shipping options."].filter(Boolean).join(String.fromCharCode(10));
  window.open(WHATSAPP_URL + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  $("enquiryDialog").close();
});
$("quickView").addEventListener("click", event => { if (event.target === $("quickView")) $("quickView").close(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && $("wishlistDrawer").classList.contains("open")) closeWishlist(); });
$("menuToggle").addEventListener("click", () => {
  const open = $("navLinks").classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", String(open));
  $("menuToggle").setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$("navLinks").addEventListener("click", event => { if (event.target.closest("a")) { $("navLinks").classList.remove("open"); $("menuToggle").setAttribute("aria-expanded","false"); } });
const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); } }), {threshold:.12}) : null;
document.querySelectorAll(".reveal").forEach(node => { if (revealObserver) revealObserver.observe(node); else node.classList.add("is-visible"); });
$("year").textContent = new Date().getFullYear();
renderProducts(); renderSavedCount();


// Subtle pointer-driven 3D depth on desktop; touch and reduced-motion users stay comfortable.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !finePointer) return;

  const hero = document.querySelector(".hero-visual");
  if (hero) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
      const image = hero.querySelector(".hero-image-main");
      if (image) image.style.transform = `rotateY(${x * -2}deg) rotateX(${y * 2}deg)`;
      const stamp = hero.querySelector(".hero-image-stamp");
      if (stamp) stamp.style.transform = `translateZ(75px) rotate(${8 + x * 5}deg) translateY(${y * -5}px)`;
      const note = hero.querySelector(".floating-note");
      if (note) note.style.transform = `translateZ(55px) rotate(${-7 + x * 3}deg) translateY(${y * -7}px)`;
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.transform = "";
      const image = hero.querySelector(".hero-image-main");
      if (image) image.style.transform = "";
      const stamp = hero.querySelector(".hero-image-stamp");
      if (stamp) stamp.style.transform = "";
      const note = hero.querySelector(".floating-note");
      if (note) note.style.transform = "";
    });
  }

  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const addTilt = () => {
    grid.querySelectorAll(".product-card").forEach(card => {
      if (card.dataset.tiltReady) return;
      card.dataset.tiltReady = "true";
      const photo = card.querySelector(".product-photo");
      if (!photo) return;
      card.addEventListener("pointermove", event => {
        const rect = photo.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        photo.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
      });
      card.addEventListener("pointerleave", () => { photo.style.transform = ""; });
    });
  };
  addTilt();
  const observer = new MutationObserver(addTilt);
  observer.observe(grid, { childList: true });
})();


// Virtual styling room: local photo preview + outfit inspiration selection.
(() => {
  const fileInput = document.getElementById("tryonFile");
  const userImage = document.getElementById("tryonUserImage");
  const placeholder = document.querySelector(".tryon-placeholder");
  const clearButton = document.getElementById("tryonClear");
  if (!fileInput || !userImage || !placeholder || !clearButton) return;
  let localPhotoUrl = null;
  const moods = {
    soft: {title:"Soft & romantic",category:"STYLE INSPIRATION",description:"Gentle tones and effortless details for a look that feels like you.",image:"photo-1490481651871-ab68de25d43d",alt:"Soft and romantic outfit inspiration",message:"Hello 78 by Saja Inayat! I'd love to ask about your soft and romantic style collection."},
    classic: {title:"Classic chic",category:"TIMELESS STYLE",description:"Clean lines and timeless pieces for a polished everyday look.",image:"photo-1483985988355-763728e1935b",alt:"Classic chic fashion inspiration",message:"Hello 78 by Saja Inayat! I'd love to ask about your classic chic style collection."},
    weekend: {title:"Weekend ease",category:"OFF-DUTY EDIT",description:"Relaxed, easy-going inspiration for your off-duty moments.",image:"photo-1485230895905-ec40ba36b9bc",alt:"Relaxed weekend fashion inspiration",message:"Hello 78 by Saja Inayat! I'd love to ask about your weekend style collection."},
    glam: {title:"A little glam",category:"THE STATEMENT EDIT",description:"A touch of sparkle and confidence for your next special moment.",image:"photo-1535632066927-ab7c9ab60908",alt:"Glam accessories inspiration",message:"Hello 78 by Saja Inayat! I'd love to ask about glamorous occasion styles."}
  };
  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast("Please choose an image file."); fileInput.value = ""; return; }
    if (file.size > 12 * 1024 * 1024) { toast("Please choose a photo smaller than 12 MB."); fileInput.value = ""; return; }
    if (localPhotoUrl) URL.revokeObjectURL(localPhotoUrl);
    localPhotoUrl = URL.createObjectURL(file);
    userImage.src = localPhotoUrl;
    userImage.hidden = false;
    placeholder.hidden = true;
    clearButton.hidden = false;
    toast("Photo ready in your styling room ♡");
  });
  clearButton.addEventListener("click", () => {
    if (localPhotoUrl) URL.revokeObjectURL(localPhotoUrl);
    localPhotoUrl = null;
    userImage.removeAttribute("src");
    userImage.hidden = true;
    placeholder.hidden = false;
    clearButton.hidden = true;
    fileInput.value = "";
  });
  document.querySelectorAll(".tryon-mood").forEach(button => button.addEventListener("click", () => {
    const mood = moods[button.dataset.mood];
    if (!mood) return;
    document.querySelectorAll(".tryon-mood").forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const image = document.getElementById("tryonLookImage");
    image.src = `https://images.unsplash.com/${mood.image}?auto=format&fit=crop&w=700&q=82`;
    image.alt = mood.alt;
    document.getElementById("tryonLookTitle").textContent = mood.title;
    document.getElementById("tryonLookCategory").textContent = mood.category;
    document.getElementById("tryonLookDescription").textContent = mood.description;
    const message = encodeURIComponent(mood.message);
    document.getElementById("tryonEnquire").href = `https://wa.me/message/7XBYWSW3DGIGM1?text=${message}`;
  }));
  window.addEventListener("beforeunload", () => { if (localPhotoUrl) URL.revokeObjectURL(localPhotoUrl); });
})();


// FASHN AI virtual try-on: photos are resized in-browser, sent to our serverless API,
// and polled until the generated result is ready. API keys never reach the browser.
(() => {
  const userInput = document.getElementById("tryonFile");
  const garmentInput = document.getElementById("garmentFile");
  const generateButton = document.getElementById("tryonGenerate");
  if (!userInput || !garmentInput || !generateButton) return;
  const userImage = document.getElementById("tryonUserImage");
  const garmentImage = document.getElementById("tryonGarmentImage");
  const userPlaceholder = document.getElementById("tryonUserPlaceholder");
  const garmentPlaceholder = document.getElementById("garmentPlaceholder");
  const clearUser = document.getElementById("tryonClear");
  const clearGarment = document.getElementById("garmentClear");
  const resultImage = document.getElementById("tryonResultImage");
  const resultEmpty = document.querySelector(".tryon-result-empty");
  const status = document.getElementById("tryonStatus");
  let userData = "";
  let garmentData = "";
  let running = false;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }
  function readAndResize(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) return reject(new Error("Please choose a valid image file."));
      if (file.size > 20 * 1024 * 1024) return reject(new Error("Please choose an image smaller than 20 MB."));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read that image. Please try another photo."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("This image could not be opened. Please try another one."));
        image.onload = () => {
          const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  userInput.addEventListener("change", async () => {
    const file = userInput.files && userInput.files[0];
    if (!file) return;
    try {
      userData = await readAndResize(file);
      userImage.src = userData; userImage.hidden = false; userPlaceholder.hidden = true; clearUser.hidden = false;
      setStatus(garmentData ? "Both photos are ready. Create your virtual try-on when you're ready." : "Your photo is ready. Now add a garment photo.");
    } catch (error) { setStatus(error.message, true); userInput.value = ""; }
  });
  garmentInput.addEventListener("change", async () => {
    const file = garmentInput.files && garmentInput.files[0];
    if (!file) return;
    try {
      garmentData = await readAndResize(file);
      garmentImage.src = garmentData; garmentImage.hidden = false; garmentPlaceholder.hidden = true; clearGarment.hidden = false;
      setStatus(userData ? "Both photos are ready. Create your virtual try-on when you're ready." : "Garment photo ready. Now add your photo.");
    } catch (error) { setStatus(error.message, true); garmentInput.value = ""; }
  });
  clearUser.addEventListener("click", () => {
    userData = ""; userInput.value = ""; userImage.removeAttribute("src"); userImage.hidden = true; userPlaceholder.hidden = false; clearUser.hidden = true;
    setStatus("Upload your photo and a garment photo to begin.");
  });
  clearGarment.addEventListener("click", () => {
    garmentData = ""; garmentInput.value = ""; garmentImage.removeAttribute("src"); garmentImage.hidden = true; garmentPlaceholder.hidden = false; clearGarment.hidden = true;
    setStatus("Upload a garment photo to create your AI preview.");
  });
  generateButton.addEventListener("click", async () => {
    if (running) return;
    if (!userData || !garmentData) { setStatus("Please upload both your photo and a garment photo first.", true); return; }
    running = true; generateButton.disabled = true; resultImage.hidden = true; resultEmpty.hidden = false;
    setStatus("Preparing your AI try-on… This can take up to a minute.");
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("This is taking longer than expected. Please try again in a moment.")), ms));
    try {
      const prediction = await Promise.race([fetch("/api/try-on", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({modelImage:userData, productImage:garmentData})
      }).then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Could not start virtual try-on.");
        return data;
      }), timeout(25000)]);
      if (!prediction.id) throw new Error("The AI provider did not return a prediction ID.");
      const started = Date.now();
      while (Date.now() - started < 80000) {
        await new Promise(resolve => setTimeout(resolve, 3500));
        const response = await fetch("/api/try-on-status?id=" + encodeURIComponent(prediction.id));
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Could not check the AI result.");
        if (data.status === "completed" && data.output) {
          resultImage.src = data.output; resultImage.hidden = false; resultEmpty.hidden = true;
          setStatus("Your AI preview is ready ♡ Results are illustrative, so check real garment details with us.");
          return;
        }
        if (data.status === "failed") throw new Error(data.message || "The AI could not create this preview. Try clearer photos.");
        setStatus("Creating your preview… " + (data.status === "processing" ? "AI is working on your images." : "Waiting for the AI service."));
      }
      throw new Error("Your preview is still processing. Please try again shortly.");
    } catch (error) {
      setStatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
      running = false; generateButton.disabled = false;
    }
  });
})();

/* Signature welcome loader and refined in-page navigation */
(() => {
  const finishLoading = () => {
    document.body.classList.remove("site-loading");
    document.body.classList.add("site-ready");
  };
  if (document.readyState === "complete") {
    window.setTimeout(finishLoading, 500);
  } else {
    window.addEventListener("load", () => window.setTimeout(finishLoading, 500), {once:true});
  }
  window.setTimeout(finishLoading, 2400);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior:reduced ? "auto" : "smooth", block:"start"});
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
})();
