const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const treasury = "0xd350854f1cA77EC5a2F151F5162121FEacc679F0"

    const conversion = "0x0069d9D3c4d62273611AB06D79825ECFd8D393BF"

    const LimitedCollection = await ethers.getContractFactory("DropsMaster")
    const LimitedCollectionProxy = await upgrades.deployProxy(LimitedCollection, { initializer: 'initialize' });
    await new Promise(res => setTimeout(res, 10000));

    console.log("Owner", await LimitedCollectionProxy.owner());
    console.log("LimitedCollectionProxy:", LimitedCollectionProxy.address);

    // const dropsTreasury = await ethers.getContractFactory("Treasury");
    // const treasuryProxy = await upgrades.deployProxy(dropsTreasury, ["0x40a124c4849A25B9b19b2e7aFC4f07302fBb67B1"], { initializer: 'initialize' })
    // await new Promise(res => setTimeout(res, 15000));

    // console.log("Treasury proxy", treasuryProxy.address);
    // console.log("Is admin", await treasuryProxy.isAdmin("0x40a124c4849A25B9b19b2e7aFC4f07302fBb67B1"));

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
