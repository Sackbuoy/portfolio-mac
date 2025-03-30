#!/usr/bin/env bash
docker container rm -f mac
rm -rf result
nix build .#bun
nix build
docker load < result
docker run -p 3000:3000 -v ./public/config:/app/public/config -v ./public/images:/app/public/images --name mac ghcr.io/sackbuoy/portfolio:latest

