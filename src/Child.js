import React from 'react';
import styles from './Child.module.scss';

import { useEffect } from 'react';
import axios from 'axios';

export default function Child() {
    console.log('Child', styles);
    useEffect(() => {
        axios.get('/get_jimdb_key/get?key=hotword&argv=h-1864&callback=jQuery4830252&_=1656660668857').then((res) => {
            console.log(666, res.data);
        })
    }, []);
  return (
    <>
        <div>Child</div>
        <ul>
            <li className={styles.item}>11111</li>
            <li className={styles.item}>2222</li>
        </ul>
    </>
  )
}
