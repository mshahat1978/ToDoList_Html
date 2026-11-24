# To Do List

A small, dependency-free to-do list app built with plain HTML, CSS, and JavaScript.
Tasks are stored in the browser's `localStorage`, so no backend or database is required.

## Features

- Add new tasks from the input form
- Mark tasks as complete with a checkbox
- Edit a task inline by double-clicking its text
- Delete a single task with the `×` button
- Filter tasks by **All**, **Active**, or **Completed**
- Clear all completed tasks at once
- Live counter of remaining active tasks
- Empty-state message when there is nothing to show
- Responsive layout that works on desktop and mobile
- Accessible controls with ARIA labels

## Project structure

```
.
├── index.html    # Markup and app layout
├── styles.css    # Theme variables, layout, and responsive styles
└── main.js       # Task state, rendering, and localStorage persistence
```

## Getting started

No build step or installation is needed.

### Option 1: Open the file directly

Open `index.html` in any modern browser.

### Option 2: Serve it locally

Useful if you want to test from another device on the same network:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

On a phone connected to the same Wi-Fi network, open `http://<your-computer-ip>:8000/`.

## How it works

Tasks are kept in a single array in memory and mirrored to `localStorage` under the key
`todo-list:tasks`. Every mutation (add, toggle, edit, delete, clear completed) saves the
array and re-renders the list.

Data lives only in the current browser. Clearing site data or using a different browser
starts you with an empty list.

## Browser support

Works in all modern browsers (Chrome, Edge, Firefox, Safari) since it relies only on
standard DOM APIs, ES6+ syntax, and `localStorage`.
