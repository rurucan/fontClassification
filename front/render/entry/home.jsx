import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: 100,
    };
  }
  setTemp = (temp) => {
    this.setState({ temp });
  }

  render() {
    const { temp } = this.state;
    return (
      <div>
        <p>{temp}</p>
        <Header temp={temp} setTemp={this.setTemp} />
        <Footer temp={temp} setTemp={this.setTemp} />
      </div>
    );
  }
}

export default MainPage;
