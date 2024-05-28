import { Address } from "@ton/core";
import { NotcoinFarmFactory } from "./NotcoinFarmFactory";
import { NotcoinFarmWallet } from "./NotcoinFarmWallet";
import { JettonMinter } from "./JettonMinter";
import { JettonWallet } from "./JettonWallet";
import { TonClient } from "@ton/ton";

abstract class Op {
  static stake_notification = 120;
  static unstake = 121;
  static unstake_notification = 123;
  static claim_rewards_notification = 200;
  static claim_rewards = 201;
  static compound = 400;
  static compound_notification = 501;
  static withdraw_token = 600;
  static withdraw_excess_ton = 990;
  static sent_data = 991;
  static withdraw_deposits = 981;
  static initialize_contract = 130;
  static update_factory_jetton_addr = 144;
  static update_factory_data = 145;
  static compound_and_claim_rewards = 1002;
  static change_admin = 957;
  static change_co_admin = 982;
}

const testAddrJettonMinter = Address.parse(
  "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"
);

const notcoinFarmFactoryAddress = Address.parse(
  "EQAJOCaJ3IFYoDTwYsnFllQXe5LbC4epVQhPjZ09kiFlVsfP"
);
// open farm factory contract
function openFarmFactory(provider: TonClient) {
  if (!provider) return;
  const fc = provider.open(
    NotcoinFarmFactory.createFromAddress(notcoinFarmFactoryAddress)
  );

  return fc;
}

// get farm wallet addr from farm Factory
async function getUserFarmWalletAddr(
  provider: TonClient,
  userAddress: Address
) {
  if (!provider) return;
  const notcoinFarmFactory = openFarmFactory(provider);

  try {
    const farmWalletAddress =
      await notcoinFarmFactory.getUserNotcoinFarmWalletAddress(userAddress);
    return farmWalletAddress;
  } catch (err) {
    console.log(err);
  }
}

// open farm wallet contract
function openFarmWallet(provider: TonClient, farmWalletAddr: Address) {
  if (!provider) return;
  const farmWallet = provider.open(
    NotcoinFarmWallet.createFromAddress(farmWalletAddr)
  );

  return farmWallet;
}

function openJettonMinter(provider: TonClient) {
  if (!provider) return;
  const minter = provider.open(
    JettonMinter.createFromAddress(testAddrJettonMinter)
  );
  return minter;
}

// get jettonWallet Address from jetton minter
async function getUserJettonAddr(provider: TonClient, userAddress: Address) {
  if (!provider) return;
  const minter = openJettonMinter(provider);

  try {
    const jettonWalletAddr = await minter.getWalletAddress(userAddress);

    return jettonWalletAddr;
  } catch (err) {
    console.log(err);
  }
}

// open jetton wallet Contract
function openJettonWallet(provider: TonClient, jettonWalletAddr: Address) {
  if (!provider) return;
  const jettonWallet = provider.open(
    JettonWallet.createFromAddress(jettonWalletAddr)
  );

  return jettonWallet;
}

export {
  Op,
  testAddrJettonMinter,
  notcoinFarmFactoryAddress,
  openFarmFactory,
  getUserFarmWalletAddr,
  openFarmWallet,
  getUserJettonAddr,
  openJettonWallet,
};
