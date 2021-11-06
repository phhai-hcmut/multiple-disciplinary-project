{ pkgs, ... }:
let
  androidenv = pkgs.androidenv.composeAndroidPackages {
    buildToolsVersions = [ "29.0.2" ];
    platformVersions = [ "29" ];
  };
  inherit (androidenv) androidsdk;
in
{
  devshell.packages = with pkgs; [ watchman nodejs-slim jdk8 androidsdk ];
  commands = [{ package = pkgs.pnpm; }];
  env = [
    { name = "ANDROID_SDK_ROOT"; value = androidsdk + "/libexec/android-sdk"; }
  ];
}
