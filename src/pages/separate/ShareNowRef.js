import React, { forwardRef, useImperativeHandle } from "react";
import "@metamask/legacy-web3";
import { InlineShareButtons } from "sharethis-reactjs";
import config from "../../lib/config";

import { toast } from "react-toastify";
toast.configure();
var Front_URL = config.Front_URL;

export const ShareNowRef = forwardRef((props, ref) => {
  const [ShareUrl, setShareUrl] = React.useState("");
  const [Show, setShow] = React.useState(false);

  useImperativeHandle(ref, () => ({
    async ShareSocial_Click(item) {
      if (item && item._id) {
        var url = Front_URL + "/item-details/" + item.tokenCounts;
        setShareUrl(url);
        window.$("#share_modal").modal("show");
        setShow(true);
      }
    },
  }));

  return (
    <div>
      <div
        class="modal fade primary_modal"
        id="share_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="share_modalCenteredLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="share_modalLabel">
                Share link to this page
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="socila_model_new">
                {Show && (
                  <InlineShareButtons
                    config={{
                      alignment: "center",
                      color: "social",
                      enabled: true,
                      font_size: 16,
                      language: "en",
                      networks: [
                        "telegram",
                        "facebook",
                        "twitter",
                        "instagram",
                      ],
                      padding: 12,
                      radius: 4,
                      show_total: false,
                      size: 40,
                      url: ShareUrl,
                      image: "https://bit.ly/2CMhCMC",
                      description: "Nilwire",
                      title: "Nilwire",
                      message:
                        "Hi visit Nilwire NFT and buy Article what You want",
                      subject:
                        "Hi visit Nilwire NFT and buy Article what You want",
                      username: "NilwireNFT",
                    }}
                  />
                )}
                {/*  <span><i class="fab fa-instagram"></i></span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
