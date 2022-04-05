const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);
    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, ["0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"], { initializer: 'initialize' })
    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin("0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"));

    //// **************************/////

    const startTime = await ethers.provider.getBlockNumber();
    const sevenDays = 7 * 24 * 60 * 60;
    const endTime = startTime + sevenDays;

    const LimitedCollection = await ethers.getContractFactory("LCMaster")
    const LimitedCollectionProxy = await upgrades.deployProxy(LimitedCollection, [treasuryProxy.address], { initializer: 'initialize' });
    console.log("LimitedCollectionProxy Proxy:", LimitedCollectionProxy.address);
    await LimitedCollectionProxy.createCollection("DROPS", "DROPS", 20, startTime, endTime, true);
    await new Promise(res => setTimeout(res, 5000));
    console.log("New collection", await LimitedCollectionProxy.getCollection(accounts[0], "DROPS"));

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
