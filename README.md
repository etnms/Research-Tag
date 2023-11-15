# Research Tag (desktop app)
## Goals of this project
Research tab is a simple desktop app aimed at giving researches, or anyone interested, a tool to tag answers from a survey. Research tag aims at being available offline, without any account creation, and small (6mo for the entire software). Besides, each project is auto-saved.

## Qualitative research
The main purpose of this software is to tag open-ended answers from a survey. Each answer appear separetely and can be tagged.
Right now, only .txt files are accepted as an input, but more options will be added in the future.
### This is not for corpus analysis or corpus tagging but only short answers.

## Why this project
Working with open-ended questions can be daunting, especially when having to deal with hundreds or thousands of them. There are not that many softwares out there that help researchers, even less free ones. Some softwares might sometimes seem like overkill. Research-tag aims at slving this issue by providing an easy and simple (as well as 100% free, open-sourced, account-less) way of doing that.

## How does the software work
Each file you open is opened as a project. You can create a taglist, with as many tags as you want, or open a different one in your project. You can view tags, the total count for each tag, as well as the total of tags, filter answers based on tags, and export your project in multipleformats (JSON, XML, CSV).

## A work in progress
At the moment, Research Tag is still a work in progress. There are a few features that I want to add to the software, such as an option to display tags in alphabetical order besides creation times, or being able to import .csv files.

## Installation
- Dev: Run the "npm run tauri dev" command
- Production: Run the "npm run tauri build" command

## Stack used:
- Tauri (rust)
- React + Typescript
- SCSS


