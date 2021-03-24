/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-multi-assign */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLeapContainer } from 'react-leap';

// function moveFinger(Finger, posX, posY, posZ) {
//   Finger.style.webkitTransform = ;
// }

const Hands = ({ frame }) => {
  const [spheres, setSpheres] = useState({});
  const [fingers, setFingers] = useState([]);

  useEffect(() => {
    if (frame && frame.hands) {
      const newSpheres = {};
      frame.hands.forEach(hand => {
        const posX = hand.palmPosition[0] * 3;
        const posY = hand.palmPosition[2] * 3 - 200;
        const posZ = hand.palmPosition[1] * 3 - 400;
        const rotX = hand._rotation[2] * 90;
        // const rotY = hand._rotation[1] * 90;
        // const rotZ = hand._rotation[0] * 90;

        newSpheres[hand.id] = {
          id: hand.id,
          backgroundColor: spheres[hand.id]
            ? spheres[hand.id].backgroundColor
            : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          transform: `translateX(${posX}px) translateY(${posY}px) translateZ(${posZ}px) rotateX(${rotX}deg) rotateY(0deg) rotateZ(0deg)`,
        };
      });
      setSpheres(newSpheres);
    }

    if (frame && frame.pointables) {
      const newFingers = {};
      frame.pointables.forEach(pointable => {
        if (pointable.finger) {
          for (let partId = 0; partId !== 4; partId += 1) {
            const posX = pointable.positions[partId][0] * 3;
            const posY = pointable.positions[partId][2] * 3 - 200;
            const posZ = pointable.positions[partId][1] * 3 - 400;

            const id = `${pointable.id}_${partId}`;
            newFingers[id] = {
              id,
              backgroundColor: fingers[id]
                ? fingers[id].backgroundColor
                : `#${Math.floor(pointable.type * 500).toString(16)}`,
              transform: `translate3d(${posX}px, ${posY}px, ${posZ}px)`,
            };
          }
        }
      });
      setFingers(newFingers);
    }
  }, [frame]);

  return (
    <div id="app">
      <div id="scene">
        {Object.values(fingers).map(finger => (
          <div className="cube finger" key={finger.id} style={finger}>
            <div className="face tp" />
            <div className="face lt" />
            <div className="face rt" />
            <div className="face ft" />
            <div className="face bk" />
          </div>
        ))}
        {Object.values(spheres).map(sphere => (
          <div className="cube sphere" key={sphere.id} style={sphere}>
            <div className="face tp" />
            <div className="face lt" />
            <div className="face rt" />
            <div className="face ft" />
            <div className="face bk" />
          </div>
        ))}
        {/* </div> */}
      </div>
    </div>
  );
};

Hands.propTypes = {
  frame: PropTypes.shape(),
};

Hands.defaultProps = {
  frame: null,
};

export default withLeapContainer(Hands);
