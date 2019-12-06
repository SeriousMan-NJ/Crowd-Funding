import React from "react";
import {
  Link
} from "react-router-dom";

export default function Main() {
  return (
    <div className="Main">
      <div>
        <p>Welcome to crowdfunding</p>
      </div>
      <div>
        <Link to="/beneficiary">
          <button>I'm a beneficiary</button>
        </Link>
      </div>
      <div>
        <Link to="/investor">
          <button>I'm an investor</button>
        </Link>
      </div>
    </div>
  );
}
