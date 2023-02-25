import React, { useRef, useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Countdown, { zeroPad } from "react-countdown";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import moment from "moment";
import { LikeRef } from "./separate/LikeRef";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TokenItem from "./separate/TokenItem";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PutOnBid } from "./separate/PutOnBid";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import { BurnRef } from "./separate/BurnRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import { TransferRef } from "./separate/TransferRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import ConnectWallet from "./separate/Connect-Wallet";
import config from "../lib/config";
import Single_ABI from "../ABI/BEP721.json";
import Multiple_ABI from "../ABI/BEP1155.json";
import ESC_ABI from "../ABI/ESC.json";
import { toast } from "react-toastify";
import { getmylog } from "../helper/walletconnect";
import SelectReact from "react-select";
import {
  CollectiblesList_Home,
  TokenCounts_Get_Detail_Action,
  getHotCollections,
  getbannercollection,
  getreportcategory,
  ReportRequest,
  getTopsellers,
} from "../actions/v1/token";
import { getCurAddr, halfAddrShow } from "../actions/v1/user";
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
toast.configure();
let toasterOption = config.toasterOption;

export default function Home() {
  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "null" : null,
      };
    },
  };

  const daysoptions = [
    { value: "1", label: "1 day" },
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
  ];

  const [CatBasedTokenList, setCatBasedTokenList] = useState({
    loader: false,
    All: { page: 1, list: [], onmore: true },
  });
  const [page, setpage] = useState(1);
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
  const [collections, set_collections] = React.useState([]);
  const [showData, set_showData] = React.useState(true);
  const [bannerlist, setbannerlist] = React.useState([]);
  const [CategoryOption, setCategoryOption] = useState(0);
  const [reportCategoryname, setReportCategoryname] = useState("Select");
  const [description, setdescription] = React.useState("");
  const [sellers, setSellers] = React.useState([]);
  const [loadmorestatus, setloadmorestatus] = React.useState(true);
  const [loader, setLoader] = React.useState(false);
  const [selectown, set_selectown] = React.useState("");

  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const PutOnBidForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var ReportForwardRef = useRef();
  var TransferForwardRef = useRef();

  useEffect(() => {
    loadScript();
  }, []);

  useEffect(() => {
    getInit();
    get_hotcollections();
    get_topcollections();
    get_topsellers();
  }, []);

  async function get_topsellers() {
    var gettopsellers = await getTopsellers();
    setSellers(gettopsellers.data.data);
  }

  function loadScript() {
    dropdown("#report-reason");
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

  async function get_topcollections() {
    var bannercollection = await getbannercollection();
    if (
      bannercollection &&
      bannercollection.result &&
      bannercollection.result.data
    ) {
      setbannerlist(bannercollection.result.data);
    }
  }

  async function get_hotcollections() {
    var startdate = moment().subtract(1, "month");
    var enddate = moment();
    var datas = {
      startdate: startdate,
      enddate: enddate,
    };
    var hotCollections = await getHotCollections(datas);
    set_collections(hotCollections.data.data);
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
      //var web3 = new Web3(window.ethereum);
      var currAddr = curAddr && curAddr[0].toLowerCase();
      // var web3 = new Web3(window.ethereum);
      var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
      var tokenBal = await ESCContract.methods.balanceOf(currAddr).call();
      var tokenBalance = tokenBal / config.decimalvalues;
      Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
    } catch (err) {}
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
    //var web3 = new Web3(window.ethereum);
    var currAddr = curAddr && curAddr[0].toLowerCase();
    var payload = {
      curAddr: currAddr,
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
    //var web3 = new Web3(window.ethereum);
    var currAddr = curAddr && curAddr[0].toLowerCase();
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
            element.tokenOwner != currAddr
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
      if (TokenResp.Token[0].tokenowners_all && currAddr) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(
          (val) => val.tokenOwner.toString() == currAddr.toString()
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
        console.log(resp, "rtrtrt");
        var CategoryOption = [];
        resp.data.data.map((item) => {
          CategoryOption.push({
            value: item._id,
            label: item.name,
          });
        });
        console.log(CategoryOption, "CategoryOption------");
        setCategoryOption(CategoryOption);
      }
    } catch (err) {}
  }
  function changeCategory(name) {
    setReportCategoryname(name);
  }

  async function getloadmore(data = {}) {
    setLoader(true);
    setpage(parseInt(page) + parseInt(1));
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
      limit: config.limit,
      page: page ? parseInt(page) + parseInt(1) : 1,
      currAddr: currAddr,
      CatName: name,
      from: "Home",
    };

    var resp = await CollectiblesList_Home(payload);
    if (
      resp &&
      resp.data &&
      resp.data.from === "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      if (resp.data.list.length < config.limit) {
        setloadmorestatus(false);
        setLoader(false);
      } else {
        setloadmorestatus(true);
        setLoader(false);
      }
      setTokenList(TokenList.concat(resp.data.list));
      if (typeof CatBasedTokenList[name] == "undefined") {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = resp.data.list;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    } else {
      setloadmorestatus(false);
      setLoader(false);
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
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
    var currAddr = curAddr && curAddr[0] ? curAddr[0].toLowerCase() : "";
    var name = CatName;
    if (data.CatName) {
      name = data.CatName;
    }
    var payload = {
      limit: config.limit,
      page: page ? page : 1,
      currAddr: currAddr,
      CatName: name,
      from: "Home",
    };
    CatBasedTokenList.loader = true;

    var resp = await CollectiblesList_Home(payload);
    CatBasedTokenList.loader = false;
    setCatBasedTokenList(CatBasedTokenList);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      if (resp.data.list.length < config.limit) {
        setloadmorestatus(false);
      } else {
        setloadmorestatus(true);
      }
      setTokenList(resp.data.list);
      if (typeof CatBasedTokenList[name] == "undefined") {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = resp.data.list;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    } else {
      setloadmorestatus(false);
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
  }
  const filterchange = async (e) => {
    var diff = e.value;
    var startdate = moment().subtract(parseInt(diff), "days");
    var enddate = moment();
    var datas = {
      startdate: startdate,
      enddate: enddate,
    };
    var hotCollections = await getHotCollections(datas);
    if (
      hotCollections &&
      hotCollections.data &&
      hotCollections.data.data &&
      hotCollections.data.data.length > 0
    ) {
      set_showData(false);
      set_collections(hotCollections.data.data);
      set_showData(true);
    } else {
      set_collections("");
    }
  };
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
    console.log(item, "iiiii");
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
      profileuser: item.tokenCreator,
      tokenName: item.tokenName,
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
  async function GetUserBal() {
    // await WalletForwardRef.current.GetUserBal();
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

  // Countdown Timer
  const currentDate = new Date();
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();

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
      return <span>Ended</span>;
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

  var settingsBig = {
    loop: true,
    margin: 25,
    nav: false,
    dots: true,
    responsive: {
      1000: {
        items: 3,
      },
      600: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  };

  var settings = {
    center: false,
    items: 4,
    loop: false,
    margin: 25,
    nav: true,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    dots: false,
    responsive: {
      1000: {
        items: 4,
      },
      600: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  };
  return (
    <div id="wrapper">
      <ScrollToTopOnMount />
      <Header />
      <div className="homeMainBanner">
        <div className="container">
          <div className="homeBannerContent">
            <h1>
              NILWIRE <span>NFT MARKETPLACE</span>
            </h1>
            <h6>Ballers Series Collection Coming Soon</h6>
            <a href="/create" className="btnLarge">
              Create Your Digital Assets Now
            </a>
          </div>
        </div>
      </div>
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
          Set_HitItem={Set_HitItem}
          item={item}
          Set_item={Set_item}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          TokenBalance={TokenBalance}
          Accounts={Accounts}
          // GetUserBal={GetUserBal}
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
        <main className="homeTextSide">
          <section id="section-hero" className="no-bottom" aria-label="section">
            <div className="container">
              <h2 className="style-2">Spotlight</h2>
              <div className="d-carousel">
                <OwlCarousel
                  className="owl-theme homeTopCarousel wow fadeIn"
                  {...settingsBig}
                >
                  {bannerlist &&
                    bannerlist.length > 0 &&
                    bannerlist.map((item) => {
                      return (
                        <div className="nft_pic">
                          <div className="nft_pic_wrap">
                            <a
                              href={`${config.Front_URL}/collections/${item.conAddr}`}
                            >
                              <img
                                src={`${config.Back_URL}collections/${item.imageUser}`}
                                alt=""
                                className="lazy img-fluid"
                              />
                            </a>
                          </div>
                          <a
                            href={`${config.Front_URL}/collections/${item.conAddr}`}
                          >
                            <span className="nft_pic_info">
                              <span className="nft_pic_title">
                                {item && item.symbol && item.symbol}
                              </span>
                              <span className="nft_pic_by">
                                {halfAddrShow(item && item.owneraddr)}
                              </span>
                            </span>
                          </a>
                        </div>
                      );
                    })}
                </OwlCarousel>
              </div>
            </div>
          </section>
          <section className="homeVisionMisson">
            <div className="container">
              <div className="mvHomeBg">
                <h2 className="style-2">OUR VISION &amp; MISSION</h2>
                <p>
                  Our mission is to help athletes monetize their name, image,
                  and likeness utilizing blockchain technology and bringing
                  value to their fans.
                </p>
                <p>
                  NILWIRE is building a community where athletes, fans, and
                  influencers can connect on a peer to peer marketplace. Our
                  vision is to help athletes beyond sports and provide them a
                  network with fans on another level.
                </p>
              </div>
            </div>
          </section>
          <section id="section-collections" className="pt30 pb30">
            <div className="container">
              <div className="row wow fadeIn">
                <div className="col-lg-12">
                  <h2 className="style-2">New items</h2>
                </div>

                {TokenList &&
                  TokenList.length > 0 &&
                  TokenList.map((item) => {
                    var currDate = new Date();
                    var startdate = new Date(item.clocktime);
                    var enddate = new Date(item.endclocktime);
                    var auction = "false";
                    var finish = "";
                    var enddate1 = "";
                    var showlist = "true";
                    var display_item = 0;
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
                    return (
                      <TokenItem
                        id={item._id}
                        item={item}
                        Set_item={Set_item}
                        set_selectown={set_selectown}
                        LikedTokenList={LikedTokenList}
                        hitLike={LikeForwardRef.current.hitLike}
                        UserAccountAddr={UserAccountAddr}
                        UserAccountBal={UserAccountBal}
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
                  })}
              </div>
              {loadmorestatus ? (
                <>
                  <div className="text-center">
                    <button
                      class="btn-main"
                      type="button"
                      onClick={() => getloadmore()}
                    >
                      {loader && (
                        <i
                          class="fa fa-spinner mr-3 spinner_icon"
                          aria-hidden="true"
                          id="circle1"
                        ></i>
                      )}{" "}
                      Load more
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="spacer-double"></div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="heading_flex">
                    <h2 className="style-2">Top sellers</h2>
                    <div className="dropdown day_list">
                      {/* <SelectReact
                      id="list"
                      options={daysoptions}
                      placeholder={"1 day"}
                      styles={colourStyles}
                    /> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 wow fadeIn">
                  <ul className="author_list">
                    {sellers &&
                      sellers.map((data, i) => {
                        return (
                          <li>
                            <div className="author_list_pp">
                              <a
                                href={
                                  config.Front_URL +
                                  "/user/" +
                                  data.userInfo.curraddress
                                }
                              >
                                {data &&
                                data.userInfo &&
                                data.userInfo.image ? (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}profile/${data.userInfo.image}`}
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}images/previewThumb.png`}
                                    alt=""
                                  />
                                )}
                                {/* <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              /> */}
                                {data &&
                                  data.userInfo &&
                                  data.userInfo.emailverified && (
                                    <i className="fa fa-check"></i>
                                  )}
                              </a>
                            </div>
                            <div className="author_list_info">
                              <a
                                href={
                                  config.Front_URL +
                                  "/user/" +
                                  data.userInfo.curraddress
                                }
                              >
                                {data.userInfo.name
                                  ? data.userInfo.name
                                  : data.userInfo.curraddress.substring(0, 10) +
                                    "..."}
                              </a>
                              <span>Sale : {data.count} </span>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <div class="spacer-double"></div>
              <div className="homeFanBanner">
                <div className="row">
                  <div className="col-md-5">
                    <img
                      className="lazy"
                      src={require("../assets/images/football-player.png")}
                      alt=""
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="homeFanContent">
                      <h2 className="style-2">A Fan First NFT Marketplace</h2>
                      <p>
                        NILWIRE is a fan first NFT marketplace created by
                        brothers/former athletes to connect fans and athletes
                        together. We offer collections created solely by
                        athletes and premier artists to foster a community with
                        the fans.
                      </p>
                      <a href="/exclusive" className="btnLarge">
                        Buy Your Digital Assets Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="spacer-double"></div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="heading_flex">
                    <h2 className="style-2">Hot collections</h2>
                    {/* <div className="dropdown day_list">
                    <SelectReact
                      id="list"
                      options={daysoptions}
                      placeholder={"30 day"}
                      styles={colourStyles}
                      onChange={filterchange}
                    />
                  </div> */}
                  </div>
                </div>
                {showData && (
                  <OwlCarousel className="owl-theme wow fadeIn" {...settings}>
                    {showData &&
                      collections.map((collection, i) => {
                        return (
                          <div className="nft_coll bgShapeBlack style-2">
                            <div className="nft_wrap">
                              <a
                                href={
                                  config.Front_URL +
                                  "/collections/" +
                                  collection.id
                                }
                              >
                                <img
                                  src={
                                    config.Back_URL +
                                    "collections/" +
                                    collection.imageUser
                                  }
                                  className="lazy img-fluid"
                                  alt=""
                                />
                              </a>
                            </div>
                            <div className="nft_coll_pp">
                              <a
                                href={
                                  config.Front_URL +
                                  "/collections/" +
                                  collection.id
                                }
                              >
                                {collection &&
                                collection.userInfo &&
                                collection.userInfo.image ? (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}profile/${collection.userInfo.image}`}
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}images/previewThumb.png`}
                                    alt=""
                                  />
                                )}
                              </a>
                              {collection &&
                                collection.userInfo &&
                                collection.userInfo.emailverified && (
                                  <i className="fa fa-check"></i>
                                )}
                            </div>
                            <div className="nft_coll_info">
                              <a
                                href={
                                  config.Front_URL +
                                  "/collections/" +
                                  collection.id
                                }
                              >
                                <h4>{collection.name}</h4>
                              </a>
                              <span>BEP-{collection.type}</span>
                            </div>
                          </div>
                        );
                      })}
                  </OwlCarousel>
                )}
              </div>
              <div class="spacer-double"></div>
              <div className="collageContent">
                <div className="row">
                  <div className="col-md-7">
                    <div className="homeFanContent">
                      <h2 className="style-2">Our Story</h2>
                      <p>
                        NILWIRE was created by brothers/former athletes who saw
                        an opportunity in the NIL space to help athletes enhance
                        their brand. We are passionate in building a community
                        using NFT marketplace technology and their smart
                        contract capabilities.
                      </p>
                      <p>
                        NILWIRE strives to be a marketplace hosting premier
                        athletes from all over the country to bring value and
                        experiences to fans like never before.
                      </p>
                      {/* <a href="#" className="btnLarge">Contact Us</a> */}
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="text-center d-flex align-items-center justify-content-center h-100">
                      <img
                        className="lazy img-fluid"
                        src={require("../assets/images/logoBig.png")}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        {/* report model*/}
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
                              {console.log(option, "option--option")}
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
    </div>
  );
}
