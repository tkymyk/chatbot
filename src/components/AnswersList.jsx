import React from 'react';
import {Answer} from './index';

// const AnswersList = (props) => {
// 	return(
// 		<div class="c-grid__answer">
// 			{props.answers.map((value, index) => {
// 				return <Answer content={value.content} nextId={value.nextId} key={index.toString()} select={props.select}/>
// 			})}
// 		</div>
// 	)
// }

const AnswersList = (props) => {
	return(
		<div className="c-grid__answer">
			{props.answers.map((key, index) => {
				return <Answer answer={props.answers[index]} key={index.toString()} select={props.select} />
			})}
		</div>
	);
};

export default AnswersList