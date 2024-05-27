import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from '@ton/core'
import { Op } from './FarmConstants'

export type NotcoinFarmFactoryConfig = {
  adminAddress: Address;
  coAdminAddress: Address;
  notcoinFarmWalletCode: Cell;
};

// int total_deposit_balance = ds~load_coins();
// int factory_pool = ds~load_coins();
// int status = ds~load_int(4);
// int notMinerRate = ds~load_uint(32);
// int devFee = ds~load_uint(32);
// int dailyRate = ds~load_uint(32);
// slice admin_address =  ds~load_msg_addr();
// slice co_admin_address = ds~load_msg_addr();
// cell notcoin_farm_wallet_code = ds~load_ref();
// cell additional_data = ds~load_ref();

export function notcoinFarmFactoryConfigToCell(
    config: NotcoinFarmFactoryConfig,
): Cell {
  return beginCell()
    .storeCoins(0) // total deposited balance
    .storeCoins(0) // pool
    .storeInt(0, 4) // status
    .storeUint(0, 32) // miner rate
    .storeUint(0, 32) // dev fee
    .storeUint(0, 32) // daily rate
    .storeAddress(config.adminAddress)
    .storeAddress(config.coAdminAddress)
    .storeRef(config.notcoinFarmWalletCode)
    .storeRef(beginCell().endCell())
    .endCell();
}

export class NotcoinFarmFactory implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new NotcoinFarmFactory(address)
    }

    static createFromConfig(
        config: NotcoinFarmFactoryConfig,
        code: Cell,
        workchain = 0,
    ) {
        const data = notcoinFarmFactoryConfigToCell(config)
        const init = { code, data }
        return new NotcoinFarmFactory(contractAddress(workchain, init), init)
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        })
    }

  async sendUpdateFactoryJettonAddr(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    jtAddr: Address
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Op.update_factory_jetton_addr, 32)
        .storeAddress(jtAddr)
        .endCell(),
    });
  }

  async sendUpdateFactoryData(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    options: { notMinerRate: number; devFee: number; dailyRate: number }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Op.update_factory_data, 32)
        .storeUint(options.notMinerRate, 32)
        .storeUint(options.devFee, 32)
        .storeUint(options.dailyRate, 32)
        .endCell(),
    });
  }

  async getUserNotcoinFarmWalletAddress(
    provider: ContractProvider,
    address: Address
  ): Promise<Address> {
    const resp = await provider.get("get_user_notcoin_farm_wallet_address", [
      {
        type: "slice",
        cell: beginCell().storeAddress(address).endCell(),
      },
    ]);

        return resp.stack.readAddress()
    }

  async getFactoryData(provider: ContractProvider) {
    const resp = await provider.get("get_factory_data", []);
    return {
      totalDepositBalance: resp.stack.readNumber(),
      pool: resp.stack.readNumber(),
      status: resp.stack.readNumber(),
      notMinerRate: resp.stack.readNumber(),
      devFee: resp.stack.readNumber(),
      dailyRate: resp.stack.readNumber(),
      adminAddress: resp.stack.readAddress(),
      coAdminAddress: resp.stack.readAddress(),
      farmWalletCode: resp.stack.readCell(),
      additionalData: resp.stack.readCell(),
    };
  }
}

// int total_deposit_balance,
// int factory_pool,
// int status,
// int notMinerRate,
// int devFee,
// int dailyRate,
// slice admin_address,
// slice co_admin_address,
// cell notcoin_farm_wallet_code,
// cell additional_data
