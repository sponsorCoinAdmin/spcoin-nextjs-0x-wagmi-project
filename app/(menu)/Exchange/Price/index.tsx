'use client';
import styles from '@/styles/Exchange.module.css';
import { openDialog, ErrorDialog} from '@/components/Dialogs/Dialogs';
import { useState, useEffect } from "react";
import { useAccount } from 'wagmi' 
import { AccountRecord, TokenContract, TRANSACTION_TYPE, ErrorMessage } from '@/lib/structure/types';
import { PriceAPI } from '@/lib/0X/fetcher';
import type { PriceResponse } from "@/app/api/types";
import TradeContainerHeader from '@/components/Headers/TradeContainerHeader';
import BuySellSwapArrowButton from '@/components/Buttons/BuySellSwapArrowButton';
import SellContainer from '@/components/containers/SellContainer';
import BuyContainer from '@/components/containers/BuyContainer';
import AffiliateFee from '@/components/containers/AffiliateFee';
import PriceButton from '@/components/Buttons/PriceButton';
import FeeDisclosure from '@/components/containers/FeeDisclosure';
import IsLoadingPrice from '@/components/containers/IsLoadingPrice';
import { exchangeContext, resetNetworkContext } from "@/lib/context";
import { stringifyBigInt } from '@/lib/spCoin/utils';
import { displaySpCoinContainers } from '@/lib/spCoin/guiControl';

