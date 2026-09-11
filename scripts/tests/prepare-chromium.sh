#!/usr/bin/env bash
set -euo pipefail

# Run in a disposable Ubuntu 24.04 amd64 container, as an unprivileged user.
if [[ "$(id -u)" == 0 ]]; then
  echo 'Run this test as a non-root user.' >&2
  exit 1
fi

scripts="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
prefix="$(mktemp -d)"
trap 'rm -rf "$prefix"' EXIT
status_before="$(sha256sum /var/lib/dpkg/status)"

bash "$scripts/prepare-chromium.sh" "$prefix"

# Exercise the actual APT invocation, not a mock of its locking behavior.
test "$status_before" = "$(sha256sum /var/lib/dpkg/status)"
test -f "$prefix/root/usr/lib/x86_64-linux-gnu/libnss3.so"
test -f "$prefix/root/usr/lib/x86_64-linux-gnu/libatk-1.0.so.0"
test -f "$prefix/root/usr/lib/x86_64-linux-gnu/libasound.so.2"
test -z "$(find "$prefix/root" -name libc.so.6 -print -quit)"
echo 'PASS: Chromium libraries extracted without root or system package changes.'
