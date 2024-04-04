import studio from '@theatre/studio';
import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import useDrag from '../../hooks/use-drag';
import { initialConfig } from '../../constants';

const FontWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  transform-origin: center;
  box-sizing: border-box;
`;

export default function FontElement({
  id,
  sheet,
  stageSize,
  draggable = true,
}) {
  const object = sheet.object(id, {
    ...initialConfig.FONT,
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
  const [content, setContent] = useState('');

  useEffect(() => {
    object.onValuesChange((newValue) => {
      setContent(newValue.content);
      setStyle({
        left: `${newValue.position.x}%`,
        top: `${newValue.position.y}%`,
        background: `${newValue.bgColor}`,
        color: `${newValue.font.color}`,
        opacity: ` ${newValue.opacity}`,
        padding: `${newValue.padding}px`,
        display: `${newValue.visible ? 'block' : 'none'}`,
        width: `${newValue.size.width}px`,
        fontSize: `${newValue.font.size}px`,
        borderRadius: `${newValue.border.radius}px`,
        border: `${newValue.border.size}px solid ${newValue.border.color}`,
        fontWeight: `${newValue.font.weight}`,
        letterSpacing: `${newValue.font.spacing}px`,
        lineHeight: `${newValue.lineHeight}px`,
        textAlign: `${newValue.textAlign}`,
        zIndex: `${newValue.zIndex}`,
        transform: `scale(${newValue.scale}) translate(-50%, -50%)`,
      });
    });
  }, [object]);

  return (
    <FontWrapper
      onClick={() => {
        studio.setSelection([object]);
      }}
      ref={setDivRef}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
