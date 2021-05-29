const range = (size, set) => {
  const offset = 5;
  const min = set.size ? _min(set) - offset : 0;
  const max = set.size ? _max(set) + offset : 10;
  const from = min >= 0 ? min : 0;
  const to = max < size ? max : size - 1;
  return [from, to];
};

const _min = (set) => Math.min(...Array.from(set.values()));
const _max = (set) => Math.max(...Array.from(set.values()));

export default range;