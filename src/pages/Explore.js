import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Countdown, { zeroPad } from "react-countdown";
import $ from "jquery"
import { Helmet } from "react-helmet";

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}


export default function Expolore() {


  useEffect(() => {  
loadScript();
  },[]);

  function loadScript() {
 dropdown('#item_category');
         dropdown('#buy_category');
         dropdown('#items_type');
    function dropdown(e){
        var obj = $(e+'.dropdown');
        var btn = obj.find('.btn-selector');
        var dd = obj.find('ul');
        var opt = dd.find('li');
        
            obj.on("click", function() {
                dd.show();
            }).on("mouseleave", function() {
                dd.hide();
            })
            
            opt.on("click", function() {
                dd.hide();
                var txt = $(this).text();
                opt.removeClass("active");
                $(this).addClass("active");
                btn.text(txt);
            });
    }

  }

// Countdown Timer
  const currentDate = new Date();
  const year = (currentDate.getMonth() === 11 && currentDate.getDate() > 23) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="timer_panel">
        <span><span className="timer_time">{zeroPad(days)}</span><span className="timer_label">d</span></span>
        <span className="timer_dots"> </span>
        <span><span className="timer_time">{zeroPad(hours)}</span><span className="timer_label">h</span></span>
        <span className="timer_dots"> </span>
        <span><span className="timer_time">{zeroPad(minutes)}</span><span className="timer_label">m</span></span>
        <span className="timer_dots"> </span>
        <span><span className="timer_time">{zeroPad(seconds)}</span><span className="timer_label">s</span></span>
      </div>
    );
  };
  return (
<div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Explore</title>
      </Helmet>
	 <ScrollToTopOnMount />
     <Header />
        <div className="no-bottom no-top" id="content">
       
            <section id="subheader" class="text-light">
                    <div class="center-y relative text-center">
                        <div class="container">
                            <div class="row">
                                
                                <div class="col-md-12 text-center">
									<h1>Explore</h1>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
            </section>
            
			<section aria-label="section" className="pt30 pb30">
                <div class="container">
                    <div class="row wow fadeIn">
                        <div class="col-lg-12">
                            <div className="itemFilterTop">
                            <div class="items_filter">
                                <form class="row form-dark" id="form_quick_search" method="post" name="form_quick_search">
                                    <div class="col text-center">
                                        <input class="form-control" id="name_1" name="name_1" placeholder="search item here..." type="text" /> <a href="#" id="btn-submit"><i class="fa fa-search bg-color-secondary"></i></a>
                                        <div class="clearfix"></div>
                                    </div>
                                </form>

                                <div id="item_category" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">All categories</a>
                                    <ul>
                                        <li class="active"><span>All categories</span></li>
                                        <li><span>Art</span></li>
                                        <li><span>Music</span></li>
                                        <li><span>Domain names</span></li>
                                        <li><span>Virtual world</span></li>
                                        <li><span>Trading cards</span></li>
                                        <li><span>Collectibles</span></li>
                                        <li><span>Sports</span></li>
                                        <li><span>Utility</span></li>
                                        <li><span>Photography</span></li>
                                        <li><span>DeFi</span></li>
                                        <li><span>Metaverse</span></li>
                                        <li><span>Games</span></li>
                                        <li><span>Videos</span></li>
                                    </ul>
                                </div>

                                <div id="buy_category" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">Buy now</a>
                                    <ul>
                                        <li class="active"><span>Buy now</span></li>
                                        <li><span>On auction</span></li>
                                        <li><span>Has offers</span></li>
                                    </ul>
                                </div>

                                <div id="items_type" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">All Items</a>
                                    <ul>
                                        <li class="active"><span>All items</span></li>
                                        <li><span>Single item</span></li>
                                        <li><span>Bundles</span></li>
                                        <li><span>Recently added</span></li>
                                    </ul>
                                </div>
                                <a class="btn btn-selector clas_bottons" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Price
                                </a>
                                <button className="btn btn-main btnGo">Go</button>
                            </div>
                             <div className="itemCount">
                                <p>765 Items</p> 
                            </div>
                        </div>
                        <div class="collapse mb-3 mar-000_minus" id="collapseExample">
                        <div class="card card-body boredr">
                            <div className="price_range">
                                   <label>Custom range:</label> 
                                   <div className="input_section_price">
                                       <div>
                                           <input type="text" />
                                       </div>
                                       <span>ETH</span>
                                   </div>
                                   <span>-</span>
                                   <div className="input_section_price">
                                       <div>
                                           <input type="text" />
                                       </div>
                                       <span>ETH</span>
                                   </div>
                            </div>
                        </div>
                        </div>
                        </div>                     
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-1.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-1.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Pinky ocean</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.08 ETH<span>1/20</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>50</span>
                                    </div>                            
                                </div> 
                                </div>
                            </div>
                        </div>                 
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-10.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-2.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Deep sea phantasy</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.06 ETH<span>1/22</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>80</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-11.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-3.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Rainbow style</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.05 ETH<span>1/11</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>97</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-12.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-4.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Two tigers</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.02 ETH<span>1/15</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>73</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-9.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-4.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>The truth</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.06 ETH<span>1/20</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>26</span>
                                    </div>                                 
                                </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-2.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-2.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Running puppets</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.03 ETH<span>1/24</span>
                                    </div>    
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>45</span>
                                    </div>                                  
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-3.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-1.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>USA Wordmation</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.09 ETH<span>1/25</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>76</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-4.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-5.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Loop donut</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.09 ETH<span>1/14</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>94</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-5.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-3.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Lady copter</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.08 ETH<span>1/21</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>75</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-7.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-5.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Purple planet</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.02 ETH<span>1/18</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>93</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="de_countdown"><Countdown date={`${year}-02-28T12:00:00`} renderer={renderer} /></div>
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-6.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-6.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Oh yeah!</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.025 ETH<span>1/12</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>6</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-8.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-7.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>This is our story</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.035 ETH<span>1/8</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>21</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-9.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-6.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Pixel world</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.015 ETH<span>1/25</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>46</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-12.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/anim-8.webp")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>I believe I can fly</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.055 ETH<span>1/4</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>54</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-4.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-7.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Cute astronout</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.005 ETH<span>1/30</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>32</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>
                       
                        <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div class="nft__item">
                                <div class="author_list_pp">
                                    <a href="dark-author.html">                                    
                                        <img class="lazy" src={require("../assets/images/author/author-1.jpg")} alt="" />
                                        <i class="fa fa-check"></i>
                                    </a>
                                </div>
                                <div class="nft__item_wrap">
                                    <a href="dark-item-details.html">
                                        <img src={require("../assets/images/items/static-8.jpg")} class="lazy nft__item_preview" alt="" />
                                    </a>
                                </div>
                                <div class="nft__item_info">
                                    <a href="dark-item-details.html">
                                        <h4>Teal ocean</h4>
                                    </a>
                                    <div class="nft__item_price">
                                        0.025 ETH<span>1/12</span>
                                    </div>
                                    <div className="nft-item-group">
                                    <div class="nft__item_action">
                                        <a href="#">Place a bid</a>
                                    </div>
                                    <div class="nft__item_like">
                                        <i class="fa fa-heart"></i><span>24</span>
                                    </div>                                 
                                </div> 
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12 text-center">
                            <a href="#" id="loadmore" class="btn-main wow fadeInUp lead">Load more</a>
                        </div>                                              
                    </div>
                </div>
            </section>
            <Footer />   
        </div>  
    </div>

  );
}
