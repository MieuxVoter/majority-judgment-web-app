/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

class HelpButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };
  }

  showTooltip = () => {
    this.setState({
      tooltipOpen: true
    });
  };

  hideTooltip = () => {
    this.setState({
      tooltipOpen: false
    });
  };

  render() {
    return (
      <span className={this.props.className}>
        <span>
          {this.state.tooltipOpen ? (
            <span
              style={{
                position: "absolute",
                zIndex: 10,
                fontSize: "12px",
                color: "#000",
                backgroundColor: "#fff",
                display: "inline-block",
                borderRadius: "0.25rem",
                boxShadow: "-5px 0 5px rgba(0,0,0,0.5)",
                maxWidth: "200px",
                padding: "10px",
                marginLeft: "-215px",
                marginTop: "-25px"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "10px solid #fff",
                  marginLeft: "190px",
                  marginTop: "15px"
                }}
              ></span>
              {this.props.children}
            </span>
          ) : (
            <span />
          )}
        </span>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          onMouseOver={this.showTooltip}
          onMouseOut={this.hideTooltip}
        />
      </span>
    );
  }
}
export default HelpButton;
