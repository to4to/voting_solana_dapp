#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting_solana_dapp {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingSolanaDapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting_solana_dapp.count = ctx.accounts.voting_solana_dapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting_solana_dapp.count = ctx.accounts.voting_solana_dapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingSolanaDapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.voting_solana_dapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingSolanaDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + VotingSolanaDapp::INIT_SPACE,
  payer = payer
  )]
  pub voting_solana_dapp: Account<'info, VotingSolanaDapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingSolanaDapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub voting_solana_dapp: Account<'info, VotingSolanaDapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub voting_solana_dapp: Account<'info, VotingSolanaDapp>,
}

#[account]
#[derive(InitSpace)]
pub struct VotingSolanaDapp {
  count: u8,
}
