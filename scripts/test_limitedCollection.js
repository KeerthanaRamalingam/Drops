const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const mintFee = 10000;
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

    const LimitedCollection = await ethers.getContractFactory("LCMasterV1")
    const LimitedCollectionProxy = await LimitedCollection.attach("0xDfafFEF798926BAf37d19739653ADc1b612314f8");
    await new Promise(res => setTimeout(res, 10000));

    // console.log("Owner", await LimitedCollectionProxy.owner());
    console.log("LimitedCollectionProxy:", LimitedCollectionProxy.address);

    // await LimitedCollectionProxy.createCollection("Background-101");
    // await new Promise(res => setTimeout(res, 10000));

    const Collection = await LimitedCollectionProxy.getCollection(accounts[0], "Background-101");
    console.log("Third Collection Address", Collection);

    const collection = await ethers.getContractFactory('DropsCollection');

    const collectionInstanceThree =  await collection.attach("0x19eF2FecD39752972887f63C569F5641bCCeE5d7");

    // await collectionInstanceThree.initialize("0xdD0C3DB80b4DD3f33de194935ebC669bF8088169", "Background NFTs", "Background-101", 0, "1653874200", 0, false, "0xa845D77F381e1293De3f649db5791ADFFb7471a7", ["Size", "Color", "Gender", "Category", "Theme", "Style"], ["Male", "Female", "Unisex"], ["Backgroud NFTs", "https://ipfs.io/ipfs/QmQMnRt9EHG85pEhgdHh5X7s7zMCJt9JrvDLYDRq4biTpQ/background.jpg", "Basic Backgrounds", "Basic", "other", "drops", "false", "background"]);
    // await new Promise(res => setTimeout(res, 5000));

    console.log("Owner", await collectionInstanceThree.owner());

    //// ************ ADD TOKEN TO Third Collection **************/////

    // await new Promise(res => setTimeout(res, 5000));
    // await collectionInstanceThree.adminUpdateERC20FeeToken(MATIC, true); // Matic

    // await new Promise(res => setTimeout(res, 5000));
    // await collectionInstanceThree.adminUpdateERC20FeeToken(USDT, true); // USDT

    // await new Promise(res => setTimeout(res, 5000));
    // await collectionInstanceThree.adminUpdateERC20FeeToken(USDC, true); // USDC

    // await new Promise(res => setTimeout(res, 5000));
    // await collectionInstanceThree.adminUpdateERC20FeeToken(Trace, true); // Trace

    // await new Promise(res => setTimeout(res, 5000));
    // await collectionInstanceThree.adminUpdateERC20FeeToken(USX, true); // USX

    // await collectionInstanceThree.adminUpdateERC721FeeToken(NFTToken, true); // USDC


    // await new Promise(res => setTimeout(res, 5000));
    // console.log("Supported token", await collectionInstanceThree.erc20tokenAddress(MATIC));

    // await collectionInstanceThree.adminUpdateFees(mintFee);
    // await new Promise(res => setTimeout(res, 5000));

    // console.log("Mint fee", await collectionInstanceThree.getMintFee());

    // await new Promise(res => setTimeout(res, 5000));

    // await collectionInstanceThree.adminUpdateBaseURI("https://ipfs.io/ipfs/QmRXAz562Lq9n5mFCF24Jm84y5AYiDbgG4nqaQeMN4A4Jx/");
    // await new Promise(res => setTimeout(res, 5000));


    // await new Promise(res => setTimeout(res, 5000));

    // await collectionInstanceThree.adminUpdateDeviation(5);


    const Conversion = await ethers.getContractFactory("Conversion");
    const conversion = await Conversion.attach("0x67DCd382A9a941AE2D00A6bD0A969ABe67896123")

    await collectionInstanceThree.adminUpdateFees(mintFee);
    await new Promise(res => setTimeout(res, 10000));

    var price = await conversion.convertMintFee("0x0000000000000000000000000000000000000000", mintFee);
    console.log("Price", price);

    console.log("Next token ID", await collectionInstanceThree.getNextTokenId());
    await collectionInstanceThree.mint("0x0000000000000000000000000000000000000000", 0, "ERC20", "{'Gender': 'M', 'Type': 'XYZ'}", {
        value: price
    });
    await new Promise(res => setTimeout(res, 5000));

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
