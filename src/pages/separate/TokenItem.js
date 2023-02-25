import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import Countdown from "react-countdown";
import { toastAlert } from "../../actions/toastAlert";
import config from "../../lib/config";
import isEmpty from "../../lib/isEmpty";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { getCurAddr, getprofilerawdetail } from "../../actions/v1/user";

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
} from "../../actions/v1/token";
const moment = require("moment");
const IPFS_IMGurl = config.IPFS_IMG;
const currentDate = new Date();
const year =
  currentDate.getMonth() === 11 && currentDate.getDate() > 23
    ? currentDate.getFullYear() + 1
    : currentDate.getFullYear();

export default function TokenItem(props) {
  const [usd, setusd] = useState(0);
  const [block, setblock] = useState(1);

  useEffect(() => {
    getInit();
  }, []);

  async function getInit() {}

  async function showAllwithPro(data) {
    var curAddr = await getCurAddr();
    var payload = {
      curAddr: curAddr,
      tokenCounts: data.tokenCounts,
    };
    TokenCounts_Get_Detail_Call(payload);
  }
  const TokenCounts_Get_Detail_Call = async (payload) => {
    var curAddr = await getCurAddr();
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
            element.tokenPrice > 0 &&
            element.tokenOwner != curAddr
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
      var IndexVal = -1;
      if (TokenResp.Token[0].tokenowners_all && curAddr) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(
          (val) => val.tokenOwner.toString() == curAddr.toString()
        );
      }
      var newMyTokenBalance = 0;
      if (IndexVal > -1) {
        newMyTokenBalance = tokenowners_all[IndexVal].balance;
        Set_TokenBalance(newMyTokenBalance);
        Set_MyTokenDetail(tokenowners_all[IndexVal]);
      } else {
        newMyTokenBalance = 0;
        Set_TokenBalance(0);
        Set_MyTokenDetail({});
      }
      if (TokenResp.TotalQuantity) {
        Set_AllowedQuantity(
          parseInt(TokenResp.TotalQuantity) - parseInt(newMyTokenBalance)
        );
      } else {
        Set_AllowedQuantity(0);
      }
      if (TokenResp.Token && TokenResp.Token[0]) {
        Set_item(TokenResp.Token[0]);
      }
    }
  };
  async function buyToken() {}
  var {
    item,
    LikedTokenList,
    hitLike,
    UserAccountAddr,
    UserAccountBal,
    PutOnSale_Click,
    PlaceABid_Click,
    PurchaseNow_Click,
    Burn_Click,
    Transfer_Click,
    CancelOrder_Click,
    WalletConnected,
    ShareSocial_Click,
    SubmitReport_Click,
    Tattoorequest_Click,
    TokenBalance,
    Set_item,
    Set_Bids,
    Set_BuyOwnerDetailFirst,
    Set_tokenCounts_Detail,
    Set_MyTokenBalance,
    Set_TokenBalance,
    Set_MyTokenDetail,
    Set_AllowedQuantity,
    Bids,
    from,
  } = props;

  console.log(LikedTokenList,"============LikedTokenListLikedTokenListLikedTokenListLikedTokenList")

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
      return <span> {days}d {hours}h {minutes}m {seconds}s left</span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s to start
        </span>
      );
    }
  };
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
  var currDate = new Date();
  var startdate = new Date(item.clocktime);
  var enddate = new Date(item.endclocktime);
  var auction = "false";
  var finish = "";
  var enddate1 = "";
  var showlist = "true";
  var display_item = 0;
  var myqty = "";
  let mytr = "";
  if (item && item.tokenowners_all && item.tokenowners_all.length > 0) {
    var tokenallowner = item.tokenowners_all;
    let myitem = tokenallowner.findIndex(
      (indexitem) => indexitem.tokenOwner == UserAccountAddr
    );
    myqty = item.tokenowners_all[myitem];
  }
  if (item.type == 721 && item.PutOnSaleType == "TimedAuction") {
    auction = "true";
    var a = moment(item.clocktime);
    var b = moment(item.endclocktime);
    var c = moment();
    a.diff(b); // 86400000
    var diffInMs = a.diff(c);
    finish = b.diff(c);
    console.log(finish,'FFFFF')
    enddate1 = parseFloat(diffInMs);
    display_item = a.diff(c);
    // if(currDate<startdate){
    //   var auctionTxt = "Start";
    // }else
    if (finish > 0) {
      showlist = "true";
    } else {
      var auctionTxt = "Ended";
      showlist = "false";
    }
  }
  if (
    item &&
    item.Tattoorequest &&
    item.Tattoorequest.length > 0 &&
    UserAccountAddr &&
    UserAccountAddr != null &&
    UserAccountAddr != undefined &&
    UserAccountAddr != ""
  ) {
    mytr = item.Tattoorequest.filter((x) => x.useraddress == UserAccountAddr);
  }

  async function selectoption(s_item, s_owner) {
    props.Set_item(s_item);
    props.set_selectown(s_owner);
    props.popupshow();
  }

  async function checkwall() {
    if (localStorage.getItem("tksmudisgjeush")) {
    } else {
      toastAlert("error", "Connect Wallet to Move Further", "error");
    }
  }

  console.log(item,"=============================itemitemitemitemitemitemitemitemitem")

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

  return (item &&
    item.tokenowners_current &&
    from != item.tokenCounts && 
    props.aucttype &&
    props.aucttype == "yes" &&
    ((item.PutOnSaleType == "TimedAuction" &&
      showlist == "true" &&
      display_item <= 0 ) || 
      (item &&
        item.PutOnSaleType == "TimedAuction" &&
        showlist == "true" &&
        display_item > 0 ) || 
      (showlist == "false" && auction == "true"))) 
      || (props.aucttype && props.aucttype == "no") 

      ? (
    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 d-flex">
      {/* {1659351150 == item.tokenCounts &&
       console.log(auction,'auth',showlist,props.aucttype,display_item,item.PutOnSaleType,item.tokenowners_current,from)} */}
      <div className="nft__item style-2 flex-fill">
        
        <div className="authorLikeTop">
        <div className="author_list_pp">
          {item.tokenOwnerInfo &&
          item.tokenOwnerInfo.curraddress &&
          item.tokenOwnerInfo.image ? (
            <a
              href={`${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`}
            >
              <img
                className="lazy"
                src={`${config.Back_URL}profile/${item.tokenOwnerInfo.image}`}
                alt=""
              />
              {item.tokenOwnerInfo.isverified && (
                <i className="fa fa-check"></i>
              )}
            </a>
          ) : (
            <a
              href={`${config.Front_URL}/user/${item.tokenOwnerInfo.curraddress}`}
            >
              <img
                className="lazy"
                src={`${config.Back_URL}images/previewThumb.png`}
                alt=""
              />
              {item.tokenOwnerInfo.isverified && (
                <i className="fa fa-check"></i>
              )}
            </a>
          )}
        </div>
        <div className="nft__item_like">
              {/* <i className="fa fa-heart"></i><span>{0}</span> */}
              {LikedTokenList.findIndex(
                (list) => list.tokenCounts === item.tokenCounts
              ) > -1 ? (
                <i
                  className="fa fa-heart liked"
                  onClick={() => hitLike(item)}
                  style={{ cursor: "pointer" }}
                ></i>
              ) : (
                <i
                  className="far fa-heart "
                  onClick={() => hitLike(item)}
                  style={{ cursor: "pointer" }}
                ></i>
              )}
              <span class={item.tokenCounts + "-likecount mr-2"}>
                {item.likecount}
              </span>
            </div>
            </div>
        <div className="nft__item_wrap">
        {item.PutOnSaleType == "TimedAuction" &&
          display_item <= 0 && (
            <div className="de_countdown">
              <Countdown
                date={enddate}
                autoStart={true}
                onStart={() => startdate}
                renderer={renderer}
              />
            </div>
          )}
        {item.PutOnSaleType == "TimedAuction" &&
          display_item > 0 && (
            <div className="de_countdown">
              <Countdown
                date={startdate}
                autoStart={true}
                onStart={() => Date.now()}
                renderer={renderer1}
              />
            </div>
          )}
          <a href={`${config.Front_URL}/item-details/${item.tokenCounts}`}>
            {item.image.split(".").pop() == "mp4" ? (
              <video
                src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}
                type="video/mp4"
                alt="Collections"
                className="lazy nft__item_preview nft__item_preview_video"
                controls
                controlsList="nodownload"
              />
            ) : item.image.split(".").pop() == "mp3" || item.image.split(".").pop() == "wav" ? (
              <>
                <img
                  src={`${config.Back_URL}/images/music.png`}
                  alt=""
                  className="lazy nft__item_preview"
                />
              </>
            ) : (
              <img
                src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}
                alt="Collections"
                className="lazy nft__item_preview"
              />
            )}
          </a>
        </div>
        {(item && item.image && item.image.split('.').pop() == 'mp3') || (item.image.split(".").pop() == "wav") ?
            <audio controlsList="nodownload" src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}  type="audio/mp3"controls className="audio audio_widyth">
            </audio>:""
           }
        <div className="nft__item_info">
          <div className="flex_between_s">
            <a href={`${config.Front_URL}/item-details/${item.tokenCounts}`}>
              <div>
                <h4>{item.tokenName}</h4>
              </div>
            </a>
            <div class="dropdown" onClick={() => showAllwithPro(item)}>
              <a class=" dropdown-toggle" type="button" data-toggle="dropdown">
                <MoreHorizIcon />
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right">
                {WalletConnected == true &&
                  item.tokenowners_current &&
                  item.PutOnSaleType == "FixedPrice" &&
                  item.tokenowners_current.price > parseFloat(0) &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.tokenOwner != UserAccountAddr && (
                    <li onClick={() =>
                      PurchaseNow_Click(item, item.tokenowners_current)
                    }>
                      <a
                        href="javascript:void(0);"
                       
                      >
                        Buy now
                      </a>
                    </li>
                  )}
                {WalletConnected == true &&
                item.tokenowners_current &&
                item.tokenowners_current.tokenOwner &&
                item.tokenowners_current.balance > 0 &&
                item.tokenowners_current.tokenOwner == UserAccountAddr &&
                item.type == 721 ? (
                  <li onClick={item.tokenowners_current.price > parseFloat(0)?()=>PutOnSale_Click(item, item.tokenowners_current):() =>
                    selectoption(item, item.tokenowners_current)
                  }>
                    <a
                      href="javascript:void(0);"
                    
                    >
                      {item.tokenowners_current.price > parseFloat(0)
                        ? "Change Price"
                        : "Put on sale"}
                    </a>
                  </li>
                ) : (
                  WalletConnected == true &&
                  item.tokenowners_current &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.balance > 0 &&
                  item.tokenowners_current.tokenOwner == UserAccountAddr && (
                    <li onClick={() =>
                      PutOnSale_Click(item, item.tokenowners_current)
                    }>
                      <a
                        href="javascript:void(0);"
                    
                      >
                        {item.tokenowners_current.price > parseFloat(0)
                          ? "Change Price"
                          : "Put on sale"}
                      </a>
                    </li>
                  )
                )}
                {WalletConnected == true &&
                  item.tokenowners_current &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.balance > 0 &&
                  item.tokenowners_current.tokenOwner == UserAccountAddr && (
                    <li  onClick={() =>
                      Transfer_Click(item, item.tokenowners_current)
                    }>
                      <a
                        href="javascript:void(0);"
                       
                      >
                        Transfer
                      </a>
                    </li>
                  )}
                {WalletConnected == true &&
                  item.tokenowners_current &&
                  (item.PutOnSaleType == "FixedPrice" ||
                    item.PutOnSaleType == "TimedAuction" ||
                    item.PutOnSaleType == "UnLimitedAuction") &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.balance > 0 &&
                  item.tokenowners_current.tokenOwner == UserAccountAddr && (
                    <li onClick={() =>
                      Burn_Click(item, item.tokenowners_current)
                    }>
                      <a
                        href="javascript:void(0);"
                      
                      >
                        Burn
                      </a>
                    </li>
                  )}
                {WalletConnected == true &&
                  item.tokenowners_current &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.tokenOwner == UserAccountAddr &&
                  item.tokenowners_current.balance > 0 &&
                  item.tokenowners_current.price > 0 && (
                    <li  onClick={() =>
                      CancelOrder_Click(item, item.tokenowners_current)
                    }>
                      <a
                        href="javascript:void(0);"
                       
                      >
                        Cancel Sale Order
                      </a>
                    </li>
                  )}
                {WalletConnected == true &&
                item.tokenowners_current && showlist=="true" &&
                (item.PutOnSaleType == "FixedPrice" ||
                  (item.PutOnSaleType == "TimedAuction" &&
                    display_item <= 0) ||
                  item.PutOnSaleType == "UnLimitedAuction") &&
                item.tokenowners_current.tokenOwner &&
                item.tokenowners_current.tokenOwner != UserAccountAddr &&
                Bids &&
                Bids.myBid &&
                !Bids.myBid.status ? (
                  <li  onClick={() => PlaceABid_Click(item)}>
                    <a
                      href="javascript:void(0);"
                     
                    >
                      Place a bid
                    </a>
                  </li>
                ) : Bids &&
                  Bids.myBid &&
                  Bids.myBid.status && showlist=="true" &&
                  Bids.myBid.status == "pending" &&
                  (item.PutOnSaleType == "FixedPrice" ||
                    (item.PutOnSaleType == "TimedAuction" &&
                      display_item <= 0) ||
                    item.PutOnSaleType == "UnLimitedAuction") &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.tokenOwner != UserAccountAddr ? (
                  <li onClick={() => PlaceABid_Click(item)}>
                    <a
                      href="javascript:void(0);"
                   
                    >
                      Edit bid
                    </a>
                  </li>
                ) : (
                  <div></div>
                )}
                {/* {WalletConnected == true &&
                                  item.tokenowners_current &&
                                  item.tokenowners_current.tokenOwner &&
                                  item.tokenowners_current.tokenOwner !=
                                    UserAccountAddr && ( */}
                <li  onClick={() => ShareSocial_Click(item)}>
                  <a
                    href="javascript:void(0);"
                   
                  >
                    Share
                  </a>
                </li>
                {/* )} */}
                {/* <li><a  data-toggle="modal" data-target="#social">Share </a></li> */}
                {WalletConnected == true &&
                  item.tokenowners_current &&
                  item.tokenowners_current.tokenOwner &&
                  item.tokenowners_current.tokenOwner != UserAccountAddr && (
                    <li data-toggle="modal" data-target="#report">
                      <a >
                        Report
                      </a>
                    </li>
                  )}
              </ul>
            </div>
          </div>
          {item.PutOnSaleType == "FixedPrice" &&
          item &&
          item.tokenowners_current &&
          item.tokenowners_current.price > 0 ? (
            <div className="nft__item_price">
              {item &&
                item.tokenowners_current &&
                convert(parseFloat(item.tokenowners_current.price))}{" "}
              {item.tokenowners_current.currency}
              <span>
                {item.TabName != "" &&
                (item.TabName == "onsale" ||
                  item.TabName == "created" ||
                  item.TabName == "owned")
                  ? item.tokenowners_my_balance +
                    " of " +
                    item.tokenowners_my_quantity
                  : item.TabName != ""
                  ? item.tokenowners_all_balance + " of " + item.tokenQuantity
                  : item.tokenowners_all_balance + " of " + item.tokenQuantity}
              </span>
            </div>
          ) : item.PutOnSaleType == "FixedPrice" ? (
            <div className="nft__item_price">
              Unlisted 0.00 {item.tokenowners_current.currency}
              <span>
                {item.TabName != "" &&
                (item.TabName == "onsale" ||
                  item.TabName == "created" ||
                  item.TabName == "owned")
                  ? item.tokenowners_my_balance +
                    " of " +
                    item.tokenowners_my_quantity
                  : item.TabName != ""
                  ? item.tokenowners_all_balance + " of " + item.tokenQuantity
                  : item.tokenowners_sale_balance > 0
                  ? item.tokenowners_sale_balance + " of " + item.tokenQuantity
                  : item.tokenowners_all_balance + " of " + item.tokenQuantity}
              </span>
            </div>
          ) : (
            item.PutOnSaleType == "UnLimitedAuction" && (
              <div className="nft__item_price">
                {/*MinBid {""} {0} {config.tokenSymbol}*/}
                Not For Sale
                <span>
                  {item.TabName != "" &&
                  (item.TabName == "onsale" ||
                    item.TabName == "created" ||
                    item.TabName == "owned")
                    ? item.tokenowners_my_balance +
                      " of " +
                      item.tokenowners_my_quantity
                    : item.TabName != ""
                    ? item.tokenowners_all_balance + " of " + item.tokenQuantity
                    : item.tokenowners_sale_balance > 0
                    ? item.tokenowners_sale_balance +
                      " of " +
                      item.tokenQuantity
                    : item.tokenowners_all_balance +
                      " of " +
                      item.tokenQuantity}
                </span>
              </div>
            )
          )}
          {item.PutOnSaleType == "TimedAuction" && (
            <div className="nft__item_price">
            {convert(item.minimumBid)} {config.tokenSymbol} 
              <span>
                {item.TabName != "" &&
                (item.TabName == "onsale" ||
                  item.TabName == "created" ||
                  item.TabName == "owned")
                  ? " " +
                    item.tokenowners_my_balance +
                    "/" +
                    item.tokenowners_my_quantity
                  : item.TabName != ""
                  ? " " +
                    item.tokenowners_all_balance +
                    "/" +
                    item.tokenQuantity
                  : item.tokenowners_sale_balance > 0
                  ? " " +
                    item.tokenowners_sale_balance +
                    "/" +
                    item.tokenQuantity
                  : " " +
                    item.tokenowners_all_balance +
                    "/" +
                    item.tokenQuantity}
              </span>
            </div>
          )}
          <div className="nft-item-group">
            {WalletConnected == true &&
              item.PutOnSaleType == "FixedPrice" &&
              item.tokenowners_current.price == 0 && (
                <div className="nft__item_action">
                  <a
                    href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                    // onClick={() => PlaceABid_Click(item)}
                    // style={{cursor:'pointer'}}
                  >
                    {/* Place a bid */}
                    { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Place a bid" : "Owned"}
                  </a>
                </div>
              )}
            {item.PutOnSaleType == "FixedPrice" &&
              (item &&
                item.tokenowners_current &&
                item.tokenowners_current.price) > 0 && (
                <div className="nft__item_action">
                  <a
                    href={`${config.Front_URL}/item-details/${item.tokenCounts}`} 
                    // style={{cursor:'pointer'}}
                    // onClick={() =>
                    //   PurchaseNow_Click(item, item.tokenowners_current)
                    // }
                  >
                     { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Buy now" : "Owned"}
                  </a>
                </div>
              )}
            {item.PutOnSaleType == "TimedAuction" && (
              <div className="nft__item_action">
                
                <a
                // onClick={() => PlaceABid_Click(item)}
                // style={{cursor:'pointer'}}
                  href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                >
                   { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Place a bid" : "Owned"}
                </a>

              </div>
            )}
            {item.PutOnSaleType == "UnLimitedAuction" && (
              <div className="nft__item_action">
                <a
                  href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                  // onClick={() => PlaceABid_Click(item)}
                  // style={{cursor:'pointer'}}
                >
                  { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Open for bids" : "Owned"}
                </a>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
