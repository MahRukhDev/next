import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Web3 from "web3";
import "@metamask/legacy-web3";
import { toast } from "react-toastify";
import config from "../lib/config";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { toastAlert } from "../actions/toastAlert";
import { Helmet } from "react-helmet";

toast.configure();
let toasterOption = config.toasterOption;

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

var mynetwork = config.networkVersion;

export default function ConnectWallet() {
  const [accounts, setAccounts] = React.useState();

  async function walletconnect() {
    var provider = new WalletConnectProvider({
      rpc: {
        [config.livechainid]: config.liverpcUrls,
      },
      chainId: config.livechainid,
    });
    // const provider = new WalletConnectProvider({
    //   infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    // });

   

    provider.on("connect", () => {
      console.log("connect successfullly!!!!")
    });

    await provider.enable();
    let web3 = new Web3(provider);
    var network = await web3.eth.net.getId()
    var result = await web3.eth.getAccounts();
    if (1 == network) {
      setAccounts(result[0].toLowerCase());
      localStorage.setItem("walltype", "trust");
      localStorage.setItem("nilddsbashyujsd", "yes");
      localStorage.setItem("nilwireMetamask", result[0].toLowerCase());
      localStorage.setItem("nilwireMetamaskAddr", result[0].toLowerCase());
      var setacc = result[0].toLowerCase();

      web3.eth.getBalance(setacc).then(async (val) => {
        var balance = val / 1000000000000000000;
        localStorage.setItem("balance", balance);
        window.location.href = "/";
      });
    } else {
      await provider.disconnect();
      toastAlert(
        "error",
        "please select Mainnet  network on your wallet",
        "network"
      );
    }
  }

  async function connectMetamask() {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      try {
        if (typeof web3 !== "undefined") {
          window.ethereum.enable().then(async function () {
            const web3 = new Web3(window.web3.currentProvider);
            if (window.web3.currentProvider.networkVersion == mynetwork) {
              if (window.web3.currentProvider.isMetaMask === true) {
                await web3.eth.getAccounts(async function (error, result) {
                  setAccounts(result[0].toLowerCase());
                  localStorage.setItem("walltype", "metamask");
                  localStorage.setItem("nilddsbashyujsd", "yes");
                  localStorage.setItem(
                    "nilwireMetamask",
                    result[0].toLowerCase()
                  );
                  localStorage.setItem(
                    "nilwireMetamaskAddr",
                    result[0].toLowerCase()
                  );
                  var setacc = result[0].toLowerCase();

                  web3.eth.getBalance(setacc).then(async (val) => {
                    var balance = val / 1000000000000000000;
                    localStorage.setItem("balance", balance);
                  });

                  var data = {
                    myaddress: setacc,
                  };

                  // var mylist = await storeAddressinDb(data);
                  window.location.href = "/";
                });
              }
            } else {
              toast.warning(
                "Please connect to Ethereum (ETH) mainnet",
                toasterOption
              );
            }
          });
        } else {
          toast.warning("Please add Metamask plugin", toasterOption);
        }
      } catch (err) {}
    } else {
      toast.warning("Please add Metamask plugin", toasterOption);
    }
  }

  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Connect Wallet</title>
      </Helmet>
      <ScrollToTopOnMount />
      <Header />
      <div className="no-bottom no-top" id="content">
        <section id="subheader" class="text-light">
          <div class="center-y relative text-center">
            <div class="container">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h1>Wallet</h1>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </section>
        <section aria-label="section" className="pt30 pb30">
          <div class="container">
            <div class="row">
              <div class="col-lg-6 mb30">
                <a class="box-url" href="#" onClick={connectMetamask}>
                  <span class="box-url-label">Most Popular</span>
                  <img
                    src={require("../assets/images/wallet/1.png")}
                    alt=""
                    class="mb20"
                  />
                  <h4>Metamask</h4>
                  <p>
                    Start exploring blockchain applications in seconds. Trusted
                    by over 1 million users worldwide.
                  </p>
                </a>
              </div>
              <div class="col-lg-6 mb30">
                <a class="box-url" href="#" onClick={walletconnect}>
                  <span class="box-url-label">Most Popular</span>
                  <img
                    src={require("../assets/images/wallet/4.png")}
                    alt=""
                    class="mb20"
                  />
                  <h4>WalletConnect</h4>
                  <p>
                    Open source protocol for connecting decentralised
                    applications to mobile wallets.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
