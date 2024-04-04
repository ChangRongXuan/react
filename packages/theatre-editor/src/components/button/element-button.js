import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 5px;
  background: rgba(255, 255, 255, 0.95);
  max-width: 120px;
  border-radius: 10px;
  margin: 10px;
  outline: 2px solid #e9e9e9;

  button {
    padding: 5px;
    background: white;
    margin: 5px;
    cursor: pointer;
    background: #e9e9e9;
    border: none;
    border-radius: 5px;
  }
`;

const buttons = [
  {
    label: 'BG',
    className: 'add-background',
    onClick: ({ addBgElement }) => {
      addBgElement();
    },
  },
  {
    label: 'Font',
    className: 'add-font',
    onClick: ({ addFontElement }) => {
      addFontElement();
    },
  },
  {
    label: 'Image',
    className: 'add-image',
    onClick: ({ addImageElement }) => {
      addImageElement();
    },
  },
  {
    label: 'Video',
    className: 'add-video',
    onClick: ({ setShowVideoBox }) => {
      setShowVideoBox(true);
    },
  },
  {
    label: 'BgVideo',
    className: 'add-bgVideo',
    onClick: ({ setShowBgVideoBox }) => {
      setShowBgVideoBox(true);
    },
  },
  {
    label: '刪除元件',
    className: 'delete-element',
    onClick: ({ setShowDeleteBox }) => {
      setShowDeleteBox(true);
    },
  },
];

export default function ElementButtons({
  setShowDeleteBox,
  objData,
  setObjData,
  setShowVideoBox,
  setShowBgVideoBox,
}) {
  const addFontElement = () => {
    const lastFontId = objData
      .filter((element) => element.type === 'FONT')
      .reduce((maxId, element) => {
        const idNumber = parseInt(element.id.split('-')[1]);
        return idNumber > maxId ? idNumber : maxId;
      }, 0);

    const nextFontId = `font-${String(lastFontId + 1).padStart(3, '0')}`;
    const updatedElementData = [...objData, { id: nextFontId, type: 'FONT' }];

    localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
    setObjData(updatedElementData);
  };

  const addImageElement = () => {
    const lastFontId = objData
      .filter((element) => element.type === 'IMAGE')
      .reduce((maxId, element) => {
        const idNumber = parseInt(element.id.split('-')[1]);
        return idNumber > maxId ? idNumber : maxId;
      }, 0);

    const nextFontId = `img-${String(lastFontId + 1).padStart(3, '0')}`;
    const updatedElementData = [...objData, { id: nextFontId, type: 'IMAGE' }];

    localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
    setObjData(updatedElementData);
  };

  const addBgElement = () => {
    const lastFontId = objData
      .filter((element) => element.type === 'BACKGROUND')
      .reduce((maxId, element) => {
        const idNumber = parseInt(element.id.split('-')[1]);
        return idNumber > maxId ? idNumber : maxId;
      }, 0);

    const nextFontId = `bg-${String(lastFontId + 1).padStart(3, '0')}`;
    const updatedElementData = [
      ...objData,
      { id: nextFontId, type: 'BACKGROUND' },
    ];

    localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
    setObjData(updatedElementData);
  };

  // const addVideoElement = () => {
  //   const lastVideoId = objData
  //     .filter((element) => element.type === 'VIDEO')
  //     .reduce((maxId, element) => {
  //       const idNumber = parseInt(element.id.split('-')[1]);
  //       return idNumber > maxId ? idNumber : maxId;
  //     }, 0);

  //   const nextVideoId = `video-${String(lastVideoId + 1).padStart(3, '0')}`;
  //   const updatedElementData = [...objData, { id: nextVideoId, type: 'VIDEO' }];

  //   localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
  //   setObjData(updatedElementData);
  // };

  // const addBgVideoElement = () => {
  //   const lastBgVideoId = objData
  //     .filter((element) => element.type === 'BGVIDEO')
  //     .reduce((maxId, element) => {
  //       const idNumber = parseInt(element.id.split('-')[1]);
  //       return idNumber > maxId ? idNumber : maxId;
  //     }, 0);

  //   const nextBgVideoId = `bgVideo-${String(lastBgVideoId + 1).padStart(
  //     3,
  //     '0'
  //   )}`;
  //   const updatedElementData = [
  //     ...objData,
  //     { id: nextBgVideoId, type: 'BGVIDEO' },
  //   ];

  //   localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
  //   setObjData(updatedElementData);
  // };

  return (
    <Wrapper>
      {buttons.map((button, index) => (
        <button
          key={index}
          className={button.className}
          onClick={() =>
            button.onClick({
              setShowDeleteBox,
              addFontElement,
              addImageElement,
              addBgElement,
              setShowBgVideoBox,
              setShowVideoBox,
            })
          }
        >
          {button.label}
        </button>
      ))}
    </Wrapper>
  );
}
