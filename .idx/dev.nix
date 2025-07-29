# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
  ];
  # Sets environment variables in the workspace
  env = {
    # Add your Google Cloud credentials here
    GOOGLE_CLOUD_PROJECT = "demo-app";
    # Uncomment and set if you have a service account key
    # GOOGLE_APPLICATION_CREDENTIALS = "/path/to/your/service-account.json";
  };
  # Disable Firebase emulators for now to avoid conflicts
  # services.firebase.emulators = {
  #   detect = true;
  #   projectId = "demo-app";
  #   services = ["auth" "firestore"];
  # };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          # Run Next.js directly instead of through Firebase
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          env = {
            NODE_ENV = "development";
            NEXT_PUBLIC_FIREBASE_PROJECT_ID = "demo-app";
          };
        };
      };
    };
  };
}