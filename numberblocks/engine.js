(function (root) {
  const adjacent = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
  const same = (a, b) => a.x === b.x && a.y === b.y;
  function components(cells) {
    const remaining = cells.slice(), groups = [];
    while (remaining.length) {
      const group = [remaining.pop()];
      for (let i = 0; i < group.length; i++) {
        for (let j = remaining.length - 1; j >= 0; j--) {
          if (adjacent(group[i], remaining[j])) group.push(remaining.splice(j, 1)[0]);
        }
      }
      groups.push(group);
    }
    return groups;
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
  const api = { adjacent, same, components, move };
  if (typeof module !== 'undefined') module.exports = api;
  else root.BlockEngine = api;
})(globalThis);
