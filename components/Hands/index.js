/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withLeapContainer } from 'react-leap';
import { pick } from 'lodash';

import styles from './Hands.module.css';

const Hands = ({ frame, handler }) => {
  const [fingers, setFingers] = useState([]);
  const handRefs = { left: useRef(null), right: useRef(null) };

  useEffect(() => {
    if (frame && frame.pointables) {
      const newFingers = {};
      frame.pointables.forEach(pointable => {
        if (pointable.finger) {
          for (let partId = 0; partId !== 4; partId += 1) {
            const posX = pointable.positions[partId][0] * 5;
            const posY = pointable.positions[partId][2] * 5 + 5000;
            const posZ = pointable.positions[partId][1] * 5 - 400;

            const id = `${pointable.id}_${partId}`;
            newFingers[id] = {
              id,
              type: pointable.type,
              hand: pointable.hand().type,
              handId: pointable.hand().id,
              part: partId,
              backgroundColor: pointable.type === 1 ? '#5DF0D7' : '#5AE660',
              transform: `translate3d(${posX}px, ${posY}px, ${posZ}px)`,
            };
          }
        }
      });
      setFingers(newFingers);
    }
    handler(
      Object.values(handRefs)
        .filter(h => h.current)
        .map(({ current }) => {
          const handId = parseInt(current.getAttribute('hand'), 10);
          const { x, y } = current.getBoundingClientRect();
          return { x, y, handId };
        })
    );
  }, [frame]);

  return (
    <div className={styles.app}>
      <div className={styles.scene}>
        {Object.values(fingers).map(finger => (
          <div
            className={`${styles.cube} ${styles.finger}`}
            key={finger.id}
            ref={finger.type === 1 && finger.part === 3 ? handRefs[finger.hand] : null}
            hand={finger.handId}
            style={pick(finger, 'backgroundColor', 'transform')}
          >
            <div className={`${styles.face} ${styles.tp}`} />
            <div className={`${styles.face} ${styles.lt}`} />
            <div className={`${styles.face} ${styles.rt}`} />
            <div className={`${styles.face} ${styles.ft}`} />
            <div className={`${styles.face} ${styles.bk}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

Hands.propTypes = {
  frame: PropTypes.shape(),
  handler: PropTypes.func.isRequired,
};

Hands.defaultProps = {
  frame: null,
};

export default withLeapContainer(Hands);
