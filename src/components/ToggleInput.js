import React, { Component } from 'react';
import { Observable } from 'rxjs';

export default class ToggleInput extends Component {
  state = {
    threshold: 500,
    slowInterval: 200,
    fastInterval: 50,
    hyperInterval: 0
  }

  componentDidMount() {
    const generateToggleObservable = (element, increment) => {
      const down$ = Observable.fromEvent(element, 'mousedown');
      const up$ = Observable.fromEvent(element, 'mouseup');
      
      return down$
        .switchMap(() =>
          Observable.timer(0, this.state.slowInterval)
            .takeUntil(Observable.timer(this.state.threshold))
            .concat(
              Observable.timer(0, this.state.fastInterval)
                .takeUntil(Observable.timer(2 * this.state.threshold))
            )
            .concat(Observable.timer(0, this.state.hyperInterval))
            .map(() => increment+this.props.value)
            .takeUntil(up$)
      )
    }

    const scaleSign = Math.sign(this.props.maxVal - this.props.minVal);

    this.observables = [[this.upButton, scaleSign], [this.downButton, -1*scaleSign]]
      .map(([element, increment]) => generateToggleObservable(element, increment))
      .forEach(observable => observable.subscribe(val => this.props.onChange(val)));
  }

  render() {
    return (
      <div className='toggle-input__container'>
        <button ref={ el => this.upButton = el } >&#x25B2;</button>
        <span className='toggle-input__readout'>{this.props.value}</span>
        <button ref={ el => this.downButton = el } >&#x25BC;</button>
      </div>
    )
  }
}
