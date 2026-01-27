import React, { useState } from "react";
import { get, post } from "../../../utilities";
import { Quest } from "../../../../../shared/types";
import CoinDrop from "./CoinDrop";
import "./NewQuest.css";

export default function NewQuest() {
  return (
    <div className="new-quest-container">
      <CoinDrop />
    </div>
  );
}
