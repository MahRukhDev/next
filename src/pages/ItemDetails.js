import React, { useRef, useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { Link, useHistory, useParams } from "react-router-dom";
import { LikeRef } from "./separate/LikeRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import ConnectWallet from "./separate/Connect-Wallet";
import { WalletRef } from "./separate/WalletRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import Countdown, { zeroPad } from "react-countdown";
import { PutOnBid } from "./separate/PutOnBid";
import Web3 from "web3";
import "@metamask/legacy-web3";
import moment from "moment";
import config from "../lib/config";
import ReactLoading from "react-loading";
import { getmylog } from "../helper/walletconnect";
import { Helmet } from "react-helmet";
import {
  getCurAddr,
  halfAddrShow,
  Activity_List_Action,
  HistoryActivity_List_Action,
} from "../actions/v1/user";

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
  Bidding_Detail_Action,
} from "../actions/v1/token";

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function ItemDetails() {
  var { tokenidval } = useParams();
  const [LikedTokenList, setLikedTokenList] = React.useState([]);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState("");
  const [WalletConnected, Set_WalletConnected] = React.useState(false);
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState("");
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState("");
  const [TokenBalance, Set_TokenBalance] = useState(0);
  const [tokenCounts, Set_tokenCounts] = useState(tokenidval);
  const [item, Set_item] = useState({});
  const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});
  const [AllowedQuantity, Set_AllowedQuantity] = useState(0);
  const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
  const [MyTokenDetail, Set_MyTokenDetail] = useState({});
  const [Bids, Set_Bids] = useState([]);
  const [onwer_price, set_owner_price] = useState({});
  const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [ActivityList, Set_ActivityList] = React.useState([]);
  const [Activitycount, Set_Activitycount] = React.useState(0);
  const [HitItem, Set_HitItem] = useState({});
  const [Tabname, Set_Tabname] = useState("Info");
  const [AccepBidSelect, Set_AccepBidSelect] = useState(0);
  const [tokenBidAmt, Set_tokenBidAmt] = useState(0);
  const [NoOfToken, Set_NoOfToken] = useState(0);
  const [ValidateError, Set_ValidateError] = useState({});
  const [YouWillPay, Set_YouWillPay] = useState(0);
  const [YouWillPayFee, Set_YouWillPayFee] = useState(0);
  const [YouWillGet, Set_YouWillGet] = useState(0);
  const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] =
    React.useState("init");
  const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] =
    React.useState("init");
  const [totaluserbidAmt, setTotaluserbidAmt] = React.useState(0);
  const [selectown, set_selectown] = React.useState("");
  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  var PutOnSaleForwardRef = useRef();
  var PurchaseNowForwardRef = useRef();
  var CancelOrderForwardRef = useRef();
  var WalletForwardRef = useRef();
  var ShareForwardRef = useRef();
  const PutOnBidForwardRef = useRef();


  const AfterWalletConnected = async () => {
    var curAddr = await getCurAddr();
    var payload = {
      curAddr: curAddr,
      tokenCounts: tokenidval,
    };
    TokenCounts_Get_Detail_Call(payload);
    Get_Activity_list();
    try {
      LikeForwardRef &&
        LikeForwardRef.current &&
        LikeForwardRef.current.getLikesData();
    } catch (err) {}
  };

  function convertStr(n){
    var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
    if (!/e/i.test(toStr)) {
        return n;
    }
    var [lead,decimal,pow] = n.toString()
        .replace(/^-/,"")
        .replace(/^([0-9]+)(e.*)/,"$1.$2")
        .split(/e|\./);
    return +pow < 0
        ? sign + "0." + "0".repeat(Math.max(Math.abs(pow)-1 || 0, 0)) + lead + decimal
        : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow-decimal.length || 0, 0))) : (decimal.slice(0,+pow)+"."+decimal.slice(+pow)))
}
  
  async function GetUserBal() {
    await WalletForwardRef.current.GetUserBal();
  }
//   const userDetails = async () => {
//   var curAddr = await getCurAddr();
//   var payload = {
//     curAddr: curAddr,
//     tokenCounts: tokenidval,
//   };
//   TokenCounts_Get_Detail_Call(payload)
// }

