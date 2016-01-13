import React from 'react';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import h from '../helpers';
var base = Rebase.createClass('https://sweltering-inferno-7528.firebaseio.com/');


var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState() {
    return {
      fishes : {},
      order : {}
    }
  },
  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });
    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  },
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({
      order: this.state.order
    });
  },
  removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  },
  addFish(fish) {
    var timeStamp = (new Date().getTime());
    this.state.fishes['fish-' + timeStamp] = fish;
    this.setState({
      fishes : this.state.fishes
    })
  },
  removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes : this.state.fishes
      });
    }
  },
  loadSamples() {
    this.setState({
      fishes : require('../sample-fishes')
    });
  },
  renderFish(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory linkState={this.linkState}
          fishes={this.state.fishes}
          addFish={this.addFish}
          loadSamples={this.loadSamples}
          removeFish={this.removeFish}
        />
      </div>
    )
  }
});

export default App;
