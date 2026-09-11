#!/usr/bin/env bash
set -euo pipefail

# Workers Builds is Ubuntu 24.04 amd64, without sudo. Download signed Ubuntu
# packages and unpack their files into a private prefix; never install packages.
prefix="${1:?Usage: prepare-chromium.sh PREFIX}"
mkdir -p "$prefix/apt/lists/partial" "$prefix/apt/archives/partial" "$prefix/apt/log" "$prefix/apt/state" "$prefix/root"

cat > "$prefix/apt/config" <<EOF
Dir::State "$prefix/apt/state";
Dir::State::status "/var/lib/dpkg/status";
Dir::State::lists "$prefix/apt/lists";
Dir::Cache "$prefix/apt";
Dir::Cache::archives "$prefix/apt/archives";
Dir::Log "$prefix/apt/log";
#clear APT::Update::Post-Invoke;
#clear APT::Update::Post-Invoke-Success;
#clear DPkg::Post-Invoke;
EOF

# Keep Ubuntu's configured repositories and signature checks. All writable APT
# state is private; the host dpkg status is only read to resolve missing deps.
apt-get -c "$prefix/apt/config" -o APT::Update::Error-Mode=any update
apt-get -c "$prefix/apt/config" --download-only --reinstall --no-install-recommends --assume-yes install \
  libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64 \
  libcairo2 libcups2t64 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0t64 \
  libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 \
  libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 \
  libfontconfig1 libfreetype6 fonts-liberation

for package in "$prefix"/apt/archives/*.deb; do
  # Use the host's libc with its matching dynamic loader.
  case "$(basename "$package")" in libc6_*|libc-bin_*) continue ;; esac
  dpkg-deb --extract "$package" "$prefix/root"
done
