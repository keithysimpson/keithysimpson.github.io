const E = BlockEngine, board = document.querySelector('#board');
const cols = 10, rows = 10, size = 60;
const colours = BlockColours;
let blocks = [], nextId = 1, mode = 'move', selected = null, drag = null, cutStroke = null, history = [];
const $ = id => document.getElementById(id);
const snapshot = () => JSON.stringify(blocks);
const storageKey = 'little-numbers.board.v1';
function saveBoard() {
  try { localStorage.setItem(storageKey, JSON.stringify({version:1, blocks})); }
  catch { /* Keep the playground usable when browser storage is unavailable. */ }
}
function restoreBoard() {
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey));
    if(!saved || saved.version!==1 || !Array.isArray(saved.blocks) || saved.blocks.length>cols*rows) return false;
    const occupied=new Set();
    const restored=[];
    for(const block of saved.blocks) {
      if(!block || !Array.isArray(block.cells) || !block.cells.length || block.cells.length>cols*rows) return false;
      const cells=[];
      for(const cell of block.cells) {
        if(!cell || !Number.isInteger(cell.x) || !Number.isInteger(cell.y) || cell.x<0 || cell.y<0 || cell.x>=cols || cell.y>=rows) return false;
        const key=`${cell.x},${cell.y}`;
        if(occupied.has(key)) return false;
        occupied.add(key); cells.push({x:cell.x,y:cell.y});
      }
      if(E.components(cells).length!==1) return false;
      restored.push({id:restored.length+1,cells});
    }
    blocks=restored; nextId=blocks.length+1;
    return true;
  } catch { return false; }
}
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
function overTrash(event) {
  if(!event || !$('trash').getBoundingClientRect) return false;
  const r=$('trash').getBoundingClientRect();
  return event.clientX>=r.left && event.clientX<=r.right && event.clientY>=r.top && event.clientY<=r.bottom;
}
function gridVertex(event) {
  const p=point(event);
  return {x:Math.max(0,Math.min(cols,Math.round(p.x/size))),y:Math.max(0,Math.min(rows,rows-Math.round(p.y/size)))};
}
function extendCut(event) {
  const target=gridVertex(event), path=cutStroke.path;
  let last=path[path.length-1];
  // Fill skipped pointer samples with unit grid edges, never diagonals.
  while(!E.same(last,target)) {
    const dx=target.x-last.x, dy=target.y-last.y;
    last=Math.abs(dx)>=Math.abs(dy) ? {x:last.x+Math.sign(dx),y:last.y} : {x:last.x,y:last.y+Math.sign(dy)};
    path.push(last);
  }
}
function finishCut(cancelled=false,event) {
  if(!cutStroke) return;
  if(event && event.pointerId!==cutStroke.pointerId) return;
  if(event && !cancelled) extendCut(event);
  const path=cutStroke.path; cutStroke=null;
  if(!cancelled) {
    const equations=[];
    const result=blocks.flatMap(block=>{
      const groups=E.cut(block.cells,path);
      if(groups.length===1) return [block];
      equations.push(`${block.cells.length} = ${groups.map(c=>c.length).join(' + ')}`);
      return groups.map(cells=>({id:nextId++,cells}));
    });
    if(equations.length) { remember(); blocks=result; selected=null; saveBoard(); say(equations.join('\n')); }
    else say('No cut — draw all the way across a block to separate it.');
  }
  render();
}
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
  if(cutStroke) {
    const points=cutStroke.path.map(p=>`${p.x*size},${(rows-p.y)*size}`).join(' ');
    html+=`<polyline points="${points}" fill="none" stroke="#e02020" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>`;
    const tip=cutStroke.path[cutStroke.path.length-1];
    html+=`<circle cx="${tip.x*size}" cy="${(rows-tip.y)*size}" r="5" fill="#e02020" pointer-events="none"/>`;
  }
  board.innerHTML = html;
  $('undo').disabled = !history.length;
}
function start() { blocks = [{ id: nextId++, cells: [{x:1,y:1}] },{ id: nextId++, cells: [{x:1,y:3}] }]; selected=null; saveBoard(); render(); say(''); }
function setMode(value) { finish(true); mode=value; board.classList.toggle('cut-mode',mode==='cut'); say(mode==='cut' ? 'Draw along grid lines to separate a block.' : ''); for (const m of ['move','split','cut']) { $(m).classList.toggle('active',m===mode); $(m).setAttribute('aria-pressed',String(m===mode)); } }
board.addEventListener('pointerdown', event => {
  if (drag || cutStroke || sourceDrag || event.button !== 0) return;
  if(mode==='cut') {
    event.preventDefault(); board.focus(); selected=null;
    cutStroke={pointerId:event.pointerId,path:[gridVertex(event)]};
    board.setPointerCapture(event.pointerId); render(); return;
  }
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
  if(cutStroke) { if(event.pointerId===cutStroke.pointerId) { extendCut(event); render(); } return; }
  if(!drag) return;
  $('trash').classList.toggle('over',overTrash(event));
  const p=point(event); drag.dx=Math.round((p.x-drag.start.x)/size); drag.dy=-Math.round((p.y-drag.start.y)/size); render();
});
function finish(cancelled=false, event) {
  if(cutStroke) { finishCut(cancelled,event); return; }
  if(!drag) return;
  const d=drag; drag=null;
  $('trash').classList.toggle('over',false);
  if(!cancelled && overTrash(event)) {
    remember(d.before); blocks=blocks.filter(b=>b.id!==d.id);
    selected=null; saveBoard(); render(); say('Block removed'); return;
  }
  if(cancelled || (!d.dx && !d.dy)) { blocks=JSON.parse(d.before); selected=blocks.find(b=>b.id===d.id)?.id ?? null; render(); return; }
  const result=E.move(blocks,d.id,d.dx,d.dy,cols,rows);
  if(result) {
    remember(d.before);
    const equations=[];
    if(d.splitFrom && d.remainderIds.every(id=>result.blocks.some(b=>b.id===id))) {
      const remaining=d.remainderIds.map(id=>result.blocks.find(b=>b.id===id).cells.length);
      equations.push(`${d.splitFrom} - 1 = ${remaining.join(' + ')}`);
    }
    const sum=addition(blocks,result,d.id);
    if(sum) equations.push(sum);
    blocks=result.blocks;
    saveBoard();
    if(equations.length) say(equations.join('\n'));
  }
  else { blocks=JSON.parse(d.before); selected=null; }
  render();
}
board.addEventListener('pointerup',event=>finish(false,event));
board.addEventListener('pointercancel',()=>finish(true));
board.addEventListener('lostpointercapture',()=>finish(true));
board.setAttribute('tabindex','0');
board.addEventListener('keydown',event=>{
  if(event.key==='Escape') { finish(true); return; }
  const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
  if(!directions[event.key] || selected===null || drag || cutStroke) return;
  event.preventDefault(); const result=E.move(blocks,selected,...directions[event.key],cols,rows);
  if(result) { remember(); const sum=addition(blocks,result,selected); blocks=result.blocks; saveBoard(); if(sum) say(sum); render(); }
});
for(const m of ['move','split','cut']) $(m).onclick=()=>setMode(m);
function addOne(cell) {
  if(cell.x<0 || cell.y<0 || cell.x>=cols || cell.y>=rows || blocks.some(b=>b.cells.some(c=>E.same(c,cell)))) return false;
  remember(); const id=nextId++; blocks.push({id,cells:[cell]});
  const result=E.move(blocks,id,0,0,cols,rows), sum=addition(blocks,result,id);
  blocks=result.blocks; saveBoard(); selected=id; render(); say(sum); return true;
}
let sourceDrag=null, suppressAddClick=false;
$('add').addEventListener('pointerdown',event=>{
  if(event.button!==0 || sourceDrag || drag || cutStroke) return;
  suppressAddClick=false;
  sourceDrag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
  $('add').setPointerCapture(event.pointerId);
});
$('add').addEventListener('pointermove',event=>{
  if(!sourceDrag || event.pointerId!==sourceDrag.pointerId) return;
  if(Math.hypot(event.clientX-sourceDrag.x,event.clientY-sourceDrag.y)>6) sourceDrag.moved=true;
  if(!sourceDrag.moved) return;
  const ghost=$('one-preview'); ghost.innerHTML=$('add').innerHTML; ghost.hidden=false;
  ghost.style.left=`${event.clientX}px`; ghost.style.top=`${event.clientY}px`;
});
function finishSource(event,cancelled=false) {
  if(!sourceDrag || (event.pointerId!==undefined && event.pointerId!==sourceDrag.pointerId)) return;
  const moved=sourceDrag.moved; sourceDrag=null; $('one-preview').hidden=true;
  suppressAddClick=moved || cancelled;
  if(moved && !cancelled) addOne(cellAt(point(event)));
}
$('add').addEventListener('pointerup',event=>finishSource(event));
$('add').addEventListener('pointercancel',event=>finishSource(event,true));
$('add').addEventListener('lostpointercapture',event=>finishSource(event,true));
$('add').addEventListener('keydown',event=>{
  if(event.key==='Escape' && sourceDrag) finishSource(event,true);
});
$('add').onclick=()=>{
  if(suppressAddClick) { suppressAddClick=false; return; }
  finish(true);
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
    const cell={x,y};
    if(addOne(cell)) return;
  }

};
$('undo').onclick=()=>{ finish(true); if(history.length) { blocks=JSON.parse(history.pop()); saveBoard(); selected=null; render(); say(''); } };
$('clear').onclick=()=>{ finish(true); if(blocks.length) remember(); blocks=[]; saveBoard(); selected=null; render(); say(''); };
if(restoreBoard()) render();
else start();


