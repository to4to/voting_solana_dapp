// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingSolanaDappIDL from '../target/idl/voting_solana_dapp.json'
import type { VotingSolanaDapp } from '../target/types/voting_solana_dapp'

// Re-export the generated IDL and type
export { VotingSolanaDapp, VotingSolanaDappIDL }

// The programId is imported from the program IDL.
export const VOTING_SOLANA_DAPP_PROGRAM_ID = new PublicKey(VotingSolanaDappIDL.address)

// This is a helper function to get the VotingSolanaDapp Anchor program.
export function getVotingSolanaDappProgram(provider: AnchorProvider) {
  return new Program(VotingSolanaDappIDL as VotingSolanaDapp, provider)
}

// This is a helper function to get the program ID for the VotingSolanaDapp program depending on the cluster.
export function getVotingSolanaDappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the VotingSolanaDapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return VOTING_SOLANA_DAPP_PROGRAM_ID
  }
}
