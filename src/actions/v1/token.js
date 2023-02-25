import axios from "axios";
import config from "../../lib/config";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

export const ToastShow = async (data) => {
  if (data.toast && data.toast.type && data.toast.msg) {
    if (data.toast.type == "success") {
      toast.success(data.toast.msg, toasterOption);
    } else {
      toast.error(data.toast.msg, toasterOption);
    }
  }
};
export const headerSearch = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/headerSearch`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err,
    };
  }
};

export const getreportcategory = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/getreportcategory`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const addapprove = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/addapprove`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getapprove = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/getapprove`,
      data: data,
    });

    return {
      loading: false,
      data: respData,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const GetCollections = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/GetCollections`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getDetailsCollections = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/getDetailsCollections`,
      data: data,
    });
    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getTopsellers = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/getTopsellers`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const GetUserCollection = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/GetUserCollection`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getHotCollections = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/getHotCollections`,
      data: data,
    });

    return {
      loading: false,
      data: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getterms = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.Back_URL}api/token/getterms`,
      data,
    });
    return {
      loading: true,
      result: respData,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getabout = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.Back_URL}api/token/getabout`,
      data,
    });
    return {
      loading: true,
      result: respData,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const getprivacy = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.Back_URL}api/token/getprivacy`,
      data,
    });
    return {
      loading: true,
      result: respData,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};

export const Collection_Create = async (Payload) => {
  var bodyFormData = new FormData();
  bodyFormData.append("useraddress", Payload.useraddress);
  bodyFormData.append("newcontract", Payload.newcontract);
  bodyFormData.append("collectionname", Payload.collectionname);
  bodyFormData.append("collectionsymbol", Payload.collectionsymbol);
  bodyFormData.append("collectiondescription", Payload.collectiondescription);
  bodyFormData.append("imageUser", Payload.imageUser);
  bodyFormData.append("type", Payload.type);
  bodyFormData.append("url", Payload.url);
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/create`,
      data: bodyFormData,
    });
    return {
      data: respData.data,
    };
  } catch (err) {
    return {
      error: err.response.data,
    };
  }
};

export const Collection_Validate = async (Payload) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/collection/validate`,
      data: Payload,
    });
    return {
      error: respData.errors,
      status: respData.status,
    };
  } catch (err) {
    return {
      error: err.response.data,
    };
  }
};

export const getcmsdetails = async (data) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.vUrl}/token/getcmsdetails`,
    });
    return {
      loading: false,
      result: respData.data,
    };
  } catch (err) {
    return {
      loading: false,
      error: err,
    };
  }
};

export const getowncollections = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/getmycollection`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const getallcollections = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/getlistcollection`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const CancelBid_Action = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/bid/cancel`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const acceptBId_Action = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/bid/accept`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const getbannercollection = async (data) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.vUrl}/token/gettopcollections`,
      headers: {
        Authorization: localStorage.admin_token,
      },
    });
    return {
      loading: false,
      result: respData.data,
    };
  } catch (err) {
    var sendErr = "";
    if (err) {
      sendErr = err;
      if (err.response) {
        sendErr = err.response;
        if (err.response.data) {
          sendErr = err.response.data;
          if (err.response.data.errors) {
            sendErr = err.response.data.errors;
          }
        }
      }
    }
    return {
      loading: false,
      error: sendErr,
    };
  }
};

export const getsettinglist = async (data) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.Back_URL}v2/getsettings`,
      headers: {
        Authorization: localStorage.admin_token,
      },
      data,
    });
    return {
      loading: false,
      result: respData.data,
    };
  } catch (err) {
    var sendErr = "";
    if (err) {
      sendErr = err;
      if (err.response) {
        sendErr = err.response;
        if (err.response.data) {
          sendErr = err.response.data;
          if (err.response.data.errors) {
            sendErr = err.response.data.errors;
          }
        }
      }
    }
    return {
      loading: false,
      error: sendErr,
    };
  }
};
export const Bidding_Detail_Action = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/bid/bidtotalamount`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};

