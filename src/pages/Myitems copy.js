import React, { useRef, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import ProfileBackground from "../assets/images/background/5.jpg";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Countdown, { zeroPad } from "react-countdown";
import ConnectWallet from "./separate/Connect-Wallet";
import { LikeRef } from "./separate/LikeRef";
import { PlaceAndAcceptBidRef } from "./separate/PlaceAndAcceptBidRef";
import { PutOnSaleRef } from "./separate/PutOnSaleRef";
import { PutOnBid } from "./separate/PutOnBid";
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { CancelOrderRef } from "./separate/CancelOrderRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import { BurnRef } from "./separate/BurnRef";
import { TransferRef } from "./separate/TransferRef";
import axios from "axios";
import config from "../lib/config";
import Web3 from "web3";
import "@metamask/legacy-web3";
import { toast } from "react-toastify";
import $ from "jquery";
import moment from "moment";
import { getmylog } from "../helper/walletconnect";
import { Helmet } from "react-helmet";
import ReactLoading from "react-loading";
import { toastAlert } from "../actions/toastAlert";

import {
  getWallet,
  halfAddrShow,
  getCurAddr,
  FollowChange_Action,
  changeReceiptStatus_Action,
  ParamAccountAddr_Detail_Get,
  User_FollowList_Get_Action,
  User_Following_List_Action,
  User_Followers_List_Action,
  User_Follow_Get_Action,
  Activity_List_Action,
  UserProfile_Update_Action,
  imageupdate,
} from "../actions/v1/user";
import {
  CollectiblesList_MyItems,
  Bidding_Detail_Action,
  TokenCounts_Get_Detail_Action,
  ReportRequest,
  getreportcategory,
} from "../actions/v1/token";

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
  var { paramUsername, paramAddress } = useParams();
  if (typeof paramUsername == "undefined") {
    paramUsername = "";
  }
  if (typeof paramAddress == "undefined") {
    paramAddress = "";
  }

  const [ParamAccountAddr, Set_ParamAccountAddr] = useState(paramAddress);
  const [CurTabName, Set_CurTabName] = React.useState("onsale");
  const [OnSale_Count, Set_OnSale_Count] = useState(0);
  const [OnSale_List, Set_OnSale_List] = useState([]);
  const [Owned_Count, Set_Owned_Count] = useState(0);
  const [Owned_List, Set_Owned_List] = useState([]);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = useState("");
  const [UserAccountAddr, Set_UserAccountAddr] = useState("");
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [WalletConnected, Set_WalletConnected] = React.useState("false");
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState("");
  const [MyItemAccountAddr_Details, Set_MyItemAccountAddr_Details] =
    useState("");
  const [UserNotFound, Set_UserNotFound] = useState(false);
  const [MyItemcoverimage, Set_MyItemcoverimage] = useState("");
  const [ParamAccountCustomUrl, Set_ParamAccountCustomUrl] =
    useState(paramUsername);
  var imageUrl = config.Back_URL + "cover/5.jpg";
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState(imageUrl);
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
  const [LikedTokenList, setLikedTokenList] = React.useState([]);
  const [CategoryOption, setCategoryOption] = useState(0);
  const [reportCategoryname, setReportCategoryname] = useState("Select");
  const [description, setdescription] = React.useState("");
  const [is_follow, Set_is_follow] = useState("no");
  const [followingCount, Set_followingCount] = useState(0);
  const [followersCount, Set_followersCount] = useState(0);
  const [followingStatus, Set_followingStatus] = useState(true);
  const [FollowingUserList, Set_FollowingUserList] = React.useState([]);
  const [FollowerUserList, Set_FollowerUserList] = React.useState([]);
  const [followersStatus, Set_followersStatus] = useState(true);
  const [userdescription, setuserdescription] = useState("");
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [TokenFile, setTokenFile] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [selectown,set_selectown] = React.useState("");
  const [sitem,set_sitem] = React.useState("");

  useEffect(async () => {
    loadScript();
    let mydata = await getmylog();
    let web3 = new Web3(
      mydata &&
      mydata.provider &&
      mydata.provider != null &&
      mydata.provider != undefined &&
      mydata.provider != ""
        ? mydata.provider
        : window.ethereum
    );
    let curAddr = await web3.eth.getAccounts();
    setaddress(curAddr[0].toLowerCase());
  }, []);

  var LikeForwardRef = useRef();
  var PlaceABidForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const BurnForwardRef = useRef();
  var ShareForwardRef = useRef();
  var TransferForwardRef = useRef();
  const PutOnBidForwardRef = useRef();

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

  async function FollowChange_Call() {
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
    var Payload = {};
    Payload.currAddr = currAddr;
    Payload.ParamAccountAddr = ParamAccountAddr;

    var msg = "I would like to follow user: " + ParamAccountAddr;
    if (is_follow == "yes") {
      msg = "I would like to stop following user: " + ParamAccountAddr;
    }

    await web3.eth.personal.sign(msg, currAddr);
    var Resp = await FollowChange_Action(Payload);

    var foll =
      Resp && Resp.data && Resp.data.ChangeType ? Resp.data.ChangeType : "no";
    Set_is_follow(foll);

    if (foll == "yes") {
      toast.success("Follow successfully", toasterOption);
    } else {
      toast.success("Un-Follow successfully", toasterOption);
    }
    Check_follow();
    if (CurTabName == "followers") {
      Get_Followers_List();
    } else if (CurTabName == "following") {
      Get_Following_List();
    }

    //User_FollowList_Get_Call();
  }

  async function Get_Followers_List() {
    Set_CurTabName("followers");
    var currAddr = await getCurAddr();
    var resp = await User_Followers_List_Action({
      addr: MyItemAccountAddr,
      loginUser: currAddr,
    });

    if (resp && resp.data && resp.data.list) {
      var MyFollowingList = resp.data.list;
      Set_FollowerUserList(MyFollowingList);
    } else {
      Set_FollowerUserList([]);
    }
  }

  async function FollowerTab(address, pos, isFollow) {
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
    var currAddr = curAddr && curAddr[0].toLowerCase();
    var currentUser = "no";
    if (
      (ParamAccountAddr != "" &&
        currAddr != "" &&
        currAddr == ParamAccountAddr) ||
      ParamAccountAddr == "" ||
      !ParamAccountAddr
    ) {
      currentUser = "yes";
    }
    var msg = "I would like to follow user: " + address;
    if (isFollow == "yes") {
      msg = "I would like to stop following user: " + address;
    }

    var Payload = {};
    Payload.currAddr = currAddr;
    Payload.ParamAccountAddr = address;
    Payload.currentUser = currentUser;
    await web3.eth.personal.sign(msg, currAddr);
    var Resp = await FollowChange_Action(Payload);

    var foll =
      Resp && Resp.data && Resp.data.ChangeType ? Resp.data.ChangeType : "no";
    FollowerUserList[pos].isFollow = foll;
    Set_followersStatus(false);
    Set_FollowerUserList(FollowerUserList);
    Set_followersStatus(true);

    if (currentUser == "yes") {
      var followingcnt =
        Resp && Resp.data && Resp.data.following ? Resp.data.following : "0";
      var followerscnt =
        Resp && Resp.data && Resp.data.followers ? Resp.data.followers : "0";
      Set_followingCount(followingcnt);
      Set_followersCount(followerscnt);
    }
    if (foll == "yes") {
      toast.success("Follow successfully", toasterOption);
    } else {
      toast.success("Un-Follow successfully", toasterOption);
    }
    Check_follow();
  }

  async function Get_Following_List() {
    Set_CurTabName("following");
    var currAddr = await getCurAddr();
    var resp = await User_Following_List_Action({
      addr: MyItemAccountAddr,
      loginUser: currAddr,
    });

    if (resp && resp.data && resp.data.list) {
      var MyFollowingList = resp.data.list;
      Set_FollowingUserList(MyFollowingList);
    } else {
      Set_FollowingUserList([]);
    }
  }

  async function CorrectDataGet(Resp, Target) {
    var RetData = { count: 0, list: [] };
    if (
      Resp &&
      Resp.data &&
      Resp.data.Target &&
      Resp.data.list &&
      Resp.data.list[0]
    ) {
      if (Resp.data.Target == "Count" && Resp.data.list[0].count) {
        RetData.count = Resp.data.list[0].count;
      } else if (Resp.data.Target == "List" && Resp.data.list[0]) {
        RetData.list = Resp.data.list;
      }
    }
    if (Resp && Resp.data && Resp.data.Target && Resp.data.changeStatusList) {
      changeReceiptStatus_Call(Resp.data.changeStatusList);
    }
    return RetData;
  }
  async function showAllwithPro(data) {
    var curAddr = await getCurAddr();
    var payload = {
      curAddr: curAddr,
      tokenCounts: data.tokenCounts,
    };
    console.log(payload,'{{{}}}');
    TokenCounts_Get_Detail_Call(payload);
  }
  const TokenCounts_Get_Detail_Call = async (payload) => {
    var curAddr = await getCurAddr();
    var Resp = await TokenCounts_Get_Detail_Action(payload);
    console.log(Resp,'Resp------');
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
      let ageSum = 0;
      var tokenowners_all = TokenResp.Token[0] && TokenResp.Token[0].tokenowners_all? tokenowners_all : "";

      if (tokenowners_all && tokenowners_all.length > 0) {
        for (let i = 0; i < tokenowners_all.length; i++) {
          if (tokenowners_all[i].balance > 0) {
            ageSum += tokenowners_all[i].balance;
          }
        }
      }
      var IndexVal = -1;
      if (TokenResp.Token[0] &&  TokenResp.Token[0].tokenowners_all && curAddr) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(
          (val) => val.tokenOwner.toString() == curAddr.toString()
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
  async function changeReceiptStatus_Call(list) {
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
    var currAddr = curAddr && curAddr[0].toLowerCase();
    list.map(async (item) => {
      if (
        item &&
        typeof item.checkAdd != "undefined" &&
        item.checkAdd.hashValue
      ) {
        try {
          var data = await web3.eth.getTransactionReceipt(
            item.checkAdd.hashValue
          );
          var hashValue = item.checkAdd.hashValue;
          if (data == null) {
          } else {
            if (data.status == "0x0") {
            } else {
              var payload = {
                status: "true",
                hashValue: hashValue,
              };
              await changeReceiptStatus_Action(payload);
            }
          }
        } catch (err) {}
      }
    });
  }

  async function Tab_Click(TabName) {
    Set_CurTabName(TabName);
    await Tab_Data_Call("List", TabName);
    await Tab_Data_Call("Count", TabName);
  }
  async function Tab_Data_Call(Target, TabName, init = false) {
    if (MyItemAccountAddr) {
      var ReqData = {
        Addr: MyItemAccountAddr,
        MyItemAccountAddr: MyItemAccountAddr,
        ParamAccountAddr: ParamAccountAddr,
        UserAccountAddr: UserAccountAddr,
        Target: Target,
        TabName: TabName,
        init: init,
        from: "My-Items",
      };
      var Resp = {};
      Resp = await CollectiblesList_MyItems(ReqData);
      var RespNew = await CorrectDataGet(Resp);
      if (
        (Target == "Count" && typeof RespNew.count != "undefined") ||
        (Target == "List" && RespNew.list)
      ) {
        if (TabName == "onsale") {
          if (Target == "Count") {
            Set_OnSale_Count(RespNew.count);
          }
          if (Target == "List") {
            Set_OnSale_List(RespNew.list);
          }
        } else if (TabName == "owned") {
          if (Target == "Count") {
            Set_Owned_Count(RespNew.count);
          }
          if (Target == "List") {
            Set_Owned_List(RespNew.list);
          }
        }
      }
    }
    return true;
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
  const inputChangeuser = (e) => {
    if (e && e.target && typeof e.target.value != "undefined") {
      var value = e.target.value;
      setuserdescription(value);
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
    var currAddr = await getCurAddr();
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
  const AfterWalletConnected = async () => {
    ReportdetList();
    var currAddr = await getCurAddr();
    if (typeof currAddr != "undefined") {
      Set_Loaderstatus(true);
      if (ParamAccountAddr || ParamAccountCustomUrl) {
        if (
          ParamAccountAddr &&
          ParamAccountAddr.toString() === currAddr.toString()
        ) {
          Set_MyItemAccountAddr(ParamAccountAddr);
          Get_MyItemAccountAddr_Details({ addr: currAddr });
        } else {
          var payload = {};
          if (ParamAccountAddr) {
            payload.addr = ParamAccountAddr;
          } else if (ParamAccountCustomUrl) {
            payload.customurl = ParamAccountCustomUrl;
          }
          await Get_MyItemAccountAddr_Details(payload);
        }
      } else {
        Set_MyItemAccountAddr(currAddr);
        Get_MyItemAccountAddr_Details({ addr: currAddr });
      }
      Check_follow();
      window.$("#AfterWalletConnected_two").click();
      try {
        LikeForwardRef &&
          LikeForwardRef.current &&
          LikeForwardRef.current.getLikesData();
      } catch (err) {}
    }
  };

  const selectFileChange = async (e) => {
    if (e.target && e.target.files) {
      var reader = new FileReader();
      var file = e.target.files[0];
      var fileName = file.name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 30) {
        toast.error("File size exceeds 30 MB", toasterOption);
        $("input[name='image']").val("");
        return false;
      } else {
        setTokenFile(file);
        var url = reader.readAsDataURL(file);
        reader.onloadend = async function (e) {
          if (reader.result) {
            //setTokenFilePreReader(reader.result);
          }
        }.bind(this);
        var currAddr = "";
        currAddr = await getCurAddr();
        var formData = new FormData();
        if (file) {
          formData.append("CoverImage", file);
        }
        formData.append("addr", currAddr);
        var Resp = await imageupdate(formData);
        if (Resp && Resp.data && Resp.data.data) {
          toastAlert("success", "Cover Updated Successfully", "success");

          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        }
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
    // alert("ddd");
    setReportCategoryname(name);
  }

  async function FollowingTab(address, pos, isFollow) {
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
    var currAddr = curAddr && curAddr[0].toLowerCase();
    var Payload = {};
    Payload.currAddr = currAddr;
    Payload.ParamAccountAddr = address;

    var msg = "I would like to follow user: " + address;
    if (isFollow == "yes") {
      msg = "I would like to stop following user: " + address;
    }

    await web3.eth.personal.sign(msg, currAddr);
    var Resp = await FollowChange_Action(Payload);
    var foll =
      Resp && Resp.data && Resp.data.ChangeType ? Resp.data.ChangeType : "no";

    if (
      (ParamAccountAddr != "" &&
        currAddr != "" &&
        currAddr == ParamAccountAddr) ||
      ParamAccountAddr == "" ||
      !ParamAccountAddr
    ) {
      //same user
      FollowingUserList.splice(pos, 1);
      Set_followingStatus(false);
      Set_FollowingUserList(FollowingUserList);
      Set_followingStatus(true);

      var followingcnt =
        Resp && Resp.data && Resp.data.following ? Resp.data.following : "0";
      var followerscnt =
        Resp && Resp.data && Resp.data.followers ? Resp.data.followers : "0";
      Set_followingCount(followingcnt);
      Set_followersCount(followerscnt);
    } else {
      //another user
      FollowingUserList[pos].isFollow = foll;
      Set_followingStatus(false);
      Set_FollowingUserList(FollowingUserList);
      Set_followingStatus(true);
    }
    if (foll == "yes") {
      toast.success("Follow successfully", toasterOption);
    } else {
      toast.success("Un-Follow successfully", toasterOption);
    }
  }

  async function hidefunction(){
    window.$('.modal').modal('hide');
    PutOnSaleForwardRef.current.PutOnSale_Click(
                      sitem,
                      selectown
                    )
  }

  async function bidpopupshow(){
    window.$('.modal').modal('hide');
    PutOnBidForwardRef.current.PutOnBid_Click(
                      sitem,
                      selectown
                    )
  }

  async function hide_function(s_item,s_detail){
    set_sitem(s_item)
    set_selectown(s_detail)
    window.$('.modal').modal('hide');
    PutOnSaleForwardRef.current.PutOnSale_Click(
                      s_item,
                      s_detail
                    )
  }

  async function bid_popupshow(s_item,s_detail){
    set_sitem(s_item)
    set_selectown(s_detail)
    window.$("#option_modal").modal("show");
  }

  async function popupshow(s_item,s_detail) {
    set_sitem(s_item)
    set_selectown(s_detail)
    window.$("#option_modal").modal("show");
  }


  async function AfterWalletConnected_two() {
    await Tab_Data_Call("Count", "onsale", true);
    await Tab_Data_Call("List", "onsale");
    await Tab_Data_Call("Count", "created");
    await Tab_Data_Call("Count", "owned");
    await Tab_Data_Call("Count", "liked");
  }

  async function Check_follow() {
    var currAddr = await getCurAddr();
    var data = {
      useraddress: currAddr,
      followaddress: paramAddress,
    };
    var resp = await User_Follow_Get_Action(data);
    var foll =
      resp && resp.data && resp.data.isFollow ? resp.data.isFollow : "no";
    var followingcnt =
      resp && resp.data && resp.data.following ? resp.data.following : "0";
    var followerscnt =
      resp && resp.data && resp.data.followers ? resp.data.followers : "0";
    Set_is_follow(foll);
    Set_followingCount(followingcnt);
    Set_followersCount(followerscnt);
  }

  const Get_MyItemAccountAddr_Details = async (payload) => {
    var Resp = await ParamAccountAddr_Detail_Get(payload);
    if (Resp.data && Resp.data.User && Resp.data.User.coverimage) {
      Set_MyItemcoverimage(Resp.data.User.coverimage);
    }

    if (Resp && Resp.data && Resp.data.User && Resp.data.User.curraddress) {
      Set_MyItemAccountAddr(Resp.data.User.curraddress);
      if (Resp.data.User) {
        console.log(Resp.data.User,'Resp.data.UserResp.data.User--');
        Set_MyItemAccountAddr_Details(Resp.data.User);
        if (
          Resp.data.User.coverimage &&
          Resp.data.User.coverimage != null &&
          Resp.data.User.coverimage != undefined &&
          Resp.data.User.coverimage != ""
        ) {
          setTokenFilePreUrl(
            config.Back_URL + "cover/" + Resp.data.User.coverimage
          );
        }
      }
    } else {
      // toast.warning("User not found", toasterOption);
      Set_UserNotFound(true);
    }
  };

  const getClickableLink = (link) => {
    return link.startsWith("http://") || link.startsWith("https://")
      ? link
      : `http://${link}`;
  };

  async function report() {
    var currAddr = await getCurAddr();
    var reqData = {
      reportuser: currAddr,
      description: userdescription,
      type: "user",
      userreport: "yes",
      spanuser: MyItemAccountAddr,
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

  async function copyToClipboard(e) {
    var textField = document.createElement("textarea");
    textField.innerText = MyItemAccountAddr;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied Successfully", toasterOption);
  }
  // Countdown Timer
  const currentDate = new Date();
  const year =
    currentDate.getMonth() === 11 && currentDate.getDate() > 23
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();

  // const renderer = ({ days, hours, minutes, seconds }) => {
  //   return (
  //     <div className="timer_panel">
  //       <span><span className="timer_time">{zeroPad(days)}</span><span className="timer_label">d</span></span>
  //       <span className="timer_dots"> </span>
  //       <span><span className="timer_time">{zeroPad(hours)}</span><span className="timer_label">h</span></span>
  //       <span className="timer_dots"> </span>
  //       <span><span className="timer_time">{zeroPad(minutes)}</span><span className="timer_label">m</span></span>
  //       <span className="timer_dots"> </span>
  //       <span><span className="timer_time">{zeroPad(seconds)}</span><span className="timer_label">s</span></span>
  //     </div>
  //   );
  // };
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
          {days}d {hours}h {minutes}m {seconds}s start
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


  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - NFT Collections</title>
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
      <BurnRef
        ref={BurnForwardRef}
        // GetUserBal={GetUserBal}
        UserAccountAddr={UserAccountAddr}
        UserAccountBal={UserAccountBal}
        TokenBalance={TokenBalance}
        Accounts={Accounts}
        item={item}
        Set_item={Set_item}
      />
      <ShareNowRef ref={ShareForwardRef} />
      <LikeRef
        ref={LikeForwardRef}
        setLikedTokenList={setLikedTokenList}
        MyItemAccountAddr={MyItemAccountAddr}
      />
      {localStorage.getItem("nilwireMetamask") ? (
        
        <div className="no-bottom no-top" id="content">
          <div
            id="AfterWalletConnected_two"
            onClick={() => AfterWalletConnected_two()}
          ></div>

                    <section
            id="profile_banner subheader padding-bottom-40"
            className="text-light"
          >
            <div className="container">
              <div className="profile-bg" style={{ backgroundImage: `url(${TokenFilePreUrl})` }}>
                
            <div class="d-create-file coverPhotoButton">
              
              <div className="uploadCustomFile">
              {MyItemAccountAddr != UserAccountAddr &&
                UserAccountAddr &&
                UserAccountAddr != "" &&
                UserAccountAddr != undefined &&
                UserAccountAddr != null ? "":
                  <div className="file_btn btn primary_btn">
                    Choose image
                    <input
                      className="inp_file"
                      type="file"
                      name="image"
                      onChange={selectFileChange}
                    />
                  </div>
              }
              </div>
            </div>
            </div>
            <span class="text-muted" style={{position:'absolute',marginTop:'8px'}}>We recommend an image of at least 1320x280 Pixels</span>

            </div>
          </section>

          <section aria-label="section" className="d_coll no-top">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile">
                    <div className="profile_avatar">
                      <div className="d_profile_img">
                        {/* <img src={require("../assets/images/author/author-1.jpg")} alt="" /> */}
                        {MyItemAccountAddr_Details &&
                        MyItemAccountAddr_Details.image &&
                        MyItemAccountAddr_Details.image != "" ? (
                          <img
                            src={
                              config.Back_URL +
                              "profile/" +
                              MyItemAccountAddr_Details.image
                            }
                            alt=""
                            className="mb-3"
                          />
                        ) : (
                          <img
                            src={require("../assets/images/profile_placeholder.png")}
                            alt=""
                            className="mb-3"
                          />
                        )}
                        {MyItemAccountAddr_Details &&
                        MyItemAccountAddr_Details.isverified &&
                        MyItemAccountAddr_Details.isverified != "" ? (
                          <i className="fa fa-check"></i>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="profile_name">
                        <h3 className="mb-1">
                          {MyItemAccountAddr_Details &&
                          MyItemAccountAddr_Details.name &&
                          MyItemAccountAddr_Details.name != ""
                            ? MyItemAccountAddr_Details.name
                            : MyItemAccountAddr}
                        </h3>
                        <h4>
                          <div className="clearfix"></div>
                          <span id="wallet" className="profile_wallet">
                            {halfAddrShow(MyItemAccountAddr)}
                          </span>
                          <button
                            type="button"
                            id="btn_copy"
                            title="Copy Text"
                            className="marrrr"
                            onClick={copyToClipboard}
                          >
                            Copy
                          </button>
                        </h4>
                        {MyItemAccountAddr != UserAccountAddr &&
                        UserAccountAddr &&
                        UserAccountAddr != "" &&
                        UserAccountAddr != undefined &&
                        UserAccountAddr != null ? (
                          <button
                            type="button"
                            className="btn-main"
                            onClick={FollowChange_Call}
                          >
                            {is_follow == "yes" ? "Un-Follow" : "Follow"}
                          </button>
                        ) : (
                          ""
                        )}
                        {MyItemAccountAddr != UserAccountAddr &&
                        UserAccountAddr &&
                        UserAccountAddr != "" &&
                        UserAccountAddr != undefined &&
                        UserAccountAddr != null ? (
                          <button
                            type="button"
                            className="btn-main ml-2"
                            data-toggle="modal"
                            data-target="#report_user"
                          >
                            Report
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="user_info">
                        <p>
                          {MyItemAccountAddr_Details &&
                            MyItemAccountAddr_Details.bio &&
                            MyItemAccountAddr_Details.bio != null &&
                            MyItemAccountAddr_Details.bio != undefined &&
                            MyItemAccountAddr_Details.bio != "" &&
                            MyItemAccountAddr_Details.bio}
                        </p>
                        <div className="btn-group collection_btn_grp mt-3">
                        <a
                              href={getClickableLink(
                                MyItemAccountAddr_Details &&
                                  MyItemAccountAddr_Details.personalsite &&
                                  MyItemAccountAddr_Details.personalsite
                              )}
                              target="_blank"
                            >
                          <button type="button" class="btn">
                           
                              <i class="bi bi-globe"></i>
                           
                          </button> </a>
                          <a
                              href={getClickableLink(
                                MyItemAccountAddr_Details &&
                                  MyItemAccountAddr_Details.twitter &&
                                  MyItemAccountAddr_Details.twitter
                              )}
                              target="_blank"
                            >
                          <button type="button" class="btn">
                           
                              <i class="bi bi-twitter"></i>
                        
                          </button>    </a>
                          <a
                              href={getClickableLink(
                                MyItemAccountAddr_Details &&
                                  MyItemAccountAddr_Details.youtube &&
                                  MyItemAccountAddr_Details.youtube
                              )}
                              target="_blank"
                            >
                          <button type="button" class="btn">
                            
                              <i class="bi bi-youtube"></i>
                           
                          </button> </a>
                          <a
                              href={getClickableLink(
                                MyItemAccountAddr_Details &&
                                  MyItemAccountAddr_Details.facebook &&
                                  MyItemAccountAddr_Details.facebook
                              )}
                              target="_blank"
                            >
                          <button type="button" class="btn">
                          
                              <i class="bi bi-facebook"></i>
                           
                          </button> </a>
                          <a
                              href={getClickableLink(
                                MyItemAccountAddr_Details &&
                                  MyItemAccountAddr_Details.instagram &&
                                  MyItemAccountAddr_Details.instagram
                              )}
                              target="_blank"
                            >
                          <button type="button" class="btn">
                            
                              <i class="bi bi-instagram"></i>
                            
                          </button></a>
                          {/* <button type="button" class="btn"><a href={getClickableLink(MyItemAccountAddr_Details && MyItemAccountAddr_Details.instagram && MyItemAccountAddr_Details.instagram)} target="_blank"><i class="bi bi-flag-fill"></i></a></button>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <nav>
                      <div
                        className="nav nav-tabs de_nav justify-content-center"
                        id="nav-tab"
                        role="tablist"
                      >
                        <a
                          className="nav-item nav-link active"
                          id="nav-onSale-tab"
                          data-toggle="tab"
                          href="#nav-onSale"
                          role="tab"
                          aria-controls="nav-onSale"
                          aria-selected="true"
                          onClick={() => Tab_Click("onsale")}
                        >
                          On sale
                        </a>
                        <a
                          className="nav-item nav-link"
                          id="nav-owned-tab"
                          data-toggle="tab"
                          href="#nav-owned"
                          role="tab"
                          aria-controls="nav-owned"
                          aria-selected="false"
                          onClick={() => Tab_Click("owned")}
                        >
                          Owned
                        </a>
                        {/* <a
                          className="nav-item nav-link"
                          id="nav-staked-tab"
                          data-toggle="tab"
                          href="#nav-staked"
                          role="tab"
                          aria-controls="nav-staked"
                          aria-selected="false"
                        >
                          Staked collection
                        </a> */}
                        <a
                          className="nav-item nav-link"
                          id="nav-Following-tab"
                          data-toggle="tab"
                          href="#nav-Following"
                          role="tab"
                          aria-controls="nav-Following"
                          aria-selected="false"
                          onClick={() => Get_Following_List()}
                        >
                          Following
                        </a>
                        <a
                          className="nav-item nav-link"
                          id="nav-Followers-tab"
                          data-toggle="tab"
                          href="#nav-Followers"
                          role="tab"
                          aria-controls="nav-Followers"
                          aria-selected="false"
                          onClick={() => Get_Followers_List()}
                        >
                          Followers
                        </a>
                      </div>
                    </nav>
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
                          {OnSale_List.map((item) => {
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
                            return (
                              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                <div className="nft__item">
                                  {item.PutOnSaleType == "TimedAuction" &&
                                    display_item <= 0 && (
                                      <div className="de_countdown">
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
                                    display_item > 0 && (
                                      <div className="de_countdown">
                                        <Countdown
                                          date={startdate}
                                          autoStart={true}
                                          onStart={() => Date.now()}
                                          renderer={renderer1}
                                        />
                                        {/* </Countdown> */}
                                        {/* <Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /> */}
                                      </div>
                                    )}
                                    <div className="authorLikeTop">
                                  <div className="author_list_pp">
                                    {item.tokenOwnerInfo &&
                                    item.tokenOwnerInfo.curraddress &&
                                    item.tokenOwnerInfo.image ? (
                                      <a href="javascript:void(0)">
                                        <img
                                          className="lazy"
                                          src={`${config.Back_URL}profile/${item.tokenOwnerInfo.image}`}
                                          alt=""
                                        />
                                      </a>
                                    ) : (
                                      <a href="javascript:void(0)">
                                        <img
                                          className="lazy"
                                          src={`${config.Back_URL}images/previewThumb.png`}
                                          alt=""
                                        />
                                      </a>
                                    )}
                                    {item.tokenOwnerInfo &&
                                    item.tokenOwnerInfo.isverified &&
                                    item.tokenOwnerInfo.isverified != "" ? (
                                      <i className="fa fa-check"></i>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="nft__item_like">
                                        {LikedTokenList.findIndex(
                                          (tokenCounts) =>
                                            tokenCounts.tokenCounts ===
                                            item.tokenCounts
                                        ) > -1 ? (
                                          <i
                                            className="fa fa-heart liked"
                                            onClick={() =>
                                              LikeForwardRef.current.hitLike(
                                                item
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        ) : (
                                          <i
                                            className="far fa-heart "
                                            onClick={() =>
                                              LikeForwardRef.current.hitLike(
                                                item
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        )}
                                        <span
                                          class={
                                            item.tokenCounts + "-likecount mr-2"
                                          }
                                        >
                                          {item.likecount}
                                        </span>
                                      </div>
                                      </div>
                                  <div className="nft__item_wrap">
                                    <a
                                      href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                    >
                                      {item.image.split(".").pop() == "mp4" ? (
                                        <video
                                          src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                                          type="video/mp4"
                                          alt="Collections"
                                          className="lazy nft__item_preview"
                                          controls
                                          controlsList="nodownload"
                                        />
                                      ) : item.image.split(".").pop() ==
                                        "mp3" || item.image.split(".").pop() == "wav" ? (
                                        <>
                                          <img
                                            src={`${config.Back_URL}images/music.png`}
                                            alt=""
                                            className="lazy nft__item_preview"
                                          />
                                        </>
                                      ) : (
                                        <img
                                          src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                                          alt="Collections"
                                          className="lazy nft__item_preview"
                                        />
                                      )}
                                      {/* <img src={require("../assets/images/items-alt/static-1.jpg")} className="lazy nft__item_preview" alt="" /> */}
                                    </a>
                                  </div>
                                  {(item && item.image && item.image.split('.').pop() == 'mp3') || (item.image.split(".").pop() == "wav") ?
                                    <audio controlsList="nodownload" src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}  type="audio/mp3"controls className="audio audio_widyth">
                                      </audio>:""
                                        }
                                  <div className="nft__item_info">
                                    <div className="flex_between_s">
                                      <a
                                        href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                      >
                                        <div>
                                          <h4>{item.tokenName}</h4>
                                        </div>
                                      </a>
                                      <div
                                        class="dropdown"
                                        onClick={() => showAllwithPro(item)}
                                      >
                                        <a
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-toggle="dropdown"
                                        >
                                          <MoreHorizIcon />
                                          <span class="caret"></span>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.PutOnSaleType ==
                                              "FixedPrice" &&
                                            item.tokenowners_current.price >
                                              parseFloat(0) &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner !=
                                              UserAccountAddr && (
                                              <li>
                                                <a
                                                  href="javascript:void(0);"
                                                  onClick={() =>
                                                    PurchaseNowForwardRef.current.PurchaseNow_Click(
                                                      item,
                                                      item.tokenowners_current
                                                    )
                                                  }
                                                >
                                                  Buy now
                                                </a>
                                              </li>
                                            )}
                                          { WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && item.type==721?
                                              <li onClick={item.tokenowners_current.price > parseFloat(0)?()=>hide_function(item,MyTokenDetail):() =>bid_popupshow(item,MyTokenDetail)}>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  {item.tokenowners_current
                                                    .price > parseFloat(0)
                                                    ? "Change price"
                                                    : "Put on sale"}
                                                </a>
                                              </li>
                                            :
                                            WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li  onClick={() =>
                                                PutOnSaleForwardRef.current.PutOnSale_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
                                              }>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  {item.tokenowners_current
                                                    .price > parseFloat(0)
                                                    ? "Change price"
                                                    : "Put on sale"}
                                                </a>
                                              </li>
                                            )}
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li  onClick={() =>
                                                TransferForwardRef.current.Transfer_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
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
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner == UserAccountAddr &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current.price >
                                              0 && (
                                              <li  onClick={() =>
                                                CancelOrderForwardRef.current.CancelOrder_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
                                              }>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  Cancel order
                                                </a>
                                              </li>
                                            )}
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            (item.PutOnSaleType ==
                                              "FixedPrice" ||
                                              item.PutOnSaleType ==
                                                "TimedAuction" ||
                                              item.PutOnSaleType ==
                                                "UnLimitedAuction") &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li  onClick={() =>
                                                BurnForwardRef.current.Burn_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
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
                                          (item.PutOnSaleType == "FixedPrice" ||
                                            (item.PutOnSaleType ==
                                              "TimedAuction" &&
                                              showlist == "true" &&
                                              display_item <= 0) ||
                                            item.PutOnSaleType ==
                                              "UnLimitedAuction") &&
                                          item.tokenowners_current.tokenOwner &&
                                          item.tokenowners_current.tokenOwner !=
                                            UserAccountAddr &&
                                          Bids &&
                                          Bids.myBid &&
                                          !Bids.myBid.status ? (
                                            <li>
                                              <a
                                                href="javascript:void(0);"
                                                onClick={() =>
                                                  PlaceABidForwardRef.current.PlaceABid_Click(
                                                    item
                                                  )
                                                }
                                              >
                                                Place a bid
                                              </a>
                                            </li>
                                          ) : Bids &&
                                            Bids.myBid &&
                                            Bids.myBid.status &&
                                            Bids.myBid.status == "pending" &&
                                            (item.PutOnSaleType ==
                                              "FixedPrice" ||
                                              (item.PutOnSaleType ==
                                                "TimedAuction" &&
                                                showlist == "true" &&
                                                display_item <= 0) ||
                                              item.PutOnSaleType ==
                                                "UnLimitedAuction") &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner != UserAccountAddr ? (
                                            <li>
                                              <a
                                                href="javascript:void(0);"
                                                onClick={() =>
                                                  PlaceABidForwardRef.current.PlaceABid_Click(
                                                    item
                                                  )
                                                }
                                              >
                                                Edit Bid
                                              </a>
                                            </li>
                                          ) : (
                                            <div></div>
                                          )}
                                          {/* {(WalletConnected == true && item.tokenowners_current && item.tokenowners_current.tokenOwner && item.tokenowners_current.tokenOwner != UserAccountAddr) && */}
                                          <li onClick={() =>
                                                ShareForwardRef.current.ShareSocial_Click(
                                                  item
                                                )
                                              }>
                                            <a
                                              href="javascript:void(0);"
                                             
                                            >
                                              Share
                                            </a>
                                          </li>
                                          {/* } */}
                                          {/* <li><a  data-toggle="modal" data-target="#social">Share </a></li> */}
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner !=
                                              UserAccountAddr && (
                                              <li>
                                                <a
                                                  data-toggle="modal"
                                                  data-target="#report"
                                                >
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
                                      item.tokenowners_current.price > 0 && (
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
                                              ? " " +
                                                item.tokenowners_my_balance +
                                                "/" +
                                                item.tokenowners_my_quantity
                                              : item.TabName != ""
                                              ? " " +
                                                item.tokenowners_all_balance +
                                                "/" +
                                                item.tokenQuantity
                                              : item.tokenowners_sale_balance >
                                                0
                                              ? " " +
                                                item.tokenowners_sale_balance +
                                                "/" +
                                                item.tokenQuantity
                                              : " " +
                                                item.tokenowners_all_balance +
                                                "/" +
                                                item.tokenQuantity
                                                }
                                          </span>
                                          {/* <span>
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
              </span> */}
                                        </div>
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
                                        {/* <span>
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
              </span> */}
                                      </div>
                                    )}
                                    <div className="nft-item-group">
                                      {item.PutOnSaleType == "FixedPrice" &&
                                        (item &&
                                          item.tokenowners_current &&
                                          item.tokenowners_current.price) >
                                          0 && (
                                          <div className="nft__item_action">
                                            <a
                                              href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                            >
                                              { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Buy now" : "Owned"}
                                            </a>
                                          </div>
                                        )}
                                      {item.PutOnSaleType == "FixedPrice" &&
                                        (item &&
                                          item.tokenowners_current &&
                                          item.tokenowners_current.price) ==
                                          0 && (
                                          <div className="nft__item_action">
                                            <a
                                              href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                            >
                                              Place a bid
                                            </a>
                                          </div>
                                        )}

                                      {item.PutOnSaleType == "TimedAuction" && (
                                        <div className="nft__item_action">
                                          <a
                                            href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                          >
                                            Place a bid
                                          </a>
                                        </div>
                                      )}
                                      {item.PutOnSaleType ==
                                        "UnLimitedAuction" && (
                                        <div className="nft__item_action">
                                          <a
                                            href={`${config.Front_URL}/item-details/${item.tokenCounts}`}
                                          >
                                            Open for bids
                                          </a>
                                        </div>
                                      )}
                                      
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                    <div className="nft__item">
                                                        <div className="author_list_pp">
                                                            <a href="dark-author.html">                                    
                                                                <img className="lazy" src={require("../assets/images/author/author-1.jpg")} alt="" />
                                                                <i className="fa fa-check"></i>
                                                            </a>
                                                        </div>
                                                        <div className="nft__item_wrap">
                                                            <a href="dark-item-details.html">
                                                                <img src={require("../assets/images/collections/coll-item-2.jpg")} className="lazy nft__item_preview" alt="" />
                                                            </a>
                                                        </div>
                                                        <div className="nft__item_info">
                                                            <a href="dark-item-details.html">
                                                                <h4>Abstraction #128</h4>
                                                            </a>
                                                            <div className="nft__item_price">
                                                                0.06 ETH<span>1/22</span>
                                                            </div>
                                                            <div className="nft-item-group">
                                                            <div className="nft__item_action">
                                                                <a href="#">Place a bid</a>
                                                            </div>
                                                            <div className="nft__item_like">
                                                                <i className="fa fa-heart"></i><span>80</span>
                                                            </div>                                 
                                                        </div>
                                                        </div> 
                                                    </div>
                                                </div>
                        */}
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="nav-owned"
                        role="tabpanel"
                        aria-labelledby="nav-owned-tab"
                      >
                        <div className="row">
                          {Owned_List.map((item) => {
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
                            console.log(display_item,"===============",item.PutOnSaleType,"=============+++++++++")

                            return (
                              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                <div className="nft__item">
                                  {item.PutOnSaleType == "TimedAuction" &&
                                    display_item <= 0 && (
                                      <div className="de_countdown">
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
                                    display_item > 0 && (
                                      <div className="de_countdown">
                                        <Countdown
                                          date={startdate}
                                          autoStart={true}
                                          onStart={() => Date.now()}
                                          renderer={renderer1}
                                        />
                                        {/* </Countdown> */}
                                        {/* <Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /> */}
                                      </div>
                                    )}
                                  <div className="authorLikeTop">
                                  <div className="author_list_pp">
                                    {item.tokenOwnerInfo &&
                                    item.tokenOwnerInfo.curraddress &&
                                    item.tokenOwnerInfo.image ? (
                                      <a href="javascript:void(0)">
                                        <img
                                          className="lazy"
                                          src={`${config.Back_URL}profile/${item.tokenOwnerInfo.image}`}
                                          alt=""
                                        />
                                      </a>
                                    ) : (
                                      <a href="javascript:void(0)">
                                        <img
                                          className="lazy"
                                          src={`${config.Back_URL}images/previewThumb.png`}
                                          alt=""
                                        />
                                      </a>
                                    )}
                                    {item.tokenOwnerInfo &&
                                    item.tokenOwnerInfo.isverified &&
                                    item.tokenOwnerInfo.isverified != "" ? (
                                      <i className="fa fa-check"></i>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="nft__item_like">
                                        {LikedTokenList.findIndex(
                                          (tokenCounts) =>
                                            tokenCounts.tokenCounts ===
                                            item.tokenCounts
                                        ) > -1 ? (
                                          <i
                                            className="fa fa-heart liked"
                                            onClick={() =>
                                              LikeForwardRef.current.hitLike(
                                                item
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        ) : (
                                          <i
                                            className="far fa-heart "
                                            onClick={() =>
                                              LikeForwardRef.current.hitLike(
                                                item
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        )}
                                        <span
                                          class={
                                            item.tokenCounts + "-likecount mr-2"
                                          }
                                        >
                                          {item.likecount}
                                        </span>{" "}
                                      </div>
                                      </div>
                                  <div className="nft__item_wrap">
                                    <a
                                      href={
                                        item.PutOnSaleType != "putonmarket"
                                          ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                          : `#`
                                      } 
                                    >
                                      {item.image.split(".").pop() == "mp4" ? (
                                        <video
                                          src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                                          type="video/mp4"
                                          alt="Collections"
                                          className="lazy nft__item_preview"
                                          controls
                                          controlsList="nodownload"
                                        />
                                      ) : item.image.split(".").pop() ==
                                        "mp3" || item.image.split(".").pop() == "wav" ? (
                                        <>
                                          <img
                                            src={`${config.Back_URL}images/music.png`}
                                            alt=""
                                            className="lazy nft__item_preview"
                                          />
                                        </>
                                      ) : (
                                        <img
                                          src={`${config.Back_URL}nftImg/${item.tokenCreator}/${item.image}`}
                                          alt="Collections"
                                          className="lazy nft__item_preview"
                                        />
                                      )}
                                      {/* <img src={require("../assets/images/items-alt/static-1.jpg")} className="lazy nft__item_preview" alt="" /> */}
                                    </a>
                                  </div>
                                  {(item && item.image && item.image.split('.').pop() == 'mp3') || (item.image.split(".").pop() == "wav") ?
                                    <audio controlsList="nodownload" src={`${config.Back_URL}nftImg/${item.tokenCreatorInfo.curraddress}/${item.image}`}  type="audio/mp3"controls className="audio audio_widyth">
                                      </audio>:""
                                        }
                                 
                                </div>
                                <div className="nft__item_info">
                                    <div className="flex_between_s">
                                      <a
                                        href={
                                          item.PutOnSaleType != "putonmarket"
                                            ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                            : "#"
                                        }
                                      >
                                        <div>
                                          <h4>{item.tokenName}</h4>
                                        </div>
                                      </a>
                                      <div
                                        class="dropdown"
                                        onClick={() => showAllwithPro(item)}
                                      >
                                        <a
                                          class=" dropdown-toggle"
                                          type="button"
                                          data-toggle="dropdown"
                                        >
                                          <MoreHorizIcon />
                                          <span class="caret"></span>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.PutOnSaleType ==
                                              "FixedPrice" &&
                                            item.tokenowners_current.price >
                                              parseFloat(0) &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner !=
                                              UserAccountAddr && (
                                              <li>
                                                <a
                                                  href="javascript:void(0);"
                                                  onClick={() =>
                                                    PurchaseNowForwardRef.current.PurchaseNow_Click(
                                                      item,
                                                      item.tokenowners_current
                                                    )
                                                  }
                                                >
                                                  Buy now
                                                </a>
                                              </li>
                                            )}
                                          { WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && item.type==721?
                                               <li  onClick={item.tokenowners_current.price > parseFloat(0)?()=>hide_function(item,MyTokenDetail):() =>bid_popupshow(item,MyTokenDetail)}>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  {item.tokenowners_current
                                                    .price > parseFloat(0)
                                                    ? "Change price"
                                                    : "Put on sale"}
                                                </a>
                                              </li>
                                           :
                                            WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li         onClick={() =>
                                                PutOnSaleForwardRef.current.PutOnSale_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
                                              }>
                                                <a
                                                  href="javascript:void(0);"
                                          
                                                >
                                                  {item.tokenowners_current
                                                    .price > parseFloat(0)
                                                    ? "Change price"
                                                    : "Put on sale"}
                                                </a>
                                              </li>
                                            )}
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li   onClick={() =>
                                                TransferForwardRef.current.Transfer_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
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
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner == UserAccountAddr &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current.price >
                                              0 && (
                                              <li  onClick={() =>
                                                CancelOrderForwardRef.current.CancelOrder_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
                                              }>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  Cancel Order
                                                </a>
                                              </li>
                                            )}
                                          {WalletConnected == true &&
                                            item.tokenowners_current &&
                                            (item.PutOnSaleType ==
                                              "FixedPrice" ||
                                              item.PutOnSaleType ==
                                                "putonmarket" ||
                                              item.PutOnSaleType ==
                                                "TimedAuction" ||
                                              item.PutOnSaleType ==
                                                "UnLimitedAuction") &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current.balance >
                                              0 &&
                                            item.tokenowners_current
                                              .tokenOwner ==
                                              UserAccountAddr && (
                                              <li onClick={() =>
                                                BurnForwardRef.current.Burn_Click(
                                                  item,
                                                  item.tokenowners_current
                                                )
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
                                          (item.PutOnSaleType == "FixedPrice" ||
                                            (item.PutOnSaleType ==
                                              "TimedAuction" &&
                                              showlist == "true" &&
                                              display_item <= 0) ||
                                            item.PutOnSaleType ==
                                              "UnLimitedAuction") &&
                                          item.tokenowners_current.tokenOwner &&
                                          item.tokenowners_current.tokenOwner !=
                                            UserAccountAddr &&
                                          Bids &&
                                          Bids.myBid &&
                                          !Bids.myBid.status ? (
                                            <li>
                                              <a
                                                href="javascript:void(0);"
                                                onClick={() =>
                                                  PlaceABidForwardRef.current.PlaceABid_Click(
                                                    item
                                                  )
                                                }
                                              >
                                                Place a bid
                                              </a>
                                            </li>
                                          ) : Bids &&
                                            Bids.myBid &&
                                            Bids.myBid.status &&
                                            Bids.myBid.status == "pending" &&
                                            (item.PutOnSaleType ==
                                              "FixedPrice" ||
                                              (item.PutOnSaleType ==
                                                "TimedAuction" &&
                                                showlist == "true" &&
                                                display_item <= 0) ||
                                              item.PutOnSaleType ==
                                                "UnLimitedAuction") &&
                                            item.tokenowners_current
                                              .tokenOwner &&
                                            item.tokenowners_current
                                              .tokenOwner != UserAccountAddr ? (
                                            <li>
                                              <a
                                                href="javascript:void(0);"
                                                onClick={() =>
                                                  PlaceABidForwardRef.current.PlaceABid_Click(
                                                    item
                                                  )
                                                }
                                              >
                                                Edit Bid
                                              </a>
                                            </li>
                                          ) : (
                                            <div></div>
                                          )}
                                          {item &&
                                            item.PutOnSaleType !=
                                              "putonmarket" && (
                                              <li  onClick={() =>
                                                ShareForwardRef.current.ShareSocial_Click(
                                                  item
                                                )
                                              }>
                                                <a
                                                  href="javascript:void(0);"
                                                 
                                                >
                                                  Share
                                                </a>
                                              </li>
                                            )}

                                          {/* <li><a  data-toggle="modal" data-target="#social">Share </a></li> */}
                                          {/* {item &&
                                            item.PutOnSaleType !=
                                              "putonmarket" && (
                                              <li>
                                                <a
                                                  data-toggle="modal"
                                                  data-target="#report"
                                                >
                                                  Report
                                                </a>
                                              </li>
                                            )} */}
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
                                              ? " " +
                                                item.tokenowners_my_balance +
                                                "/" +
                                                item.tokenowners_my_quantity
                                              : item.TabName != ""
                                              ? " " +
                                                item.tokenowners_all_balance +
                                                "/" +
                                                item.tokenQuantity
                                              : item.tokenowners_sale_balance >
                                                0
                                              ? " " +
                                                item.tokenowners_sale_balance +
                                                "/" +
                                                item.tokenQuantity
                                              : " " +
                                                item.tokenowners_all_balance +
                                                "/" +
                                                item.tokenQuantity}
                                          </span>
                                          {/* <span>
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
              </span> */}
                                        </div>
                                      ): item.PutOnSaleType == "FixedPrice" && 
                                        <div className="nft__item_price">
                                            Unlisted 0.00 {item.tokenowners_current.currency}
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
                                              : item.tokenowners_sale_balance >
                                                0
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
                                      }
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
                                        {/* <span>
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
              </span> */}
                                      </div>
                                    )}
                                    <div className="nft-item-group">
                                      {item.PutOnSaleType == "FixedPrice" &&
                                        (item &&
                                          item.tokenowners_current &&
                                          item.tokenowners_current.price) >
                                          0 && (
                                          <div className="nft__item_action">
                                            <a
                                              href={
                                                item.PutOnSaleType !=
                                                "putonmarket"
                                                  ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                                  : "#"
                                              }
                                            >
                                              {/* Place a bid */}
                                              { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Place a bid" : "Owned"}
                                            </a>
                                          </div>
                                        )}
                                      {WalletConnected == true &&
                                        item.PutOnSaleType == "FixedPrice" &&
                                        item.tokenowners_current.price == 0 && (
                                          <div className="nft__item_action">
                                            <a
                                              href={
                                                item.PutOnSaleType !=
                                                "putonmarket"
                                                  ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                                  : "#"
                                              }
                                            >
                                              {/* Open for Bids */}
                                              { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Open for Bids" : "Owned"}
                                            </a>
                                          </div>
                                        )}
                                      {item.PutOnSaleType == "TimedAuction" && (
                                        <div className="nft__item_action">
                                          <a
                                            href={
                                              item.PutOnSaleType !=
                                              "putonmarket"
                                                ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                                : "#"
                                            }
                                          >
                                            {/* Place a bid */}
                                            { item.tokenowners_current.tokenOwner != UserAccountAddr ? "Place a bid" : "Owned"}
                                          </a>
                                        </div>
                                      )}
                                      {item.PutOnSaleType ==
                                        "UnLimitedAuction" && (
                                        <div className="nft__item_action">
                                          <a
                                            href={
                                              item.PutOnSaleType !=
                                              "putonmarket"
                                                ? `${config.Front_URL}/item-details/${item.tokenCounts}`
                                                : "#"
                                            }
                                          >
                                            Open for Bids
                                          </a>
                                        </div>
                                      )}


                                      {item.PutOnSaleType ==
                                        "putonmarket" && (
                                        <div className="nft__item_action">
                                          <a
                                             onClick={() =>
                                              popupshow(
                                                item,
                                                item.tokenowners_current
                                              )
                                            }
                                            style={{cursor:'pointer'}}
                                          >
                                            Put on Sale
                                          </a>
                                        </div>
                                      )}
                                      
                                    </div>
                                  </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-staked"
                        role="tabpanel"
                        aria-labelledby="nav-staked-tab"
                      >
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="nft__item">
                              <div className="de_countdown">APY 125.75%</div>
                              <div className="author_list_pp">
                                <a href="dark-author.html">
                                  <img
                                    className="lazy"
                                    src={require("../assets/images/author/author-1.jpg")}
                                    alt=""
                                  />
                                  <i className="fa fa-check"></i>
                                </a>
                              </div>
                              <div className="nft__item_wrap">
                                <a href="dark-item-details.html">
                                  <img
                                    src={require("../assets/images/collections/coll-item-3.jpg")}
                                    className="lazy nft__item_preview"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div className="nft__item_info">
                                <a href="dark-item-details.html">
                                  <h4>Abstraction #256</h4>
                                </a>
                                <div className="nft__item_price">
                                  Earned<span>1.05 ETH</span>
                                </div>
                                <div className="nft-item-group">
                                  <div className="nft__item_price">
                                    Stakers<span>7890</span>
                                  </div>
                                  <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>97</span>
                                  </div>
                                </div>
                                <div className="itemButtonGroup">
                                  <button
                                    type="button"
                                    className="btn-main btnGrey"
                                  >
                                    Unstake
                                  </button>
                                  <button type="button" className="btn-main">
                                    Harvest
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="nft__item">
                              <div className="de_countdown">APY 125.75%</div>
                              <div className="author_list_pp">
                                <a href="dark-author.html">
                                  <img
                                    className="lazy"
                                    src={require("../assets/images/author/author-1.jpg")}
                                    alt=""
                                  />
                                  <i className="fa fa-check"></i>
                                </a>
                              </div>
                              <div className="nft__item_wrap">
                                <a href="dark-item-details.html">
                                  <img
                                    src={require("../assets/images/collections/coll-item-1.jpg")}
                                    className="lazy nft__item_preview"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div className="nft__item_info">
                                <a href="dark-item-details.html">
                                  <h4>Abstraction #256</h4>
                                </a>
                                <div className="nft__item_price">
                                  Earned<span>25 ETH</span>
                                </div>
                                <div className="nft-item-group">
                                  <div className="nft__item_price">
                                    Stakers<span>550</span>
                                  </div>
                                  <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>50</span>
                                  </div>
                                </div>
                                <div className="itemButtonGroup">
                                  <button className="btn-main btnGrey">
                                    Unstake
                                  </button>
                                  <button className="btn-main">Harvest</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="nft__item">
                              <div className="de_countdown">APY 236.75%</div>
                              <div className="author_list_pp">
                                <a href="dark-author.html">
                                  <img
                                    className="lazy"
                                    src={require("../assets/images/author/author-1.jpg")}
                                    alt=""
                                  />
                                  <i className="fa fa-check"></i>
                                </a>
                              </div>
                              <div className="nft__item_wrap">
                                <a href="dark-item-details.html">
                                  <img
                                    src={require("../assets/images/collections/coll-item-2.jpg")}
                                    className="lazy nft__item_preview"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div className="nft__item_info">
                                <a href="dark-item-details.html">
                                  <h4>Abstraction 128</h4>
                                </a>
                                <div className="nft__item_price">
                                  Earned<span>10.5 ETH</span>
                                </div>
                                <div className="nft-item-group">
                                  <div className="nft__item_price">
                                    Stakers<span>259</span>
                                  </div>
                                  <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>80</span>
                                  </div>
                                </div>
                                <div className="itemButtonGroup">
                                  <button className="btn-main btnGrey">
                                    Unstake
                                  </button>
                                  <button className="btn-main">Harvest</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="nft__item">
                              <div className="de_countdown">APY 8651.75%</div>
                              <div className="author_list_pp">
                                <a href="dark-author.html">
                                  <img
                                    className="lazy"
                                    src={require("../assets/images/author/author-1.jpg")}
                                    alt=""
                                  />
                                  <i className="fa fa-check"></i>
                                </a>
                              </div>
                              <div className="nft__item_wrap">
                                <a href="dark-item-details.html">
                                  <img
                                    src={require("../assets/images/collections/coll-item-4.jpg")}
                                    className="lazy nft__item_preview"
                                    alt=""
                                  />
                                </a>
                              </div>
                              <div className="nft__item_info">
                                <a href="dark-item-details.html">
                                  <h4>Abstraction #525</h4>
                                </a>
                                <div className="nft__item_price">
                                  Earned<span>125.05 ETH</span>
                                </div>
                                <div className="nft-item-group">
                                  <div className="nft__item_price">
                                    Stakers<span>109</span>
                                  </div>
                                  <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>73</span>
                                  </div>
                                </div>
                                <div className="itemButtonGroup">
                                  <button className="btn-main btnGrey">
                                    Unstake
                                  </button>
                                  <button className="btn-main">Harvest</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade pt-4"
                        id="nav-Following"
                        role="tabpanel"
                        aria-labelledby="nav-Following-tab"
                      >
                        {followingStatus &&
                          FollowingUserList &&
                          FollowingUserList.length > 0 && (
                            <div className="row">
                              {FollowingUserList.map((item, i) => {
                                var name =
                                  item &&
                                  item.userdetail &&
                                  item.userdetail.name &&
                                  item.userdetail.name != ""
                                    ? item.userdetail.name
                                    : item.userdetail &&
                                      item.userdetail.curraddress
                                    ? item.userdetail.curraddress
                                    : "";

                                if (name.length > 15) {
                                  name = name.substring(0, 18) + "...";
                                }

                                var followers =
                                  item &&
                                  item.userdetail &&
                                  item.userdetail.followers
                                    ? item.userdetail.followers
                                    : 0;

                                var imageUrl =
                                  item.userdetail &&
                                  item.userdetail.image != "" &&
                                  item.userdetail.image != null &&
                                  item.userdetail.image != undefined
                                    ? config.Back_URL +
                                      "profile/" +
                                      item.userdetail.image
                                    : require("../assets/images/profile_placeholder.png");
                                return (
                                  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <a
                                      href={"/user/" + item.owner}
                                      className="nft_coll style-2 w-100 d-block"
                                    >
                                      <div className="nft_coll_pp">
                                        <img
                                          src={imageUrl}
                                          alt="User"
                                          className="lazy"
                                        />
                                      </div>
                                      <div className="nft_coll_info">
                                        <h4>{name}</h4>
                                        <span>
                                          {item.numberOfFollower} Followers
                                        </span>
                                      </div>
                                    </a>
                                    {item.owner != UserAccountAddr && (
                                      <div className="pading_new_s_button">
                                        <button
                                          onClick={() =>
                                            FollowingTab(
                                              item.owner,
                                              i,
                                              item.isFollow
                                            )
                                          }
                                          className="btn-main"
                                        >
                                          {item.isFollow == "yes"
                                            ? "Unfollow"
                                            : "Follow"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                      </div>
                      <div
                        className="tab-pane fade pt-4"
                        id="nav-Followers"
                        role="tabpanel"
                        aria-labelledby="nav-Followers-tab"
                      >
                        {followersStatus &&
                          FollowerUserList &&
                          FollowerUserList.length > 0 && (
                            <div className="row">
                              {followersStatus &&
                                FollowerUserList.map((item, i) => {
                                  var name =
                                    item &&
                                    item.userdetail &&
                                    item.userdetail.name &&
                                    item.userdetail.name != ""
                                      ? item.userdetail.name
                                      : item.follower;

                                  if (name.length > 15) {
                                    name = name.substring(0, 18) + "...";
                                  }

                                  var followers =
                                    item &&
                                    item.userdetail &&
                                    item.userdetail.followers
                                      ? item.userdetail.followers
                                      : 0;

                                  var imageUrl =
                                    item.userdetail &&
                                    item.userdetail.image != "" &&
                                    item.userdetail.image != null &&
                                    item.userdetail.image != undefined
                                      ? config.Back_URL +
                                        "profile/" +
                                        item.userdetail.image
                                      : require("../assets/images/profile_placeholder.png");
                                  return (
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                      <div
                                        href=""
                                        className="nft_coll style-2 w-100 d-block"
                                      >
                                        <div className="nft_coll_pp">
                                          <img
                                            className="lazy"
                                            src={imageUrl}
                                            alt=""
                                          />
                                        </div>
                                        <a
                                          href={"/user/" + item.follower}
                                          className="nft_coll_info"
                                        >
                                          <h4>{name}</h4>
                                          <span>
                                            {item.numberOfFollower} Followers
                                          </span>
                                        </a>
                                        {item.follower != UserAccountAddr && (
                                          <div className="pading_new_s_button">
                                            <button
                                              onClick={() =>
                                                FollowerTab(
                                                  item.follower,
                                                  i,
                                                  item.isFollow
                                                )
                                              }
                                              className="btn-main"
                                            >
                                              {item.isFollow == "yes"
                                                ? "Unfollow"
                                                : "Follow"}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
          {/* report user */}
          <div class="modal report primary_modal" id="report_user">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Report User</h4>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <div class="modal-body">
                  <form className="form-border">
                    <h5>Tell us more</h5>
                    <textarea
                      className="form-control primary_inp"
                      onChange={inputChangeuser}
                      id="description"
                      rows="3"
                      name="description"
                      placeholder="Give us more details"
                    ></textarea>
                  </form>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => report()}
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
      ):(
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
      )}
    </div>
  );
}
