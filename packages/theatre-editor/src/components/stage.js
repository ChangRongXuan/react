import FontElement from './elements/font';
import ImageElement from './elements/image';
import BackgroundElement from './elements/background';
import VideoElement from './elements/video';
import BgVideoElement from './elements/bgVideo';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  margin: auto;
`;

export default function Stage({
  objData,
  sheet,
  stageSize,
  draggable,
  setIsLoading = () => {},
  setLoadedMedias = () => {},
  setHasMediaError = () => {},
}) {
  const handleOnLoad = () => {
    setLoadedMedias((prev) => prev + 1);
  };

  const handleOnError = () => {
    setHasMediaError(true);
  };

  const fontElements = objData
    .filter((data) => data.type === 'FONT')
    .map((data) => {
      return (
        <FontElement
          key={'font' + data.id}
          id={data.id}
          sheet={sheet}
          stageSize={stageSize}
          draggable={draggable}
        />
      );
    });

  const imageElements = objData
    .filter((data) => data.type === 'IMAGE')
    .map((data) => {
      return (
        <ImageElement
          key={'image' + data.id}
          id={data.id}
          sheet={sheet}
          stageSize={stageSize}
          draggable={draggable}
          onLoad={handleOnLoad}
          onError={handleOnError}
        />
      );
    });

  const bgElements = objData
    .filter((data) => data.type === 'BACKGROUND')
    .map((data) => {
      return (
        <BackgroundElement
          key={'background' + data.id}
          id={data.id}
          sheet={sheet}
          stageSize={stageSize}
          draggable={draggable}
          onLoad={handleOnLoad}
          onError={handleOnError}
        />
      );
    });

  const videoElements = objData
    .filter((data) => data.type === 'VIDEO')
    .map((data) => {
      return (
        <VideoElement
          key={'video' + data.id}
          id={data.id}
          source={data.src}
          sheet={sheet}
          stageSize={stageSize}
          draggable={draggable}
          onLoad={handleOnLoad}
          onError={handleOnError}
        />
      );
    });

  const bgVideoElements = objData
    .filter((data) => data.type === 'BGVIDEO')
    .map((data) => {
      return (
        <BgVideoElement
          key={'bgVideo' + data.id}
          id={data.id}
          source={data.src}
          sheet={sheet}
          stageSize={stageSize}
          draggable={draggable}
          onLoad={handleOnLoad}
          onError={handleOnError}
          setIsLoading={setIsLoading}
        />
      );
    });

  return (
    <Wrapper id='theatre-stage'>
      {fontElements}
      {imageElements}
      {bgElements}
      {videoElements}
      {bgVideoElements}
    </Wrapper>
  );
}
