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

import {
  AddLikeAction,
  GetLikeDataAction,
  TokenPriceChange_update_Action,
  PurchaseNow_Complete_Action,
  ActivitySection,
} from "../../actions/v1/token";

import { getCurAddr, halfAddrShow } from "../../actions/v1/user";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;
//const EscContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);

export const TransferRef = forwardRef((props, ref) => {
  const [item, Set_item] = React.useState(props.item);
  const [NoOfToken, Set_NoOfToken] = useState(0);
  const [toaddress, Set_Toaddress] = useState(0);
  const [mydetail, Set_mydetail] = useState(0);
  const [FormSubmitLoading, Set_FormSubmitLoading] = useState("");
  const [ValidateError, Set_ValidateError] = useState({});
  const [PurchaseCurrency, setPurchaseCurrency] = useState();

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
          break;
        case "toaddress":
          Set_Toaddress(value);
          break;
        default:
        // code block
      }
    }
  };

  const ItemValidation = async (data = {}) => {
    var ValidateError = {};
    var Collectible_balance = 0;
    if (item && item.tokenowners_current && item.tokenowners_current.balance) {
      Collectible_balance = item.tokenowners_current.balance;
    }
    var quantity =
      typeof data.quantity != "undefined" ? data.quantity : NoOfToken;
    console.log(typeof quantity, "quantityquantity");
    if (quantity == "") {
      ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
    } else if (parseFloat(quantity) <= 0) {
      ValidateError.NoOfToken = '"Quantity" must be greater than 0';
    } else if (isNaN(quantity) == true) {
      ValidateError.NoOfToken = '"Quantity" must be a number';
    }
    if (quantity > Collectible_balance) {
      ValidateError.NoOfToken =
        '"Quantity" must be below on ' + Collectible_balance;
    }
    function isInt(value) {
      var er = /^-?[0-9]+$/;
      return er.test(value);
    }
    if (!isInt(parseFloat(quantity))) {
      ValidateError.NoOfToken = '"Quantity" must be a Integer';
    }
    if (toaddress == "") {
      ValidateError.toaddress = '"To Addresss" is not allowed to be empty';
    } else {
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

      var isUser = web3.utils.isAddress(toaddress);
      if (isUser == false) {
        ValidateError.toaddress = '"Please enter valid address';
      }
    }
    Set_ValidateError(ValidateError);
    return ValidateError;
  };
  async function FormSubmit() {
    var errors = await ItemValidation();
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      toast.error("Please fill all the required fields", toasterOption);
      return false;
    }
    Set_FormSubmitLoading("processing");
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
    if (currAddr[0].toLowerCase() != toaddress.toLowerCase()) {
      if (item.type == 721) {
        const BEP721Contract = new web3.eth.Contract(
          BEP721_ABI,
          item.contractAddress
        );
        BEP721Contract.methods
          .safeTransferFrom(
            item.tokenowners_current.tokenOwner,
            toaddress,
            item.tokenCounts
          )
          .send({
            from: currAddr[0].toLowerCase(),
          })
          .then(async (result) => {
            Set_FormSubmitLoading("done");
            var postData = {
              tokenOwner: item.tokenowners_current.tokenOwner, // old owner
              UserAccountAddr: toaddress.toLowerCase(), // new owner
              tokenCounts: item.tokenCounts,
              tokenType: item.type,
              NoOfToken: item.type == 721 ? 1 : NoOfToken,
              transactionHash: result.transactionHash,
              PurchaseCurrency: PurchaseCurrency,
              transfer: true,
            };
            console.log(postData, "POstDatatatat");
            var Resp = await PurchaseNow_Complete_Action(postData);
            if (
              Resp.data &&
              Resp.data.toast &&
              Resp.data.toast.type == "success"
            ) {
              toast.success("NFT transferred succesfully", toasterOption);
              window.$(".transfer_sale_modal").modal("hide");
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
        const BEP1155Contract = new web3.eth.Contract(
          BEP1155_ABI,
          item.contractAddress
        );
        BEP1155Contract.methods
          .safeTransferFrom(
            item.tokenowners_current.tokenOwner,
            toaddress,
            item.tokenCounts,
            NoOfToken,
            "0x"
          )
          .send({
            from: currAddr[0].toLowerCase(),
          })
          .then(async (result) => {
            Set_FormSubmitLoading("done");
            var postData = {
              tokenOwner: item.tokenowners_current.tokenOwner, // old owner
              UserAccountAddr: toaddress.toLowerCase(), // new owner
              tokenCounts: item.tokenCounts,
              tokenType: item.type,
              NoOfToken: item.type == 721 ? 1 : NoOfToken,
              transactionHash: result.transactionHash,
              PurchaseCurrency: PurchaseCurrency,
              transfer: true,
            };
            var Resp = await PurchaseNow_Complete_Action(postData);
            if (
              Resp.data &&
              Resp.data.toast &&
              Resp.data.toast.type == "success"
            ) {
              toast.success("Successfully transfered", toasterOption);
              window.$(".transfer_sale_modal").modal("hide");
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
      Set_FormSubmitLoading("error");
      toast.error(
        "Owner Address and Entered Address are same, Please Check ",
        toasterOption
      );
    }
  }
  useImperativeHandle(ref, () => ({
    async Transfer_Click(item, BuyOwnerDetail = {}) {
      var curAddr = await getCurAddr();
      var connectwallet = localStorage.getItem("nilwireMetamask");
      if (!connectwallet) {
        toast.error("Please connect to a Metamask wallet", toasterOption);
        return false;
      }
      Set_NoOfToken(1);
      Set_item(item);
      setPurchaseCurrency(BuyOwnerDetail.currency);
      Set_mydetail(BuyOwnerDetail);
      window.$("#transfer_sale_modal").modal("show");
    },
  }));

  const CloseBtn = () => {
    Set_NoOfToken("");
    Set_Toaddress("");
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
        class="modal fade primary_modal"
        id="transfer_sale_modal"
        tabindex="-1"
        role="dialog"
        data-backdrop="static"
        aria-labelledby="transfer_sale_modalCenteredLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" id="hide">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="transfer_sale_modalLabel_1">
                Transfer NFT
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={CloseBtn}>
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <p className="text-center place_bit_desc text-light mb-0">
                You are about to Transfer Nft
              </p>
              <p className="place_bit_desc_2 text-center">
                <span className="text-muted">from</span>{" "}
                <span className="text-light ml-2">
                  {halfAddrShow(localStorage.getItem("nilwireMetamask"))}
                </span>
              </p>
              <p className="place_bit_desc_2 text-center">
                {item &&
                item.tokenowners_current &&
                item.tokenowners_current.balance
                  ? "Available : " + item.tokenowners_current.balance
                  : "Available : 0"}
              </p>
              <div className="update_cover_div_2" id="update_cover_div_2">
                <form className="form-border">
                  <div className="form-group formSkew">
                    <div className="input-group">
                      <input
                        type="text"
                        name="toaddress"
                        id="toaddress"
                        onChange={inputChange}
                        // value={toaddress}
                        placeholder="To Addresss"
                        className="form-control"
                      />
                    </div>
                    {ValidateError.toaddress && (
                      <span className="text-danger">
                        {ValidateError.toaddress}
                      </span>
                    )}
                  </div>
                  <div className="form-group formSkew">
                    {mydetail.type != 721 && (
                      <div className="input-group">
                        <input
                          type="number"
                          name="NoOfToken"
                          id="NoOfToken"
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-", ",", "."].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          onChange={inputChange}
                          placeholder="Enter the item quantity"
                          value={NoOfToken}
                          className="form-control"
                        />
                      </div>
                    )}
                    {ValidateError.NoOfToken && (
                      <span className="text-danger">
                        {ValidateError.NoOfToken}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      className="create_btn me-3"
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
                      Transfer
                    </button>
                    <button
                      className="btn-main btnGrey lead"
                      data-dismiss="modal"
                      type="button"
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
    </div>
  );
});
