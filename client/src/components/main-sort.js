import React, { Component } from 'react';

let sortOptions = [];

export default (props) => {
	sortOptions = [
		{
			name: 'Window',
			type: 'window',
			style: {}
		},
		{
			name: 'Time',
			type: 'time',
			style: {}
		},
		{
			name: 'Title (A-Z)',
			type: 'az',
			style: {}
		},
		{
			name: 'Title (Z-A)',
			type: 'za',
			style: {}
		}
	];

	for (let sortOptionsIndex = 0; sortOptionsIndex < sortOptions.length; sortOptionsIndex++) {
		if (props.sortType === sortOptions[sortOptionsIndex].type) {
			sortOptions[sortOptionsIndex].style = {
				cursor: 'pointer',
				color: 'black',
				borderBottom: '2px solid rgb(212, 167, 129)',
				paddingBottom: '2%'
			};
		}
	}

	const sortList = sortOptions.map((sortOption, index) => {
		return (
			<p
				key={index}
				className="sort-by-option"
				style={sortOption.style}
				onClick={() => props.sort(sortOption.type)}
			>
				{sortOption.name}
			</p>
		);
	});

	return (
		<div className="sort-by-menu">
			<p className="sort-by-title">Sort By:</p>
			{sortList}
		</div>
	);
};
