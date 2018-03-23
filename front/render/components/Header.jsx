import React from 'react';

function Header(props) {
  const { temp, setTemp } = props;

  const transfrom = t => t + 20;
  const handleClick = (ev) => {
    const { value } = ev.target;
    setTemp(Number(value) - 20);
  };

  return (
    <div>
      <p>{temp}</p>
      <input type="text" onChange={handleClick} value={transfrom(temp)} />
    </div>
  );
}

export default Header;
