const { ethers } = require("hardhat");

async function main() {
    // Get the Hardhat network provider and signers 
    // const provider = ethers.provider;
    // const signers = await ethers.getSigners();

    // Deploy the UserRegistry contract 
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    const userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();
    console.log("UserRegistry deployed to:", userRegistry.target);

    // Deploy the WebsiteStorage contract
    const WebsiteStorage = await ethers.getContractFactory("WebsiteStorage");
    const websiteStorage = await WebsiteStorage.deploy();
    await websiteStorage.waitForDeployment();
    console.log("WebsiteStorage deployed to:", websiteStorage.target);

    // Deploy the DNSContract contract 
    const DNSContract = await ethers.getContractFactory("DNSContract");
    const dnsContract = await DNSContract.deploy();
    await dnsContract.waitForDeployment();
    console.log("DNSContract deployed to:", dnsContract.target);

    // Set the UserRegistry contract address in the WebsiteStorage contract 
    // const websiteStorageWithUserRegistry = WebsiteStorage.attach(websiteStorage.target);
    // await websiteStorageWithUserRegistry.setUserRegistryAddress(userRegistry.target);
    // console.log("UserRegistry address set in WebsiteStorage contract to:", userRegistry.target);

    // Deploy the DecentWeb contract 
    // const DecentWeb = await ethers.getContractFactory("DecentWeb");
    // const decentWeb = await DecentWeb.deploy(userRegistry.target, websiteStorage.target, dnsContract.target);
    // await decentWeb.waitForDeployment(); console.log("DecentWeb deployed to:", decentWeb.target);
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process. exit(1);
});