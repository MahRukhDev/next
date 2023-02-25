import React, { useRef, useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Countdown, { zeroPad } from "react-countdown";
import $ from "jquery";
import TokenItem from "./separate/TokenItem";
import { LikeRef } from "./separate/LikeRef";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import { BurnRef } from "./separate/BurnRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import ConnectWallet from "./separate/Connect-Wallet";
import { PutOnBid } from "./separate/PutOnBid";
import config from "../lib/config";
import Single_ABI from "../ABI/BEP721.json";
import Multiple_ABI from "../ABI/BEP1155.json";
import Searchref from "./separate/Search";
import { Helmet } from "react-helmet";
import { getmylog } from "../helper/walletconnect";
import Web3 from "web3";

import {
  CollectiblesList_Home,
  TokenCounts_Get_Detail_Action,
  getHotCollections,
  getbannercollection,
} from "../actions/v1/token";
import { getCurAddr } from "../actions/v1/user";
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function LiveAuction() {
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
  const [typesearch, settypesearch] = useState("");
  const [startprice, setstartprice] = useState(0);
  const [endprice, setendprice] = useState(0);
  const [keysearch, setkeysearch] = useState(0);
  const [categoryid, setcategoryid] = useState("");
  const [showloadmore, setshowloadmore] = useState(false);
  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const PutOnBidForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var ReportForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const [page, setpage] = useState(1);
  const [loadmorestatus, setloadmorestatus] = React.useState(true);
  const [loader, setLoader] = React.useState(false);
  const [selectown, set_selectown] = React.useState("");

  useEffect(() => {
    loadScript();
    getInit();
  }, []);

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
      limit: parseInt(20) * (parseInt(page) + parseInt(1)),
      // page: page ? parseInt(page) + parseInt(1) : 1,
      page: 1,
      currAddr: currAddr,
      CatName: name,
      aucttype: "yes",
      from: "Home",
    };

    var resp = await CollectiblesList_Home(payload);
    if (
      resp &&
      resp.data &&
      resp.data.from === "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      if (
        resp.data.list.length <
        parseInt(20) * (parseInt(page) + parseInt(1))
      ) {
        setloadmorestatus(false);
        setLoader(false);
      } else {
        setloadmorestatus(true);
        setLoader(false);
      }
      //setTokenList(TokenList.concat(resp.data.list));
      setTokenList(resp.data.list);
    } else {
      setloadmorestatus(false);
      setLoader(false);
    }
  }

  async function getInit() {
    if (
      searchtxt &&
      searchtxt != "" &&
      searchtxt != null &&
      searchtxt != undefined
    ) {
      setnamesearch(searchtxt);
      searchstart(searchtxt);
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
  async function AfterWalletConnected() {
    try {
      LikeForwardRef &&
        LikeForwardRef.current &&
        LikeForwardRef.current.getLikesData();
    } catch (err) {}
  }

  async function searchstart(data = {}) {
    var currAddr = await getCurAddr();
    var name = categorysearch;
    var payload = {
      limit: 1000,
      page: 1,
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
      aucttype: "yes",
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
    } else {
      setTokenList(resp.data.list);
    }
  }

  function loadScript() {
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

  async function TokenListCall(data = {}) {
    var currAddr = await getCurAddr();
    var name = CatName;
    if (data.CatName) {
      name = data.CatName;
    }
    var payload = {
      limit: 20,
      page:
        CatBasedTokenList[name] && CatBasedTokenList[name].page
          ? CatBasedTokenList[name].page
          : 1,
      currAddr: currAddr,
      CatName: name,
      aucttype: "yes",
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
      setTokenList(resp.data.list);
      if (resp.data.list.length < 20) {
        setloadmorestatus(false);
        setLoader(false);
      } else {
        setloadmorestatus(true);
        setLoader(false);
      }
    } else {
      setTokenList("");
      setloadmorestatus(false);
      setLoader(false);
    }
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
        <title>Nilwire - Auction</title>
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
          // GetUserBal={GetUserBal}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          TokenBalance={TokenBalance}
          Accounts={Accounts}
          item={HitItem}
          item={item}
          Set_item={Set_item}
        />
        <ShareNowRef ref={ShareForwardRef} />
        <ReportNowRef
          UserAccountAddr={UserAccountAddr}
          ref={ReportForwardRef}
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
        <section id="subheader" class="text-light">
          <div class="center-y relative text-center">
            <div class="container">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h1>Live auction</h1>
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
                aucttype="yes"
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
                from="liveact"
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
                        //Transfer_Click = {TransferForwardRef.current.Transfer_Click}
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
                        aucttype="yes"
                        from={0}
                      />
                    );
                  })
                : "No record found"}
            </div>
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
        </section>
        <Footer />

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
