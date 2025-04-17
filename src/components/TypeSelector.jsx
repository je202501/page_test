import React, { useState, useEffect } from 'react';

const TypeSelector = ({onSelectType}) => {
    const [type, setType] = useState('');
    const handleChange = (e) => {
        const selected = e.target.value;
        setType(selected);
        onSelectType(selected); // 부모 컴포넌트에게 알림
      };
  return (
    <div>
      <label htmlFor="typeSelect">냉장고 타입 선택:</label>
      <select id="typeSelect" value={type} onChange={handleChange}>
        <option value="">냉장고 타입 선택</option>
        <option value="A">일체형</option>
        <option value="B">분리형</option>
      </select>
    </div>
  );
};

export default TypeSelector;
