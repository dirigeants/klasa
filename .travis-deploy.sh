#!/bin/bash
# Based on https://github.com/discordjs/discord.js-site/blob/master/deploy/deploy.sh

set -e

if [ -n "$TRAVIS_TAG" -o "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo -e "Not building for a non branch push - building without deploying."
  npm run docs
  npm run newdocs
  exit 0
fi

echo -e "Building for a branch push - building and deploying."

REPO=$(git config remote.origin.url)
SHA=$(git rev-parse --verify HEAD)

if [ "$TRAVIS_BRANCH" == "master" ]; then
  TARGET_BRANCH="gh-pages"
  git clone $REPO dist -b $TARGET_BRANCH

  npm run docs

  rsync -vau docs/ dist/

  cd dist
  git add --all .
  git config user.name "Travis CI"
  git config user.email "${COMMIT_EMAIL}"
  git commit -m "Docs build: ${SHA}" || true
  git push "https://${GH_TOKEN}@${GH_REF}" $TARGET_BRANCH
  cd ..
fi

#new docs

TARGET_BRANCH="docs"
git clone $REPO out -b $TARGET_BRANCH

npm run newdocs

mv newdocs/docs.json out/$TRAVIS_BRANCH.json

cd out
git add --all .
git config user.name "Travis CI"
git config user.email "${COMMIT_EMAIL}"
git commit -m "Docs build: ${SHA}" || true
git push "https://${GH_TOKEN}@${GH_REF}" $TARGET_BRANCH
