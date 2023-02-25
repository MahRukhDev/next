import React, { useRef, useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Countdown, { zeroPad } from "react-countdown";
import $ from "jquery";
import TokenItem from "./separate/TokenItem";
import { LikeRef } from "./separate/LikeRef";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { TransferRef } from "./separate/TransferRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import { BurnRef } from "./separate/BurnRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import ConnectWallet from "./separate/Connect-Wallet";
import config from "../lib/config";
import Single_ABI from "../ABI/BEP721.json";
import Multiple_ABI from "../ABI/BEP1155.json";
import Searchref from "./separate/Search";
import { Helmet } from "react-helmet";
import { PutOnBid } from "./separate/PutOnBid";
import { toast } from "react-toastify";
import { getmylog } from "../helper/walletconnect";
import Web3 from "web3";



import {
  CollectiblesList_Home,
  TokenCounts_Get_Detail_Action,
  getHotCollections,
  getreportcategory,
  getbannercollection,
  ReportRequest
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

export default function Exclusive() {
  const [CatBasedTokenList, setCatBasedTokenList] = useState({
    loader: false,
    All: { page: 1, list: [], onmore: true },
  });
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
  var searchtxt = getParameterByName("search");
  var categorytxt = getParameterByName("category");
  const [namesearch, setnamesearch] = useState("");
  const [categorysearch, setcategorysearch] = useState("all");
  const [typesearch, settypesearch] = useState("all");
  const [startprice, setstartprice] = useState(0);
  const [endprice, setendprice] = useState(0);
  const [keysearch, setkeysearch] = useState("buy");
  const [categoryid, setcategoryid] = useState("All");
  const [showloadmore, setshowloadmore] = useState(false);
  const [page, setpage] = useState(1);
  const [showsearchloadmore, setshowsearchloadmore] = useState(false);
  const [selectown,set_selectown] = React.useState("");
  const [loader, setLoader] = React.useState(false);


  const [reportCategoryname, setReportCategoryname] = useState("Select");
  const [CategoryOption, setCategoryOption] = useState(0);
  const [description, setdescription] = React.useState("");


  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PutOnBidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var ReportForwardRef = useRef();
  var TransferForwardRef = useRef();

  useEffect(() => {
    getInit();
    loadScript();
  }, []);

  async function getInit() {
    ReportdetList();
    console.log(searchtxt,categorytxt,"===========searchtxtv")
    if (
      searchtxt &&
      searchtxt != "" &&
      searchtxt != null &&
      searchtxt != undefined
    ) {
      setnamesearch(searchtxt);
      searchstart({ name: searchtxt });
    } else if (
      categorytxt &&
      categorytxt != "" &&
      categorytxt != null &&
      categorytxt != undefined
    ) {
      setcategoryid(categorytxt);
      searchstart({ cat: categorytxt });
    } else {
      TokenListCall();
    }
  }

  async function searchstart(data = {}) {
    var currAddr = await getCurAddr();
    var name = categorysearch;
    var payload = {
      limit: 20,
      page: page,
      currAddr: currAddr,
      CatName:
        data &&
        data.cat &&
        data.cat != null &&
        data.cat != undefined &&
        data.cat != ""
          ? data.cat
          : categoryid,
      namesearch:
        data &&
        data.name &&
        data.name != null &&
        data.name != undefined &&
        data.name != ""
          ? data.name
          : namesearch,
      typesearch: typesearch,
      startprice: startprice,
      endprice: endprice,
      keysearch: keysearch,
      aucttype: "no",
      from: "Home",
    };
    var resp = await CollectiblesList_Home(payload);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      setTokenList(resp.data.list);
      if (resp.data.list.length >= 20) {
        setshowloadmore(false);
        setshowsearchloadmore(true);
      } else {
        setshowloadmore(false);
        setshowsearchloadmore(false);
      }
    } else {
      setTokenList(resp.data.list);
      if (resp.data.list.length >= 20) {
        setshowloadmore(false);
        setshowsearchloadmore(true);
      } else {
        setshowloadmore(false);
        setshowsearchloadmore(false);
      }
    }
  }

  async function hidefunction(){
    window.$('.modal').modal('hide');
    PutOnSaleForwardRef.current.PutOnSale_Click(
                      item,
                      selectown
                    )
  }

  async function bidpopupshow(){
    window.$('.modal').modal('hide');
    PutOnBidForwardRef.current.PutOnBid_Click(
                      item,
                      selectown
                    )
  }

  async function popupshow() {
    window.$("#option_modal").modal("show");
  }

  async function loadsearchmore(data = {}) {
    setpage(parseInt(page) + parseInt(1));
    var currAddr = await getCurAddr();
    var name = categorysearch;
    var payload = {
      limit: 20,
      page: parseInt(page) + parseInt(1),
      currAddr: currAddr,
      CatName:
        data &&
        data.cat &&
        data.cat != null &&
        data.cat != undefined &&
        data.cat != ""
          ? data.cat
          : categoryid,
      namesearch:
        data &&
        data.name &&
        data.name != null &&
        data.name != undefined &&
        data.name != ""
          ? data.name
          : namesearch,
      typesearch: typesearch,
      startprice: startprice,
      endprice: endprice,
      keysearch: keysearch,
      aucttype: "no",
      from: "Home",
    };
    var resp = await CollectiblesList_Home(payload);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      setTokenList(TokenList.concat(resp.data.list));
      if (resp.data.list.length >= 20) {
        setshowloadmore(false);
        setshowsearchloadmore(true);
      } else {
        setshowloadmore(false);
        setshowsearchloadmore(false);
      }
    } else {
      setTokenList(TokenList.concat(resp.data.list));
      if (resp.data.list.length >= 20) {
        setshowloadmore(false);
        setshowsearchloadmore(true);
      } else {
        setshowloadmore(false);
        setshowsearchloadmore(false);
      }
    }
  }

  async function AfterWalletConnected() {
    // GetCategoryCall();
    try {
      LikeForwardRef &&
        LikeForwardRef.current &&
        LikeForwardRef.current.getLikesData();
    } catch (err) {}
  }
//My

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
        console.log(CategoryOption,'CategoryOptionCategoryOption');
      }
    } catch (err) {}
  }
  function changeCategory(name) {
    setReportCategoryname(name);
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
      profileuser:item.tokenCreator,
      tokenName:item.tokenName
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

  //My

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function loadScript() {
    dropdown("#report-reason");
    dropdown("#buy_category");
    dropdown("#items_type");
    dropdown("#item_category");
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

  async function TokenListCall(data = {}) {
    var currAddr = await getCurAddr();
    var name = CatName;
    if (data.CatName) {
      name = data.CatName;
    }
    var payload = {
      limit: 20,
      page: page && parseInt(page) > 0 ? page : 0,
      currAddr: currAddr,
      CatName: name,
      from: "Home",
    };
    CatBasedTokenList.loader = true;
    setCatBasedTokenList(CatBasedTokenList);
    var resp = await CollectiblesList_Home(payload);
    CatBasedTokenList.loader = false;
    setCatBasedTokenList(CatBasedTokenList);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      if (resp.data.list.length == 20) {
        setshowloadmore(true);
      } else {
        setshowloadmore(false);
      }
      setTokenList(resp.data.list);
      if (typeof CatBasedTokenList[name] == "undefined") {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = resp.data.list;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    } else {
      setshowloadmore(false);
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
  }

  async function loadmore(data = {}) {
    setLoader(true)
    setpage(parseInt(page) + parseInt(1));
    var currAddr = await getCurAddr();
    var name = CatName;
    if (data.CatName) {
      name = data.CatName;
    }
    var payload = {
      limit: 20,
      page: parseInt(page) + parseInt(1),
      currAddr: currAddr,
      CatName: name,
      from: "Home",
    };
    CatBasedTokenList.loader = true;

    setCatBasedTokenList(CatBasedTokenList);
    var resp = await CollectiblesList_Home(payload);
    CatBasedTokenList.loader = false;
    setCatBasedTokenList(CatBasedTokenList);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      setLoader(false)
      if (resp.data.list.length == 20) {
        setshowloadmore(true);
      } else {
        setshowloadmore(false);
      }
      setTokenList(TokenList.concat(resp.data.list));
      if (typeof CatBasedTokenList[name] == "undefined") {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = resp.data.list;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    } else {
      setLoader(false)
      setshowloadmore(false);
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
  }

  // Countdown Timer
  const currentDate = new Date();
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="timer_panel">
        <span>
          <span className="timer_time">{zeroPad(days)}</span>
          <span className="timer_label">d</span>
        </span>
        <span className="timer_dots"> </span>
        <span>
          <span className="timer_time">{zeroPad(hours)}</span>
          <span className="timer_label">h</span>
        </span>
        <span className="timer_dots"> </span>
        <span>
          <span className="timer_time">{zeroPad(minutes)}</span>
          <span className="timer_label">m</span>
        </span>
        <span className="timer_dots"> </span>
        <span>
          <span className="timer_time">{zeroPad(seconds)}</span>
          <span className="timer_label">s</span>
        </span>
      </div>
    );
  };
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Exclusive</title>
        <link
          rel="canonical"
          href={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
        />
        <meta name="description" content={item && item.tokenDesc} />
      </Helmet>
      <ScrollToTopOnMount />
      <Header />
      <div className="no-bottom no-top" id="content">
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
        <LikeRef
          ref={LikeForwardRef}
          setLikedTokenList={setLikedTokenList}
          MyItemAccountAddr={MyItemAccountAddr}
        />
        <ShareNowRef ref={ShareForwardRef} />
        <ReportNowRef
          UserAccountAddr={UserAccountAddr}
          ref={ReportForwardRef}
        />
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
       <BurnRef
          ref={BurnForwardRef}
          Set_HitItem={Set_HitItem}
          item={item}
          Set_item={Set_item}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          TokenBalance={TokenBalance}
          Accounts={Accounts}
          // GetUserBal={GetUserBal}
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
        <TransferRef
          ref={TransferForwardRef}
          Set_HitItem={Set_HitItem}
          item={HitItem}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          TokenBalance={TokenBalance}
          Accounts={Accounts}
        />
        <CancelOrderRef
          ref={CancelOrderForwardRef}
          Set_HitItem={Set_HitItem}
          item={HitItem}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          TokenBalance={TokenBalance}
          Accounts={Accounts}
          // GetUserBal={GetUserBal}
        />
        <section id="subheader" class="text-light">
          <div class="center-y relative text-center">
            <div class="container">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h1>Browse items</h1>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="section" className="pt30 pb30">
          <div class="container">
            <div class="row wow fadeIn">
              <Searchref
                setTokenList={setTokenList}
                TokenList={TokenList}
                CatName={CatName}
                setCatName={setCatName}
                aucttype="no"
                setkeysearch={setkeysearch}
                keysearch={keysearch}
                categoryid={categoryid}
                setcategoryid={setcategoryid}
                categorysearch={categorysearch}
                setcategorysearch={setcategorysearch}
                startprice={startprice}
                setstartprice={setstartprice}
                endprice={endprice}
                setendprice={setendprice}
                typesearch={typesearch}
                settypesearch={settypesearch}
                namesearch={namesearch}
                setnamesearch={setnamesearch}
                setshowloadmore={setshowloadmore}
                setshowsearchloadmore={setshowsearchloadmore}
              />
              {TokenList && TokenList.length > 0
                ? TokenList.map((item) => {
                    return (
                      <TokenItem
                        id={item._id}
                        item={item}
                        Set_item={Set_item}
                        LikedTokenList={LikedTokenList}
                        hitLike={LikeForwardRef.current.hitLike}
                        UserAccountAddr={UserAccountAddr}
                        UserAccountBal={UserAccountBal}
                        set_selectown={set_selectown}
                        popupshow={popupshow}
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
                        // Bid_Click={PlaceABidForwardRef.current.Bid_Click}
                        Burn_Click={BurnForwardRef.current.Burn_Click}
                        Transfer_Click={
                          TransferForwardRef.current.Transfer_Click
                        }
                        CancelOrder_Click={
                          CancelOrderForwardRef.current.CancelOrder_Click
                        }
                        WalletConnected={WalletConnected}
                        //Tattoorequest_Click={TattooForwardRef.current.Tattoorequest_Click}
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
                  })
                : "No record found"}

              {showloadmore && (
                <div className="text-center">
                  <button
                    type="button"
                    class="btn-main"
                    onClick={() => loadmore()}
                  >
                   {loader && (
                      <i
                        class="fa fa-spinner mr-3 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}{" "}
                    Load More
                  </button>
                </div>
              )}
              {showsearchloadmore && (
                <div className="text-center">
                  <button
                    type="button"
                    class="btn-main"
                    onClick={() => loadsearchmore()}
                  >
                   {loader && (
                      <i
                        class="fa fa-spinner mr-3 spinner_icon"
                        aria-hidden="true"
                        id="circle1"
                      ></i>
                    )}{" "}
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
{/* Report Model */}
<div class="modal report primary_modal" id="report">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Report item</h4>
                <button type="button" class="close" data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div class="modal-body">
                <form className="form-border">
                  <h5>Tell us more</h5>
                  <div id="report-reason" class="dropdown w-100">
                    <a
                      // href="javascript:void(0)"
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
                              {console.log(option,'option--option')}
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
{/* Report Model */}
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
                    onClick={()=>hidefunction()}
                  >
                  Put On Sale
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn-main lead mar-top-10 mb-0"
                    onClick={()=>bidpopupshow()}
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
    </div>
  );
}
