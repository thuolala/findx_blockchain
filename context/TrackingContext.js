'use client';
import { createContext, useEffect, useState } from 'react';
import Web3Modal from "web3modal"
import { ethers } from "ethers"

import tracking from "./Traceability.json"

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const ConreactABI = tracking.abi

const fetchContract = (signerOrProvider) => new ethers.Contract(ContractAddress, ConreactABI, signerOrProvider)

export const TrackingContext = createContext()

export const TrackingProvider = ({ children }) => {
    const DappName = "Supply Chain Service"
    const [ currentUser, setCurrentUser ] = useState("")

    useEffect(() => {
        const connect = async () => {
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            contract.on("ShipmentAdded", (productId, productName, category, from, to, dateAdded, status) => {
                console.log("Shipment created:", {
                    productId, 
                    productName, 
                    category, 
                    from, 
                    to, 
                    dateAdded, 
                    status
                });
                
            });
        };
    
        connect();
    }, []);

    async function fund() {
        const ethAmount = "0.1"
        console.log(`Funding with ${ethAmount}`)
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(contractAddress, abi, signer)
          const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
          })
        }
    }

    const addShipment = async (items) => {
        const {productId, productName, category, from, to, dateAdded, status } = items 
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })

            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()

            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = fetchContract(signer)
            const createItem = await contract.addShipment(
                productId, 
                productName, 
                category, 
                from, 
                to, 
                dateAdded, 
                status
            )
            if (await createItem.wait()){
                alert("Added succesfully!")
            }
        } catch (error) {
            console.log("Something went wrong", error)
        }
    }  

    const getShipment = async (productId) => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            const shipment = await contract.getShipment(productId)

            const SingleShiplent = {
                productId : shipment[0], 
                productName : shipment[1], 
                category : shipment[2], 
                from : shipment[3], 
                to : shipment[4], 
                dateAdded : shipment[5], 
                status : shipment[6]
            }
            return SingleShiplent
        } catch (error) {
            console.log("Error no shipment")
        }
    }

    const getAllShipment = async (product) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
    
            const {
                pidList,
                pnameList,
                pcateList,
                pfromList,
                ptoList,
                pdateList,
                pstatusList
            } = await contract.getAllShipmentWithId(product);
    
            const allShipments = pidList.map((pid, index) => ({
                productId: pid,
                productName: pnameList[index],
                category: pcateList[index],
                from: pfromList[index],
                to: ptoList[index],
                date: pdateList[index],
                status: pstatusList[index]
            }));
            
            return allShipments;
        } catch (err) {
            console.log("Error getting shipment:", err);
            throw err;
        }
    };   

    //CHECK WALLET
    const checkIfWalletConnected = async () => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            if(accounts.length) {
                setCurrentUser(accounts[0])
            } else {
                return "no account"
            }
        } catch (error) {
            return " not connected"
        }
    }
    //conect wallet function
    const connectWallet = async () => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setCurrentUser(accounts[0])
        } catch(error) {
            return "Something went wrong"
        }
    }

    useEffect(() => {
        checkIfWalletConnected()
    }, [])
    return (
        <TrackingContext.Provider
            value={{
                connectWallet,
                addShipment,
                DappName,
                currentUser,
                getShipment,
                getAllShipment
            }}
        >
            { children }    
        </TrackingContext.Provider>
    )
}