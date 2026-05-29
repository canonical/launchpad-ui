# launchpad-ui charm

12-factor `go` charm for the Launchpad UI (SvelteKit + adapter-node). The app is
packaged as a rock (see `../rockcraft.yaml`) and deployed to Kubernetes via Juju.

Paths below assume you run from this `charm/` directory; the rock builds from the
repo root (`..`).

## Prerequisites

```bash
sudo snap install rockcraft --classic
sudo snap install charmcraft --classic
sudo snap install microk8s --classic
sudo snap install juju
sudo snap install lxd && sudo lxd init --auto   # rockcraft/charmcraft build backend
microk8s enable registry hostpath-storage       # registry on localhost:32000
microk8s enable metallb:10.64.140.43-10.64.140.49  # LB IPs for traefik (pick a free range)
```

## 1. Build the rock (repo root)

```bash
cd .. && rockcraft pack                          # -> launchpad-ui_0.0.1_<arch>.rock
```

`<arch>` matches the build host (`amd64` or `arm64`). Substitute it in the
commands below.

## Try the rock without a charm (Docker)

Smoke-test the image directly — no Juju/charm needed. Load the OCI archive into
the local Docker daemon and run it; Pebble starts the `go` service automatically.

```bash
# from repo root, after `rockcraft pack`
rockcraft.skopeo --insecure-policy copy \
  oci-archive:launchpad-ui_0.0.1_<arch>.rock \
  docker-daemon:launchpad-ui:0.0.1

docker run --rm -p 8080:8080 launchpad-ui:0.0.1
# -> http://localhost:8080
```

The image arch must match your Docker host. Pass app env directly with `-e`
(the `APP_` prefix is a charm concern, not the rock): e.g. `-e PORT=3000` then
map `-p 3000:3000`. Inspect the running service:

```bash
docker exec <container> pebble services        # go -> active
docker logs -f <container>
```

## 2. Push the rock to the local registry

```bash
rockcraft.skopeo --insecure-policy copy \
  oci-archive:launchpad-ui_0.0.1_<arch>.rock \
  docker://localhost:32000/launchpad-ui:0.0.1 --dest-tls-verify=false
cd charm
```

## 3. Build the charm

```bash
charmcraft pack                                  # -> launchpad-ui_<arch>.charm
```

## 4. Bootstrap Juju on MicroK8s and deploy

```bash
juju bootstrap microk8s lp
juju add-model launchpad-ui

juju deploy ./launchpad-ui_<arch>.charm launchpad-ui \
  --resource app-image=localhost:32000/launchpad-ui:0.0.1
```

> The image resource name comes from the go-framework extension. Confirm it with
> `charmcraft expand-extensions` (look under `resources:`) if `app-image` is rejected.

## 5. Expose via traefik-k8s

The go-framework charm has an `ingress` endpoint; traefik-k8s provides it.
traefik needs a LoadBalancer IP, so enable MetalLB first (see Prerequisites).

```bash
juju deploy traefik-k8s --trust
juju integrate launchpad-ui traefik-k8s

juju status --watch 1s
```

Get the proxied URL once both are `active/idle`:

```bash
juju run traefik-k8s/0 show-proxied-endpoints
# -> {"launchpad-ui": {"url": "http://<metallb-ip>/<model>-launchpad-ui"}}
curl http://<metallb-ip>/launchpad-ui-launchpad-ui   # path = <model>-<app>
```

App listens on `8080` inside the rock (Pebble service `go`). Config options set
via `juju config` reach the app **without** the `APP_` prefix (stripped in
`src/charm.py`); integration vars keep their names (`POSTGRESQL_DB_*`, etc.).

> traefik routes by path prefix `/<model>-<app>` by default. If you need
> subdomain or root routing, set `juju config traefik-k8s routing_mode=subdomain`
> and configure `external_hostname`.

## Rebuild loop

```bash
# from repo root
cd .. && rockcraft pack && rockcraft.skopeo --insecure-policy copy \
  oci-archive:launchpad-ui_0.0.1_<arch>.rock \
  docker://localhost:32000/launchpad-ui:0.0.1 --dest-tls-verify=false
juju refresh launchpad-ui \
  --path ./charm/launchpad-ui_<arch>.charm \
  --resource app-image=localhost:32000/launchpad-ui:0.0.1
```
