import React, { useState, useEffect, useCallback } from 'react';
// import defaultDataset from "./dataset";
import './styles/style.css';
import { AnswersList, Chats, Loading } from './components/index';
import FormDialog from './components/Forms/FormDialog';
import { db } from './firebase/index'

const App = () => {
	// React Hook
	const [answers, setAnswers] = useState([]);
	const [chats, setChats] = useState([]);
	const [currentId, setCurrentId] = useState('init');
	const [dataset, setDataset] = useState({});
	const [open, setOpen] = useState(false);

	// 問い合わせフォーム用モーダルを開く
	const handleOpen = useCallback(() => {
		setOpen(true)
	}, [setOpen]);

	// 問い合わせフォーム用モーダルを閉じる
	const handleClose = useCallback(() => {
		setOpen(false)
	}, [setOpen]);

	// 新しいチャットを追加する
	const addChats = useCallback((chat) => {
		setChats(prevChats => {
			return [...prevChats, chat]
		})
	}, [setChats]);

	// 次の質問をチャットエリアに表示
	const displayNextQuestion = (nextQuestionId, nextDataset) => {
		addChats({
			text: nextDataset.question,
			type: 'question'
		})

		// 次の回答一覧をセット
		setAnswers(nextDataset.answers)
		// 現在の質問Idをセット
		setCurrentId(nextQuestionId)
	}

	// 回答が選択されたときに呼ばれる
	const selectAnswer = (selectedAnswer, nextQuestionId) => {
		switch (true) {
			// 「お問い合わせ」が選択された場合
			case (nextQuestionId === 'contact'):
				handleOpen();
				break;

			// リンクが選択された場合
			case (/ˆhttps:*/.test(nextQuestionId)):
				const a = document.createElement('a');
				a.hreaf = nextQuestionId;
				a.target = '_brank'; //別タブで開く
				a.click();
				break;

			// 選択された回答をchatsに追加
			default:
				addChats({
					text: selectedAnswer,
					type: 'answer'
				})

				setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 500);
				break;
		}
	}

	// 最初の質問をチャットエリアに表示
	useEffect(()=> {
		(async () => {
			const initDataset = {};

			// questionsをfirestoreから取得
			await db.collection('questions').get().then(snapshots => {
				snapshots.forEach(doc => {
					const id = doc.id
					const data = doc.data()
					initDataset[id] = data
				})
			})

			// データセットを反映
			setDataset(initDataset);

			// 最初の質問を表示
			displayNextQuestion(currentId, initDataset[currentId])
		})();
	}, []);

	// チャットの更新によって自動スクロール
	useEffect(() => {
		const scrollArea = document.getElementById('scroll-area');
		if (scrollArea) {
			scrollArea.scrollTop = scrollArea.scrollHeight;
		}
	});


	return (
		<section className="c-section">
			<div className="c-box">
				{(Object.keys(dataset).length === 0 ) ? (
					<Loading />
				) : (
					<>
						<Chats chats={chats} />
						<AnswersList answers={answers} select={selectAnswer} />	
					</>	
				)}
				<FormDialog open={open} handleOpen={handleOpen} handleClose={handleClose} />
			</div>
		</section>
	);
}


export default App;