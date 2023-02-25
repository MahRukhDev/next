import React, { useEffect } from "react";
import OwlCarousel from 'react-owl-carousel';
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


export default function Create() {

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
        
            obj.on("mouseenter", function() {
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

   var settings = {
        center: false,
        items:5,
        loop:true,
        margin:15,
        nav:true,
        navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        dots:false,
        responsive:{
            1000:{
                items:3
            },
            600:{
                items:2
            },
            0:{
                items:2
            },
        }
      };
  return (
<div id="wrapper">
<Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Support</title>
      </Helmet>
	 <ScrollToTopOnMount />
     <Header />
        <div className="no-bottom no-top" id="content">
        
            <section id="subheader" class="text-light" data-bgimage="url(images/background/subheader-dark.jpg) top">
                    <div class="center-y relative text-center">
                        <div class="container">
                            <div class="row">
                                
                                <div class="col-md-12 text-center">
									<h1>Support</h1>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
            </section>
            
           <section className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                    <div className="support_card_section">
                        <form>
                           <div className="form_group">
                                <h5>Category</h5>
                                <div id="item_category" class="dropdown w-100">
                                    <a href="#" class="btn-selector w-100 d-block">All categories</a>
                                    <ul className="w-100">
                                        <li class="active"><span>All categories</span></li>
                                        <li><span>Login issue</span></li>
                                    </ul>
                                </div>               
                               </div>
                            <div className="form_group">
                            <h5>Description</h5>
                            <textarea data-autoresize name="item_desc" id="item_desc" class="form-control" placeholder=""></textarea>
                            </div>
                            <div className="form_group">
                            <div>
                            <div className="form-group widyth_30">
                            <h5>Upload Image</h5>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        aria-describedby="inputGroupFileAddon01"
                                        name="image"
                                    />
                                    <label className="custom-file-label">
                                    Upload image
                                    </label>
                                </div>
                            </div>
                            </div>
                            <div className="button_cas_sss">
                                <a href="" className="btn-main">Submit</a>
                            </div>
                            </div>
              </form>          
            </div>
                    </div>
                    <div className="col-lg-9">
                    <div className="">
                    <div id="main">
                    <div class="">
                    <div class="accordion" id="faq">
                    <div class="card">
                        <div class="card-header" id="faqhead1">
                            <a href="#" class="btn btn-header-link" data-toggle="collapse" data-target="#faq1"
                            aria-expanded="true" aria-controls="faq1">
                                <div>
                                    <p>Subject<span>Login Issue</span></p>
                                </div>
                          
                                <div>
                                    <p>Ticket ID<span>#7896546</span></p>
                                </div>
                                <div>
                                    <p>Status<span className="text_green">Open</span></p>
                                </div>
                          
                            </a>
                        </div>

                        <div id="faq1" class="collapse show" aria-labelledby="faqhead1" data-parent="#faq">
                            <div class="card-body">
                               <div className="replay_msrss">
                               <p class="metaChatDetails">Create on: 2021-12-03 20:22</p>
                               <ul className="ticketComments">
                                <li>
                                    <div className="ticketUserDetails">
                                        <div className="userImg">
                                        <img src={require("../assets/images/profile_img.png")} alt="" />
                                        </div>
                                        <p>user</p>
                                    </div>
                                    <div className="ticketDetails">
                                        <p>text</p>
                                    </div>
                                </li>
                               </ul>
                               <div className="messageTypeBox contact_form">
                                   <div className="row">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label className="d-block">Replay to admin</label>
                                            <textarea rows="2" class="form-control" name="message"></textarea>
                                        </div>
                                        <div className="button_replay">
                                            <button>Replay</button>
                                            <button>Satisfied, Close this ticket</button>
                                        </div>
                                    </div>
                                    </div> 
                               </div>
                               </div>
                            </div>
                        </div>
                    </div>
                  
            
            
            
                </div>
    </div>
  </div>         
                    </div>
                    </div>
                </div>
           </section>
            

         
            <Footer />   
        </div>  
    </div>

  );
}
