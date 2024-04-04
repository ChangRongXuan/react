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
    width: 70%;
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

export default function DeleteLightBox({
  setShowDeleteBox,
  setObjData,
  objData,
  sheet,
}) {
  const [deleteID, setDeleteID] = useState('');

  // TODO: 多項刪除
  const deleteObject = (id) => {
    const filteredData = objData.filter((item) => item.id !== id);
    setObjData(filteredData);
    localStorage.setItem('theatre-data', JSON.stringify(filteredData));
  };
  return (
    <Wrapper>
      <Form>
        <h2>刪除元件 </h2>

        <span>元件 ID： </span>
        <input
          placeholder=''
          value={deleteID}
          onChange={(e) => setDeleteID(e.target.value)}
        />

        <button
          onClick={() => {
            deleteObject(deleteID);
            sheet.detachObject(deleteID);
            window.location.reload();
          }}
        >
          確定
        </button>

        <button
          onClick={() => {
            setShowDeleteBox(false);
          }}
        >
          取消
        </button>
      </Form>
    </Wrapper>
  );
}
