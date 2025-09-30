# ♟️ Chess App

A modern, fully type-safe Chess application built with **Vite + React + TypeScript** and styled using **Tailwind CSS**.

This project emphasizes clean architecture by separating the **chess engine logic** (move generation, rules enforcement, and game state management) from the **user interface** (interactive chessboard, move history, and controls). It is designed for clarity, testability, and future expansion into features such as AI opponents and online multiplayer.

---

## Features (MVP)

- Interactive chessboard with responsive design
- Enforced legal moves, including:
  - Castling
  - En passant
  - Pawn promotion
- Move history tracking in algebraic notation
- Undo/redo functionality

---

## Tech Stack

- **Frontend Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for UI  
  &nbsp;&nbsp;&nbsp;&nbsp;Unit tests for engine logic

---

## Goals

- Strong **TypeScript type safety** across engine and UI
- **Test-driven development (TDD)** for engine and rule enforcement
- Simple, intuitive UI that’s accessible and mobile-friendly
- Solid foundation for future features (AI, online play, puzzles)

---
