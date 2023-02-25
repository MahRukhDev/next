import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";

import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import BEP721 from "../../ABI/BEP721.json";
import BEP1155 from "../../ABI/BEP1155.json";
import config from "../../lib/config";

import {
  AddLikeAction,
  GetLikeDataAction,
  TokenPriceChange_update_Action,
} from "../../actions/v1/token";
import { getmylog } from "../../helper/walletconnect";

import { getCurAddr } from "../../actions/v1/user";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

export const CancelOrderRef = forwardRef((props, ref) => {
  // const history = useHistory();
  const [FormSubmitLoading, Set_FormSubmitLoading] = React.useState("");
  const [TokenPrice, Set_TokenPrice] = React.useState(0);
  const [owntoken, Set_owntoken] = React.useState(0);
  const [owntokenprice, setowntokenprice] = React.useState(0);
  const [PurchaseCurrency, setPurchaseCurrency] = React.useState("");

  async function FormSubmit() {
    // if (window.ethereum) {
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
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        window.location.href = "/connect";
        return false;
      }
      if (item.type == 721) {
        var CoursetroContract = new web3.eth.Contract(
          BEP721,
          item.contractAddress
        );
        Set_FormSubmitLoading("processing");
        CoursetroContract.methods
          .cancelOrder(props.item.tokenCounts)
          .send({ from: props.Accounts })
          .then(async (result) => {
            Set_FormSubmitLoading("done");
            var postData = {
              tokenOwner: UserAccountAddr,
              tokenCounts: props.item.tokenCounts,
              tokenPrice: TokenPrice,
              blockHash: result.blockHash,
              transactionHash: result.transactionHash,
              BidToken: PurchaseCurrency,
              from: "cancel",
            };
            var Resp = await TokenPriceChange_update_Action(postData);
            if (
              Resp.data &&
              Resp.data.RetType &&
              Resp.data.RetType == "success"
            ) {
              toast.success("Sale order cancelled successfully", toasterOption);
              window.$(".modal").modal("hide");
              setTimeout(() => {
                window.location.reload(false);
              }, 1500);
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
        CoursetroContract.methods
          .cancelOrder(props.item.tokenCounts)
          .send({ from: props.Accounts })
          .then(async (result) => {
            Set_FormSubmitLoading("done");
            var postData = {
              tokenOwner: UserAccountAddr,
              tokenCounts: props.item.tokenCounts,
              tokenPrice: TokenPrice,
              blockHash: result.blockHash,
              transactionHash: result.transactionHash,
              BidToken: PurchaseCurrency,
              from: "cancel",
            };
            var Resp = await TokenPriceChange_update_Action(postData);
            if (
              Resp.data &&
              Resp.data.RetType &&
              Resp.data.RetType == "success"
            ) {
              toast.success("Sale order cancelled successfully", toasterOption);
              window.$(".modal").modal("hide");
              setTimeout(() => {
                window.location.reload(false);
              }, 1500);
            }
          })
          .catch((error) => {
            Set_FormSubmitLoading("error");
            toast.error("Transaction rejected by user", toasterOption);
          });
      }
    }
    //}
  }

  var { item, UserAccountAddr } = props;

  useImperativeHandle(ref, () => ({
    async CancelOrder_Click(item, BuyOwnerDetail = {}) {
      console.log(item, "ii");
      props.Set_HitItem(item);
      Set_TokenPrice(0);
      console.log(
        item,
        "===============",
        BuyOwnerDetail,
        "=============froncancelorder"
      );
      let IndexVal =
        item &&
        item.OnSaleOwner &&
        item.OnSaleOwner.findIndex(
          (val) => val.tokenOwner.toString() == UserAccountAddr.toString()
        );
      setowntokenprice(
        parseInt(IndexVal) >= 0 &&
          item.OnSaleOwner[IndexVal] &&
          item.OnSaleOwner[IndexVal].price
          ? item.OnSaleOwner[IndexVal].price
          : item.tokenowners_current && item.tokenowners_current.price
          ? item.tokenowners_current.price
          : item.price
      );
      Set_owntoken(BuyOwnerDetail);
      setPurchaseCurrency(BuyOwnerDetail.currency);
      window.$("#cancel_order_modal").modal("show");
    },
  }));

  console.log(item, "=========fromcancelorder");

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
        class="modal fade primary_modal"
        id="cancel_order_modal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="cancel_order_modalCenteredLabel"
        aria-hidden="true"
        data-keyboard="false"
      >
        <div
          class="modal-dialog modal-dialog-centered modal-sm"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="cancel_order_modalLabel">
                Cancel Sale Order
              </h5>
              <p className="text_grey_clickb mb-0"></p>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body px-0 pt-0">
              <form className="px-4 bid_form">
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Token Price</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">
                      {/* {owntoken && owntoken.price} {PurchaseCurrency} */}
                      {owntokenprice} {PurchaseCurrency}
                    </p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button
                    className="btn-main lead mar-top-10"
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
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center mt-3">
          <button
            className="btn-main lead mar-top-10"
            data-dismiss="modal"
            type="button"
            aria-label="Close"
          >
            {FormSubmitLoading == "processing" && (
              <i
                class="fa fa-spinner mr-3 spinner_icon"
                aria-hidden="true"
                id="circle1"
              ></i>
            )}
            Sign sell order
          </button>
        </div>
      </div>
    </div>
  );
});
