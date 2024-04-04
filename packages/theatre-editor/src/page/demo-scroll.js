import studio from '@theatre/studio';
import { val, getProject } from '@theatre/core';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Stage from '../components/stage';
import Dimmer from '../components/dimmer-with-message';

const ScrollSizer = styled.div`
  position: relative;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  background: #ffffff;
`;

const StickyBox = styled.div`
  width: 100%;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const defaultScrollScale = 1500;

export default function DemoScroll() {
  studio.initialize();
  studio.ui.hide();
  const project = getProject('Project', {});
  const sheet = project.sheet('Scene', 'default');
  project.ready.then(() => sheet.sequence.pause());

  // --------------------------

  const objJson = localStorage.getItem('theatre-data'); // get objectJSON in localStorage
  const objData = objJson ? JSON.parse(objJson) : [];

  // --------------------------

  // TODO: 增加條件，減少 event-listener 偵測時間

  const [scrollPosition, setScrollPosition] = useState(0);

  const sequenceLength = val(sheet.sequence.pointer.length);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const stage = stageRef.current;
      const sizer = stage.closest('.theatre-scroll-sizer');

      const stageRect = stage.getBoundingClientRect();
      const sizerRect = sizer.getBoundingClientRect();

      const distance = stageRect.top - sizerRect.top;
      setScrollPosition(distance);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const newPosition =
      (scrollPosition / (sequenceLength * defaultScrollScale)) * sequenceLength;
    sheet.sequence.position = newPosition;
  }, [scrollPosition]);

  // ----------------------------

  // handle error: image & background & video & bgVideo
  const [hasMediaError, setHasMediaError] = useState(false);
  // handle loading: image & background & video & bgVideo
  const [loadedMedias, setLoadedMedias] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const totalMedias = objData.filter(
    (data) =>
      data.type === 'VIDEO' ||
      data.type === 'BGVIDEO' ||
      data.type === 'IMAGE' ||
      data.type === 'BACKGROUND'
  ).length;

  useEffect(() => {
    if (loadedMedias >= totalMedias) {
      setIsLoading(false);
    }
  }, [loadedMedias, totalMedias]);

  const sizerHeight =
    hasMediaError || isLoading
      ? '100vh'
      : `${sequenceLength * defaultScrollScale}px`;

  return (
    <ScrollSizer
      className='theatre-scroll-sizer'
      style={{ height: sizerHeight }}
    >
      <StickyBox ref={stageRef}>
        <Dimmer
          show={isLoading && !hasMediaError}
          message={'載入中'}
          shining={true}
        />
        <Dimmer
          show={hasMediaError}
          message={'載入失敗。請檢查您的網路連線，並重新整理瀏覽器。'}
        />
        <Stage
          objData={objData}
          sheet={sheet}
          stageWidth={window.innerWidth}
          draggable={false}
          setIsLoading={setIsLoading}
          setHasMediaError={setHasMediaError}
          setLoadedMedias={setLoadedMedias}
        />
      </StickyBox>
    </ScrollSizer>
  );
}
