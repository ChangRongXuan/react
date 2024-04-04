import studio from '@theatre/studio';
import { useState, useEffect } from 'react';
import Stage from '../components/stage';
import EditPanel from '../components/edit-panel';
import { getProject } from '@theatre/core';

import GridLine from '../components/grid-line';
import RangeSlider from '../components/range-slider';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  outline: 2px solid #29e2f3;
  margin: auto;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PanelWrapper = styled.div`
  z-index: 10;
`;

export default function Playground() {
  // Theatre.js initialize
  studio.initialize();
  const project = getProject('Project', {});
  const sheet = project.sheet('Scene', 'default');
  project.ready.then(() => sheet.sequence.pause());

  // Get objectJSON in local-storage
  const initialObjJson = localStorage.getItem('theatre-data');
  const initialObjData = initialObjJson ? JSON.parse(initialObjJson) : [];

  const [objData, setObjData] = useState(initialObjData);

  // Grid & Panel: keyboard shortcut setting
  const [showGrid, setShowGrid] = useState(true);
  const [showPanel, setShowPanel] = useState(true);

  studio.ui[showPanel ? 'restore' : 'hide']();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPanel(!showPanel);
      }
      if (event.key === 'Backquote' || event.key === '`') {
        setShowGrid(!showGrid);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // ------------------------

  const [widthSliderValue, setWidthSliderValue] = useState(window.innerWidth);
  const [heightSliderValue, setHeightSliderValue] = useState(
    window.innerHeight
  );

  return (
    <Wrapper>
      {showPanel && (
        <PanelWrapper>
          <EditPanel sheet={sheet} setObjData={setObjData} objData={objData} />
          <RangeSlider
            setSliderValue={setWidthSliderValue}
            sliderValue={widthSliderValue}
            type='width'
          />
          <RangeSlider
            setSliderValue={setHeightSliderValue}
            sliderValue={heightSliderValue}
            type='height'
          />
        </PanelWrapper>
      )}

      <EditArea
        style={{ maxWidth: widthSliderValue, maxHeight: heightSliderValue }}
      >
        <Stage
          objData={objData}
          sheet={sheet}
          stageSize={{ width: widthSliderValue, height: heightSliderValue }}
        />
        {showGrid && <GridLine />}
      </EditArea>
    </Wrapper>
  );
}
