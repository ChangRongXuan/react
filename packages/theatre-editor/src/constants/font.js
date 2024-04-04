import { types } from '@theatre/core';

export const FONT = {
  position: types.compound({
    x: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
    y: types.number(50, {
      nudgeMultiplier: 0.5,
    }),
  }),
  size: types.compound({
    width: types.number(200, {
      nudgeMultiplier: 1,
    }),
  }),
  bgColor: types.rgba({ r: 0, g: 0, b: 0, a: 1 }),
  font: types.compound({
    size: types.number(16, { nudgeMultiplier: 1 }),
    color: types.rgba({ r: 255, g: 255, b: 255, a: 1 }),
    weight: types.number(200, { range: [100, 900], nudgeMultiplier: 100 }),
    spacing: types.number(0.6, { range: [0, 500], nudgeMultiplier: 0.1 }),
  }),
  border: types.compound({
    size: types.number(0),
    color: types.rgba({ r: 0, g: 0, b: 0, a: 1 }),
    radius: types.number(4, {
      range: [0, 100],
      nudgeMultiplier: 1,
    }),
  }),
  content: types.string('請輸入文字'),
  opacity: types.number(1, {
    range: [0, 1],
    nudgeMultiplier: 0.05,
  }),
  padding: types.number(32, {
    range: [0, 1000],
    nudgeMultiplier: 1,
  }),
  visible: types.boolean(true),
  zIndex: types.stringLiteral('10', {
    bottom: '-10',
    0: '0',
    10: '10',
    100: '100',
    1000: '1000',
    10000: '10000',
  }),
  lineHeight: types.number(27, { range: [0, 1000], nudgeMultiplier: 1 }),
  textAlign: types.stringLiteral('justify', {
    center: 'center',
    left: 'left',
    right: 'right',
    justify: 'justify',
  }),
  scale: types.number(1, { nudgeMultiplier: 0.1 }),
};
