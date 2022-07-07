const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const master = await ethers.getContractFactory("DropsMaster")
    let LCMaster = await upgrades.upgradeProxy("0x2544D7F208fC7A16d10c2E00431169D0D033E9c9", master)
    console.log("Your upgraded proxy is done!", LCMaster.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
