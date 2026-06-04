# Tic Tac Toe

A browser-based Tic Tac Toe game built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe) JavaScript curriculum.

## Features

- Two-player game with a randomly selected starting player
- Win detection across all rows, columns, and the main diagonal
- Draw detection when the board is full
- Subheading that shows whose turn it is and updates on win or draw
- Subheading colour matches the active player's marker
- Cells tint when the game ends
- Reset button to restart at any time

## Concepts Practised

- Module pattern via IIFEs (`gameBoard`, `gameController`, `displayController`) to avoid global scope pollution and prevent re-instantiation
- Factory functions (`createPlayer`) to produce player objects with encapsulated data
- Separating game logic from display logic: `displayController` is the only module that touches the DOM
- Toggling CSS classes from JS to drive visual state (marker colours, game-over tint)
- Event delegation and `classList.toggle` for efficient DOM updates

## Tech

- HTML
- CSS (responsive grid sizing with `min()`, `clamp()` for fluid typography)
- Vanilla JavaScript (IIFEs, factory functions, DOM event handling)

## Project Page

[The Odin Project: Tic Tac Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe)
