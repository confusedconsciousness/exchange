const hre = require('hardhat')

const main = async () => {
    const transactionFactory = await hre.ethers.getContractFactory('Transaction')
    const transactionContract = await transactionFactory.deploy()

    await transactionContract.deployed()

    console.log('Transaction.sol deployed to: ', transactionContract.address)
}
(async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()