import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: black;
  opacity: 1;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const Form = styled.div`
  width: 30%;
  height: 25%;
  background: white;
  border: 10px;
  padding: 20px;
  outline: 3px solid black;
  margin: 150px auto;

  input {
    width: 95%;
    margin-bottom: 20px;
  }

  button {
    padding: 5px;
    background: black;
    color: white;
    outline: none;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 10px;
  }
`;

export default function AddBgVideo({ setShowBgVideoBox, setObjData, objData }) {
  const [source, setSource] = useState('');

  const addBgVideoElement = () => {
    const lastVideoId = objData
      .filter((element) => element.type === 'BGVIDEO')
      .reduce((maxId, element) => {
        const idNumber = parseInt(element.id.split('-')[1]);
        return idNumber > maxId ? idNumber : maxId;
      }, 0);

    const nextVideoId = `bgVideo-${String(lastVideoId + 1).padStart(3, '0')}`;
    const updatedElementData = [
      ...objData,
      { id: nextVideoId, type: 'BGVIDEO', src: source },
    ];

    localStorage.setItem('theatre-data', JSON.stringify(updatedElementData));
    setObjData(updatedElementData);
  };

  return (
    <Wrapper>
      <Form>
        <h2>新增影片元件 </h2>

        <span> 影片來源： </span>
        <input
          placeholder=''
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <button
          onClick={() => {
            addBgVideoElement();
            window.location.reload();
          }}
        >
          確定
        </button>

        <button
          onClick={() => {
            setShowBgVideoBox(false);
          }}
        >
          取消
        </button>
      </Form>
    </Wrapper>
  );
}
