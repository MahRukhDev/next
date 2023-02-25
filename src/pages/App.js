// import package
import React from "react";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";

import Home from "src/pages/Home";
import About from "src/pages/aboutCMS";
import Privacy from "./";
import Terms from "src/pages/Terms";
import Activity from "src/pages/Activity";
import ItemDetails from "src/pages/ItemDetails";
import EditProfile from "src/pages/EditProfile";
import ConnectWallet from "src/pages/ConnectWallet";
import Expolore from "src/pages/Explore";
import Exclusive from "src/pages/Exclusive";
import LiveAuction from "src/pages/LiveAuction";
import Collections from "src/pages/Collections";
import Myitems from "src/pages/Myitems";
import Create from "src/pages/Create";
import Ranking from "src/pages/Ranking";
import Browse from "src/pages/Browse";
import Support from "src/pages/Support";
import MyCollections from "src/pages/myowncollection";
import MyCollectiondetail from "src/pages/mycollection";
import Myfavorites from "src/pages/Myfavorities";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <ToastContainer />
      <Routes>
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/Browse" element={<Browse />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/create" element={<Create />} />
        <Route path="/mynfts" element={<Myitems />} />
        <Route path="/user/:paramAddress" element={<Myitems />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/mycollections" element={<MyCollections />} />
        <Route path="/collections/:id" element={<Collections />} />
        <Route path="/mycollections/:id" element={<MyCollectiondetail />} />
        <Route path="/myfavorites" element={<Myfavorites />} />
        <Route path="/explore" element={<Expolore />} />
        <Route path="/exclusive" element={<Exclusive />} />
        <Route path="/live-auction" element={<LiveAuction />} />
        <Route path="/connect-wallet" element={<ConnectWallet />} />
        <Route path="/item-details/:tokenidval" element={<ItemDetails />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/support" element={<Support />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
