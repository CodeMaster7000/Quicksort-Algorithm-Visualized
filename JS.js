const data = d3.range(60).reverse();
for (let i = data.length; i; i--) {
  let j = Math.floor(Math.random() * i);
  [data[i - 1], data[j]] = [data[j], data[i - 1]];
}
let toSort = [[0, data.length - 1]];
let sorting;
let pivot;
let l, r;
function iterate() {
  if (!sorting) {
    if (!toSort.length) {
      return;
    }  
    sorting = toSort.shift();
    pivot = sorting[0] + Math.floor((sorting[1] - sorting[0]) * Math.random());
    
    l = sorting[0];
    r = sorting[1];
  }
  if (l === r) {
    if (pivot - 1 - sorting[0] > 0) {
      toSort.push([sorting[0], pivot - 1]);
    }   
    if (sorting[1] - (pivot + 1) > 0) {
      toSort.push([pivot + 1, sorting[1]]);
    }    
    l = r = sorting = pivot = undefined;   
    iterate();
    return;
  } 
  if (data[l] < data[pivot]) {
    l++;
    return;
  }
  if (data[r] > data[pivot]) {
    r--;
    return;
  }
  [data[l], data[r]] = [data[r], data[l]];
  if (pivot === l) {
    pivot = r;
  } else if (pivot === r) {
    pivot = l;
  }
}
const svg = d3.select('svg');
const width = svg.attr('width');
const height = svg.attr('height');
const xScale = d3.scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([50, width - 5])
  .paddingInner(0.5);
const yScale = d3.scaleLinear()
  .domain(d3.extent(data))
  .range([30, height - 30]);
function hslScale(t) {
  return d3.hsl(t / data.length * 270, 1, .5);
}
svg.selectAll('rect')
  .data(data, (d) => d)
  .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i))
    .attr('y', (d) => height - 10 - yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => yScale(d));
setInterval(function () {
  iterate();
  svg.selectAll('rect')
    .data(data, (d) => d)
    .classed('active', (d, i) => sorting && (i >= sorting[0] && i <= sorting[1]))
    .classed('pivot', (d, i) => i === pivot)
    .classed('highlight', (d, i) => i === r || i === l)
    .classed('completed', (d, i) => isCompleted(i))
    .transition()
    .duration(100)
    .attr('x', (d, i) => xScale(i));
}, 100);
function isCompleted(i) {
  if (!sorting && !toSort.length) {
    return true;
  }
  return [sorting].concat(toSort).every(([l, r]) => i < l || r < i);
}
