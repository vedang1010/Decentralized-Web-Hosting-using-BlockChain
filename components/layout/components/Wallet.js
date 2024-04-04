import styled from 'styled-components';
import { ethers } from "ethers";
import { useState } from "react";

const networks = {
    sepolia: {
        chainId: `0x${Number(11155111).toString(16)}`,
        chainName: "Sepolia Testnet",
        nativeCurrency: {
            name: "SepoliaETH",
            symbol: "SepoliaETH",
            decimals: 18,
        },
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        blockedExplorerUrls: ["https://sepolia.etherscan.io"],
    },
};

const Wallet = () => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");

    const connectWallet = async () => {
        if (!window.ethereum) {
            console.error("No Ethereum provider found");
            return;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// console.log(provider)
            // Ensure provider.network is defined before accessing its properties
            if (provider.network && provider.network.name !== "SepoliaETH") {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            ...networks["sepolia"],
                        },
                    ],
                });
            }

            const account = provider.getSigner();
            const address = await account.getAddress();
            setAddress(address);
            const balance = ethers.utils.formatEther(await account.getBalance());
            setBalance(balance);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    return (
        <ConnectWalletWrapper onClick={connectWallet}>
            {/* : */}
            {balance=='' ? <Balance></Balance>:<Balance>{balance.slice(0,4)} SepoliaETH</Balance>}
            {address=='' ? <Address>Connect to Wallet</Address>:<Address>{address.slice(0,6)}...{address.slice(39)}</Address>}
            {/* {address} {balance} */}
        </ConnectWalletWrapper>
    );
};


const ConnectWalletWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${(props) => props.theme.bgDiv};
    height: 100%;
    padding: 0 9px;
    color: ${(props) => props.theme.color};
    border-radius: 10px;
    margin-right: 15px;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: smaller;
    cursor: pointer;
    
`

const Address=styled.h2`
    background-color: ${(props)=>props.theme.bgDiv};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 5px;
    border: 10px;
    
`
const Balance=styled.h2`
    /* background-color: ${(props)=>props.theme.bgDiv}; */
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    /* padding: 0 3px 0 3px; */
    /* border: 10px; */
`
export default Wallet;
