import studio from '@theatre/studio';
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import useDrag from '../../hooks/use-drag';
import { initialConfig } from '../../constants';

const BgWrapper = styled.div`
  position: absolute;
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export default function BackgroundElement({
  id,
  sheet,
  stageSize,
  draggable = true,
  onLoad,
  onError,
}) {
  const object = sheet.object(id, {
    ...initialConfig.BACKGROUND,
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

  // Style setting ----------------------

  const [style, setStyle] = useState({});
  const [imageUrl, setImageUrl] = useState('/default-image.png');

  useEffect(() => {
    object.onValuesChange((newValue) => {
      setImageUrl(newValue.url);
      setStyle({
        left: `${newValue.position.x}%`,
        top: `${newValue.position.y}%`,
        width: `${newValue.size.width}%`,
        height: `${newValue.size.height}%`,
        borderRadius: `${newValue.border.radius}%`,
        border: `${newValue.border.size}px solid ${newValue.border.color}`,
        background: `${newValue.bgColor}`,
        opacity: `${newValue.opacity}`,
        display: `${newValue.visible ? 'block' : 'none'}`,
        transform: `scale(${newValue.scale}) translate(-50%, -50%)`,
        zIndex: `${newValue.zIndex}`,
      });
    });
  }, [object]);

  return (
    <BgWrapper
      onClick={() => {
        studio.setSelection([object]);
      }}
      ref={setDivRef}
      style={style}
    >
      <img
        src={imageUrl}
        alt={id}
        onLoad={onLoad}
        onError={(e) => {
          e.target.src = '/error-warning.png';
          onError();
        }}
      />
    </BgWrapper>
  );
}
