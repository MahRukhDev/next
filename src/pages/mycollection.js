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
import ReactLoading from "react-loading";
import {Link} from 'react-router-dom'

import {
  CollectiblesList,
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
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [sellers, setSellers] = React.useState([]);
  const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] =
    React.useState("init");
  const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] =
    React.useState("init");
  var imageUrl = config.Back_URL + "cover/5.jpg";
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState(imageUrl);
  const [selectown,set_selectown] = React.useState("");
  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var ReportForwardRef = useRef();
  var TransferForwardRef = useRef();
  const PutOnBidForwardRef = useRef();

  useEffect(() => {
    Getcollection();
    Getuserdetails();
  }, []);

  async function Getuserdetails() {
    var data = {
      id: id,
      userid: localStorage.getItem("nilwireMetamaskAddr"),
    };
    var collection = await GetUserCollection(data);
    setcontractData(collection.data.contractData);
    setownerData(collection.data.ownerData);
    // if (Resp && Resp.data && Resp.data.data && Resp.data.data.User && Resp.data.data.User.collectioncover && Resp.data.data.User.collectioncover!=null && Resp.data.data.User.collectioncover!=undefined && Resp.data.data.User.collectioncover!="") {
    //     setTokenFilePreUrl(
    //       config.Back_URL + "cover/" + Resp.data.data.User.collectioncover
    //     );
    //   }
  }

  async function Getcollection() {
    var currAddr = await getCurAddr();
    if (currAddr) {
      var name = CatName;

      var payload = {
        limit: 1000,
        page:
          CatBasedTokenList[name] && CatBasedTokenList[name].page
            ? CatBasedTokenList[name].page
            : 1,
        currAddr: currAddr,
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

  async function AfterWalletConnected() {
    try {
      LikeForwardRef &&
        LikeForwardRef.current &&
        LikeForwardRef.current.getLikesData();
    } catch (err) {}
    try {
      Set_Loaderstatus(true);
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
      //var web3 = new Web3(window.ethereum);
      var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
      var tokenBal = await ESCContract.methods.balanceOf(currAddr).call();
      var tokenBalance = tokenBal / config.decimalvalues;
      Set_TokenBalance(tokenBalance.toFixed(config.toFixed));
      await Getcollection();
      // }
    } catch (err) {}
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
      {Loaderstatus == false ? (
        <div className="loader_section_">
          {/* <ReactLoading
            type={"spinningBubbles"}
            color="#1c5c90"
            className="loading"
          /> */}
            <h2>Please Connect Wallet To Proceed Further <br /> {!localStorage.getItem("nilwireMetamask") &&
                <Link to="/connect-wallet" className="btn-main">
                  <i style={{marginRight:'10px'}} className="icon_wallet_alt"></i>
                  <span>Connect wallet</span>
                </Link>}</h2>
        </div>
      ) : (
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
          <section
            id="profile_banner"
            className="text-light"
            style={{ backgroundImage: `url(${TokenFilePreUrl})` }}
          ></section>

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
                        {ownerData && ownerData.isverified && (
                          <i className="fa fa-check"></i>
                        )}
                      </div>

                      <div className="profile_name">
                        <h4>
                          {contractData && contractData.name}
                          <div className="clearfix"></div>
                          <span id="wallet" className="profile_wallet">
                            {contractData && contractData.conAddr}
                          </span>
                          <button type="button" id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <p className="text-center w-75 mx-auto">
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
                                  Set_tokenCounts_Detail={
                                    Set_tokenCounts_Detail
                                  }
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
      )}
    </div>
  );
}
