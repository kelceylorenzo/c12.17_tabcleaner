import React from "react";

export default props => {
	let style = {
		backgroundColor: "",
		color: ""
	};

	if (props.item.selected) {
		style.backgroundColor = "green";
		style.color = "white";
	}

	return (
		<div className="tab" onClick={props.select} style={style}>
			<div className="tab-title">{props.item.title}</div>
			<div className="tab-screenshot" />
		</div>
	);
};
