import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

function IndexButton(props) {
	return <button className="hidden-square">{props.index}</button>;
}

function playerWin(squares, length) {
	//rows
	for (let i = 0; i < length ** 2; i += length) {
		if (squares[i] && squares.slice(i, i + length).every(val => (squares[i] === val)))
			return true;
	}

	//columns
	for (let i = 0; i < length; i++) {
		if (squares[i] && squares.filter((_, index) => (index % length === i)).every(val => (squares[i] === val)))
			return true;
	}

	// backslash and slash
	if (
		(squares[0] &&
			squares.filter(
				(_, index) => (index % length === Math.floor(index / length))
			).every(val => (squares[0] === val))
		) ||
		(squares[length - 1] &&
			squares.filter(
				(_, index) => (length - 1 - index % length === Math.floor(index / length))
			).every(val => (squares[length - 1] === val))
		)
	)
		return true;

	return false;
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				key={i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	renderRow(row) {
		const rowSquare = Array.from({ length: this.props.length }, (_, index) => this.renderSquare(row * this.props.length + index));
		return (
			<div className="board-row" key={row}>
				<IndexButton index={row} /> {rowSquare}
			</div>
		);
	}

	render() {
		const rowIndex = Array.from({ length: this.props.length }, (_, index) => <IndexButton key={index} index={index} />);
		const squares = Array.from({ length: this.props.length }, (_, index) => this.renderRow(index));
		return (
			<div>
				<div className="board-row">
					<IndexButton /> {rowIndex}
				</div>

				{squares}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(this.props.length ** 2).fill(null), position: null }],
			steps: 0,
			ascending: true
		};
	}

	handleClick(i) {
		let squares = this.state.history[this.state.steps].squares.slice();
		if (squares[i] !== null || playerWin(squares, this.props.length)) return;

		squares[i] = (this.state.steps % 2 === 0) ? 'X' : 'O';
		this.setState(({history, steps}) => ({
			history: history.slice(0, steps + 1).concat([{
				squares: squares,
				position: [Math.floor(i / this.props.length), i % this.props.length]
			}]),
			steps: steps + 1
		}));
	}

	historyButton(steps) {
		return (
			<li key={steps}>
				<button
					onClick={() => this.setState({ steps })}
					className={this.state.steps === steps ? 'button-bold' : null}
				>
					{steps === 0 ? 'Go to game start' : `Go to step #${steps}, (${this.state.history[steps].position})`}
				</button>
			</li>
		);
	}

	render() {
		const log = this.state.history[this.state.steps];
		const player = this.state.steps % 2 === 0 ? 'X' : 'O';
		let status;
		if (playerWin(log.squares, this.props.length))
			status = `Winner: ${player === 'O' ? 'X' : 'O'}`;
		else
			status = `Next player: ${player}`;

		let moves = this.state.history.map((_, steps) => this.historyButton(steps));
		if (!this.state.ascending)
			moves.reverse();

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={log.squares}
						onClick={(i) => this.handleClick(i)}
						length={this.props.length}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<div>
					<button onClick={() => this.setState(({ascending}) => ({ ascending: !(ascending) }))}>
						{this.state.ascending ? 'descending' : 'ascending'}
					</button>
					</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game length={3} />, document.getElementById("root"));
