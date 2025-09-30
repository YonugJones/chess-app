# 📝 Development Checklist

A running list of tasks to track progress on the Chess App project.

---

## Setup & Project Structure

1. [x] Initialize project with Vite + React + TypeScript
2. [x] Install and configure Tailwind CSS
3. [x] Set up base file structure
4. [x] Add Vitest + Testing Library setup
5. [x] Add chess icon assets
6. [x] Install react-router-dom + setup routing
7. [ ] Test routes

---

## Public-Facing Pages

1. [ ] Add a landing page with project title and description
2. [ ] Add a basic contact/info section (e.g., GitHub link, author name)
3. [ ] Ensure responsive layout with Tailwind

---

## Chess Engine

1. [ ] Define TypeScript types for pieces, squares, moves, and game state
2. [ ] Implement board initialization (standard chess starting position)
3. [ ] Add move generation for basic piece movement
4. [ ] Enforce legal moves (check, checkmate, stalemate rules)
5. [ ] Implement special rules:
   - [ ] Castling
   - [ ] En passant
   - [ ] Pawn promotion
6. [ ] Write unit tests for all engine logic

---

## User Interface

1. [ ] Render a responsive 8x8 chessboard with coordinates
2. [ ] Display pieces in starting position
3. [ ] Add interactivity: select piece → highlight legal moves → move piece
4. [ ] Show move history in algebraic notation
5. [ ] Add undo/redo functionality
6. [ ] Add UI for pawn promotion choices

---

## Testing

1. [ ] Write unit tests for chess engine functions
2. [ ] Write integration tests for move flow (UI + engine)
3. [ ] Add snapshot tests for UI components
4. [ ] Set up GitHub Actions for automated test runs

---

## Future Enhancements (post-MVP)

1. [ ] Implement AI opponent (basic minimax or stockfish integration)
2. [ ] Add multiplayer support (online play)
3. [ ] Support PGN import/export
4. [ ] Add puzzle/training mode
5. [ ] Polish UI with animations and themes

---
