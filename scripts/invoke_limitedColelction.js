const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    // const mintFee = 10000;
    // const collection = await ethers.getContractFactory("DropsCollection")
    // const collectionInstance = await collection.attach("0xB17881583259F8A641A48923c736Dc580978eF54");

    // const Conversion = await ethers.getContractFactory("Conversion");
    // const conversion = await Conversion.attach("0x67DCd382A9a941AE2D00A6bD0A969ABe67896123")

    // await collectionInstance.adminUpdateFees(mintFee);
    // await new Promise(res => setTimeout(res, 10000));

    // var price = await conversion.convertMintFee("0x0000000000000000000000000000000000000000", mintFee);
    // console.log("Price", price);

    // console.log("Next token ID", await collectionInstance.getNextTokenId());
    // await collectionInstance.mint("0x0000000000000000000000000000000000000000", 0, "ERC20", "{'Gender': 'F', 'Type': 'XYZ'}", {
    //     value: price
    // });
    // await new Promise(res => setTimeout(res, 5000));

    // console.log("Next token ID", await collectionInstance.getNextTokenId());


    const dropsTreasury = await ethers.getContractFactory("Treasury");
    const dropsTreasuryProxy = await dropsTreasury.attach("0x64F2Ae7E4a2Cc454C19B8A9c018A26A416a16cd8");

    await dropsTreasuryProxy.withdrawFunds(accounts[0], "1405665606644653442");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
