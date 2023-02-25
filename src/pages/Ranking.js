import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
// Datatable
import DataTable from 'react-data-table-component';
import $ from "jquery"
import { Helmet } from "react-helmet";



// Trade History Table
const dataRanking = [
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">1.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-1.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle online"></i> <i class="fa fa-check"></i> </div><div className="rankHolderName">Hape Prim</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">2.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-2.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle offline"></i></div><div className="rankHolderName">BEANS - Dumb Ways to Die</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">3.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-3.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle online"></i></div><div className="rankHolderName">Decentraland</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">4.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-4.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle offline"></i> <i class="fa fa-check"></i> </div><div className="rankHolderName">Creepz Genesis</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">5.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-5.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle online"></i> <i class="fa fa-check"></i> </div><div className="rankHolderName">Mind the Gap by MountVitruvius</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">6.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-6.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle online"></i></div><div className="rankHolderName">Rug Radio - Genesis NFT</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">7.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-7.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle offline"></i></div><div className="rankHolderName">MoodRollers by Lucas Zanotto</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">8.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-8.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle offline"></i> <i class="fa fa-check"></i> </div><div className="rankHolderName">Heroes NFT Collection</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">9.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-9.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle offline"></i></div><div className="rankHolderName">Zoofrenz by Zombot Studio</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
{ collection: <div className="rankCollectionColumn"><span className="rankNumber">10.</span> <div className="rankHolderImg author_list_pp"><img src={require("../assets/images/author/author-10.jpg")} alt="" className="img-fluid" /><i class="fa fa-circle online"></i> <i class="fa fa-check"></i> </div><div className="rankHolderName">PhantaBear</div></div>, volume: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">26,344.04</div></div>, twentyFourH: <span className="positiveValue">+799.47%</span>, sevenD: <span className="negativeValue">-72.63%</span>, floorPrice: <div className="cryptoSymobolNumber"><img src={require("../assets/images/wb_01.png")} alt="" className="img-fluid" /><div className="cryptoNumbers">5</div></div>, owners: "3.6K", items: "5.5K",},
];
const columnsRanking = [
  {
    name: 'Collection',
    selector: 'collection',
    sortable: true,
    width: "350px",
  },
  {
    name: 'Volume',
    selector: 'volume',
    sortable: false,
  },
  {
    name: '24h%',
    selector: 'twentyFourH',
    sortable: true,
  },
  {
    name: '7d%',
    selector: 'sevenD',
    sortable: true,
  },
  {
    name: 'Floor Price',
    selector: 'floorPrice',
    sortable: false,
  },
  {
    name: 'Owners',
    selector: 'owners',
    sortable: false,
  },
   {
    name: 'Items',
    selector: 'items',
    sortable: false,
  },
];


// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}


export default function Ranking() {
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

  return (
<div id="wrapper">
	 <ScrollToTopOnMount />
     <Header />
        <div className="no-bottom no-top" id="content">
        <section id="subheader" className="text-light">
                    <div className="center-y relative text-center">
                        <div className="container">
                            <div className="row">
                                
                                <div className="col-md-12 text-center">
									<h1>Top Collection</h1>
                                    <p>The top NFTs on Nilwire, ranked by volume, floor price and other statistics.</p>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
            </section>
           
            

            
			<section className="rankingPageSection pt30 pb30" aria-label="section">
				<div className="container">
					<div class="row wow fadeIn">
                        <div class="col-lg-12">
                        <div className="itemFilterTop">
                            <div class="items_filter">
                                
                                <div id="item_category" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">Last 7 days</a>
                                    <ul>
                                        <li><span>Last 24 hours</span></li>
                                        <li><span>Last 7 days</span></li>
                                        <li><span>Last 30 days</span></li>
                                        <li><span>All time</span></li>
                                    </ul>
                                </div>

                                <div id="buy_category" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">All Categories</a>
                                    <ul>
                                        <li class="active"><span>All Categories</span></li>
                                        <li><span>Arts</span></li>
                                        <li><span>Music</span></li>
                                        <li><span>Meme</span></li>
                                        <li><span>Virtual World</span></li>
                                        <li><span>Collectibles</span></li>
                                        <li><span>Sports</span></li>
                                        <li><span>Cards</span></li>
                                        <li><span>Photography</span></li>
                                        <li><span>DeFi</span></li>
                                        <li><span>Domain Names</span></li>
                                        <li><span>Utility</span></li>
                                        <li><span>Games</span></li>
                                        <li><span>Videos</span></li>
                                    </ul>
                                </div>

                                <div id="items_type" class="dropdown">
                                    <a href="javascript:void(0)" class="btn-selector">Ethereum</a>
                                    <ul>
                                        <li class="active"><span>Ethereum</span></li>
                                        <li><span>All Chains</span></li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                            <div className="rankingCard">
                                <DataTable className="history_table" columns={columnsRanking} data={dataRanking} noHeader />
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
