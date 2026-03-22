// collapsible nav sections
document.querySelectorAll(".nav-item[data-collapsible]").forEach(item=>{
  item.addEventListener("click",()=>{
    item.classList.toggle("open");
    const sub=item.nextElementSibling;
    if(sub?.classList.contains("nav-sub"))sub.classList.toggle("open");
  });
});
// active nav
document.querySelectorAll(".nav-item:not([data-collapsible]),.nav-sub-item").forEach(item=>{
  item.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item,.nav-sub-item").forEach(i=>i.classList.remove("active"));
    item.classList.add("active");
  });
});
// code copy
document.querySelectorAll(".code-copy").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const text=btn.closest(".code-block").querySelector(".code-body")?.innerText?.trim();
    if(!text)return;
    navigator.clipboard?.writeText(text).then(()=>{
      const o=btn.textContent;btn.textContent="Copied!";
      setTimeout(()=>btn.textContent=o,2000);
    });
  });
});
