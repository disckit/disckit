// sidebar nav items
document.querySelectorAll(".nav-item").forEach(item=>{
  item.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active"));
    item.classList.add("active");
  });
});
// code copy buttons
document.querySelectorAll(".code-copy").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const block=btn.closest(".code-block").querySelector(".code-body");
    const text=block?.innerText?.trim();
    if(!text)return;
    navigator.clipboard?.writeText(text).then(()=>{
      const orig=btn.textContent;btn.textContent="Copied!";
      setTimeout(()=>btn.textContent=orig,2000);
    });
  });
});
