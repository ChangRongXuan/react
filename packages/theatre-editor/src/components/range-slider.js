import React from 'react';
import styled from 'styled-components';

const RangeBar = styled.div`
  position: fixed;
  left: 35px;
  bottom: ${(props) => (props.type === 'width' ? '200px' : '250px')};
  width: 220px;
  height: 20px;
  z-index: 100;

  input {
    position: absolute;
    top: 50%;
    z-index: 3;
    transform: translateY(-50%);
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    opacity: 0;
    margin: 0;
  }
`;

const Thumb = styled.div`
  width: 60px;
  height: 25px;
  border: 0.6px solid #303030;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #303030;
  z-index: 2;
  border-radius: 5%;
  cursor: pointer;
  user-select: none;
`;

const Line = styled.div`
  height: 4px;
  width: 100%;
  background-color: #e1e1e1;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  position: absolute;
  z-index: 1;

  .fill {
    position: absolute;
    height: 4px;
    background-color: #303030;
  }
`;

export default function RangeSlider({
  sliderValue,
  setSliderValue,
  type = 'width',
}) {
  let screenSize;
  if (type === 'width') {
    screenSize = window.innerWidth;
  } else if (type === 'height') {
    screenSize = window.innerHeight;
  }

  function handleChange(event) {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
  }

  return (
    <RangeBar type={type}>
      <Thumb style={{ left: (sliderValue / screenSize) * 200 + 'px' }}>
        {sliderValue} px
      </Thumb>
      <Line>
        <div
          className='fill'
          style={{ width: (sliderValue / screenSize) * 100 + '%' }}
        />
      </Line>
      <input
        type='range'
        value={sliderValue}
        min='250'
        max={screenSize}
        onChange={handleChange}
      />
    </RangeBar>
  );
}
