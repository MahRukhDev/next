import React, { useEffect } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { getterms } from "../actions/v1/token";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import { Helmet } from "react-helmet";

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Terms() {
  const [terms, setterms] = React.useState("");

  useEffect(() => {
    getcms();
  }, []);

  async function getcms() {
    var result = await getterms();
    setterms(result.result.data.data.content);
  }
  return (
    <div id="wrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nilwire - Terms</title>
      </Helmet>
      <ScrollToTopOnMount />
      <Header />
      <div className="no-bottom" id="content">
        <section className="cmsContent">
          <div className="container">{ReactHtmlParser(terms)}</div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
