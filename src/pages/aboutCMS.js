import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import {  getabout } from '../actions/v1/token'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Helmet } from "react-helmet";

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}


export default function About() {

  const [about,setabout] = React.useState("");

  useEffect(() => {
    getcms()
  }, [])

  async function getcms(){
    var result = await getabout();
    setabout(result.result.data.data.content)
  }

  return (
<div id="wrapper">
  <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - About</title>
      </Helmet>
	 <ScrollToTopOnMount />
     <Header />
        <div className="no-bottom" id="content">
            <section className="cmsContent">
            <div className="container">
                {ReactHtmlParser(about)}
                </div>
            </section>
           
            <Footer />   


        </div>  
        <div class="modal fade primary_modal" id="transfer_sale_modal" tabindex="-1" role="dialog" aria-labelledby="transfer_sale_modalCenteredLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" id="hide"  >
            <div class="modal-header text-center">
              <h5 class="modal-title" id="transfer_sale_modalLabel_1">Transfer Token</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div className="update_cover_div_2" id="update_cover_div_2">
                <form className="form-border">
                  <div className="form-group formSkew">
                    <div className="input-group">
                      <input type="text" name="" placeholder="To Addresss" className="form-control" />
                    </div>
                  </div>
                  <div className="form-group formSkew">
                    <div className="input-group">
                      <input type="text" name="" placeholder="Quantity" className="form-control" />
                    </div>
                  </div>
                  <div className="text-center">
                      <button type="button" className="create_btn me-3">Transfer</button>
                    <button className="btn-main btnGrey lead" data-dismiss="modal">Cancel</button>
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
