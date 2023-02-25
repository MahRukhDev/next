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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

import {
  AddLikeAction,
  GetLikeDataAction,
  TokenPriceChange_update_Action,
  MinMaxChange_update_Action,
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

export const PutOnBid = forwardRef((props, ref) => {
  var myDate = new Date();
  var newdat = myDate.setDate(myDate.getDate() + parseInt(1));
  var initialEnd = new Date(newdat);
  const [BuyerName, Set_BuyerName] = useState("");
  const [blns, Set_blns] = useState("");
  const [dethBln, Set_dethBln] = useState("");
  const [bidProfile1, Set_bidProfile1] = useState([]);
  const [FormSubmitLoading, Set_FormSubmitLoading] = useState("");
  const [ValidateError, Set_ValidateError] = useState({});
  const [YouWillGet, Set_YouWillGet] = useState(0);
  const [MinPrice, Set_MinPrice] = useState(0);
  const [MaxPrice, Set_MaxPrice] = useState(0);
  const [TokenPrice_Initial, Set_TokenPrice_Initial] = useState(0);
  const [biddingtoken, set_biddingtoken] = useState(config.currencySymbol);
  const [servicefee, setservicefee] = useState(0);
  const [PurchaseCurrency, setPurchaseCurrency] = useState(
    config.currencySymbol
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [StartDate, Set_StartDate] = useState("Right after listing");
  const [EndDate, Set_EndDate] = useState("1 Day");
  const [Clocktime, set_Clocktime] = useState(new Date());
  const [EndClocktime, set_EndClocktime] = useState(initialEnd);
  const [TokenBalance, Set_TokenBalance] = useState(0);

const closeBtn = async() => {
  document.getElementById('MinPrice').value = "";
  document.getElementById('MaxPrice').value = "";
}
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
      console.log(value,'valuevalue');
      console.log(e.target.name,'nameee');
      switch (e.target.name) {
   
        case "MinPrice":
          Set_MinPrice(value);
          ItemValidation({ MinPrice: value });
          break;
        case "MaxPrice":
          Set_MaxPrice(value);
          ItemValidation({ MaxPrice: value });
          break;
        default:
        // code block
      }
    }
  };
  const SelectBidcurrency = (e) => {
    var filter = e.target.value;
    set_biddingtoken(filter);
    // getTokenval(filter)
  };

  //   async function getTokenval(filter){
  //     var web3              = new Web3(window.ethereum);
  //     if(filter==config.currencySymbol){
  //         if(item.type==721){
  //             var BEP721Contract = new web3.eth.Contract(BEP721, item.contractAddress);
  //             var fee = await BEP721Contract.methods.getServiceFee().call();
  //             var feeValue = fee/config.decimalvalues;
  //             setservicefee(feeValue)
  //             var weii=TokenPrice*config.decimalvalues;
  //             var per = (weii * fee) / 1e20;
  //           Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );
  //         }else{
  //             var BEP1155Contract = new web3.eth.Contract(BEP1155, item.contractAddress);
  //             var fee = await BEP1155Contract.methods.getServiceFee().call();
  //             var feeValue = fee/config.decimalvalues;
  //             setservicefee(feeValue);
  //             var weii=TokenPrice*config.decimalvalues;
  //             var per = (weii * fee) / 1e20;
  //           Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );

  //         }
  //     }else if(filter==config.tokenSymbol){
  //       if(item.type==721){
  //           var BEP721Contract = new web3.eth.Contract(BEP721, item.contractAddress);
  //           var fee = await BEP721Contract.methods.getServiceFee().call();
  //           var feeValue = fee/config.decimalvalues;
  //           setservicefee(feeValue)
  //           var weii=TokenPrice*config.decimalvalues;
  //           var per = (weii * fee) / 1e20;
  //         Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );
  //       }else{
  //           var BEP1155Contract = new web3.eth.Contract(BEP1155, item.contractAddress);
  //           var fee = await BEP1155Contract.methods.getServiceFee().call();
  //           var feeValue = fee/config.decimalvalues;
  //           setservicefee(feeValue);
  //           var weii=TokenPrice*config.decimalvalues;
  //           var per = (weii * fee) / 1e20;
  //         Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );

  //       }
  //     }else{
  //         if(item.type==721){
  //             var BEP721Contract = new web3.eth.Contract(BEP721, item.contractAddress);
  //             var fee = await BEP721Contract.methods.getServiceFee().call();

  //               var weii=TokenPrice*config.decimalvalues;
  //               var feeValue = fee/config.decimalvalues;
  //               setservicefee(feeValue)
  //               var per = (weii * fee) / 1e20;
  //           Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );

  //         }else{
  //             var BEP1155Contract = new web3.eth.Contract(BEP1155, item.contractAddress);
  //             var fee = await BEP1155Contract.methods.getServiceFee().call();
  //               var weii=TokenPrice*config.decimalvalues;
  //               var feeValue = fee/config.decimalvalues;
  //               setservicefee(feeValue)
  //               var per = (weii * fee) / 1e20;
  //             Set_YouWillGet( parseFloat((weii - per) / config.decimalvalues).toFixed(config.toFixed) );

  //         }
  //         var VbitdxContract   = new web3.eth.Contract(VALOBITDX, config.ValobitdxAddr);
  //         var currAddr         = window.web3.eth.defaultAccount;
  //         var decimal          = await VbitdxContract.methods.decimals().call();
  //         var tokenBal         = await VbitdxContract.methods.balanceOf(currAddr).call();
  //         var tokenBalance      = tokenBal / config.decimalvalues;
  //         Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
  //     }
  //   }

  const ItemValidation = async (data = {}) => {
    var ValidateError = {};

    var Chk_TokenPrice =
      typeof data.MinPrice != "undefined"
        ? data.MinPrice
        : typeof data.MaxPrice != "undefined"
        ? data.MaxPrice
        : MinPrice;

    var Chk_MaxPrice =
      typeof data.MinPrice != "undefined"
        ? data.MinPrice
        : typeof data.MaxPrice != "undefined"
        ? data.MaxPrice
        : MaxPrice;

    if (Chk_TokenPrice == "" || Chk_MaxPrice == "") {
      ValidateError.TokenPrice = '"Price" is not allowed to be empty';
    } else if (Chk_TokenPrice == 0 || Chk_MaxPrice == 0) {
      ValidateError.TokenPrice = '"Price" must be greater than 0';
    } else if (isNaN(Chk_TokenPrice) == true || isNaN(Chk_MaxPrice) == true) {
      console.loh("in1");
      ValidateError.TokenPrice = '"Price" must be a number';
    } else if (Math.sign(Chk_TokenPrice) < 0 || Math.sign(Chk_MaxPrice) < 0) {
      ValidateError.TokenPrice = "Price must be a possitive number";
    } else if (
      typeof data.MaxPrice != "undefined" &&
      parseFloat(MinPrice) > parseFloat(Chk_TokenPrice)
    ) {
      ValidateError.MinPrice =
        "Maximum Price must be Greater than Minimum Price";
    } else if (
      typeof data.MinPrice != "undefined" &&
      parseFloat(Chk_TokenPrice) > parseFloat(MaxPrice)
    ) {
      ValidateError.MinPrice =
        "Maximum Price must be Greater than Minimum Price";
    } else if (
      typeof data.MinPrice == "undefined" &&
      typeof data.MaxPrice == "undefined" &&
      (parseFloat(MinPrice) == undefined ||
        parseFloat(MinPrice) == null ||
        parseFloat(MinPrice) == "")
    ) {
      ValidateError.MinPrice = '"Price" must be a number';
    } else if (
      typeof data.MinPrice == "undefined" &&
      typeof data.MaxPrice == "undefined" &&
      (parseFloat(MaxPrice) == undefined ||
        parseFloat(MaxPrice) == null ||
        parseFloat(MaxPrice) == "")
    ) {
      ValidateError.TokenPrice = '"Price" must be a number';
    } else if (
      typeof data.MinPrice == "undefined" &&
      typeof data.MaxPrice == "undefined" &&
      typeof MinPrice != "undefined" &&
      typeof MaxPrice != "undefined" &&
      parseFloat(MinPrice) > parseFloat(MaxPrice)
    ) {
      ValidateError.MinPrice =
        "Maximum Price must be Greater than Minimum Price";
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
    // alert()
    // document.getElementById('MinPrice').value = "";
    // document.getElementById('MaxPrice').value = "";
    var errors = await ItemValidation();
    console.log(errors,'error');
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      window.$("#PutOnBid_modal").modal("show");
      toast.error(
        "Form validation error, please fill all the required fields",
        toasterOption
      );
      return false;
    }
    var currDate = new Date();
    var sDate = new Date(Clocktime);
    if (StartDate == "Right after listing") {
      set_Clocktime(currDate);
      sDate = currDate;
    }
    var startDate = new Date(Clocktime);
    var eDate = new Date(EndClocktime);
    startDate.setSeconds(0);
    eDate.setSeconds(0);
    if (new Date(currDate) > new Date(sDate)) {
      toast.error("Start date & Time must be greater than now", toasterOption);
    } else if (Date.parse(startDate) >= Date.parse(eDate)) {
      toast.error(
        '"End date" & Time must be greater than start date and Time',
        toasterOption
      );
    } else if (item.type == 721) {
      Set_FormSubmitLoading("processing");
      var postData = {
        address: props.Accounts,
        tokenCounts: props.item.tokenCounts,
        minprice: MinPrice,
        maxprice: MaxPrice,
        starttime: Clocktime,
        endtime: EndClocktime,
      };
      var Resp = await MinMaxChange_update_Action(postData);
      console.log(Resp,'Ejmbbbbbuwek');
      if (Resp.data && Resp.data.RetType && Resp.data.RetType == "success") {
        toast.success(" NFT places for sale on marketplace", toasterOption);
        window.$("#PutOnBid_modal").modal("hide");
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      }
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
    async PutOnBid_Click(item, ownerdetail) {
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
        window.$("#PutOnBid_modal").modal("show");
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
        window.$("#PutOnBid_modal").modal("show");
      }
      Set_TokenPrice_Initial(ownerdetail.price);
      Set_ValidateError({});
      window.$("#PutOnBid_modal").modal("show");
    },
  }));

  async function DateChange(from, val) {
    if (from == "StartDateDropDown") {
      if (val == "PickStartDate") {
        ModalAction("calendar_modal", "show");
      } else {
        Set_StartDate("Right after listing");
      }
    } else if (from == "EndDateDropDown") {
      if (val == "PickEndDate") {
        ModalAction("calendar_modal_expire", "show");
      } else {
        Set_EndDate(val);
        var myDate = new Date();
        var newdat = myDate.setDate(myDate.getDate() + parseInt(val));
        var newdate = new Date(newdat);
        set_EndClocktime(newdate);
      }
    }
  }

  async function ModalAction(id, type) {
    window.$("#" + id).modal(type);
    if (id == "calendar_modal") {
      if (Clocktime) {
        var dt = new Date(Clocktime);
        dt.setSeconds(0);
        var dt1 = dt.toLocaleString();
        Set_StartDate(dt1);
      }
    } else if (id == "calendar_modal_expire") {
      if (EndClocktime) {
        var dt = new Date(EndClocktime);
        dt.setSeconds(0);
        var dt1 = dt.toLocaleString();
        Set_EndDate(dt1);
      }
    }
  }

  return (
    <div>
      <div
        className="modal fade primary_modal"
        id="PutOnBid_modal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="accept_modalCenteredLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content form-border">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="PutOnBid_modalLabel">
                NFT for Sale
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeBtn}>&times;</span>
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
                  item.image.split(".").pop() == "mp3" || item &&
                  item.image &&
                  item.image.split(".").pop() == "wav" ? (
                  <>
                    <img
                      src={`${config.Back_URL}images/music.png`}
                      alt=""
                      className="img-fluid img-rounded mb-sm-30"
                    />
                    {/* <audio
                      src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                      type="audio/mp3"
                      controls
                      className="img-fluid img-rounded mb-sm-30"
                    ></audio> */}
                     {(item &&
                      item.image && item.image.split('.').pop() == 'mp3') 
                      || (item &&
                        item.image && item.image.split(".").pop() == "wav")
                       ?
                    <audio src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}  type="audio/mp3"controls className="audio audio_widyth">
                    </audio>:""
                   }
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
                  You are about to place Bid for
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
                  placeholder="Enter Minimum bid amount"
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-", ","].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  min="0"
                  name="MinPrice"
                  id="MinPrice"
                  class="form-control mb-0"
                  aria-label="bid"
                  aria-describedby="basic-addon2"
                  // value={MinPrice}
                  onChange={inputChange}
                  autoComplete="off"
                />
              </div>
              {ValidateError.MinPrice && (
                <span className="text-danger">{ValidateError.MinPrice}</span>
              )}
              <div class="input-group mb-3 input_grp_style_1">
                <input
                  placeholder="Enter Maximum bid amount"
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-", ","].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  min="0"
                  name="MaxPrice"
                  id="MaxPrice"
                  class="form-control mb-0"
                  aria-label="bid"
                  aria-describedby="basic-addon2"
                  // value={MaxPrice}
                  onChange={inputChange}
                  autoComplete="off"
                />
              </div>
              {ValidateError.TokenPrice && (
                <span className="text-danger">{ValidateError.TokenPrice}</span>
              )}
              <div class="row">
                <div class="col-md-6">
                  <div className="drobdown_section">
                    <label className="primary_label">Starting date</label>
                    <div class="dropdown">
                      <button
                        class="btn btn-secondary dropdown-toggle filter_btn inp_btn m-0 text-left w-100"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span id="menuBut">{StartDate}</span>
                      </button>
                      <div
                        class="dropdown-menu filter_menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <div
                          id="RightAfterListing"
                          onClick={() => {
                            DateChange(
                              "StartDateDropDown",
                              "RightAfterListing"
                            );
                          }}
                        >
                          Right after listing
                        </div>
                        <div
                          id="PickStart"
                          onClick={() => {
                            DateChange("StartDateDropDown", "PickStartDate");
                          }}
                        >
                          Pick specific date
                        </div>
                      </div>
                      {ValidateError.StartDate && (
                        <span className="text-danger">
                          {ValidateError.StartDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* <input type="date" name="bid_starting_date" id="bid_starting_date" class="form-control" onChange={(date:Date) => setStartDate(date)} min="1997-01-01" /> */}
                </div>

                <div class="col-md-6">
                  <div className="drobdown_section">
                    <label className="primary_label">Expiration date</label>
                    <div class="dropdown">
                      <button
                        class="btn btn-secondary dropdown-toggle filter_btn inp_btn m-0 text-left w-100"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span id="menuBut">{EndDate}</span>
                      </button>
                      <div
                        class="dropdown-menu filter_menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <div
                          onClick={() => {
                            DateChange("EndDateDropDown", "1 Day");
                          }}
                        >
                          1 Day
                        </div>
                        <div
                          onClick={() => {
                            DateChange("EndDateDropDown", "3 Day");
                          }}
                        >
                          3 Day
                        </div>
                        <div
                          onClick={() => {
                            DateChange("EndDateDropDown", "5 Day");
                          }}
                        >
                          5 Day
                        </div>
                        <div
                          onClick={() => {
                            DateChange("EndDateDropDown", "7 Day");
                          }}
                        >
                          7 Day
                        </div>
                        <div
                          onClick={() => {
                            DateChange("EndDateDropDown", "PickEndDate");
                          }}
                        >
                          Pick specific date
                        </div>
                      </div>
                      {ValidateError.EndDate && (
                        <span className="text-danger">
                          {ValidateError.EndDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* <input type="date" name="bid_expiration_date" id="bid_expiration_date" class="form-control" /> */}
                </div>

                <div class="spacer-single"></div>
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
                      onClick={closeBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* date model */}
        <div
          class="modal fade primary_modal"
          id="calendar_modal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="calendar_modalCenteredLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-sm"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-module">
                <div class="modal-header text-center">
                  <h5 class="modal-title" id="calendar_modalLabel">
                    Choose date
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    id="cancelcalender"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="pb-3">
                    <Datetime
                      minDate={new Date().getTime()}
                      input={false}
                      value={Clocktime}
                      onChange={(value) => set_Clocktime(value)}
                    />
                  </div>
                </div>
                <div class="text-center mb-3">
                  <input
                    type="submit"
                    name="Done"
                    value="Done"
                    className="primary_btn"
                    id="doneStartDate"
                    onClick={() => ModalAction("calendar_modal", "hide")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade primary_modal"
          id="calendar_modal_expire"
          tabindex="-1"
          role="dialog"
          aria-labelledby="calendar_modalCenteredLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-sm"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-module">
                <div class="modal-header text-center">
                  <h5 class="modal-title" id="calendar_modalLabel">
                    Choose date
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    id="cancelcalender"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="pb-3">
                    <Datetime
                      input={false}
                      value={EndClocktime}
                      minDate={new Date().getTime()}
                      onChange={(value) => set_EndClocktime(value)}
                    />
                  </div>
                </div>
                <div class="text-center mb-3">
                  <input
                    type="submit"
                    name="Done"
                    value="Done"
                    className="primary_btn"
                    id="doneEndDate"
                    onClick={() => ModalAction("calendar_modal_expire", "hide")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