export const BidApply_ApproveAction = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/bid/apply`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const ReportRequest = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/submit-report`,
      data: data,
    });
    return {
      loading: false,
      status: respData.data.status,
    };
  } catch (err) {
    return {
      loading: false,
      error: err,
    };
  }
};
export const getwhitelist = async (payload) => {
  try {
    let Resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/getwhitelist`,
      data: payload,
    });
    ToastShow(Resp.data);
    return {
      data: Resp.data,
    };
  } catch (err) {}
};
export const TokenCounts_Get_Detail_Action = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/tokenCounts`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const getBuyerSeller = async (data) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/getBuyerSeller`,
      data: data,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const PurchaseNow_Complete_Action = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/purchase/complete`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const MinMaxChange_update_Action = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/minmax/change`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const TokenPriceChange_update_Action = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/price/change`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const TokenCount_Get_Action = async (payload) => {
  try {
    let resp = await axios({
      method: "get",
      url: `${config.vUrl}/token/count/get`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const TokenAddItemAction = async (payload) => {
  try {
    var formData = new FormData();
    if (payload.Image) {
      formData.append("Image", payload.Image);
    }
    if (payload.position) {
      formData.append("position", payload.position);
    }
    if (payload.ipfsimage) {
      formData.append("ipfshash", payload.ipfsimage);
    }
    if (payload.Name) {
      formData.append("Name", payload.Name);
    }
    if (payload.Count) {
      formData.append("Count", payload.Count);
    }
    if (payload.Description) {
      formData.append("Description", payload.Description);
    }
    if (payload.Price) {
      formData.append("Price", payload.Price);
    }
    if (payload.MaximumBid) {
      formData.append("MaximumBid", payload.MaximumBid);
    }
    if (payload.TokenPrice) {
      formData.append("TokenPrice", payload.TokenPrice);
    }
    if (payload.Royalities) {
      formData.append("Royalities", payload.Royalities);
    }
    if (payload.Category_label) {
      formData.append("Category_label", payload.Category_label);
    }
    if (payload.Bid) {
      formData.append("Bid", payload.Bid);
    }
    if (payload.Properties) {
      formData.append("Properties", payload.Properties);
    }
    if (payload.Owner) {
      formData.append("Owner", payload.Owner);
    }
    if (payload.Creator) {
      formData.append("Creator", payload.Creator);
    }
    if (payload.CategoryId) {
      formData.append("CategoryId", payload.CategoryId);
    }
    if (payload.Quantity) {
      formData.append("Quantity", payload.Quantity);
    }
    if (payload.Balance) {
      formData.append("Balance", payload.Balance);
    }
    if (payload.ContractAddress) {
      formData.append("ContractAddress", payload.ContractAddress);
    }
    if (payload.Status) {
      formData.append("Status", payload.Status);
    }
    if (payload.HashValue) {
      formData.append("HashValue", payload.HashValue);
    }
    if (payload.Type) {
      formData.append("Type", payload.Type);
    }
    if (payload.MinimumBid) {
      formData.append("MinimumBid", payload.MinimumBid);
    }
    if (payload.EndClocktime) {
      formData.append("EndClocktime", payload.EndClocktime);
    }
    if (payload.Clocktime) {
      formData.append("Clocktime", payload.Clocktime);
    }
    if (payload.UnLockcontent) {
      formData.append("UnLockcontent", payload.UnLockcontent);
    }
    if (payload.PutOnSale) {
      formData.append("PutOnSale", payload.PutOnSale);
    }
    if (payload.PutOnSaleType) {
      formData.append("PutOnSaleType", payload.PutOnSaleType);
    }
    if (payload.currencyName) {
      formData.append("currencyName", payload.currencyName);
    }

    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/add/item`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    return { data: respData.data };
  } catch (err) {
    return { error: err };
  }
};

export const TokenAddOwnerAction = async (payload) => {
  try {
    var SendData = {};
    if (payload.Count) {
      SendData.Count = payload.Count;
    }
    if (payload.Price) {
      SendData.Price = payload.Price;
    }
    if (payload.TokenPrice) {
      SendData.TokenPrice = payload.TokenPrice;
    }
    if (payload.Owner) {
      SendData.Owner = payload.Owner;
    }
    if (payload.Balance) {
      SendData.Balance = payload.Balance;
    }
    if (payload.Quantity) {
      SendData.Quantity = payload.Quantity;
    }
    if (payload.ContractAddress) {
      SendData.ContractAddress = payload.ContractAddress;
    }
    if (payload.Type) {
      SendData.Type = payload.Type;
    }
    if (payload.HashValue) {
      SendData.HashValue = payload.HashValue;
    }
    if (payload.biddingtoken) {
      SendData.biddingtoken = payload.biddingtoken;
    }
    if (payload.Status) {
      SendData.Status = payload.Status;
    }
    if (payload.currencyName) {
      SendData.currencyName = payload.currencyName;
    }

    let resp1Data = await axios({
      method: "post",
      url: `${config.vUrl}/token/add/owner`,
      data: SendData,
    });
    return { data: resp1Data.data };
  } catch (err) {
    return {
      //errors: err.response.data
    };
  }
};

export const CreateTokenValidationAction = async (payload) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/add/item/validation`,
      data: payload,
    });
    return {
      data: respData.data,
    };
    
  } catch (err) {}
};
export const CreateCollectionValidationAction = async (payload) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/add/collectionitem/validation`,
      data: payload,
    });
    return {
      data: respData.data,
    };
  } catch (err) {}
};
export const gettop3lsit = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.vUrl}/token/token/top3list`,
    });
    return {
      data: respData.data,
    };
  } catch (err) {}
};

