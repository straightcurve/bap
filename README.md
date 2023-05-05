# bap - bind access point

### description

I had a problem with my network adapter on Linux, it kept switching between 2 access points.

I got some commands from [here](https://www.archybold.com/blog/post/intermittent-connectionhigh-packet-loss-intel-wireless-driver-iwlwifi-ubuntu-linux-networkmanager).

I wanted to try out [pkg](https://www.npmjs.com/package/pkg) and [prompts](https://www.npmjs.com/package/prompts), which is why this is a NodeJS project.

### usage

```console
# build without installing
npm run build

# run
sudo node dist/index.js
```

```console
# build and install to ~/.local/bin/bap
npm run build:install:linux

# run
sudo bap
```
