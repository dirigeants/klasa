# Contributing

**The issue tracker is only for issue reporting or proposals/suggestions. If you have a question, you can find us in our [Discord Server](https://discord.gg/FpEFSyY)**.

To contribute to this repository, feel free to create a new fork of the repository
submit a pull request. We highly suggest [ESLint](https://eslint.org/) to be installed
in your text editor or IDE of your choice to avoid fail builds from Travis.

1. Fork, clone, and select the **master** branch.
2. Create a new branch in your fork.
3. Commit your changes, and push them.
4. Submit a Pull Request [here](https://github.com/dirigeants/klasa/pulls)!

## Klasa Concept Guidelines

There are a number of guidelines considered when reviewing Pull Requests to be merged into core framework (further referred to as __core__). _This is by no means an exhaustive list, but here are some things to consider before/while submitting your ideas._

- Klasa should never change D.JS's default behavior in core. Klasa should only add to D.JS and be as consistent as possible with D.JS.
- Nothing in core should respond with embeds or be terribly "personalized". Instead everything should be an abstract working base that people can personalize themselves to their own needs.
- Everything in core should be generally useful for the majority of Klasa bots. (A reason why core doesn't implement any Music features.) Don't let that stop you if you've got a good concept though, as your idea still might be a great addition to [klasa-pieces](https://github.com/dirigeants/klasa-pieces) or as an optional addon package.
- As much of the framework as possible is meant to be customizable for any possible use-case, even if the use-case is niche. New features shouldn't break existing use-cases without a strong/well-thought-out reason (that doesn't conflict with any other guideline).
- Everything should be shard compliant. If something you are PRing would break when sharding, break other things from supporting sharding, or is incompatible with sharding; then you will need to think of a way to make it work with sharding in mind before it will be accepted/merged.
- Everything should be documented with [jsdocs](http://usejsdoc.org/), whether private or not. __If you see a mistake in the docs, please pr a fix.__
- Everything should follow OOP paradigms and generally rely on behavior over state where possible. This generally helps methods be predictable, keeps the codebase simple & understandable, reduces code duplication through abstraction, and leads to efficiency and therefore scalability.
- Everything should follow our ESLint rules as closely as possible, and should pass lint tests even if you must disable a rule for a single line.
