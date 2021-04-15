import { useEffect, useState } from 'react'
import { beeDebugApi } from '../services/bee'
import { useApiPeerBalances, useApiPeerCheques, useApiSettlements } from './apiHooks'

interface UseAccountingHook {
  isLoading: boolean
  totalsent: number
  totalreceived: number
  accounting: Record<string, Accounting> | null
}

export const useAccounting = (): UseAccountingHook => {
  const settlements = useApiSettlements()
  const balances = useApiPeerBalances()
  const peerCheques = useApiPeerCheques()
  const [accounting, setAccounting] = useState<Record<string, Accounting> | null>(null)
  const [loadingIndividual, setLoadingIndividual] = useState(true)
  const isLoading =
    settlements.isLoadingSettlements || balances.isLoadingPeerBalances || peerCheques.isLoadingPeerCheques

  // Once the settlements, balances and cheques are loaded, process them
  useEffect(() => {
    if (isLoading || accounting !== null) return

    const acc: Record<string, Accounting> = {}

    settlements.settlements?.settlements.forEach(
      ({ peer, sent, received }) => (acc[peer] = { ...acc[peer], sent, received }),
    )

    balances.peerBalances?.balances.forEach(({ peer, balance }) => (acc[peer] = { ...acc[peer], balance }))

    peerCheques.peerCheques?.lastcheques.forEach(
      ({ peer, lastsent, lastreceived }) => (acc[peer] = { ...acc[peer], lastsent, lastreceived }),
    )
    setLoadingIndividual(true)
    const promises = Object.keys(acc).map(peerId => beeDebugApi.chequebook.getPeerLastCashout(peerId))
    Promise.all(promises).then(res => {
      res.forEach(({ peer, uncashedAmount }) => (acc[peer] = { ...acc[peer], uncashedAmount }))
      setLoadingIndividual(false)
      setAccounting(acc)
    })
  }, [isLoading])

  return {
    isLoading: isLoading || loadingIndividual,
    accounting,
    totalsent: settlements.settlements?.totalsent || 0,
    totalreceived: settlements.settlements?.totalreceived || 0,
  }
}
