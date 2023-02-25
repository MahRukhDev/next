import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import ConnectWallet from "./separate/Connect-Wallet";
import ProfileBackground from "../assets/images/background/5.jpg";
import EditIcon from "@material-ui/icons/Edit";
import $ from "jquery";
import Web3 from "web3";
import "@metamask/legacy-web3";
import config from "../lib/config";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toastAlert } from "../actions/toastAlert";
import { getmylog } from "../helper/walletconnect";
import { Helmet } from "react-helmet";
import ReactLoading from "react-loading";
import {Link} from 'react-router-dom'
import {
  UserProfile_Update_Action,
  verifymail,
  getCurAddr,
  verificationuser,
  AddressUserDetails_GetOrSave_Action,
  imageupdate,
  verifyotp,
} from "../actions/v1/user";

toast.configure();
let toasterOption = config.toasterOption;

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function EditProfile() {
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState("");
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState("");
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [WalletConnected, Set_WalletConnected] = React.useState("false");
  const [TokenFile, setTokenFile] = React.useState("");
  const [TokenFilePreReader1, setTokenFilePreReader1] = React.useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = React.useState("");
  const [coverFilePreReader,setcoverFilePreReader]  = React.useState("");
  var imageUrl = config.Back_URL + "cover/5.jpg";
  const [TokenFilePreUrl, setTokenFilePreUrl] = React.useState(imageUrl);
  const [coverststate,setcoverstate] = React.useState("no")
  const [mobile, setphoneNumber] = useState("");
  const [email, setemail] = useState("");
  const [validateError, setValidateError] = useState({});
  const [emailstatus, setemailstatus] = useState("no");
  const [Loaderstatus, Set_Loaderstatus] = React.useState(false);

  useEffect(() => {
    AfterWalletConnected();
  }, []);

  async function AfterWalletConnected() {
    var currAddr = await getCurAddr();
    // console.log(currAddr,"========fromedit")
    // if(currAddr && currAddr!=null && currAddr!=undefined && currAddr!=""){
    //   Set_Loaderstatus(true);
    //   try {
    //     var ReqData = { addr: currAddr };
    //     var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
    //     if (Resp && Resp.data && Resp.data.data) {
    //       setemail(Resp.data.data.User.email);
    //       setphoneNumber(Resp.data.data.User.mobile);
    //       setTokenFilePreUrl(
    //         config.Back_URL + "cover/" + Resp.data.data.User.coverimage
    //       );
    //     }
    //   } catch (err) {}
    // }else{

    // }
      if(currAddr && currAddr!=null && currAddr!=undefined && currAddr!=""){
        Set_Loaderstatus(true);
        try {
          var ReqData = { addr: currAddr };
          var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
          if (Resp && Resp.data && Resp.data.data) {
            console.log(Resp.data.data,'Resp.data.data');
            setemail(Resp.data.data.User.email);
            setphoneNumber(Resp.data.data.User.mobile);
            console.log(Resp.data.data.User.coverimage,(Resp.data.data.User).length,"======TokenFilePreUrlTokenFilePreUrl")
            if(Resp.data.data.User && Resp.data.data.User.coverimage && Resp.data.data.User.coverimage!=null && Resp.data.data.User.coverimage!=undefined && Resp.data.data.User.coverimage!=""){
              console.log( config.Back_URL + "cover/" + Resp.data.data.User.coverimage,"=====TokenFilePreUrlTokenFilePreUrl")
              setTokenFilePreUrl(
                config.Back_URL + "cover/" + Resp.data.data.User.coverimage
              );
              setcoverstate("yes")
            }else{
              setTokenFilePreUrl(
                config.Back_URL + "cover/" + 5 + '.jpg'
              );
              setcoverstate("yes")
            }
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
      console.log(reader,file,fileName,'fhejhbef');
      if (fileSize > 30) {
        toast.error("File size exceeds 30 MB", toasterOption);
        $("input[name='image']").val("");
        return false;
      } else {
        setTokenFile(file);
        var url = reader.readAsDataURL(file);
        reader.onloadend = async function (e) {
          if (reader.result) {
            setTokenFilePreUrl(reader.result);
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
          }, 1000);
        }
      }
    }
  };

  const selectprofileFileChange = async (e) => {
    console.log(e.target,'ee');
    if (e.target && e.target.files) {
      var reader = new FileReader();
      var file = e.target.files[0];
      var fileName = file.name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        toast.error("File size exceeds 10 MB", toasterOption);
        $("input[name='image']").val("");
        return false;
      } else {
        setTokenFile(file);
        var url = reader.readAsDataURL(file);
        reader.onloadend = async function (e) {
          if (reader.result) {
            setTokenFilePreReader(reader.result);
          }
        }.bind(this);
      }
    }
  };

  const inputChange = (e) => {
    if (typeof e.target.value != "undefined") {
      var value = e.target.value;
      //setemail(value)
      AddressUserDetails[e.target.name] = value;
      Set_AddressUserDetails(AddressUserDetails);
    } else {
      //setemail("")
    }
  };

  async function verifyemail() {
    function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }
    if(isValidEmail(AddressUserDetails.email)){
      // validateError.email = "Invalid Email";
      // toast.error("Invalid Email")
    
    var currAddr = await getCurAddr();
    if (currAddr) {
      if (
        emailstatus == "pending" &&
        AddressUserDetails.otp &&
        AddressUserDetails.otp != null &&
        AddressUserDetails.otp != undefined &&
        AddressUserDetails.otp != ""
      ) {
        var data = {
          email: AddressUserDetails.email,
          addr: currAddr,
          otp: AddressUserDetails.otp,
        };
        var Resp = await verifyotp(data);
        if (Resp && Resp.data && Resp.data.data && Resp.data.data.otpverified) {
          setemailstatus("success");
          AddressUserDetails["otpverified"] = Resp.data.data.otpverified;
          Set_AddressUserDetails(AddressUserDetails);
          window.location.reload();
        }
      } else if (emailstatus == "no") {
        var data = {
          email: AddressUserDetails.email,
          addr: currAddr,
        };
        var Resp = await verifymail(data);
        console.log("iminininverify",Resp)
        if (Resp && Resp.data && Resp.data.data && Resp.data.data.email) {
          AddressUserDetails["otpverified"] = Resp.data.data.otpverified;
          setemailstatus("pending");
          Set_AddressUserDetails(AddressUserDetails);
        }
      } else {
        toast.error("Verify Email to Proceed Further", toasterOption);
        return false;
      }
    } else {
      toast.error("Please Connect Wallet To Proceed Further", toasterOption);
    }
  }else {
    toast.error("Invalid Email",toasterOption)
  }
  }

  const Uservalidation = (chk) => {
    if (chk) {
      var validateError = {};
      if (
        (AddressUserDetails && AddressUserDetails.email == "") ||
        AddressUserDetails.email == undefined
      ) {
        validateError.email = "E-mail field is required";
      }
      function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
      }
      if(!isValidEmail(AddressUserDetails.email)){
        validateError.email = "Invalid Email";
      }
      // if(mobile==""||mobile==undefined){
      //   validateError.mobile = "Mobile number field is required";
      // }
      function isValidString(email) {
        return /[^a-zA-Z ]/g.test(email);
      }
      if(isValidString(AddressUserDetails.name)){
        validateError.name = "Special Charactar & numbers not allowed";
      }
      if(AddressUserDetails.name==""||AddressUserDetails.name==undefined){
        validateError.name = "Name field is required";
      }
      function isValidLink(link){
          return /\s/g.test(link)
      }
      if(isValidLink(AddressUserDetails.facebook)){
        validateError.facebook = "Space not accepted link field";
      }
      if(isValidLink(AddressUserDetails.youtube)){
        validateError.youtube = "Space not accepted link field";
      }
      if(isValidLink(AddressUserDetails.instagram)){
        validateError.instagram = "Space not accepted link field";
      }
      if(isValidLink(AddressUserDetails.twitter)){
        validateError.twitter = "Space not accepted link field";
      }
      if(isValidLink(AddressUserDetails.personalsite)){
        validateError.personalsite = "Space not accepted link field";
      }

      setValidateError(validateError);
      return validateError;
    }
  };
  const FormSubmit = async () => {
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
    console.log("=====================adfter")
    var currAddr = await web3.eth.getAccounts();
    //var currAddr = await getCurAddr();
    if (currAddr) {
      var errors = await Uservalidation(true);
      console.log(errors,"--------------errors")
      var errorsSize = Object.keys(errors).length;
      if (errorsSize != 0) {
        console.log(errorsSize,'Wewr');
      } else {
        // if (AddressUserDetails.otpverified == true) {
        //var web3 = new Web3(window.ethereum);
        web3.eth.personal
          .sign(
            `Your profile is being updated`,
            currAddr[0].toLowerCase(),
            `Your profile is being updated`
          )
          .then(async () => {
            var formData = new FormData();
            if (TokenFile) {
              formData.append("Image", TokenFile);
            }
            formData.append("addr", currAddr[0].toLowerCase());
            formData.append(
              "name",
              AddressUserDetails.name ? AddressUserDetails.name : ""
            );
            formData.append(
              "personalsite",
              AddressUserDetails.personalsite
                ? AddressUserDetails.personalsite
                : ""
            );
            formData.append(
              "customurl",
              AddressUserDetails.customurl ? AddressUserDetails.customurl : ""
            );
            formData.append(
              "email",
              AddressUserDetails.email ? AddressUserDetails.email : ""
            );
            formData.append(
              "bio",
              AddressUserDetails.bio ? AddressUserDetails.bio : ""
            );
            formData.append(
              "twitter",
              AddressUserDetails.twitter ? AddressUserDetails.twitter : ""
            );
            setphoneNumber(AddressUserDetails.mobile);
            formData.append(
              "youtube",
              AddressUserDetails.youtube ? AddressUserDetails.youtube : ""
            );
            formData.append(
              "facebook",
              AddressUserDetails.facebook ? AddressUserDetails.facebook : ""
            );
            formData.append(
              "instagram",
              AddressUserDetails.instagram ? AddressUserDetails.instagram : ""
            );
            formData.append(
              "mobile",
              AddressUserDetails.mobile ? AddressUserDetails.mobile : ""
            );
            //formData.append('mobile', mobile);

            var Resp = await UserProfile_Update_Action(formData);
            if (
              Resp &&
              Resp.data &&
              Resp.data.toast &&
              Resp.data.toast.type &&
              Resp.data.toast.type == "success"
            ) {
              window.location.reload(false);
            } else {
              toast.error(Resp.data.toast.msg, toasterOption);
            }
          });
        // } else if (
        //   emailstatus == "pending" &&
        //   AddressUserDetails.otp &&
        //   AddressUserDetails.otp != null &&
        //   AddressUserDetails.otp != undefined &&
        //   AddressUserDetails.otp != ""
        // ) {
        // } else if (emailstatus == "no") {
        //   var data = {
        //     email: AddressUserDetails.email,
        //     addr: currAddr,
        //   };
        //   var Resp = await verifymail(data);
        //   if (
        //     Resp &&
        //     Resp.data &&
        //     Resp.data.data &&
        //     Resp.data.data.secretcode
        //   ) {
        //     setemailstatus("pending");
        //   }
        // } else {
        //   toast.error("Verify Email to Proceed Further", toasterOption);
        //   return false;
        // }
      }
    } else {
      toast.error("Connect Your Wallet to Proceed Further", toasterOption);
    }
  };

  async function submitmail() {
    if (
      AddressUserDetails.email != "" &&
      AddressUserDetails.email != undefined
    ) {
      var currAddr = await getCurAddr();
      var data = {
        email: AddressUserDetails.email,
        useraddress: currAddr,
      };

      var Resp = await verificationuser(data);
      if (
        Resp &&
        Resp.result &&
        Resp.result.message == "Updated Successfully"
      ) {
        toast.success("Request Submitted Successfully", toasterOption);
      }
    } else {
      toast.error("Invalid Mail Id", toasterOption);
    }
  }

  var imageUrl = config.Back_URL + "cover/5.jpeg";
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Edit Profile</title>
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
          

          <section
            className="editProfilePageSection pt30 pb30"
            aria-label="section"
          >
            <div className="container">
              {/* <form className="form-border"> */}
              <div className="row wow fadeIn form-border">
                <div className="col-lg-7 offset-lg-1">
                  <label className="primary_label">Upload profile photo <span className="text-muted">(Optional)</span></label>

                  <div class="d-create-file">
                    <p id="file_name">PNG, JPG, GIF, WEBP. Max 10 MB.</p>
                    <div className="uploadCustomFile">
                      <input
                        type="button"
                        id="get_file"
                        class="btn-main"
                        value="Browse"
                      />
                      <input
                        type="file"
                        id="photo"
                        required="true"
                        name="image"
                        class="btn-main"
                        onChange={selectprofileFileChange}
                      />
                    </div>
                  </div>

                  <div class="spacer-single"></div>

                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="name">
                        Display name <span className="text-muted">(Required)</span>
                      </label>
                      <input
                        placeholder="Enter your display name"
                        type="text"
                      
                        className="form-control primary_inp"
                        name="name"
                        id="name"
                        onChange={inputChange}
                        defaultValue={AddressUserDetails.name}
                      />
                        {validateError.name && (
                        <span className="text-danger">
                          {validateError.name}
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="desccription">
                        Custom URL <span className="text-muted">(Optional)</span>
                      </label>
                      <div className="input-group">
                        <div class="input-group-prepend">
                          {`${config.Front_URL}/user/`}
                        </div>
                        <input
                          type="text"
                          className="form-control primary_inp mb-0"
                          id="customurl"
                          name="customurl"
                          onChange={inputChange}
                          defaultValue={
                            AddressUserDetails && AddressUserDetails.customurl
                              ? AddressUserDetails.customurl
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="name">
                        Personal site or portfolio link <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-control primary_inp"
                        id="personalsite"
                        name="personalsite"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.personalsite
                            ? AddressUserDetails.personalsite
                            : ""
                        }
                      />
                         {validateError.personalsite && (
                        <span className="text-danger">
                          {validateError.personalsite}
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="desccription">
                        Email <span className="text-muted">(Required)</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control primary_inp mb-0"
                          id="email"
                          name="email"
                          onChange={inputChange}
                          defaultValue={AddressUserDetails.email}
                        />
                        {emailstatus != "success" &&
                        AddressUserDetails &&
                        !AddressUserDetails.otpverified ? (
                          <div className="input-group-append px-0">
                            <button
                              type="button"
                              className="btn-main m-0 px-3"
                              onClick={() => verifyemail()}
                            >
                              Verify email
                            </button>
                          </div>
                        ) : (
                          emailstatus != "success" &&
                          !AddressUserDetails &&
                          !AddressUserDetails.otpverified && (
                            <div className="input-group-append px-0">
                              <button
                                type="button"
                                className="btn-main m-0 px-3"
                                onClick={() => verifyemail()}
                              >
                                Verify email
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <div className="input-group mt-3">
                        {emailstatus == "pending" && (
                          <input
                            type="text"
                            className="form-control primary_inp mb-0"
                            id="otp"
                            name="otp"
                            onChange={inputChange}
                          />
                        )}
                        {emailstatus == "pending" && (
                          <div className="input-group-append px-0">
                            <button
                              type="button"
                              className="btn-main m-0 px-3"
                              onClick={() => verifyemail()}
                            >
                              Verify OTP
                            </button>
                          </div>
                        )}
                      </div>
                      {validateError.email && (
                        <span className="text-danger">
                          {validateError.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="name">
                        Bio <span className="text-muted">(Optional)</span>
                      </label>
                      {/*<input
                      type="text"
                      className="form-control primary_inp mb-0"
                      id="bio"
                      name="bio"
                      onChange={inputChange}
                      defaultValue={
                        AddressUserDetails && AddressUserDetails.bio
                          ? AddressUserDetails.bio
                          : ""
                      }
                    />*/}
                      <textarea
                        class="form-control primary_inp"
                        onChange={inputChange}
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself in brief"
                        rows="3"
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.bio
                            ? AddressUserDetails.bio
                            : ""
                        }
                      ></textarea>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="primary_label" htmlFor="name">
                        Mobile number <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        placeholder="ex: +1 123-456-7890"
                        type="number"
                        className="form-control primary_inp"
                        id="mobile"
                        name="mobile"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.mobile
                            ? AddressUserDetails.mobile
                            : ""
                        }
                      />
                      {/*<PhoneInput placeholder="Enter phone number" 
                    defaultCountry="IN"
                    value={mobile} 
                     onChange={setphoneNumber}/>
                    {validateError.mobile && <span className="text-danger"><br/>{validateError.mobile}</span>}*/}
                    </div>
                  </div>

                  <div className="form-row row mt-4">
                    <div className="form-group col-md-6">
                      <h5>Social media links <span className="text-muted">(Optional)</span></h5>
                    </div>
                  </div>
                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <input
                        placeholder="Twitter"
                        type="text"
                        className="form-control primary_inp"
                        id="twitter"
                        name="twitter"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.twitter
                            ? AddressUserDetails.twitter
                            : ""
                        }
                      />
                         {validateError.twitter && (
                        <span className="text-danger">
                          {validateError.twitter}
                        </span>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <input
                        placeholder="Youtube"
                        type="text"
                        className="form-control primary_inp"
                        id="youtube"
                        name="youtube"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.youtube
                            ? AddressUserDetails.youtube
                            : ""
                        }
                      />
                      {validateError.youtube && (
                        <span className="text-danger">
                          {validateError.youtube}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-row row">
                    <div className="form-group col-md-6">
                      <input
                        placeholder="Facebook"
                        type="text"
                        className="form-control primary_inp"
                        id="facebook"
                        name="facebook"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.facebook
                            ? AddressUserDetails.facebook
                            : ""
                        }
                      />
                        {validateError.facebook && (
                        <span className="text-danger">
                          {validateError.facebook}
                        </span>
                      )}
                    </div>
                  
                    <div className="form-group col-md-6">
                      <input
                        placeholder="Instagram"
                        type="text"
                        className="form-control primary_inp"
                        id="instagram"
                        name="instagram"
                        onChange={inputChange}
                        defaultValue={
                          AddressUserDetails && AddressUserDetails.instagram
                            ? AddressUserDetails.instagram
                            : ""
                        }
                      />
                         {validateError.instagram && (
                        <span className="text-danger">
                          {validateError.instagram}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="createPreview profileImgPreview">
                    <label className="primary_label">
                      Profile image preview
                    </label>
                    <div class="nft__item">
                      {TokenFilePreReader != "" ? (
                        <img
                          src={
                            TokenFilePreReader != ""
                              ? TokenFilePreReader
                              : require("../assets/images/profile_placeholder.png")
                          }
                          id="get_file_2"
                          class="lazy nft__item_preview"
                          alt=""
                        />
                      ) : AddressUserDetails &&
                        AddressUserDetails.image &&
                        AddressUserDetails.image != "" ? (
                        <img
                          src={
                            config.Back_URL +
                            "profile/" +
                            AddressUserDetails.image
                          }
                          id="get_file_2"
                          class="lazy nft__item_preview"
                          alt=""
                        />
                      ) : (
                        <img
                          src={
                            TokenFilePreReader != ""
                              ? TokenFilePreReader
                              : require("../assets/images/profile_placeholder.png")
                          }
                          id="get_file_2"
                          class="lazy nft__item_preview"
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-11 offset-lg-1">
                  <div className="mt-3 mb-3">
                    <button
                      type="button"
                      onClick={() => FormSubmit()}
                      className="btn-main"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
                {email != "" &&
                  email != undefined &&
                  mobile != "" &&
                  mobile != undefined && (
                    <div className="col-lg-11 offset-lg-1">
                      <p className="mb-0">
                        <label className="primary_label" htmlFor="desccription">
                          Verification
                        </label>
                      </p>
                      {AddressUserDetails &&
                        AddressUserDetails.verificationstatus != "inprocess" &&
                        AddressUserDetails.emailverified != true && (
                          <div className="mt-0">
                            <button
                              type="button"
                              onClick={() => submitmail()}
                              className="btn-main"
                            >
                              Request Verification
                            </button>
                          </div>
                        )}
                      {AddressUserDetails &&
                        AddressUserDetails.emailverified == true && (
                          <button type="button" className="btn-main">
                            Verified
                          </button>
                        )}
                      {AddressUserDetails &&
                        AddressUserDetails.verificationstatus ==
                          "inprocess" && (
                          <button type="button" className="btn-main">
                            Verification Pending
                          </button>
                        )}
                      <p className="text-muted mt-2">
                        Get your profile verified for more visibility and gain
                        trust on our marketplace.
                      </p>
                    </div>
                  )}

                {/* <div className="form-row row">
                  <div className="form-group col-md-12">
                    <p className="mb-2">
                      <label className="primary_label" htmlFor="desccription">
                        Verification
                      </label>
                    </p>

                    {AddressUserDetails && AddressUserDetails.emailverified == true && (
                      <button type="button" className="btn-main">Verified</button>
                    )}
                    {AddressUserDetails && AddressUserDetails.verificationstatus != "inprocess" &&
                      AddressUserDetails.emailverified != true && (
                          <button
                            type="button"
                            className="btn-main"
                            onClick={() => submitmail()}
                          >
                            Request Verification
                          </button>
                        )}
                    {AddressUserDetails && AddressUserDetails.verificationstatus == "inprocess" && (
                      <button type="button" className="btn-main">Verification Pending</button>
                    )}
                    <p className="text-muted mt-2">
                      Get your profile verified for more visibility and gain
                      trust on our marketplace.
                    </p>
                  </div>
                </div> */}
              </div>

              {/* </form> */}
            </div>
          </section>
          <Footer />
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
