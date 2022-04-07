const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);
    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, [accounts[0]], { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 5000));
    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin(accounts[0]));

    //// **************************/////

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const startTime = blockBefore.timestamp;
    const sevenDays = 7 * 24 * 60 * 60;
    const endTime = startTime + sevenDays;

    const LimitedCollection = await ethers.getContractFactory("LCMaster")
    const LimitedCollectionProxy = await upgrades.deployProxy(LimitedCollection, [treasuryProxy.address], { initializer: 'initialize' });
    await new Promise(res => setTimeout(res, 5000));
    console.log("LimitedCollectionProxy:", LimitedCollectionProxy.address);
    await LimitedCollectionProxy.createCollection("DROPS-101", "DROPS", 20, startTime, endTime, true, ["Size", "Color", "Gender"], accounts[0]);
    await new Promise(res => setTimeout(res, 5000));
    const Collection = await LimitedCollectionProxy.getCollection(accounts[0], "DROPS-101");
    console.log(Collection);
    const collection = await ethers.getContractFactory('LimitedCollection');
    const collectionInstance = await collection.attach(Collection);
    console.log("Owner", await collectionInstance.owner());

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
