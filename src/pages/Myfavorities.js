import React, { useRef, useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Countdown, { zeroPad } from "react-countdown";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import moment from "moment";
import { LikeRef } from "./separate/LikeRef";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import TokenItem from "./separate/TokenItem";
import { TransferRef } from "./separate/TransferRef";
import { BurnRef } from "./separate/BurnRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ConnectWallet from "./separate/Connect-Wallet";
import config from "../lib/config";
import Single_ABI from "../ABI/BEP721.json";
import Multiple_ABI from "../ABI/BEP1155.json";
import { PutOnBid } from "./separate/PutOnBid";
import ESC_ABI from "../ABI/ESC.json";
import { toast } from "react-toastify";
import { getmylog } from "../helper/walletconnect";
import { Helmet } from "react-helmet";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

import {
  CollectiblesList_Favorities,
  TokenCounts_Get_Detail_Action,
  getHotCollections,
  getbannercollection,
  getreportcategory,
  ReportRequest,
} from "../actions/v1/token";
import { getCurAddr } from "../actions/v1/user";
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
toast.configure();
let toasterOption = config.toasterOption;

export default function Myfavorities() {
  const [CatBasedTokenList, setCatBasedTokenList] = useState({});
  const [TokenList, setTokenList] = useState([]);
  const [CatName, setCatName] = useState("All");
  const [LikedTokenList, setLikedTokenList] = React.useState([]);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState("");
  const [WalletConnected, Set_WalletConnected] = React.useState("false");
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState("");
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState("");
  const [item, Set_item] = useState({});
  const [Bids, Set_Bids] = useState([]);
  const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
  const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});
  const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
  const [MyTokenDetail, Set_MyTokenDetail] = useState({});
  const [AllowedQuantity, Set_AllowedQuantity] = useState(0);
  const [YouWillPay, Set_YouWillPay] = useState(0);
  const [YouWillPayFee, Set_YouWillPayFee] = useState(0);
  const [YouWillGet, Set_YouWillGet] = useState(0);
  const [tokenCounts, Set_tokenCounts] = useState(0);
  const [AccepBidSelect, Set_AccepBidSelect] = useState(0);
  const [tokenBidAmt, Set_tokenBidAmt] = useState(0);
  const [NoOfToken, Set_NoOfToken] = useState(0);
  const [ValidateError, Set_ValidateError] = useState({});
  const [TokenBalance, Set_TokenBalance] = useState(0);
  const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] =
    React.useState("init");
  const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] =
    React.useState("init");
  const [totaluserbidAmt, setTotaluserbidAmt] = React.useState(0);
  const [HitItem, Set_HitItem] = useState({});
  const [collections, set_collections] = React.useState("");
  const [bannerlist, setbannerlist] = React.useState([]);
  const [CategoryOption, setCategoryOption] = useState(0);
  const [reportCategoryname, setReportCategoryname] = useState("Select");
  const [description, setdescription] = React.useState("");
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [selectown, set_selectown] = React.useState("");

  const PutOnBidForwardRef = useRef();

  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var TransferForwardRef = useRef();
  var ReportForwardRef = useRef();

  useEffect(() => {
    loadScript();
    getInit();
  }, []);

  function loadScript() {
    dropdown("#report-reason");
    dropdown("#item_category");
    dropdown("#buy_category");
    dropdown("#items_type");
    function dropdown(e) {
      var obj = $(e + ".dropdown");
      var btn = obj.find(".btn-selector");
      var dd = obj.find("ul");
      var opt = dd.find("li");

      obj
        .on("click", function () {
          dd.show();
        })
        .on("mouseleave", function () {
          dd.hide();
        });

      opt.on("click", function () {
        dd.hide();
        var txt = $(this).text();
        opt.removeClass("active");
        $(this).addClass("active");
        btn.text(txt);
      });
    }
  }

  async function getInit() {
    TokenListCall();
    ReportdetList();
  }
  async function AfterWalletConnected() {
    try {
      LikeForwardRef &&
        LikeForwardRef.current &&
        LikeForwardRef.current.getLikesData();
    } catch (err) {}
    var currAddr = await getCurAddr();
    if (
      currAddr &&
      currAddr != null &&
      currAddr != undefined &&
      currAddr != ""
    ) {
      Set_Loaderstatus(true);
    }
    try {
      var mydata = await getmylog();
      if (mydata && mydata != null && mydata != undefined && mydata != "") {
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
          curAddr &&
          curAddr != null &&
          curAddr != undefined &&
          curAddr != ""
        ) {
          Set_Loaderstatus(true);
        }
        //var web3 = new Web3(window.ethereum);
        var currAddr = curAddr && curAddr[0].toLowerCase();
        //if (window.ethereum) {
        // var web3 = new Web3(window.ethereum);
        var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
        var tokenBal = await ESCContract.methods.balanceOf(currAddr).call();
        var tokenBalance = tokenBal / config.decimalvalues;
        Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
        //}
      }
    } catch (err) {}
  }

  async function hidefunction() {
    window.$(".modal").modal("hide");
    PutOnSaleForwardRef.current.PutOnSale_Click(item, selectown);
  }

  async function bidpopupshow() {
    window.$(".modal").modal("hide");
    PutOnBidForwardRef.current.PutOnBid_Click(item, selectown);
  }

  async function popupshow() {
    window.$("#option_modal").modal("show");
  }

  async function showAllwithPro(data) {
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
    var payload = {
      curAddr: curAddr[0].toLowerCase(),
      tokenCounts: data.tokenCounts,
    };
    TokenCounts_Get_Detail_Call(payload);
  }
  const TokenCounts_Get_Detail_Call = async (payload) => {
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
    var Resp = await TokenCounts_Get_Detail_Action(payload);
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
          if (
            element.balance > 0 &&
            element.price > 0 &&
            element.tokenOwner != curAddr[0].toLowerCase()
          ) {
            Set_BuyOwnerDetailFirst(element);
            break;
          }
        }
      }
      Set_tokenCounts_Detail(TokenResp);
      if (TokenResp.Bids) {
        Set_Bids(TokenResp.Bids);
      }
      let ageSum = 0;
      var tokenowners_all = TokenResp.Token[0].tokenowners_all;
      if (tokenowners_all && tokenowners_all.length > 0) {
        for (let i = 0; i < tokenowners_all.length; i++) {
          if (tokenowners_all[i].balance > 0) {
            ageSum += tokenowners_all[i].balance;
          }
        }
      }
      var IndexVal = -1;
      if (TokenResp.Token[0].tokenowners_all && curAddr[0]) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(
          (val) => val.tokenOwner.toString() == curAddr[0].toLowerCase()
        );
      }
      var newMyTokenBalance = 0;
      if (IndexVal > -1) {
        newMyTokenBalance = tokenowners_all[IndexVal].balance;
        Set_MyTokenBalance(newMyTokenBalance);
        Set_MyTokenDetail(tokenowners_all[IndexVal]);
      } else {
        newMyTokenBalance = 0;
        Set_MyTokenBalance(0);
        Set_MyTokenDetail({});
      }
      if (ageSum) {
        Set_AllowedQuantity(ageSum - newMyTokenBalance);
      } else {
        Set_AllowedQuantity(0);
      }
      if (TokenResp.Token && TokenResp.Token[0]) {
        Set_item(TokenResp.Token[0]);
      }
    }
  };
  async function ReportdetList() {
    try {
      var resp = await getreportcategory();
      if (resp && resp.data) {
        var CategoryOption = [];
        resp.data.data.map((item) => {
          CategoryOption.push({
            value: item._id,
            label: item.name,
          });
        });
        setCategoryOption(CategoryOption);
      }
    } catch (err) {}
  }
  function changeCategory(name) {
    setReportCategoryname(name);
  }
  async function TokenListCall(data = {}) {
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
    var currAddr = curAddr && curAddr[0].toLowerCase();
    var name = CatName;
    if (data.CatName) {
      name = data.CatName;
    }
    var payload = {
      limit: 10000,
      page:
        CatBasedTokenList[name] && CatBasedTokenList[name].page
          ? CatBasedTokenList[name].page
          : 1,
      currAddr: currAddr,
      CatName: name,
      from: "Home",
    };
    CatBasedTokenList.loader = true;
    setCatBasedTokenList(CatBasedTokenList);
    var resp = await CollectiblesList_Favorities(payload);
    CatBasedTokenList.loader = false;
    setCatBasedTokenList(CatBasedTokenList);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      setTokenList(resp.data.list);
      if (typeof CatBasedTokenList[name] == "undefined") {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = resp.data.list;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    } else {
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
  }
  const inputChange = (e) => {
    if (e && e.target && typeof e.target.value != "undefined") {
      var value = e.target.value;
      setdescription(value);
      if (e.target.value != "") {
        Set_ValidateError({});
      }
    }
  };
  const ReportValidation = async (data = {}) => {
    var ValidateError = {};

    if (description == "" || typeof description == "undefined") {
      ValidateError.description = '"Description" is not allowed to be empty';
    }
    Set_ValidateError(ValidateError);
    return ValidateError;
  };
  async function submituserreport(item) {
    var errors = await ReportValidation();
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      toast.error(
        "Form validation error, please fill all the required fields",
        toasterOption
      );
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
    //var web3 = new Web3(window.ethereum);
    var currAddr = curAddr && curAddr[0].toLowerCase();
    var reqData = {
      reportuser: currAddr,
      description: description,
      reportcategory: reportCategoryname,
      type: "collectibles",
      tokenCounts: item.tokenCounts,
    };
    var response = await ReportRequest(reqData);
    if (response && response.status == "true") {
      toast.success("Successfully submit your report", toasterOption);
      setdescription("");
      setTimeout(function () {
        window.$("#report").modal("hide");
      }, 100);
      setTimeout(function () {
        window.location.reload(false);
      }, 400);
    } else {
      toast.error("Oops something went wrong.!", toasterOption);
    }
  }
  // Countdown Timer
  const currentDate = new Date();
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();

  //   const renderer = ({ days, hours, minutes, seconds }) => {
  //     return (
  //       <div className="timer_panel">
  //         <span><span className="timer_time">{zeroPad(days)}</span><span className="timer_label">d</span></span>
  //         <span className="timer_dots"> </span>
  //         <span><span className="timer_time">{zeroPad(hours)}</span><span className="timer_label">h</span></span>
  //         <span className="timer_dots"> </span>
  //         <span><span className="timer_time">{zeroPad(minutes)}</span><span className="timer_label">m</span></span>
  //         <span className="timer_dots"> </span>
  //         <span><span className="timer_time">{zeroPad(seconds)}</span><span className="timer_label">s</span></span>
  //       </div>
  //     );
  //   };
  const renderer = ({
    days,
    Month,
    Year,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return <span></span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s left
        </span>
      );
    }
  };
  const renderer1 = ({
    days,
    Month,
    Year,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return <span></span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s start
        </span>
      );
    }
  };
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Favorite NFT</title>
      </Helmet>
      <ScrollToTopOnMount />
      <Header />

      <ConnectWallet
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_UserAccountBal={Set_UserAccountBal}
        Set_WalletConnected={Set_WalletConnected}
        Set_AddressUserDetails={Set_AddressUserDetails}
        AddressUserDetails={AddressUserDetails}
        Set_Accounts={Set_Accounts}
        WalletConnected={WalletConnected}
        AfterWalletConnected={AfterWalletConnected}
      />
      <PutOnBid
        ref={PutOnBidForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        Accounts={Accounts}
        // GetUserBal={GetUserBal}
        Set_NoOfToken={Set_NoOfToken}
      />
      <CancelOrderRef
        ref={CancelOrderForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        Accounts={Accounts}
        // GetUserBal={GetUserBal}
      />
      <BurnRef
        ref={BurnForwardRef}
        // GetUserBal={GetUserBal}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        TokenBalance={TokenBalance}
        Accounts={Accounts}
        item={HitItem}
        // item={item}
        Set_item={Set_item}
      />
      <LikeRef
        ref={LikeForwardRef}
        setLikedTokenList={setLikedTokenList}
        MyItemAccountAddr={MyItemAccountAddr}
      />
      <ShareNowRef ref={ShareForwardRef} />
      <ReportNowRef UserAccountAddr={UserAccountAddr} ref={ReportForwardRef} />
      <PurchaseNowRef
        ref={PurchaseNowForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        Accounts={Accounts}
        // GetUserBal={GetUserBal}
        AllowedQuantity={AllowedQuantity}
        Set_AllowedQuantity={Set_AllowedQuantity}
      />
      <PutOnSaleRef
        ref={PutOnSaleForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        Accounts={Accounts}
        // GetUserBal={GetUserBal}
        Set_NoOfToken={Set_NoOfToken}
      />
      <TransferRef item={HitItem} ref={TransferForwardRef} />
      <PlaceAndAcceptBidRef
        ref={PlaceABidForwardRef}
        Set_WalletConnected={Set_WalletConnected}
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_UserAccountBal={Set_UserAccountBal}
        Set_AddressUserDetails={Set_AddressUserDetails}
        Set_Accounts={Set_Accounts}
        Set_MyItemAccountAddr={Set_MyItemAccountAddr}
        Set_tokenCounts={Set_tokenCounts}
        Set_item={Set_item}
        Set_tokenCounts_Detail={Set_tokenCounts_Detail}
        Set_MyTokenBalance={Set_MyTokenBalance}
        Set_Bids={Set_Bids}
        Set_AccepBidSelect={Set_AccepBidSelect}
        Set_tokenBidAmt={Set_tokenBidAmt}
        Set_NoOfToken={Set_NoOfToken}
        Set_ValidateError={Set_ValidateError}
        Set_TokenBalance={Set_TokenBalance}
        Set_YouWillPay={Set_YouWillPay}
        Set_YouWillPayFee={Set_YouWillPayFee}
        Set_YouWillGet={Set_YouWillGet}
        Set_BidApply_ApproveCallStatus={Set_BidApply_ApproveCallStatus}
        Set_BidApply_SignCallStatus={Set_BidApply_SignCallStatus}
        WalletConnected={WalletConnected}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        AddressUserDetails={AddressUserDetails}
        Accounts={Accounts}
        MyItemAccountAddr={MyItemAccountAddr}
        tokenCounts={tokenCounts}
        item={item}
        tokenCounts_Detail={tokenCounts_Detail}
        MyTokenBalance={MyTokenBalance}
        Bids={Bids}
        AccepBidSelect={AccepBidSelect}
        tokenBidAmt={tokenBidAmt}
        NoOfToken={NoOfToken}
        ValidateError={ValidateError}
        TokenBalance={TokenBalance}
        YouWillPay={YouWillPay}
        YouWillPayFee={YouWillPayFee}
        YouWillGet={YouWillGet}
        BidApply_ApproveCallStatus={BidApply_ApproveCallStatus}
        BidApply_SignCallStatus={BidApply_SignCallStatus}
        AllowedQuantity={AllowedQuantity}
        totaluserbidAmt={totaluserbidAmt}
        setTotaluserbidAmt={setTotaluserbidAmt}
      />
      {localStorage.getItem("nilwireMetamask") ? (
        <div className="no-bottom no-top" id="content">
          <section id="subheader" class="text-light">
            <div class="center-y relative text-center">
              <div class="container">
                <div class="row">
                  <div class="col-md-12 text-center">
                    <h1>My favorite NFTs</h1>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section" className="pt30 pb30">
            <div class="container">
              <div class="row wow fadeIn">
                {CatBasedTokenList &&
                CatName &&
                CatBasedTokenList[CatName] &&
                CatBasedTokenList[CatName].list &&
                CatBasedTokenList[CatName].list.length > 0 ? (
                  CatBasedTokenList[CatName].list.map((item) => {
                    console.log(item, "==================fromfav");
                    var currDate = new Date();
                    var startdate = new Date(item.clocktime);
                    var enddate = new Date(item.endclocktime);
                    var auction = "false";
                    var finish = "";
                    var enddate1 = "";
                    var showlist = "true";
                    var display_item = 0;
                    var mytr = "";
                    if (
                      item &&
                      item.favinfo &&
                      item.favinfo.length > 0 &&
                      UserAccountAddr &&
                      UserAccountAddr != null &&
                      UserAccountAddr != undefined &&
                      UserAccountAddr != ""
                    ) {
                      mytr = item.favinfo.filter(
                        (x) => x.useraddress == UserAccountAddr
                      );
                    }
                    if (
                      item.type == 721 &&
                      item.PutOnSaleType == "TimedAuction"
                    ) {
                      auction = "true";
                      var a = moment(item.clocktime);
                      var b = moment(item.endclocktime);
                      var c = moment();
                      a.diff(b); // 86400000
                      var diffInMs = a.diff(c);
                      display_item = a.diff(c);
                      finish = b.diff(c);
                      enddate1 = parseFloat(diffInMs);
                      if (finish > 0) {
                        showlist = "true";
                      } else {
                        var auctionTxt = "Ended";
                        showlist = "false";
                      }
                    }
                    console.log(mytr, "=======mytrmytrmytr");
                    if (mytr && mytr.length > 0) {
                      return (
                        <TokenItem
                          id={item._id}
                          item={item}
                          Set_item={Set_item}
                          set_selectown={set_selectown}
                          popupshow={popupshow}
                          LikedTokenList={LikedTokenList}
                          hitLike={LikeForwardRef.current.hitLike}
                          UserAccountAddr={UserAccountAddr}
                          UserAccountBal={UserAccountBal}
                          PutOnSale_Click={
                            PutOnSaleForwardRef.current.PutOnSale_Click
                          }
                          PurchaseNow_Click={
                            PurchaseNowForwardRef.current.PurchaseNow_Click
                          }
                          PlaceABid_Click={
                            PlaceABidForwardRef.current.PlaceABid_Click
                          }
                          Set_Bids={Set_Bids}
                          Bids={Bids}
                          Set_BuyOwnerDetailFirst={Set_BuyOwnerDetailFirst}
                          Set_tokenCounts_Detail={Set_tokenCounts_Detail}
                          Set_MyTokenBalance={Set_MyTokenBalance}
                          Set_MyTokenDetail={Set_MyTokenDetail}
                          Set_TokenBalance={Set_TokenBalance}
                          Set_AllowedQuantity={Set_AllowedQuantity}
                          Set_YouWillPay={Set_YouWillPay}
                          Set_YouWillPayFee={Set_YouWillPayFee}
                          Set_YouWillGet={Set_YouWillGet}
                          Burn_Click={BurnForwardRef.current.Burn_Click}
                          Transfer_Click={
                            TransferForwardRef.current.Transfer_Click
                          }
                          CancelOrder_Click={
                            CancelOrderForwardRef.current.CancelOrder_Click
                          }
                          WalletConnected={WalletConnected}
                          SubmitReport_Click={
                            ReportForwardRef.current.SubmitReport_Click
                          }
                          ShareSocial_Click={
                            ShareForwardRef.current.ShareSocial_Click
                          }
                          aucttype="no"
                          from={0}
                        />
                      );
                    }
                  })
                ) : (
                  <p className="mt-5">No record found</p>
                )}

                {/* {CatBasedTokenList &&
              CatBasedTokenList.loader == false &&
              CatBasedTokenList[CatName] &&
              CatBasedTokenList[CatName].onmore == true &&
              CatBasedTokenList[CatName].list.length >= config.limit ? (
                <>
                  <div class="col-md-12 text-center">
                    <a
                      href="#"
                      id="loadmore"
                      class="btn-main wow fadeInUp lead"
                    >
                      Load more
                    </a>
                  </div>
                </>
              ) : (
                ""
              )} */}
              </div>
            </div>
          </section>
          <Footer />
          {/* report model*/}
          <div class="modal report primary_modal" id="report">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Report Item</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <div class="modal-body">
                  <form className="form-border">
                    <h5>Tell us more</h5>
                    <div id="report-reason" class="dropdown w-100">
                      <a
                        href="javascript:void(0)"
                        class="btn-selector w-100 d-block selectPlaceHolder"
                      >
                        {reportCategoryname}
                      </a>
                      <ul className="w-100" value={reportCategoryname}>
                        {CategoryOption &&
                          CategoryOption.length > 0 &&
                          CategoryOption.map((option, i) => {
                            return (
                              <li
                                value={option.label}
                                onClick={() => changeCategory(option.label)}
                              >
                                <span>{option.label}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <textarea
                      className="form-control primary_inp"
                      onChange={inputChange}
                      id="description"
                      rows="3"
                      name="description"
                      placeholder="Give us more details"
                    ></textarea>
                    {ValidateError.description && (
                      <span className="text-danger">
                        {ValidateError.description}
                      </span>
                    )}
                  </form>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => submituserreport(item)}
                    data-dismiss="modal"
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade primary_modal"
            data-backdrop="static"
            id="option_modal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="option_modalCenteredLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header text-center">
                  <h5 className="modal-title" id="option_modalLabel">
                    Choose
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
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn-main lead mar-top-10 mb-0"
                        onClick={() => hidefunction()}
                      >
                        Put On Sale
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn-main lead mar-top-10 mb-0"
                        onClick={() => bidpopupshow()}
                      >
                        Put On Bid
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader_section_">
          {/* <ReactLoading
            type={"spinningBubbles"}
            color="#1c5c90"
            className="loading"
          /> */}
          <h2>
            Please Connect Wallet To Proceed Further <br />{" "}
            {!localStorage.getItem("nilwireMetamask") && (
              <Link to="/connect-wallet" className="btn-main">
                <i
                  style={{ marginRight: "10px" }}
                  className="icon_wallet_alt"
                ></i>
                <span>Connect wallet</span>
              </Link>
            )}
          </h2>
        </div>
      )}
    </div>
  );
}
