import React, { useRef, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import ProfileBackground from "../assets/images/background/5.jpg";
import Countdown, { zeroPad } from "react-countdown";
import { GetUserCollection } from "../actions/v1/token";
import config from "../lib/config";
import TokenItem from "./separate/TokenItem";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import { BurnRef } from "./separate/BurnRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import { TransferRef } from "./separate/TransferRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import ConnectWallet from "./separate/Connect-Wallet";
import { LikeRef } from "./separate/LikeRef";
import { PutOnBid } from "./separate/PutOnBid";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import moment from "moment";
import Single_ABI from "../ABI/BEP721.json";
import Multiple_ABI from "../ABI/BEP1155.json";
import ESC_ABI from "../ABI/ESC.json";
import { toast } from "react-toastify";
import { getmylog } from "../helper/walletconnect";
import { Helmet } from "react-helmet";

import {
  CollectiblesList,
  TokenCounts_Get_Detail_Action,
  getHotCollections,
  getbannercollection,
  getreportcategory,
  ReportRequest,
  getTopsellers,
  getDetailsCollections,
} from "../actions/v1/token";
import { getCurAddr, halfAddrShow } from "../actions/v1/user";

toast.configure();
let toasterOption = config.toasterOption;
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Collections() {
  var { id } = useParams();
  // Countdown Timer
  const currentDate = new Date();
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();

  const [Onsale, setOnsale] = React.useState(0);
  const [owned, setOwned] = React.useState(0);
  const [contractData, setcontractData] = React.useState(0);
  const [ownerData, setownerData] = React.useState(0);
  const [CatBasedTokenList, setCatBasedTokenList] = useState({
    loader: false,
    All: { page: 1, list: [], onmore: true },
  });
  var imageUrl = config.Back_URL + "cover/5.jpg";
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState(imageUrl);
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
  const [totaluserbidAmt, setTotaluserbidAmt] = React.useState(0);
  const [HitItem, Set_HitItem] = useState({});
  const [collections, set_collections] = React.useState("");
  const [bannerlist, setbannerlist] = React.useState([]);
  const [CategoryOption, setCategoryOption] = useState(0);
  const [reportCategoryname, setReportCategoryname] = useState("Select");
  const [description, setdescription] = React.useState("");
  const [userCollectionDetails, setuserCollectionDetails] = React.useState("");
  const [bid, setBid] = React.useState("");
  const [sellers, setSellers] = React.useState([]);
  const [selectown, set_selectown] = React.useState("");
  const [mymarket, setmymarket] = React.useState("");
  const [biddamt, setbiddamt] = React.useState(0);
  const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] =
    React.useState("init");
  const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] =
    React.useState("init");

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
    Getusercollection();
    Getuserdetails();
  }, []);

  async function Getuserdetails() {
    var data = {
      id: id,
      userid: localStorage.getItem("nilwireMetamaskAddr"),
    };
    var collection = await GetUserCollection(data);
    var data = {
      id: id,
    };
    var usercollectionDetailNews = await getDetailsCollections(data);
    var marketCap = JSON.stringify(
      usercollectionDetailNews.data.RespData.resp[0].totalVol
    );
    marketCap = JSON.parse(marketCap);
    setuserCollectionDetails(usercollectionDetailNews.data.RespData.resp[0]);
    setmymarket(marketCap);
    setBid(usercollectionDetailNews.data.RespData.bidCnt[0]);
    setbiddamt(
      usercollectionDetailNews.data.RespData.bidCnt[0]
        ? usercollectionDetailNews.data.RespData.bidCnt[0].tokenBidAmt
        : 0
    );
    setcontractData(collection.data.contractData);
    setownerData(collection.data.ownerData);
    if (
      collection &&
      collection.data &&
      collection.data.ownerData &&
      collection.data.ownerData.collectioncover &&
      collection.data.ownerData.collectioncover != null &&
      collection.data.ownerData.collectioncover != undefined &&
      collection.data.ownerData.collectioncover != ""
    ) {
      setTokenFilePreUrl(
        config.Back_URL + "cover/" + collection.data.ownerData.collectioncover
      );
    }
  }

  async function copyToClipboard(e) {
    var textField = document.createElement("textarea");
    textField.innerText = contractData.conAddr;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied Successfully", toasterOption);
  }

  async function Getusercollection() {
    var currAddr = await getCurAddr();
    var name = CatName;
    var payload = {
      limit: 1000,
      page:
        CatBasedTokenList[name] && CatBasedTokenList[name].page
          ? CatBasedTokenList[name].page
          : 1,
      currAddr: currAddr,
      key: "collection",
      CatName: name,
      id: id,
      from: "Home",
    };
    CatBasedTokenList.loader = true;
    setCatBasedTokenList(CatBasedTokenList);
    var resp = await CollectiblesList(payload);
    CatBasedTokenList.loader = false;
    setCatBasedTokenList(CatBasedTokenList);
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      setOnsale(resp.data.list);
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
      //if (window.ethereum) {
      //var web3 = new Web3(window.ethereum);
      if (curAddr && curAddr != null && curAddr != undefined && curAddr != "") {
        var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
        var tokenBal = await ESCContract.methods
          .balanceOf(curAddr[0].toLowerCase())
          .call();
        var tokenBalance = tokenBal / config.decimalvalues;
        Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
      }
      // }
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
        <title>Nilwire - Collections</title>
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
        <section
          id="profile_banner subheader padding-bottom-40"
          className="text-light"
        >
          <div className="container">
            <div
              className="profile-bg"
              style={{ backgroundImage: `url(${TokenFilePreUrl})` }}
            ></div>
          </div>
        </section>
        <section aria-label="section" className="d_coll no-top">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile mb-3">
                  <div className="profile_avatar">
                    <div className="d_profile_img">
                      <img
                        src={
                          contractData && contractData.imageUser
                            ? config.Back_URL +
                              "collections/" +
                              contractData.imageUser
                            : require("../assets/images/profile_placeholder.png")
                        }
                        alt=""
                      />
                    </div>

                    <div className="profile_name">
                      <h4>
                        {contractData && contractData.name}
                        <div className="clearfix"></div>
                        <span id="wallet" className="profile_wallet">
                          {contractData && contractData.conAddr}
                        </span>
                        <button
                          type="button"
                          id="btn_copy"
                          title="Copy Text"
                          onClick={copyToClipboard}
                        >
                          Copy
                        </button>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="collection_page_details">
                  <div className="btn-group collection_btn_grp mt-3">
                    <button type="button" class="btn">
                      <p>Highest Price</p>
                      <h4 className="text-white">
                        {userCollectionDetails &&
                        userCollectionDetails.highSale &&
                        userCollectionDetails.highSale[0] &&
                        userCollectionDetails.highSale[0].price
                          ? userCollectionDetails.highSale[0].price.toFixed(8) +
                            " ETH"
                          : "0 ETH"}
                      </h4>
                    </button>
                    <button type="button" class="btn">
                      <p>Floor Price</p>
                      <h4 className="text-white">
                        {userCollectionDetails &&
                        userCollectionDetails.floorPrice &&
                        userCollectionDetails.floorPrice[0] &&
                        userCollectionDetails.floorPrice[0].price
                          ? userCollectionDetails.floorPrice[0].price.toFixed(
                              8
                            ) + " ETH"
                          : "0 ETH"}
                      </h4>
                    </button>
                    <button type="button" class="btn">
                      <p>Market Cap</p>
                      <h4 className="text-white">
                        {userCollectionDetails &&
                        userCollectionDetails.marketCap &&
                        userCollectionDetails.marketCap[0] &&
                        userCollectionDetails.marketCap[0].total
                          ? userCollectionDetails.marketCap[0].total.toFixed(
                              8
                            ) + " ETH"
                          : "0 ETH"}
                      </h4>
                    </button>
                    <button type="button" class="btn">
                      <p>Items</p>
                      <h4 className="text-white">
                        {userCollectionDetails &&
                        userCollectionDetails.itemCnt.length
                          ? userCollectionDetails.itemCnt.length
                          : 0}
                      </h4>
                    </button>
                    <button type="button" class="btn">
                      <p>Owners</p>
                      <h4 className="text-white">
                        {userCollectionDetails &&
                        userCollectionDetails.ownerCnt.length > 0
                          ? userCollectionDetails.ownerCnt.length
                          : 0}
                      </h4>
                    </button>
                    <button type="button" class="btn">
                      <p>Total Volume</p>
                      <h4 className="text-white">
                        {mymarket &&
                        mymarket != undefined &&
                        mymarket != null &&
                        mymarket.length > 0 &&
                        mymarket[0].volume != undefined
                          ? parseFloat(mymarket[0].volume).toFixed(8) + " ETH"
                          : "0 ETH"}
                      </h4>
                    </button>
                  </div>
                </div>
                <p className="text-center w-75 mx-auto mt-3">
                  {contractData.desc}{" "}
                </p>
                <div className="de_tab tab_simple">
                  <div
                    className="tab-content de_tab_content"
                    id="nav-tabContent"
                  >
                    <div
                      className="tab-pane fade show active"
                      id="nav-onSale"
                      role="tabpanel"
                      aria-labelledby="nav-onSale-tab"
                    >
                      <div className="row">
                        {Onsale &&
                          Onsale.length > 0 &&
                          Onsale.map((item, i) => {
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
                                  PurchaseNowForwardRef.current
                                    .PurchaseNow_Click
                                }
                                PlaceABid_Click={
                                  PlaceABidForwardRef.current.PlaceABid_Click
                                }
                                Set_Bids={Set_Bids}
                                Bids={Bids}
                                Set_BuyOwnerDetailFirst={
                                  Set_BuyOwnerDetailFirst
                                }
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
                                  CancelOrderForwardRef.current
                                    .CancelOrder_Click
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
