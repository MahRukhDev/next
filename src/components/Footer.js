import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetCategoryAction } from "../actions/v1/token";
import { Requestsubscribe } from "../actions/v1/user";
import config from "../lib/config";
import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

export default function Footer() {
  const [CategoryOption, setCategoryOption] = useState("");
  const [email, setEmail] = useState("");
  const [ValidateError, setValidateError] = useState({});

  useEffect(() => {
    GetCategoryCall();
  }, []);

  async function GetCategoryCall() {
    var resp = await GetCategoryAction();
    if (resp && resp.data && resp.data.list) {
      var CategoryOption = [];
      resp.data.list.map((item) => {
        CategoryOption.push({
          value: item._id,
          label: item.category,
        });
      });
      setCategoryOption(CategoryOption);
    }
  }
  const inputChange = (e) => {
    setEmail(e.target.value);
  };
  async function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  async function subscribe() {
    if (email && email != null && email != undefined && email != "") {
      try {
        let checking = await isValidEmail(email);
        if (checking) {
          var payload = {
            email: email,
          };
          var resp = await Requestsubscribe(payload);
          if (resp && resp.data && resp.data.message == "success") {
            toast.success("Newsletter sended successfully", toasterOption);
          } else {
            toast.error("Already Subscribed the Newsletter", toasterOption);
          }
        } else {
          toast.error("Please Enter Valid Email", toasterOption);
        }
      } catch (err) {}
    } else {
      toast.error("Please Enter Valid Email", toasterOption);
    }
  }
  return (
    <footer className="mainFooter">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-1">
            <div className="footerAbout">
              <Link to="/">
                <img
                  src={require("../assets/images/logo-3.png")}
                  alt="Nilwire"
                />
              </Link>
              <p className="mt-3">
                Digital marketplace for crypto collectibles and non-fungible
                tokens (NFTs). Buy, sell, and discover exclusive digital assets.
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-1">
            <div className="widget">
              <h5>Marketplace</h5>
              <ul>
                <li>
                  <Link to="/exclusive">All NFTs</Link>
                </li>
                {CategoryOption &&
                  CategoryOption.length > 0 &&
                  CategoryOption.map((option, i) => {
                    return (
                      <li value={option.value}>
                        <a
                          href={
                            config.Front_URL +
                            "/exclusive?category=" +
                            option.value
                          }
                        >
                          <span>{option.label}</span>
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 col-xs-1">
            <div className="widget">
              <h5>Community</h5>
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of service</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy</Link>
                </li>
              </ul>
              <h5 className="mt-4">Sponsored</h5>
              <div className="sponsorLogo">
                <img
                  src={require("../assets/images/splash_logo2.png")}
                  alt="Nilwire"
                />
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-1">
            <div className="widget">
              <h5>Newsletter</h5>
              <p>
                Signup for our newsletter to get the latest news in your inbox.
              </p>
              <form
                action="blank.php"
                className="row form-dark"
                id="form_subscribe"
                method="post"
                name="form_subscribe"
              >
                <div className="col text-center">
                  <input
                    className="form-control"
                    id="email"
                    name="email"
                    autoComplete="off"
                    onChange={inputChange}
                    placeholder="enter your email"
                    type="text"
                  />
                  <Link to="#" id="btn-subscribe" onClick={() => subscribe()}>
                    <i className="arrow_right bg-color-secondary"></i>
                  </Link>
                  <div className="clearfix"></div>
                </div>
              </form>
              <div className="spacer-10"></div>
              <small>Your email is safe with us. We don't spam.</small>
            </div>
          </div>
        </div>
      </div>
      <div className="subfooter">
        <div className="container">
          <div className="row">
            <div className="col-md-12 px-0">
              <div className="de-flex">
                <div className="de-flex-col">
                  {/* <Link to="#"> */}
                  <span className="copy">&copy; Copyright 2022 - Nilwire</span>
                  {/* </Link> */}
                </div>
                <div className="de-flex-col">
                  <div className="social-icons">
                    <a
                      href="https://www.instagram.com/nilwire.io/"
                      target="_blank"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com/nilwire" target="_blank">
                      <i className="fa fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="https://twitter.com/NILWIRE2022" target="_blank">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="https://discord.gg/" target="_blank">
                      <i className="fab fa-discord"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
