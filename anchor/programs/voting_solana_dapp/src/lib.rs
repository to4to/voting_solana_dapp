#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting {

    use super::*;

    pub fn initilize_poll(ctx: Context<InitilizePoll>, poll_id: u64) -> ProgramResult {
        Ok(())
    }
}
