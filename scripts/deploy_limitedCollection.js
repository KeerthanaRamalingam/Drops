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

    const mintFee = 10000;

    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, [accounts[0]], { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 10000));

    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin(accounts[0]));

    //// **************************/////

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const startTime = blockBefore.timestamp;
    const thirtyDays = 30 * 24 * 60 * 60;
    const endTime = startTime + thirtyDays;

    const LimitedCollection = await ethers.getContractFactory("LCMasterFlat")
    const LimitedCollectionProxy = await upgrades.deployProxy(LimitedCollection, { initializer: 'initialize' });
    await new Promise(res => setTimeout(res, 10000));

    console.log("Owner", await LimitedCollectionProxy.owner());
    console.log("LimitedCollectionProxy:", LimitedCollectionProxy.address);

    //First Collection
    await LimitedCollectionProxy.createCollection("MaleWardrobe-101");
    await new Promise(res => setTimeout(res, 10000));

    const Collection = await LimitedCollectionProxy.getCollection(accounts[0], "MaleWardrobe-101");
    console.log("First Collection Address", Collection);

    //Second Collection
    await LimitedCollectionProxy.createCollection("FemaleWardrobe-102");
    await new Promise(res => setTimeout(res, 10000));

    const CollectionTwo = await LimitedCollectionProxy.getCollection(accounts[0], "FemaleWardrobe-102");
    console.log("Third Collection Address", CollectionTwo);


    //Third Collection
    await LimitedCollectionProxy.createCollection("MaleStance-103");
    await new Promise(res => setTimeout(res, 10000));

    const CollectionThree = await LimitedCollectionProxy.getCollection(accounts[0], "MaleStance-103");
    console.log("Second Collection Address", CollectionThree);


     //Fourth Collection
    await LimitedCollectionProxy.createCollection("FemaleStance-104");
    await new Promise(res => setTimeout(res, 12000));

    const CollectionFour = await LimitedCollectionProxy.getCollection(accounts[0], "FemaleStance-104");
    console.log("Fourth Collection Address", CollectionFour);


    /// ************ DEPLOY CONVERSION **************/////

    const Conversion = await ethers.getContractFactory("Conversion");
    const conversion = await upgrades.deployProxy(Conversion, { initializer: 'initialize' })
    await new Promise(res => setTimeout(res, 10000));

    console.log("conversion proxy", conversion.address);

    //// ************ ADD PRICE FEED ADDRESS **************/////

    await new Promise(res => setTimeout(res, 10000));
    await conversion.addToken(MATIC, PRICE_MATIC_USD);

    await new Promise(res => setTimeout(res, 10000));
    await conversion.addToken(USDC, PRICE_USDC_USD);

    await new Promise(res => setTimeout(res, 10000));
    await conversion.addToken(USDT, PRICE_USDT_USD);

    await new Promise(res => setTimeout(res, 10000));
    await conversion.addToken(USX, router);

    await new Promise(res => setTimeout(res, 10000));
    await conversion.addToken(Trace, router);

    await new Promise(res => setTimeout(res, 10000));
    await conversion.adminUpdate(USX, Trace, router, factory);


    //First Collection
    const collection = await ethers.getContractFactory('DropsCollection');
    const collectionInstance = await collection.attach(Collection);

    await collectionInstance.initialize(treasuryProxy.address, "Male Wardrobe Collection", "MaleWardrobe-101", 20, startTime, endTime, false, conversion.address, ["Size", "Color", "Gender", "Category", "Theme", "Style"], ["Male","Men's clothing essentials: Give your wardrobe a firm foundation with these timeless menswear essentials, from indigo jeans to a navy suit.", "https://ipfs.io/ipfs/QmRRJFxfnys7Rf7DCWVwmU29EeArTJjghjn2vSQqoFtQ44/_thumbnail.png", " Male Casual Wear", "Casual", "prime", "drops", "true", "outfit"]);
    await new Promise(res => setTimeout(res, 8000));

    //Second Collection
    const collectionInstanceTwo =  collection.attach(CollectionTwo);

    await collectionInstanceTwo.initialize(treasuryProxy.address,"Female Wardrobe Collection","FemaleWardrobe-102",60, startTime, endTime, false,conversion.address,["Size", "Color", "Gender","Category","Theme","Style"], ["Female","Designers make clothes, women make fashion. Choose from a wide range of dress for women's at great style.", "https://ipfs.io/ipfs/QmdGMpYq2rCgZHgfkwtYT9VzVFu5sbiMC3zQhEPRefckMD/_thumbnail.png","Female Casual Wear","Casual","prime","drops","true","outfit"]);
    await new Promise(res => setTimeout(res, 5000));

    //Third Collection
    const collectionInstanceThree =  collection.attach(CollectionThree);

    await collectionInstanceThree.initialize(treasuryProxy.address, "Male Stance Collection", "MaleStance-103", 40, startTime, endTime, true, conversion.address, ["Size", "Color", "Gender", "Category", "Theme", "Style"], ["Male","Choose the style you wanted to be", "https://ipfs.io/ipfs/QmboRdoXyCnMtH87FdxWnFyvZRTwxSzwGzeA58XQhQfJx5/_thumbnail.gif", "Basic Movements", "Movements", "prime", "drops", "true", "animation"]);
    await new Promise(res => setTimeout(res, 8000));


    //Fourth Collection
    const collectionInstanceFour = collection.attach(CollectionFour);

    await collectionInstanceFour.initialize(treasuryProxy.address,"Female Stance Collection", "FemaleStance-104", 40, 1654230695, endTime, true, conversion.address, ["Size", "Color", "Gender", "Category", "Theme", "Style"], ["Female","Choose the style you wanted to be", "https://ipfs.io/ipfs/QmParCKMd1bbwWNRAV3iSoHQJtoJXg5od345zmpPFPkt2C/_thumbnail.gif", "Basic Movements","Movements", "prime", "drops", "true", "animation"]);
    await new Promise(res => setTimeout(res, 8000));



    //// ************ ADD TOKEN TO First Collection **************/////

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC20FeeToken(MATIC, true); // Matic

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC20FeeToken(USDT, true); // USDT

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC20FeeToken(USDC, true); // USDC

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC20FeeToken(Trace, true); // Trace

    await new Promise(res => setTimeout(res, 10000));
    await collectionInstance.adminUpdateERC20FeeToken(USX, true); // USX

    await collectionInstance.adminUpdateERC721FeeToken(NFTToken, true); // USDC

    await new Promise(res => setTimeout(res, 10000));
    console.log("Supported token", await collectionInstance.erc20tokenAddress(MATIC));

    await collectionInstance.adminUpdateFees(mintFee);

    await collectionInstance.adminUpdateBaseURI("https://ipfs.io/ipfs/QmcLKPGBUDneGArGGVaFk4pDPKiVSyz3eBkGn3uuiQuNMN/");
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstance.adminUpdateDeviation(5);
    await new Promise(res => setTimeout(res, 5000));


    console.log("FIRST COLLECTION DONE");

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
   console.log("Supported token", await collectionInstanceTwo.erc20tokenAddress(MATIC));

   await collectionInstanceTwo.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceTwo.adminUpdateBaseURI("https://ipfs.io/ipfs/QmNtjjWNo3Kt3nXsYDF6M3e5zZryRsj4JvAf4HrSh7Qned/");
    await new Promise(res => setTimeout(res, 5000));


    await collectionInstanceTwo.adminUpdateDeviation(5);

    console.log("SECOND COLLECTION DONE");
 

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
    console.log("Supported token", await collectionInstanceThree.erc20tokenAddress(MATIC));

    await collectionInstanceThree.adminUpdateFees(mintFee);

    await new Promise(res => setTimeout(res, 5000));

    await collectionInstanceThree.adminUpdateBaseURI("https://ipfs.io/ipfs/QmdovTq5UHd2ghkZTWScLqmiGEFR1XDusr7SSkpFTYbc52/");
    await new Promise(res => setTimeout(res, 5000));


    await collectionInstanceThree.adminUpdateDeviation(5);


    console.log("THIRD COLLECTION DONE");


     //// ************ ADD TOKEN TO Fourth Collection **************/////

     await new Promise(res => setTimeout(res, 5000));
     await collectionInstanceFour.adminUpdateERC20FeeToken(MATIC, true); // Matic

     await new Promise(res => setTimeout(res, 5000));
     await collectionInstanceFour.adminUpdateERC20FeeToken(USDT, true); // USDT

     await new Promise(res => setTimeout(res, 5000));
     await collectionInstanceFour.adminUpdateERC20FeeToken(USDC, true); // USDC

     await new Promise(res => setTimeout(res, 5000));
     await collectionInstanceFour.adminUpdateERC20FeeToken(Trace, true); // Trace

     await new Promise(res => setTimeout(res, 5000));
     await collectionInstanceFour.adminUpdateERC20FeeToken(USX, true); // USX

     await collectionInstanceFour.adminUpdateERC721FeeToken(NFTToken, true); // USDC


    await new Promise(res => setTimeout(res, 5000));
    console.log("Supported token", await collectionInstanceFour.erc20tokenAddress(MATIC));

    await collectionInstanceFour.adminUpdateFees(mintFee);
     await new Promise(res => setTimeout(res, 5000));

     await collectionInstanceFour.adminUpdateBaseURI("https://ipfs.io/ipfs/QmZN5QQqCxJ7NsDm6dVuSzHKP5V4s3VztzygMvE71VQTx5/");
     await new Promise(res => setTimeout(res, 5000));

     await collectionInstanceFour.adminUpdateDeviation(5);

     console.log("FOURTH COLLECTION DONE");

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })


/*
Treasury proxy 0xE29005B2fFEB8FBbA92a859365b600aec78c9cb7
LimitedCollectionProxy: 0x681fc0F2DcD7046139ab40219F73aa140e52aE07
First Collection Address 0x3f6b633d188e354eBfe7A5175A4c6b074edaAA44
Third Collection Address 0x875ca100E54E7999Ce9a04739842b31036Be5D8f
Second Collection Address 0xA4613dBD3D2819e5fff9e4cF70bbf4199BfD773F
Fourth Collection Address 0x807f3caC715fbE935e3501CD0Fa51982F36d7390
conversion proxy 0x4Dc5AF39e3f3558396C290F5C32637AA39632C12
*/