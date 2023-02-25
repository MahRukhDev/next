import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import BEP1155 from "../../ABI/BEP1155.json";
import BEP721 from "../../ABI/BEP721.json";
import ESC from "../../ABI/ESC.json";
import config from "../../lib/config";
// import Select from "react-select";
import { getmylog } from "../../helper/walletconnect";

import {
  AddLikeAction,
  GetLikeDataAction,
  TokenPriceChange_update_Action,
} from "../../actions/v1/token";

import { getCurAddr, halfAddrShow } from "../../actions/v1/user";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;
//var web3 = new Web3(window.ethereum);
//const ESCContract = new web3.eth.Contract(ESC, config.esctokenAddr);

const price = [
  { value: "ETH", label: "ETH" },
  { value: "VALOBIT", label: "VALOBIT" },
];

export const PutOnSaleRef = forwardRef((props, ref) => {
  const [BuyerName, Set_BuyerName] = useState("");
  const [blns, Set_blns] = useState("");
  const [dethBln, Set_dethBln] = useState("");
  const [bidProfile1, Set_bidProfile1] = useState([]);
  const [FormSubmitLoading, Set_FormSubmitLoading] = useState("");
  const [ValidateError, Set_ValidateError] = useState({});
  const [YouWillGet, Set_YouWillGet] = useState(0);
  const [TokenPrice, Set_TokenPrice] = useState(0);
  const [TokenPrice_Initial, Set_TokenPrice_Initial] = useState(0);
  const [biddingtoken, set_biddingtoken] = useState(config.currencySymbol);
  const [servicefee, setservicefee] = useState(0);
  const [PurchaseCurrency, setPurchaseCurrency] = useState(
    config.currencySymbol
  );
  const [TokenBalance, Set_TokenBalance] = useState(0);
  const [newprice, setNewprice] = useState();

  const inputChange = async (e) => {
    // var provider = window.ethereum;
    // var web3 = new Web3(provider);
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
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.name
    ) {
      var value = e.target.value;
      switch (e.target.name) {
        case "TokenPrice":
          Set_TokenPrice(value);
          if (value != "" && isNaN(value) == false && value > 0) {
            var weii = await web3.utils.toWei(value.toString());
            console.log(value, "value");
            setNewprice(value);
            //var web3 = new Web3(window.ethereum);
            if (item.type == 721) {
              var CoursetroContract = new web3.eth.Contract(
                BEP721,
                item.contractAddress
              );
              var fee = await CoursetroContract.methods.getServiceFee().call();
            } else {
              var CoursetroContract = new web3.eth.Contract(
                BEP1155,
                item.contractAddress
              );
              var fee = await CoursetroContract.methods.getServiceFee().call();
            }
            var per = (weii * fee) / 1e20;
            Set_YouWillGet(
              parseFloat((weii - per) / config.decimalvalues).toFixed(
                config.toFixed
              )
            );
          }
          ItemValidation({ TokenPrice: value });
          break;
        default:
        // code block
      }
    }
  };
  const cancelClick = async () => {
    document.getElementById("TokenPrice").value = "";
  };
  const SelectBidcurrency = (e) => {
    var filter = e.target.value;
    set_biddingtoken(filter);
    // getTokenval(filter)
  };
  const onKeyUp = (e) => {
    var charCode = e.keyCode;
    if ((charCode > 47 && charCode < 58) || (charCode > 95 && charCode < 106)) {
      var ValidateError = {};
      Set_ValidateError(ValidateError);
    } else {
      var ValidateError = {};
      ValidateError.TokenPrice = '"Token Price" must be a number';
      Set_TokenPrice("");
      Set_ValidateError(ValidateError);
      //   return false;
    }
  };

  const ItemValidation = async (data = {}) => {
    var ValidateError = {};

    var Chk_TokenPrice =
      typeof data.TokenPrice != "undefined" ? data.TokenPrice : TokenPrice;

    if (Chk_TokenPrice == "") {
      ValidateError.TokenPrice = '"Token Price" is not allowed to be empty';
    } else if (Chk_TokenPrice == 0) {
      ValidateError.TokenPrice = '"Token Price" must be greater than 0';
    } else if (isNaN(Chk_TokenPrice) == true) {
      ValidateError.TokenPrice = '"Token Price" must be a number';
    } else if (Math.sign(TokenPrice) < 0) {
      ValidateError.TokenPrice = "Price must be a possitive number";
    }
    // else if (TokenPrice_Initial > 0 && Chk_TokenPrice >= TokenPrice_Initial) {
    //   ValidateError.TokenPrice =
    //     '"Token Price" must be less than ' + TokenPrice_Initial;
    // }
    else {
      delete ValidateError.TokenPrice;
    }
    Set_ValidateError(ValidateError);
    return ValidateError;
  };
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

  async function FormSubmit() {
    var errors = await ItemValidation();
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      window.$("#PutOnSale_modal").modal("show");

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
    var curAddr = await web3.eth.getAccounts();
    if (curAddr) {
      if (web3 && web3.eth) {
        if (item.type == 721) {
          var CoursetroContract = new web3.eth.Contract(
            BEP721,
            item.contractAddress
          );
          Set_FormSubmitLoading("processing");
          var newtoken = TokenPrice.toString();
          newtoken = parseFloat(newtoken) * config.decimalvalues;
          newtoken = await ChecktokenDecimal(newtoken, config.decimalvalues);
          newtoken = await convert(newtoken);
          CoursetroContract.methods
            .orderPlace(props.item.tokenCounts, newtoken.toString())
            .send({ from: props.Accounts })
            .then(async (result) => {
              Set_FormSubmitLoading("done");
              var postData = {
                tokenOwner: UserAccountAddr,
                tokenCounts: props.item.tokenCounts,
                price: TokenPrice,
                biddingtoken: biddingtoken,
                blockHash: result.blockHash,
                transactionHash: result.transactionHash,
                TokenPrice_Initial: TokenPrice_Initial,
              };
              var Resp = await TokenPriceChange_update_Action(postData);
              if (
                Resp.data &&
                Resp.data.RetType &&
                Resp.data.RetType == "success"
              ) {
                toast.success(
                  " NFT places for sale on marketplace",
                  toasterOption
                );
                window.$("#PutOnSale_modal").modal("hide");
                setTimeout(() => {
                  window.location.reload(false);
                }, 2000);
              }
            })
            .catch((error) => {
              Set_FormSubmitLoading("error");
              toast.error("Transaction rejected by user", toasterOption);
            });
        } else {
          var CoursetroContract = new web3.eth.Contract(
            BEP1155,
            item.contractAddress
          );
          Set_FormSubmitLoading("processing");
          let newtoken = TokenPrice.toString();
          newtoken = parseFloat(newtoken) * config.decimalvalues;
          newtoken = await ChecktokenDecimal(newtoken, config.decimalvalues);
          newtoken = await convert(newtoken);
          CoursetroContract.methods
            .orderPlace(props.item.tokenCounts, newtoken.toString())
            .send({ from: props.Accounts })
            .then(async (result) => {
              Set_FormSubmitLoading("done");
              var postData = {
                tokenOwner: UserAccountAddr,
                tokenCounts: props.item.tokenCounts,
                price: TokenPrice,
                biddingtoken: biddingtoken,
                blockHash: result.blockHash,
                transactionHash: result.transactionHash,
                TokenPrice_Initial: TokenPrice_Initial,
              };
              var Resp = await TokenPriceChange_update_Action(postData);
              if (
                Resp.data &&
                Resp.data.RetType &&
                Resp.data.RetType == "success"
              ) {
                toast.success(
                  " NFT places for sale on marketplace",
                  toasterOption
                );
                window.$("#PutOnSale_modal").modal("hide");
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
      }
    }
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

  var { item, UserAccountAddr, UserAccountBal, Set_NoOfToken, NoOfToken } =
    props;
  useEffect(() => {
    getfee();
    Set_ValidateError({});
  }, []);

  async function getfee() {
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
      // if (window.ethereum) {
      //var web3 = new Web3(window.ethereum);
      if (item.type == 721) {
        var CoursetroContract = new web3.eth.Contract(
          BEP721,
          item.contractAddress
        );
        var fee = await CoursetroContract.methods.getServiceFee().call();
      } else {
        var CoursetroContract = new web3.eth.Contract(
          BEP1155,
          item.contractAddress
        );
        var fee = await CoursetroContract.methods.getServiceFee().call();
      }
      var feeValue = fee / config.decimalvalues;
      setservicefee(feeValue);
      //}
    } catch (err) {}
  }

  useImperativeHandle(ref, () => ({
    async PutOnSale_Click(item, ownerdetail) {
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
      //var curAddr = await web3.eth.getAccounts();
      getfee(item);
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      props.Set_HitItem(item);

      if (ownerdetail && ownerdetail.currency) {
        if (ownerdetail && ownerdetail.currency == config.owntokenSymbol) {
          setPurchaseCurrency(ownerdetail.currency);
          set_biddingtoken(ownerdetail.currency);
        } else {
          setPurchaseCurrency(ownerdetail.currency);
          set_biddingtoken(ownerdetail.currency);
        }
      }
      if (ownerdetail.type == 721) {
        var CoursetroContract = new web3.eth.Contract(
          BEP721,
          item.contractAddress
        );
        var fee = await CoursetroContract.methods.getServiceFee().call();
        var feeValue = fee / config.decimalvalues;
        setservicefee(feeValue);
        Set_TokenPrice_Initial(ownerdetail.price);
        Set_ValidateError({});
        window.$("#PutOnSale_modal").modal("show");
      } else {
        var CoursetroContract = new web3.eth.Contract(
          BEP1155,
          item.contractAddress
        );
        var fee = await CoursetroContract.methods.getServiceFee().call();
        var feeValue = fee / config.decimalvalues;
        setservicefee(feeValue);
        Set_TokenPrice_Initial(ownerdetail.price);
        Set_ValidateError({});
        window.$("#PutOnSale_modal").modal("show");
      }
      Set_TokenPrice_Initial(ownerdetail.price);
      Set_ValidateError({});
      window.$("#PutOnSale_modal").modal("show");
    },
  }));
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
        id="PutOnSale_modal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="accept_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content form-border">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="PutOnSale_modalLabel">
                NFT for Sale
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={cancelClick}>
                  &times;
                </span>
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
                ) : (item &&
                    item.image &&
                    item.image.split(".").pop() == "mp3") ||
                  (item &&
                    item.image &&
                    item.image.split(".").pop() == "wav") ? (
                  <>
                    <img
                      src={`${config.Back_URL}images/music.png`}
                      alt=""
                      className="img-fluid img-rounded mb-sm-30"
                    />
                    {(item &&
                      item.image &&
                      item.image.split(".").pop() == "mp3") ||
                    (item &&
                      item.image &&
                      item.image.split(".").pop() == "wav") ? (
                      <audio
                        src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}
                        type="audio/mp3"
                        controls
                        className="audio audio_widyth"
                      ></audio>
                    ) : (
                      ""
                    )}
                    {/* <audio
                      src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                      type="audio/mp3"
                      controls
                      className="img-fluid img-rounded mb-sm-30"
                    ></audio> */}
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
                  You are about to place order for
                </span>
              </p>
              <p className="text-center accept_desc">
                <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>{" "}
                <span className="buy_desc_sm pl-2">from </span>
                {/* <span className="buy_desc_sm_bold pl-2"></span>*/}
                {item.userprofile && item.userprofile.name ? (
                  <span className="buy_desc_sm_bold pl-2">
                    {item.userprofile.name}
                  </span>
                ) : (
                  item &&
                  item.tokenowners_current &&
                  item.tokenowners_current.tokenOwner && (
                    <span className="buy_desc_sm_bold pl-2">
                      {halfAddrShow(
                        item &&
                          item.tokenowners_current &&
                          item.tokenowners_current.tokenOwner
                      )}
                    </span>
                  )
                )}
              </p>
              <div class="input-group mb-3 input_grp_style_1">
                <input
                  placeholder="New Price"
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-", ","].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  min="0"
                  name="TokenPrice"
                  id="TokenPrice"
                  class="form-control mb-0"
                  aria-label="bid"
                  aria-describedby="basic-addon2"
                  onChange={inputChange}
                  // value={newprice}
                  autoComplete="off"
                />
              </div>
              {ValidateError.TokenPrice && (
                <span className="text-danger">{ValidateError.TokenPrice}</span>
              )}
              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">ETH Service fee</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{servicefee} %</p>
                </div>
              </div>
              <div className="row mx-0 pb-3">
                <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">You will get</p>
                </div>
                <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">
                    {YouWillGet} {biddingtoken}
                  </p>
                </div>
              </div>
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
                      Continue
                    </button>
                    <button
                      className="btn-main btnGrey lead mar-top-10"
                      data-dismiss="modal"
                      aria-label="Close"
                      type="button"
                      onClick={cancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                  {/* <div class="btn-NewBlock text-center">
                  <button
                    className="btn-main btnGrey lead mar-top-10"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Cancel
                  </button>
                </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
