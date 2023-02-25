import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import config from "../../lib/config";
import BEP721_ABI from "../../ABI/BEP721.json";
import BEP1155_ABI from "../../ABI/BEP1155.json";
import ESC_ABI from "../../ABI/ESC.json";
import { getmylog } from "../../helper/walletconnect";
import { useParams } from "react-router-dom";

import {
  AddLikeAction,
  GetLikeDataAction,
  TokenPriceChange_update_Action,
  PurchaseNow_Complete_Action,
  ActivitySection,
  TokenCounts_Get_Detail_Action,
} from "../../actions/v1/token";

import { getCurAddr, halfAddrShow } from "../../actions/v1/user";

import { toast } from "react-toastify";
import isEmpty from "../../lib/isEmpty";
toast.configure();
let toasterOption = config.toasterOption;
// var web3 = new Web3(window.ethereum);
// const EscContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
export const PurchaseNowRef = forwardRef((props, ref) => {
  var { tokenidval } = useParams();
  const [ApproveCallStatus, setApproveCallStatus] = useState("init");
  const [PurchaseCallStatus, setPurchaseCallStatus] = useState("init");
  const [PurchaseBalance, set_PurchaseBalance] = React.useState(0);
  const [item, Set_item] = React.useState(props.item);
  const [PurchaseCurrency, setPurchaseCurrency] = useState();
  const [saletokenbal, setSaletoken] = useState(0);
  const [servicefee, setservicefee] = useState(0);
  const [YouWillPay, Set_YouWillPay] = useState(0);
  const [MultipleWei, Set_MultipleWei] = useState(0);
  const [price, Set_Price] = useState(0);
  const [NoOfToken, Set_NoOfToken] = useState(1);
  const [VQuattity, Set_VQuattity] = useState();
  const [TokenPrice, Set_TokenPrice] = useState(0);
  const [TokenQuatity, Set_TokenQuatity] = useState(0);
  const [FormSubmitLoading, Set_FormSubmitLoading] = useState("");
  const [ValidateError, Set_ValidateError] = useState({});
  const [itemQuantity, setitemQuantity] = useState(0);

  // const BEP721Contract = new web3.eth.Contract(
  //   BEP721_ABI,
  //   item.contractAddress
  // );
  // const BEP1155Contract = new web3.eth.Contract(
  //   BEP1155_ABI,
  //   item.contractAddress
  // );

  var {
    UserAccountAddr,
    UserAccountBal,
    TokenBalance,
    MyItemAccountAddr,
    buytoken,
    AllowedQuantity,
    Set_AllowedQuantity,
  } = props;
  console.log(UserAccountAddr, "UserAccountAddr");

  const PriceCalculate = async (data = {}) => {
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
        //var web3 = new Web3(window.ethereum);
        if (data.type == 721) {
          var CoursetroContract = new web3.eth.Contract(
            BEP721_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFee().call();
        } else {
          var CoursetroContract = new web3.eth.Contract(
            BEP1155_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFee().call();
        }
        var price = typeof data.price != "undefined" ? data.price : TokenPrice;
        var quantity =
          typeof data.quantity != "undefined" ? data.quantity : NoOfToken;
        var newPrice2 = price * config.decimalvalues;

        var newPrice1 = data.type == 721 ? newPrice2 : quantity * newPrice2;
        var newPrice = newPrice1;
        var per = (newPrice * fee) / 1e20;
        var mulWei = newPrice + per;
        mulWei = await ChecktokenDecimal(mulWei, config.decimalvalues);
        mulWei = await convert(mulWei);
        Set_YouWillPay((mulWei / config.decimalvalues).toFixed(config.toFixed));
        Set_MultipleWei(mulWei);
        Set_Price(newPrice);
      }
    } catch (err) {}
  };

  const inputChange = (e) => {
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.name
    ) {
      var value = e.target.value;
      switch (e.target.name) {
        case "NoOfToken":
          Set_NoOfToken(value);
          Set_VQuattity(value);
          console.log(value, "Set_NoOfToken");
          PriceCalculate({
            quantity: value,
            PurchaseCurrency: PurchaseCurrency,
          });
          break;
        case "TokenPrice":
          Set_TokenPrice(value);
          if (value != "" && isNaN(value) == false && value > 0) {
            PriceCalculate({
              price: value,
              PurchaseCurrency: PurchaseCurrency,
            });
          }
          break;
        default:
        // code block
      }
      // ItemValidation({TokenPrice:value});
    }
  };
  const closeBtn = () => {
    Set_VQuattity("");
    // document.getElementById('NoOfToken').value = ""
  };
  const ItemValidation = async (data = {}) => {
    var ValidateError = {};
    var Chk_TokenPrice =
      typeof data.price != "undefined" ? data.price : TokenPrice;
    var quantity =
      typeof data.quantity != "undefined" ? data.quantity : NoOfToken;

    var Collectible_balance = 0;
    if (item && item.tokenowners_current && item.tokenowners_current.balance) {
      Collectible_balance = item.tokenowners_current.balance;
    }
    if (item.type == 1155) {
      if (Math.sign(quantity) === -1) {
        ValidateError.NoOfToken = '"Quantity" must be greater than 0';
      }
      if (quantity == 0) {
        ValidateError.NoOfToken = '"Quantity" must be greater than 0';
      }
      if (isNaN(quantity) == true) {
        ValidateError.NoOfToken = '"Quantity" must be a number';
      }
      if (quantity == "") {
        ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
      }
      if (quantity > Collectible_balance) {
        ValidateError.NoOfToken =
          '"Quantity" must be below on ' + Collectible_balance;
      }
    }

    if (Chk_TokenPrice == "") {
      ValidateError.TokenPrice = '"Token Price" is not allowed to be empty';
    } else if (Chk_TokenPrice == 0) {
      ValidateError.TokenPrice = '"Token Price" must be greater than 0';
    } else if (isNaN(Chk_TokenPrice) == true) {
      ValidateError.TokenPrice = '"Token Price" must be a number';
    } else if (parseFloat(YouWillPay) > parseFloat(PurchaseBalance)) {
      ValidateError.TokenPrice =
        "Insufficient balance, Check your wallet balance";
    } else {
      // await props.GetUserBal();
      if (parseFloat(YouWillPay) > parseFloat(PurchaseBalance)) {
        ValidateError.TokenPrice =
          "Insufficient balance, Check your wallet balance";
      } else {
        delete ValidateError.TokenPrice;
      }
    }
    Set_ValidateError(ValidateError);
    return ValidateError;
  };
  async function FormSubmit() {
    var errors = await ItemValidation();

    console.log(errors, "roooo");
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      // toast.error(
      //   "Form validation error, please fill all the required fields",
      //   toasterOption
      // );
      return false;
    }
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
    //if (window.ethereum) {
    // var web3 = new Web3(window.ethereum);
    if (web3 && web3.eth) {
      if (PurchaseCurrency != config.currencySymbol) {
        if (PurchaseCurrency == config.owntokenSymbol) {
          var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
          const BEP721Contract = new web3.eth.Contract(
            BEP721_ABI,
            item.contractAddress
          );
          //var currAddr = window.web3.eth.defaultAccount;
          const EscContract = new web3.eth.Contract(
            ESC_ABI,
            config.esctokenAddr
          );
          var tokenBal = await ESCContract.methods
            .balanceOf(currAddr[0].toLowerCase())
            .call();
          var tokenBalance = tokenBal / config.decimalvalues;
          if (tokenBalance >= parseFloat(YouWillPay)) {
            // window.$('.modal').modal('hide');
            window.$("#proceed_modal").modal("show");
          } else {
            toast.error("Insufficient balance", toasterOption);
          }
        } else if (PurchaseCurrency == config.currencySymbol) {
          if (PurchaseBalance >= parseFloat(YouWillPay)) {
            // window.$('.modal').modal('hide');
            window.$("#proceed_modal").modal("show");
          } else {
            toast.error("Insufficient balance", toasterOption);
          }
        }
      } else {
        var price =
          item.tokenowners_current && item.tokenowners_current.price
            ? item.tokenowners_current.price
            : 0;
        if (price && price > 0) {
          if (item.type == 721) {
            if (PurchaseBalance == 0) {
              toast.error("Insufficient balance", toasterOption);
              return false;
            }

            if (YouWillPay > PurchaseBalance) {
              toast.error("Insufficient balance", toasterOption);
              return false;
            }

            var tokenContractAddress = item.contractAddress.toString();
            var tokenType = item.type.toString();
            var bal = parseInt(item.balance);
            //var web3 = new Web3(window.ethereum);

            const BEP721Contract = new web3.eth.Contract(
              BEP721_ABI,
              item.contractAddress
            );
            var sendAmount = parseFloat(
              item.tokenowners_current.price
            ).toString();
            sendAmount =
              parseFloat(sendAmount) * parseFloat(config.decimalvalues);
            // sendAmount = parseFloat(sendAmount)* 10000
            sendAmount = await ChecktokenDecimal(
              sendAmount,
              config.decimalvalues
            );
            sendAmount = await convert(sendAmount);
            //sendAmount = parseFloat(sendAmount)/10000
            Set_FormSubmitLoading("processing");
            window.$("#buy_modal").modal("show");

            var tokenaddress = "";
            if (PurchaseCurrency == config.currencySymbol) {
              tokenaddress = config.currencySymbol;
            } else if (PurchaseCurrency == config.tokenSymbol) {
              tokenaddress = config.owntokenSymbol;
            } else {
              tokenaddress = config.owntokenSymbol;
            }
            console.log(
              item.tokenowners_current.tokenOwner,
              item.tokenCounts,
              sendAmount.toString(),
              MultipleWei,
              "=========buysingle"
            );

            BEP721Contract.methods
              .saleToken(
                item.tokenowners_current.tokenOwner,
                item.tokenCounts,
                sendAmount.toString()
                // tokenaddress
              )
              .send({
                from: props.Accounts,
                value: MultipleWei,
              })
              .then(async (result) => {
                Set_FormSubmitLoading("done");
                var postData = {
                  tokenOwner: item.tokenowners_current.tokenOwner, // old owner
                  //  tokenOwner:UserAccountAddr,
                  UserAccountAddr: UserAccountAddr, // new owner
                  tokenCounts: item.tokenCounts,
                  tokenType: item.type,
                  NoOfToken: item.type == 721 ? 1 : NoOfToken,
                  transactionHash: result.transactionHash,
                  PurchaseCurrency: PurchaseCurrency,
                  ipfsimage: item.ipfsimage,
                  tokenName: item.tokenName,
                  image: item.image,
                };
                var Resp = await PurchaseNow_Complete_Action(postData);
                if (
                  Resp.data &&
                  Resp.data.toast &&
                  Resp.data.toast.type == "success"
                ) {
                  toast.success(
                    "Collectible purchase successfully",
                    toasterOption
                  );
                  window.$(".PurchaseNow_modal").modal("hide");
                  window.location.reload(false);
                }
              })
              .catch((error) => {
                Set_FormSubmitLoading("error");
                toast.error("Transaction rejected by user", toasterOption);
              });
          } else {
            var tokenContractAddress = item.contractAddress.toString();
            var tokenType = item.type.toString();
            var bal = parseInt(item.balance);
            // var web3 = new Web3(window.ethereum);
            Set_FormSubmitLoading("processing");
            var price1 =
              item.tokenowners_current && item.tokenowners_current.price
                ? item.tokenowners_current.price
                : 0;
            var owneradd = item.tokenowners_current.tokenOwner;
            console.log(price, "======price");
            var price = price;
            console.log(price, "======price1");
            var sendAmount1 = (price * config.decimalvalues).toString();
            console.log(sendAmount1, "===========sendAmount1");
            var lastAmt = (sendAmount1 * NoOfToken).toString();
            console.log(lastAmt, "============lastamt1");
            //lastAmt = parseFloat(lastAmt)*10000
            lastAmt = await ChecktokenDecimal(lastAmt, config.decimalvalues);
            lastAmt = await convert(lastAmt);
            console.log(lastAmt, "==========lastamt");
            //lastAmt = parseFloat(lastAmt)/10000 ;
            console.log(lastAmt, "====================final");
            // window.$('#buy_modal').modal('show');
            var tokenaddress = "";
            if (PurchaseCurrency == config.currencySymbol) {
              tokenaddress = config.currencySymbol;
            } else if (PurchaseCurrency == config.tokenSymbol) {
              tokenaddress = config.owntokenSymbol;
            } else {
              tokenaddress = config.owntokenSymbol;
            }
            const BEP1155Contract = new web3.eth.Contract(
              BEP1155_ABI,
              item.contractAddress
            );
            console.log(
              item.tokenowners_current.tokenOwner,
              item.tokenCounts,
              lastAmt.toString(),
              NoOfToken,
              MultipleWei,
              "=========buybuy=="
            );
            BEP1155Contract.methods
              .saleToken(
                item.tokenowners_current.tokenOwner,
                item.tokenCounts,
                lastAmt.toString(),
                NoOfToken
                // tokenaddress
              )
              .send({
                from: props.Accounts,
                value: MultipleWei.toString(),
              })
              .then(async (result) => {
                Set_FormSubmitLoading("done");
                var postData = {
                  tokenOwner: item.tokenowners_current.tokenOwner, // old owner
                  UserAccountAddr: UserAccountAddr, // new owner
                  tokenCounts: item.tokenCounts,
                  tokenType: item.type,
                  NoOfToken: item.type == 721 ? 1 : NoOfToken,
                  transactionHash: result.transactionHash,
                  PurchaseCurrency: PurchaseCurrency,
                  ipfsimage: item.ipfsimage,
                  image: item.image,
                };
                var Resp = await PurchaseNow_Complete_Action(postData);
                if (
                  Resp.data &&
                  Resp.data.toast &&
                  Resp.data.toast.type == "success"
                ) {
                  toast.success(
                    "Collectible purchase successfully",
                    toasterOption
                  );
                  window.$(".modal").modal("hide");
                  setTimeout(() => {
                    window.location.reload(false);
                  }, 2000);
                }
              })
              .catch((error) => {
                Set_FormSubmitLoading("error");
                toast.error("Transaction rejected by user", toasterOption);
              });
          }
        } else {
          toast.error("Oops something went wrong.!", toasterOption);
        }
      }
    }
    //}
  }

  async function FormSubmit_StepOne() {
    //if (window.ethereum) {
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
    if (web3 && web3.eth) {
      const EscContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
      const BEP721Contract = new web3.eth.Contract(
        BEP721_ABI,
        item.contractAddress
      );
      setApproveCallStatus("processing");
      if (item.type == 721) {
        var CoursetroContract = "";
        if (PurchaseCurrency == config.tokenSymbol) {
          CoursetroContract = EscContract;
        } else if (PurchaseCurrency == config.currencySymbol) {
          CoursetroContract = BEP721Contract;
        } else {
          CoursetroContract = EscContract;
        }
      } else {
        var CoursetroContract = "";
        if (PurchaseCurrency == config.tokenSymbol) {
          CoursetroContract = EscContract;
        } else if (PurchaseCurrency == config.currencySymbol) {
          CoursetroContract = BEP721Contract;
        } else {
          CoursetroContract = EscContract;
        }
      }

      var currAddr = curAddr[0].toLowerCase();
      if (item.type == 721) {
        var getAllowance = await EscContract.methods
          .allowance(currAddr, item.contractAddress)
          .call();
      } else {
        var getAllowance = await EscContract.methods
          .allowance(currAddr, item.contractAddress)
          .call();
      }
      const Contractaddress = item.contractAddress;
      var sendVal = parseInt(MultipleWei) + parseInt(getAllowance) + 100;
      await CoursetroContract.methods
        .approve(Contractaddress, sendVal.toString())
        .send({
          from: props.Accounts,
        })
        .then(async (result) => {
          setApproveCallStatus("done");
          toast.success("Collectible purchase successfully", toasterOption);
        })
        .catch((error) => {
          setApproveCallStatus("tryagain");
          toast.error("Order not approved", toasterOption);
        });
    }
    //}
  }
  async function FormSubmit_StepTwo() {
    //if (window.ethereum) {
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
    if (web3 && web3.eth) {
      if (PurchaseCurrency == config.tokenSymbol) {
        var EscContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
        var currAddr = curAddr[0].toLowerCase();
        var tokenBal = await EscContract.methods.balanceOf(currAddr).call();
        var tokenBalance = tokenBal / config.decimalvalues;
        if (parseFloat(tokenBalance) == 0) {
          toast.error(
            PurchaseCurrency + " Token Balance Insufficient",
            toasterOption
          );
          return false;
        }
        if (parseFloat(YouWillPay) >= parseFloat(tokenBalance)) {
          toast.error(
            PurchaseCurrency + " Token Balance Insufficient",
            toasterOption
          );
          return false;
        }
      } else {
        if (parseFloat(PurchaseBalance) == 0) {
          toast.error(
            "Insufficient" + PurchaseCurrency + "  Balance",
            toasterOption
          );
          return false;
        }
        if (parseFloat(YouWillPay) >= parseFloat(PurchaseBalance)) {
          toast.error(
            "Insufficient" + PurchaseCurrency + "  Balance",
            toasterOption
          );
          return false;
        }
      }

      if (item.type == 721) {
        const BEP721Contract = new web3.eth.Contract(
          BEP721_ABI,
          item.contractAddress
        );
        var sendAmount = (item && item.tokenowners_current.price).toString();
        sendAmount = parseFloat(sendAmount) * parseFloat(config.decimalvalues);
        //sendAmount = parseFloat(sendAmount)* 10000
        sendAmount = await ChecktokenDecimal(sendAmount, config.decimalvalues);
        sendAmount = await convert(sendAmount);
        //sendAmount = parseFloat(sendAmount)/10000
        var tokenaddress = "";
        if (PurchaseCurrency == config.owntokenSymbol) {
          tokenaddress = config.esctokenAddr;
        } else if (PurchaseCurrency == config.currencySymbol) {
          tokenaddress = item.contractAddress;
        } else {
          tokenaddress = config.esctokenAddr;
        }

        setPurchaseCallStatus("processing");
        BEP721Contract.methods
          .salewithToken(
            PurchaseCurrency == config.owntokenSymbol
              ? config.owntokenSymbol
              : config.currencySymbol,
            item.tokenowners_current.tokenOwner,
            item.tokenCounts,
            sendAmount.toString()
            // tokenaddress
          )
          .send({
            from: props.Accounts,
          })
          .then(async (result) => {
            setPurchaseCallStatus("done");
            var postData = {
              tokenOwner: item.tokenowners_current.tokenOwner, // old owner
              UserAccountAddr: UserAccountAddr, // new owner
              tokenCounts: item.tokenCounts,
              tokenType: item.type,
              NoOfToken: item.type == 721 ? 1 : NoOfToken,
              transactionHash: result.transactionHash,
              PurchaseCurrency: PurchaseCurrency,
              ipfsimage: item.ipfsimage,
              tokenName: item.tokenName,
              image: item.image,
            };
            var Resp = await PurchaseNow_Complete_Action(postData);
            console.log(Resp, "rrrrrrrrrrrrrrrrrrrrrrrrrrr-------rr");
            if (
              Resp.data &&
              Resp.data.toast &&
              Resp.data.toast.type == "success"
            ) {
              toast.success("Collectible purchase successfully", toasterOption);
              window.$(".modal").modal("hide");
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          })
          .catch((error) => {
            setPurchaseCallStatus("tryagain");
            toast.error("Transaction rejected by user", toasterOption);
          });
      } else {
        const BEP1155Contract = new web3.eth.Contract(
          BEP1155_ABI,
          item.contractAddress
        );
        var sendAmount = (
          item &&
          item.tokenowners_current.price &&
          item.tokenowners_current.price
        ).toString();

        sendAmount = sendAmount * config.decimalvalues;
        sendAmount = (sendAmount * NoOfToken).toString();
        sendAmount = await ChecktokenDecimal(sendAmount, config.decimalvalues);
        //sendAmount = parseFloat(sendAmount)* 10000
        sendAmount = await convert(sendAmount);
        //sendAmount = sendAmount / 10000;

        setPurchaseCallStatus("processing");
        var tokenaddress = "";
        if (PurchaseCurrency == config.owntokenSymbol) {
          tokenaddress = config.esctokenAddr;
        } else if (PurchaseCurrency == config.currencySymbol) {
          tokenaddress = item.contractAddress;
        } else {
          tokenaddress = config.esctokenAddr;
        }
        BEP1155Contract.methods
          .saleWithToken(
            item.tokenowners_current.tokenOwner,
            item.tokenCounts,
            sendAmount.toString(),
            NoOfToken,
            PurchaseCurrency
          )
          .send({
            from: props.Accounts,
          })
          .then(async (result) => {
            setPurchaseCallStatus("done");
            var postData = {
              tokenOwner: item.tokenowners_current.tokenOwner, // old owner
              UserAccountAddr: UserAccountAddr, // new owner
              tokenCounts: item.tokenCounts,
              tokenType: item.type,
              NoOfToken: NoOfToken,
              transactionHash: result.transactionHash,
              PurchaseCurrency: PurchaseCurrency,
              ipfsimage: item.ipfsimage,
              tokenName: item.tokenName,
              image: item.image,
            };
            var Resp = await PurchaseNow_Complete_Action(postData);
            if (
              Resp.data &&
              Resp.data.toast &&
              Resp.data.toast.type == "success"
            ) {
              toast.success("Collectible purchase successfully", toasterOption);
              window.$(".modal").modal("hide");
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          })
          .catch((error) => {
            setPurchaseCallStatus("tryagain");
            toast.error("Transaction rejected by user", toasterOption);
          });
      }
    }
    //}
  }
  function convert(n) {
    var sign = +n < 0 ? "-" : "",
      toStr = n.toString();
    if (!/e/i.test(toStr)) {
      return n;
    }
    var [lead, decimal, pow] = n
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

  useImperativeHandle(ref, () => ({
    async PurchaseNow_Click(item, BuyOwnerDetail = {}) {
      console.log(
        item,
        "========",
        BuyOwnerDetail,
        "========fromourchasenowclick"
      );
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
      var curAddr = await getCurAddr();
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      PriceCalculate({
        quantity: 1,
        price: BuyOwnerDetail.price,
        type: BuyOwnerDetail.type,
        PurchaseCurrency: BuyOwnerDetail.currency,
      });
      //var web3 = new Web3(window.ethereum);
      web3.eth.getBalance(props.Accounts).then((val) => {
        var balance = val / config.decimalvalues;
        set_PurchaseBalance(balance);
      });
      if (BuyOwnerDetail && typeof BuyOwnerDetail.price != "undefined") {
        item.tokenowners_current = {};
        item.tokenowners_current = BuyOwnerDetail;
        setPurchaseCurrency(BuyOwnerDetail.currency);
        setSaletoken(BuyOwnerDetail.balance);
      }
      if (BuyOwnerDetail.currency == config.currencySymbol) {
        Set_item(item);
        Set_TokenPrice(item.tokenowners_current.price);
        Set_NoOfToken(0);
        if (BuyOwnerDetail.type == 721) {
          //var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP721_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFee().call();
        } else {
          //var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP1155_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFee().call();
        }
        var feeval = fee / config.decimalvalues;
        setservicefee(feeval);
        let new_price = BuyOwnerDetail.price * config.decimalvalues;
        var newPrice1 =
          BuyOwnerDetail.type == 721 ? new_price : NoOfToken * new_price;
        var newPrice2 = newPrice1;
        var newPrice = newPrice2;

        // var newPrice =
        //   BuyOwnerDetail.type == 721
        //     ? BuyOwnerDetail.price * config.decimalvalues
        //     : NoOfToken * (BuyOwnerDetail.price * config.decimalvalues);
        var per = (newPrice * fee) / 1e20;
        var mulWei = newPrice + per;
        Set_YouWillPay((mulWei / config.decimalvalues).toFixed(config.toFixed));
        mulWei = await ChecktokenDecimal(mulWei, config.decimalvalues);
        mulWei = await convert(mulWei);
        Set_MultipleWei(mulWei);
        Set_Price(newPrice);

        web3.eth.getBalance(props.Accounts).then((val) => {
          var balance = val / config.decimalvalues;
          set_PurchaseBalance(balance);
        });
      } else if (BuyOwnerDetail.currency == config.owntokenSymbol) {
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
        Set_item(item);
        Set_TokenPrice(item.tokenowners_current.price);
        Set_NoOfToken(0);
        if (BuyOwnerDetail.type == 721) {
          // var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP721_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        } else {
          //var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP1155_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        }
        var feeval = fee / config.decimalvalues;
        setservicefee(feeval);
        let new_price = BuyOwnerDetail.price * config.decimalvalues;
        var newPrice1 =
          BuyOwnerDetail.type == 721 ? new_price : NoOfToken * new_price;

        var newPrice2 = newPrice1;
        var newPrice = newPrice2;

        var per = (newPrice * fee) / 1e20;
        var mulWei = newPrice + per;
        mulWei = await ChecktokenDecimal(mulWei, config.decimalvalues);
        mulWei = await convert(mulWei);
        Set_MultipleWei(mulWei);
        Set_YouWillPay(mulWei / config.decimalvalues);
        Set_Price(newPrice);
        var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        //var web3 = new Web3(window.ethereum);
        const ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
        var escbalance = await ESCContract.methods
          .balanceOf(props.Accounts)
          .call();
        set_PurchaseBalance(escbalance);
      } else {
        Set_item(item);
        Set_TokenPrice(item.tokenowners_current.price);
        Set_NoOfToken(0);
        if (BuyOwnerDetail.type == 721) {
          //var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP721_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        } else {
          //var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(
            BEP1155_ABI,
            item.contractAddress
          );
          var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        }
        var feeval = fee / config.decimalvalues;
        setservicefee(feeval);
        let new_price = BuyOwnerDetail.price * config.decimalvalues;
        var newPrice =
          BuyOwnerDetail.type == 721 ? new_price : NoOfToken * new_price;

        var newPrice2 = newPrice;
        newPrice = newPrice2;

        var per = (newPrice * fee) / 1e20;
        var mulWei = newPrice + per;
        mulWei = await ChecktokenDecimal(mulWei, config.decimalvalues);
        mulWei = await convert(mulWei);
        Set_MultipleWei(mulWei);
        Set_YouWillPay(mulWei / config.decimalvalues);
        Set_Price(newPrice);
        var fee = await CoursetroContract.methods.getServiceFeeESC().call();
        //var web3 = new Web3(window.ethereum);
        const ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
        var escbalance = await ESCContract.methods
          .balanceOf(props.Accounts)
          .call();
        set_PurchaseBalance(escbalance);
      }
      window.$("#buy_modal").modal("show");
    },
  }));

  useEffect(async () => {
    var curAddr = await getCurAddr();
    var payload = {
      curAddr: curAddr,
      tokenCounts: tokenidval,
    };
    TokenCounts_Get_Detail_Call(payload);
  }, []);

  const TokenCounts_Get_Detail_Call = async (payload) => {
    var curAddr = await getCurAddr();
    var Resp = await TokenCounts_Get_Detail_Action(payload);
    setitemQuantity(Resp.data.Detail.Resp.OnSaleBalance);
    // console.log(Resp,'Resp');
    if (
      Resp &&
      Resp &&
      Resp.data &&
      Resp.data.Detail &&
      Resp.data.Detail.Resp
    ) {
      var TokenResp = Resp.data.Detail.Resp;
      Set_TokenQuatity(TokenResp.TotalQuantity);
    }
  };

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
      <div
        className="modal fade primary_modal"
        data-backdrop="static"
        id="buy_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="buy_modalCenteredLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-md"
          role="document"
        >
          <div className="modal-content form-border">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="buy_modalLabel">
                Checkout
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeBtn}>
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body px-0">
              <div className="row mx-0 bor_bot_modal">
                <div className="col-12 col-md-6 px-4">
                  <p className="buy_title_sm">Seller</p>
                  <p className="buy_title_md">
                    {item.userprofile && item.userprofile.name
                      ? item.userprofile && item.userprofile.name
                      : halfAddrShow(
                          item &&
                            item.tokenowners_current &&
                            item.tokenowners_current.tokenOwner
                        )}
                  </p>
                </div>
                <div className="col-12 col-md-6 px-4">
                  <p className="buy_title_sm text-md-right">Buyer</p>
                  <p className="buy_title_md text-md-right">
                    {MyItemAccountAddr
                      ? halfAddrShow(MyItemAccountAddr)
                      : halfAddrShow(UserAccountAddr)}
                  </p>
                </div>
              </div>

              <div className="bor_bot_modal mb-3">
                <p className="buy_title_md px-4 py-3 text-center mb-0 text-white">
                  {"Your balance :"} {UserAccountBal.toFixed(8)}{" "}
                  {config.currencySymbol}
                </p>
                <p className="place_bit_desc_2 text-center">
                  {item &&
                  item.tokenowners_current &&
                  item.tokenowners_current.balance
                    ? "Available : " + item.tokenowners_current.balance
                    : "Available : 0"}
                </p>
              </div>
              {item.type == 721 ? (
                <div className="row mx-0 pb-3">
                  {/* <div className="col-12 col-sm-6 px-4"> */}
                  {!ValidateError.NoOfToken && ValidateError.TokenPrice && (
                    <span className="text-danger">
                      {ValidateError.TokenPrice}
                    </span>
                  )}
                  {/* </div> */}
                </div>
              ) : (
                <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-12 px-4">
                    <input
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-", ",", "."].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      min="0"
                      name="NoOfToken"
                      id="NoOfToken"
                      class="form-control mb-0 w-100"
                      placeholder="Enter item quantity"
                      aria-label="bid"
                      aria-describedby="basic-addon2"
                      onChange={inputChange}
                      // value={NoOfToken}
                      value={VQuattity}
                      autoComplete="off"
                    />
                  </div>
                  {ValidateError.NoOfToken && (
                    <span className="text-danger">
                      {ValidateError.NoOfToken}
                    </span>
                  )}
                  {!ValidateError.NoOfToken && ValidateError.TokenPrice && (
                    <span className="text-danger">
                      {ValidateError.TokenPrice}
                    </span>
                  )}
                </div>
              )}
              {/* <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Your balance</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{UserAccountBal} {config.currencySymbol}</p>
                </div>
              </div> */}
              {/* <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Quantity</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {itemQuantity}
                  </p>
                </div>
              </div> */}

              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Price</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {TokenPrice} {PurchaseCurrency}
                  </p>
                </div>
              </div>
              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">ETH Service fee</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{servicefee} % </p>
                </div>
              </div>
              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">You will pay</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {YouWillPay} {PurchaseCurrency}
                  </p>
                </div>
              </div>

              {/* <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Number of Quantity</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {TokenQuatity}
                  </p>
                </div>
              </div> */}

              <form className="px-4">
                <div className="text-center">
                  <div class="btn-NewBlock text-center">
                    <button
                      className="btn-main lead mar-top-10 mar-right-15"
                      type="button"
                      onClick={() => FormSubmit()}
                      disabled={FormSubmitLoading == "processing"}
                    >
                      {FormSubmitLoading == "processing" && (
                        <i
                          class="fa fa-spinner mr-3 spinner_icon"
                          aria-hidden="true"
                          id="circle1"
                        ></i>
                      )}
                      Proceed to payment
                    </button>
                    <button
                      className="btn-main btnGrey lead mar-top-10"
                      data-dismiss="modal"
                      aria-label="Close"
                      type="button"
                      onClick={closeBtn}
                    >
                      Cancel
                    </button>
                  </div>
                  {/* <div class="btn-NewBlock text-center">
                  <button className="btn-main btnGrey lead mar-top-10" data-dismiss="modal" aria-label="Close">Cancel</button>
                </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* proceed Modal */}
      <div
        className="modal fade primary_modal"
        data-backdrop="static"
        id="proceed_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="proceed_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="proceed_modalLabel">
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
                <p className="mt-0 purchase_text text-center">
                  Approve the transaction
                </p>
                <p className="mt-0 purchase_desc text-center">
                  Send transaction with your wallet
                </p>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => FormSubmit_StepOne()}
                    className="btn-main lead mar-top-10 mb-0"
                    disabled={
                      ApproveCallStatus == "processing" ||
                      ApproveCallStatus == "done"
                    }
                  >
                    {ApproveCallStatus == "processing" && (
                      <i
                        class="fa fa-spinner mr-3 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}
                    {ApproveCallStatus == "init" && "Approve"}
                    {ApproveCallStatus == "processing" && "In-progress..."}
                    {ApproveCallStatus == "done" && "Done"}
                    {ApproveCallStatus == "tryagain" && "Try Again"}
                  </button>
                </div>
              </form>
              <form>
                <p className="mt-0 purchase_text text-center">Purchase</p>
                <p className="mt-0 purchase_desc text-center">
                  Send transaction with your wallet
                </p>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => FormSubmit_StepTwo()}
                    className="btn-main lead mar-top-10 mb-0"
                    disabled={
                      ApproveCallStatus != "done" ||
                      PurchaseCallStatus == "processing" ||
                      PurchaseCallStatus == "done"
                    }
                  >
                    {PurchaseCallStatus == "processing" && (
                      <i
                        class="fa fa-spinner mr-3 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}
                    {PurchaseCallStatus == "init" && "Purchase"}
                    {PurchaseCallStatus == "processing" && "In-progress..."}
                    {PurchaseCallStatus == "done" && "Done"}
                    {PurchaseCallStatus == "tryagain" && "Try Again"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end proceed modal */}
    </div>
  );
});
