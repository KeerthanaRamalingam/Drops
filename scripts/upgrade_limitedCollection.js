async function main() {
    const Buddy = await ethers.getContractFactory("BuddyV1")
    let buddyProxy = await upgrades.upgradeProxy("0x145d9A6Ffb7417eD2a58942e79b797779af0bDC2", Buddy)
    console.log("Your upgraded proxy is done!", buddyProxy.address);
    // const buddyProxy = await Buddy.attach("0x016506702D2e1B441ca661615EE929F798931B7e");
    await buddyProxy.adminUpdateToken("0x956f9da3f3060B1718B0aB8d25102d803daF5a7f", true, "25000000000000000000", "10000000000000000000");
    await buddyProxy.transferOwnership("0xdC4A5fC7A3C2dd304F7B44a7954fD4E5cB64c076");
    console.log(await buddyProxy.owner());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
