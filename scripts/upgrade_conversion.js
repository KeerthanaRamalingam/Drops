async function main() {
    const upgradeConversion = await ethers.getContractFactory("ConversionV1")
    let upgradeConversionProxy = await upgrades.upgradeProxy("0xA0e255CD8759138a92e487267657521d9F5570e9", upgradeConversion)
    console.log("Your upgraded proxy is done!", upgradeConversionProxy.address)
    console.log(await upgradeConversionProxy.owner())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
