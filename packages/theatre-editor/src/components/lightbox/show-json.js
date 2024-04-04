import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: black;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
`;

const Form = styled.div`
  background: white;
  border: 10px;
  padding: 10px 30px 30px;
  outline: 3px solid black;
  display: flex;

  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
  }

  button {
    padding: 10px;
    background: black;
    color: white;
    outline: none;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 10px;
  }
`;

const Block = styled.div`
  margin: 0 30px;
  width: 400px;
`;

export default function JSONLightBox({
  setShowJSONLightBox,
  animateJSON,
  objData,
  setObjData,
}) {
  const [inputObj, setInputObj] = useState('');
  const [inputAnimate, setInputAnimate] = useState('');

  return (
    <Wrapper>
      <Form>
        <Block>
          <h2> JSON 資料 (Read only) </h2>
          <p>元件 JSON</p>
          <textarea
            placeholder='元件JSON'
            value={JSON.stringify(objData)}
            readOnly={true}
          />

          <p>動畫 JSON</p>

          <textarea
            placeholder='動畫JSON'
            value={JSON.stringify(animateJSON)}
            readOnly={true}
          />
        </Block>

        <Block>
          <h2> Edit JSON </h2>
          <p>元件 JSON</p>
          <textarea
            placeholder='貼上要讀取的元件JSON'
            value={inputObj}
            onChange={(e) => setInputObj(e.target.value)}
          />

          <p>動畫 JSON</p>

          <textarea
            placeholder='貼上要讀取的動畫JSON'
            value={inputAnimate}
            onChange={(e) => setInputAnimate(e.target.value)}
          />

          <button
            onClick={() => {
              setShowJSONLightBox(false);
            }}
          >
            Close
          </button>

          <button
            onClick={() => {
              //更新 object storage 資料（自動記憶）
              localStorage.setItem('theatre-data', inputObj);
              //把 render 資料換成 inputObj，讓畫面直接更新
              setObjData(JSON.parse(inputObj));

              //更新 state 資料（自動記憶）
              const animate = localStorage.getItem('theatre-0.4.persistent');
              const animateData = JSON.parse(animate);

              const inputAnimateData = JSON.parse(inputAnimate);

              if (inputAnimateData) {
                animateData.historic.innerState.coreByProject.Project =
                  inputAnimateData;
              }

              const updatedAnimate = JSON.stringify(animateData);

              localStorage.setItem('theatre-0.4.persistent', updatedAnimate);
              window.location.reload(); //一定要重新整理，不然會壞掉
            }}
          >
            儲存修改
          </button>
        </Block>
      </Form>
    </Wrapper>
  );
}
