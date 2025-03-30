# Portfolio

## Shell
```
nix develop
```

## Bun Build
```
nix build .#bun
```

## Docker Image Build
```
nix build
```
## Notes
If running locally, config MUST be at ./public/config/configuration.json
and images MUST be at ./public/images (can be a symlink)

In a container, config must be mounted to /app/public/config/configuration.json
images must be in /app/public/images

