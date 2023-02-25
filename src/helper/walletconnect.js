import Web3 from "web3";
import "@metamask/legacy-web3";
import { toast } from "react-toastify";
import config from "../lib/config";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function getmylog() {
  if (
    localStorage.getItem("walltype") &&
    localStorage.getItem("walltype") != null &&
    localStorage.getItem("walltype") != undefined &&
    localStorage.getItem("walltype") != "" &&
    localStorage.getItem("walltype") == "trust" && 
    localStorage.getItem("nilwireMetamask") && 
    localStorage.getItem("nilwireMetamask")!=null && 
    localStorage.getItem("nilwireMetamask")!=undefined && 
    localStorage.getItem("nilwireMetamask")!=""
  ) {
    var provider = new WalletConnectProvider({
      rpc: {
        [config.livechainid]: config.liverpcUrls,
      },
      chainId: config.livechainid,
    });

    provider.on("connect", () => {});

    await provider.enable();
    let web3 = new Web3(provider);
    var network = await web3.eth.net.getId();
    var result = await web3.eth.getAccounts();
    if (config.livechainid == network) {
      localStorage.setItem("walltype", "trust");
      localStorage.setItem("nilddsbashyujsd", "yes");
      localStorage.setItem("nilwireMetamask", result[0].toLowerCase());
      localStorage.setItem("nilwireMetamaskAddr", result[0].toLowerCase());
      var setacc = result[0].toLowerCase();

      var data = {
        address: result[0].toLowerCase(),
        provider: provider,
      };
      return data;
    } else {
      await provider.disconnect();
    }
  } else if(localStorage.getItem("nilwireMetamask") && 
    localStorage.getItem("nilwireMetamask")!=null && 
    localStorage.getItem("nilwireMetamask")!=undefined && 
    localStorage.getItem("nilwireMetamask")!="") {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      try {
        if (typeof web3 !== "undefined") {
          await window.ethereum.enable().then(async function () {
            const web3 = new Web3(window.web3.currentProvider);
            if (window.web3.currentProvider.isMetaMask === true) {
              if (
                window.web3 &&
                window.web3.eth &&
                window.web3.eth.defaultAccount
              ) {
                if (
                  window.web3.currentProvider.networkVersion ==
                  config.networkVersion
                ) {
                  var result = await web3.eth.getAccounts();
                  var data = {
                    address: result[0].toLowerCase(),
                  };
                  return data;
                }
              }
            }
          });
        }
      } catch (err) {}
    }
  }
}
