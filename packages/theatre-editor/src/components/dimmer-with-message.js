import React from 'react';
import { Transition } from 'react-transition-group';
import styled, { keyframes, css } from 'styled-components';

const transitionDuration = {
  enter: 200,
  exit: 200,
};

const textAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: .4;
  }
`;

const Dimmer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
`;

const Container = styled.div`
  z-index: 100000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  opacity: ${(props) => {
    switch (props.$state) {
      case 'exited':
      case 'exiting': {
        return '0';
      }
      case 'entering':
      case 'entered':
      default: {
        return '1';
      }
    }
  }};
  transition: ${(props) => {
    switch (props.$state) {
      case 'exiting':
      case 'exited': {
        return `opacity ${transitionDuration.exit}ms ease`;
      }
      case 'entering':
      case 'entered':
      default: {
        return `opacity ${transitionDuration.enter}ms ease`;
      }
    }
  }};
`;

const Text = styled.div`
  text-align: center;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  position: absolute;
  font-size: 1.8rem;
  width: 69%;
  @media screen and (max-width: 767px) {
    font-size: 1.5rem;
  }
  font-weight: bold;
  color: #fff;
  ${(props) =>
    props.$shining
      ? css`
          opacity: 1;
          will-change: opacity;
          animation: ${textAnimation} 0.65s ease-in-out;
          animation-direction: alternate;
          animation-iteration-count: infinite;
        `
      : ''}
`;

/**
 *  @typedef {Object} Dimmer
 *  @property {boolean} show
 *  @property {string} message
 *  @property {boolean} shining
 */
/**
 *  @param {Dimmer} props
 *  @returns {React.ReactElement}
 */
export default function DimmerWithMessage({
  show = false,
  message = '',
  shining = false,
}) {
  return (
    <Transition unmountOnExit in={show} timeout={transitionDuration}>
      {(state) => (
        <Container $state={state}>
          <Dimmer />
          <Text $shining={shining}>{message}</Text>
        </Container>
      )}
    </Transition>
  );
}
