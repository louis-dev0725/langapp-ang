export const onRandomFromRange = (min, max) => {
  return Math.floor(Math.random() * (max * 1000 - min * 1000 + 1) + min * 1000);
};
