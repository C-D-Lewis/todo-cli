# todo-cli

<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/C-D-Lewis/todo-cli/master/assets/screenshot.png"> 
</p>

Simple todo list command line interface. Manages a list of todo items,
displaying them with date.

* [Install](#install)
* [Commands](#commands)
* [Configuration](#configuration)


## Install

Install with `npm`:

```
npm i -g @chris-lewis/todo-cli
```

Then run with `todo`.


## Commands

> Most commands have shorter versions available, such as 'a' in place of 'add'.

### Add a new item

Add a new item with `add`:

```
todo add Review login page PR
```

### List current items

List current items with `list`:

```
todo list
```

### Update an item

Update an item by index in the list with `update`:

```
todo update 0 Merge login page PR after QA
```

### Delete an item

Delete an item by index in the list with `done` to mark it as complete:

```
todo done 0
```

A history of the 10 most recently completed tasks will be shown on list.

## Configuration

### Overdue times

The display of colors for overdue items listed is configurable in days, after
which time they will be displayed with a red highlight.

```
todo config overdueDays $days
```
