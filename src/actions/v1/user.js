import axios from "axios";
import config from "../../lib/config";
import Web3 from "web3";
import "@metamask/legacy-web3";
import { toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";

toast.configure();
let toasterOption = config.toasterOption;

export const halfAddrShow = (addr) => {
  if (addr) {
    return addr.substring(0, 5) + "...." + addr.slice(addr.length - 5);
  } else {
    return "";
  }
};


export const getCurAddr = async () => {
  var currAddr = "";

  // if (window.ethereum) {
  //   var web3 = new Web3(window.ethereum);
  //   if (window.web3 && window.web3.eth && window.web3.eth.defaultAccount) {
  //     var accVal = await web3.eth.getAccounts();
  //     if(accVal[0]) {
  //       currAddr = accVal[0];
  //     }
  //     currAddr = window.web3.eth.defaultAccount;
  //     currAddr = currAddr.toString();

  //     return currAddr;
  //   }
  // }
  if(localStorage.getItem("nilwireMetamask") && localStorage.getItem("nilwireMetamask")!=null && localStorage.getItem("nilwireMetamask")!=undefined && localStorage.getItem("nilwireMetamask")!=""){
      if (
        localStorage.getItem("walltype") &&
        localStorage.getItem("walltype") != null &&
        localStorage.getItem("walltype") != undefined &&
        localStorage.getItem("walltype") != "" &&
        localStorage.getItem("walltype") == "trust"
      ) {
        var provider = new WalletConnectProvider({
          rpc: {
            [config.livechainid]: config.liverpcUrls,
          },
          chainId: config.livechainid,
        });

        provider.on("connect", () => {});

        await provider.enable();
        let web3 = new Web3(provider);
        var network = await web3.eth.net.getId();
        var result = await web3.eth.getAccounts();
        if (config.livechainid == network) {
          localStorage.setItem("walltype", "trust");
          localStorage.setItem("nilddsbashyujsd", "yes");
          localStorage.setItem("nilwireMetamask", result[0].toLowerCase());
          localStorage.setItem("nilwireMetamaskAddr", result[0].toLowerCase());
          var setacc = result[0].toLowerCase();
          var data = {
            address: result[0].toLowerCase(),
            provider: provider,
          };
          return result[0].toLowerCase();
        } else {
          await provider.disconnect();
        }
      } else {
        if (window.ethereum) {
          var web3 = new Web3(window.ethereum);
          try {
            if (typeof web3 !== "undefined") {
              await window.ethereum.enable();
              const web3 = new Web3(window.web3.currentProvider);
              if (window.web3.currentProvider.isMetaMask === true) {
                if (
                  window.web3 &&
                  window.web3.eth &&
                  window.web3.eth.defaultAccount
                ) {
                  if (
                    window.web3.currentProvider.networkVersion ==
                    config.networkVersion
                  ) {
                    var result = await web3.eth.getAccounts();
                    var data = {
                      address: result[0].toLowerCase(),
                    };
                    var myaddress = result[0].toLowerCase().toString();
                    return myaddress;
                  }
                }
              }
            }
          } catch (err) {}
        }
      }
  }
};


export const getActivity = async (data) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/getActivity`,
      data: data,
    });
    return Resp;
   
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const imageupdate = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/imageupdate`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {};
  }
};

export const collectionimageupdate = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/collectionimageupdate`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {};
  }
};

export const ToastShow = async (data) => {
  if (data.toast && data.toast.type && data.toast.msg) {
    if (data.toast.type == "success") {
      toast.success(data.toast.msg, toasterOption);
    } else {
      toast.error(data.toast.msg, toasterOption);
    }
  }
};

export const ParamAccountAddr_Detail_Get = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/address/details/get`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const verificationuser = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/verificationuser`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      result: Resp.data,
    };
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const getfaq = async (payload) => {
  try {
    let resp = await axios({
      method: "get",
      url: `${config.vUrl}/user/getfaq`,
    });
    return {
      result: resp.data.data,
    };
  } catch (err) {}
};

export const getWallet = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/getwallet`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      result: Resp.data,
    };
  } catch (err) {}
};
export const FollowChange_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/follow/change`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const newslettersAdd = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/newsletter`,
      data: Payload,
    });
    ToastShow(Resp.data);
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const PutOnSale_Action = async (Payload) => {};

export const UserProfile_Update_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/profileupdate`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: Payload,
    });
    ToastShow(Resp.data);
    return Resp;
  } catch (err) {
    return err;
  }
};

export const verifyotp = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/verifyotp`,
      data: Payload,
    });
    ToastShow(Resp.data);
    return Resp;
  } catch (err) {
    return err;
  }
};

export const verifymail = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/verifymail`,
      data: Payload,
    });
    ToastShow(Resp.data);
    return Resp;
  } catch (err) {
    return err;
  }
};

export const User_FollowList_Get_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/follow/list/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const User_Follow_Get_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/follow/get-follow/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const Topbuyer_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/top-buyer-list/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const Topseller_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/top-seller-list/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const Collectibles_Get_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/collectibles`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const changeReceiptStatus_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/changereceiptstatus`,
      data: Payload,
    });
    return {
      data: Resp,
    };
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const AddressUserDetails_GetOrSave_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/address/details/getorsave`,
      data: Payload,
    });
    return {
      data: Resp,
    };
  } catch (err) {
    return {
      error: err.response.data
    };
  }
};

// by muthu

export const User_Following_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/follow/following-list/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const Activity_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/activitylist/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const Activity_View_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/viewactivitylist/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const Requestsubscribe = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/newslettersub/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      error: err.response.data,
    };
  }
};

export const HistoryActivity_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/histotylist/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};

export const User_Followers_List_Action = async (Payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/user/follow/followers-list/`,
      data: Payload,
    });
    return Resp;
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
