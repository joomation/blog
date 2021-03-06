import React, { Component } from 'react';
class IconDesk extends Component {
  render() {
    return (
      <svg x="0px" y="0px" viewBox="0 0 30 30"
      style={{
        fill:this.props.isBright?'#333333':'#ffffff'
      }}
      >
      <path className="back" d={`M24.1,21.1H5.9c-1.1,0-1.9-0.9-1.9-1.9V7.8c0-1.1,0.9-1.9,1.9-1.9h18.2c1.1,0,1.9,0.9,1.9,1.9v11.3
        C26,20.2,25.1,21.1,24.1,21.1z`}/>
      <path d={`M24.3,5.3H5.7c-1.3,0-2.4,1.1-2.4,2.4v11.7c0,1.3,1.1,2.3,2.4,2.3h6.9v1.9h-2.5c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h9.8
        c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5h-2.5v-1.9h6.9c1.3,0,2.4-1.1,2.4-2.3V7.6C26.6,6.3,25.5,5.3,24.3,5.3z M16.4,23.5h-2.7
        v-1.9h2.7V23.5z M25.6,19.3c0,0.7-0.6,1.3-1.4,1.3H5.7c-0.7,0-1.4-0.6-1.4-1.3V7.6c0-0.7,0.6-1.4,1.4-1.4h18.5
        c0.7,0,1.4,0.6,1.4,1.4V19.3z`}/>
      </svg>
    )
  }
}
export default IconDesk;   