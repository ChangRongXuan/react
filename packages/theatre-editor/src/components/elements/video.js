import studio from '@theatre/studio';
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import useDrag from '../../hooks/use-drag';
import { initialConfig } from '../../constants';

const Video = styled.video`
  position: absolute;
  display: block;
  height: auto;
  box-sizing: border-box;

  /* hide controls on iOS */
  &::-webkit-media-controls-panel,
  &::-webkit-media-controls-play-button,
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
    -webkit-appearance: none !important;
  }
`;

export default function VideoElement({
  id,
  sheet,
  source,
  stageSize,
  draggable = true,
  onLoad,
  onError,
}) {
  const object = sheet.object(id, {
    ...initialConfig.VIDEO,
  });

  // Drag setting ----------------------
  const [divRef, setDivRef] = useState(null);

  const dragOpts = useMemo(() => {
    let scrub;
    let initial;
    let firstOnDragCalled = false;
    return {
      onDragStart() {
        scrub = studio.scrub();
        initial = object.value;
        firstOnDragCalled = false;
      },

      onDrag(x, y) {
        const percentX = (x / stageSize.width) * 100;
        const percentY = (y / stageSize.height) * 100;

        if (!firstOnDragCalled) {
          studio.setSelection([object]);
          firstOnDragCalled = true;
        }
        scrub.capture(({ set }) => {
          set(object.props, {
            ...initial,
            position: {
              x: percentX + initial.position.x,
              y: percentY + initial.position.y,
            },
          });
        });
      },
      onDragEnd(dragHappened) {
        if (dragHappened) {
          scrub.commit();
        } else {
          scrub.discard();
        }
      },
      lockCursorTo: 'move',
    };
  }, []);

  draggable && useDrag(divRef, dragOpts);

  // Video play/pause ----------------------
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  useEffect(() => {
    if (divRef && isPlaying) {
      divRef?.play();
    } else {
      divRef?.pause();
    }
  }, [isPlaying]);

  // Style setting ----------------------
  const [style, setStyle] = useState({});

  useEffect(() => {
    object.onValuesChange((newValue) => {
      setIsPlaying(newValue.isPlaying);
      setIsLoop(newValue.isLoop);
      setStyle({
        left: `${newValue.position.x}%`,
        top: `${newValue.position.y}%`,
        display: `${newValue.visible ? 'block' : 'none'}`,
        width: `${newValue.size.width}px`,
        height: `${newValue.size.height}px`,
        zIndex: `${newValue.zIndex}`,
        transform: `scale(${newValue.scale}) translate(-50%, -50%)`,
        opacity: `${newValue.opacity}`,
      });
    });
  }, [object]);

  // Loading setting ----------------------
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (!isVideoLoading) {
      onLoad();
    }
  }, [isVideoLoading]);

  return (
    <Video
      muted
      autoPlay={isPlaying}
      ref={setDivRef}
      style={style}
      preload='auto'
      loop={isLoop}
      playsInline={true}
      onClick={() => {
        studio.setSelection([object]);
      }}
      onWaiting={() => {
        setIsVideoLoading(true);
      }}
      onCanPlay={() => {
        setIsVideoLoading(false);
      }}
      onPlay={(e) => {
        e.target.pause();
      }}
      onEnded={(e) => {
        e.target.pause();
      }}
      onError={() => {
        onError();
        setIsVideoLoading(false);
      }}
    >
      <source src={source} />
    </Video>
  );
}
