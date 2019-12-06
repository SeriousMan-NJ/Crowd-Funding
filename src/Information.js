import React from "react";

export default class Information extends React.Component {
  render() {
    return (
      <div className="Beneficiary">
        <div>
            <p>Current status: ##### {this.props.ended ? "Crowd funding already ended." : "Crowd funding is still under way."} #####</p>
        </div>
        <div>
          <p>The amount of currently remaining token: {
          this.props.remainingToken} CTK</p>
        </div>
        <div>
          <p>The amount of currently funded ETH: {
          this.props.fundedAmount}(Current) / {this.props.goalAmount}(Total) ETH</p>
        </div>
      </div>
    );
  }
}
