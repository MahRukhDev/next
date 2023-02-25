import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "@material-ui/core";
import "@metamask/legacy-web3";

import config from "../../lib/config";

import { toast } from "react-toastify";
toast.configure();
let toasterOption = config.toasterOption;

export const ReportNowRef = forwardRef((props, ref) => {
  const [description, setdescription] = React.useState("");
  const [ValidateError, Set_ValidateError] = React.useState({});
  const [itemId, Set_itemId] = React.useState("");
  const [tokenCounts, Set_tokenCounts] = React.useState("");
  const [reportBtn, Set_reportBtn] = React.useState(false);

  var { UserAccountAddr } = props;

  useImperativeHandle(ref, () => ({
    async SubmitReport_Click(item) {
      if (item && item._id) {
        Set_itemId(item._id);
        Set_tokenCounts(item.tokenCounts);
        window.$("#report_modal").modal("show");
      }
    },
  }));

  const inputChange = (e) => {
    if (e && e.target && typeof e.target.value != "undefined") {
      var value = e.target.value;
      setdescription(value);
      if (e.target.value != "") {
        Set_ValidateError({});
      }
    }
  };

  const ReportValidation = async (data = {}) => {
    var ValidateError = {};
    if (description == "" || typeof description == "undefined") {
      ValidateError.description = '"Message" is not allowed to be empty';
    }

    Set_ValidateError(ValidateError);
    return ValidateError;
  };

  async function submitReport() {
    var errors = await ReportValidation();
    var errorsSize = Object.keys(errors).length;
    if (errorsSize != 0) {
      toast.error(
        "Form validation error, please fill all the required fields",
        toasterOption
      );
      return false;
    }
    var reqData = {
      reportuser: UserAccountAddr,
      description: description,
      itemId: itemId,
      tokenCounts: tokenCounts,
      type: "collection",
    };
    Set_reportBtn(true);
    var response = await ReportRequest(reqData);
    if (response && response.status == "true") {
      toast.success("Successfully submit your report", toasterOption);
      setdescription("");
      Set_reportBtn(false);
      window.$("#report_modal").modal("hide");
    } else {
      Set_reportBtn(false);
      toast.error("Oops something went wrong.!", toasterOption);
    }
  }

  async function cancelReport() {
    setdescription("");
    window.$("#report").modal("hide");
    Set_ValidateError({});
  }

  return (
    <div>
      <div class="modal report primary_modal" id="social">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Share link</h4>
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div class="modal-body">
              <div className="social_icons_section">
                <a href="">
                  <i class="fab fa-facebook"></i>
                </a>
                <a href="">
                  <i class="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
