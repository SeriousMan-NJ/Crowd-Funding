import React from 'react'

export default function UserDetail(props) {
  return (
    <React.Fragment>
      <h4>@ User's Details @</h4>
      <div># User Account: {props.address}</div>
      <div># The amount of ETH which user funds: {props.ether}</div>
      <div># The amount of Token which user currently holds: {props.token}</div>
    </React.Fragment>
  )
}
