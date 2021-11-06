{
  inputs.nixpkgs.url = "local";

  outputs = { self, nixpkgs }:
    nixpkgs.lib.flake.eachDefaultSystem (system: {
      devShell =
        nixpkgs.legacyPackages.${system}.devshell.mkShell ./devshell.nix;
    });
}
