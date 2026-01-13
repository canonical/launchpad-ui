#!/usr/bin/env sh
set -eu

repo=${JOB_MANAGER_REPO:-job-manager}
branch=${JOB_MANAGER_BRANCH:-main}

repo_url="https://git.launchpad.net/$repo"
ref="refs/heads/$branch"

sha=$(git ls-remote "$repo_url" "$ref" | cut -f1)

if [ -z "$sha" ]; then
	printf '%s\n' "Error: could not resolve $repo_url $ref" >&2
	exit 1
fi

mkdir -p .api-spec
output=.api-spec/job-manager.yaml
spec_url="$repo_url/plain/openapi/openapi.yaml?h=$sha"

{
	echo "# Source commit: $sha ($repo:$branch)"
	curl -fSL "$spec_url"
} > "$output"

echo "Saved $output @ $sha ($repo:$branch)"
