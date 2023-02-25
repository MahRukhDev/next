import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import config from "../lib/config";
import isEmpty from "../lib/isEmpty";
import { Helmet } from "react-helmet";

import { getallcollections } from "../actions/v1/token";
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Browse() {
  const [collectionlist, Set_collectionlist] = React.useState(0);
  const [page, Set_page] = React.useState(0);
  const [showloadmore, setshowloadmore] = React.useState(true);
  const [loader, setLoader] = React.useState(false);

  useEffect(() => {
    getcollection();
  }, []);

  async function getcollection() {
    var data = {
      page: page,
      limit: 20,
    };
    var lists = await getallcollections(data);
    if (lists && lists.data && lists.data.RespData) {
      Set_collectionlist(lists.data.RespData);
      if (lists.data.RespData.length < 20) {
        setshowloadmore(false);
      }
    }
  }

  async function loadmore() {
    setLoader(true)
    Set_page(parseInt(page) + parseInt(1));
    var data = {
      page: parseInt(page) + parseInt(1),
      limit: 20,
    };
    var lists = await getallcollections(data);
    if (
      lists &&
      lists.data &&
      lists.data.RespData &&
      lists.data.RespData.length > 0
    ) {
      setLoader(false)
      Set_collectionlist(collectionlist.concat(lists.data.RespData));
      if (lists.data.RespData.length < 20) {
        setshowloadmore(false);
      }
    } else {
      setLoader(false)
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
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Browse</title>
      </Helmet>
      <ScrollToTopOnMount />
      <Header />
      <div className="no-bottom no-top" id="content">
        <section id="subheader" class="text-light">
          <div class="center-y relative text-center">
            <div class="container">
              <div class="row">
                <div class="col-md-12 text-center">
                  <h1>Browse collections</h1>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-collections" className="browseSection pt30 pb30">
          <div className="container">
            <div class="col-lg-12">
              <div className="itemFilterTop">
                <div class="items_filter"></div>
                <div className="itemCount">
                  <p>
                    {collectionlist && collectionlist.length > 0
                      ? collectionlist.length
                      : 0}{" "}
                    Items
                  </p>
                </div>
              </div>
            </div>
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
                                {!isEmpty(item.userinfo) &&
                                  item.userinfo.curraddress &&
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
            </div>

            <div className="spacer-double"></div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
