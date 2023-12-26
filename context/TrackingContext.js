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
            contract.on("ShipmentAdded", (shipmentId, productId, productName, category, from, to, dateAdded, status) => {
                console.log("Shipment created:", {
                    shipmentId, 
                    productId, 
                    productName, 
                    category, 
                    from, 
                    to, 
                    dateAdded, 
                    status
                });
                alert("Shipment created:", {
                    shipmentId, 
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
        const { shipmentId, productId, productName, category, from, to, dateAdded, status } = items 
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
                shipmentId, 
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

    const getShipment = async (shipmentId) => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            const shipment = await contract.getShipment(shipmentId)

            const SingleShiplent = {
                productId : shipment[0], 
                productName : shipment[1], 
                category : shipment[2], 
                from : shipment[3], 
                to : shipment[4], 
                dateAdded : shipment[5], 
                status : shipment[6]
            }

            console.log(SingleShiplent)
            alert(SingleShiplent)
            return SingleShiplent
        } catch (error) {
            console.log("Error no shipment")
        }
    }

    const getAllShipment = async () => {
        try {
       
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            const shipments = await contract.getAllTransactions()
            const allShipments = shipments.map(shipment => ({
                destination: shipment.destination,
                source: shipment.source,
                timestamp: shipment.timestamp.toNumber(),
                status: shipment.status,
                productId: shipment.productId,
                productName: shipment.productName
            }))
            return allShipments

        } catch (err) {
            console.log("Error getting shipment")
        }
    }

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