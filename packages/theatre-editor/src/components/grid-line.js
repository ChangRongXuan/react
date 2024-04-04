import React from 'react';
import styled from 'styled-components';

const gridColor = '#29e2f3';
const dashWidth = '2px';
const centerLineColor = 'red';

const Grid = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  z-index: 15000;

  background-image: repeating-linear-gradient(
      to right,
      ${gridColor} 0,
      ${gridColor} 0.5px,
      transparent 0.5px,
      transparent 49.5px
    ),
    repeating-linear-gradient(
      to right,
      ${gridColor} 0,
      ${gridColor} 0.5px,
      transparent 0.5px,
      transparent 99.5px
    ),
    repeating-linear-gradient(
      to bottom,
      ${gridColor} 0,
      ${gridColor} 0.5px,
      transparent 0.5px,
      transparent 49.5px
    ),
    repeating-linear-gradient(
      to bottom,
      ${gridColor} 0,
      ${gridColor} 0.5px,
      transparent 0.5px,
      transparent 99.5px
    );
  background-size: 100px 100px;
  background-repeat: repeat;
  background-position: 100% 100%;
  pointer-events: none;
  opacity: 0.5;

  // center-line-horizon
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: ${dashWidth};
    background-image: repeating-linear-gradient(
      to right,
      transparent,
      transparent 5px,
      ${centerLineColor} 5px,
      ${centerLineColor} 15px
    );
  }

  // center-line-vertical
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: ${dashWidth};
    height: 100%;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 5px,
      ${centerLineColor} 5px,
      ${centerLineColor} 15px
    );
  }
`;

export default function GridLine() {
  return <Grid />;
}