//////////// Price Code
export default function PriceView() {
  const ACTIVE_ACCOUNT = useAccount()
  const [price, setPrice] = useState<PriceResponse | undefined>();
  const [sellAmount, setSellAmount] = useState<bigint>(exchangeContext.tradeData.sellAmount);
  const [buyAmount, setBuyAmount] = useState<bigint>(exchangeContext.tradeData.buyAmount);
  const [slippage, setSlippage] = useState<string>(exchangeContext.tradeData.slippage);
  const [agentAccount, setAgentElement] = useState(exchangeContext.agentAccount);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({ source: "", errCode:0, msg: "" });
  const [sellTokenContract, setSellTokenContract] = useState<TokenContract|undefined>(exchangeContext.sellTokenContract);
  const [buyTokenContract, setBuyTokenContract] = useState<TokenContract|undefined>(exchangeContext.buyTokenContract);
  const [transactionType, setTransactionType] = useState<TRANSACTION_TYPE>(exchangeContext.tradeData.transactionType);
  const [activeContainerId, setActiveContainerId] = useState<string>(exchangeContext.activeContainerId);

  try {
    useEffect(() => {
      displaySpCoinContainers(exchangeContext.spCoinPanels)
    }, [])
  
    useEffect(() => {
      const chain = ACTIVE_ACCOUNT.chain;
      if (chain != undefined && exchangeContext.network.chainId !== chain.id) {
        // alert(`chain = ${stringifyBigInt(chain)}`)
        resetNetworkContext(chain)
        console.debug(`chainId = ${chain.id}\nexchangeContext = ${stringifyBigInt(exchangeContext)}`)
        setAgentElement(exchangeContext.agentAccount);
        setSlippage(exchangeContext.tradeData.slippage);
        setSellTokenContract(exchangeContext.sellTokenContract);
        setBuyTokenContract(exchangeContext.buyTokenContract);
        setActiveContainerId(exchangeContext.activeContainerId);
      }
    }, [ACTIVE_ACCOUNT.chain]);

    useEffect(() => {
      console.debug(`%%%% PRICE.useEffect[sellAmount = ${sellAmount}])`);
      exchangeContext.tradeData.sellAmount = sellAmount;
      if (sellAmount === 0n && transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT) {
        setBuyAmount(0n);
      }
    },[sellAmount]);

    useEffect(() => {
      console.debug(`PRICE.useEffect[buyAmount = ${buyAmount}])`);
      exchangeContext.tradeData.buyAmount = buyAmount; 
      if (buyAmount === 0n && transactionType === TRANSACTION_TYPE.BUY_EXACT_IN) {
        setSellAmount(0n);
      }
    },[buyAmount]);

    useEffect(() => {
      // alert (`Price:tokenContract(${stringifyBigInt(sellTokenContract)})`)
    },[sellTokenContract]);

    useEffect(() => {
      console.debug(`PRICE.useEffect[slippage = ${slippage}])`);
      exchangeContext.tradeData.slippage = slippage;
    }, [slippage]);

    useEffect(() => {
      console.debug(`PRICE.useEffect[buyTokenContract = ${buyTokenContract}])`);
      exchangeContext.buyTokenContract = buyTokenContract;
    }, [buyTokenContract]);

    useEffect(() => {
      console.debug(`PRICE.useEffect[errorMessage.errorCode = ${errorMessage.errCode}])`);
      if ( errorMessage && errorMessage.source !== "" && errorMessage.msg !== "") {
        openDialog("#errorDialog");
      }
    }, [errorMessage.errCode]);

    const apiErrorCallBack = (apiErrorObj:any) => {
      if (transactionType === TRANSACTION_TYPE.SELL_EXACT_OUT) {
        setBuyAmount(0n);
      }
      else if (buyAmount === 0n && transactionType === TRANSACTION_TYPE.BUY_EXACT_IN) {
        setSellAmount(0n);
      }
      alert(`${apiErrorObj}`);
      console.debug(`${apiErrorObj}`);
    }
  
    const { isLoading: isLoadingPrice, data:Data, error:PriceError } = PriceAPI({
      sellTokenContract, 
      buyTokenContract,
      transactionType,
      sellAmount,
      buyAmount,
      setPrice,
      setBuyAmount,
      apiErrorCallBack});

    useEffect(() => {
      if(PriceError) {
         setErrorMessage({ source: "PriceError: ", errCode: PriceError.errCode, msg: PriceError.errMsg });
      }
    }, [PriceError]);

   function swapBuySellTokens() {
      const tmpTokenContract: TokenContract|undefined = exchangeContext.buyTokenContract;
      setBuyTokenContract(exchangeContext.sellTokenContract);
      setSellTokenContract(tmpTokenContract);
    }

    function updateBuyTransaction(newTransactionContract: TokenContract) {
      setBuyTokenContract(newTransactionContract);
      let msg = `>>>>>>>>>>>> setDecimalAdjustedContract:TRANSACTION_TYPE = transactionType <<<<<<<<<<<<`;
      msg += `newTransactionContract = ${stringifyBigInt(newTransactionContract)}\n`
      msg += `buyTokenContract = ${stringifyBigInt(buyTokenContract)}\n`
      msg += `tradeData = ${stringifyBigInt(exchangeContext.tradeData)}`
      console.debug(msg);
    }
    const setSellTokenContractCallback = (sellTokenContract:TokenContract|undefined) => {
      setSellTokenContract(sellTokenContract);
      // alert("setSellTokenContract")
    }

    const setBuyTokenContractCallback = (buyTokenContract:TokenContract|undefined) => {
      // alert("setBuyTokenContract")
      setBuyTokenContract(buyTokenContract);
    }

    try {
      return (
        <form autoComplete="off">
          <ErrorDialog errMsg={errorMessage} showDialog={false} />
          <div id="MainSwapContainer_ID" className={styles["mainSwapContainer"]}>
            <TradeContainerHeader slippage={slippage} setSlippageCallback={setSlippage}/>
            <SellContainer updateSellAmount={sellAmount}
                           sellTokenContract={sellTokenContract}
                           buyTokenContract={buyTokenContract}
                           setSellAmountCallback={setSellAmount}
                           setTokenContractCallback={setSellTokenContractCallback}/>
            <BuyContainer  updateBuyAmount={buyAmount}
                           sellTokenContract={sellTokenContract}
                           buyTokenContract={buyTokenContract}
                           setBuyAmountCallback={setBuyAmount}
                           setTokenContractCallback={setBuyTokenContractCallback}/>
            <BuySellSwapArrowButton swapBuySellTokens={swapBuySellTokens}/>
            <PriceButton/>
            <AffiliateFee price={price} buyTokenContract={buyTokenContract}/>
          </div>
          <FeeDisclosure/>
          <IsLoadingPrice isLoadingPrice={isLoadingPrice} />
        </form>
      );
    } catch (err:any) {
      console.debug (`Price Components Error:\n ${err.message}`)
    }
  } catch (err:any) {
    console.debug (`Price Methods Error:\n ${err.message}`)
  }
}
