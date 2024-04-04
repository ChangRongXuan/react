import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 5px;
  background: rgba(255, 255, 255, 0.95);
  max-width: 120px;
  border-radius: 10px;
  margin: 10px 0 10px 10px;
  outline: 2px solid #e9e9e9;

  button {
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    background: #e9e9e9;
    border: none;
    border-radius: 5px;
  }
`;

const buttons = [
  {
    label: 'clear JSON',
    onClick: () => {
      const confirmation = confirm('將清空 project 所有資料');

      if (confirmation) {
        localStorage.removeItem('theatre-data');
        localStorage.removeItem('theatre-0.4.persistent');
        window.location.reload();
      } else {
        return;
      }
    },
  },

  {
    label: 'show JSON',
    onClick: ({ setShowJSONLightBox, setAnimateJSON }) => {
      const animate = localStorage.getItem('theatre-0.4.persistent');

      const animateState =
        JSON.parse(animate)?.historic?.innerState?.coreByProject?.Project ?? {};

      setAnimateJSON(animateState);
      setShowJSONLightBox(true);
    },
  },

  {
    label: 'Play',
    onClick: ({ sheet }) => {
      sheet.sequence.play();
    },
  },
  {
    label: 'Pause',
    onClick: ({ sheet }) => {
      sheet.sequence.pause();
    },
  },
];

export default function SettingButtons({
  setShowJSONLightBox,
  setAnimateJSON,
  sheet,
}) {
  return (
    <Wrapper>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() =>
            button.onClick({
              setShowJSONLightBox,
              setAnimateJSON,
              sheet,
            })
          }
        >
          {button.label}
        </button>
      ))}

      <Link to='/demo-scroll' target='_blank'>
        <button>Scroll</button>
      </Link>

      <Link to='/demo-video' target='_blank'>
        <button>Video</button>
      </Link>
    </Wrapper>
  );
}
