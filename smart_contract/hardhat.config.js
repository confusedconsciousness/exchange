require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/9a039oF-S2qXBqH-B6Z_TrJJLFo2kNzZ",
      accounts: [
          '5c1507ec272739ee015ba70f41bd623215dd4ca794df1b752b589e3401c03bac'
      ]
    }
  }
};
