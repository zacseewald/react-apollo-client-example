import React, { Component } from 'react';
import Header from '../components/header/index';
import Repos from '../components/repos/index';
import Footer from '../components/footer/index';


export class Main extends Component {
  render() {
    return (
      <div>
        <Header />
        <Repos />
        <Footer />
      </div>
    )
  }
}

export default Main
