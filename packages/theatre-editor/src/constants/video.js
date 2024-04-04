import { types } from '@theatre/core';

export const VIDEO = {
  position: types.compound({
    x: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
    y: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
  }),
  opacity: types.number(1, {
    range: [0, 1],
    nudgeMultiplier: 0.05,
  }),
  size: types.compound({
    width: types.number(300, {
      nudgeMultiplier: 0.5,
    }),
    height: types.number(200, {
      nudgeMultiplier: 0.5,
    }),
  }),
  visible: types.boolean(true),
  isPlaying: types.boolean(true),
  isLoop: types.boolean(false),
  scale: types.number(1, { nudgeMultiplier: 0.1 }),
  zIndex: types.stringLiteral('10', {
    bottom: '-10',
    0: '0',
    10: '10',
    100: '100',
    1000: '1000',
    10000: '10000',
  }),
};
