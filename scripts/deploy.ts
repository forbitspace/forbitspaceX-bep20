import { resolve } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { run, ethers } from "hardhat";
import { ChainId } from "./constants/chain_id";
import { WBNB_ADDRESSES } from "./constants/addresses";

async function main() {
  await run("compile");
  const [signer] = await ethers.getSigners();
  const chainId: ChainId = await signer.getChainId();

  console.log("chainId >>>", chainId);

  const WBNB_ADDRESS: string = WBNB_ADDRESSES[chainId];
  console.log(WBNB_ADDRESS);

  const NEW_OWNER_ADDRESS = "";
  const ADMIN_ADDRESS = "0x22579D1B78F9D7ECb6A7038b26E15dBEdd0492E3";
  const contractName = "forbitspaceX";
  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(WBNB_ADDRESS, ADMIN_ADDRESS);
  await contract.deployed();
  console.log(`${contractName} deployed to >>>`, contract.address);

  // await writeContractJson(
  //   chainId,
  //   contract.address,
  //   `../artifacts/contracts/${contractName}.sol/${contractName}.json`,
  //   `../abis/${contractName}.json`
  // );

  if (NEW_OWNER_ADDRESS && NEW_OWNER_ADDRESS != "") {
    console.log("Transfer owner");

    await contract.transferOwnership(NEW_OWNER_ADDRESS);
  }

  console.log("success");
}

async function writeContractJson(
  chainId: ChainId,
  address: string,
  src: string,
  dest: string
) {
  var data: any = await readFileSync(
    resolve(__dirname, existsSync(resolve(__dirname, dest)) ? dest : src)
  );
  data = JSON.parse(data.toString());
  console.log(data.addresses);
  if (!data.addresses)
    data.addresses = {
      [ChainId.BSC_MAINNET]: "",
      [ChainId.BSC_TESTNET]: ""
    };
  data.addresses[chainId] = address;
  await writeFileSync(resolve(__dirname, dest), JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
