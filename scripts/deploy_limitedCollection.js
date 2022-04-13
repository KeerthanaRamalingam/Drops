const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);
    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, [accounts[0]], { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 5000));
    console.log("Treasury proxy", treasuryProxy.address);
    await new Promise(res => setTimeout(res, 5000));
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
    console.log("Collection Address", Collection);
    const collection = await ethers.getContractFactory('LimitedCollection');
    const collectionInstance = await collection.attach(Collection);
    console.log("Owner", await collectionInstance.owner());
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateToken("0x0000000000000000000000000000000000000000", true);
    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstance.tokenAddress("0x0000000000000000000000000000000000000000"));


    await collectionInstance.adminUpdateFees("0x0000000000000000000000000000000000000000", 1000000000000000);
    await new Promise(res => setTimeout(res, 5000));
    console.log("Mint fee", await collectionInstance.mintFees("0x0000000000000000000000000000000000000000"));

    await collectionInstance.updateWhitelist([accounts[0]], [true]);
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateBaseURI("https://ipfs.io/ipfs/");
    await new Promise(res => setTimeout(res, 5000));

    console.log("Next token ID", await collectionInstance.getNextTokenId());
    await collectionInstance.mint("QmQh36CsceXZoqS7v9YQLUyxXdRmWd8YWTBUz7WCXsiVty", "0x0000000000000000000000000000000000000000", ["test"], ["test"], {
        value: 1000000000000000
    });
    await new Promise(res => setTimeout(res, 5000));
    console.log("Next token ID", await collectionInstance.getNextTokenId());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
