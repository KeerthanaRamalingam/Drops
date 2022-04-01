const { ethers } = require("hardhat")

async function main() {
    const buddyTreasury = await ethers.getContractFactory("BuddyTreasury");
    const treasuryProxy = await upgrades.deployProxy(buddyTreasury, ["0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"],{ initializer: 'initialize' })
    console.log("Treasury proxy", treasuryProxy.address);
    console.log("Is admin", await treasuryProxy.isAdmin("0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076"));

    //// **************************/////

    

    const Buddy = await ethers.getContractFactory("Buddy")
    const buddyProxy = await upgrades.deployProxy(Buddy, [treasuryProxy.address, "AVATAR", "AVT"],{ initializer: 'initialize' })
    console.log("Buddy Proxy:", buddyProxy.address)
    await buddyProxy.adminUpdateToken(USX.address, true, "25000000000000000000", "10000000000000000000");
    await buddyProxy.transferOwnership("0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076");
    
    await USX.transfer("0x40a124c4849A25B9b19b2e7aFC4f07302fBb67B1", "1000000000000000000000000");

    console.log("New admin USX", await USX.owner());

    console.log("New admin Buddy", await buddyProxy.owner());
    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })


/*Treasury proxy 0xc44b98249704B331457882Bd11655c20F58fC75c
Is admin true
USX Contract: 0x956f9da3f3060B1718B0aB8d25102d803daF5a7f
Old admin 0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076
Buddy Proxy: 0x145d9A6Ffb7417eD2a58942e79b797779af0bDC2
New admin USX 0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076
New admin Buddy 0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076
*/