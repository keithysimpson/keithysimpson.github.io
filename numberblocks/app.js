const E = BlockEngine, board = document.querySelector('#board');
const cols = 10, rows = 10, size = 60;
const colours = BlockColours;
let blocks = [], nextId = 1, mode = 'move', selected = null, drag = null, history = [];
const $ = id => document.getElementById(id);
const snapshot = () => JSON.stringify(blocks);
function remember(value = snapshot()) { history.push(value); if (history.length > 80) history.shift(); }
function say(text) { $('message').textContent = text; }
function addition(before, result, id) {
  if (!result.joined) return '';
  const source = before.find(b => b.id === id);
  const absorbed = before.filter(b => b.id !== id && !result.blocks.some(after => after.id === b.id));
  return `${[source.cells.length, ...absorbed.map(b => b.cells.length)].join(' + ')} = ${result.blocks.find(b => b.id === id).cells.length}`;
}
function point(event) { const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(board.getScreenCTM().inverse()); return { x: p.x, y: p.y }; }
function cellAt(p) { return { x: Math.floor(p.x / size), y: rows - 1 - Math.floor(p.y / size) }; }
function render() {
  let html = '<defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#dde5d8" stroke-width="1.5"/><circle cx="0" cy="0" r="2" fill="#c7d4c0"/></pattern></defs><rect width="600" height="600" fill="url(#grid)"/>';
  const ordered = blocks.slice().sort((a,b) => Number(a.id === drag?.id) - Number(b.id === drag?.id));
  for (const b of ordered) {
    const active = drag?.id === b.id, dx = active ? drag.dx * size : 0, dy = active ? -drag.dy * size : 0;
    const cells = colours.orderedCells(b.cells);
    html += `<g class="block" data-id="${b.id}" transform="translate(${dx} ${dy})" opacity="${active ? '.78' : '1'}">`;
    for (const [index, c] of cells.entries()) {
      const color = colours.cellStyle(cells.length, index);
      const x = c.x * size, y = (rows - 1 - c.y) * size;
      html += `<rect class="cell" x="${x+3}" y="${y+3}" width="54" height="54" rx="10" fill="${color.fill}" stroke="${color.stroke}" style="stroke-width:3"/><path d="M${x+12} ${y+10} H${x+45}" stroke="#ffffff65" stroke-width="3" stroke-linecap="round"/>`;
      if (selected === b.id) html += `<rect x="${x+7}" y="${y+7}" width="46" height="46" rx="7" fill="none" stroke="#253b37" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    }
    const anchor = b.cells.slice().sort((a,b) => b.y-a.y || a.x-b.x)[0];
    const x = anchor.x*size+30, y = (rows-1-anchor.y)*size;
    html += `<text class="label" text-anchor="middle" x="${x}" y="${y+31}">${b.cells.length}</text><circle class="eye" cx="${x-7}" cy="${y+41}" r="2.5"/><circle class="eye" cx="${x+7}" cy="${y+41}" r="2.5"/><path d="M${x-4} ${y+47} Q${x} ${y+51} ${x+4} ${y+47}" stroke="#253b37" stroke-width="2" fill="none"/></g>`;
  }
  board.innerHTML = html;
  $('undo').disabled = !history.length;
}
function start() { blocks = [{ id: nextId++, cells: [{x:1,y:1}] },{ id: nextId++, cells: [{x:1,y:3}] }]; selected=null; render(); say(''); }
function setMode(value) { mode=value; for (const m of ['move','split']) { $(m).classList.toggle('active',m===mode); $(m).setAttribute('aria-pressed',String(m===mode)); } }
board.addEventListener('pointerdown', event => {
  if (drag || event.button !== 0) return;
  const p=point(event), c=cellAt(p), block=blocks.find(b=>b.cells.some(o=>E.same(c,o)));
  if (!block) { selected=null; render(); return; }
  event.preventDefault(); board.focus();
  const before=snapshot(); let id=block.id, splitFrom=null, remainderIds=[];
  if(mode==='split' && block.cells.length>1) {
    splitFrom=block.cells.length;
    blocks=blocks.filter(b=>b.id!==id);
    const remainder=E.components(block.cells.filter(o=>!E.same(c,o))).map(cells=>({id:nextId++,cells}));
    remainderIds=remainder.map(b=>b.id); blocks.push(...remainder);
    id=nextId++; blocks.push({id,cells:[c]});
  }
  selected=id; drag={id,start:p,dx:0,dy:0,before,splitFrom,remainderIds}; board.setPointerCapture(event.pointerId); render();
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
  if(result) {
    remember(d.before);
    const equations=[];
    if(d.splitFrom && d.remainderIds.every(id=>result.blocks.some(b=>b.id===id))) equations.push(`${d.splitFrom} - 1 = ${d.splitFrom-1}`);
    const sum=addition(blocks,result,d.id);
    if(sum) equations.push(sum);
    blocks=result.blocks;
    if(equations.length) say(equations.join('\n'));
  }
  else { blocks=JSON.parse(d.before); selected=null; }
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
  if(result) { remember(); const sum=addition(blocks,result,selected); blocks=result.blocks; if(sum) say(sum); render(); }
});
for(const m of ['move','split']) $(m).onclick=()=>setMode(m);
$('add').onclick=()=>{
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
    const cell={x,y};
    if(!blocks.some(b=>b.cells.some(c=>E.same(c,cell)))) { remember(); const id=nextId++; blocks.push({id,cells:[cell]}); const result=E.move(blocks,id,0,0,cols,rows); const sum=addition(blocks,result,id); blocks=result.blocks; selected=id; render(); if(sum) say(sum); return; }
  }

};
$('undo').onclick=()=>{ if(history.length) { blocks=JSON.parse(history.pop()); selected=null; render(); say(''); } };
$('reset').onclick=()=>{ remember(); start(); };
$('clear').onclick=()=>{ if(blocks.length) remember(); blocks=[]; selected=null; render(); say(''); };
start();


