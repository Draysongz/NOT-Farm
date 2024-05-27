import {
    ContractProvider,
    Contract,
    Address,
    Cell,
    Sender,
    SendMode,
    beginCell,
    contractAddress,
} from '@ton/core'
import { Op } from './FarmConstants'

// export function setUpInitData(
//     owner_address: Address,
//     jetton_master_addr: Address,
//     jetton_wallet_code: Cell,
// ): Cell {
//     const init_data = beginCell()
//         .storeCoins(0)
//         .storeAddress(owner_address)
//         .storeAddress(jetton_master_addr)
//         .storeRef(jetton_wallet_code)
//         .endCell()
//     return init_data
// }

type FarmWalletConfig = {
    ownerAddress: Address
    notcoinFarmFactoryAddress: Address
    notCoinFarmWalletCode: Cell
}

// int staked_amount = ds~load_coins();
// int status = ds~load_uint(4);
// int rewards = ds~load_coins();
// int last_saved_time = ds~load_uint(64);
// slice owner_address = ds~load_msg_addr();
// slice notcoin_farm_factory_address = ds~load_msg_addr();
// cell notcoin_farm_wallet_code = ds~load_ref();

function farmWalletConfigToCell(config: FarmWalletConfig): Cell {
<<<<<<< HEAD
    return beginCell()
        .storeCoins(0) // staked amount
        .storeInt(0, 4) // status
        .storeCoins(0) //rewards
        .storeUint(0, 32) //daily Rate
        .storeCoins(0) // notMiner
        .storeUint(0, 64) // last saved time
        .storeAddress(config.ownerAddress)
        .storeAddress(config.notcoinFarmFactoryAddress)
        .storeRef(config.notCoinFarmWalletCode)
        .endCell()
=======
  return beginCell()
    .storeCoins(0) // staked amount
    .storeInt(0, 4) // status
    .storeCoins(0) //rewards
    .storeUint(0, 32) //daily Rate
    .storeCoins(0) // notMiner
    .storeUint(0, 64) // last saved time
    .storeAddress(config.ownerAddress)
    .storeAddress(config.notcoinFarmFactoryAddress)
    .storeRef(config.notCoinFarmWalletCode)
    .endCell();
>>>>>>> 3233574fb11b868b69a2c7dfbd87453dd180f8a1
}

export class NotcoinFarmWallet implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new NotcoinFarmWallet(address)
    }

    static createFromConfig(
        config: FarmWalletConfig,
        code: Cell,
        workchain = 0,
    ) {
        const data = farmWalletConfigToCell(config)
        const init = { code, data }
        return new NotcoinFarmWallet(contractAddress(workchain, init), init)
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        })
    }

    async sendUnstake(
        provider: ContractProvider,
        value: bigint,
        via: Sender,
        userNotCoinFarmWalletJettonAddr: Address,
        amount: bigint,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Op.unstake, 32)
                .storeCoins(amount)
                .storeAddress(userNotCoinFarmWalletJettonAddr)
                .endCell(),
        })
    }

    async sendClaimRewards(
        provider: ContractProvider,
        value: bigint,
        via: Sender,
        notcoinFactoryJettonAddr: Address,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Op.claim_rewards, 32)
                .storeAddress(notcoinFactoryJettonAddr)
                .endCell(),
        })
    }

    async sendCompound(provider: ContractProvider, value: bigint, via: Sender) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Op.compound, 32).endCell(),
        })
    }

    async sendWithDrawTokens(
        provider: ContractProvider,
        value: bigint,
        via: Sender,
        amount: bigint,
        farmWalletJettonAddr: Address,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Op.withdraw_token, 32)
                .storeCoins(amount)
                .storeAddress(farmWalletJettonAddr)
                .endCell(),
        })
    }

    async sendWithdrawExcessTon(
        provider: ContractProvider,
        value: bigint,
        via: Sender,
        amount: bigint,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeCoins(amount).endCell(),
        })
    }

  async getFarmWalletData(provider: ContractProvider) {
    const resp = await provider.get("get_wallet_data", []);

    return {
      depositBalance: resp.stack.readNumber(),
      status: resp.stack.readNumber(),
      availableRewards: resp.stack.readNumber(),
      dailyRate: resp.stack.readNumber(),
      notMiner: resp.stack.readNumber(),
      lastSavedTime: resp.stack.readNumber(),
      ownerAddress: resp.stack.readAddress(),
      farmFactoryAddress: resp.stack.readAddress(),
      farmWalletCode: resp.stack.readCell(),
    };
  }

  async getRewards(provider: ContractProvider) {
    const resp = await provider.get("get_reward", []);
    return resp.stack.readNumber();
  }
}

// int deposit_amount = ds~load_coins();
// int status = ds~load_int(4); ;; referral status
// int rewards = ds~load_coins();
// int dailyRate = ds~load_uint(32);
// int notMiner = ds~load_coins();
// int last_saved_time = ds~load_uint(64);
// slice owner_address = ds~load_msg_addr();
// slice notcoin_farm_factory_address = ds~load_msg_addr();
// cell notcoin_farm_wallet_code = ds~load_ref();
