// Gate + Message + Reveal + Countdown + Confetti
const $ = s => document.querySelector(s);
const show = el => el.classList.remove('hidden');
const hide = el => el.classList.add('hidden');

// Persist unlocked state locally
const unlockedKey = 'lea_gift1_unlocked';
const messageSeenKey = 'lea_message_seen';

// Gate logic
const correctAnswer = (txt) => {
  if(!txt) return false;
  const normalized = txt.trim().toLowerCase().replace(/\s+/g,' ');
  return normalized === 'deek duke';
};

const form = document.getElementById('gateForm');
const err = document.getElementById('err');

function goToMessage(){
  hide($('#gate'));
  show($('#messageStep'));
  localStorage.setItem(unlockedKey, 'true'); // mark passcode solved
}
function goToGift(){
  hide($('#messageStep'));
  show($('#hero')); show($('#gift')); show($('#countdown')); show($('.footer'));
  localStorage.setItem(messageSeenKey, 'true');
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const a = document.getElementById('answer').value;
  if (correctAnswer(a)){
    goToMessage();
  } else {
    err.textContent = 'Nope — try again 😉';
    form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
  }
});

// If already unlocked previously, skip straight to message or gift
if(localStorage.getItem(unlockedKey) === 'true'){
  hide($('#gate'));
  if(localStorage.getItem(messageSeenKey) === 'true'){ goToGift(); }
  else { show($('#messageStep')); }
}

// Message step button
document.getElementById('unlockGift').addEventListener('click', goToGift);

// Countdown (midnight Paris on Dec 12, 2025 => 2025-12-11T23:00:00Z)
const target = new Date('2025-12-11T23:00:00Z');
function pad(n){return String(n).padStart(2,'0');}
function tick(){
  const now = new Date();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  $('#d').textContent = pad(d);
  $('#h').textContent = pad(h);
  $('#m').textContent = pad(m);
  $('#s').textContent = pad(s);
}
setInterval(tick, 1000); tick();

// Confetti
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let confetti = [];
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function spawnConfetti(n=120){
  confetti = [];
  for(let i=0;i<n;i++){
    confetti.push({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*canvas.height,
      r: 3 + Math.random()*5,
      v: 2 + Math.random()*3,
      w: 0.5 + Math.random()*1.5,
      a: Math.random()*Math.PI
    });
  }
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confetti.forEach(p=>{
    p.y += p.v;
    p.x += Math.sin((p.y+p.a)/20)*p.w;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = `hsl(${(p.y/5)%360}, 100%, 60%)`;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  confetti = confetti.filter(p => p.y < canvas.height + 20);
  requestAnimationFrame(draw);
}
spawnConfetti(); draw();
document.addEventListener('click', ()=> spawnConfetti(180));

// Modal for certificate (optional trigger retained but hidden by design)
const modal = document.getElementById('giftModal');
if (modal){
  modal.querySelector('.close').addEventListener('click', ()=> modal.close());
}
