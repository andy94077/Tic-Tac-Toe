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

function playerWin(squares) {
	for (let i = 0; i < 9; i += 3) {
		if (squares[i] && squares[i] === squares[i + 1] && squares[i] === squares[i + 2])
			return true;
	}

	for (let i = 0; i < 3; i++) {
		if (squares[i] && squares[i] === squares[i + 3] && squares[i] === squares[i + 6])
			return true;
	}

	if (
		(squares[0] && squares[0] === squares[4] && squares[0] === squares[8]) ||
		(squares[2] && squares[2] === squares[4] && squares[2] === squares[6])
	)
		return true;

	return false;
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
				<button class="hidden-square"/> <button class="hidden-square">0</button> <button class="hidden-square">1</button> <button class="hidden-square">2</button>
				</div>
				<div className="board-row">
					<button class="hidden-square">0</button> {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}
				</div>
				<div className="board-row">
					<button class="hidden-square">1</button>{this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}
				</div>
				<div className="board-row">
					<button class="hidden-square">2</button>{this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null), position: null }],
			steps: 0
		};
	}

	handleClick(i) {
		let squares = this.state.history[this.state.steps].squares.slice();
		if (squares[i] !== null || playerWin(squares)) return;

		squares[i] = this.state.steps % 2 === 0 ? 'X' : 'O';
		this.setState(state => ({
			history: state.history.slice(0, state.steps + 1).concat([{
				squares: squares,
				position: [Math.floor(i / 3), i % 3]
			}]),
			steps: state.steps + 1
		}));
	}

	historyButton(steps) {
		return (
			<li key={steps}>
				<button
					onClick={() => this.setState({ steps: steps })}
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
		if (playerWin(log.squares))
			status = `Winner: ${player === 'O' ? 'X' : 'O'}`;
		else
			status = `Next player: ${player}`;

		const moves = this.state.history.map((item, steps) => this.historyButton(steps));

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={log.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
