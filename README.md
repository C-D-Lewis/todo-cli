# todo-cli

Simple todo list command line interface. Manages a list of todo items,
displaying them with date.

* [Install](#install)
* [Commands](#commands)


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

Delete an item by index in the list with `delete`:

```
todo delete 0
```
