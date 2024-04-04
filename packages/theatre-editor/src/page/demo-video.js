import studio from '@theatre/studio';
import { getProject } from '@theatre/core';
import Stage from '../components/stage';
import Dimmer from '../components/dimmer-with-message';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const VideoWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default function DemoVideo() {
  studio.initialize();
  studio.ui.hide();
  const project = getProject('Project', {});
  const sheet = project.sheet('Scene', 'default');

  project.ready.then(() =>
    sheet.sequence.play({
      iterationCount: Infinity,
    })
  );

  const objJson = localStorage.getItem('theatre-data'); // get objectJSON in local-storage
  const objData = objJson ? JSON.parse(objJson) : [];

  // --------------------------

  const [hasMediaError, setHasMediaError] = useState(false); // image & background && video onError
  const [loadedMedias, setLoadedMedias] = useState(0); // image & background && video onload
  const [isLoading, setIsLoading] = useState(true);

  const totalMedias = objData.filter(
    (data) => data.type === 'IMAGE' || data.type === 'BACKGROUND'
  ).length;

  useEffect(() => {
    if (loadedMedias === totalMedias) {
      setIsLoading(false);
    }
  }, [loadedMedias, totalMedias]);

  return (
    <VideoWrapper>
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
        setHasMediaError={setHasMediaError}
        setLoadedMedias={setLoadedMedias}
      />
    </VideoWrapper>
  );
}
