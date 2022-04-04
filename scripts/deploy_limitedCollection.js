const { ethers } = require("hardhat")

async function main() {
    const dropsTreasury = await ethers.getContractFactory("dropsTreasury");
    const treasuryProxy = await upgrades.deployProxy(dropsTreasury, ["0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"],{ initializer: 'initialize' })
    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin("0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"));

    //// **************************/////

    

    const limitedCollection = await ethers.getContractFactory("limitedCollection")
    const limitedCollectionProxy = await upgrades.deployProxy(limitedCollection, [treasuryProxy.address, "0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076", "DROPS", "DROPS",20,1649066064,1649238864],{ initializer: 'initialize' })
    console.log("limitedCollectionProxy Proxy:", limitedCollectionProxy.address)
    
    const perpetualCollection = await ethers.getContractFactory("perpetualCollection")
    const perpetualCollectionProxy = await upgrades.deployProxy(perpetualCollection, [treasuryProxy.address, "0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076", "DROPS", "DROPS",20,1649066064,0],{ initializer: 'initialize' })
    console.log("limitedCollectionProxy Proxy:", perpetualCollectionProxy.address)

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
