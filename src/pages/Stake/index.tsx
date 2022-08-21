import { CurrencyAmount } from '@pancakeswap-libs/sdk'
import React, { useCallback } from 'react'
import { CardBody } from '@pancakeswap-libs/uikit'
import { AutoColumn } from 'components/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CardNav from 'components/CardNav'
import { BottomGrouping, Wrapper } from 'components/swap/styleds'
import styled from 'styled-components'
import { AutoRow } from 'components/Row'

import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import useI18n from 'hooks/useI18n'
import PageHeader from 'components/PageHeader'
import AppBody from '../AppBody'

const Stake = () => {
  const Button = styled.div<any>`
    background-image: linear-gradient(to right, #DA01D6 0%, #52018E  51%, #f4c4f3  100%);
    margin: 0px;
    margin-top: 10px;
    padding: 15px 45px;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;            
    box-shadow: 0 0 10px #eee;
    border-radius: 10px;
    display: block;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  `
  const ButtonDay = styled.div<any>`
    background-color: transparent;
    margin: 0px;
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left:9px;
    margin-right:9px;
    display: flex;
    justify-content: center;
    padding: 10px 14px;
    text-align: center;
    font-weight: 300;
    font-size: 12px;
    color: white;            
    box-shadow: 0 0 5px #DA01D6;
    border: 2px #DA01D6;
    border-radius: 10px;
    user-select: none;
    @media only screen and (max-width: 768px) {
      background-color: transparent;
      margin: 0px;
      margin-top: 30px;
      margin-bottom: 20px;
      margin-left:5px;
      margin-right:5px;
      display: flex;
      justify-content: center;
      padding: 10px 14px;
      text-align: center;
      font-weight: 300;
      font-size: 10px;
      color: white;            
      box-shadow: 0 0 5px #DA01D6;
      border: 2px #DA01D6;
      border-radius: 10px;
      user-select: none;    
    }
  `

  const RewardPanel = styled.div<any>`
    background-color: transparent;
    margin: 0px;
    margin-top: 20px;
    margin-bottom:10px;
    display: flex;
    padding: 25px 15px;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 14px;
    color: white;            
    box-shadow: 0 0 5px #DA01D6;
    border-color:#DA01D6;
    border-radius: 10px;
    user-select: none;
  `
  const ApyStyle = styled.div<any>`
    background-color: transparent;
    margin-top: 5px;
    margin-bottom:5px;
    display: block;
    padding: 5px 5px;
    color: #DA01D6;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
  `
  const TranslateString = useI18n()


  // swap state
  const { independentField, typedValue, } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies } = useDerivedSwapInfo()
  const { wrapType } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const {onUserInput } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])


  return (
    <>
      <CardNav activeIndex={2}/>
      <AppBody>
        <Wrapper id="stake-page">
          <PageHeader
            title={TranslateString(8, 'HecoStake')}
            description={TranslateString(1192, 'Stake your Hecodex to get a rewards')}
          />
          <CardBody>
            <AutoColumn gap="lg">
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade
                    ? TranslateString(194, 'Amount to Stake')
                    : TranslateString(76, 'Amount to Stake')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                id="swap-currency-input"
              />
              
            </AutoColumn>

            <AutoRow style={{ padding: '0 1rem' }}>
            <ButtonDay>7 Days</ButtonDay>
            <ButtonDay>30 Days</ButtonDay>
            <ButtonDay>90 Days</ButtonDay>
            <ButtonDay>365 Days</ButtonDay>
            </AutoRow>

            <AutoColumn>
              <ApyStyle>
                APY : NaN%
              </ApyStyle>
              <RewardPanel>
                Estimated Rewards : NaN BUSD
              </RewardPanel>
            </AutoColumn>

            <BottomGrouping>
                <Button width="100%">Confirm Stake</Button>
            </BottomGrouping>
          </CardBody>
        </Wrapper>
      </AppBody>
    </>
  )
}

export default Stake
