const E = BlockEngine, board = document.querySelector('#board');
const cols = 10, rows = 10, size = 60;
const palette = ['#f47770', '#f7b75c', '#f6d86d', '#91ca8b', '#73c8ce', '#a6a0dc', '#e6a2c5'];
let blocks = [], nextId = 1, mode = 'move', selected = null, drag = null, history = [];
const $ = id => document.getElementById(id);
const snapshot = () => JSON.stringify(blocks);
function remember(value = snapshot()) { history.push(value); if (history.length > 80) history.shift(); }
function say(text) { $('message').textContent = text; }
function point(event) { const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(board.getScreenCTM().inverse()); return { x: p.x, y: p.y }; }
function cellAt(p) { return { x: Math.floor(p.x / size), y: rows - 1 - Math.floor(p.y / size) }; }
function render() {
  let html = '<defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#dde5d8" stroke-width="1.5"/><circle cx="0" cy="0" r="2" fill="#c7d4c0"/></pattern></defs><rect width="600" height="600" fill="url(#grid)"/>';
  const ordered = blocks.slice().sort((a,b) => Number(a.id === drag?.id) - Number(b.id === drag?.id));
  for (const b of ordered) {
    const active = drag?.id === b.id, dx = active ? drag.dx * size : 0, dy = active ? -drag.dy * size : 0;
    const color = palette[(b.cells.length - 1) % palette.length];
    html += `<g class="block" data-id="${b.id}" transform="translate(${dx} ${dy})" opacity="${active ? '.78' : '1'}">`;
    for (const c of b.cells) {
      const x = c.x * size, y = (rows - 1 - c.y) * size;
      html += `<rect class="cell" x="${x+3}" y="${y+3}" width="54" height="54" rx="10" fill="${color}" stroke="${selected === b.id ? '#315f52' : '#ffffff'}"/><path d="M${x+12} ${y+10} H${x+45}" stroke="#ffffff65" stroke-width="3" stroke-linecap="round"/>`;
    }
    const anchor = b.cells.slice().sort((a,b) => b.y-a.y || a.x-b.x)[0];
    const x = anchor.x*size+30, y = (rows-1-anchor.y)*size;
    html += `<text class="label" text-anchor="middle" x="${x}" y="${y+31}">${b.cells.length}</text><circle class="eye" cx="${x-7}" cy="${y+41}" r="2.5"/><circle class="eye" cx="${x+7}" cy="${y+41}" r="2.5"/><path d="M${x-4} ${y+47} Q${x} ${y+51} ${x+4} ${y+47}" stroke="#253b37" stroke-width="2" fill="none"/></g>`;
  }
  board.innerHTML = html;
  $('stats').textContent = `${blocks.length} number${blocks.length === 1 ? '' : 's'} · ${blocks.reduce((n,b)=>n+b.cells.length,0)} squares`;
  $('undo').disabled = !history.length;
}
function start() { blocks = [{ id: nextId++, cells: [{x:1,y:1}] },{ id: nextId++, cells: [{x:1,y:3}] }]; selected=null; render(); say('Drag the two ones together to make a two.'); }
function setMode(value) { mode=value; for (const m of ['move','split']) { $(m).classList.toggle('active',m===mode); $(m).setAttribute('aria-pressed',String(m===mode)); } say(mode==='split' ? 'Drag one square away. The rest stays on the grid.' : 'Drag a number beside another to join them.'); }
board.addEventListener('pointerdown', event => {
  if (drag || event.button !== 0) return;
  const p=point(event), c=cellAt(p), block=blocks.find(b=>b.cells.some(o=>E.same(c,o)));
  if (!block) { selected=null; render(); return; }
  event.preventDefault(); board.focus();
  const before=snapshot(); let id=block.id;
  if(mode==='split' && block.cells.length>1) {
    blocks=blocks.filter(b=>b.id!==id);
    blocks.push(...E.components(block.cells.filter(o=>!E.same(c,o))).map(cells=>({id:nextId++,cells})));
    id=nextId++; blocks.push({id,cells:[c]});
  }
  selected=id; drag={id,start:p,dx:0,dy:0,before}; board.setPointerCapture(event.pointerId); render();
});
board.addEventListener('pointermove', event => {
  if(!drag) return;
  const p=point(event); drag.dx=Math.round((p.x-drag.start.x)/size); drag.dy=-Math.round((p.y-drag.start.y)/size); render();
});
function finish(cancelled=false) {
  if(!drag) return;
  const d=drag; drag=null;
  if(cancelled || (!d.dx && !d.dy)) { blocks=JSON.parse(d.before); selected=blocks.find(b=>b.id===d.id)?.id ?? null; render(); return; }
  const result=E.move(blocks,d.id,d.dx,d.dy,cols,rows);
  if(result) { remember(d.before); blocks=result.blocks; const n=blocks.find(b=>b.id===d.id).cells.length; say(result.joined ? `Together! You made ${n}.` : mode==='split' ? 'One square moved away. Try making a new number!' : `Moved ${n}. What could it join?`); }
  else { blocks=JSON.parse(d.before); selected=null; say('That space is occupied or outside the grid. Try another spot.'); }
  render();
}
board.addEventListener('pointerup',()=>finish());
board.addEventListener('pointercancel',()=>finish(true));
board.addEventListener('lostpointercapture',()=>finish(true));
board.setAttribute('tabindex','0');
board.addEventListener('keydown',event=>{
  if(event.key==='Escape') { finish(true); return; }
  const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
  if(!directions[event.key] || selected===null || drag) return;
  event.preventDefault(); const result=E.move(blocks,selected,...directions[event.key],cols,rows);
  if(result) { remember(); blocks=result.blocks; say(result.joined?'Numbers joined!':'Number moved.'); render(); }
});
for(const m of ['move','split']) $(m).onclick=()=>setMode(m);
$('add').onclick=()=>{
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
    const cell={x,y};
    if(!blocks.some(b=>b.cells.some(c=>E.same(c,cell)))) { remember(); const id=nextId++; blocks.push({id,cells:[cell]}); blocks=E.move(blocks,id,0,0,cols,rows).blocks; selected=id; render(); say('Added one. Drag it wherever you like!'); return; }
  }
  say('The grid is full. Clear some space or start over.');
};
$('undo').onclick=()=>{ if(history.length) { blocks=JSON.parse(history.pop()); selected=null; render(); say('Undone. Try a different idea.'); } };
$('reset').onclick=()=>{ remember(); start(); };
$('clear').onclick=()=>{ if(blocks.length) remember(); blocks=[]; selected=null; render(); say('A fresh grid. Add a one to get started.'); };
start();


