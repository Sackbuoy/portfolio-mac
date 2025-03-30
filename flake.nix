{
  description = "Artist Portfolio React App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

        # Import package.json to get name and version
        manifest = builtins.fromJSON (builtins.readFile ./package.json);

        bunBuild = pkgs.stdenv.mkDerivation {
          name = manifest.name;
          src = ./.;

          buildInputs = with pkgs; [
            bun
            nodejs
            docker
          ];

          installPhase = ''
            mkdir -p $out/bin
            cp -r . $out/

            cat > $out/bin/$name <<EOF
            #!${pkgs.bash}/bin/bash
            cd $out
            cp -r /app/public/images ./public
            cp -r /app/public/config ./public
            # bun $(readlink -f ./node_modules/.bin/react-scripts) build
            exec ${pkgs.bun}/bin/bun react-scripts start
            EOF
            chmod +x $out/bin/$name
          '';
        };

        dockerImage = pkgs.dockerTools.buildImage {
          name = "ghcr.io/sackbuoy/${manifest.name}";
          created = "now";
          config = {
            Cmd = ["${bunBuild}/bin/${manifest.name}"];
            ExposedPorts = {
              "3000/tcp" = {};
            };
            WorkingDir = "${bunBuild}";
            Volumes = {
              "/app/public/images" = {};
              "/app/public/config" = {};
            };
          };
          tag = "latest";

          extraCommands = ''
            mkdir -p tmp
          '';

          copyToRoot = pkgs.buildEnv {
            name = "image-root";
            paths = [pkgs.bash pkgs.coreutils];
            pathsToLink = ["/bin"];
          };
        };
      in {
        packages = {
          bun = bunBuild;
          docker = dockerImage;
          default = dockerImage;
        };

        # Development shell with necessary tools
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs
            docker
          ];
        };
      }
    );
}