useEffect(async()=>{
  var curAddr = await getCurAddr();
  var payload = {
    curAddr: curAddr,
    tokenCounts: tokenidval,
  };
  TokenCounts_Get_Detail_Call(payload);
  // Get_Activity_list();
},[])

  
  const TokenCounts_Get_Detail_Call = async (payload) => {
    var curAddr = await getCurAddr();
    var Resp = await TokenCounts_Get_Detail_Action(payload);
    // console.log(Resp,'Resp');
    if (
      Resp &&
      Resp &&
      Resp.data &&
      Resp.data.Detail &&
      Resp.data.Detail.Resp
    ) {
      var TokenResp = Resp.data.Detail.Resp;
      Set_AllowedQuantity(
        TokenResp &&
          TokenResp["Token"] &&
          TokenResp["Token"][0] &&
          TokenResp["Token"][0]["balance"]
          ? TokenResp["Token"][0]["balance"]
          : 0
      );
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
          if (
            element.balance > 0 &&
            //element.price > 0 &&
            element.tokenOwner != curAddr
          ) {
            console.log(element,"========Set_BuyOwnerDetailFirst=============")
            Set_BuyOwnerDetailFirst(element);
            break;
          }
        }
      }
      Set_tokenCounts_Detail(TokenResp);
      // console.log(TokenResp,'TokenRespTokenRespTokenResp');
      if (TokenResp.Bids) {
        Set_Bids(TokenResp.Bids);
      }
      let ageSum = 0;
      var tokenowners_all =
        TokenResp &&
        TokenResp.Token &&
        TokenResp.Token[0] &&
        TokenResp.Token[0].tokenowners_all
          ? TokenResp.Token[0].tokenowners_all
          : [];
      if (tokenowners_all && tokenowners_all.length > 0) {
        for (let i = 0; i < tokenowners_all.length; i++) {
          if (tokenowners_all[i].balance > 0) {
            ageSum += tokenowners_all[i].balance;
          }
        }
      }
      var IndexVal = -1;
      if (TokenResp && TokenResp.Token.length > 0) {
        if (TokenResp.Token[0].tokenowners_all && curAddr) {
          var tokenowners_all = TokenResp.Token[0].tokenowners_all;
          IndexVal = tokenowners_all.findIndex(
            (val) => val.tokenOwner.toString() == curAddr.toString()
          );
        }
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
      
        // try {
          // var mydata = await getmylog();
          // const web3 = new Web3(
          //   mydata &&
          //   mydata.provider &&
          //   mydata.provider != null &&
          //   mydata.provider != undefined &&
          //   mydata.provider != ""
          //     ? mydata.provider
          //     : window.ethereum
          // );
          // var curAddr = await web3.eth.getAccounts();
          //var web3 = new Web3(window.ethereum);
          // var currAddr = curAddr && curAddr[0].toLowerCase();
          //if (window.ethereum) {
          // var web3 = new Web3(window.ethereum);
          // if(TokenResp.Token[0].type==721){
          //   var CoursetroContract = new web3.eth.Contract(BEP721, config.singleContract);
          //   if(TokenResp&&TokenResp.Token[0]&&TokenResp.Token[0].tokenowners_current[0].biddingtoken==config.currencySymbol){
          //     var fee = await CoursetroContract.methods.getServiceFee().call();
          //   }else  if(TokenResp&&TokenResp.Token[0]&&TokenResp.Token[0].tokenowners_current[0].biddingtoken==config.tokenSymbol){
          //     var fee = await CoursetroContract.methods.getValobitdxFee().call();
          //   }else{
          //     var fee = await CoursetroContract.methods.getServiceFee().call();
          //   }
          // }else{
          //   var CoursetroContract = new web3.eth.Contract(BEP1155, config.multipleContract);
          //   if(TokenResp&&TokenResp.Token[0]&&TokenResp.Token[0].tokenowners_current[0].biddingtoken==config.currencySymbol){
          //     var fee = await CoursetroContract.methods.getServiceFee().call();
          //   }else  if(TokenResp&&TokenResp.Token[0]&&TokenResp.Token[0].tokenowners_current[0].biddingtoken==config.tokenSymbol){
          //     var fee = await CoursetroContract.methods.getValobitdxFee().call();
          //   }else{
          //     var fee = await CoursetroContract.methods.getServiceFee().call();
          //   }
          // }
          // var feeValue = fee/config.decimalvalues;
          // setservicefee(feeValue);
          //}
        // } catch (err) {}
        Set_Loaderstatus(true);
        Set_item(TokenResp.Token[0]);
      }
    }
  };
  
  async function Get_Activity_list() {
    try {
      var resp = await HistoryActivity_List_Action({
        tokenCounts: tokenidval,
      });
      console.log(resp,'resp');
      if (resp && resp.data && resp.data.list) {
        var List = resp.data.list;
        console.log((List,'Lists'));
        if (List.length > 0) {
          Set_Activitycount(List.length);
        }
        Set_ActivityList(List);
      } else {
        Set_ActivityList([]);
      }
    } catch (err) {}
  }
  try {
    var display_item = "";
    var currDate = new Date();
    var startdate = new Date(item.clocktime);
    var enddate = new Date(item.endclocktime);
    var auction = "false";
    var finish = "";
    var enddate1 = "";
    var showlist = "true";
    if (item.type == 721 && item.PutOnSaleType == "TimedAuction") {
      auction = "true";
      var a = moment(item.clocktime);
      var b = moment(item.endclocktime);
      var c = moment();
      a.diff(b); // 86400000
      var diffInMs = a.diff(c);
      finish = b.diff(c);
      enddate1 = parseFloat(diffInMs);
      display_item = a.diff(c);
      if (finish > 0) {
        showlist = "true";
      } else {
        var auctionTxt = "Ended";
        showlist = "false";
      }
    }
  } catch (err) {}

  async function hidefunction() {
    window.$(".modal").modal("hide");
    PutOnSaleForwardRef.current.PutOnSale_Click(item, selectown);
  }

  async function bidpopupshow() {
    window.$(".modal").modal("hide");
    PutOnBidForwardRef.current.PutOnBid_Click(item, selectown);
  }

  async function popupshow(s_item, s_detail) {
    set_selectown(s_detail);
    window.$("#option_modal").modal("show");
  }


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
      return <span>{days}d {hours}h {minutes}m {seconds}s left</span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s to start
        </span>
      );
    }
  };

  function convert(n){
    var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
    if (!/e/i.test(toStr)) {
        return n;
    }
    var [lead,decimal,pow] = n.toString()
        .replace(/^-/,"")
        .replace(/^([0-9]+)(e.*)/,"$1.$2")
        .split(/e|\./);
    return +pow < 0
        ? sign + "0." + "0".repeat(Math.max(Math.abs(pow)-1 || 0, 0)) + lead + decimal
        : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow-decimal.length || 0, 0))) : (decimal.slice(0,+pow)+"."+decimal.slice(+pow)))
}
console.log(BuyOwnerDetailFirst , showlist == "true" ,display_item,
                                BuyOwnerDetailFirst.tokenOwner,"=============ininnininninnninniinnitemderaillscdsfsd")
  return (
    <div id="wrapper">
      <ConnectWallet
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_UserAccountBal={Set_UserAccountBal}
        Set_WalletConnected={Set_WalletConnected}
        Set_AddressUserDetails={Set_AddressUserDetails}
        Set_Accounts={Set_Accounts}
        WalletConnected={WalletConnected}
        AfterWalletConnected={AfterWalletConnected}
      />
      <LikeRef
        ref={LikeForwardRef}
        setLikedTokenList={setLikedTokenList}
        MyItemAccountAddr={MyItemAccountAddr}
      />
      <PlaceAndAcceptBidRef
        ref={PlaceABidForwardRef}
        Set_Tabname={Set_Tabname}
        Tabname={Tabname}
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
      <PurchaseNowRef
        ref={PurchaseNowForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        TokenBalance={TokenBalance}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
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
      <CancelOrderRef
        ref={CancelOrderForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - ItemDetails</title>
        <link
          rel="canonical"
          href={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
        />
        <meta name="description" content={item && item.tokenDesc} />
      </Helmet>
      <ScrollToTopOnMount />
      <Header />
      {/* {Loaderstatus == false ? (
        <div className="loader_section_">
          <ReactLoading
            type={"spinningBubbles"}
            color="#1c5c90"
            className="loading"
          />
        </div>
      ) : ( */}
        <div className="no-bottom no-top" id="content">
          {
            console.log(item,'iiiiiiiiiiiiiiiiii')
          }
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  {item &&
                  item.image &&
                  item.image.split(".").pop() == "mp4" ? (
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
                    item.image.split(".").pop() == "mp3" 
                     || item &&
                     item.image && item.image.split(".").pop() == "wav"
                     ? (
                    <>
                      <img
                        src={`${config.Back_URL}images/music.png`}
                        alt=""
                        className="img-fluid img-rounded mb-sm-30"
                      />
                      <audio
                        src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                        type="audio/mp3"
                        controls
                        className="img-fluid img-rounded mb-sm-30"
                      ></audio>
                    </>
                  ) : (
                    <img
                      src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                      alt="Collections"
                      className="img-fluid img-rounded mb-sm-30"
                    />
                  )}
                  {/* <img src={require("../assets/images/items/big-1.jpg")} className="img-fluid img-rounded mb-sm-30" alt="" /> */}
                   {(item &&
                      item.image && item.image.split('.').pop() == 'mp3') 
                      || (item &&
                        item.image && item.image.split(".").pop() == "wav")
                       ?
                    <audio style={{marginLeft:' -278px',marginTop: '10px'}} src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}  type="audio/mp3"controls className="audio audio_widyth">
                    </audio>:""
                   }


                   <div className="activity-list" style={{marginTop:'20px'}}>
                   <div className="info_properties">
                                   <h5>Properties</h5>
                                   <div className="info_properties_panel">
                                     {
                                       item &&
                                       item.tokenProperty &&
                                       item.tokenProperty.length > 0 &&
                                       item.tokenProperty.map((myprob, i) =>{
                                         return myprob.des != undefined &&
                                         myprob.des != null &&
                                         myprob.des != "" ? (
                                           <div>
                                       <p>{myprob.des}</p>
                                       <h4>{myprob.unit}</h4>
                                     </div>
                                         ) : ("")
                                       } )
                                     }
                                     
                                   </div>
                                 </div> 
                   </div>
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <div className="detailBg">
                    {/* Auctions ends in <div className="de_countdown" data-year="2021" data-month="9" data-day="16" data-hour="8"></div> */}
                    <h2>{item.tokenName}</h2>
                    <div className="item_info_counts">
                      <div className="item_info_type">
                        <i className="fa fa-image"></i>
                        {item.tokenCategory}
                      </div>
                      {/* <div className="item_info_views"><i className="fa fa-eye"></i>250</div> */}
                      <div className="item_info_like">
                        {/* <i className="fa fa-heart"></i>18 */}
                        {LikedTokenList.findIndex(
                          (tokenCounts) =>
                            tokenCounts.tokenCounts === item.tokenCounts
                        ) > -1 ? (
                          <i
                            className="fa fa-heart liked"
                            onClick={() => LikeForwardRef.current.hitLike(item)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        ) : (
                          <i
                            className="far fa-heart "
                            onClick={() => LikeForwardRef.current.hitLike(item)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        )}
                        <span class={item.tokenCounts + "-likecount mr-2"}>
                          {item.likecount}
                        </span>
                      </div>
                    </div>
                    {UserAccountAddr &&
                      item &&
                      item.tokenowners_current &&
                      item.unlockcontent != "" &&
                      item.tokenowners_current.findIndex(
                        (e) => e.tokenOwner == UserAccountAddr
                      ) > -1 && <p>{item.unlockcontent}</p>}
                    {item.tokenDesc != "" && (
                      <p>Description : {item.tokenDesc}</p>
                    )}

                    {item.usercontract &&
                      item.usercontract != "" &&
                      item.usercontract.name != "" &&
                      item.usercontract.name != undefined &&
                      item.usercontract.name != null && (
                        <p>
                          Collection :{" "}
                          <a
                            href={
                              config.Front_URL +
                              "/collections/" +
                              item.usercontract.conAddr
                            }
                          >
                            {item.usercontract.name}
                          </a>
                        </p>
                      )}
                    {/*  {item.tokenProperty != "" && (
                      <p>Properties : {item.tokenProperty}</p>
                    )} */}
                    {/* my */}
                    {item.PutOnSaleType == "TimedAuction" &&
                      // showlist == "true" &&
                      display_item <= 0 && (
                        <div className="de_countdownr" style={{border:'2px solid #eb7d48;',background: 'var(--primary-color) !important;'}}>
                          <Countdown
                            date={enddate}
                            autoStart={true}
                            onStart={() => startdate}
                            renderer={renderer}
                          />
                          {/* </Countdown> */}
                          {/* <Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /> */}
                        </div>
                      )}
                      {item.PutOnSaleType == "TimedAuction" &&
                        // showlist == "true" &&
                        display_item > 0 && (
                        <div className="de_countdownr" style={{border:'2px solid #eb7d48;',background: 'var(--primary-color) !important;'}}>
                            <Countdown
                              date={startdate}
                              autoStart={true}
                              onStart={() => Date.now()}
                              renderer={renderer1}
                            />
                          </div>
                        )}
                    {/* my */}
                    <h6>Creator</h6>
                    <div className="item_author">
                      <div className="author_list_pp">
                        {item.tokenCreatorInfo &&
                        item.tokenCreatorInfo.curraddress &&
                        item.tokenCreatorInfo.image != "" ? (
                          <a
                            href={`${config.Front_URL}/user/${
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.curraddress
                            }`}
                          >
                            <img
                              className="lazy"
                              src={`${config.Back_URL}profile/${item.tokenCreatorInfo.image}`}
                              alt=""
                            />
                            {item &&
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.emailverified &&
                              item.tokenCreatorInfo.emailverified[0] && (
                                <i className="fa fa-check"></i>
                              )}
                          </a>
                        ) : (
                          <a
                            href={`${config.Front_URL}/user/${
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.curraddress
                            }`}
                          >
                            <img
                              className="lazy"
                              src={`${config.Back_URL}images/previewThumb.png`}
                              alt=""
                            />
                            {item &&
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.emailverified &&
                              item.tokenCreatorInfo.emailverified[0] && (
                                <i className="fa fa-check"></i>
                              )}
                          </a>
                        )}
                      </div>
                      {item.tokenCreatorInfo &&
                      item.tokenCreatorInfo.name != "" ? (
                        <div className="author_list_info">
                          <a
                            href={`${config.Front_URL}/user/${
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.curraddress
                            }`}
                          >
                            {item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.name}
                          </a>
                        </div>
                      ) : (
                        <div className="author_list_info">
                          <a
                            href={`${config.Front_URL}/user/${
                              item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.curraddress
                            }`}
                          >
                            {item.tokenCreatorInfo &&
                              item.tokenCreatorInfo.curraddress}
                          </a>
                        </div>
                      )}
                    </div>
                    </div>
                    <div className="spacer-40"></div>
                                {
                                  WalletConnected===true &&
                               
                    <div className="de_tab tab_simple">
                      <nav>
                        <div
                          class="nav nav-tabs de_nav"
                          id="nav-tab"
                          role="tablist"
                        >
                          <a
                            class="nav-item nav-link active"
                            id="nav-owner-tab"
                            data-toggle="tab"
                            href="#nav-owner"
                            role="tab"
                            aria-controls="nav-owner"
                            aria-selected="false"
                          >
                            Owner
                          </a>
                          <a
                            class="nav-item nav-link"
                            id="nav-bids-tab"
                            data-toggle="tab"
                            href="#nav-bids"
                            role="tab"
                            aria-controls="nav-bids"
                            aria-selected="true"
                          >
                            Bids
                          </a>

                          <a
                            class="nav-item nav-link"
                            id="nav-history-tab"
                            data-toggle="tab"
                            href="#nav-history"
                            role="tab"
                            aria-controls="nav-history"
                            aria-selected="false"
                          >
                            History
                          </a>
                        </div>
                      </nav>
                      <div
                        class="tab-content de_tab_content detailPageTab"
                        id="nav-tabContent"
                      >
                        <div
                          class="tab-pane fade "
                          id="nav-bids"
                          role="tabpanel"
                          aria-labelledby="nav-bids-tab"
                        >
                          {Bids && Bids.pending && Bids.pending.length > 0 ? (
                            Bids.pending.map((curBid) => {
                              return (
                                <div className="p_list">
                                  <div className="p_list_pp">
                                    <a
                                      href={`${config.Front_URL}/user/${curBid.tokenBidAddress}`}
                                    >
                                      <img
                                        className="lazy"
                                        src={
                                          curBid &&
                                          curBid.bidDetails &&
                                          curBid.bidDetails.image !=
                                            undefined &&
                                          curBid.bidDetails.image != ""
                                            ? `${config.Back_URL}profile/${curBid.bidDetails.image}`
                                            : require("../assets/images/profile_placeholder.png")
                                        }
                                        alt=""
                                      />
                                      {curBid &&
                                        curBid.bidDetails &&
                                        curBid.bidDetails.emailverified && (
                                          <i className="fa fa-check"></i>
                                        )}
                                    </a>
                                  </div>
                                  <div className="p_list_info">
                                    <b>
                                      {convertStr(curBid.tokenBidAmt)} {config.tokenSymbol}
                                      {" for "}{curBid && curBid.pending? curBid.pending+" Qty" : "1 Qty"}
                                    </b>
                                    <span>
                                      by{" "}
                                      <b>
                                        {halfAddrShow(curBid.tokenBidAddress)}
                                      </b>{" "}
                                      at{" "}
                                      {moment(curBid.timestamp).format(
                                        "MMMM Do YYYY, h:mm a"
                                      )}
                                      {UserAccountAddr &&
                                        UserAccountAddr !=
                                          curBid.tokenBidAddress &&
                                        item &&
                                        item.tokenowners_current &&
                                        item.tokenowners_current.findIndex(
                                          (e) => e.tokenOwner == UserAccountAddr
                                        ) > -1 && (
                                          <div className="ml-0 mt-3 ml-cus">
                                            <button
                                              className="btn-main lead mar-right-15"
                                              data-toggle="modal"
                                              type="button"
                                              onClick={() =>
                                                PlaceABidForwardRef.current.AcceptBid_Select(
                                                  curBid,
                                                  item
                                                )
                                              }
                                            >
                                              Accept
                                            </button>
                                          </div>
                                        )}
                                      {UserAccountAddr &&
                                        UserAccountAddr ==
                                          curBid.tokenBidAddress && (
                                          <div className="ml-2 ml-cus">
                                            <button
                                              className="btn-main lead mar-right-15"
                                              data-toggle="modal"
                                              type="button"
                                              onClick={() =>
                                                PlaceABidForwardRef.current.CancelBid_Select(
                                                  curBid,
                                                  item
                                                )
                                              }
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        )}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="mt-0 media_text  mb-0">No Records</p>
                          )}
                          {/* <div className="p_list">
                                            <div className="p_list_pp">
                                                <a href="dark-author.html">
                                                    <img className="lazy" src={require("../assets/images/author/author-2.jpg")} alt="" />
                                                    <i className="fa fa-check"></i>
                                                </a>
                                            </div>                                    
                                            <div className="p_list_info">
                                                Bid <b>0.005 ETH</b>
                                                <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                                            </div>
                                        </div> */}
                        </div>

                        <div
                          class="tab-pane fade show active"
                          id="nav-owner"
                          role="tabpanel"
                          aria-labelledby="nav-owner-tab"
                        >
                          <ul class="activity-list itemDetailsList">
                            {item.tokenowners_current &&
                              item.tokenowners_current.length > 0 &&
                              item.tokenowners_current.map((itemCur, i) => {
                                let myimageindex = item && item.tokenOwnerInfo && item.tokenOwnerInfo.curraddress ?  (item.tokenOwnerInfo.curraddress).indexOf(itemCur.tokenOwner):-1;
                                console.log(myimageindex,"==========myimageindex==========")
                                return (
                                  <li>
                                    <div className="creators_details flex_col_c mb-3">
                                      <div className="d-flex mb-2">
                                        <div class="p_list mb-0">
                                          <div class="p_list_pp author_list_pp">
                                            <img
                                              className="lazy"
                                              src={
                                                item.tokenOwnerInfo &&
                                                item.tokenOwnerInfo.image &&
                                                item.tokenOwnerInfo.image
                                                  .length > 0 &&
                                                item.tokenOwnerInfo.image[myimageindex] !=
                                                  "" &&
                                                item.tokenOwnerInfo.image[myimageindex] !=
                                                  undefined &&
                                                item.tokenOwnerInfo.image[myimageindex] !=
                                                  null
                                                  ? `${config.Back_URL}profile/${item.tokenOwnerInfo.image[myimageindex]}`
                                                  : require("../assets/images/profile_placeholder.png")
                                              }
                                              alt="Owner"
                                            />
                                            {item &&
                                              item.tokenOwnerInfo &&
                                              item.tokenOwnerInfo
                                                .emailverified &&
                                              item.tokenOwnerInfo
                                                .emailverified[myimageindex] && (
                                                <i className="fa fa-check"></i>
                                              )}
                                          </div>
                                          <div class="p_list_info">
                                            <span>
                                              <b>
                                                <span>
                                                  {item.tokenOwnerInfo &&
                                                  item.tokenOwnerInfo.name &&
                                                  item.tokenOwnerInfo.name
                                                    .length > 0 &&
                                                  item.tokenOwnerInfo.name[myimageindex] !=
                                                    "" &&
                                                  item.tokenOwnerInfo.name[myimageindex] !=
                                                    undefined &&
                                                  item.tokenOwnerInfo.name[myimageindex] !=
                                                    null
                                                    ? item.tokenOwnerInfo.name[
                                                        myimageindex
                                                      ]
                                                    : itemCur.tokenOwner}
                                                </span>
                                              </b>
                                              <div className="mar_clas_ssss p-0">
                                                {itemCur.price > 0 && (
                                                  <p>
                                                    {itemCur.balance}/
                                                    {itemCur.quantity} on sale
                                                    for {convert(itemCur.price)}{" "}
                                                    {config.symbol}{" "}
                                                    {itemCur.quantity > 0 &&
                                                      "each"}
                                                  </p>
                                                )}
                                              </div>
                                              <div className="mar_clas_ssss p-0">
                                                {itemCur.price <= 0 && (
                                                  <p>
                                                    {itemCur.balance}/
                                                    {itemCur.quantity} Not for
                                                    sale
                                                  </p>
                                                )}
                                              </div>
                                              <div class="ml-0 mt-3 ml-cus">
                                                {itemCur.price > 0 &&
                                                  itemCur.balance > 0 &&
                                                  itemCur.tokenOwner !=
                                                    UserAccountAddr && (
                                                    <button
                                                      class="btn-main lead mar-right-15"
                                                      onClick={() =>
                                                        PurchaseNowForwardRef.current.PurchaseNow_Click(
                                                          item,
                                                          itemCur
                                                        )
                                                      }
                                                    >
                                                      Buy now
                                                    </button>
                                                  )}
                                                {itemCur.price <= 0 &&
                                                itemCur.balance > 0 &&
                                                itemCur.tokenOwner ==
                                                  UserAccountAddr &&
                                                item.type == 721 ? (
                                                  <button
                                                    class="btn-main lead mar-right-15"
                                                    onClick={() =>
                                                      popupshow(
                                                        item,
                                                        MyTokenDetail
                                                      )
                                                    }
                                                  >
                                                    Put On Sale
                                                  </button>
                                                ) : (
                                                  itemCur.price <= 0 &&
                                                  itemCur.balance > 0 &&
                                                  itemCur.tokenOwner ==
                                                    UserAccountAddr && (
                                                    <button
                                                      class="btn-main lead mar-right-15"
                                                      onClick={() =>
                                                        PutOnSaleForwardRef.current.PutOnSale_Click(
                                                          item,
                                                          MyTokenDetail
                                                        )
                                                      }
                                                    >
                                                      Put On Sale
                                                    </button>
                                                  )
                                                )}

                                                {itemCur.price > 0 &&
                                                  itemCur.balance > 0 &&
                                                  itemCur.tokenOwner ==
                                                    UserAccountAddr && (
                                                    <button
                                                      class="btn-main lead mar-right-15"
                                                      onClick={() =>
                                                        PutOnSaleForwardRef.current.PutOnSale_Click(
                                                          item,
                                                          MyTokenDetail
                                                        )
                                                      }
                                                    >
                                                      Change Price
                                                    </button>
                                                  )}
                                                  {itemCur.price > 0 &&
                                                  itemCur.balance > 0 &&
                                                  itemCur.tokenOwner ==
                                                  UserAccountAddr && (
                                                    <button
                                                        className="btn-main lead mar-right-15"
                                                        onClick={() =>
                                                          CancelOrderForwardRef.current.CancelOrder_Click(
                                                            item,
                                                            BuyOwnerDetailFirst
                                                          )
                                                        }
                                                      >
                                                        Cancel order
                                                    </button>
                                                  )}

                                              </div>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                              
                                
                                  </li>
                                );
                              })}
                          </ul>
                          {/* <div className="p_list">
                                            <div className="p_list_pp">
                                                <a href="dark-author.html">
                                                    <img className="lazy" src={require("../assets/images/author/author-2.jpg")} alt="" />
                                                    <i className="fa fa-check"></i>
                                                </a>
                                            </div>                                    
                                            <div className="p_list_info">
                                                Bid <b>0.005 ETH</b>
                                                <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                                            </div>
                                        </div> */}
                        </div>

                        <div
                          class="tab-pane fade"
                          id="nav-history"
                          role="tabpanel"
                          aria-labelledby="nav-history-tab"
                        >
                          {ActivityList.map((item) => {
                            {console.log(item,'item--item--item');}
                            var imageUrl =
                              item && item.actiontype != "purchase" && item.actiontype!="acceptBid" && item.actiontype!="transfer" &&
                              item.userdetail &&
                              item.userdetail.image &&
                              item.userdetail.image != ""
                                ? config.Back_URL +
                                  "profile/" +
                                  item.userdetail.image
                                :item && ( item.actiontype == "purchase" || item.actiontype == "acceptBid" || item.actiontype == "transfer") &&
                                item.touserdetails &&
                                item.touserdetails.image &&
                                item.touserdetails.image != "" ? config.Back_URL +
                                  "profile/" +
                                  item.touserdetails.image : config.Back_URL + "images/previewThumb.png";
                            var text = "";
                            var name = "";
                            try {
                              var UserAccountAddr =
                                localStorage.getItem("nilwireMetamask");
                            } catch (err) {
                              var UserAccountAddr = "";
                            }
                            if ( item.actiontype == "Creation" ){
                              text =
                                "Created " +
                                " " +
                                " by " +
                                halfAddrShow( 
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              name = item.name ? item.name : "";
                            }else if ( item.actiontype == "Cancel Order" ){
                              text =
                                "Order Cancelled " +
                                " " +
                                " by " +
                                halfAddrShow( 
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              name = item.name ? item.name : "";
                            }else if (item.actiontype == "following") {
                              var followTxt = halfAddrShow(item.touseraddress);
                              if (item.touseraddress == UserAccountAddr) {
                                followTxt = "You ";
                              }
                              text =
                                "Started following " +
                                halfAddrShow(item.touseraddress);
                              name =
                                item.userdetail && item.userdetail.name != ""
                                  ? item.userdetail.name
                                  : halfAddrShow(item.userdetail.curraddress);
                            }else if (item.actiontype == "pricechange") {
                              text =
                                "Token Price Changed for " +
                                convertStr(item.price) +
                                " " +
                                item.currency +
                                " by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              name = item.name ? item.name : "";
                            }else if (item.actiontype == "listings") {
                              if (
                                (item &&
                                  item.tokenuser &&
                                  item.tokenuser.PutOnSaleType) == "FixedPrice"
                              ) {
                                text =
                                  "Listed for " +
                                  item.price +
                                  " " +
                                  item.currency +
                                  " by " +
                                  halfAddrShow(
                                    item &&
                                      item.userdetail &&
                                      item.userdetail.curraddress
                                  )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              } else if (
                                (item &&
                                  item.tokenuser &&
                                  item.tokenuser.PutOnSaleType) ==
                                "TimedAuction"
                              ) {
                                text =
                                  "Listed for " +
                                  item.price +
                                  " " +
                                  item.currency +
                                  " by " +
                                  halfAddrShow(
                                    item &&
                                      item.userdetail &&
                                      item.userdetail.curraddress
                                  )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              } else {
                                text =
                                  "Listed " +
                                  "by " +
                                  " " +
                                  halfAddrShow(
                                    item &&
                                      item.userdetail &&
                                      item.userdetail.curraddress
                                  )+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              }
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "editbid") {
                              text =
                                "Edit bid for " +
                                convertStr(item.price) +
                                " " +
                                item.currency +
                                " by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "bidrequest") {
                              text =
                                "Place bid " +
                                convertStr(item.price) +
                                " WETH  by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "transfer") {
                              text =halfAddrShow(item && item.useraddress)+
                                " Transferred to " +
                                halfAddrShow(item && item.touseraddress)+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "acceptBid") {
                              text =
                                "Accept Bid for " +
                                item.price +
                                " "+"WETH to " +
                                halfAddrShow(item && item.useraddress)+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "purchase") {
                              text =
                                "Purchased for " +
                                item.price +
                                " " +
                                item.currency +
                                " by " +
                                halfAddrShow(item && item.touseraddress)+" on "+moment(item.timestamp).format(
                                        "MMMM Do YYYY, h:mm a")
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "burn") {
                              text =
                                "Burn by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "like") {
                              text =
                                "liked by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "unlike") {
                              text =
                                "Unliked by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "reporting") {
                              text =
                                "Reporting by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "sharing") {
                              text =
                                "Shared by " +
                                halfAddrShow(
                                  item &&
                                    item.userdetail &&
                                    item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "burn") {
                              text =
                                "Burn by " +
                                halfAddrShow(
                                  item && item.userdetail.curraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            } else if (item.actiontype == "sales") {
                              text =
                                "Sale by " +
                                halfAddrShow(
                                  item && item.useraddress
                                )+" on "+moment(item.timestamp).format(
                                  "MMMM Do YYYY, h:mm a");
                              name = item.name ? item.name : "";
                            }
                            var linkUrl = "/info/" + item.tokenCounts;
                            if (item.itemtype == "users") {
                              linkUrl =
                                "/user/" + halfAddrShow(item.useraddress);
                            }
                            if (name.length > 15) {
                              name = name.substring(0, 18) + "...";
                            }
                            return (
                              <div className="p_list">
                                <div className="p_list_pp author_list_pp">
                                    <img
                                      className="lazy"
                                      src={imageUrl}
                                      alt=""
                                    />
                                    {item &&
                                      item.userdetail &&
                                      item.userdetail.emailverified && (
                                        <i className="fa fa-check"></i>
                                      )}
                                </div>
                                <div className="p_list_info">
                                  {text}
                                  {/* <b>0.005 ETH</b> */}
                                  {/* <span>by <b>{name}</b> </span> */}
                                </div>
                              </div>
                            );
                          })}
                          {/* 
                                        <div className="p_list">
                                            <div className="p_list_pp">
                                                <a href="dark-author.html">
                                                    <img className="lazy" src={require("../assets/images/author/author-1.jpg")} alt="" />
                                                    <i className="fa fa-check"></i>
                                                </a>
                                            </div>                                    
                                            <div className="p_list_info">
                                                Bid accepted <b>0.005 ETH</b>
                                                <span>by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM</span>
                                            </div>
                                        </div>*/}
                        </div>
                      </div>
                      <ul className="activity-list itemDetailsList">
                        {tokenCounts_Detail.TotalQuantity > MyTokenBalance ||
                        (Bids &&
                          Bids.highestBid &&
                          Bids.highestBid.tokenBidAmt) ? (
                          <li>
                            <div className="p_list">
                              {Bids.highestBid &&
                              Bids.highestBid.tokenBidAmt > 0 ? (
                                <>
                                  <div className="p_list_pp">
                                    {/* <a href="dark-author.html"> */}
                                      <img style={{height:'100%'}}
                                        className="lazy"
                                        src={
                                          Bids.highestBid &&
                                          Bids.highestBid.bidDetails &&
                                          Bids.highestBid.bidDetails.image !=
                                            undefined &&
                                          Bids.highestBid.bidDetails.image != ""
                                            ? `${config.Back_URL}profile/${Bids.highestBid.bidDetails.image}`
                                            : require("../assets/images/profile_placeholder.png")
                                        }
                                        alt=""
                                      />

                                      {/* <img className="lazy" src={require("../assets/images/author/author-4.jpg")} alt="" /> */}
                                      {Bids.highestBid &&
                                        Bids.highestBid.bidDetails &&
                                        Bids.highestBid.bidDetails
                                          .emailverified && (
                                          <i className="fa fa-check"></i>
                                        )}
                                    {/* </a> */}
                                  </div>
                                  <div className="p_list_info">
                                    Highest Bid{" "}
                                    <b>
                                      {convertStr(Bids.highestBid.tokenBidAmt)}{" "}
                                      {config.tokenSymbol}
                                      {" for "}{Bids && Bids.highestBid && Bids.highestBid.pending? Bids.highestBid.pending+" Qty" : "1 Qty"}
                                    </b>
                                    <span>
                                      by{" "}
                                      <b>
                                        {Bids.highestBid.bidBy &&
                                        Bids.highestBid.bidBy.name
                                          ? Bids.highestBid.bidBy.name
                                          : halfAddrShow(
                                              Bids.highestBid.tokenBidAddress
                                            )}
                                      </b>{" "}
                                      at{" "}
                                      {moment(Bids.highestBid.timestamp).format(
                                        "MMMM Do YYYY, h:mm a"
                                      )}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <p className="mt-0 media_text_big_1 text-center">
                                  No active bids yet... Be the first to make a
                                  bid!
                                </p>
                              )}
                            </div>

                            <div className="mt-3 infoGroupButton">
                              {/* {
                                    BuyOwnerDetailFirst && BuyOwnerDetailFirst.tokenOwner
                                    ?
                                    <>
                                      <button className="btn-main lead mar-right-15" data-toggle="modal" onClick= { () =>PurchaseNowForwardRef.current.PurchaseNow_Click(item, BuyOwnerDetailFirst)}>Buy now</button>
                                      {  MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.price == 0 &&

                                      <button className="btn-main lead mar-right-15" data-toggle="modal" onClick= { () =>PurchaseNowForwardRef.current.PurchaseNow_Click(item, BuyOwnerDetailFirst)}>Buy now</button>
                                      }
                                      {MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.price > 0 &&
                                          <>
                                              <button className="btn-main lead mar-right-15" data-toggle="modal" onClick= { () =>PutOnSaleForwardRef.current.PutOnSale_Click(item, BuyOwnerDetailFirst)} >Change Price</button>
                                              <button className="btn-main lead mar-right-15" data-toggle="modal" onClick= { () =>CancelOrderForwardRef.current.CancelOrder_Click(item, BuyOwnerDetailFirst)} >Cancel Order</button>
                                          </>
                                          }
                                    </>
                                    :
                                     MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.price > 0 ?
                                     <>
                                     <button className="btn-main lead mar-right-15" onClick= { () =>PutOnSaleForwardRef.current.PutOnSale_Click(item, BuyOwnerDetailFirst)} >Change Price</button>
                                         <button className="btn-main lead mar-right-15" onClick= { () =>CancelOrderForwardRef.current.CancelOrder_Click(item, BuyOwnerDetailFirst)} >Cancel order</button>
                                     </>
                                    :
                                      MyTokenDetail && MyTokenDetail.balance > 0 && MyTokenDetail.price == 0 &&
                                       <button className="btn-main lead mar-right-15" onClick= { () =>PutOnSaleForwardRef.current.PutOnSale_Click(item, BuyOwnerDetailFirst)} >Change price</button>
                                    } */}

                              {BuyOwnerDetailFirst &&
                              BuyOwnerDetailFirst.tokenOwner && BuyOwnerDetailFirst.price && parseFloat(BuyOwnerDetailFirst.price)>0 ? (
                                <button
                                  className="btn-main lead mar-right-15"
                                  data-toggle="modal"
                                  onClick={() =>
                                    PurchaseNowForwardRef.current.PurchaseNow_Click(
                                      item,
                                      BuyOwnerDetailFirst
                                    )
                                  }
                                >
                                  Buy now
                                </button>
                                ) : MyTokenDetail &&
                                MyTokenDetail.balance > 0 &&
                                MyTokenDetail.price > 0 ? (
                                <>
                                  <button
                                    className="btn-main lead mar-right-15"
                                    onClick={() =>
                                      PutOnSaleForwardRef.current.PutOnSale_Click(
                                        item,
                                        BuyOwnerDetailFirst
                                      )
                                    }
                                  >
                                    Change Price
                                  </button>
                                  <button
                                    className="btn-main lead mar-right-15"
                                    onClick={() =>
                                      CancelOrderForwardRef.current.CancelOrder_Click(
                                        item,
                                        BuyOwnerDetailFirst
                                      )
                                    }
                                  >
                                    Cancel order
                                  </button>
                                </>
                                ) : MyTokenDetail &&
                                MyTokenDetail.balance > 0 &&
                                MyTokenDetail.price == 0 &&
                                item.type == 721 ? (
                                <button
                                  className="btn-main lead mar-right-15"
                                  onClick={() =>
                                    popupshow(item, BuyOwnerDetailFirst)
                                  }
                                >
                                  Put On Sale
                                </button>
                                ) : MyTokenDetail &&
                                MyTokenDetail.balance > 0 &&
                                MyTokenDetail.price == 0 && (
                                <button
                                  className="btn-main lead mar-right-15"
                                  onClick={() =>
                                    PutOnSaleForwardRef.current.PutOnSale_Click(
                                      item,
                                      BuyOwnerDetailFirst
                                    )
                                  }
                                >
                                  Put On Sale
                                </button>
                              )} 
                             

                              {BuyOwnerDetailFirst &&
                              BuyOwnerDetailFirst.tokenOwner &&
                              Bids &&
                              Bids.myBid &&
                              Bids.myBid.status &&
                              Bids.myBid.status == "pending" && display_item<=0 ? (
                                <button
                                  className="btn-main lead"
                                  data-toggle="modal"
                                  type="submit"
                                  onClick={() =>
                                    PlaceABidForwardRef.current.PlaceABid_Click(
                                      item,
                                      MyTokenDetail
                                    )
                                  }
                                >
                                  Edit Bid
                                </button>
                              ) : BuyOwnerDetailFirst &&
                                BuyOwnerDetailFirst.tokenOwner &&
                                Bids &&
                                Bids.myBid &&
                                Bids.myBid.status &&
                                Bids.myBid.status == "partiallyCompleted" && display_item<=0  ? (
                                <button
                                  className="btn-main lead"
                                  data-toggle="modal"
                                  onClick={() =>
                                    PlaceABidForwardRef.current.CancelBid_Select(
                                      Bids.myBid
                                    )
                                  }
                                >
                                  Cancel a bid
                                </button>
                              ) : (
                                BuyOwnerDetailFirst && showlist == "true" &&
                                BuyOwnerDetailFirst.tokenOwner && display_item<=0  && (
                                  <button
                                    className="btn-main lead"
                                    data-toggle="modal"
                                    onClick={() =>
                                      PlaceABidForwardRef.current.PlaceABid_Click(
                                        item,
                                        MyTokenDetail
                                      )
                                    }
                                  >
                                    Place a bid
                                  </button>
                                )
                              )}

                              {/* {
                                    Bids && showlist == "true" &&
                                    && Bids.myBid
                                    && !Bids.myBid.status
                                    ?
                                    <>
                                    { 
                                    <button className="btn-main lead" data-toggle="modal" type="submit" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click(item,MyTokenDetail)}>Bid</button>
                                    }
                                    </>
                                    :
                                    Bids && showlist == "true" 
                                    && Bids.myBid
                                    && Bids.myBid.status
                                    && Bids.myBid.status == 'pending' ?
                                    <button className="btn-main lead" data-toggle="modal" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click(item,MyTokenDetail)}>Edit Bid</button>
                                    :
                                    Bids && showlist == "true" &&
                                    && Bids.myBid
                                    && Bids.myBid.status
                                    && Bids.myBid.status == 'partiallyCompleted' &&
                                    <button className="btn-main lead" data-toggle="modal" onClick={() => PlaceABidForwardRef.current.CancelBid_Select(Bids.myBid)}>Cancel a bid</button>
                                  } */}
                            </div>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>}
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
      {/* )} */}
    </div>
  );
}
