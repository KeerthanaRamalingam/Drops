const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const USDT = "0xF2fE21E854c838C66579f62Ba0a60CA84367cd8F"
    const USDC = "0xb0040280A0C97F20C92c09513b8C6e6Ff9Aa86DC"
    const MATIC = "0x0000000000000000000000000000000000000000"

    // Mainnet
    // const PRICE_MATIC_USD = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
    // const PRICE_USDT_USD = "0x0A6513e40db6EB1b165753AD52E80663aeA50545";
    // const PRICE_USDC_USD = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7";

    const PRICE_MATIC_USD = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"
    const PRICE_USDT_USD = "0x92C09849638959196E976289418e5973CC96d645";
    const PRICE_USDC_USD = "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0";

    const mintFee = 100000000;

    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, [accounts[0]], { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 5000));

    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin(accounts[0]));

    //// **************************/////

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const startTime = blockBefore.timestamp;
    const tenDays = 10 * 24 * 60 * 60;
    const endTime = startTime + tenDays;

    const LimitedCollection = await ethers.getContractFactory("LCMaster")
    const LimitedCollectionProxy = await upgrades.deployProxy(LimitedCollection, { initializer: 'initialize' });
    await new Promise(res => setTimeout(res, 5000));

    console.log("Owner", await LimitedCollectionProxy.owner());
    console.log("LimitedCollectionProxy:", LimitedCollectionProxy.address);

    await LimitedCollectionProxy.createCollection("101");
    await new Promise(res => setTimeout(res, 10000));

    const Collection = await LimitedCollectionProxy.getCollection(accounts[0], "101");
    console.log("Collection Address", Collection);

    /// ************ DEPLOY CONVERSION **************/////

    const Conversion = await ethers.getContractFactory("Conversion");
    const conversion = await upgrades.deployProxy(Conversion, { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 5000));

    console.log("conversion proxy", conversion.address);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(MATIC, PRICE_MATIC_USD);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(USDC, PRICE_USDC_USD);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(USDT, PRICE_USDT_USD);

    const collection = await ethers.getContractFactory('LimitedCollection');
    const collectionInstance = await collection.attach(Collection);
    await collectionInstance.initialize(treasuryProxy.address, "Prime Collection ETH mainnet - 02 - Kiddo Monkeys 14919", "101", 20, startTime, endTime, true, conversion.address, ["Size", "Color", "Gender","Category","Theme","Style"], ["NFTs are unique cryptographic tokens that exist on a blockchain and cannot be replica", "https://ipfs.io/ipfs/QmRECTS8gSXLbRgomsrvi7nY6x2SCVPER4f1jSUxWpxaRu/nft.jpg", "Male", "Art & Gaming", "Pixel Art 2022", "prime", "drops", "true", "outfit"]);
    await new Promise(res => setTimeout(res, 5000));


    console.log("Owner", await collectionInstance.owner());

    //// ************ ADD TOKEN TO Collection **************/////

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateFeeToken(MATIC, true); // Matic

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateFeeToken(USDT, true); // USDT

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateFeeToken(USDC, true); // USDC

    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstance.tokenAddress(MATIC));

    await collectionInstance.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Mint fee", await collectionInstance.getMintFee());

    await collectionInstance.updateWhitelist([accounts[0]], [true]);
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateBaseURI("https://ipfs.io/ipfs/QmRXAz562Lq9n5mFCF24Jm84y5AYiDbgG4nqaQeMN4A4Jx/");
    await new Promise(res => setTimeout(res, 5000));


    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateDeviation(5);

    var price = await conversion.convertMintFee(MATIC, mintFee);
    console.log("Price", price);

    console.log("Next token ID", await collectionInstance.getNextTokenId());
    await collectionInstance.mint(MATIC, 0, "erc20" ,{
        value: price
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
