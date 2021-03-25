/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLeapContainer } from 'react-leap';

import styles from './Hands.module.css';

const Hands = ({ frame }) => {
  const [fingers, setFingers] = useState([]);

  useEffect(() => {
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
              backgroundColor: pointable.type === 1 ? '#5DF0D7' : '#5AE660',
              transform: `translate3d(${posX}px, ${posY}px, ${posZ}px)`,
            };
          }
        }
      });
      setFingers(newFingers);
    }
  }, [frame]);

  return (
    <div className={styles.app}>
      <div className={styles.scene}>
        {Object.values(fingers).map(finger => (
          <div className={`${styles.cube} ${styles.finger}`} key={finger.id} style={finger}>
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
};

Hands.defaultProps = {
  frame: null,
};

export default withLeapContainer(Hands);
