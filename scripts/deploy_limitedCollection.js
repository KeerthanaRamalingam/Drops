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

    //First Collection
    await LimitedCollectionProxy.createCollection("101");
    await new Promise(res => setTimeout(res, 10000));

    const Collection = await LimitedCollectionProxy.getCollection(accounts[0], "101");
    console.log("First Collection Address", Collection);

    //Second Collection
    await LimitedCollectionProxy.createCollection("102");
    await new Promise(res => setTimeout(res, 10000));

    const CollectionTwo = await LimitedCollectionProxy.getCollection(accounts[0], "102");
    console.log("Second Collection Address", CollectionTwo);

    //Third Collection
    await LimitedCollectionProxy.createCollection("103");
    await new Promise(res => setTimeout(res, 10000));

    const CollectionThree = await LimitedCollectionProxy.getCollection(accounts[0], "103");
    console.log("Third Collection Address", CollectionThree);


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


     //First Collection
    const collection = await ethers.getContractFactory('LimitedCollection');
    const collectionInstance = await collection.attach(Collection);
    
    await collectionInstance.initialize(treasuryProxy.address, "Prime Collection ETH mainnet - 02 - Kiddo Monkeys 14919", "101", 20, startTime, endTime, true, conversion.address, ["Size", "Color", "Gender","Category","Theme","Style"], ["Male"], ["NFTs are unique cryptographic tokens that exist on a blockchain and cannot be replica", "https://ipfs.io/ipfs/QmRECTS8gSXLbRgomsrvi7nY6x2SCVPER4f1jSUxWpxaRu/nft.jpg", "Art & Gaming", "Pixel Art 2022", "prime", "drops", "true", "outfit"]);
    await new Promise(res => setTimeout(res, 5000));

    //Second Collection
    const collectionInstanceTwo = await collection.attach(CollectionTwo);

    await collectionInstanceTwo.initialize(treasuryProxy.address,"Trace Cryptopunk nft highest sale: nft art finance","102",40, startTime, endTime, false, conversion.address, ["Size", "Color", "Gender","Category","Theme","Style"], ["Male", "Female"],["The first drop features a collaboration with top digital artist FVCKRENDER that includes a custom World Pong League digital art piece which will unlock a virtual beer pong game with the the superstar singer-rapper, where millions of worthless copies of the same file exist.","https://ipfs.io/ipfs/QmQXbsaf32Qwo8f6vyubZNhDq9oYPwhapc7pvdzYE5CVM2","Art & Gaming-100","Pixel Art 2022-100","prime","drops","true","outfit"]);
    await new Promise(res => setTimeout(res, 5000));

    //Third Collection
    const collectionInstanceThree =  await collection.attach(CollectionThree);

    await collectionInstanceThree.initialize(treasuryProxy.address,"Trace Silks – Overall Best NFT Horse Racing Project","103",60, startTime, endTime, false,conversion.address,["Size", "Color", "Gender","Category","Theme","Style"], ["Male", "Female", "Unisex"], ["Players can even purchase plots of land within the Silks metaverse, which are vital to housing and maintaining Silks horses. If a player owns ten contiguous plots of land, they will be able to construct a horse farm and a stable, which provides space for up to ten horses. Finally, since each plot of land is structured as an NFT, landowners benefit from value increases by selling in the secondary market.","https://ipfs.io/ipfs/QmeXRtR4kX9H7m2Ri56nKNEuhxMpZNYjkNAAY47ckPuA6n","Horse-100","Trace Art 2022-100","other","drops","false","outfit"]);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Owner", await collectionInstance.owner());


    //// ************ ADD TOKEN TO First Collection **************/////

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

    console.log("Next token ID", await collectionInstance.getNextTokenId());
    await collectionInstance.mint(MATIC, 0, "ERC20" , "{'Gender': 'F', 'Type': 'XYZ'}", {
        value: price
    });
    await new Promise(res => setTimeout(res, 5000));

    console.log("Next token ID", await collectionInstance.getNextTokenId());

    //// ************ ADD TOKEN TO Second Collection **************/////

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceTwo.adminUpdateERC20FeeToken(MATIC, true); // Matic

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceTwo.adminUpdateERC20FeeToken(USDT, true); // USDT

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceTwo.adminUpdateERC20FeeToken(USDC, true); // USDC

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceTwo.adminUpdateERC20FeeToken(Trace, true); // Trace

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceTwo.adminUpdateERC20FeeToken(USX, true); // USX

    await collectionInstanceTwo.adminUpdateERC721FeeToken(NFTToken, true); // USDC


    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstanceTwo.tokenAddress(MATIC));

    await collectionInstanceTwo.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Mint fee", await collectionInstanceTwo.getMintFee());

    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceTwo.adminUpdateBaseURI("https://ipfs.io/ipfs/QmRXAz562Lq9n5mFCF24Jm84y5AYiDbgG4nqaQeMN4A4Jx/");
    await new Promise(res => setTimeout(res, 5000));


    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceTwo.adminUpdateDeviation(5);

    //// ************ ADD TOKEN TO Third Collection **************/////

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceThree.adminUpdateERC20FeeToken(MATIC, true); // Matic

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceThree.adminUpdateERC20FeeToken(USDT, true); // USDT

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceThree.adminUpdateERC20FeeToken(USDC, true); // USDC

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceThree.adminUpdateERC20FeeToken(Trace, true); // Trace

    await new Promise(res => setTimeout(res, 5000));
    await collectionInstanceThree.adminUpdateERC20FeeToken(USX, true); // USX

    await collectionInstanceThree.adminUpdateERC721FeeToken(NFTToken, true); // USDC


    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstanceThree.tokenAddress(MATIC));

    await collectionInstanceThree.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 5000));

    console.log("Mint fee", await collectionInstanceThree.getMintFee());

    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceThree.adminUpdateBaseURI("https://ipfs.io/ipfs/QmRXAz562Lq9n5mFCF24Jm84y5AYiDbgG4nqaQeMN4A4Jx/");
    await new Promise(res => setTimeout(res, 5000));


    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceThree.adminUpdateDeviation(5);


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
