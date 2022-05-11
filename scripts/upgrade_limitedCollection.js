const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const master = await ethers.getContractFactory("LCMasterV1")
    let LCMaster = await upgrades.upgradeProxy("0x8a11870DCCb2CA0b85ceC01B13B401a93c76fA9F", master)
    console.log("Your upgraded proxy is done!", LCMaster.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
