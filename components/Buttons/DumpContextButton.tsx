import React, { useEffect } from 'react';
import styles from '@/styles/Exchange.module.css'
import { stringifyBigInt } from '@/lib/spCoin/utils';
import { exchangeContext } from '@/lib/context';

const DumpContextButton = () => {
    const show = () => {
        // alert(`show:CustomConnectButton:useEffect(() => exchangeContext = ${stringifyBigInt(exchangeContext)}`);
        console.log(`CustomConnectButton:useEffect(() => exchangeContext = ${stringifyBigInt(exchangeContext)}`);
    }
    
    return (
        <div>
            <button
                onClick={show}
                type="button"
                className={styles["exchangeButton"]}
                >
                Dump Context
            </button>
        </div>
    );
}

export default DumpContextButton;
