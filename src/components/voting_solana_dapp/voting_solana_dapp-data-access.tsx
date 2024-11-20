'use client'

import {getVotingSolanaDappProgram, getVotingSolanaDappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useVotingSolanaDappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingSolanaDappProgramId(cluster.network as Cluster), [cluster])
  const program = getVotingSolanaDappProgram(provider)

  const accounts = useQuery({
    queryKey: ['voting_solana_dapp', 'all', { cluster }],
    queryFn: () => program.account.voting_solana_dapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['voting_solana_dapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ voting_solana_dapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingSolanaDappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingSolanaDappProgram()

  const accountQuery = useQuery({
    queryKey: ['voting_solana_dapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.voting_solana_dapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['voting_solana_dapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ voting_solana_dapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['voting_solana_dapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ voting_solana_dapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['voting_solana_dapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ voting_solana_dapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['voting_solana_dapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ voting_solana_dapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
