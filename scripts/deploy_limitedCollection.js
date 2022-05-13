const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);
    
    //Testnet Tokens
    const USDT = "0xF2fE21E854c838C66579f62Ba0a60CA84367cd8F"
    const USDC = "0xb0040280A0C97F20C92c09513b8C6e6Ff9Aa86DC"
    const MATIC = "0x0000000000000000000000000000000000000000"

    const PRICE_MATIC_USD = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"
    const PRICE_USDT_USD = "0x92C09849638959196E976289418e5973CC96d645";
    const PRICE_USDC_USD = "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0";

    const USX = "0xBE72D7FDDB9d7969507beF69f439840957E0b47c"
    const Trace = "0xb0A2D971803e74843f158B22c4DAEc154f038515"
    const router = "0x8954AfA98594b838bda56FE4C12a09D7739D179b"
    const factory = "0x5757371414417b8c6caad45baef941abc7d3ab32"
    const StableToken = USDC

    const NFTToken = "0x2fAd792b99Ca771CF9eBAB6564eD70Da5EF017e4";

    //Mainnet Tokens
    // const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    // const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    // const MATIC = "0x0000000000000000000000000000000000000000"

    // // Mainnet Conversion
    //  const PRICE_MATIC_USD = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
    //  const PRICE_USDT_USD = "0x0A6513e40db6EB1b165753AD52E80663aeA50545";
    //  const PRICE_USDC_USD = "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7";

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
    const thirtyDays = 30 * 24 * 60 * 60;
    const endTime = startTime + thirtyDays;

    const LimitedCollection = await ethers.getContractFactory("LCMasterV1")
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

    //// ************ ADD PRICE FEED ADDRESS **************/////

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(MATIC, PRICE_MATIC_USD);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(USDC, PRICE_USDC_USD);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(USDT, PRICE_USDT_USD);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(USX, router);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.addToken(Trace, router);

    await new Promise(res => setTimeout(res, 5000));
    await conversion.adminUpdate(USX, Trace, router, factory);

    const collection = await ethers.getContractFactory('LimitedCollection');
    const collectionInstance = await collection.attach(Collection);
    
    await collectionInstance.initialize(treasuryProxy.address, "Prime Collection ETH mainnet - 02 - Kiddo Monkeys 14919", "101", 20, startTime, endTime, true, conversion.address, ["Size", "Color", "Gender","Category","Theme","Style"], ["NFTs are unique cryptographic tokens that exist on a blockchain and cannot be replica", "https://ipfs.io/ipfs/QmRECTS8gSXLbRgomsrvi7nY6x2SCVPER4f1jSUxWpxaRu/nft.jpg", "Male", "Art & Gaming", "Pixel Art 2022", "prime", "drops", "true", "outfit"]);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Owner", await collectionInstance.owner());

    //// ************ ADD TOKEN TO Collection **************/////

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateERC20FeeToken(MATIC, true); // Matic

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateERC20FeeToken(USDT, true); // USDT

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateERC20FeeToken(USDC, true); // USDC

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateERC20FeeToken(Trace, true); // Trace

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstance.adminUpdateERC20FeeToken(USX, true); // USX

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC721FeeToken(NFTToken, true); // USDC

    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstance.tokenAddress(MATIC));

    await collectionInstance.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Mint fee", await collectionInstance.getMintFee());

    await collectionInstance.updateWhitelist([accounts[0]], [true]);
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateBaseURI("https://ipfs.io/ipfs/QmRXAz562Lq9n5mFCF24Jm84y5AYiDbgG4nqaQeMN4A4Jx/");
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateDeviation(5);
    await new Promise(res => setTimeout(res, 5000));

    var price = await conversion.convertMintFee(MATIC, mintFee);
    console.log("Price", price);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
