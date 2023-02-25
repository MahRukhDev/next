import React, { forwardRef, useImperativeHandle } from "react";
import { Button, TextField } from "@material-ui/core";

import Web3 from "web3";
import "@metamask/legacy-web3";
import $ from "jquery";
import config from "../../lib/config";
import { getmylog } from "../../helper/walletconnect";

import { AddLikeAction, GetLikeDataAction } from "../../actions/v1/token";

import { getCurAddr } from "../../actions/v1/user";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

export const WalletRef = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    async GetUserBal() {
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
      var currAddr = await web3.eth.getAccounts();
      if (typeof currAddr !== "undefined" && currAddr) {
        props.Set_UserAccountAddr(currAddr[0].toLowerCase());
        props.Set_WalletConnected(true);
        var result = await web3.eth.getAccounts();
        var setacc = result[0].toLowerCase();
        var val = await web3.eth.getBalance(setacc);
        var balance = val / 1000000000000000000;
        props.Set_UserAccountBal(balance);
      } else {
        props.Set_UserAccountBal(0);
      }
    },
  }));
});
