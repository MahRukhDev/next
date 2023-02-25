import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import config from "../lib/config";
import ESC_ABI from "../ABI/ESC.json";
import WBNB_ABI from "../ABI/WBNB.json";
import { headerSearch } from "../actions/v1/token";
import { toast } from "react-toastify";
import { getmylog } from "../helper/walletconnect";
const IPFS_IMGurl = config.IPFS_IMG;
toast.configure();
let toasterOption = config.toasterOption;

export default function Header() {
  const [accounts, setAccounts] = React.useState();
  const [balance, setBalance] = React.useState();
  const [searchstatus, setsearchstatus] = React.useState(false);
  const [itemList, setitemList] = React.useState([]);
  const [userList, setuserList] = React.useState([]);
  const [Keyword, Set_Keyword] = React.useState("");
  const [TokenBalanceWBNB, Set_TokenBalanceWBNB] = React.useState("");
  const [TokenBalanceESC, Set_TokenBalanceEsc] = React.useState("");
  const [TokenBalance, Set_TokenBalance] = React.useState("");


  useEffect(() => {
    loadScript();
    getConnect();
  }, []);

  function loadScript() {
    $(".navbarToggler").on("click", function (e) {
      $(".navbarRight").toggleClass("openMenu"); //you can list several class names
      $(".navbarToggler").toggleClass("active");
      e.preventDefault();
    });
  }
  async function disconnect() {
    localStorage.clear();
    localStorage.removeItem("nilwireMetamask");
    localStorage.removeItem("nilwireMetamaskAddr");
    window.location.reload(false);
  }

  const searchChange = async (e) => {
    var value = e.target.value;
    if (
      value &&
      value !== "" &&
      value.trim() !== "" &&
      value != null &&
      value !== undefined
    ) {
      Set_Keyword(value);
      if (value.length > 1) {
        var response = await headerSearch({ search: value });

        if (response && response.data && response.data.result) {
          setitemList(response.data.result);
          setsearchstatus(true);
        }
        if (response && response.data && response.data.userList) {
          setuserList(response.data.userList);
          setsearchstatus(true);
        }
      }
    } else {
      setitemList([]);
      setuserList([]);
      Set_Keyword("");
      setsearchstatus(false);
    }
  };

  async function getConnect() {
    var mydata = await getmylog();

    try {
      const web3 = new Web3(
        mydata &&
        mydata.provider &&
        mydata.provider != null &&
        mydata.provider !== undefined &&
        mydata.provider !== ""
          ? mydata.provider
          : window.ethereum
      );
      // var web3 = new Web3(window.ethereum);
      try {
        //if (typeof web3 !== "undefined") {
        // window.ethereum.enable().then(async function () {
        // if (
        //   window.web3.currentProvider.networkVersion ==
        //   config.networkVersion
        // ) {
        // if (window.web3.currentProvider.isMetaMask === true) {
          
        await web3.eth.getAccounts(async function (error, result) {
          setAccounts(result[0].toLowerCase());
          var val = await web3.eth.getBalance(result[0].toLowerCase());
          var balance = val / 1000000000000000000;

          setBalance(balance);



          // var ESCContract = new web3.eth.Contract(ESC_ABI, config.esctokenAddr);
          // var tokenBal = await ESCContract.methods
          //   .balanceOf(result[0].toLowerCase())
          //   .call();
         
          // var tokenBalance = tokenBal / config.decimalvalues;
          // Set_TokenBalanceEsc(tokenBalance.toFixed(config.toFixed));

          // var CoursetroContract = new web3.eth.Contract(
          //   WBNB_ABI,
          //   config.tokenAddress
          // );

          // var tokenBal1 = await CoursetroContract.methods
          //   .balanceOf(result[0].toLowerCase())
          //   .call();
          // var tokenBalance1 = tokenBal1 / config.decimalvalues;
          // Set_TokenBalanceWBNB(tokenBalance1.toFixed(config.toFixed));

          var curAddr = await web3.eth.getAccounts();
          var currAddr = curAddr && curAddr[0].toLowerCase();

          var WBNBContract = new web3.eth.Contract(
            WBNB_ABI,
            config.tokenAddress
          );
          //var currAddr = window.web3.eth.defaultAccount;
          var decimal = await WBNBContract.methods.decimals().call();
          var tokenBal = await WBNBContract.methods
            .balanceOf(currAddr)
            .call();
          var tokenBalance = tokenBal / config.decimalvalues;
          Set_TokenBalance(tokenBalance.toFixed(config.toFixed));



        });
        //}
        // }
        // });
        //}
      } catch (err) {}
    } catch (err) {}
  }

  async function copyToClipboard(e) {
    var textField = document.createElement("textarea");
    textField.innerText = accounts;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied Successfully", toasterOption);
  }

  const [isTop, setIsTop] = useState("top");
  useEffect(() => {
    window.addEventListener("scroll", () => {
      let activeClass = "normal";
      if (window.scrollY === 0) {
        activeClass = "top";
      }
      setIsTop(activeClass);
    });
  }, []);

  return (
    <header
      className={
        isTop == "normal"
          ? "transparent Scroll down header_area"
          : "transparent Scroll up header_area"
      }
    >
      <nav className="navbar navbar-expand-lg fixed-top py-0 mainMenu">
        <div className="container">
          <div id="logo">
            <Link to="/">
              <img
                src={require("../assets/images/logo-3.png")}
                alt="Nilwire"
              />
            </Link>
          </div>
          <div className="mobileHeadRight">
            <Link to="/connect-wallet" class="btn-main">
              <i class="icon_wallet_alt"></i>
              <span>Connect Wallet</span>
            </Link>
            <button className="navbarToggler" type="button">
              <span id="menu-btn" className="ml-0"></span>
            </button>
          </div>

          <div className="navbarRight">
            <ul className="navbar-nav" id="mainmenu">
            <li>
                <Link to="/about">About</Link>
              </li>
              <li className="dropdown has-child">
                <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
                  Market Place<span></span>
                  <i>mobile Arrow</i>
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/exclusive">Items</Link>
                  </li>
                  <li>
                    <Link to="/browse">collections</Link>
                  </li>
                </ul>
              </li>
              {/* Devloper Note: use this before login for profile menu <li><Link to="/">My profile<span></span></Link></li> */}

              <li className="dropdown has-child">
                <Link
                  to="#"
                  className="dropdown-toggle"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                >
                  My profile<span></span>
                  <i>mobile arrow</i>
                </Link>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <Link to="/edit-profile">Edit profile</Link>
                  </li>
                  <li>
                    <Link to="/mycollections">My collections</Link>
                  </li>

                  <li>
                    <a href="/mynfts">My NFTs</a>
                  </li>
                  <li>
                    <Link to="/myfavorites">Favorite NFTs</Link>
                  </li>
                  <li>
                    <Link to="/activity">Activity</Link>
                  </li>
                </ul>
              </li>

              
              <li className="createLink-for-mobile">
                <Link to="/create">Create</Link>
              </li>
            </ul>
            <form className="form-inline search_inp_form ml-auto">
              <input
                type="text"
                id="quick_search"
                name="quick_search"
                value={Keyword}
                autoComplete="off"
                onChange={searchChange}
                placeholder="Search item or user"
              />
              <div
                className={
                  searchstatus
                    ? "card_search_result"
                    : "card_search_result_hide"
                }
              >
                {searchstatus &&
                  itemList &&
                  itemList.length > 0 &&
                  itemList.map((item) => {
                    return (
                      <div className="search_item">
                        <a href={config.Front_URL+"/item-details/" + item.tokenCounts}>
                          {item.image.split(".").pop() == "mp4" ? (
                            <video
                              src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                              type="video/mp4"
                              alt="Collections"
                              className="img-fluid"
                            />
                          ) : item.image.split(".").pop() == "mp3" ? (
                            <img
                              src={require("../assets/images/music.png")}
                              alt=""
                              className="img-fluid"
                              style={{ backgroundColor: "white" }}
                            />
                          ) : (
                            <img
                              src={`${IPFS_IMGurl}/${item.ipfsimage}`}
                              alt="Collections"
                              className="img-fluid "
                            />
                          )}
                          <div className="">
                            <h2 className="title_search">{item.tokenName}</h2>
                            {/*<p>test search content new</p>*/}
                          </div>
                        </a>
                      </div>
                    );
                  })}
                {userList &&
                  userList.length > 0 &&
                  userList.map((item) => {
                    return (
                      <div className="search_item">
                        <a
                          href={
                            item &&
                            item.name &&
                            item.name != null &&
                            item.name !== undefined &&
                            item.name !== ""
                              ? `${config.Front_URL}/user/${item.name}`
                              : `${config.Front_URL}/user/${item.curraddress}`
                          }
                        >
                          {item &&
                          item.image !== undefined &&
                          item.image != null &&
                          item.image !== "" ? (
                            <img
                              src={`${config.baseurl}/profile/${item.image}`}
                              alt="Collections"
                              className="img-fluid"
                            />
                          ) : (
                            <img
                              src={`${config.baseurl}/images/previewThumb.png`}
                              alt="Collections"
                              className="img-fluid"
                            />
                          )}
                          <div className="">
                            <h2 className="title_search">{item.name}</h2>
                            {/*<p>test search content new</p>*/}
                          </div>
                        </a>
                      </div>
                    );
                  })}
              </div>
            </form>
            
            <div className="menu_side_area">
              <Link to="/create" className="btn-main">
                <i className="icon_wallet_alt"></i>
                <span>Create</span>
              </Link>
              {!localStorage.getItem("nilwireMetamask") ? (
                <Link to="/connect-wallet" className="btn-main">
                  <i className="icon_wallet_alt"></i>
                  <span>Connect wallet</span>
                </Link>
              ) : (
                <ul id="mainmenu" className="walletAddressDropMain mb-0 pl-0">
                  <li className="dropdown has-child">
                    <Link
                      to="/"
                      className="btn-main afterWallletIcon dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="icon_wallet_alt"></i>{" "}
                      <span className="ml-2">Wallet</span>
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li class="walletDropdown">
                        <div class="d-flex align-items-center">
                          <p class="wallet_address">{accounts}</p>
                          <svg
                            class="MuiSvgIcon-root ml-2 wllet_copy_icon"
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            onClick={copyToClipboard}
                          >
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"></path>
                          </svg>
                        </div>
                        <div class="wallet_balance">
                          <h4>Balance</h4>
                          {balance&&<p>{balance.toFixed(8)} ETH</p>}
                         <p>{TokenBalance ? TokenBalance : 0 } WETH</p>
                        </div>
                        {/* <div class="wallet_balance">
                          <h4>Token balance</h4>
                          <p>{TokenBalanceWBNB} WETH</p>
                          <p>{TokenBalanceESC} ESC</p>
                        </div> */}
                      </li>
                      <li>
                        <Link to="/" onClick={() => disconnect()}>
                          Disconnect
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
