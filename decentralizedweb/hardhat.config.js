require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path: './.env.local'})
task("accounts","Prints the list of accounts", async(taskArgs,hre)=>{
  const accounts=await hre.ethers.getSigners();
  for(const account of accounts){
    const address=await account.getAddress();
    // const balance = await ethers.provider.getBalance(address);
    // console.log(account.chainId);
    console.log(account.address);
  }
});

const privateKey =process.env.NEXT_PUBLIC_PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    hardhat:{},
    sepolia:{
      url:  process.env.NEXT_PUBLIC_RPC_URL,
      accounts:[privateKey]
    }
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/7a523e0a48114cd8b06e0b0b4fc33c0d",
    //   accounts: ["e350225a2e97b1b36f23acfeba123ffa68511150f93138bf80279b144f5cfd1c"]
    // }
  }
};
