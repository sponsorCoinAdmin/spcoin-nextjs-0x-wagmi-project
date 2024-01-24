import React from 'react'
import styles from '../../styles/SpCoin.module.css'
import { ConnectKitButton } from "connectkit";

function CustomConnectButton() {
  return (
    <div>
      { (
        <ConnectKitButton.Custom>
          {({
            isConnected,
            isConnecting,
            show,
            hide,
            address,
            ensName,
            chain,
          }) => {
            return (
              <button
                onClick={show}
                type="button"
                className={styles.swapButton}
              >
                {isConnected ? address : "Connect Wallet"}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      )}
    </div>
  )
}

export default CustomConnectButton

