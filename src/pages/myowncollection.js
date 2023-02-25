import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import config from "../lib/config";
import isEmpty from "../lib/isEmpty";
import { Helmet } from "react-helmet";
import ReactLoading from "react-loading";
import ConnectWallet from "./separate/Connect-Wallet";

import {Link} from 'react-router-dom'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { getowncollections } from "../actions/v1/token";
import {
  getCurAddr,
  AddressUserDetails_GetOrSave_Action,
  collectionimageupdate,
} from "../actions/v1/user";
import { toast } from "react-toastify";
import { toastAlert } from "../actions/toastAlert";

toast.configure();
let toasterOption = config.toasterOption;

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Browse() {
  const [collectionlist, Set_collectionlist] = React.useState(0);
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [page, Set_page] = React.useState(0);
  const [TokenFile, setTokenFile] = React.useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = React.useState("");
  const [showloadmore, setshowloadmore] = React.useState(true);
  var imageUrl = config.Back_URL + "cover/5.jpg";
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState(imageUrl);
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState("");
  const [WalletConnected, Set_WalletConnected] = React.useState("false");
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState("");
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [Accounts, Set_Accounts] = React.useState("");
  useEffect(() => {
    getcollection();
    AfterWalletConnected();
  }, []);

  async function AfterWalletConnected() {
    var currAddr = await getCurAddr();

    if (
      currAddr &&
      currAddr != null &&
      currAddr != undefined &&
      currAddr != ""
    ) {
      Set_Loaderstatus(true);

      try {
        var ReqData = { addr: currAddr };
        var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
        if (
          Resp &&
          Resp.data &&
          Resp.data.data &&
          Resp.data.data.User &&
          Resp.data.data.User.collectioncover &&
          Resp.data.data.User.collectioncover != null &&
          Resp.data.data.User.collectioncover != undefined &&
          Resp.data.data.User.collectioncover != ""
        ) {
          setTokenFilePreUrl(
            config.Back_URL + "cover/" + Resp.data.data.User.collectioncover
          );
        }
      } catch (err) {}
    }
  }

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
        var Resp = await collectionimageupdate(formData);
        if (Resp && Resp.data && Resp.data.data) {
          toastAlert(
            "success",
            "Collection Cover Updated Successfully",
            "success"
          );
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        }
      }
    }
  };

  async function getcollection() {
    var curAddr = await getCurAddr();
    var data = {
      page: page,
      limit: 12,
      address: curAddr,
    };
    var lists = await getowncollections(data);
    if (lists && lists.data && lists.data.RespData) {
      Set_collectionlist(lists.data.RespData);
      console.log(lists.data.RespData,'lists.data.RespData');
      if (lists.data.RespData.length < 12) {
        setshowloadmore(false);
      }
    } else {
      setshowloadmore(false);
    }
  }

  async function loadmore() {
    Set_page(parseInt(page) + parseInt(1));
    var curAddr = await getCurAddr();
    var data = {
      page: parseInt(page) + parseInt(1),
      limit: 12,
      address: curAddr,
    };
    var lists = await getowncollections(data);
    if (
      lists &&
      lists.data &&
      lists.data.RespData &&
      lists.data.RespData.length > 0
    ) {
      if (lists.data.RespData.length < 12) {
        setshowloadmore(false);
      }
      Set_collectionlist(collectionlist.concat(lists.data.RespData));
    } else {
      setshowloadmore(false);
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

  var settings = {
    center: false,
    items: 7,
    loop: false,
    margin: 0,
    nav: true,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>",
    ],
    dots: false,
    responsive: {
      1000: {
        items: 7,
      },
      600: {
        items: 1,
      },
      0: {
        items: 1,
      },
    },
  };
  var imageUrl = config.Back_URL + "cover/5.jpeg";
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Collections</title>
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
      {localStorage.getItem("nilwireMetamask") ? (
      
        <div className="no-bottom no-top" id="content">
          {/* <section id="subheader" class="text-light">
                    <div class="center-y relative text-center">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <h1>My Collections</h1>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
            </section> */}

          <section
            id="profile_banner subheader padding-bottom-40"
            className="text-light"
          >
            <div className="container">
              <div className="profile-bg" style={{ backgroundImage: `url(${TokenFilePreUrl})` }}>
                
            <div class="d-create-file coverPhotoButton">
              <div className="uploadCustomFile">
                <div className="file_btn btn primary_btn">
                  Choose image
                  <input
                    className="inp_file"
                    type="file"
                    name="image"
                    onChange={selectFileChange}
                  />
                </div>
              </div>
            </div>
            </div>
            <span class="text-muted" style={{position:'absolute',marginTop:'8px'}}>We recommend an image of at least 1320x280 Pixels</span>

            </div>
          </section>
          <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>My Collections</h1>
                    <h6 className="text-center">
                      {collectionlist && collectionlist.length > 0
                        ? collectionlist.length
                        : 0}{" "}
                      Items
                    </h6>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          <section id="section-collections" className="browseSection pt30 pb30">
            <div className="container">
              <div className="de_tab tab_simple">
                <div className="tab-content de_tab_content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Trending"
                    role="tabpanel"
                    aria-labelledby="nav-Trending-tab"
                  >
                    <div className="row">
                      {collectionlist &&
                        collectionlist.length > 0 &&
                        collectionlist.map((item) => {
                          return (
                            <div className="col-lg-3">
                              <div className="nft_coll style-2">
                                <div className="nft_wrap">
                                  <a
                                    href={
                                      config.Front_URL +
                                      "/collections/" +
                                      item.conAddr
                                    }
                                  >
                                    <img
                                      src={
                                        config.Back_URL +
                                        "collections/" +
                                        item.imageUser
                                      }
                                      className="lazy img-fluid"
                                      alt=""
                                    />
                                  </a>
                                </div>
                                <div className="nft_coll_pp">
                                  {!isEmpty(item.userinfo) &&
                                  item.userinfo.curraddress &&
                                  item.userinfo.image &&
                                  item.userinfo.image != "" ? (
                                    <a
                                      href={`${config.Front_URL}/user/${item.userinfo.curraddress}`}
                                    >
                                      <img
                                        className="lazy"
                                        src={`${config.Back_URL}profile/${item.userinfo.image}`}
                                        alt=""
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      href={`${config.Front_URL}/user/${item.owneraddr}`}
                                    >
                                      <img
                                        className="lazy"
                                        src={`${config.Back_URL}images/previewThumb.png`}
                                        alt=""
                                      />
                                    </a>
                                  )}
                                  {item &&
                                    item.userinfo &&
                                    item.userinfo.emailverified && (
                                      <i className="fa fa-check"></i>
                                    )}
                                </div>
                                <div className="nft_coll_info">
                                  <a
                                    href={
                                      config.Front_URL +
                                      "/collections/" +
                                      item.conAddr
                                    }
                                  >
                                    <h4>{item && item.symbol}</h4>
                                  </a>
                                  <span>
                                    {item && item.type && "ETH" + item.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {showloadmore && (
                      <div className="text-center">
                        <button
                          type="button"
                          class="btn-main"
                          onClick={() => loadmore()}
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="tab-pane fade"
                    id="nav-Top"
                    role="tabpanel"
                    aria-labelledby="nav-Top-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="button" class="btn-main">
                        Load More
                      </button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Art"
                    role="tabpanel"
                    aria-labelledby="nav-Art-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Music"
                    role="tabpanel"
                    aria-labelledby="nav-Music-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Meme"
                    role="tabpanel"
                    aria-labelledby="nav-Meme-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-virtualWorld"
                    role="tabpanel"
                    aria-labelledby="nav-virtualWorld-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Collectibles"
                    role="tabpanel"
                    aria-labelledby="nav-Collectibles-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Sports"
                    role="tabpanel"
                    aria-labelledby="nav-Sports-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Cards"
                    role="tabpanel"
                    aria-labelledby="nav-Cards-tab"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-2.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-2.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Patternlicious</h4>
                            </a>
                            <span>BEP20-61</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-3.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-3.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Skecthify</h4>
                            </a>
                            <span>BEP20-126</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-5.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-5.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Virtuland</h4>
                            </a>
                            <span>BEP20-85</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-6.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-6.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Papercut</h4>
                            </a>
                            <span>BEP20-42</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-4.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-4.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Cartoonism</h4>
                            </a>
                            <span>BEP20-73</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="nft_coll style-2">
                          <div className="nft_wrap">
                            <a href="03_grey-collection.html">
                              <img
                                src={require("../assets/images/collections/coll-1.jpg")}
                                className="lazy img-fluid"
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="nft_coll_pp">
                            <a href="03_grey-collection.html">
                              <img
                                className="lazy"
                                src={require("../assets/images/author/author-1.jpg")}
                                alt=""
                              />
                            </a>
                            <i className="fa fa-check"></i>
                          </div>
                          <div className="nft_coll_info">
                            <a href="03_grey-collection.html">
                              <h4>Abstraction</h4>
                            </a>
                            <span>BEP20-192</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <button class="btn-main">Load More</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="spacer-double"></div>
            </div>
          </section>

          <Footer />
        </div>
      ) : (
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
