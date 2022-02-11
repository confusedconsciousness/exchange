import React, {useEffect, useState} from "react";

import {ethers} from 'ethers'
import {contractAddress, contractABI} from "../lib/constants";
import {client} from "../lib/sanityClient";

export const TransactionContext = React.createContext()

let eth;

if (typeof window !== "undefined") {
    eth = window.ethereum
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(eth)
    const signer = provider.getSigner()
    return new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    )
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
    })


    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {

        if (!currentAccount) return
        (async () => {
            const userDoc = {
                _type: 'users',
                _id: currentAccount,
                userName: 'Unnamed',
                address: currentAccount
            }
            await client.createIfNotExists(userDoc)
        })()

    }, currentAccount)

    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install Metamask!")
            const accounts = await metamask.request({method: 'eth_requestAccounts'})
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.error(error)
            throw new Error("No Ethereum Object")
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert("Please install Metamask!")
            const accounts = await metamask.request({method: 'eth_accounts'})
            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            console.error(error)
            throw new Error("No Ethereum Object")
        }
    }

    const sendTransaction = async (metamask = eth,
                                   connectedAccount = currentAccount) => {

        try {
            if (!metamask) return alert("Please install Metamask!")
            const {addressTo, amount} = formData
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount)

            await metamask.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: connectedAccount,
                        to: addressTo,
                        gas: '0x7Ef40',
                        value: parsedAmount._hex,
                    }
                ]
            })

            const transactionHash = await transactionContract.publishTransaction(
                addressTo,
                parsedAmount,
                `Transferring ${parsedAmount} ETH to ${addressTo}`,
                'TRANSFER')

            setIsLoading(true)

            await transactionHash.wait()

            // Database
            await saveTransaction(transactionHash.hash, amount, connectedAccount, addressTo)

            setIsLoading(false)

        } catch (error) {
            console.error(error)
        }
    }

    const saveTransaction = async (
        txnHash,
        amount,
        fromAddress = currentAccount,
        toAddress
    ) => {
        const txDoc = {
            _type: 'transactions',
            _id: txnHash,
            fromAddress: fromAddress,
            toAddress: toAddress,
            timestamp: new Date(Date.now()).toISOString(),
            txnHash: txnHash,
            amount: parseFloat(amount)
        }

        await client.createIfNotExists(txDoc)

        await client
            .patch(currentAccount)
            .setIfMissing({transactions: []})
            .insert('after', 'transactions[-1]', [
                {
                    _key: txnHash,
                    _ref: txnHash,
                    _type: 'reference'
                }
            ])
            .commit()
        return
    }

    const handleChange = (e, name) => {
        setFormData(previousState => ({...previousState, [name]: e.target.value}))
    }

    return (<TransactionContext.Provider
        value={{
            currentAccount,
            connectWallet,
            sendTransaction,
            handleChange,
            formData
        }}>
        {children}
    </TransactionContext.Provider>)
}

