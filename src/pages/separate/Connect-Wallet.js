import React, { useEffect, useState, useRef } from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";

import Web3 from "web3";
import "@metamask/legacy-web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

import $ from "jquery";
import axios from "axios";
import config from "../../lib/config";
//import styles from "assets/jss/material-kit-react/views/landingPage.js";
// https://data-seed-prebsc-1-s1.binance.org:8545/
import { AddLikeAction, GetLikeDataAction } from "../../actions/v1/token";
import {
  AddressUserDetails_GetOrSave_Action,
  Collectibles_Get_Action,
  changeReceiptStatus_Action,
} from "../../actions/v1/user";
import { getmylog } from "../../helper/walletconnect";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

//const useStyles = makeStyles(styles);

export default function ConnectWallet(props) {
  //const classes = useStyles();
  const { ...rest } = props;

  const { WalletConnected } = props;

  const timerRef = useRef(null);

  useEffect(() => {
    getInit();
  }, []);
  async function getInit() {
    connect_Wallet();
  }

  let web3;
  // head to blocknative.com to create a key
  const BLOCKNATIVE_KEY = "blocknative-api-key";
  // the network id that your dapp runs on
  const NETWORK_ID = 1;

  async function connect_Wallet() {
    window.$(".modal").modal("hide");
    if (
      localStorage.getItem("walltype") &&
      localStorage.getItem("walltype") != null &&
      localStorage.getItem("walltype") != undefined &&
      localStorage.getItem("walltype") != "" &&
      localStorage.getItem("walltype") == "trust" && localStorage.getItem("nilwireMetamask") && 
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
        props.Set_UserAccountAddr(result[0].toLowerCase());
        props.Set_WalletConnected(true);
        var result = await web3.eth.getAccounts();
        var setacc = result[0].toLowerCase();
        props.Set_Accounts(setacc);
        web3.eth.getBalance(setacc).then((val) => {
          var balance = val / 1000000000000000000;
          props.Set_UserAccountBal(balance);
          AfterWalletConnected();
          var data = {
            address: result[0].toLowerCase(),
            provider: provider,
          };
          return data;
        });
      } else {
        await provider.disconnect();
      }
    } else if(localStorage.getItem("nilwireMetamask") && 
    localStorage.getItem("nilwireMetamask")!=null && 
    localStorage.getItem("nilwireMetamask")!=undefined && 
    localStorage.getItem("nilwireMetamask")!=""){
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
                    props.Set_UserAccountAddr(result[0].toLowerCase());
                    props.Set_WalletConnected(true);
                    var setacc = result[0].toLowerCase();
                    props.Set_Accounts(setacc);
                    web3.eth.getBalance(setacc).then((val) => {
                      var balance = val / 1000000000000000000;
                      props.Set_UserAccountBal(balance);
                      AfterWalletConnected();
                    });
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
  async function AfterWalletConnected() {
    await AddressUserDetails_GetOrSave_Call();
    props.AfterWalletConnected();
  }
  async function AddressUserDetails_GetOrSave_Call() {
    var mydata = await getmylog();
    const web3 = new Web3(
      mydata &&
      mydata.provider &&
      mydata.provider != null &&
      mydata.provider != undefined &&
      mydata.provider != ""
        ? mydata.provider
        : window.ethereum
    );
    var addr = await web3.eth.getAccounts();
    var ReqData = { addr: addr[0].toLowerCase() };
    var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
    if (Resp && Resp.data && Resp.data.data) {
      props.Set_AddressUserDetails(Resp.data.data.User);
    } else {
      props.Set_AddressUserDetails({});
    }
    return true;
  }
  try {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", function (accounts) {
          window.location.reload(true);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            connect_Wallet();
          }, 1000);
        });

        window.ethereum.on("networkChanged", function (networkId) {
          if (networkId == config.networkVersion) {
            window.location.reload(true);

            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              connect_Wallet();
            }, 1000);
            props.Set_WalletConnected(true);
          } else {
            props.Set_WalletConnected(false);
          }
        });
      }
    });
  } catch (e) {}
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  let subtitle;
  const [WalletConnectNotifyPopup, Set_WalletConnectNotifyPopup] =
    React.useState(false);

  function openModal() {
    Set_WalletConnectNotifyPopup(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    Set_WalletConnectNotifyPopup(false);
  }

  var WalletConnectNotifyPopup_test = "";

  if (WalletConnected) {
    WalletConnectNotifyPopup_test = false;
  } else {
    WalletConnectNotifyPopup_test = true;
  }

  var pathVal = "";

  const location = useLocation();
  if (location.pathname) {
    if (location.pathname.split("/").length >= 2) {
      pathVal = location.pathname.split("/")[1];
    }
  }

  const [location_pathname, Set_location_pathname] = useState(pathVal);

  const connect_Wallet_call = (type) => {
    // if(WalletConnected!=true) {
    //   connect_Wallet(type);
    // }
  };

  return (
    <div>
      {props.fullLoader && <div class="loading"></div>}
      {/* {(
        (WalletConnected == false || WalletConnected == 'false')
        &&
        (
          location_pathname == 'my-items'
          || location_pathname == 'following'
          || location_pathname == 'activity'
          || location_pathname == 'info'
        )
      ) &&
      <Modal
        isOpen={true}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modaltest" style={{opacity:2, position:'relative'}}>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Network</h2>
          <div>Connect to ETH Network.</div>
        </div>
      </Modal>
      } */}

      <div
        id="connect_Wallet_call"
        onClick={() => connect_Wallet_call("metamask")}
      ></div>
    </div>
  );
}