export const GetCategoryAction = async (payload) => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.vUrl}/token/category/list`,
      data: payload,
    });
    return {
      data: respData.data,
    };
  } catch (err) {}
};

export const GetLikeDataAction = async (payload) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/like/list`,
      data: payload,
    });
    return {
      data: respData.data,
    };
  } catch (err) {}
};

export const AddLikeAction = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/like`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const CollectiblesList_MyItems = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/myitems`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const CollectiblesList = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/collection`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export const CollectiblesList_Home = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/home`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const CollectiblesList_Favorities = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/myfavorities`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const CollectiblesList_All = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/allimages`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};
export const CollectiblesList_Follow = async (payload) => {
  try {
    let resp = await axios({
      method: "post",
      url: `${config.vUrl}/token/collectibles/list/follow`,
      data: payload,
    });
    return {
      data: resp.data,
    };
  } catch (err) {}
};

export async function activityUpdate(data) {
  try {
    let checkAddr = await axios({
      method: "post",
      url: `${config.vUrl}/token/test/activityUpdate`,
      data: data,
    });
    return {
      data: checkAddr.data,
    };
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
}

export const BurnField = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/BurnField`,

      data: data,
    });
    return {
      loading: false,
    };
  } catch (err) {
    return {
      loading: false,
      error: err.response.data.errors,
    };
  }
};
export const ipfsmetadatafunciton = async (payload) => {
  var formData = new FormData();
  // if(payload.Image) { formData.append('Image', payload.Image); }
  if (payload.name) {
    formData.append("name", payload.name);
  }
  if (payload.image) {
    formData.append("image", payload.image);
  }
  if(payload.tokenId){
    formData.append("tokenId",payload.tokenId)
  }
  // if(payload.description) { formData.append('description', payload.description); }

  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/ipfsmetadata`,
      data: formData,
    });
    return {
      data: respData.data,
    };
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
export const ipfsImageHashGet = async (payload) => {
  var formData = new FormData();
  if (payload.Image) {
    formData.append("Image", payload.Image);
  }
  if (payload.TokenName) {
    formData.append("name", payload.TokenName);
  }
  if (payload.tokenid) {
    formData.append("tokenid", payload.tokenid);
  }

  try {
    let respData = await axios({
      method: "post",
      url: `${config.vUrl}/token/ipfsImageHashGet`,
      data: formData,
    });
    return {
      data: respData.data,
    };
  } catch (err) {
    return {
      // error: err.response.data
    };
  }
};
