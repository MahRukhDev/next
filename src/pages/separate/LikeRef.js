import React, {
    forwardRef,
    useImperativeHandle
} from 'react';

import Web3 from 'web3';
import '@metamask/legacy-web3'
import $ from 'jquery';
import config from '../../lib/config';

import {
    AddLikeAction,
    GetLikeDataAction
} from '../../actions/v1/token';

import {
    getCurAddr
} from '../../actions/v1/user';

import { toast } from 'react-toastify';
import { getmylog } from '../../helper/walletconnect';

toast.configure();
let toasterOption = config.toasterOption;

export const LikeRef = forwardRef((props, ref) => {

    async function getLikesDataCall () {
        try{
            var currAddr = await getCurAddr();
            if(currAddr) {
                var payload = {
                    currAddr: currAddr
                }
                var check = await GetLikeDataAction(payload);
                if(check && check.data && check.data.records) {
                    props.setLikedTokenList(check.data.records);
                }
            }
        }catch(err){
            
        }
    }

    useImperativeHandle(
        ref,
        () => ({
            async getLikesData() {
                getLikesDataCall();
            },
            async hitLike(data) {
                 var mydata = await getmylog();
                  const web3 =  new Web3(mydata && mydata.provider && mydata.provider!=null && mydata.provider!=undefined && mydata.provider!=""?mydata.provider:window.ethereum);
                  var curAddr = await web3.eth.getAccounts();
                if(
                    web3
                    && web3.eth
                   
                ) {
                    var connectwallet=localStorage.getItem("nilwireMetamask");
                    if(!connectwallet){
                        toast.error("Please connect to a Metamask wallet", toasterOption);
                        return false;
                    }
                    // var currAddr = localStorage.getItem("nilwireMetamask");
                    var currAddr = await getCurAddr();
                        console.log(currAddr,'CurCur123456');
                    var likeData = {
                        currAddr: currAddr,
                        tokenCounts: data.tokenCounts,
                        tokenOwner: data.tokenOwner,
                    }
                    var resp = await AddLikeAction(likeData);
                    if(resp && resp.data && resp.data.toast && resp.data.toast.msg) {
                        console.log(resp.data,'resp.data-resp.data');
                        if(resp.data.toast.type == 'success') {
                            toast.success(resp.data.toast.msg, toasterOption);
                            if(
                                resp.data.tokenData
                                && resp.data.tokenData.record
                                && typeof resp.data.tokenData.record.likecount != 'undefined'
                            ) {
                                $('.'+data.tokenCounts+'-likecount').html(resp.data.tokenData.record.likecount);
                            }
                        }
                    }
                    getLikesDataCall();
                }
            }
        }),
    )
    return (
      <div></div>
    )
})

