import React, { forwardRef, useImperativeHandle } from "react";

import Web3 from "web3";
import "@metamask/legacy-web3";
import $ from "jquery";
import config from "../../lib/config";

import { AddLikeAction, GetLikeDataAction } from "../../actions/v1/token";
import BEP1155 from "../../ABI/BEP1155.json";
import BEP721 from "../../ABI/BEP721.json";
import ESC_ABI from "../../ABI/ESC.json";
import { getCurAddr } from "../../actions/v1/user";
import {
  convertion,
  BurnField,
  TokenCounts_Get_Detail_Action,
} from "../../actions/v1/token";
import { Button, TextField } from "@material-ui/core";
import { toast } from "react-toastify";
import { getmylog } from "../../helper/walletconnect";

toast.configure();
let toasterOption = config.toasterOption;

var web3 = new Web3(window.ethereum);
const ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);

export const BurnRef = forwardRef((props, ref) => {
  const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState("");
  const [onwer_price, set_owner_price] = React.useState({});
  const [burnLoading, setBurnLoading] = React.useState("empty");
  const [noofitems, setnoofitem] = React.useState(1);
  const [showingLoader, setshowingLoader] = React.useState(false);
  const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = React.useState({});
  const [OwnersDetailFirst, Set_OwnersDetailFirst] = React.useState({});
  const [tokenCounts_Detail, Set_tokenCounts_Detail] = React.useState({});
  const [Bids, Set_Bids] = React.useState({});
  const [MyTokenBalance, Set_MyTokenBalance] = React.useState(0);
  const [MyTokenDetail, Set_MyTokenDetail] = React.useState(0);
  // var [item, Set_item] = React.useState({});
  var [item1, Set_item1] = React.useState({});
  const [Burndata, setBurndata] = React.useState(0);

  var { item, UserAccountAddr, GetUserBal, Set_item } = props;

  async function FormSubmit(item, Burntoken) {
    console.log(Burntoken, "BurinTokennnnnn", item, "Burntoken=--");
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
    // alert(item.contractAddress);
    if (web3 && web3.eth) {
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      if (noofitems == "") {
        toast.error("Burn token is not allow to empty", toasterOption);
        return false;
      } else if (noofitems == 0) {
        toast.error("Burn token must be greater than zero", toasterOption);
        return false;
      }
      console.log(Burntoken, "BurntokenBurntokenBurntokenBurntokenBeCo--");

      if (Burntoken.type == 721) {
        console.log(Burntoken, "BurntokenBurntokenBurntokenBurntoken");
        var CoursetroContract = new web3.eth.Contract(
          BEP721,
          item.contractAddress
        );
        let contract =
          Burntoken.type === config.singleType
            ? item.contractAddress
            : item.contractAddress;
        setBurnLoading("processing");
        CoursetroContract.methods
          .burn(Burntoken.tokenCounts)
          .send({ from: UserAccountAddr })
          .then(async (result) => {
            setBurnLoading("done");
            var postData = {
              tokenOwner: UserAccountAddr,
              tokenCounts: Burntoken.tokenCounts,
              blockHash: result.blockHash,
              transactionHash: result.transactionHash,
              contractAddress: Burntoken.contractAddress,
              type: Burntoken.type,
              balance: noofitems,
              currAddr: UserAccountAddr,
              quant: Burntoken.balance,
              ipfsimage: Burntoken.ipfsimage,
              name: Burntoken.name,
              price: Burntoken.price,
            };
            console.log(postData, "postDatattt");
            var updateBurnField = await BurnField(postData);
            console.log(updateBurnField, "updateBurnFieldupdateBurnField");
            if (updateBurnField) {
              toast.success("NFT burned succesfully", toasterOption);
              window.$("#burn_token_modal").modal("hide");
              // document.getElementById("closeburn").click();
              window.location.reload();
            }
          })
          .catch((error) => {
            console.log(error, "ERRRRRRRRRRRRRRR");
            setBurnLoading("try");
            toast.error("Transaction rejected by user", toasterOption);
            setTimeout(() => window.location.reload(false), 900);
          });
      } else {
        var CoursetroContract = new web3.eth.Contract(
          BEP1155,
          item.contractAddress
        );
        // alert(item.contractAddress);
        console.log(CoursetroContract, "CoursetroContract");
        let contract =
          Burntoken.type === config.singleType
            ? item.contractAddress
            : item.contractAddress;
        if (noofitems > MyTokenDetail.balance) {
          toast.error(
            "Available Tokens" + " " + MyTokenDetail.balance,
            toasterOption
          );
          return false;
        }
        setBurnLoading("processing");
        console.log(
          UserAccountAddr,
          Burntoken.tokenCounts,
          noofitems,
          "noofitemsnoofitems"
        );
        CoursetroContract.methods
          .burn(UserAccountAddr, Burntoken.tokenCounts, noofitems)
          .send({ from: props.Accounts })
          .then(async (result) => {
            console.log(result, "-------resukt-------");
            setBurnLoading("done");
            var postData = {
              tokenOwner: UserAccountAddr,
              tokenCounts: Burntoken.tokenCounts,
              blockHash: result.blockHash,
              transactionHash: result.transactionHash,
              contractAddress: Burntoken.contractAddress,
              type: Burntoken.type,
              balance: noofitems,
              currAddr: UserAccountAddr,
              quant: Burntoken.balance,
              ipfsimage: Burntoken.ipfsimage,
              name: Burntoken.name,
              price: Burntoken.price,
            };
            console.log(postData, "POstData1155Burn Token");
            var updateBurnField = await BurnField(postData);
            console.log(updateBurnField, "updateBurnFieldupdateBurnField22");
            if (updateBurnField) {
              toast.success("Burned successfully", toasterOption);
              window.$("#burn_token_modal").modal("hide");
              // document.getElementById("closeburn").click();
              window.location.reload();
            }
          })
          .catch((error) => {
            setBurnLoading("try");
            toast.error("Transaction rejected by user", toasterOption);
            setTimeout(() => window.location.reload(false), 900);
          });
      }
    }
    //}
  }
  const TokenCounts_Get_Detail_Call = async (payload) => {
    var curAddr = await getCurAddr();
    setshowingLoader(true);
    var Resp = await TokenCounts_Get_Detail_Action(payload);
    console.log(Resp, "Resp-Resp");
    setTimeout(() => {
      setshowingLoader(false);
    }, 2000);

    if (
      Resp &&
      Resp &&
      Resp.data &&
      Resp.data.Detail &&
      Resp.data.Detail.Resp
    ) {
      var TokenResp = Resp.data.Detail.Resp;
      if (
        TokenResp &&
        TokenResp.Token &&
        TokenResp.Token[0] &&
        TokenResp.Token[0].tokenowners_current
      ) {
        for (
          let i = 0;
          i < TokenResp.Token[0].tokenowners_current.length;
          i++
        ) {
          const element = TokenResp.Token[0].tokenowners_current[i];
          set_owner_price(element);
          console.log(element, "=====element");
          if (element.tokenPrice > 0 && element.tokenOwner != curAddr) {
            Set_BuyOwnerDetailFirst(element);
            break;
          }
          if (element.tokenPrice > 0 && element.tokenOwner == curAddr) {
            Set_OwnersDetailFirst(element);
            break;
          }
        }
      }
      Set_tokenCounts_Detail(TokenResp);
      if (TokenResp.Bids) {
        Set_Bids(TokenResp.Bids);
      }

      var IndexVal = -1;
      if (TokenResp.Token[0].tokenowners_all && curAddr) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(
          (val) =>
            val.tokenOwner.toString() == curAddr.toString() && val.balance > 0
        );
      }
      if (IndexVal > -1) {
        Set_MyTokenBalance(tokenowners_all[IndexVal].balance);
        console.log(
          tokenowners_all[IndexVal],
          "tokenowners_all[IndexVal]tokenowners_all[IndexVal]"
        );
        Set_MyTokenDetail(tokenowners_all[IndexVal]);
      } else {
        Set_MyTokenDetail({});
        Set_MyTokenBalance(0);
      }

      if (TokenResp.Token && TokenResp.Token[0]) {
        Set_item1(TokenResp.Token[0]);
      }
    }
  };
  const hidevalue = (e) => {
    e.preventDefault();
    setnoofitem(1);
  };
  const handleChange = (e) => {
    setnoofitem(e.target.value);
    // if (
    //   MyTokenDetail >= e &&
    //   e.target &&
    //   typeof e.target.value != "undefined"
    // ) {
    //   setnoofitem(e.target.value);
    //   setBurnLoading("init");
    // } else if (e.target.value == 0) {
    //   setBurnLoading("zero");
    //   setnoofitem(0);
    // } else if (e.target.value == "") {
    //   setBurnLoading("empty");
    //   setnoofitem("");
    // } else if (e.target.value == undefined) {
    //   setBurnLoading("empty");
    //   setnoofitem("");
    // } else if(e.target.value == null){
    //   setBurnLoading("errors");
    //   setnoofitem("");
    // }  else {
    //   setBurnLoading("errors");
    //   setnoofitem("");
    // }
    // let one = e.target.value;
    // let v = one.includes(".")
    // if(v){
    //   setnoofitem("")
    // }
  };
  useImperativeHandle(ref, () => ({
    async Burn_Click(item, burndata) {
      console.log(burndata, item, "burndataburndatasaran");
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      setBurndata(burndata);
      Set_item(item);
      var curAddr = await getCurAddr();
      var payload = {
        curAddr: curAddr,
        tokenCounts: item.tokenCounts,
      };
      console.log(payload, "paaaaaaaayaaaya");
      TokenCounts_Get_Detail_Call(payload);
      window.$("#burn_token_modal").modal("show");
    },
  }));

  return (
    <div>
      {burnLoading == "processing" && (
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
        id="burn_token_modal"
        tabindex="-1"
        role="dialog"
        data-backdrop="static"
        aria-labelledby="accept_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content form-border">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="burn_token_modalLabel">
                Burn NFT
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={hidevalue}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="img_accept text-center">
                {/* <img src={require("../assets/images/info_01.png")} alt="Collections" className="img-fluid" /> */}
              </div>
              <p className="text-center accept_desc mb-0 mar-top-10">
                <span className="buy_desc_sm">
                  Are you sure you want to burn this NFT? This action is
                  irreversible. The NFT will be sent to Zero address on
                  blockchain.
                </span>
              </p>

              <div class="input-group mb-3 input_grp_style_1">
                {console.log(Burndata, "burndataburndatasaran1")}
                {Burndata.type != 721 && (
                  <input
                    type="number"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", ",", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    min="0"
                    name="burn"
                    id="burn"
                    placeholder="Enter no of quantity"
                    class="form-control mb-0"
                    aria-label="bid"
                    aria-describedby="basic-addon2"
                    onChange={handleChange}
                    value={noofitems}
                    autoComplete="off"
                  />
                )}
              </div>
              <form className="px-4">
                {console.log(MyTokenDetail, "MyTokenDetailMyTokenDetail")}
                <div className="text-center">
                  <button
                    className="btn-main lead mar-top-10 mar-right-15"
                    type="button"
                    onClick={() => FormSubmit(item, MyTokenDetail)}
                    disabled={
                      burnLoading == "done" ||
                      burnLoading == "processing" ||
                      burnLoading == "errors"
                    }
                  >
                    {burnLoading == "processing" && (
                      <i
                        class="fa fa-spinner mr-3 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}
                    {burnLoading == "init" && "Continue"}
                    {burnLoading == "processing" && "In-progress..."}
                    {burnLoading == "done" && "Done"}
                    {burnLoading == "try" && "Try Again"}
                    {burnLoading == "errors" && "Check Balance"}
                    {burnLoading == "empty" && "Continue"}
                  </button>
                  <button
                    className="btn-main btnGrey lead mar-top-10"
                    data-dismiss="modal"
                    aria-label="Close"
                    type="button"
                    onClick={hidevalue}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
