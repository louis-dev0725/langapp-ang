import * as fs from 'fs';

export function median(arr: number[]) {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

export async function isFileExists(file: string) {
  return fs.promises
    .access(file)
    .then(() => true)
    .catch(() => false);
}
