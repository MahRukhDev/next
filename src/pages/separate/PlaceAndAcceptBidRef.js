import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import Web3 from "web3";
import "@metamask/legacy-web3";
import $ from "jquery";
import config from "../../lib/config";
import BEP721_ABI from "../../ABI/BEP721.json";
import BEP1155_ABI from "../../ABI/BEP1155.json";
import ESC_ABI from "../../ABI/ESC.json";
import WBNB_ABI from "../../ABI/WBNB.json";
import isEmpty from "../../lib/isEmpty";
import { Button, TextField } from "@material-ui/core";
import { getCurAddr, halfAddrShow } from "../../actions/v1/user";
import { getmylog } from "../../helper/walletconnect";

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
  CancelBid_Action,
} from "../../actions/v1/token";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;
//var web3 = new Web3(window.ethereum);
//const EscContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);

const bidprice = [
  { value: config.owntokenSymbol, label: config.owntokenSymbol },
  { value: config.tokenSymbol, label: config.tokenSymbol },
];

export const PlaceAndAcceptBidRef = forwardRef((props, ref) => {
  const [BidformSubmit, Set_BidformSubmit] = React.useState(false);
  const [NoOfToken_NeedToSend, Set_NoOfToken_NeedToSend] =
    React.useState(false);
  const [MetaMaskAmt, setMetaMaskAmt] = React.useState(false);
  const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState("");
  const [AcceptCallStatus, setAccaptCallStatus] = React.useState("init");
  const [biddingtoken, set_biddingtoken] = React.useState(config.tokenSymbol);
  const [wethbalance, set_wethbalance] = React.useState(0);
  const [bidtokenbalance, set_bidtokenbalance] = React.useState(0);
  const [servicefee, setservicefee] = useState(0);
  const [biddingfee, set_biddingfee] = React.useState(config.fee / 1e18);
  const [PurchaseCurrency, setPurchaseCurrency] = useState("ESC");
  const [typeofcollection, setTypeofcollection] = useState("");
  const [owneraddress, setOwneraddress] = useState("");
  const [bitamount, setbitamount] = useState();
  const [quantity, setquantity] = useState();
  const [itemQuantity, setitemQuantity] = useState(0);

  var {
    Set_WalletConnected,
    Set_UserAccountAddr,
    Set_UserAccountBal,
    Set_AddressUserDetails,
    Set_Accounts,
    Set_MyItemAccountAddr,
    Set_tokenCounts,
    Set_item,
    Set_tokenCounts_Detail,
    Set_MyTokenBalance,
    Set_Bids,
    Set_AccepBidSelect,
    Set_tokenBidAmt,
    Set_NoOfToken,
    Set_ValidateError,
    Set_TokenBalance,
    Set_YouWillPay,
    Set_YouWillPayFee,
    Set_YouWillGet,
    Set_BidApply_ApproveCallStatus,
    Set_BidApply_SignCallStatus,
    setTotaluserbidAmt,
    BidApply_ApproveCallStatus,
    totaluserbidAmt,
    WalletConnected,
    UserAccountAddr,
    UserAccountBal,
    AddressUserDetails,
    Accounts,
    MyItemAccountAddr,
    tokenCounts,
    item,
    tokenCounts_Detail,
    MyTokenBalance,
    Bids,
    AccepBidSelect,
    tokenBidAmt,
    NoOfToken,
    ValidateError,
    TokenBalance,
    YouWillPay,
    YouWillPayFee,
    YouWillGet,
    BidApply_ApproveCallStatus,
    BidApply_SignCallStatus,
    AllowedQuantity,
    Set_Tabname,
    Tabname,
  } = props;

  const inputChange = (e) => {
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.name
    ) {
      var value = e.target.value;

      switch (e.target.name) {
        case "tokenBidAmt":
          setbitamount(value);
          if (value != "" && isNaN(value) == false && value > 0) {
            console.log(value, "log");
            Set_tokenBidAmt(value);
            PriceCalculate_this({
              tokenBidAmt: value,
              biddingtoken: biddingtoken,
              typeofcollection: typeofcollection,
            });
            ValidateError.tokenBidAmt = "";
            Set_ValidateError(ValidateError);
          } else {
            ValidateError.tokenBidAmt = "Enter Valid price";
            Set_ValidateError(ValidateError);
            Set_tokenBidAmt(value);
            PriceCalculate_this({
              tokenBidAmt: value,
              biddingtoken: biddingtoken,
              typeofcollection: typeofcollection,
            });
          }
          break;
        case "NoOfToken":
          setquantity(value);
          Set_NoOfToken(value);
          PriceCalculate_this({
            NoOfToken: value,
            biddingtoken: biddingtoken,
            typeofcollection: typeofcollection,
          });
          break;
      }
    }
  };

  const myclick = async () => {
    // alert("hi")
    setquantity("");
    setbitamount("");
  };

  async function PriceCalculate_this(data = {}) {
    var price =
      typeof data.tokenBidAmt != "undefined" ? data.tokenBidAmt : tokenBidAmt;
    var quantity =
      typeof data.NoOfToken != "undefined" ? data.NoOfToken : NoOfToken;
    if (price == "") {
      price = 0;
    }
    if (quantity == "") {
      quantity = 0;
    }
    if (isNaN(price) != true && isNaN(quantity) != true) {
      try {
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
        var curAddr = await web3.eth.getAccounts();
        if (curAddr) {
          //var web3 = new Web3(window.ethereum);
          // alert(data.typeofcollection)
          if (data.typeofcollection == 721) {
            var totalPrice = price;
            var CoursetroContract = new web3.eth.Contract(
              BEP721_ABI,
              item.contractAddress
            );
            var fee = await CoursetroContract.methods.getServiceFee().call();
            totalPrice = parseFloat(totalPrice) * config.decimalvalues;
            var per = (totalPrice * fee) / 1e20;
            var sendMMAmt = totalPrice + per;
            setMetaMaskAmt(sendMMAmt + 100);
            var finalPrice = sendMMAmt / config.decimalvalues;
            var totalPriceWithFee = parseFloat(finalPrice).toFixed(
              config.toFixed
            );
            Set_YouWillPay(totalPriceWithFee);
          } else {
            var totalPrice = price;
            var totalPrice = totalPrice * config.decimalvalues;
            var CoursetroContract = new web3.eth.Contract(
              BEP1155_ABI,
              item.contractAddress
            );
            var fee = await CoursetroContract.methods.getServiceFee().call();
            totalPrice = parseFloat(totalPrice) * quantity;
            var per = (totalPrice * fee) / 1e20;
            var sendMMAmt = totalPrice + per;
            setMetaMaskAmt(sendMMAmt + 100);
            var finalPrice = sendMMAmt / config.decimalvalues;
            var totalPriceWithFee = parseFloat(finalPrice).toFixed(
              config.toFixed
            );
            Set_YouWillPay(totalPriceWithFee);
          }
        }
      } catch (err) {}
    } else {
      Set_YouWillPay(0);
    }
  }
  const Validation_PlaceABid = (chk) => {
    if (chk) {
      var ValidateError = {};

      if (item.type != 721) {
        function isInt(value) {
          var er = /^-?[0-9]+$/;

          return er.test(value);
        }
        if (NoOfToken == "") {
          ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
        } else if (
          isNaN(NoOfToken) == true ||
          NoOfToken == "" ||
          NoOfToken == null ||
          NoOfToken == undefined
        ) {
          ValidateError.NoOfToken = '"Quantity" must be a number';
        } else if (NoOfToken == 0) {
          ValidateError.NoOfToken = '"Quantity" must be greater than 0';
        } else if (NoOfToken > AllowedQuantity) {
          ValidateError.NoOfToken =
            '"Quantity" must be less than or equal to ' + AllowedQuantity;
        } else if (!isInt(NoOfToken)) {
          ValidateError.NoOfToken = '"Quantity" must be a Integer';
        }
      }
      if (tokenBidAmt == "") {
        ValidateError.tokenBidAmt = '"Bid amount" is not allowed to be empty';
      } else if (isNaN(tokenBidAmt) == true) {
        ValidateError.tokenBidAmt = '"Bid amount" must be a number';
      } else if (tokenBidAmt == 0) {
        ValidateError.tokenBidAmt = '"Bid amount" must be greater than 0';
      } else if (tokenBidAmt < 0) {
        ValidateError.tokenBidAmt = '"Bid amount" must be greater than 0';
      } else if (
        item.PutOnSaleType != "FixedPrice" &&
        item.PutOnSaleType != " " &&
        item.PutOnSaleType == "TimedAuction" &&
        item.minimumBid > tokenBidAmt
      ) {
        ValidateError.tokenBidAmt =
          '"Minimum Bid Amount" must be higher than or equal to ' +
          item.minimumBid;
      } else if (
        item.PutOnSaleType != "FixedPrice" &&
        item.PutOnSaleType != " " &&
        item.PutOnSaleType == "TimedAuction" &&
        item.maximumBid < tokenBidAmt
      ) {
        // alert(tokenBidAmt)
        // alert(item.maximumBid)
        // alert(item.PutOnSaleType)
        ValidateError.tokenBidAmt =
          '"Maximum Bid Amount" must be Lower than or equal to ' +
          item.maximumBid;
      }
      Set_ValidateError(ValidateError);
      console.log(ValidateError, "-==---");
      return ValidateError;
    }
  };

  async function FormSubmit_PlaceABid(e) {
    // setquantity("");
    // setbitamount("")
    Set_BidformSubmit(true);
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
    var curAddr = await web3.eth.getAccounts();
    if (curAddr) {
      // var web3 = new Web3(window.ethereum);
      // var currAddr = window.web3.eth.defaultAccount;
      if (biddingtoken == config.tokenSymbol) {
        var CoursetroContract = new web3.eth.Contract(
          WBNB_ABI,
          config.tokenAddress
        );
      } else {
        var CoursetroContract = new web3.eth.Contract(
          WBNB_ABI,
          config.tokenAddress
        );
      }
      // alert(currAddr);
      var tokenBal = await CoursetroContract.methods
        .balanceOf(curAddr[0].toLowerCase())
        .call();
      var balcheck = tokenBal / config.decimalvalues;
      if (balcheck == 0) {
        toast.error(
          "Insufficient" + " " + biddingtoken + " " + "Token Balance",
          toasterOption
        );
        return false;
      }
      if (YouWillPay > balcheck) {
        toast.error(
          "Insufficient" + " " + biddingtoken + " " + "Token Balance",
          toasterOption
        );
        return false;
      }
      var errors = await Validation_PlaceABid(true);
      var errorsSize = Object.keys(errors).length;

      if (errorsSize != 0) {
        console.log(errorsSize, "errorsSize");
        window.$("#place_bid_modal").modal("show");
        // toast.error(
        //   "Form validation error, please fill all the required fields",
        //   toasterOption
        // );
        return false;
      }
      window.$("#place_bid_modal").modal("hide");
      window.$("#edit_bid_modal").modal("hide");
      window.$("#proceed_bid_modal").modal("show");
    }
  }

  async function BidApply_ApproveCall() {
    // if (!window.ethereum) {
    //   toast.warning("OOPS!..connect Your Wallet", toasterOption);
    //   return false;
    // }
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
    var curAddr = await web3.eth.getAccounts();

    //var web3 = new Web3(window.ethereum);
    var currAddr = curAddr[0].toLowerCase();
    if (!currAddr) {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
    }

    Set_BidApply_ApproveCallStatus("processing");
    var CoursetroContract = new web3.eth.Contract(
      WBNB_ABI,
      config.tokenAddress
    );
    //var currAddr = window.web3.eth.defaultAccount;
    var tokenBal = await CoursetroContract.methods.balanceOf(currAddr).call();
    var tokenBalance = tokenBal / config.decimalvalues;
    if (item.type == 721) {
      var getAllowance = await CoursetroContract.methods
        .allowance(currAddr, item.contractAddress)
        .call();
    } else {
      var getAllowance = await CoursetroContract.methods
        .allowance(currAddr, item.contractAddress)
        .call();
    }
    var sendVal = parseInt(MetaMaskAmt) + parseInt(getAllowance);
    if (tokenBalance == 0) {
      toast.error(
        "Insufficient" + " " + biddingtoken + "" + "Token Balance",
        toasterOption
      );
      return false;
    }
    if (YouWillPay > tokenBalance) {
      toast.error(
        "Insufficient" + " " + biddingtoken + "" + "Token Balance",
        toasterOption
      );
      return false;
    }
    // alert(sendVal.toString());
    // alert("saran");
    await CoursetroContract.methods
      .approve(
        item.type == 721 ? item.contractAddress : item.contractAddress,
        sendVal.toString()
      )
      .send({ from: Accounts })
      .then(async (result) => {
        toast.success("Wallet authorized", toasterOption);
        var BidData = {
          tokenCounts: item.tokenCounts,
          tokenBidAddress: UserAccountAddr,
          tokenBidAmt: tokenBidAmt.toString(),
          NoOfToken: item.type == 721 ? 1 : NoOfToken,
          BidToken: biddingtoken,
        };
        var Resp = await BidApply_ApproveAction(BidData);

        if (Resp.data && Resp.data.type && Resp.data.type == "success") {
          Set_BidApply_ApproveCallStatus("done");
        } else {
          toast.error("Wallet authorization failed", toasterOption);
          Set_BidApply_ApproveCallStatus("tryagain");
        }
      })
      .catch((error) => {
        toast.error("Wallet authorization failed", toasterOption);
        Set_BidApply_ApproveCallStatus("tryagain");
      });
  }

  async function BidApply_SignCall() {
    // if (!window.ethereum) {
    //   toast.warning("OOPS!..connect Your Wallet", toasterOption);
    //   return;
    // }
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
    var curAddr = await web3.eth.getAccounts();
    var currAddr = curAddr[0].toLowerCase();
    if (!currAddr) {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
      return;
    }

    Set_BidApply_SignCallStatus("processing");
    web3.eth.personal
      .sign("Bidding a Art", currAddr, "Bid Placed")
      .then(async (result) => {
        toast.success("Bid placed successfully", toasterOption);
        Set_BidApply_SignCallStatus("done");
        setTimeout(() => window.$("#proceed_bid_modal").modal("hide"), 600);
        setTimeout(() => window.location.reload(), 1200);
      })
      .catch(() => {
        toast.error("Action rejected by user", toasterOption);
        Set_BidApply_SignCallStatus("tryagain");
      });
  }

  async function ChecktokenDecimal(amount, decimals) {
    var result = 0;
    var decimalsLength = 18;
    if (decimals && decimals > 0) {
      decimalsLength = decimals;
    }
    amount = parseFloat(amount);
    try {
      var number = amount.toString();
      var number1 = number.split(".");
      if (number1[1] && number1[1].length && number1[1].length > 0) {
        result = number1[0];
      } else {
        result = amount;
      }
      return result;
    } catch (err) {
      return result;
    }
  }

  async function AcceptBid_Proceed() {
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
    var curAddr = await web3.eth.getAccounts();
    if (curAddr) {
      //var web3 = new Web3(window.ethereum);
      if (NoOfToken_NeedToSend) {
        if (item.type == 721) {
          // var web3 = new Web3(window.ethereum);
          var WBNBContract = new web3.eth.Contract(
            WBNB_ABI,
            config.tokenAddress
          );
          var tokenBal = await WBNBContract.methods
            .balanceOf(AccepBidSelect.tokenBidAddress)
            .call();
          var tokenBalance = tokenBal / config.decimalvalues;
          var valueesss =
            parseFloat(YouWillPayFee) * parseFloat(NoOfToken_NeedToSend) +
            parseFloat(AccepBidSelect.tokenBidAmt) *
              parseFloat(NoOfToken_NeedToSend);
          if (tokenBalance >= valueesss) {
            // alert('yes')
            var BEP721Contract = new web3.eth.Contract(
              BEP721_ABI,
              item.contractAddress
            );
            setAccaptCallStatus("processing");
            var tokenaddress = config.tokenSymbol;
            var passAmt =
              parseFloat(NoOfToken_NeedToSend) *
              parseFloat(AccepBidSelect.tokenBidAmt);
            passAmt = passAmt;
            passAmt = passAmt * config.decimalvalues;
            passAmt = await ChecktokenDecimal(passAmt, config.decimalvalues);
            console.log(passAmt, "========passAmt");
            //passAmt = parseFloat(passAmt)*10000
            passAmt = await convert(passAmt);
            //passAmt = (passAmt / 10000).toString();

            var CoursetroContract = new web3.eth.Contract(
              WBNB_ABI,
              config.tokenAddress
            );

            var getAllowance = await CoursetroContract.methods
              .allowance(AccepBidSelect.tokenBidAddress, item.contractAddress)
              .call();
            // alert(getAllowance);

            await BEP721Contract.methods
              .acceptBId(
                AccepBidSelect.currency,
                AccepBidSelect.tokenBidAddress,
                passAmt.toString(),
                AccepBidSelect.tokenCounts
              )
              .send({ from: Accounts })
              .then(async (result) => {
                var acceptBId_Payload = {
                  tokenCounts: AccepBidSelect.tokenCounts,
                  NoOfToken: NoOfToken_NeedToSend,
                  tokenBidAddress: AccepBidSelect.tokenBidAddress,
                  UserAccountAddr_byaccepter: curAddr,
                  transactionHash: result.transactionHash,
                  currecy: AccepBidSelect.currency,
                };
                var Resp = await acceptBId_Action(acceptBId_Payload);
                // alert(1);
                setAccaptCallStatus("done");
                toast.success("Bid accepted", toasterOption);
                setTimeout(() => window.$(".modal").modal("hide"), 600);
                window.location.reload(false);
              })
              .catch((err) => {
                toast.error("Accept failed", toasterOption);
                setAccaptCallStatus("tryagain");
              });
          } else {
            toast.error("Bidder doesnt have Enough balance", toasterOption);
            return false;
          }
        } else {
          // var web3 = new Web3(window.ethereum);
          var WBNBContract = new web3.eth.Contract(
            WBNB_ABI,
            config.tokenAddress
          );
          var tokenBal = await WBNBContract.methods
            .balanceOf(AccepBidSelect.tokenBidAddress)
            .call();
          var tokenBalance = tokenBal / config.decimalvalues;
          var valueesss =
            parseFloat(YouWillPayFee) * parseFloat(NoOfToken_NeedToSend) +
            parseFloat(AccepBidSelect.tokenBidAmt) *
              parseFloat(NoOfToken_NeedToSend);

          if (tokenBalance >= valueesss) {
            var CoursetroContract = new web3.eth.Contract(
              BEP1155_ABI,
              item.contractAddress
            );

            setAccaptCallStatus("processing");

            var passAmt =
              parseFloat(AccepBidSelect.tokenBidAmt) *
              parseFloat(NoOfToken_NeedToSend);
            passAmt = passAmt;
            passAmt = passAmt * config.decimalvalues;
            passAmt = await ChecktokenDecimal(passAmt, config.decimalvalues);
            //passAmt = parseFloat(passAmt)*10000
            passAmt = await convert(passAmt);
            //passAmt = (passAmt / 10000).toString();
            console.log(passAmt, "========passAmt123");
            await CoursetroContract.methods
              .acceptBId(
                AccepBidSelect.currency,
                AccepBidSelect.tokenBidAddress,
                passAmt.toString(),
                AccepBidSelect.tokenCounts,
                NoOfToken_NeedToSend
              )
              .send({ from: Accounts })
              .then(async (result) => {
                var acceptBId_Payload = {
                  tokenCounts: AccepBidSelect.tokenCounts,
                  NoOfToken: NoOfToken_NeedToSend,
                  tokenBidAddress: AccepBidSelect.tokenBidAddress,
                  UserAccountAddr_byaccepter: curAddr,
                  transactionHash: result.transactionHash,
                  currecy: AccepBidSelect.currency,
                };
                var Resp = await acceptBId_Action(acceptBId_Payload);
                // alert(3)
                setAccaptCallStatus("done");
                setTimeout(() => window.$(".modal").modal("hide"), 600);
                window.location.reload();
              })
              .catch((err) => {
                toast.error("Accept failed", toasterOption);
                setAccaptCallStatus("tryagain");
              });
          } else {
            toast.error("Bidder doesnt have Enough balance", toasterOption);
            return false;
          }
        }
      }
      // else {
      // }
    }
  }
  async function CancelBid_Proceed(curBid_val) {
    var payload = {
      tokenCounts: curBid_val.tokenCounts,
      tokenBidAddress: curBid_val.tokenBidAddress,
    };
    var Resp = await CancelBid_Action(payload);
    if (
      Resp &&
      Resp.data &&
      Resp.data.toast &&
      Resp.data.toast.type &&
      Resp.data.toast.message
    ) {
      if (Resp.data.toast.type == "error") {
        toast.error(Resp.data.toast.message, toasterOption);
      } else if (Resp.data.toast.type == "success") {
        toast.success(Resp.data.toast.message, toasterOption);
      }
    }
    setTimeout(() => window.$(".modal").modal("hide"), 600);
    setTimeout(() => window.location.reload(), 1200);
  }
  useImperativeHandle(ref, () => ({
    async PlaceABid_Click(item, MyTokenDetail) {
      Set_ValidateError({});
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
      var curAddr = await web3.eth.getAccounts();
      var currAddr = curAddr && curAddr[0].toLowerCase();
      if (curAddr) {
        curAddr = curAddr[0].toLowerCase();
      }
      var payload = {
        curAddr: curAddr,
        tokenCounts: item.tokenCounts,
      };
      var Resp = await TokenCounts_Get_Detail_Action(payload);
      setitemQuantity(Resp.data.Detail.Resp.TotalQuantity);
      // console.log(Resp.data.Detail.Resp.OnSaleBalance,'Or TotalQuantity');
      if (
        Resp &&
        Resp &&
        Resp.data &&
        Resp.data.Detail &&
        Resp.data.Detail.Resp
      ) {
        var TokenResp = Resp.data.Detail.Resp;
        if (TokenResp.Bids) {
          Set_Bids(TokenResp.Bids);
        }
      }
      Set_BidformSubmit(false);
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      if (Tabname == "Info") {
        setTypeofcollection(item.type);
        if (
          item &&
          item.tokenowners_current &&
          item.tokenowners_current[0] &&
          item.tokenowners_current[0].currency
        ) {
          setOwneraddress(item.tokenowners_current[0].tokenOwner);
          setPurchaseCurrency(item.tokenowners_current[0].currency);
          set_biddingtoken(item.tokenowners_current[0].currency);
          try {
            // var web3 = new Web3(window.ethereum);
            if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current[0].currency == config.currencySymbol
            ) {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current[0].currency == config.owntokenSymbol
            ) {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current[0].currency == config.tokenSymbol
            ) {
              var WETHContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WETHContract.methods.decimals().call();
              var tokenBal = await WETHContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            }
          } catch (err) {}
        }
      } else {
        setTypeofcollection(item.type);
        if (
          item &&
          item.tokenowners_current &&
          item.tokenowners_current.currency
        ) {
          setOwneraddress(item.tokenowners_current.tokenOwner);
          setPurchaseCurrency(item.tokenowners_current.currency);
          set_biddingtoken(item.tokenowners_current.currency);
          try {
            // var web3 = new Web3(window.ethereum);
            if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current.currency == config.currencySymbol
            ) {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current.currency == config.owntokenSymbol
            ) {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else if (
              item &&
              item.tokenowners_current &&
              item.tokenowners_current.currency == config.tokenSymbol
            ) {
              var WETHContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WETHContract.methods.decimals().call();
              var tokenBal = await WETHContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            } else {
              var WBNBContract = new web3.eth.Contract(
                WBNB_ABI,
                config.tokenAddress
              );
              //var currAddr = window.web3.eth.defaultAccount;
              var decimal = await WBNBContract.methods.decimals().call();
              var tokenBal = await WBNBContract.methods
                .balanceOf(currAddr)
                .call();
              var tokenBalance = tokenBal / config.decimalvalues;
              Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
              setPurchaseCurrency(config.tokenSymbol);
              set_biddingtoken(config.tokenSymbol);
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            }
          } catch (err) {}
        }
      }

      window.$("#place_bid_modal").modal("show");
    },
    async PriceCalculate(data = {}) {
      PriceCalculate_this(data);
      Set_ValidateError({});
    },
    async AcceptBid_Select(curBid_val, item) {
      Set_ValidateError({});
      if (window.ethereum) {
        if (curBid_val && curBid_val.tokenBidAmt) {
          window.$("#accept_modal").modal("show");
          Set_AccepBidSelect(curBid_val);
          if (MyTokenBalance < curBid_val.pending) {
            Set_NoOfToken_NeedToSend(MyTokenBalance);
            var totalAmt = MyTokenBalance * curBid_val.tokenBidAmt;
          } else {
            Set_NoOfToken_NeedToSend(curBid_val.pending);
            var totalAmt = curBid_val.pending * curBid_val.tokenBidAmt;
          }
          try {
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
            var curAddr = await web3.eth.getAccounts();
            if (web3.eth) {
              if (item.type == 721) {
                var CoursetroContract = new web3.eth.Contract(
                  BEP721_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var ServiceFee_val = (totalAmt * fee) / 1e20;
                Set_YouWillPayFee(ServiceFee_val);
                set_biddingfee(fee / 1e18);
                var YouWillGet_Val = totalAmt - ServiceFee_val;
                Set_YouWillGet(YouWillGet_Val);
                var feeValue = fee / config.decimalvalues;
                // alert(feeValue);
                setservicefee(feeValue);
              } else {
                var CoursetroContract = new web3.eth.Contract(
                  BEP1155_ABI,
                  item.contractAddress
                );
                var fee = await CoursetroContract.methods
                  .getServiceFee()
                  .call();
                var ServiceFee_val = (totalAmt * fee) / 1e20;
                Set_YouWillPayFee(ServiceFee_val);
                set_biddingfee(fee / 1e18);
                var YouWillGet_Val = totalAmt - ServiceFee_val;
                Set_YouWillGet(YouWillGet_Val);
                var feeValue = fee / config.decimalvalues;
                setservicefee(feeValue);
              }
            }
          } catch (err) {}
        }
      }
    },
    async CancelBid_Select(curBid_val) {
      Set_ValidateError({});
      if (
        curBid_val &&
        curBid_val.pending > 0 &&
        (curBid_val.status == "pending" ||
          curBid_val.status == "partiallyCompleted")
      ) {
        Set_AccepBidSelect(curBid_val);
        window.$("#cancel_modal").modal("show");
      } else {
        window.$(".modal").modal("hide");
      }
    },
  }));

  function convert(n) {
    let sign = +n < 0 ? "-" : "",
      toStr = n?.toString() || "";
    if (!/e/i.test(toStr)) {
      return n;
    }
    let [lead, decimal, pow] = n
      .toString()
      .replace(/^-/, "")
      .replace(/^([0-9]+)(e.*)/, "$1.$2")
      .split(/e|\./);
    return +pow < 0
      ? sign +
          "0." +
          "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
          lead +
          decimal
      : sign +
          lead +
          (+pow >= decimal.length
            ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
            : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
  }

  return (
    <div>
      {FormSubmitLoading == "processing" && (
        <div className="transLoading">
          <img
            src={require("../../assets/images/logo.png")}
            className="img-fluid"
            alt=""
          />
        </div>
      )}
      {/* place_bid Modal */}
      <div
        className="modal fade primary_modal"
        onClick={() => Validation_PlaceABid(BidformSubmit)}
        id="place_bid_modal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="place_bid_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="place_bid_modalLabel">
                Please sign the bidding action
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={myclick}>
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <p className="text-center place_bit_desc text-light mb-0">
                You are about to place a bid for
              </p>
              <p className="place_bit_desc_2 text-center">
                <span className="text-light mr-2">
                  {halfAddrShow(owneraddress)}
                </span>{" "}
                <span className="text-muted">by</span>{" "}
                <span className="text-light ml-2">
                  {halfAddrShow(UserAccountAddr)}
                </span>
              </p>
              <p className="place_bit_desc_2 text-center">
                {"Available : " + AllowedQuantity}
              </p>
              <form className="px-4 bid_form form-border">
                <div class="input-group mb-3 input_grp_style_1">
                  <input
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", ","].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    min="0"
                    name="tokenBidAmt"
                    id="tokenBidAmt"
                    class="form-control mb-0"
                    placeholder="Enter your bid amount"
                    aria-label="bid"
                    aria-describedby="basic-addon2"
                    value={bitamount}
                    onChange={inputChange}
                    autoComplete="off"
                  />
                  <div class="input-group-append">WETH</div>
                </div>
                {ValidateError.tokenBidAmt && (
                  <span
                    className="text-danger"
                    style={{ position: "relative", top: "-12px" }}
                  >
                    {ValidateError.tokenBidAmt}
                  </span>
                )}
                <div class="input-group mb-3 input_grp_style_1">
                  {item.type == config.multipleType && (
                    <input
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-", ",", "."].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      min="1"
                      name="NoOfToken"
                      id="NoOfToken"
                      class="form-control mb-0"
                      placeholder="Enter the item quantity"
                      aria-label="bid"
                      aria-describedby="basic-addon2"
                      value={quantity}
                      onChange={inputChange}
                      // value={NoOfToken}
                      autoComplete="off"
                    />
                  )}
                </div>
                {ValidateError.NoOfToken && (
                  <span
                    className="text-danger"
                    style={{ position: "relative", top: "-12px" }}
                  >
                    {ValidateError.NoOfToken}
                  </span>
                )}
                {Bids && Bids.myBid && Bids.myBid.tokenBidAmt > 0 && (
                  <div className="row pb-3">
                    <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Previous bid amount</p>
                    </div>
                    <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">
                        {Bids.myBid.tokenBidAmt} {config.tokenSymbol}
                      </p>
                    </div>
                  </div>
                )}
                {/* <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your total quantity</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {itemQuantity}
                    </p>
                  </div>
                </div> */}
                <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {UserAccountBal.toFixed(8)} {config.currencySymbol}
                    </p>
                  </div>
                </div>

                {/* {item && item.PutOnSaleType != "FixedPrice" && (
                  <div>
                    <div className="row pb-3">
                      <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">Min. value</p>
                      </div>
                      <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">
                          {item.minimumBid} {config.tokenSymbol}
                        </p>
                      </div>
                    </div>
                    <div className="row pb-3">
                      <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">Max. value</p>
                      </div>
                      <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">
                          {item.maximumBid} {config.tokenSymbol}
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}
                <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your bidding balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {TokenBalance} {config.tokenSymbol}
                    </p>
                  </div>
                </div>

                {item.type == 721 && item.PutOnSaleType == "TimedAuction" && (
                  <>
                    {" "}
                    <div className="row pb-3">
                      <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">Minimum Bid Amount</p>
                      </div>
                      <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">
                          {convert(item.minimumBid)} {config.tokenSymbol}
                        </p>
                      </div>
                    </div>
                    <div className="row pb-3">
                      <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">Maximum Bid Amount</p>
                      </div>
                      <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">
                          {convert(item.maximumBid)} {config.tokenSymbol}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">WETH Service fee</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {servicefee}
                      {" %"}{" "}
                    </p>
                  </div>
                </div>
                <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">You will pay</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {parseFloat(YouWillPay).toFixed(7)} {biddingtoken}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    className="btn-main lead mar-top-10"
                    type="button"
                    onClick={() => FormSubmit_PlaceABid()}
                    // data-dismiss="modal"
                    aria-label="Close"
                    data-toggle="modal"
                    //  data-target="#proceed_bid_modal"
                  >
                    Place a bid
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* close bid*/}
      {/* proceed_bid Modal */}
      <div
        className="modal fade primary_modal"
        id="proceed_bid_modal"
        tabindex="-1"
        role="dialog"
        data-backdrop="static"
        aria-labelledby="proceed_bid_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="proceed_bid_modalLabel">
                Follow Steps
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="media approve_media">
                  {BidApply_ApproveCallStatus == "processing" ? (
                    <i
                      class="fa fa-spinner mr-3 spinner_icon"
                      aria-hidden="true"
                      id="circle1"
                    ></i>
                  ) : BidApply_ApproveCallStatus == "done" ? (
                    <i
                      className="fas fa-check mr-3 pro_complete"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i className="fas fa-check mr-3" aria-hidden="true"></i>
                  )}

                  <div className="media-body">
                    <p className="mt-0 approve_text">Approve</p>
                    <p className="mt-0 approve_desc">
                      Checking balance and approving
                    </p>
                  </div>
                </div>
                <div className="text-center my-3">
                  <button
                    className={
                      BidApply_ApproveCallStatus == "processing" ||
                      BidApply_ApproveCallStatus == "init"
                        ? "btn-main lead mar-top-10"
                        : "btn-main btnGrey lead mar-top-10"
                    }
                    type="button"
                    disabled={
                      BidApply_ApproveCallStatus == "processing" ||
                      BidApply_ApproveCallStatus == "done"
                    }
                    onClick={BidApply_ApproveCall}
                  >
                    {BidApply_ApproveCallStatus == "init" && "Approve"}
                    {BidApply_ApproveCallStatus == "processing" &&
                      "In-progress..."}
                    {BidApply_ApproveCallStatus == "done" && "Done"}
                    {BidApply_ApproveCallStatus == "tryagain" && "Try Again"}
                  </button>
                </div>
                <div className="media approve_media mt-3">
                  {BidApply_SignCallStatus == "processing" ? (
                    <i
                      class="fa fa-spinner mr-3 spinner_icon"
                      aria-hidden="true"
                      id="circle1"
                    ></i>
                  ) : BidApply_SignCallStatus == "done" ? (
                    <i
                      className="fas fa-check mr-3 pro_complete"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i className="fas fa-check mr-3" aria-hidden="true"></i>
                  )}{" "}
                  <div className="media-body">
                    <p className="mt-0 approve_text">Signature</p>
                    <p className="mt-0 approve_desc">
                      Create a signature to place a bid
                    </p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button
                    className={
                      BidApply_ApproveCallStatus == "done" &&
                      BidApply_SignCallStatus != "done"
                        ? "btn-main lead mar-top-10"
                        : "btn-main btnGrey lead mar-top-10"
                    }
                    type="button"
                    disabled={
                      BidApply_ApproveCallStatus != "done" ||
                      BidApply_SignCallStatus == "processing" ||
                      BidApply_SignCallStatus == "done"
                    }
                    onClick={BidApply_SignCall}
                  >
                    {BidApply_SignCallStatus == "init" && "Start"}
                    {BidApply_SignCallStatus == "processing" &&
                      "In-progress..."}
                    {BidApply_SignCallStatus == "done" && "Done"}
                    {BidApply_SignCallStatus == "tryagain" && "Try Again"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end proceed_bid modal */}
      {/* accept bid Modal */}
      <div
        className="modal fade primary_modal"
        id="accept_modal"
        tabindex="-1"
        data-backdrop="static"
        role="dialog"
        aria-labelledby="accept_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="accept_modalLabel">
                Accept bid
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="img_accept text-center">
                {item && item.image && item.image.split(".").pop() == "mp4" ? (
                  <video
                    src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                    type="video/mp4"
                    alt="Collections"
                    className="img-fluid img-rounded mb-sm-30"
                    controls
                    controlsList="nodownload"
                  />
                ) : item &&
                  item.image &&
                  item.image.split(".").pop() == "mp3" ? (
                  <>
                    <img
                      src={`${config.Back_URL}images/music.png`}
                      alt=""
                      className="img-fluid img-rounded mb-sm-30"
                    />
                    <audio
                      src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                      type="audio/mp3"
                      controls
                      className="img-fluid img-rounded mb-sm-30"
                    ></audio>
                  </>
                ) : (
                  <img
                    src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                    alt="Collections"
                    className="img-fluid img-rounded mb-sm-30"
                  />
                )}
                {/* <img src={require("../assets/images/info_01.png")} alt="Collections" className="img-fluid" /> */}
              </div>
              <p className="text-center accept_desc mb-0 mar-top-10">
                <span className="buy_desc_sm">
                  You are about to accept bid for
                </span>
              </p>
              <p className="text-center accept_desc">
                <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>{" "}
                <span className="buy_desc_sm pl-2">from</span>{" "}
                <span className="buy_desc_sm_bold pl-2">
                  {halfAddrShow(AccepBidSelect.tokenBidAddress)}
                </span>
              </p>

              <p className="info_title text-center">
                {convert(parseFloat(AccepBidSelect.tokenBidAmt))}{" "}
                {AccepBidSelect.currencySymbol} for {AccepBidSelect.pending}{" "}
                edition(s)
              </p>

              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">WETH Service fee</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {biddingfee}
                    {" %"}
                  </p>
                </div>
              </div>
              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">You will get</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {parseFloat(YouWillGet).toFixed(7)}{" "}
                    {AccepBidSelect.currency}
                  </p>
                </div>
              </div>
              <form className="px-4">
                <div className="text-center">
                  <button
                    className="btn-main lead mar-top-10 me-2"
                    type="button"
                    onClick={() => AcceptBid_Proceed()}
                    disabled={AcceptCallStatus == "processing"}
                  >
                    {AcceptCallStatus == "processing" && (
                      <i
                        class="fa fa-spinner fa-spin me-2 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}
                    Accept bid
                  </button>
                  <button
                    type="button"
                    className="btn-main btnGrey lead mar-top-10"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end accept bid modal */}

      {/* cancel bid */}
      {/* accept bid Modal */}
      <div
        className="modal fade primary_modal"
        id="cancel_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="accept_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="accept_modalLabel">
                Cancel bid
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="text-center accept_desc mb-0 mar-top-10">
                <span className="buy_desc_sm">
                  You are about to cancel bid for
                </span>
              </p>
              <p className="text-center accept_desc">
                <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>{" "}
                <span className="buy_desc_sm pl-2">from</span>{" "}
                <span className="buy_desc_sm_bold pl-2">
                  {halfAddrShow(AccepBidSelect.tokenBidAddress)}
                </span>
              </p>
              <p className="text-center accept_desc mb-0 mar-top-2">
                <span className="buy_desc_sm_bold pl-2">
                  {AccepBidSelect.tokenBidAmt} {AccepBidSelect.currency}
                </span>{" "}
                <span className="buy_desc_sm pl-2">for </span>{" "}
                <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
              </p>
              <form className="px-4">
                <div className="text-center">
                  <div class="btn-NewBlock text-center">
                    <button
                      className="btn-main lead mar-top-10"
                      type="button"
                      onClick={() => CancelBid_Proceed(AccepBidSelect)}
                    >
                      Cancel bid
                    </button>
                  </div>
                  <div class="btn-NewBlock text-center">
                    <button
                      className="btn-main btnGrey lead mar-top-10"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end accept bid modal */}
    </div>
  );
});
