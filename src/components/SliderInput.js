import React, { Component } from 'react';
import { Observable } from 'rxjs';

export default class SliderInput extends Component {
  state = {};

  measureEls = () => {
    this.sliderWidth      = this.slider.offsetWidth;
    this.sliderDims       = this.slider.getBoundingClientRect();
    this.sliderLeft       = this.sliderDims.left + window.scrollX;
    this.sliderRight      = this.sliderDims.right + window.scrollY;
    this.sliderBedWidth   = this.sliderBed.offsetWidth;
    this.rangePx          = this.sliderBedWidth - this.sliderWidth;
  }

  // returns range value for mouse clientX value
  valueFromMouseEvent({clientX}) {
    const {maxVal, minVal} = this.props;
    const value = (clientX - this.sliderLeft);
    const ratio = value / this.sliderBedWidth;
    const rangeValue = (ratio * (maxVal - minVal)) + minVal;
    return rangeValue;
  }

  // returns clientX value for range value
  positionFromValue(value) {
    const {maxVal, minVal} = this.props;
    const ratio = (value - minVal)/(maxVal - minVal);
    const position = ratio >= 0 
      ? (ratio * this.sliderBedWidth)
      : (ratio * this.sliderBedWidth) + this.sliderBedWidth;
    return position;
  }

  // gets value from either click event or props and updates state
  // with the correct position for slider and current value
  update = e => {
    const value = e ? this.valueFromMouseEvent(e) : this.props.value;
    const position = this.positionFromValue(value);
    const state = {
      style: {left: position+'px'},
      value: Math.round(value)
    }
    this.setState(state);
    this.props.onChange(state.value)
  }

  componentDidMount() {
    this.measureEls();
    this.update();
    const sliderMousedowns$     = Observable.fromEvent(this.slider, 'mousedown');
    const parentMouseups$       = Observable.fromEvent(document, 'mouseup');
    const sliderBedMouseMoves$  = Observable.fromEvent(this.sliderBed, 'mousemove');
    const sliderMoves = sliderMousedowns$
      .switchMap(() => 
        sliderBedMouseMoves$
          .takeUntil(parentMouseups$));

    sliderMoves.forEach(x => this.update(x))
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) this.update();
  }

  render() {
    const { style } = this.state;
    return (
      <div className='speed-control__container'>
        <div
            className='speed-control__sliderBed'
            ref={ el => this.sliderBed = el }
            onClick={this.update}>
          <div
            className='speed-control__slider'
            style={style}
            ref={ el => this.slider = el } />
        </div>
      </div>
    )
  }
}

