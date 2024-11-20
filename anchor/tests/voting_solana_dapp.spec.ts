import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {VotingSolanaDapp} from '../target/types/voting_solana_dapp'

describe('voting_solana_dapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.VotingSolanaDapp as Program<VotingSolanaDapp>

  const voting_solana_dappKeypair = Keypair.generate()

  it('Initialize VotingSolanaDapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        voting_solana_dapp: voting_solana_dappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([voting_solana_dappKeypair])
      .rpc()

    const currentCount = await program.account.voting_solana_dapp.fetch(voting_solana_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment VotingSolanaDapp', async () => {
    await program.methods.increment().accounts({ voting_solana_dapp: voting_solana_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_solana_dapp.fetch(voting_solana_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment VotingSolanaDapp Again', async () => {
    await program.methods.increment().accounts({ voting_solana_dapp: voting_solana_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_solana_dapp.fetch(voting_solana_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement VotingSolanaDapp', async () => {
    await program.methods.decrement().accounts({ voting_solana_dapp: voting_solana_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_solana_dapp.fetch(voting_solana_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voting_solana_dapp value', async () => {
    await program.methods.set(42).accounts({ voting_solana_dapp: voting_solana_dappKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting_solana_dapp.fetch(voting_solana_dappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voting_solana_dapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voting_solana_dapp: voting_solana_dappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voting_solana_dapp.fetchNullable(voting_solana_dappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
