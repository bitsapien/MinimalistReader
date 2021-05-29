const range = (size, set) => {
  if (!set.size) {
    return [0, 10];
  }
  const offset = 5;
  const min = _min(set) - offset;
  const max = _max(set);
  const from = min >= 0 ? min : 0;
  const to = max < size ? max : size - 1;
  return [from, to];
};

const _min = (set) => Math.min(...Array.from(set.values()));
const _max = (set) => Math.min(...Array.from(set.values()));

export default range;