(function (root) {
  const solid = ['#e53935', '#f28c18', '#ffda24', '#43ad4b', '#21c5df', '#5144b5', '#8c42b5', '#df329f', '#9299a1'];
  const pale = ['#ffffff', '#ffe0b5', '#fff3ad', '#ccebc7', '#c8f2fa', '#dad6f3', '#ead5f4', '#fad1e9', '#e4e6e9'];

  function cellStyle(total, index) {
    if (total === 100) return { fill: '#bd6669', stroke: '#681f32' };
    const tens = Math.floor(total / 10), tensCells = tens * 10;
    if (index < tensCells) {
      const colour = tens === 7 ? Math.floor(index / 10) : tens - 1;
      return { fill: tens === 7 && colour === 0 ? '#f7c9c7' : pale[colour], stroke: solid[colour] };
    }
    const units = total % 10;
    const colour = units === 7 ? index - tensCells : units - 1;
    return { fill: solid[colour], stroke: '#ffffff' };
  }

  // Count across each row from the bottom, independent of merge history.
  const orderedCells = cells => cells.slice().sort((a, b) => a.y - b.y || a.x - b.x);
  const api = { cellStyle, orderedCells };
  if (typeof module !== 'undefined') module.exports = api;
  else root.BlockColours = api;
})(globalThis);
