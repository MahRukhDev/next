/*eslint-disable*/
import React, { useEffect, useState } from "react";
// react components for routing our app without refresh
import { Link, NavLink, useParams } from "react-router-dom";
import SelectReact from "react-select";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { toastAlert } from "../../actions/toastAlert";
import {
  headerSearch,
  CollectiblesList_Home,
  GetCategoryAction,
} from "../../actions/v1/token";
import { getCurAddr } from "../../actions/v1/user";
import config from "../../lib/config";
const IPFS_IMGurl = config.IPFS_IMG;

export default function Searchref(props) {
  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "null" : null,
      };
    },
  };
  const [searchstatus, setsearchstatus] = React.useState(false);
  const [itemList, setitemList] = React.useState([]);
  const [userList, setuserList] = React.useState([]);
  const [keylist, setkeylist] = React.useState([]);
  const [typelist, settypelist] = React.useState([]);
  const [Keyword, Set_Keyword] = React.useState("");
  const [CategoryOption, setCategoryOption] = useState(0);

  useEffect(() => {
    getInit();
  }, []);

  var {
    setTokenList,
    TokenList,
    aucttype,
    categoryid,
    categorysearch,
    startprice,
    endprice,
    typesearch,
    namesearch,
  } = props;

  async function getInit() {
    await GetCategoryCall();
  }

  async function GetCategoryCall() {
    var resp = await GetCategoryAction();
    if (resp && resp.data && resp.data.list) {
      var CategoryOption = [];
      resp.data.list.map((item) => {
        CategoryOption.push({
          name: "TokenCategory",
          value: item._id,
          label: item.category,
        });
      });
      setCategoryOption(CategoryOption);
    }
    if (props.aucttype == "no") {
      var keyopt = [
        
        {
          value: "buy",
          label: "Buy now",
        },
        {
          value: "auction",
          label: "On auction",
        },
      ];
      setkeylist(keyopt);
    } else {
      var keyopt = [
        {
          value: "auction",
          label: "On auction",
        },
      ];
      setkeylist(keyopt);
    }

    var typelst = [
      // {
      //   value: "all",
      //   label: "All items",
      // },
      {
        value: "single",
        label: "Single item",
      },
      {
        value: "multiple",
        label: "Bundles",
      },
      {
        value: "recent",
        label: "Recently added",
      },
    ];
    settypelist(typelst);
  }

  const searchChange = async (e) => {
    var value = e.target.value;
    props.setnamesearch(value);
  };

  async function closesearch() {
    //setsearchstatus(false)
  }

  const startchange = (e) => {
    props.setstartprice(e.target.value);
  };

  const endchange = (e) => {
    props.setendprice(e.target.value);
  };

  async function changeCategory(val) {
    props.setcategorysearch(val.label);
    props.setcategoryid(val.value);
  }

  async function keychange(val) {
    props.setkeysearch(val.value);
  }

  async function typechange(val) {
    props.settypesearch(val.value);
  }

  async function searchstart() {
    var currAddr = await getCurAddr();
    var name = props.categorysearch;
    var mylimit = props && props.from && props.from == "liveact" ? 1000 : 12;
    var payload = {
      limit: mylimit,
      page: 1,
      currAddr: currAddr,
      CatName: props.categoryid,
      namesearch: props.namesearch,
      typesearch: props.typesearch,
      startprice: props.startprice,
      endprice: props.endprice,
      keysearch: props.keysearch,
      aucttype: props.aucttype,
      from: "Home",
    };
    var resp = await CollectiblesList_Home(payload);
    console.log(resp,"============collectiblelisthomehome")
    if (
      resp &&
      resp.data &&
      resp.data.from == "token-collectibles-list-home" &&
      resp.data.list.length > 0
    ) {
      props.setshowloadmore(false);
      props.setTokenList(resp.data.list);
      if (props && props.from && props.from == "liveact") {
      } else if (resp.data.list.length >= 12) {
        props.setshowsearchloadmore(true);
      } else {
        props.setshowsearchloadmore(false);
      }
    } else {

      if (props && props.from && props.from == "liveact") {
      } else if (resp.data.list.length >= 12) {
        props.setshowsearchloadmore(true);
      } else {
        props.setshowsearchloadmore(false);
      }
      props.setTokenList(resp.data.list);
    }
  }

  return (
    <div class="col-lg-12">
      <div className="itemFilterTop">
        <div class="items_filter">
          <form
            class="row form-dark"
            id="form_quick_search"
            name="form_quick_search"
          >
            <div class="col text-center">
              <input
                class="form-control"
                id="search"
                name="search"
                onChange={searchChange}
                value={props.namesearch}
                placeholder="search item here..."
                type="text"
              />{" "}
              <a href="#" onClick={() => searchstart()} id="btn-submit">
                <i class="fa fa-search bg-color-secondary"></i>
              </a>
              <div class="clearfix"></div>
            </div>
          </form>

          <div id="item_category" class="dropdown">
            <SelectReact
              id="collection"
              onChange={changeCategory}
              options={CategoryOption}
              placeholder={"All categories"}
              styles={colourStyles}
            />
          </div>

          <div id="buy_category" class="dropdown">
            <SelectReact
              id="list"
              onChange={keychange}
              options={keylist}
              placeholder={"All items"}
              styles={colourStyles}
            />
          </div>

          <div id="items_type" class="dropdown">
            <SelectReact
              id="list"
              onChange={typechange}
              options={typelist}
              placeholder={"All items"}
              styles={colourStyles}
            />
          </div>

          <a
            class="btn btn-selector clas_bottons"
            data-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Price
          </a>
          <button
            type="button"
            className="btn btn-main btnGo"
            onClick={() => searchstart()}
          >
            Go
          </button>
        </div>
        {props && props.from && props.from == "liveact" ? (
          ""
        ) : (
          <div className="itemCount">
            <p>{TokenList.length} Items</p>
          </div>
        )}
      </div>
      <div class="collapse mb-3 mar-000_minus" id="collapseExample">
        <div class="card card-body boredr">
          <div className="price_range">
            <label>Custom Range:</label>
            <div className="input_section_price">
              <div>
                <input type="number" onChange={startchange} />
              </div>
              <span>ETH</span>
            </div>
            <span>-</span>
            <div className="input_section_price">
              <div>
                <input type="number" onChange={endchange} />
              </div>
              <span>ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
