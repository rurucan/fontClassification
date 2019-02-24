import React, { Component } from 'react';
import { connect } from 'dva';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { Button } from 'antd';

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
        <Button type="primary">{this.props.main.title}</Button>
        <p>{temp}</p>
        <Header temp={temp} setTemp={this.setTemp} />
        <Footer temp={temp} setTemp={this.setTemp} />
      </div>
    );
  }
}

export default connect(({ main }) => ({
  main,
}))(MainPage);
