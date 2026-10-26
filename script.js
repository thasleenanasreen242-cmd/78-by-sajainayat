const INSTAGRAM_URL = "https://www.instagram.com/78_bysajainayat/";
const products = [
  {id:"p1",name:"Everyday Muse",category:"Style",description:"Easy, effortless style inspiration.",image:"photo-1483985988355-763728e1935b",tag:"The edit"},
  {id:"p2",name:"Soft Blush Bag",category:"Bags",description:"A sweet finishing-touch inspiration.",image:"photo-1548036328-c9fa89d128fa",tag:"Loved"},
  {id:"p3",name:"Golden Hour Details",category:"Accessories",description:"Little details with a little sparkle.",image:"photo-1611652022419-a9419f74343d",tag:"Little details"},
  {id:"p4",name:"Weekend Mood",category:"Style",description:"A little inspiration for off-duty days.",image:"photo-1490481651871-ab68de25d43d",tag:"Weekend edit"},
  {id:"p5",name:"Petal Pink Pouch",category:"Bags",description:"A pretty everyday companion idea.",image:"photo-1584917865442-de89df76afd3",tag:"Sweet pick"},
  {id:"p6",name:"Little Sparkle",category:"Accessories",description:"A hint of shine for your everyday.",image:"photo-1535632066927-ab7c9ab60908",tag:"Finishing touch"},
  {id:"p7",name:"Self-care Moment",category:"Beauty",description:"A tiny reminder to take a moment.",image:"photo-1608248543803-ba4f8c70ae0b",tag:"Me time"},
  {id:"p8",name:"The Classic Look",category:"Style",description:"Timeless inspiration worth saving.",image:"photo-1485230895905-ec40ba36b9bc",tag:"Classic"}
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
  toast("Opening Instagram — ask us about " + product.name + " ♡");
  window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
}
function showQuickView(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;
  $("quickViewContent").innerHTML = `<div class="quick-content"><img src="${p.imageUrl}" alt="${safeText(p.name)} editorial inspiration"><div class="quick-copy"><p class="eyebrow">${safeText(p.category)} · THE BOUTIQUE EDIT</p><h2>${safeText(p.name)}</h2><p>${safeText(p.description)} This image is style inspiration rather than a confirmed product listing. Message us to ask about real products, current availability and prices.</p><button class="save-button ${savedIds.has(id) ? "saved" : ""}" data-save="${id}" aria-pressed="${savedIds.has(id)}">${savedIds.has(id) ? "♥ Saved to favourites" : "♡ Save to favourites"}</button><br><button class="button button-dark" data-enquire="${id}">Ask us on Instagram ↗</button></div></div>`;
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
