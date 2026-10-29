(function (root) {
  const adjacent = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  const same = (a, b) => a.x === b.x && a.y === b.y;
  function components(cells, connected = adjacent) {
    const remaining = cells.slice(), groups = [];
    while (remaining.length) {
      const group = [remaining.pop()];
      for (let i = 0; i < group.length; i++) {
        for (let j = remaining.length - 1; j >= 0; j--) {
          if (connected(group[i], remaining[j])) group.push(remaining.splice(j, 1)[0]);
        }
      }
      groups.push(group);
    }
    return groups;
  }
  const edgeKey = (a,b) => [ `${a.x},${a.y}`, `${b.x},${b.y}` ].sort().join('|');
  // Path vertices use the same bottom-left origin as cells.
  function cut(cells, path) {
    const edges = new Set();
    for(let i=1;i<path.length;i++) {
      if(adjacent(path[i-1],path[i])) edges.add(edgeKey(path[i-1],path[i]));
    }
    return components(cells,(a,b)=>{
      if(!adjacent(a,b)) return false;
      const x=Math.max(a.x,b.x), y=Math.max(a.y,b.y);
      const end=a.x===b.x ? {x:x+1,y} : {x,y:y+1};
      return !edges.has(edgeKey({x,y},end));
    });
  }
  function move(blocks, id, dx, dy, cols, rows) {
    const source = blocks.find(b => b.id === id);
    const cells = source.cells.map(c => ({ x: c.x + dx, y: c.y + dy }));
    const others = blocks.filter(b => b.id !== id);
    if (cells.some(c => c.x < 0 || c.y < 0 || c.x >= cols || c.y >= rows || others.some(b => b.cells.some(o => same(c, o))))) return null;
    let merged = true, count = 0;
    while (merged) {
      merged = false;
      for (let i = others.length - 1; i >= 0; i--) {
        if (others[i].cells.some(c => cells.some(o => adjacent(c, o)))) {
          cells.push(...others.splice(i, 1)[0].cells); merged = true; count++;
        }
      }
    }
    return { blocks: [...others, { id, cells }], joined: count };
  }
  const api = { adjacent, same, components, move, cut };
  if (typeof module !== 'undefined') module.exports = api;
  else root.BlockEngine = api;
})(globalThis);
