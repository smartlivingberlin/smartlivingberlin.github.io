/* Lokales Auktionsmodul – ohne Server, alles im Browser (localStorage) */
const AUC_STORE_KEY = "slb_auctions_bids_v1";

function loadBids(){
  try { return JSON.parse(localStorage.getItem(AUC_STORE_KEY) || "{}"); }
  catch { return {}; }
}
function saveBids(bids){ localStorage.setItem(AUC_STORE_KEY, JSON.stringify(bids)); }

function getBidsFor(id){
  const all = loadBids();
  return (all[id] || []).sort((a,b)=>b.amount - a.amount);
}

function placeBid(id, amount){
  amount = +amount;
  if(!Number.isFinite(amount) || amount<=0) return {ok:false,msg:"Bitte eine Zahl > 0 bieten."};
  const all = loadBids();
  all[id] = all[id] || [];
  // Mindestschritt (1% vom letzten Gebot, min 500)
  const last = all[id][0]?.amount || 0;
  const minStep = Math.max(500, Math.round(last*0.01));
  if(last>0 && amount < last + minStep){
    return {ok:false, msg:`Gebot zu niedrig. Mindestens ${ (last+minStep).toLocaleString('de-DE') } bieten.`};
  }
  all[id].unshift({amount, ts: Date.now()});
  saveBids(all);
  return {ok:true, msg:"Gebot gespeichert (nur lokal, Demo)."};
}

function fmtCountdown(iso){
  const end = new Date(iso).getTime(), now = Date.now();
  let s=Math.max(0, Math.floor((end-now)/1000));
  const d=Math.floor(s/86400); s%=86400;
  const h=Math.floor(s/3600); s%=3600;
  const m=Math.floor(s/60); s%=60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

async function renderAuctions(){
  const wrap = document.getElementById("auctionList");
  const res = await fetch("auctions/auctions.json",{cache:"no-store"});
  const data = await res.json();

  wrap.innerHTML = data.map(a=>{
    const highest = getBidsFor(a.id)[0]?.amount || 0;
    const minBid = Math.max(a.minBid, highest ? highest + Math.max(500,Math.round(highest*0.01)) : a.minBid);
    return `
      <div class="col-md-6">
        <div class="card h-100">
          <img src="${a.img}" class="card-img-top" alt="${a.title}" style="object-fit:cover;height:220px">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title">${a.title}</h5>
              <span class="badge ${highest>=a.reserve?'bg-success':'bg-secondary'}">
                ${highest>=a.reserve?'Reserve erreicht':'Reserve offen'}
              </span>
            </div>
            <p class="card-text">${a.desc}</p>
            <div class="small text-muted">Ende: ${new Date(a.endsAt).toLocaleString('de-DE')}</div>
            <div class="mt-2"><strong>Aktuell:</strong> ${highest? a.currency+" "+highest.toLocaleString('de-DE') : '—'}</div>
            <div class="input-group mt-2">
              <span class="input-group-text">Gebot</span>
              <input id="bid-${a.id}" type="number" class="form-control" value="${minBid}" step="500" min="0">
              <button class="btn btn-primary" onclick="submitBid('${a.id}', ${minBid})">Bieten</button>
            </div>
            <div id="msg-${a.id}" class="small mt-2 text-muted"></div>
            <div class="mt-3">
              <div class="small text-muted">Countdown: <span id="cd-${a.id}">–</span></div>
              <details class="mt-2">
                <summary>Gebotsverlauf</summary>
                <div id="log-${a.id}" class="small"></div>
              </details>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  // Events anheften
  data.forEach(a=>{
    const update = ()=>{
      const cd = document.getElementById(`cd-${a.id}`);
      if(cd){ cd.textContent = fmtCountdown(a.endsAt); }
      const list = getBidsFor(a.id);
      const log = document.getElementById(`log-${a.id}`);
      if(log){
        log.innerHTML = list.length? "<ul class='mb-0'>"+list.map(b=>`<li>${a.currency} ${b.amount.toLocaleString('de-DE')} · ${new Date(b.ts).toLocaleString('de-DE')}</li>`).join("")+"</ul>" : "<em>Noch keine Gebote.</em>";
      }
    };
    update(); setInterval(update, 1000);
  });

  window.submitBid = (id, suggested)=>{
    const inp = document.getElementById(`bid-${id}`);
    const v = +inp.value || suggested;
    const r = placeBid(id, v);
    const msg = document.getElementById(`msg-${id}`);
    msg.textContent = r.msg;
    msg.className = "small mt-2 " + (r.ok? "text-success":"text-danger");
    renderAuctions(); // refresh Karten (aktueller Preis / minBid)
  };
}

document.addEventListener('DOMContentLoaded', renderAuctions);
