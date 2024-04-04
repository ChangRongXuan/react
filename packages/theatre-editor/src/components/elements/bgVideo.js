import studio from '@theatre/studio';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useDrag from '../../hooks/use-drag';
import { initialConfig } from '../../constants';

const BgVideo = styled.video`
  position: absolute;
  display: block;
  height: auto;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
`;

export default function BgVideoElement({
  id,
  sheet,
  source,
  stageSize,
  draggable = true,
  onLoad,
  onError,
  setIsLoading,
}) {
  const object = sheet.object(id, {
    ...initialConfig.BGVIDEO,
  });

  // Drag setting ----------------------
  const [divRef, setDivRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // Style setting ----------------------
  const [style, setStyle] = useState({});
  const [scrollSpeed, setScrollSpeed] = useState(2000);

  useEffect(() => {
    object.onValuesChange((newValue) => {
      setIsVisible(newValue.visible);
      setScrollSpeed(newValue.speed);
      setStyle({
        left: `${newValue.position.x}%`,
        top: `${newValue.position.y}%`,
        display: `${newValue.visible ? 'block' : 'none'}`,
        width: `${newValue.size.width}%`,
        height: `${newValue.size.height}%`,
        zIndex: `${newValue.zIndex}`,
        transform: `scale(${newValue.scale}) translate(-50%, -50%)`,
        opacity: `${newValue.opacity}`,
      });
    });
  }, [object]);

  const videoRef = useRef(null);

  const setMultipleRefs = (element) => {
    setDivRef(element);
    videoRef.current = element;
  };

  useEffect(() => {
    let initialScrollPos = 0;
    let videoDuration = 0;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollDistance = currentScrollPos - initialScrollPos;

      const scrollRatio = scrollDistance / scrollSpeed; //每滾動 scrollSpeed px 會播放 1s 影片

      let newTime;
      if (scrollDistance < 0) {
        newTime = Math.max(0, videoDuration + scrollRatio);
      } else {
        newTime = scrollRatio;
      }

      if (videoRef.current) {
        // videoRef.current.currentTime = Math.min(
        //   Math.max(newTime, 0),
        //   videoDuration
        // );

        videoRef.current.currentTime = newTime;
      }
    };

    if (isVisible) {
      initialScrollPos = window.scrollY;
      if (videoRef.current) {
        videoDuration = videoRef.current.duration || 0;
        videoRef.current.currentTime = 0;
      }
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, scrollSpeed]);

  // get buffer time ----------------------
  // const [bufferTime, setBufferTime] = useState(0);

  // useEffect(() => {
  //   const video = videoRef.current;

  //   const handleProgress = () => {
  //     const bufferedTimeRanges = video.buffered;
  //     if (bufferedTimeRanges.length > 0) {
  //       const bufferedTime = bufferedTimeRanges.end(
  //         bufferedTimeRanges.length - 1
  //       );
  //       setBufferTime(bufferedTime);
  //     }
  //   };

  //   if (video) {
  //     video.addEventListener('progress', handleProgress);

  //     return () => {
  //       video.removeEventListener('progress', handleProgress);
  //     };
  //   }
  // }, [videoRef]);

  // Loading setting ----------------------
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    // 由於 bufferTime > threshold 條件會導致 loading 過久，且在不同瀏覽器下會有持續載入中狀況，故暫時註解

    // let videoDuration = videoRef.current.duration || 0
    // let threshold = videoDuration / 4 > 10 ? 10 : videoDuration / 4

    // if (!isVideoLoading && bufferTime > threshold) {
    //   onLoad()
    // }

    if (!isVideoLoading) {
      onLoad();
      console.log('捲動式影片已載入');
    }
  }, [isVideoLoading, source]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = source;
      videoRef.current.load();
      setIsVideoLoading(true);
      setIsLoading(true);
    }
    console.log('執行捲動式影片更新');
  }, [source]);

  // onCanPlay: 瀏覽器已經可以播放，但沒有完全加載完成
  // onWaiting: 影片 buffer 不足導致暫停播放
  // onDurationChange: (1) 總時長被 browser 偵測到 (2) 影片總時長改變
  // onPlay: 按下播放鍵
  return (
    <BgVideo
      muted
      autoPlay={false}
      ref={setMultipleRefs}
      style={style}
      preload='auto'
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
      controls
    >
      <source src={source} />
    </BgVideo>
  );
}
