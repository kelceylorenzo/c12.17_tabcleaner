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
		<div onClick={props.select} style={style}>
			{props.item.title}
		</div>
	);
};
