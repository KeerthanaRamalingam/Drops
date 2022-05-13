const { ethers } = require("hardhat")

async function main() {
    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts", accounts[0]);

    const drops = await ethers.getContractFactory("LimitedCollection")
    const dropsProxy = await drops.attach("0x433c5e166bB4A9Af1eE0ED81b634c21DA45891b6")

    console.log("Next token ID", await dropsProxy.getNextTokenId());

    const token721 = await ethers.getContractFactory("Token721");
    const Token721 = await token721.attach("0x2fAd792b99Ca771CF9eBAB6564eD70Da5EF017e4");

    // await new Promise(res => setTimeout(res, 5000));
    // await Token721.mint(accounts[0], 12);
    // console.log("here");

    // await new Promise(res => setTimeout(res, 5000));
    // await Token721.approve(dropsProxy.address, 12);

    // await dropsProxy.mint(Token721.address, 12, "ERC721", {
    //     // value: await ethers.utils.parseEther('2'),
    // });

    await new Promise(res => setTimeout(res, 5000));
    await dropsProxy.mint("0x0000000000000000000000000000000000000000", 0, "ERC20", {
        value: await ethers.utils.parseEther('1.82'),
    });

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
