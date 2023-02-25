import React, { useEffect, useState } from "react";
import Header from "src/pages/";
import Footer from "../components/Footer.js";
import $ from "jquery";
import ConnectWallet from "./separate/Connect-Wallet";
import config from "../lib/config";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import ReactLoading from "react-loading";
import {
  getCurAddr,
  getActivity,
  Activity_List_Action,
} from "../actions/v1/user";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

toast.configure();
let toasterOption = config.toasterOption;

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

const IPFS_IMGurl = config.IPFS_IMG;

export default function Activity() {
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState("");
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState("");
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [WalletConnected, Set_WalletConnected] = React.useState("false");
  const [salelist, setsalelist] = React.useState([]);
  const [likelist, setlikelist] = React.useState([]);
  const [purchaselist, setpurchaselist] = React.useState([]);
  const [offerlist, setofferlist] = React.useState([]);
  const [followinglist, setfollowinglist] = React.useState([]);
  const [burnlist, setburnlist] = React.useState([]);
  const [mintlist, setmintlist] = React.useState();
  const [selected, setselected] = React.useState("all");
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);
  const [listinglist, setlistinglist] = React.useState([]);

  useEffect(() => {
    loadScript();
    getinit();
  }, []);

  function loadScript() {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 281) {
        $(".positionSticky").addClass("fixed");
      } else {
        $(".positionSticky").removeClass("fixed");
      }
    });
  }

  async function AfterWalletConnected() {
    var currAddr = await getCurAddr();
    if (
      currAddr &&
      currAddr != null &&
      currAddr != undefined &&
      currAddr != ""
    ) {
      Set_Loaderstatus(true);
    }
    await getactivity("sales");
    await getactivity("like");
    await getactivity("purchase");
    await getactivity("bidrequest");
    await getactivity("following");
    await getactivity("burn");
    await getactivity("listings");
    await getactivity("Creation");
  }

  async function getinit() {}

  async function getactivity(type) {
    var list = "";
    var currAddr = await getCurAddr();
    var data = {
      type: type,
      address: currAddr,
    };
    list = await getActivity(data);
    if (type == "like") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setlikelist(list.data.list);
      } else {
        setlikelist("");
      }
    } else if (type == "purchase") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setpurchaselist(list.data.list);
      } else {
        setpurchaselist("");
      }
    } else if (type == "bidrequest") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setofferlist(list.data.list);
      } else {
        setofferlist("");
      }
    } else if (type == "following") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setfollowinglist(list.data.list);
      } else {
        setfollowinglist("");
      }
    } else if (type == "burn") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setburnlist(list.data.list);
      } else {
        setburnlist("");
      }
    } else if (type == "listings") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setlistinglist(list.data.list);
      } else {
        setlistinglist("");
      }
    } else if (type == "Creation") {
      if (list && list.data && list.data.list && list.data.list.length > 0) {
        setmintlist(list.data.list);
      } else {
        setmintlist("");
      }
    }
  }

  async function selectchange(val) {
    setselected(val);
  }

  async function reset() {
    window.location.reload();
  }

  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Activity</title>
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
      {Loaderstatus == false ? (
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
      ) : (
        <div className="no-bottom no-top" id="content">
          <section id="subheader" className="text-light">
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Activity</h1>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="activityPageSection pt30 pb30"
            aria-label="section"
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <div class="tab-content" id="nav-tabContent">
                    <div
                      class="tab-pane fade show active"
                      id="nav-sales"
                      role="tabpanel"
                      aria-labelledby="nav-sales-tab"
                    >
                      <ul className="activity-list">
                        {purchaselist &&
                          purchaselist.length > 0 &&
                          purchaselist.map((item) => {
                            return (
                              <li className="act_sale">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{ backgroundColor: "white" }}
                                  />
                                ) : (
                                  <img
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  purchased by <a href="#">You</a> for{" "}
                                  {item.price} ETH
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-likes"
                      role="tabpanel"
                      aria-labelledby="nav-likes-tab"
                    >
                      <ul className="activity-list">
                        {likelist &&
                          likelist.length > 0 &&
                          likelist.map((item) => {
                            return (
                              <li className="act_like">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{ backgroundColor: "white" }}
                                  />
                                ) : (
                                  <img
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  liked by <a href="#">You</a>
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-offers"
                      role="tabpanel"
                      aria-labelledby="nav-offers-tab"
                    >
                      <ul className="activity-list">
                        {offerlist &&
                          offerlist.length > 0 &&
                          offerlist.map((item) => {
                            return (
                              <li className="act_offer">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{ backgroundColor: "white" }}
                                  />
                                ) : (
                                  <img
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  <a href="#">You</a> offered {item.price} ETH
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-followings"
                      role="tabpanel"
                      aria-labelledby="nav-followings-tab"
                    >
                      <ul className="activity-list">
                        {followinglist &&
                          followinglist.length > 0 &&
                          followinglist.map((item) => {
                            return (
                              <li className="act_follow">
                                {item &&
                                item.touserdetail &&
                                item.touserdetail.image &&
                                item.touserdetail.image != "" ? (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}profile/${item.touserdetail.image}`}
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    className="lazy"
                                    src={`${config.Back_URL}images/previewThumb.png`}
                                    alt=""
                                  />
                                )}

                                <div className="act_list_text">
                                  <h4>{item.touseraddress}</h4>
                                  you started following{" "}
                                  <a href="#">{item.useraddress}</a>
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-fire"
                      role="tabpanel"
                      aria-labelledby="nav-fire-tab"
                    >
                      <ul className="activity-list">
                        {burnlist &&
                          burnlist.length > 0 &&
                          burnlist.map((item) => {
                            return (
                              <li className="act_burn">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{
                                      backgroundColor: "white",
                                      borderRadius: "5px",
                                    }}
                                  />
                                ) : (
                                  <img
                                    style={{ borderRadius: "5px" }}
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  Burned by {item.useraddress} for {item.price}{" "}
                                  ETH
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>

                    <div
                      class="tab-pane fade"
                      id="nav-list"
                      role="tabpanel"
                      aria-labelledby="nav-list-tab"
                    >
                      <ul className="activity-list">
                        {listinglist &&
                          listinglist.length > 0 &&
                          listinglist.map((item) => {
                            return (
                              <li className="act_list">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{ backgroundColor: "white" }}
                                  />
                                ) : (
                                  <img
                                    style={{ borderRadius: "5px" }}
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  Listed by {item.useraddress} for {item.price}{" "}
                                  ETH
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>

                    <div
                      class="tab-pane fade"
                      id="nav-create"
                      role="tabpanel"
                      aria-labelledby="nav-create-tab"
                    >
                      <ul className="activity-list">
                        {mintlist &&
                          mintlist.length > 0 &&
                          mintlist.map((item) => {
                            return (
                              <li className="act_list">
                                {item &&
                                item.tokendetails &&
                                item.tokendetails.image &&
                                item.tokendetails.image.split(".").pop() ==
                                  "mp4" ? (
                                  <video
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    type="video/mp4"
                                    alt="Collections"
                                    controls
                                    controlsList="nodownload"
                                  />
                                ) : item &&
                                  item.tokendetails &&
                                  item.tokendetails.image &&
                                  (item.tokendetails.image.split(".").pop() ==
                                    "mp3" ||
                                    item.tokendetails.image.split(".").pop() ==
                                      "wav") ? (
                                  <img
                                    src={require("../assets/images/music.png")}
                                    alt=""
                                    style={{
                                      backgroundColor: "white",
                                      borderRadius: "5px",
                                    }}
                                  />
                                ) : (
                                  <img
                                    style={{ borderRadius: "5px" }}
                                    src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                                    alt="Collections"
                                  />
                                )}
                                <div className="act_list_text">
                                  <h4>{item.name}</h4>
                                  Created by {item.useraddress}
                                  <span className="act_list_date">
                                    {moment(item.timestamp).format(
                                      "DD-MM-yyyy hh:mm"
                                    )}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="positionSticky">
                    {/* <span className="filter__l">Filter</span>
                    <span className="filter__r" onClick={() => reset()}>
                      Reset
                    </span> */}
                    <div className="spacer-half"></div>
                    <div className="clearfix"></div>
                    <nav>
                      <div
                        class="nav nav-tabs nav-fill activity-filter"
                        id="nav-tab"
                        role="tablist"
                      >
                        <a
                          class="filter_by_sales active"
                          id="nav-sales-tab"
                          data-toggle="tab"
                          href="#nav-sales"
                          role="tab"
                          aria-controls="nav-sales"
                          aria-selected="true"
                        >
                          <i className="fa fa-shopping-basket"></i> Purchase
                        </a>
                        <a
                          class="filter_by_likes"
                          id="nav-likes-tab"
                          data-toggle="tab"
                          href="#nav-likes"
                          role="tab"
                          aria-controls="nav-likes"
                          aria-selected="false"
                        >
                          <i className="fa fa-heart"></i> Likes
                        </a>
                        <a
                          class="filter_by_offers"
                          id="nav-offers-tab"
                          data-toggle="tab"
                          href="#nav-offers"
                          role="tab"
                          aria-controls="nav-offers"
                          aria-selected="false"
                        >
                          <i className="fa fa-gavel"></i> Offers
                        </a>
                        <a
                          class="filter_by_followings"
                          id="nav-followings-tab"
                          data-toggle="tab"
                          href="#nav-followings"
                          role="tab"
                          aria-controls="nav-followings"
                          aria-selected="false"
                        >
                          <i className="fa fa-check"></i> Followings
                        </a>
                        <a
                          class="filter_by_followings"
                          id="nav-fire-tab"
                          data-toggle="tab"
                          href="#nav-fire"
                          role="tab"
                          aria-controls="nav-fire"
                          aria-selected="false"
                        >
                          <i className="fa fa-fire"></i> Burns
                        </a>
                        <a
                          style={{ maxHeight: "50px" }}
                          class="filter_by_listings"
                          id="nav-list-tab"
                          data-toggle="tab"
                          href="#nav-list"
                          role="tab"
                          aria-controls="nav-list"
                          aria-selected="false"
                        >
                          <i className="fa fa-list"></i> Listings
                        </a>
                        <a
                          style={{ maxHeight: "50px" }}
                          class="filter_by_create"
                          id="nav-create-tab"
                          data-toggle="tab"
                          href="#nav-create"
                          role="tab"
                          aria-controls="nav-create"
                          aria-selected="false"
                        >
                          <i className="fa fa-list"></i> Created
                        </a>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
}
