// tabs
document.querySelectorAll(".install-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    const p=tab.dataset.pkg;
    document.querySelectorAll(".install-tab").forEach(t=>t.classList.toggle("active",t.dataset.pkg===p));
    document.querySelectorAll(".install-line").forEach(l=>l.classList.toggle("active",l.dataset.pkg===p));
  });
});
// copy
document.querySelector(".copy-btn")?.addEventListener("click",()=>{
  const cmd=document.querySelector(".install-line.active .install-cmd")?.textContent?.trim();
  if(!cmd)return;
  (navigator.clipboard?.writeText(cmd)??Promise.reject())
    .catch(()=>{const t=Object.assign(document.createElement("textarea"),{value:cmd,style:"position:fixed;opacity:0"});document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()})
    .finally(()=>showToast("Copied to clipboard!"));
});
function showToast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.classList.add("show");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("show"),2200);}
