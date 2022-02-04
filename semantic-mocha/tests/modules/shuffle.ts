import { randomRange } from './randomRange';

export const shuffle = (list: number[]): number[] => {
  const copy = list.slice();

  const maxIndex = list.length - 1;
  copy.forEach((element, index) => {
    const randomIndex =
      index === maxIndex ? index : randomRange(index + 1, list.length - 1);
    const otherElement = copy[randomIndex];
    copy[index] = otherElement;
    copy[randomIndex] = element;
  });

  return copy;
};
