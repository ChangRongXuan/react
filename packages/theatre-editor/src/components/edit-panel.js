import React, { useState } from 'react';
import styled from 'styled-components';
import ElementButtons from './button/element-button';
import SettingButtons from './button/setting-button';
import JSONLightBox from './lightbox/show-json';
import DeleteLightBox from './lightbox/delete-obj';
import VideoLightBox from './lightbox/add-video';
import BgVideoLightBox from './lightbox/add-bg-video';

const LightBoxWrapper = styled.div`
  position: relative;
  z-index: 999999;
`;

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  z-index: 100;
`;

export default function EditPanel({ sheet, setObjData, objData }) {
  //Lightbox
  const [showJSONLightBox, setShowJSONLightBox] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [showVideoBox, setShowVideoBox] = useState(false);
  const [showBgVideoBox, setShowBgVideoBox] = useState(false);

  //JSON data
  const [animateJSON, setAnimateJSON] = useState({}); // 存在 storage 的 objData

  return (
    <>
      <LightBoxWrapper id='lightbox-wrapper'>
        {showJSONLightBox && (
          <JSONLightBox
            setShowJSONLightBox={setShowJSONLightBox}
            animateJSON={animateJSON}
            objData={objData}
            setObjData={setObjData}
          />
        )}

        {showDeleteBox && (
          <DeleteLightBox
            objData={objData}
            setObjData={setObjData}
            setShowDeleteBox={setShowDeleteBox}
            sheet={sheet}
          />
        )}

        {showVideoBox && (
          <VideoLightBox
            objData={objData}
            setObjData={setObjData}
            setShowVideoBox={setShowVideoBox}
          />
        )}

        {/* 背景影片 src */}
        {showBgVideoBox && (
          <BgVideoLightBox
            objData={objData}
            setObjData={setObjData}
            setShowVideoBox={setShowBgVideoBox}
          />
        )}
      </LightBoxWrapper>

      <ButtonWrapper>
        <SettingButtons
          setShowJSONLightBox={setShowJSONLightBox}
          setAnimateJSON={setAnimateJSON}
          sheet={sheet}
        />
        <ElementButtons
          setShowDeleteBox={setShowDeleteBox}
          setObjData={setObjData}
          objData={objData}
          setShowVideoBox={setShowVideoBox}
          setShowBgVideoBox={setShowBgVideoBox}
        />
      </ButtonWrapper>
    </>
  );
}
